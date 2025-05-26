const mongoose = require('mongoose');

// Common schema for all income types
const incomeBaseSchema = {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  financialYear: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}$/,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  tds: {
    type: Number,
    default: 0,
    min: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDate: Date,
  source: {
    type: String,
    required: true
  },
  description: String,
  documents: [{
    type: {
      type: String,
      enum: ['FORM16', 'FORM16A', 'BANK_STATEMENT', 'OTHER']
    },
    url: String,
    uploadedAt: Date,
    verified: {
      type: Boolean,
      default: false
    }
  }],
  status: {
    type: String,
    enum: ['DRAFT', 'VERIFIED', 'REJECTED'],
    default: 'DRAFT'
  }
};

// Salary Income Schema
const salaryIncomeSchema = new mongoose.Schema({
  ...incomeBaseSchema,
  employerName: {
    type: String,
    required: true
  },
  employerTAN: {
    type: String,
    required: true,
    match: /^[A-Z]{4}[0-9]{5}[A-Z]$/
  },
  employerPAN: {
    type: String,
    required: true,
    match: /^[A-Z]{5}[0-9]{4}[A-Z]$/
  },
  basicSalary: {
    type: Number,
    required: true,
    min: 0
  },
  hra: {
    type: Number,
    required: true,
    min: 0
  },
  specialAllowance: {
    type: Number,
    default: 0,
    min: 0
  },
  professionalTax: {
    type: Number,
    default: 0,
    min: 0
  },
  otherAllowances: {
    type: Map,
    of: Number,
    default: new Map()
  },
  perquisites: {
    type: Map,
    of: Number,
    default: new Map()
  },
  epf: {
    type: Number,
    default: 0,
    min: 0
  },
  gratuity: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Business Income Schema
const businessIncomeSchema = new mongoose.Schema({
  ...incomeBaseSchema,
  businessName: {
    type: String,
    required: true
  },
  businessPAN: {
    type: String,
    required: true,
    match: /^[A-Z]{5}[0-9]{4}[A-Z]$/
  },
  businessType: {
    type: String,
    enum: ['PROPRIETORSHIP', 'PARTNERSHIP', 'PRIVATE_LIMITED', 'PUBLIC_LIMITED', 'OTHER'],
    required: true
  },
  turnover: {
    type: Number,
    required: true,
    min: 0
  },
  expenses: {
    type: Map,
    of: Number,
    default: new Map()
  },
  depreciation: {
    type: Number,
    default: 0,
    min: 0
  },
  profit: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Property Income Schema
const propertyIncomeSchema = new mongoose.Schema({
  ...incomeBaseSchema,
  propertyType: {
    type: String,
    enum: ['SELF_OCCUPIED', 'RENTED', 'LET_OUT'],
    required: true
  },
  propertyAddress: {
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  annualValue: {
    type: Number,
    required: true,
    min: 0
  },
  municipalTaxes: {
    type: Number,
    default: 0,
    min: 0
  },
  standardDeduction: {
    type: Number,
    default: 0,
    min: 0
  },
  interestOnLoan: {
    type: Number,
    default: 0,
    min: 0
  },
  otherDeductions: {
    type: Map,
    of: Number,
    default: new Map()
  }
}, {
  timestamps: true
});

// Other Income Schema (Interest, Dividend, etc.)
const otherIncomeSchema = new mongoose.Schema({
  ...incomeBaseSchema,
  incomeType: {
    type: String,
    enum: [
      'INTEREST_SAVINGS',
      'INTEREST_FD',
      'INTEREST_BONDS',
      'DIVIDEND',
      'RENTAL',
      'ROYALTY',
      'CAPITAL_GAINS',
      'OTHER'
    ],
    required: true
  },
  payerName: {
    type: String,
    required: true
  },
  payerPAN: {
    type: String,
    match: /^[A-Z]{5}[0-9]{4}[A-Z]$/
  },
  payerTAN: {
    type: String,
    match: /^[A-Z]{4}[0-9]{5}[A-Z]$/
  },
  exemptAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  taxableAmount: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Indexes
const commonIndexes = (schema) => {
  schema.index({ userId: 1, financialYear: 1, source: 1 });
  schema.index({ status: 1 });
  schema.index({ isVerified: 1 });
  schema.index({ createdAt: -1 });
};

commonIndexes(salaryIncomeSchema);
commonIndexes(businessIncomeSchema);
commonIndexes(propertyIncomeSchema);
commonIndexes(otherIncomeSchema);

// Models
const SalaryIncome = mongoose.model('SalaryIncome', salaryIncomeSchema);
const BusinessIncome = mongoose.model('BusinessIncome', businessIncomeSchema);
const PropertyIncome = mongoose.model('PropertyIncome', propertyIncomeSchema);
const OtherIncome = mongoose.model('OtherIncome', otherIncomeSchema);

module.exports = {
  SalaryIncome,
  BusinessIncome,
  PropertyIncome,
  OtherIncome
}; 