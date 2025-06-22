const mongoose = require("mongoose");

const NonSalarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true,
  },
  tan: String,
  name: String,
  totalTax: Number,
  transferTDS: Boolean,
  tdsCreditRelating: String,
  tdsCredit: Number,
  incomeRelatingTDS: Number,
  panOtherPerson: String,
  taxClaimed: Number,
  incomeAgainstTDS: Number,
  typeOfIncome: String,
  financialYear: String,
});

module.exports = mongoose.model("NonSalary", NonSalarySchema);
