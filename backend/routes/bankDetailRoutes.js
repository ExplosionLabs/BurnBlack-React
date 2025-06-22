const express = require('express');
const router = express.Router();
const BankDetailService = require('../services/BankDetailService');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { 
  addBankAccountValidation, 
  updateBankAccountValidation, 
  deleteBankAccountValidation 
} = require('../validations/bankDetailValidations');

// All routes are protected
router.use(protect);

// Get bank details
router.get('/', async (req, res, next) => {
  try {
    const bankDetails = await BankDetailService.getBankDetails(req.user.id);
    res.json({
      success: true,
      data: {
        bankDetails: {
          bankAccounts: bankDetails.bankAccounts.map(account => ({
            id: account._id,
            accountNo: account.accountNo,
            ifscCode: account.ifscCode,
            bankName: account.bankName,
            type: account.type,
            isVerified: account.isVerified,
            isPrimary: account.isPrimary,
            lastVerifiedAt: account.lastVerifiedAt
          }))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Add bank accounts
router.post('/', validate(addBankAccountValidation), async (req, res, next) => {
  try {
    const bankDetails = await BankDetailService.addBankAccounts(req.user.id, req.body.bankAccounts);
    res.json({
      success: true,
      data: {
        bankDetails: {
          bankAccounts: bankDetails.bankAccounts.map(account => ({
            id: account._id,
            accountNo: account.accountNo,
            ifscCode: account.ifscCode,
            bankName: account.bankName,
            type: account.type,
            isVerified: account.isVerified,
            isPrimary: account.isPrimary,
            lastVerifiedAt: account.lastVerifiedAt
          }))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update bank account
router.put('/:accountId', validate(updateBankAccountValidation), async (req, res, next) => {
  try {
    const bankDetails = await BankDetailService.updateBankAccount(
      req.user.id,
      req.params.accountId,
      req.body
    );
    res.json({
      success: true,
      data: {
        bankDetails: {
          bankAccounts: bankDetails.bankAccounts.map(account => ({
            id: account._id,
            accountNo: account.accountNo,
            ifscCode: account.ifscCode,
            bankName: account.bankName,
            type: account.type,
            isVerified: account.isVerified,
            isPrimary: account.isPrimary,
            lastVerifiedAt: account.lastVerifiedAt
          }))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Delete bank account
router.delete('/:accountId', validate(deleteBankAccountValidation), async (req, res, next) => {
  try {
    const bankDetails = await BankDetailService.deleteBankAccount(
      req.user.id,
      req.params.accountId
    );
    res.json({
      success: true,
      data: {
        bankDetails: {
          bankAccounts: bankDetails.bankAccounts.map(account => ({
            id: account._id,
            accountNo: account.accountNo,
            ifscCode: account.ifscCode,
            bankName: account.bankName,
            type: account.type,
            isVerified: account.isVerified,
            isPrimary: account.isPrimary,
            lastVerifiedAt: account.lastVerifiedAt
          }))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Set primary account
router.patch('/:accountId/primary', async (req, res, next) => {
  try {
    const bankDetails = await BankDetailService.setPrimaryAccount(
      req.user.id,
      req.params.accountId
    );
    res.json({
      success: true,
      data: {
        bankDetails: {
          bankAccounts: bankDetails.bankAccounts.map(account => ({
            id: account._id,
            accountNo: account.accountNo,
            ifscCode: account.ifscCode,
            bankName: account.bankName,
            type: account.type,
            isVerified: account.isVerified,
            isPrimary: account.isPrimary,
            lastVerifiedAt: account.lastVerifiedAt
          }))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update verification status
router.patch('/:accountId/verify', async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (typeof status !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Status must be a boolean value'
      });
    }

    const bankDetails = await BankDetailService.updateVerificationStatus(
      req.user.id,
      req.params.accountId,
      status
    );

    res.json({
      success: true,
      data: {
        bankDetails: {
          bankAccounts: bankDetails.bankAccounts.map(account => ({
            id: account._id,
            accountNo: account.accountNo,
            ifscCode: account.ifscCode,
            bankName: account.bankName,
            type: account.type,
            isVerified: account.isVerified,
            isPrimary: account.isPrimary,
            lastVerifiedAt: account.lastVerifiedAt
          }))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Check profile completion status
router.get('/status', async (req, res, next) => {
  try {
    const isComplete = await BankDetailService.isProfileComplete(req.user.id);
    res.json({
      success: true,
      data: {
        isProfileComplete: isComplete
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 