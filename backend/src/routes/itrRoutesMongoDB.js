// ITR Routes for MongoDB Backend
// Fixed version addressing critical bugs identified in analysis

const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const { validate } = require('../middleware/validationMiddleware');
const { body, param, query } = require('express-validator');
const rateLimit = require('express-rate-limit');

// Import fixed controller
const {
  generateITRJSON,
  downloadITRJSON,
  calculateLiveTax
} = require('../controllers/ITRControllerMongoDB');

// ========================================
// RATE LIMITING (Fix Bug #14)
// ========================================

const itrGenerationLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each user to 5 ITR generations per window
  message: {
    success: false,
    message: 'Too many ITR generation requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const taxCalculationLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute  
  max: 20, // Limit each user to 20 tax calculations per minute
  message: {
    success: false,
    message: 'Too many tax calculation requests. Please slow down.'
  }
});

// ========================================
// VALIDATION SCHEMAS (Fix Bug #11)
// ========================================

const generateITRValidation = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid User ID format'),
  body('itrType')
    .optional()
    .isIn(['ITR-1', 'ITR-2', 'ITR-3', 'ITR-4', 'AUTO'])
    .withMessage('Invalid ITR type'),
  body('assessmentYear')
    .optional()
    .matches(/^\d{4}-\d{2}$/)
    .withMessage('Assessment year must be in YYYY-YY format (e.g., 2024-25)')
];

const calculateTaxValidation = [
  body('income.total')
    .optional()
    .isNumeric()
    .withMessage('Income must be a number')
    .custom((value) => {
      if (value < 0 || value > 100000000) {
        throw new Error('Income must be between 0 and 10 crores');
      }
      return true;
    }),
  body('deductions.total')
    .optional()
    .isNumeric()
    .withMessage('Deductions must be a number')
    .custom((value) => {
      if (value < 0 || value > 10000000) {
        throw new Error('Deductions must be between 0 and 1 crore');
      }
      return true;
    }),
  body('regime')
    .optional()
    .isIn(['OLD', 'NEW'])
    .withMessage('Regime must be either OLD or NEW')
];

const checksumValidation = [
  param('checksum')
    .notEmpty()
    .withMessage('Checksum is required')
    .isLength({ min: 8, max: 64 })
    .withMessage('Invalid checksum format')
    .matches(/^[a-fA-F0-9]+$/)
    .withMessage('Checksum must be hexadecimal')
];

// ========================================
// PUBLIC ROUTES
// ========================================

// Live tax calculation (public, with rate limiting)
router.post('/calculate-live', 
  taxCalculationLimit,
  calculateTaxValidation,
  validate,
  calculateLiveTax
);

// ========================================
// AUTHENTICATED ROUTES
// ========================================

// Generate ITR JSON
router.post('/generate-json',
  itrGenerationLimit,
  verifyToken,
  generateITRValidation,
  validate,
  generateITRJSON
);

// Download ITR JSON (Fix Bug #6: Proper authorization)
router.get('/download/:checksum',
  verifyToken,
  checksumValidation,
  validate,
  downloadITRJSON
);

// ========================================
// ADMIN ROUTES
// ========================================

// Admin route to generate ITR for any user
router.post('/admin/generate-json',
  itrGenerationLimit,
  verifyToken,
  checkRole(['admin']),
  generateITRValidation,
  validate,
  generateITRJSON
);

// ========================================
// ERROR HANDLING MIDDLEWARE
// ========================================

router.use((error, req, res, next) => {
  console.error('ITR Route Error:', error);
  
  // Don't expose internal errors
  const message = error.message.includes('validation') 
    ? error.message 
    : 'Internal server error in ITR processing';
    
  res.status(error.status || 500).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

module.exports = router;