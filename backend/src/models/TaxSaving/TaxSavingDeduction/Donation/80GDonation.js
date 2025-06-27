const mongoose = require("mongoose");

const Donation80GSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  section80G: {
    type: String,
  },
  nameDonee: {
    type: String,
  },
  cashAmount: {
    type: Number,
  },
  nonCashAmount: {
    type: Number,
  },
  panDonee: {
    type: String,
  },
  limitDeduction: {
    type: String,
  },
  qualifyPercent: {
    type: Number,
  },
  addressLine: {
    type: String,
  },
  pinCode: {
    type: Number,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
});

module.exports = mongoose.model("Donation80G", Donation80GSchema);
