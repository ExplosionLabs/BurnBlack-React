const mongoose = require("mongoose");

const profitLossSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    turnOverOption: { type: Number },
    turnOverFuture: { type: Number },
    turnOverCurrency: { type: Number },
    turnOverCommudity: { type: Number },
    totalIncome: { type: Number },
    pValueFuture: { type: Number },
    pValueOption: { type: Number },
    pValueCurrecy: { type: Number },
    pValueCommudity: { type: Number },
    otherBrokerageExpenses: { type: Number },
    totalExpenses: { type: Number },
    totalProfit: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("profitLoss", profitLossSchema);
