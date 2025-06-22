const { body } = require('express-validator');
const { patterns } = require('../middleware/validationMiddleware');

// Registration validation
exports.registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .matches(patterns.email).withMessage('Invalid email format'),
  
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .matches(patterns.password).withMessage('Password must be at least 8 characters long and contain letters, numbers, and special characters'),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(patterns.phone).withMessage('Invalid phone number format')
];

// Login validation
exports.loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .matches(patterns.email).withMessage('Invalid email format'),
  
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
];

// Password update validation
exports.updatePasswordValidation = [
  body('currentPassword')
    .trim()
    .notEmpty().withMessage('Current password is required'),
  
  body('newPassword')
    .trim()
    .notEmpty().withMessage('New password is required')
    .matches(patterns.password).withMessage('Password must be at least 8 characters long and contain letters, numbers, and special characters')
];

// Password reset validation
exports.resetPasswordValidation = [
  body('token')
    .trim()
    .notEmpty().withMessage('Reset token is required'),
  
  body('newPassword')
    .trim()
    .notEmpty().withMessage('New password is required')
    .matches(patterns.password).withMessage('Password must be at least 8 characters long and contain letters, numbers, and special characters')
];

// Google auth validation
exports.googleAuthValidation = [
  body('token')
    .trim()
    .notEmpty().withMessage('Google token is required')
]; 