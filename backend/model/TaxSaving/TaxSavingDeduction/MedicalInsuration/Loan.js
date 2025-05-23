const mongoose = require("mongoose");

const LoansSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  eduLoans: {
    type: Number,
  },
  homeLoans1617: {
    type: Number,
    max: 50000,
  },
  homeLoans1922: {
    type: Number,
    max: 50000,
  },
  electricVehicle: {
    type: Number,
  },
});

module.exports = mongoose.model("Loans", LoansSchema);
