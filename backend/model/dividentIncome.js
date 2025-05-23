const mongoose = require("mongoose");

const dividedSchema = new mongoose.Schema({
  narration: String,
  amount: Number,
  dateOfReceipt: String,
});

const DividendSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    dividendIncome: [dividedSchema],
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DividendIncome", DividendSchema);
