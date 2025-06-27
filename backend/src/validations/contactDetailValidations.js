const { body } = require('express-validator');
const { patterns } = require('../middleware/validationMiddleware');

// Contact details validation
exports.contactDetailValidation = [
  body('aadharNumber')
    .trim()
    .notEmpty().withMessage('Aadhar number is required')
    .matches(patterns.aadhar).withMessage('Invalid Aadhar number format')
    .custom(async (value) => {
      // TODO: Add Aadhar verification API integration
      return true;
    }),
  
  body('panNumber')
    .trim()
    .notEmpty().withMessage('PAN number is required')
    .matches(patterns.pan).withMessage('Invalid PAN number format'),
  
  body('mobileNumber')
    .trim()
    .notEmpty().withMessage('Mobile number is required')
    .matches(patterns.phone).withMessage('Invalid mobile number format'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .matches(patterns.email).withMessage('Invalid email format'),
  
  body('secondaryMobileNumber')
    .optional()
    .trim()
    .matches(patterns.phone).withMessage('Invalid secondary mobile number format')
    .custom((value, { req }) => {
      if (value === req.body.mobileNumber) {
        throw new Error('Secondary mobile number must be different from primary mobile number');
      }
      return true;
    }),
  
  body('secondaryEmail')
    .optional()
    .trim()
    .matches(patterns.email).withMessage('Invalid secondary email format')
    .custom((value, { req }) => {
      if (value === req.body.email) {
        throw new Error('Secondary email must be different from primary email');
      }
      return true;
    }),
  
  body('landlineNumber')
    .optional()
    .trim()
    .matches(/^[0-9]{10,12}$/).withMessage('Invalid landline number format')
]; 