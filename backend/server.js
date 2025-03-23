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
    
    // For development and troubleshooting, try different connection methods
    const connectionMethods = [
      // Method 1: Simple connection without SSL (fastest for testing)
      async () => {
        console.log('Trying connection without SSL...');
        return mysql.createConnection({
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT, 10),
          user: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          ssl: false,
          connectTimeout: 20000
        });
      },
      
      // Method 2: Connection with relaxed SSL settings
      async () => {
        console.log('Trying connection with relaxed SSL...');
        return mysql.createConnection({
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT, 10),
          user: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          ssl: { rejectUnauthorized: false },
          connectTimeout: 20000
        });
      },
      
      // Method 3: Full certificate-based connection
      async () => {
        console.log('Trying connection with full SSL certificate validation...');
        
        // Try to find a certificate
        let ca = null;
        try {
          // Check for certificate in multiple locations
          const certLocations = [
            path.join(__dirname, 'certs', 'isrgrootx1.pem'),
            path.join(__dirname, 'isrgrootx1.pem'),
            '/var/task/certs/isrgrootx1.pem',
            '/var/task/isrgrootx1.pem'
          ];
          
          for (const certPath of certLocations) {
            if (fs.existsSync(certPath)) {
              ca = fs.readFileSync(certPath);
              console.log(`Using certificate from: ${certPath}`);
              break;
            }
          }
          
          // If no file found, try environment variable
          if (!ca && process.env.DB_CA_CERT) {
            ca = Buffer.from(process.env.DB_CA_CERT, 'base64');
            console.log('Using certificate from environment variable');
          }
        } catch (certError) {
          console.error('Error loading certificate:', certError.message);
        }
        
        return mysql.createConnection({
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT, 10),
          user: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          ssl: ca ? { ca, rejectUnauthorized: true } : { rejectUnauthorized: true },
          connectTimeout: 20000
        });
      }
    ];
    
    // Try each connection method in sequence
    let lastError = null;
    
    for (const method of connectionMethods) {
      try {
        db = await method();
        console.log('Connection successful!');
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
        console.error('Connection attempt failed:', err.message);
        lastError = err;
        // Continue to next method
      }
    }
    
    // If we get here, all methods failed
    throw lastError || new Error('All connection methods failed');
    
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

// Debug endpoint that doesn't require database connection
app.get('/api/debug', (req, res) => {
  const debug = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    nodejs_version: process.version,
    env_vars: {
      db_host: process.env.DB_HOST ? 'set' : 'not set',
      db_port: process.env.DB_PORT ? 'set' : 'not set',
      db_username: process.env.DB_USERNAME ? 'set' : 'not set',
      db_password: process.env.DB_PASSWORD ? 'set' : 'not set',
      db_database: process.env.DB_DATABASE ? 'set' : 'not set',
      db_ssl: process.env.DB_SSL ? 'set' : 'not set',
      db_ca_cert: process.env.DB_CA_CERT ? 'set' : 'not set'
    },
    certificate_search: {
      certs_dir_exists: fs.existsSync(path.join(__dirname, 'certs')),
      root_cert_exists: fs.existsSync(path.join(__dirname, 'isrgrootx1.pem')),
      certs_dir_cert_exists: fs.existsSync(path.join(__dirname, 'certs', 'isrgrootx1.pem'))
    },
    headers: req.headers,
    dir_contents: fs.existsSync(__dirname) ? fs.readdirSync(__dirname) : 'unavailable'
  };
  
  res.json(debug);
});

// Add a mock feedback endpoint that doesn't require database connection
app.post('/api/feedback-mock', (req, res) => {
  try {
    console.log('Received mock feedback submission:', req.body);
    
    // Validate required fields
    const { name, email, rating, feedback, suggestions } = req.body;
    
    if (!name || !email || !rating) {
      console.error('Missing required fields:', { name: !!name, email: !!email, rating: !!rating });
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Generate a fake ID
    const fakeId = Math.floor(Math.random() * 10000);
    
    // Store in file system as fallback
    try {
      const feedbackData = {
        id: fakeId,
        name,
        email,
        rating,
        feedback,
        suggestions,
        timestamp: new Date().toISOString()
      };
      
      const feedbackDir = path.join(__dirname, 'feedback-data');
      if (!fs.existsSync(feedbackDir)) {
        fs.mkdirSync(feedbackDir, { recursive: true });
      }
      
      fs.writeFileSync(
        path.join(feedbackDir, `feedback-${fakeId}.json`),
        JSON.stringify(feedbackData, null, 2)
      );
      
      console.log(`Saved mock feedback to file system with ID: ${fakeId}`);
    } catch (fileErr) {
      console.error('Error saving mock feedback to file:', fileErr);
    }
    
    // Return success response
    res.status(201).json({ 
      message: 'Feedback submitted successfully (MOCK)',
      id: fakeId,
      note: 'This is a mock submission that doesn\'t use the database'
    });
  } catch (err) {
    console.error('Error in mock feedback submission:', err.message);
    res.status(500).json({ error: 'Error in mock feedback: ' + err.message });
  }
});

// Add a GET endpoint to retrieve all mock feedback submissions
app.get('/api/feedback-mock', (req, res) => {
  try {
    const feedbackDir = path.join(__dirname, 'feedback-data');
    
    // If directory doesn't exist, return empty array
    if (!fs.existsSync(feedbackDir)) {
      return res.status(200).json({ 
        feedbacks: [],
        message: 'No feedback data found'
      });
    }
    
    // Read all files in the directory
    const files = fs.readdirSync(feedbackDir).filter(file => file.startsWith('feedback-') && file.endsWith('.json'));
    const feedbacks = [];
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(feedbackDir, file), 'utf8');
        const data = JSON.parse(content);
        feedbacks.push(data);
      } catch (err) {
        console.error(`Error reading feedback file ${file}:`, err);
      }
    }
    
    // Sort by timestamp descending (newest first)
    feedbacks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.status(200).json({ 
      feedbacks, 
      count: feedbacks.length,
      message: 'Mock feedback data retrieved successfully'
    });
  } catch (err) {
    console.error('Error retrieving mock feedback data:', err);
    res.status(500).json({ error: 'Error retrieving mock feedback: ' + err.message });
  }
});

// Add a GET endpoint to retrieve a specific mock feedback by ID
app.get('/api/feedback-mock/:id', (req, res) => {
  try {
    const feedbackId = req.params.id;
    const feedbackDir = path.join(__dirname, 'feedback-data');
    const filePath = path.join(feedbackDir, `feedback-${feedbackId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        error: `No feedback found with ID: ${feedbackId}`
      });
    }
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      
      res.status(200).json({ 
        feedback: data,
        message: 'Mock feedback retrieved successfully'
      });
    } catch (err) {
      console.error(`Error reading feedback file for ID ${feedbackId}:`, err);
      res.status(500).json({ error: `Error reading feedback data: ${err.message}` });
    }
  } catch (err) {
    console.error('Error retrieving specific mock feedback:', err);
    res.status(500).json({ error: 'Error retrieving specific mock feedback: ' + err.message });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// Export for Vercel serverless deployment
module.exports = app; 