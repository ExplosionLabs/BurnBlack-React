const { body } = require('express-validator');
const { patterns } = require('../middleware/validationMiddleware');

// Bank account validation
const bankAccountValidation = [
  body('accountNo')
    .trim()
    .notEmpty().withMessage('Account number is required')
    .matches(patterns.accountNumber).withMessage('Invalid account number format'),
  
  body('ifscCode')
    .trim()
    .notEmpty().withMessage('IFSC code is required')
    .matches(patterns.ifsc).withMessage('Invalid IFSC code format'),
  
  body('bankName')
    .trim()
    .notEmpty().withMessage('Bank name is required')
    .isLength({ min: 2 }).withMessage('Bank name must be at least 2 characters long'),
  
  body('type')
    .trim()
    .notEmpty().withMessage('Account type is required')
    .isIn(['savings', 'current', 'salary', 'nre', 'nro']).withMessage('Invalid account type')
];

// Add bank account validation
exports.addBankAccountValidation = [
  body('bankAccounts')
    .isArray().withMessage('Bank accounts must be an array')
    .notEmpty().withMessage('At least one bank account is required')
    .custom((accounts) => {
      if (accounts.length > 5) {
        throw new Error('Maximum 5 bank accounts allowed');
      }
      return true;
    }),
  
  body('bankAccounts.*')
    .custom((account) => {
      const { accountNo, ifscCode, bankName, type } = account;
      
      if (!accountNo || !ifscCode || !bankName || !type) {
        throw new Error('All bank account fields are required');
      }
      
      if (!patterns.accountNumber.test(accountNo)) {
        throw new Error('Invalid account number format');
      }
      
      if (!patterns.ifsc.test(ifscCode)) {
        throw new Error('Invalid IFSC code format');
      }
      
      if (bankName.length < 2) {
        throw new Error('Bank name must be at least 2 characters long');
      }
      
      if (!['savings', 'current', 'salary', 'nre', 'nro'].includes(type)) {
        throw new Error('Invalid account type');
      }
      
      return true;
    })
];

// Update bank account validation
exports.updateBankAccountValidation = [
  body('accountId')
    .notEmpty().withMessage('Account ID is required')
    .isMongoId().withMessage('Invalid account ID format'),
  
  ...bankAccountValidation
];

// Delete bank account validation
exports.deleteBankAccountValidation = [
  body('accountId')
    .notEmpty().withMessage('Account ID is required')
    .isMongoId().withMessage('Invalid account ID format')
]; 