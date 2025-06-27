const mongoose = require('mongoose');

const personalDetailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters long']
  },
  middleName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters long']
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(value) {
        const dob = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
        
        return age >= 18 && age <= 100;
      },
      message: 'Must be at least 18 years old and not more than 100 years old'
    }
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Invalid gender value'
    }
  },
  maritalStatus: {
    type: String,
    required: [true, 'Marital status is required'],
    enum: {
      values: ['single', 'married', 'divorced', 'widowed'],
      message: 'Invalid marital status'
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
personalDetailSchema.index({ userId: 1 });

// Virtual for full name
personalDetailSchema.virtual('fullName').get(function() {
  return this.middleName 
    ? `${this.firstName} ${this.middleName} ${this.lastName}`
    : `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON output
personalDetailSchema.set('toJSON', { virtuals: true });
personalDetailSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('PersonalDetail', personalDetailSchema); 