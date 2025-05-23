const mongoose = require("mongoose");

const stockRsuSchema = new mongoose.Schema(
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
    exercisePrice: { type: Number },
    fairValue: { type: Number },
    sttPaid: { type: Boolean },
    totalProfit: { type: Number, default: 0 },
  },
  { timestamps: true }
);

stockRsuSchema.pre("save", function (next) {
  // Ensure all required fields are present
  if (
    this.salePrice &&
    this.exercisePrice &&
    this.transferExpenses !== undefined
  ) {
    // Calculate totalProfit
    this.totalProfit =
      this.salePrice - this.transferExpenses - this.purchasePrice;
  }
  next();
});
module.exports = mongoose.model("StockRsuData", stockRsuSchema);
