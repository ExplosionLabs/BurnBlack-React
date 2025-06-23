const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mock Google auth endpoint that doesn't require database
app.post('/api/v1/auth/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Google ID token is required'
      });
    }

    // For development, we'll accept any non-empty token and create a mock response
    // In production, this should verify the Google token
    console.log('Received Google token:', idToken.substring(0, 50) + '...');
    
    // Mock user data
    const mockUser = {
      id: 'mock-user-id',
      email: 'test@example.com',
      name: 'Test User',
      emailVerified: true,
      role: 'USER'
    };

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: mockUser.id, 
        email: mockUser.email,
        role: mockUser.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      status: 'success',
      message: 'Google authentication successful',
      data: {
        user: mockUser,
        token
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Test route
app.get('/api/v1/test', (req, res) => {
  res.json({ status: 'success', message: 'Mock server is running' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
  console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);
});