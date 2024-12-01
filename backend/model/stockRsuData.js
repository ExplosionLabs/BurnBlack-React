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
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockRsuData", stockRsuSchema);
