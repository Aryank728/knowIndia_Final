const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

let db;

// Connect to MySQL
async function connectToDatabase() {
  try {
    // Format connection string for TiDB Cloud
    const connectionString = `mysql://${encodeURIComponent(process.env.DB_USERNAME)}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
    
    // Create the connection
    db = await mysql.createConnection(connectionString + '?ssl={"rejectUnauthorized":true,"minVersion":"TLSv1.2"}');
    
    console.log('Connected to TiDB Cloud database');
    
    // Create feedback table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS feedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        rating INT NOT NULL,
        feedback TEXT NOT NULL,
        suggestions TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await db.execute(createTableQuery);
    console.log('Feedback table ready');
  } catch (err) {
    console.error('Error connecting to database:', err);
  }
}

connectToDatabase();

// Feedback submission endpoint
app.post('/api/feedback', async (req, res) => {
  const { name, email, rating, feedback, suggestions } = req.body;
  
  const query = `
    INSERT INTO Feedback (name, email, rating, liked_content, improvement_suggestions)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  try {
    const [results] = await db.execute(query, [name, email, rating, feedback, suggestions]);
    res.status(201).json({ message: 'Feedback submitted successfully', id: results.insertId });
  } catch (err) {
    console.error('Error submitting feedback:', err);
    res.status(500).json({ error: 'Error submitting feedback' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 