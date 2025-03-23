# Test Endpoints Documentation

This document describes the test endpoints available in the application for testing and debugging without requiring a database connection.

## Debug Endpoint

**Endpoint:** `GET /api/debug`

Returns debugging information about the server environment, including:
- Timestamp and environment
- Node.js version
- Status of environment variables
- File system checks for certificates
- Request headers
- Directory contents

Example response:
```json
{
  "timestamp": "2023-06-20T12:34:56.789Z",
  "environment": "development",
  "nodeVersion": "v16.14.0",
  "envVariables": {
    "TIDB_HOST": "exists",
    "TIDB_PORT": "exists",
    "TIDB_USER": "exists",
    "TIDB_PASSWORD": "exists",
    "TIDB_DATABASE": "exists"
  },
  "fileChecks": {
    "certsDirectoryExists": true,
    "certificateExists": true
  },
  "headers": { ... },
  "directoryContents": [ ... ]
}
```

## Mock Feedback Endpoints

These endpoints provide a way to test the feedback functionality without requiring a database connection. All data is stored in JSON files on the server's file system.

### Submit Mock Feedback

**Endpoint:** `POST /api/feedback-mock`

**Request Body:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "rating": 5,
  "feedback": "This is a test feedback",
  "suggestions": "This is a test suggestion"
}
```

**Response:**
```json
{
  "message": "Feedback submitted successfully (MOCK)",
  "id": 1234,
  "note": "This is a mock submission that doesn't use the database"
}
```

### Get All Mock Feedbacks

**Endpoint:** `GET /api/feedback-mock`

**Response:**
```json
{
  "feedbacks": [
    {
      "id": 1234,
      "name": "Test User",
      "email": "test@example.com",
      "rating": 5,
      "feedback": "This is a test feedback",
      "suggestions": "This is a test suggestion",
      "timestamp": "2023-06-20T12:34:56.789Z"
    }
  ],
  "count": 1,
  "message": "Mock feedback data retrieved successfully"
}
```

### Get Specific Mock Feedback

**Endpoint:** `GET /api/feedback-mock/:id`

**Response:**
```json
{
  "feedback": {
    "id": 1234,
    "name": "Test User",
    "email": "test@example.com",
    "rating": 5,
    "feedback": "This is a test feedback",
    "suggestions": "This is a test suggestion",
    "timestamp": "2023-06-20T12:34:56.789Z"
  },
  "message": "Mock feedback retrieved successfully"
}
```

## Usage

These endpoints are particularly useful for:
- Testing the application when the database is unavailable
- Testing the frontend without modifying the actual database
- Debugging server deployment issues
- Verifying that the server is running correctly

All mock feedback data is stored in the `backend/feedback-data` directory as JSON files. 