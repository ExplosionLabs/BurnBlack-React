const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import the working auth controller
const AuthController = require('./controllers/AuthControllerPrisma');

// Simple Google auth route
app.post('/api/v1/auth/google', async (req, res) => {
  try {
    await AuthController.googleAuth(req, res, (error) => {
      if (error) {
        console.error('Auth error:', error);
        res.status(error.statusCode || 500).json({
          status: 'error',
          message: error.message || 'Internal server error'
        });
      }
    });
  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({
      status: 'error', 
      message: 'Internal server error'
    });
  }
});

// Test route
app.get('/api/v1/test', (req, res) => {
  res.json({ status: 'success', message: 'Server is running' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});