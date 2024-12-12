const mongoose = require("mongoose");

const bondDebentureSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assetType: { type: String }, // e.g., "Stocks" or "Mutual Funds"
    assetSubType: { type: String }, // Listed Securities, Non Listed Securities, etc.
    dateOfSale: { type: Date },
    dateOfPurchase: { type: Date },
    description: { type: String },
    salePrice: { type: Number },
    transferExpenses: { type: Number },
    purchasePrice: { type: Number },
    totalProfit: { type: Number, default: 0 },
  },
  { timestamps: true }
);

bondDebentureSchema.pre("save", function (next) {
  // Ensure all required fields are present
  if (
    this.salePrice &&
    this.purchasePrice &&
    this.transferExpenses !== undefined
  ) {
    // Calculate totalProfit
    this.totalProfit =
      this.salePrice - this.transferExpenses - this.purchasePrice;
  }
  next();
});
module.exports = mongoose.model("BondDebenture", bondDebentureSchema);
