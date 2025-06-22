const express = require('express');
const router = express.Router();
const { rateLimiter } = require('../middleware/security');
const { 
  sendVerificationEmail, 
  verifyEmail 
} = require('../controller/emailVerificationController');

// Apply rate limiting to prevent abuse
router.post('/send', rateLimiter, sendVerificationEmail);
router.post('/verify', rateLimiter, verifyEmail);

module.exports = router; 