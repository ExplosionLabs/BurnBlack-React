const mongoose = require("mongoose");

const TDSRentchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true,
  },
  pan: String,
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

module.exports = mongoose.model("TDSRent", TDSRentchema);
