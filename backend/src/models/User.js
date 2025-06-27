// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { type: String },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    emailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationDate: {
      type: Date
    },
    lastVerificationEmailSent: {
      type: Date
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add index for faster email queries
userSchema.index({ email: 1 });

// Add virtual for checking if user can request new verification email
userSchema.virtual('canRequestVerificationEmail').get(function() {
  if (!this.lastVerificationEmailSent) return true;
  // Allow new verification email after 1 hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  return this.lastVerificationEmailSent < oneHourAgo;
});

module.exports = mongoose.model("User", userSchema);
