// models/Otp.js
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["phone", "email", "forgot-password"] },
  identifier: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 },
});

module.exports = mongoose.model("Otp", otpSchema);
