const express = require('express');
const router = express.Router();
const { DatabaseServiceFactory } = require('../config/database');
const { validate } = require('../middleware/validationMiddleware');
const {
  registerValidation,
  loginValidation,
  updatePasswordValidation,
  resetPasswordValidation,
  googleAuthValidation
} = require('../validations/authValidations');

// Get services based on configuration
const AuthController = DatabaseServiceFactory.getAuthController();
const { verifyToken, requireAdmin } = DatabaseServiceFactory.getAuthMiddleware();

// Public routes
router.post('/register', validate(registerValidation), AuthController.register);
router.post('/login', validate(loginValidation), AuthController.login);
router.post('/google', validate(googleAuthValidation), AuthController.googleAuth);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', validate(resetPasswordValidation), AuthController.resetPassword);
router.get('/verify-email/:token', AuthController.verifyEmail);

// Protected routes
router.get('/me', verifyToken, AuthController.getProfile);
router.put('/profile', verifyToken, AuthController.updateProfile);
router.post('/logout', verifyToken, AuthController.logout);
router.get('/check', verifyToken, AuthController.checkAuth);

// Admin routes
router.get('/users', verifyToken, requireAdmin, AuthController.getAllUsers);
router.delete('/users/:userId', verifyToken, requireAdmin, AuthController.deleteUser);

module.exports = router;