const mongoose = require("mongoose");

const stockMutualAssestSchema = new mongoose.Schema(
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
    sttPaid: { type: Boolean },
    totalProfit: { type: Number, default: 0 }, // Field to store the total profit
  },
  { timestamps: true }
);

// Pre-save hook to calculate totalProfit
stockMutualAssestSchema.pre("save", function (next) {
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

module.exports = mongoose.model(
  "StockMutualAssestSchema",
  stockMutualAssestSchema
);
