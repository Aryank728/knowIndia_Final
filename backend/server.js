const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware with CORS configured for production
app.use(cors({
  origin: ['http://localhost:3000', 'https://know-india-frontend.vercel.app', 'https://knowindia.vercel.app'],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Add explicit handling for preflight requests
app.options('*', cors());

let db = null;
let isConnected = false;

// Connect to MySQL - specialized for Vercel deployment
async function connectToDatabase() {
  // If already connected, return the existing connection
  if (isConnected && db) {
    return db;
  }
  
  try {
    console.log('Attempting to connect to database...');
    
    // For TiDB Cloud Serverless, we'll try multiple connection approaches
    // in order of preference
    
    // 1. Look for PEM file in various locations
    let ca = null;
    const certLocations = [
      path.join(__dirname, 'certs', 'isrgrootx1.pem'),    // Certs directory (preferred)
      path.join(__dirname, 'isrgrootx1.pem'),             // Local development
      '/var/task/certs/isrgrootx1.pem',                   // Vercel with certs dir
      '/var/task/isrgrootx1.pem',                         // Vercel
      '/var/task/backend/isrgrootx1.pem',                 // Vercel with subfolder
      '/var/task/backend/certs/isrgrootx1.pem',           // Vercel with backend/certs
      path.join(process.cwd(), 'certs', 'isrgrootx1.pem'), // Alternative with certs dir
      path.join(process.cwd(), 'isrgrootx1.pem'),          // Alternative local path
      path.join(process.cwd(), 'backend/isrgrootx1.pem'),  // Alternative subfolder
      path.join(process.cwd(), 'backend/certs/isrgrootx1.pem') // Alternative with backend/certs
    ];
    
    for (const certPath of certLocations) {
      if (fs.existsSync(certPath)) {
        try {
          ca = fs.readFileSync(certPath);
          console.log('Successfully loaded SSL certificate from:', certPath);
          break;
        } catch (certError) {
          console.error(`Error reading certificate from ${certPath}:`, certError.message);
        }
      }
    }
    
    // 2. If no PEM file found, try to use certificate from environment variable
    if (!ca && process.env.DB_CA_CERT) {
      try {
        console.log('Using certificate from DB_CA_CERT environment variable');
        ca = Buffer.from(process.env.DB_CA_CERT, 'base64');
      } catch (envCertError) {
        console.error('Error using certificate from environment variable:', envCertError.message);
      }
    }
    
    // 3. If still no certificate, try to connect without specifying CA
    // TiDB Cloud may work with system CA certificates
    
    // Connection configuration
    const sslConfig = process.env.DB_SSL === 'true' ? {
      // Start with the most secure configuration
      rejectUnauthorized: true,
      // Only add CA if we found a certificate
      ...(ca ? { ca } : {})
    } : false;
    
    const connectionConfig = {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      ssl: sslConfig,
      // Additional options to help with connection stability
      connectTimeout: 20000, // 20 seconds
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10,
      idleTimeout: 60000,
      queueLimit: 0
    };
    
    console.log('Connecting with config:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      ssl: process.env.DB_SSL === 'true' ? 
        `enabled with ${ca ? 'certificate' : 'system certs'}` : 
        'disabled'
    });
    
    try {
      // Try to connect with the current configuration
      db = await mysql.createConnection(connectionConfig);
      console.log('Connected successfully to database with primary method');
    } catch (primaryConnErr) {
      console.error('Primary connection method failed:', primaryConnErr.message);
      
      // If that fails, try a more permissive SSL configuration
      if (process.env.DB_SSL === 'true') {
        console.log('Attempting alternative SSL connection method...');
        const altConfig = {
          ...connectionConfig,
          ssl: {
            // Sometimes less strict settings are needed
            rejectUnauthorized: false
          }
        };
        
        try {
          db = await mysql.createConnection(altConfig);
          console.log('Connected successfully to database with alternative method');
        } catch (altConnErr) {
          console.error('Alternative connection method failed:', altConnErr.message);
          
          // Final attempt - try without SSL
          console.log('Making final attempt without SSL...');
          try {
            const noSslConfig = {
              ...connectionConfig,
              ssl: false
            };
            db = await mysql.createConnection(noSslConfig);
            console.log('Connected successfully to database without SSL');
          } catch (noSslErr) {
            console.error('All connection attempts failed. Last error:', noSslErr.message);
            throw noSslErr;
          }
        }
      } else {
        throw primaryConnErr; // Re-throw to be caught by outer catch
      }
    }
    
    isConnected = true;
    
    // Create feedback table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Feedback (
        feedback_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        liked_content TEXT,
        improvement_suggestions TEXT,
        place_id INT,
        status ENUM('new', 'read', 'responded') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await db.execute(createTableQuery);
    console.log('Feedback table ready');
    
    return db;
  } catch (err) {
    console.error('Error connecting to database:', err.message);
    console.error('Error stack:', err.stack);
    console.error('Connection details:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME ? 'provided' : 'missing'
    });
    isConnected = false;
    throw err;
  }
}

// Health check endpoint - no database connection needed
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    db_connection: isConnected ? 'connected' : 'not connected'
  });
});

// Feedback submission endpoint
app.post('/api/feedback', async (req, res) => {
  try {
    console.log('Received feedback submission request');
    
    // Validate required fields
    const { name, email, rating, feedback, suggestions } = req.body;
    
    if (!name || !email || !rating) {
      console.error('Missing required fields:', { name: !!name, email: !!email, rating: !!rating });
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Connect to database
    console.log('Connecting to database...');
    const connection = await connectToDatabase();
    console.log('Database connection successful');
    
    const query = `
      INSERT INTO Feedback (name, email, rating, liked_content, improvement_suggestions)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    console.log('Executing database query...');
    const [results] = await connection.execute(query, [name, email, rating, feedback, suggestions]);
    console.log('Feedback stored successfully, ID:', results.insertId);
    
    // Return success response
    res.status(201).json({ message: 'Feedback submitted successfully', id: results.insertId });
  } catch (err) {
    console.error('Error submitting feedback:', err.message);
    console.error('Error stack:', err.stack);
    
    res.status(500).json({ error: 'Error submitting feedback: ' + err.message });
  }
});

// Database test endpoint
app.get('/api/db-test', async (req, res) => {
  try {
    console.log('Testing database connection...');
    const connection = await connectToDatabase();
    
    // Run a test query
    const [results] = await connection.execute('SELECT 1 as connected');
    
    console.log('Database test query results:', results);
    
    res.status(200).json({
      status: 'ok',
      message: 'Database connection successful',
      connected: true,
      test_result: results
    });
  } catch (err) {
    console.error('Database test error:', err.message);
    console.error('Error stack:', err.stack);
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to connect to database',
      error: err.message
    });
  }
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is working!' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// Export for Vercel serverless deployment
module.exports = app; 