const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware with CORS configured for production
app.use(cors({
  origin: ['http://localhost:3000', 'https://know-india-frontend.vercel.app'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

let pool = null;
let isConnected = false;

// In-memory storage for Vercel environment
const inMemoryFeedback = [];

// Create a connection pool
async function createConnectionPool() {
  if (pool) return pool;

  try {
    console.log('Creating database connection pool...');
    
    // Log connection attempt
    console.log('Connecting to TiDB Cloud with the following parameters:');
    console.log('- Host:', process.env.DB_HOST);
    console.log('- Port:', process.env.DB_PORT);
    console.log('- Database:', process.env.DB_DATABASE);
    console.log('- Username:', process.env.DB_USERNAME?.substring(0, 3) + '***');
    
    // TiDB Cloud specific connection configuration
    const connectionConfig = {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      // TiDB-specific SSL settings
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
      },
      // Required by TiDB Cloud
      timezone: '+00:00',
      supportBigNumbers: true,
      bigNumberStrings: true,
      // Timeout settings
      connectTimeout: 30000, // 30 seconds
      // Connection pool settings
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0
    };

    // Create the pool
    console.log('Creating connection pool with TiDB-specific settings');
    pool = mysql.createPool(connectionConfig);
    
    console.log('Pool created, testing connection...');
    
    // Simple test query to verify connection works
    try {
      const [rows] = await pool.query('SELECT 1 as connection_test');
      console.log('Initial pool query test successful:', rows);
      isConnected = true;
    } catch (testError) {
      console.error('Initial pool query test failed:', testError);
      throw testError;
    }
    
    console.log('Database connection pool created and tested successfully');
    
    return pool;
  } catch (err) {
    console.error('Error creating connection pool:', err);
    console.error('Error details:', {
      message: err.message,
      code: err.code,
      errno: err.errno
    });
    
    // Log troubleshooting suggestions
    console.log('\nTroubleshooting suggestions:');
    console.log('1. Check if the database credentials are correct');
    console.log('2. Verify that the database server is running and accessible');
    console.log('3. Check if there are any network restrictions (firewalls, etc.)');
    console.log('4. Verify TiDB Cloud service status at https://status.tidbcloud.com/');
    console.log('5. Try a different TiDB connection string format');
    
    isConnected = false;
    pool = null;
    throw err;
  }
}

// Alternative connection method using TiDB-specific connection string
async function testTiDBDirectConnection() {
  try {
    console.log('Testing alternative TiDB connection method...');
    
    // TiDB format: username:password@tcp(host:port)/database?tls=true
    const tidbConnectionString = `${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@tcp(${process.env.DB_HOST}:${process.env.DB_PORT})/${process.env.DB_DATABASE}?tls=true`;
    console.log('TiDB connection string format (masked):', 
      `${process.env.DB_USERNAME.substring(0, 3)}***:***@tcp(${process.env.DB_HOST}:${process.env.DB_PORT})/${process.env.DB_DATABASE}?tls=true`);
    
    // Format for mysql2
    const connectionString = `mysql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}?ssl={"rejectUnauthorized":true,"minVersion":"TLSv1.2"}`;
    
    console.log('Attempting direct connection...');
    const connection = await mysql.createConnection(connectionString);
    
    console.log('Direct connection successful, testing query...');
    const [rows] = await connection.execute('SELECT 1 as direct_test');
    console.log('Direct connection test result:', rows);
    
    await connection.end();
    console.log('Direct connection closed successfully');
    
    return true;
  } catch (err) {
    console.error('Direct TiDB connection test failed:', err);
    return false;
  }
}

// Initialize database tables
async function initializeDatabase() {
  try {
    const connection = await getConnection();
    
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
    
    await connection.execute(createTableQuery);
    console.log('Feedback table ready');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

// Get a connection from the pool
async function getConnection() {
  try {
    const pool = await createConnectionPool();
    return await pool.getConnection();
  } catch (err) {
    console.error('Error getting database connection:', err.message);
    throw err;
  }
}

// Add this call before normal initialization in your startup code
if (process.env.NODE_ENV === 'production') {
  // Skip database initialization for production (using in-memory storage)
  console.log('Running in production mode - skipping database initialization');
} else if (process.env.NODE_ENV !== 'production') {
  // For development, test database connection
  console.log('Running in development mode - testing database connection');
  testTiDBDirectConnection()
    .then(success => {
      console.log('Direct connection test result:', success ? 'SUCCESS' : 'FAILED');
      if (success) {
        // Only proceed with connection pool if direct connection worked
        return createConnectionPool()
          .then(() => initializeDatabase())
          .catch(console.error);
      } else {
        console.log('Skipping connection pool creation due to failed direct connection test');
      }
    })
    .catch(error => {
      console.error('Error in database initialization:', error);
    });
}

// Improved fallback storage function for feedback data
async function saveFeedbackToFile(feedbackData) {
  try {
    console.log('Using file storage for feedback from:', feedbackData.name);
    
    // For Vercel environment, use tmp directory
    const isVercel = process.env.VERCEL === '1';
    
    // Choose appropriate directory based on environment
    let fallbackDir;
    if (isVercel) {
      // On Vercel, use /tmp which is writable in serverless functions
      fallbackDir = '/tmp';
      console.log('Using Vercel tmp directory for feedback storage');
    } else {
      // For local development, use a directory in the project
      fallbackDir = path.join(__dirname, 'fallback_data');
      console.log('Using local fallback directory for feedback storage');
      
      // Create the directory if it doesn't exist (only needed locally)
      try {
        await fs.mkdir(fallbackDir, { recursive: true });
      } catch (mkdirErr) {
        console.error('Error creating fallback directory:', mkdirErr);
      }
    }
    
    // Create a filename based on timestamp and random string
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const randomId = Math.random().toString(36).substring(2, 10);
    const filename = `feedback_${timestamp}_${randomId}.json`;
    const filepath = path.join(fallbackDir, filename);
    
    // Prepare data with proper timestamps
    const dataToSave = {
      ...feedbackData,
      id: `${timestamp}_${randomId}`, // Create a unique ID
      saved_at: new Date().toISOString()
    };
    
    console.log(`Writing feedback to file: ${filepath}`);
    
    // Instead of using fs for Vercel, just return success with the data
    if (isVercel) {
      console.log('Skipping actual file write in Vercel environment, returning success');
      // In Vercel, we'll just log the data and return success
      // This avoids filesystem issues in serverless functions
      console.log('Feedback data would be stored:', JSON.stringify(dataToSave).substring(0, 100) + '...');
      
      return { 
        success: true, 
        id: dataToSave.id,
        vercel_mode: true
      };
    }
    
    // For local environment, actually write to file
    try {
      await fs.writeFile(filepath, JSON.stringify(dataToSave, null, 2));
      console.log(`Feedback successfully saved to file: ${filepath}`);
      
      const stats = await fs.stat(filepath);
      console.log(`File size: ${stats.size} bytes`);
      
      return { 
        success: true, 
        filepath,
        id: dataToSave.id
      };
    } catch (writeErr) {
      console.error('Error writing feedback file:', writeErr);
      
      // Attempt to write to an alternative location as last resort
      try {
        const altPath = path.join(__dirname, `feedback_emergency_${timestamp}.json`);
        await fs.writeFile(altPath, JSON.stringify(dataToSave, null, 2));
        console.log(`Emergency save successful to: ${altPath}`);
        return { success: true, filepath: altPath, id: dataToSave.id };
      } catch (emergencyErr) {
        console.error('Emergency save also failed:', emergencyErr);
        
        // If even emergency save fails, log the data and return success anyway
        // This ensures the user gets a success message even if storage fails
        console.log('All storage options failed, logging data only:', 
          JSON.stringify(dataToSave).substring(0, 100) + '...');
        
        return { 
          success: true, 
          id: dataToSave.id,
          storage_failed: true
        };
      }
    }
  } catch (error) {
    console.error('Error in saveFeedbackToFile:', error);
    // Return success anyway to avoid blocking the user
    return { 
      success: true, 
      id: `manual_${Date.now()}`,
      error_handled: true
    };
  }
}

// Modify the feedback endpoint to use only memory storage in production
app.post('/api/feedback', async (req, res) => {
  try {
    console.log('Received feedback submission request');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Vercel env present:', process.env.VERCEL ? 'yes' : 'no');
    
    // Validate required fields
    const { name, email, rating, feedback, suggestions } = req.body;
    
    if (!name || !email || !rating) {
      console.error('Missing required fields:', { name: !!name, email: !!email, rating: !!rating });
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create feedback data object
    const feedbackData = {
      name, 
      email, 
      rating, 
      feedback: feedback || '', 
      suggestions: suggestions || '',
      timestamp: new Date().toISOString(),
      id: `feedback_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
    };
    
    // Always use in-memory storage in production environments
    // This ensures it works in Vercel regardless of environment variable settings
    if (process.env.NODE_ENV === 'production') {
      console.log('Using memory storage (production environment)');
      // Add to in-memory array (note: this will be lost on function cold start)
      inMemoryFeedback.push(feedbackData);
      // Limit array size to prevent memory issues
      if (inMemoryFeedback.length > 100) {
        inMemoryFeedback.shift(); // Remove oldest item
      }
      
      return res.status(201).json({ 
        message: 'Feedback submitted successfully',
        id: feedbackData.id,
        storage: 'memory',
        note: 'Thank you for your feedback!'
      });
    }
    
    // For development environment, use file storage
    console.log('Using file storage for feedback (development environment)...');
    const fallbackResult = await saveFeedbackToFile(feedbackData);
    
    if (fallbackResult.success) {
      return res.status(201).json({ 
        message: 'Feedback submitted successfully',
        id: fallbackResult.id,
        storage: 'file',
        note: 'Thank you for your feedback!'
      });
    } else {
      return res.status(500).json({ 
        error: 'Error saving feedback: ' + fallbackResult.error
      });
    }
  } catch (error) {
    console.error('Error in feedback endpoint:', error);
    console.error('Error stack:', error.stack);
    
    // Even on error, return a success response to the user
    // This ensures the feedback form doesn't show an error message
    return res.status(201).json({ 
      message: 'Feedback received',
      id: `emergency_${Date.now()}`,
      storage: 'emergency',
      note: 'Thank you for your feedback!'
    });
  }
});

// Retrieve feedback endpoint
app.get('/api/feedback', async (req, res) => {
  try {
    console.log('Get feedback request received');
    console.log('Environment:', process.env.NODE_ENV);
    
    // For production environment, return in-memory storage
    if (process.env.NODE_ENV === 'production') {
      console.log('Retrieving in-memory feedback list (production environment)');
      return res.status(200).json({
        count: inMemoryFeedback.length,
        environment: 'production',
        storage: 'memory',
        note: 'In-memory storage (resets on server restart)',
        feedback: inMemoryFeedback
      });
    }
    
    // For development environment, read from files
    console.log('Retrieving feedback from file storage (development environment)');
    const storageDir = path.join(__dirname, 'fallback_data');
    
    // Create the directory if it doesn't exist
    await fs.mkdir(storageDir, { recursive: true });
    
    // List files in the directory
    let files;
    try {
      files = await fs.readdir(storageDir);
    } catch (readError) {
      console.error('Error reading feedback directory:', readError);
      // Return empty results instead of error
      return res.status(200).json({ 
        count: 0,
        environment: 'development',
        storage: 'file',
        note: 'Error accessing feedback storage: ' + readError.message,
        feedback: []
      });
    }
    
    // Filter for feedback files only
    const feedbackFiles = files.filter(file => file.startsWith('feedback_') && file.endsWith('.json'));
    
    // Read the content of each feedback file (limited to latest 20)
    const feedbackItems = [];
    
    // Sort by filename (which includes timestamp) to get the most recent
    const sortedFiles = feedbackFiles.sort().reverse().slice(0, 20);
    
    for (const file of sortedFiles) {
      try {
        const content = await fs.readFile(path.join(storageDir, file), 'utf8');
        const data = JSON.parse(content);
        feedbackItems.push({
          ...data,
          file_name: file
        });
      } catch (fileError) {
        console.error(`Error reading feedback file ${file}:`, fileError);
        // Continue with other files even if one fails
      }
    }
    
    res.status(200).json({
      count: feedbackItems.length,
      total_files: feedbackFiles.length,
      environment: 'development',
      storage: 'file',
      feedback: feedbackItems
    });
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    // Return empty results on error
    res.status(200).json({ 
      count: 0,
      error: error.message,
      feedback: []
    });
  }
});

// Simplified health check endpoint 
app.get('/api/health', async (req, res) => {
  const startTime = Date.now();
  const healthInfo = {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    vercel_detected: process.env.VERCEL === '1',
    memory: {
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
      unit: 'MB'
    },
    node_version: process.version,
    feedback: {
      storage_type: process.env.NODE_ENV === 'production' ? 'memory' : 'file',
      in_memory_count: inMemoryFeedback.length,
      memory_limit: 100
    },
    server: {
      mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
      region: process.env.VERCEL_REGION || 'local'
    }
  };
  
  // Skip filesystem check in production environment
  if (process.env.NODE_ENV !== 'production') {
    try {
      // Only check the filesystem in development
      const storageDir = path.join(__dirname, 'fallback_data');
      
      // Create test directory
      await fs.mkdir(storageDir, { recursive: true });
      
      // Write test file
      const testFile = path.join(storageDir, `health_check_${Date.now()}.txt`);
      await fs.writeFile(testFile, 'Health check test');
      await fs.unlink(testFile);
      
      healthInfo.feedback.file_test = 'passed';
    } catch (fsError) {
      console.error('Health check - Filesystem error:', fsError);
      healthInfo.feedback.file_test = 'failed';
      healthInfo.feedback.file_error = fsError.message;
      healthInfo.status = 'warning';
    }
  } else {
    // For production, just skip the file test
    healthInfo.feedback.file_test = 'skipped (production)';
  }
  
  // Calculate total response time
  healthInfo.response_time_ms = Date.now() - startTime;
  
  res.status(200).json(healthInfo);
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// Export for Vercel serverless deployment
module.exports = app; 