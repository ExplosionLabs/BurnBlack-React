const mongoose = require("mongoose");

const form16model = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  file: {
    type: String, // Store file as base64
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Form16Model", form16model);
