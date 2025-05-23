const mongoose = require("mongoose");

const SalaryBreakupSchema = new mongoose.Schema({
  type: {
    type: String,
  },
  amount: {
    type: Number,
  },
});

const Form16DataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  employerName: String,
  employerTAN: String,
  employerCategory: String,
  totalTax: String,
  grossSalary: {
    type: Number,
  },
  notifiedIncome: {
    type: Number,
  },
  salaryBreakup: [SalaryBreakupSchema],
  perquisitesAmount: { type: Number },
  perquisites: [{ description: String, amount: String }],
  profitAmount: { type: Number },
  profitsInLieu: [{ description: String, amount: String }],
  notifiedCountry: [{ description: String, amount: String }],
  notifiedIncomeOtherCountry: {
    type: Number,
  },
  previousYearIncomeTax: {
    type: Number,
  },
  exemptAllowance: { type: Number },
  exemptAllowancereakup: [SalaryBreakupSchema],
  balance: {
    type: Number,
  },
  standardDeduction: { type: Number },
  professionalTax: { type: Number },
  reliefUnder89: { type: Number },
  incomeClaimed: { type: Number },
  pincode: { type: Number },
  addressLine: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
});

module.exports = mongoose.model("Form16DataManual", Form16DataSchema);
