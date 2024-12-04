// models/Dividend.js
const mongoose = require("mongoose");

const dividedSchema = new mongoose.Schema({
  narration: String,
  amount: Number,
  dateOfReceipt: Date,
});

const DividendSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    dividendIncome: [dividedSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("DividendIncome", DividendSchema);
