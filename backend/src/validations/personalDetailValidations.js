const { body } = require('express-validator');

// Personal details validation
exports.personalDetailValidation = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2 }).withMessage('First name must be at least 2 characters long')
    .matches(/^[a-zA-Z\s]*$/).withMessage('First name can only contain letters and spaces'),
  
  body('middleName')
    .optional()
    .trim()
    .matches(/^[a-zA-Z\s]*$/).withMessage('Middle name can only contain letters and spaces'),
  
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters long')
    .matches(/^[a-zA-Z\s]*$/).withMessage('Last name can only contain letters and spaces'),
  
  body('dob')
    .trim()
    .notEmpty().withMessage('Date of birth is required')
    .isDate().withMessage('Invalid date format')
    .custom((value) => {
      const dob = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      
      // Check if birthday has occurred this year
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      if (age < 18) {
        throw new Error('Must be at least 18 years old');
      }
      if (age > 100) {
        throw new Error('Invalid date of birth');
      }
      return true;
    }),
  
  body('gender')
    .trim()
    .notEmpty().withMessage('Gender is required')
    .isIn(['male', 'female', 'other']).withMessage('Invalid gender value'),
  
  body('maritalStatus')
    .trim()
    .notEmpty().withMessage('Marital status is required')
    .isIn(['single', 'married', 'divorced', 'widowed']).withMessage('Invalid marital status')
]; 