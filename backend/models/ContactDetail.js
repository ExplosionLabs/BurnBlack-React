const mongoose = require('mongoose');

const contactDetailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  aadharNumber: {
    type: String,
    required: [true, 'Aadhar number is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(value) {
        return /^\d{12}$/.test(value);
      },
      message: 'Invalid Aadhar number format'
    }
  },
  panNumber: {
    type: String,
    required: [true, 'PAN number is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(value) {
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
      },
      message: 'Invalid PAN number format'
    }
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    validate: {
      validator: function(value) {
        return /^\d{10}$/.test(value);
      },
      message: 'Invalid mobile number format'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: 'Invalid email format'
    }
  },
  secondaryMobileNumber: {
    type: String,
    trim: true,
    validate: {
      validator: function(value) {
        if (!value) return true; // Optional field
        if (value === this.mobileNumber) {
          return false;
        }
        return /^\d{10}$/.test(value);
      },
      message: 'Invalid secondary mobile number or same as primary'
    }
  },
  secondaryEmail: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(value) {
        if (!value) return true; // Optional field
        if (value === this.email) {
          return false;
        }
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: 'Invalid secondary email or same as primary'
    }
  },
  landlineNumber: {
    type: String,
    trim: true,
    validate: {
      validator: function(value) {
        if (!value) return true; // Optional field
        return /^[0-9]{10,12}$/.test(value);
      },
      message: 'Invalid landline number format'
    }
  },
  isAadharVerified: {
    type: Boolean,
    default: false
  },
  isPanVerified: {
    type: Boolean,
    default: false
  },
  isMobileVerified: {
    type: Boolean,
    default: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for faster queries and uniqueness
contactDetailSchema.index({ userId: 1 });
contactDetailSchema.index({ aadharNumber: 1 }, { unique: true, sparse: true });
contactDetailSchema.index({ panNumber: 1 }, { unique: true, sparse: true });
contactDetailSchema.index({ mobileNumber: 1 });
contactDetailSchema.index({ email: 1 });

// Ensure virtuals are included in JSON output
contactDetailSchema.set('toJSON', { virtuals: true });
contactDetailSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('ContactDetail', contactDetailSchema); 