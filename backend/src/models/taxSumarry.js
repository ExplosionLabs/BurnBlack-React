const { default: mongoose } = require("mongoose");

// Example with Mongoose (MongoDB)
const TaxSummarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  grossIncome: Number,
  taxableIncome: Number,
  totalDeductions: Number,
  taxLiability: Number,
  taxPaid: Number,
  taxDue: Number,
  incomeTaxAtNormalRates: Number,
  healthAndEducationCess: Number,
  itrType: String,
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TaxSummary", TaxSummarySchema);
