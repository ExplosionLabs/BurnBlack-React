const mongoose = require('mongoose');

const emailVerificationTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    // Token expires in 24 hours
    default: () => new Date(+new Date() + 24*60*60*1000)
  },
  used: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Create indexes for faster queries
emailVerificationTokenSchema.index({ token: 1 });
emailVerificationTokenSchema.index({ userId: 1 });
emailVerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Add method to check if token is valid
emailVerificationTokenSchema.methods.isValid = function() {
  return !this.used && this.expiresAt > new Date();
};

module.exports = mongoose.model('EmailVerificationToken', emailVerificationTokenSchema); 