// models/Otp.js
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["phone", "email"] }, // Type of OTP
  identifier: { type: String, required: true }, // Phone number or email
  otp: { type: String, required: true }, // OTP value
  createdAt: { type: Date, default: Date.now, expires: 300 }, // Automatically delete after 5 minutes
});

module.exports = mongoose.model("Otp", otpSchema);
