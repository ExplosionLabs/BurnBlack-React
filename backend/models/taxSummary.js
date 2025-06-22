const mongoose = require('mongoose');

const taxSummarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  grossIncome: {
    type: Number,
    required: true,
    min: 0
  },
  totalDeductions: {
    type: Number,
    required: true,
    min: 0
  },
  taxableIncome: {
    type: Number,
    required: true,
    min: 0
  },
  incomeTaxAtNormalRates: {
    type: Number,
    required: true,
    min: 0
  },
  surcharge: {
    type: Number,
    required: true,
    min: 0
  },
  healthEducationCess: {
    type: Number,
    required: true,
    min: 0
  },
  totalTaxLiability: {
    type: Number,
    required: true,
    min: 0
  },
  taxPaid: {
    type: Number,
    required: true,
    min: 0
  },
  taxDue: {
    type: Number,
    required: true,
    min: 0
  },
  taxRefund: {
    type: Number,
    required: true,
    min: 0
  },
  userType: {
    type: String,
    enum: ['INDIVIDUAL', 'SENIOR_CITIZEN', 'SUPER_SENIOR_CITIZEN'],
    default: 'INDIVIDUAL'
  },
  financialYear: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}$/ // Format: YYYY-YY
  },
  assessmentYear: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}$/ // Format: YYYY-YY
  },
  status: {
    type: String,
    enum: ['DRAFT', 'CALCULATED', 'FILED', 'VERIFIED'],
    default: 'DRAFT'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
taxSummarySchema.index({ userId: 1, financialYear: 1 }, { unique: true });
taxSummarySchema.index({ status: 1 });
taxSummarySchema.index({ lastUpdated: -1 });

// Virtual for total tax paid (including TDS, advance tax, etc.)
taxSummarySchema.virtual('totalTaxPaid').get(function() {
  return this.taxPaid;
});

// Method to check if tax calculation is complete
taxSummarySchema.methods.isCalculationComplete = function() {
  return this.status === 'CALCULATED' || this.status === 'FILED' || this.status === 'VERIFIED';
};

// Method to check if tax is due
taxSummarySchema.methods.hasTaxDue = function() {
  return this.taxDue > 0;
};

// Method to check if refund is due
taxSummarySchema.methods.hasRefundDue = function() {
  return this.taxRefund > 0;
};

// Static method to get current financial year
taxSummarySchema.statics.getCurrentFinancialYear = function() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // JavaScript months are 0-based
  
  if (month >= 4) {
    // Current year to next year
    return `${year}-${String(year + 1).slice(-2)}`;
  } else {
    // Previous year to current year
    return `${year - 1}-${String(year).slice(-2)}`;
  }
};

// Static method to get assessment year from financial year
taxSummarySchema.statics.getAssessmentYear = function(financialYear) {
  const [startYear] = financialYear.split('-');
  return `${Number(startYear) + 1}-${String(Number(startYear) + 2).slice(-2)}`;
};

// Pre-save middleware to set assessment year if not provided
taxSummarySchema.pre('save', function(next) {
  if (!this.assessmentYear && this.financialYear) {
    this.assessmentYear = this.constructor.getAssessmentYear(this.financialYear);
  }
  next();
});

const TaxSummary = mongoose.model('TaxSummary', taxSummarySchema);

module.exports = TaxSummary; 