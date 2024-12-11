const mongoose = require("mongoose");

const foreignAsestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assetSubType: { type: String },
    dateOfSale: { type: Date },
    dateOfPurchase: { type: Date },
    description: { type: String },
    salePrice: { type: Number },
    transferExpenses: { type: Number },
    purchasePrice: { type: Number },
    sttPaid: { type: Boolean },
    totalProfit: { type: Number, default: 0 },
  },
  { timestamps: true }
);

foreignAsestSchema.pre("save", function (next) {
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
module.exports = mongoose.model("ForeignAsest", foreignAsestSchema);
