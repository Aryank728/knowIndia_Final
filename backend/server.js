const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
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
    
    // For Vercel serverless functions, create a new connection each time
    // to avoid connection timeouts due to serverless cold starts
    const connectionConfig = {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      // Use a simpler SSL configuration for Vercel
      ssl: process.env.DB_SSL ? {} : false
    };
    
    console.log('Connecting with config object...');
    db = await mysql.createConnection(connectionConfig);
    console.log('Connected successfully to database');
    
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