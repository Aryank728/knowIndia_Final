const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware with CORS configured for production
app.use(cors({
  origin: ['http://localhost:3000', 'https://know-india-frontend.vercel.app'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

let db = null;
let isConnected = false;

// Connect to MySQL
async function connectToDatabase() {
  // If already connected, return the existing connection
  if (isConnected && db) {
    return db;
  }
  
  try {
    // Format connection string for TiDB Cloud
    const connectionString = `mysql://${encodeURIComponent(process.env.DB_USERNAME)}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
    
    // Create the connection
    db = await mysql.createConnection(connectionString + '?ssl={"rejectUnauthorized":true,"minVersion":"TLSv1.2"}');
    isConnected = true;
    
    console.log('Connected to TiDB Cloud database');
    
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
    console.error('Error connecting to database:', err);
    isConnected = false;
    throw err;
  }
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  connectToDatabase().catch(console.error);
}

// Feedback submission endpoint
app.post('/api/feedback', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const { name, email, rating, feedback, suggestions } = req.body;
    
    const query = `
      INSERT INTO Feedback (name, email, rating, liked_content, improvement_suggestions)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const [results] = await connection.execute(query, [name, email, rating, feedback, suggestions]);
    res.status(201).json({ message: 'Feedback submitted successfully', id: results.insertId });
  } catch (err) {
    console.error('Error submitting feedback:', err);
    res.status(500).json({ error: 'Error submitting feedback' });
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