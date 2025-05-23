const mongoose = require("mongoose");

const TaxInvestmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  section80C: {
    type: Number,
    default: 0,
    max: 150000,
  },
  savingsInterest80TTA: {
    type: Number,
    default: 0,
  },
  pensionContribution80CCC: {
    type: Number,
    default: 0,
    max: 150000,
  },
  npsEmployeeContribution: {
    type: Number,
    default: 0,
  },
  npsEmployerContribution: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("TaxInvestment", TaxInvestmentSchema);
