const mongoose = require("mongoose");

const cryptoIncomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assetSubType: { type: String },
    dateOfSale: { type: Date },
    dateOfPurchase: { type: Date },
    assestName: { type: String },
    salePrice: { type: Number },
    purchasePrice: { type: Number },
    totalGains: { type: Number },
    incomeType: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CryptoIncome", cryptoIncomeSchema);
