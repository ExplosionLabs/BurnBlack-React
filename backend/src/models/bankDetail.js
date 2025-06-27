const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
  accountNo: {
    type: String,
    required: [true, 'Account number is required'],
    trim: true,
    validate: {
      validator: function(value) {
        return /^\d{9,18}$/.test(value);
      },
      message: 'Invalid account number format'
    }
  },
  ifscCode: {
    type: String,
    required: [true, 'IFSC code is required'],
    trim: true,
    validate: {
      validator: function(value) {
        return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value);
      },
      message: 'Invalid IFSC code format'
    }
  },
  bankName: {
    type: String,
    required: [true, 'Bank name is required'],
    trim: true,
    minlength: [2, 'Bank name must be at least 2 characters long']
  },
  type: {
    type: String,
    required: [true, 'Account type is required'],
    enum: {
      values: ['savings', 'current', 'salary', 'nre', 'nro'],
      message: 'Invalid account type'
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  lastVerifiedAt: {
    type: Date
  }
}, {
  timestamps: true
});

const bankDetailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bankAccounts: {
    type: [bankAccountSchema],
    validate: {
      validator: function(accounts) {
        return accounts.length <= 5;
      },
      message: 'Maximum 5 bank accounts allowed'
    }
  }
}, {
  timestamps: true
});

// Indexes for faster queries
bankDetailSchema.index({ userId: 1 });
bankDetailSchema.index({ 'bankAccounts.accountNo': 1 });
bankDetailSchema.index({ 'bankAccounts.ifscCode': 1 });

// Ensure virtuals are included in JSON output
bankDetailSchema.set('toJSON', { virtuals: true });
bankDetailSchema.set('toObject', { virtuals: true });

// Pre-save middleware to ensure only one primary account
bankDetailSchema.pre('save', function(next) {
  if (this.bankAccounts && this.bankAccounts.length > 0) {
    const primaryAccounts = this.bankAccounts.filter(account => account.isPrimary);
    if (primaryAccounts.length > 1) {
      return next(new Error('Only one bank account can be primary'));
    }
  }
  next();
});

module.exports = mongoose.model('BankDetail', bankDetailSchema); 