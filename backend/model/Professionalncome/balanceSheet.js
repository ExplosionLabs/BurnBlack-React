const mongoose = require("mongoose");

const balanceSheetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    longTermHold: { type: Number },
    shortTermHold: { type: Number },
    cash: { type: Number },
    balanceBank: { type: Number },
    otherAssets: { type: Number },
    totalAssest: { type: Number },

    capitalInvestment: { type: Number },
    securedLoan: { type: Number },
    totatLiablities: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("balanceSheet", balanceSheetSchema);
