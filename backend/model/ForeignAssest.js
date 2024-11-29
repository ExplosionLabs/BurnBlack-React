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
  },
  { timestamps: true }
);

module.exports = mongoose.model("ForeignAsest", foreignAsestSchema);
