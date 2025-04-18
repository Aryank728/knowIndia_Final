# 🏛️ Know India: A Journey Through Culture & Heritage

<div align="center">
  
### 🌟 Discover the Magic of India 🌟
_A comprehensive platform to explore India's rich heritage, culture, and diversity_

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB.svg)](https://reactjs.org/)
[![Backend: Express.js](https://img.shields.io/badge/Backend-Express.js-000000.svg)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## 🚀 Project Overview

Welcome to the Know India monorepo! This project is a labor of love that brings together the beauty and diversity of India through an interactive web platform.

### 📁 Project Structure

```
📦 know-india
 ┣ 🎨 frontend/     React.js magic happens here
 ┗ ⚙️ backend/      Express.js powering our APIs
```

## 🔌 API Wonderland

Our backend provides a suite of powerful APIs to make your experience seamless!

### ✨ Production Endpoints

| Endpoint | Description | Method |
|----------|-------------|--------|
| 📝 `/api/feedback` | Submit your thoughts | `POST` |
| 📋 `/api/feedback` | View all feedback* | `GET` |
| 🔍 `/api/feedback/:id` | Find specific feedback* | `GET` |

_* Authentication required_

### 🧪 Test & Development APIs

We've got some special endpoints just for testing and development! No database needed! 

#### 🔍 Debug Endpoint (`GET /api/debug`)

Get a peek under the hood with our debug endpoint! It shows you:

🕒 Current timestamp & environment  
📱 Node.js version details  
🔑 Environment variable status  
📜 Certificate checks  
📨 Request headers  
📂 Directory contents  

#### 🛠️ Mock Feedback Endpoints

Test the feedback functionality without a database! All data is stored in JSON files on the server's file system.

1. **Submit Mock Feedback (`POST /api/feedback-mock`)**
   ```json
   // Request Body
   {
     "name": "Test User",
     "email": "test@example.com",
     "rating": 5,
     "feedback": "This is a test feedback",
     "suggestions": "This is a test suggestion"
   }
   ```

2. **Get All Mock Feedbacks (`GET /api/feedback-mock`)**  
   Returns a list of all mock feedback submissions.

3. **Get Specific Mock Feedback (`GET /api/feedback-mock/:id`)**  
   Returns a specific feedback submission by ID.

These test endpoints are particularly useful for:  
- 🛠️ Testing the application when the database is unavailable  
- 🧪 Debugging server deployment issues  
- 🔍 Verifying server functionality  

---

## 🛠️ Development Guide

### Prerequisites

- Node.js (v14 or later)  
- npm or yarn  

### Setup

1. Clone the repository  
   ```bash
   git clone https://github.com/Aryank728/know-india.git
   cd know-india
   ```

2. Install dependencies  
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables  
   - Create a `.env` file in the `backend` directory with your database credentials  
   - For testing, you can use the test endpoints without database credentials  

4. Start the development servers  
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd ../frontend
   npm start
   ```

---

## 🌐 Deployment Guide

The application is configured for deployment on Vercel. Key considerations:

### 🔑 Environment Variables

Ensure the following environment variables are set in your Vercel deployment:  
- `DB_HOST` - Database hostname  
- `DB_PORT` - Database port  
- `DB_USERNAME` - Database username  
- `DB_PASSWORD` - Database password  
- `DB_DATABASE` - Database name  
- `DB_CA_CERT` - Base64 encoded SSL certificate (if needed)  

### 🔒 SSL Certificate Setup

For secure connections to TiDB Cloud or other SSL-enabled databases:  

1. The certificate file (`isrgrootx1.pem`) is included in the `backend/certs` directory  
2. During deployment, the certificate is automatically included  
3. The server attempts multiple connection methods if one fails:  
   - Simple connection without SSL (for local development)  
   - Connection with relaxed SSL settings  
   - Full certificate-based connection  

### 🛠️ Troubleshooting

If you encounter database connection issues:  
1. Use the `/api/debug` endpoint to check environment variables and certificate status  
2. Verify that the certificate file exists in the deployed environment  
3. Try the mock feedback endpoints to verify basic server functionality  
4. Check the server logs for specific error messages  

---

## 🤝 Contributing

Contributions are welcome! See the [frontend README](frontend/README.md) for more information on how to contribute.

---

## 📜 License

This project is licensed under the MIT License.