const mongoose = require("mongoose");

const OtherDeductionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  copyRightFee: {
    type: Number,
  },
  patentIncome: {
    type: Number,
  },
  bioWasteIncome: {
    type: Number,
  },
  agniPathContri: {
    type: Number,
  },
  rentPerMonth: {
    type: Number,
  },
  noOFMonth: {
    type: Number,
  },
});

module.exports = mongoose.model("OtherDeduction", OtherDeductionSchema);
