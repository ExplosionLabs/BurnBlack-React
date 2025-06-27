const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  documentType: {
    type: String,
    enum: [
      'FORM16',
      'FORM16A',
      'BANK_STATEMENT',
      'RENT_RECEIPT',
      'PROPERTY_TAX_RECEIPT',
      'BUSINESS_INCOME_PROOF',
      'INTEREST_CERTIFICATE',
      'DIVIDEND_STATEMENT',
      'OTHER'
    ],
    required: true
  },
  financialYear: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}$/,
    index: true
  },
  fileName: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true,
    min: 0
  },
  storageKey: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
    default: 'PENDING'
  },
  verificationNotes: String,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  relatedIncome: {
    incomeType: {
      type: String,
      enum: ['SALARY', 'BUSINESS', 'PROPERTY', 'OTHER'],
      required: true
    },
    incomeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map()
  }
}, {
  timestamps: true
});

// Indexes
documentSchema.index({ userId: 1, financialYear: 1, documentType: 1 });
documentSchema.index({ status: 1 });
documentSchema.index({ verifiedBy: 1 });
documentSchema.index({ 'relatedIncome.incomeId': 1 });
documentSchema.index({ createdAt: -1 });

// Virtual for document age
documentSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // Age in days
});

// Methods
documentSchema.methods.isExpired = function() {
  // Documents are considered expired after 7 years
  return this.age > (7 * 365);
};

documentSchema.methods.canBeVerified = function() {
  return this.status === 'PENDING';
};

documentSchema.methods.verify = async function(verifiedBy, notes = '') {
  if (!this.canBeVerified()) {
    throw new Error('Document cannot be verified in its current state');
  }

  this.status = 'VERIFIED';
  this.verifiedBy = verifiedBy;
  this.verifiedAt = new Date();
  this.verificationNotes = notes;

  // Update related income verification status
  const IncomeModel = mongoose.model(this.relatedIncome.incomeType + 'Income');
  await IncomeModel.findByIdAndUpdate(
    this.relatedIncome.incomeId,
    {
      isVerified: true,
      verificationDate: new Date(),
      status: 'VERIFIED'
    }
  );

  return this.save();
};

documentSchema.methods.reject = async function(verifiedBy, notes) {
  if (!this.canBeVerified()) {
    throw new Error('Document cannot be rejected in its current state');
  }

  this.status = 'REJECTED';
  this.verifiedBy = verifiedBy;
  this.verifiedAt = new Date();
  this.verificationNotes = notes;

  // Update related income verification status
  const IncomeModel = mongoose.model(this.relatedIncome.incomeType + 'Income');
  await IncomeModel.findByIdAndUpdate(
    this.relatedIncome.incomeId,
    {
      isVerified: false,
      verificationDate: new Date(),
      status: 'DRAFT'
    }
  );

  return this.save();
};

const Document = mongoose.model('Document', documentSchema);

module.exports = Document; 