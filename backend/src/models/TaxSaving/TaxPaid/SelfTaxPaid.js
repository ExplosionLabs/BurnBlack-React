const mongoose = require("mongoose");

const selfTaxPaidSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  amount: { type: Number },
  date: { type: Date },
  bsrCode: { type: String },
  challanSerialNo: { type: String },
});

module.exports = mongoose.model("SelfTaxPaid", selfTaxPaidSchema);
