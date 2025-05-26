const BankDetail = require('../models/BankDetail');
const User = require('../models/User');
const AppError = require('../utils/appError');

class BankDetailService {
  // Get bank details
  async getBankDetails(userId) {
    try {
      const bankDetail = await BankDetail.findOne({ userId });
      if (!bankDetail) {
        throw new AppError('Bank details not found', 404);
      }
      return bankDetail;
    } catch (error) {
      throw error;
    }
  }

  // Add bank accounts
  async addBankAccounts(userId, bankAccounts) {
    try {
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Check for duplicate account numbers
      for (const account of bankAccounts) {
        const existingAccount = await BankDetail.findOne({
          'bankAccounts.accountNo': account.accountNo
        });
        if (existingAccount) {
          throw new AppError(`Account number ${account.accountNo} already registered`, 400);
        }
      }

      // Find and update or create new
      const bankDetail = await BankDetail.findOneAndUpdate(
        { userId },
        { 
          $push: { 
            bankAccounts: {
              $each: bankAccounts.map(account => ({
                ...account,
                isPrimary: bankAccounts.length === 1 // Set as primary if it's the first account
              }))
            }
          }
        },
        { 
          new: true,
          upsert: true,
          runValidators: true
        }
      );

      return bankDetail;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new AppError(error.message, 400);
      }
      throw error;
    }
  }

  // Update bank account
  async updateBankAccount(userId, accountId, updateData) {
    try {
      const bankDetail = await BankDetail.findOne({ userId });
      if (!bankDetail) {
        throw new AppError('Bank details not found', 404);
      }

      const accountIndex = bankDetail.bankAccounts.findIndex(
        account => account._id.toString() === accountId
      );

      if (accountIndex === -1) {
        throw new AppError('Bank account not found', 404);
      }

      // Check for duplicate account number if changing account number
      if (updateData.accountNo && 
          updateData.accountNo !== bankDetail.bankAccounts[accountIndex].accountNo) {
        const existingAccount = await BankDetail.findOne({
          'bankAccounts.accountNo': updateData.accountNo
        });
        if (existingAccount) {
          throw new AppError(`Account number ${updateData.accountNo} already registered`, 400);
        }
      }

      // Update account
      Object.assign(bankDetail.bankAccounts[accountIndex], updateData);
      await bankDetail.save();

      return bankDetail;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new AppError(error.message, 400);
      }
      throw error;
    }
  }

  // Delete bank account
  async deleteBankAccount(userId, accountId) {
    try {
      const bankDetail = await BankDetail.findOne({ userId });
      if (!bankDetail) {
        throw new AppError('Bank details not found', 404);
      }

      const accountIndex = bankDetail.bankAccounts.findIndex(
        account => account._id.toString() === accountId
      );

      if (accountIndex === -1) {
        throw new AppError('Bank account not found', 404);
      }

      // Don't allow deletion if it's the only account
      if (bankDetail.bankAccounts.length === 1) {
        throw new AppError('Cannot delete the only bank account', 400);
      }

      // Remove account
      bankDetail.bankAccounts.splice(accountIndex, 1);

      // If deleted account was primary, make another account primary
      if (bankDetail.bankAccounts.length > 0 && 
          !bankDetail.bankAccounts.some(account => account.isPrimary)) {
        bankDetail.bankAccounts[0].isPrimary = true;
      }

      await bankDetail.save();
      return bankDetail;
    } catch (error) {
      throw error;
    }
  }

  // Set primary account
  async setPrimaryAccount(userId, accountId) {
    try {
      const bankDetail = await BankDetail.findOne({ userId });
      if (!bankDetail) {
        throw new AppError('Bank details not found', 404);
      }

      const accountIndex = bankDetail.bankAccounts.findIndex(
        account => account._id.toString() === accountId
      );

      if (accountIndex === -1) {
        throw new AppError('Bank account not found', 404);
      }

      // Reset all accounts to non-primary
      bankDetail.bankAccounts.forEach(account => {
        account.isPrimary = false;
      });

      // Set selected account as primary
      bankDetail.bankAccounts[accountIndex].isPrimary = true;
      await bankDetail.save();

      return bankDetail;
    } catch (error) {
      throw error;
    }
  }

  // Update verification status
  async updateVerificationStatus(userId, accountId, status) {
    try {
      const bankDetail = await BankDetail.findOne({ userId });
      if (!bankDetail) {
        throw new AppError('Bank details not found', 404);
      }

      const account = bankDetail.bankAccounts.find(
        account => account._id.toString() === accountId
      );

      if (!account) {
        throw new AppError('Bank account not found', 404);
      }

      account.isVerified = status;
      account.lastVerifiedAt = status ? new Date() : null;
      await bankDetail.save();

      return bankDetail;
    } catch (error) {
      throw error;
    }
  }

  // Check if bank details are complete
  async isProfileComplete(userId) {
    try {
      const bankDetail = await BankDetail.findOne({ userId });
      if (!bankDetail) {
        return false;
      }

      // Check if there's at least one verified bank account
      return bankDetail.bankAccounts.some(account => account.isVerified);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BankDetailService(); 