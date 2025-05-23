const mongoose = require("mongoose");

const InterestIncomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "Savings Bank",
        "Fixed Deposits",
        "P2P Investments",
        "Bond Investments",
        "Provident Fund",
        "Income Tax Refund",
        "Other Interest Income",
      ],
      required: true,
    },
    data: [
      {
        fieldType: { type: String },
        name: { type: String }, // For "Savings Bank", "P2P Investments", "Bond Investments"
        description: { type: String }, // For "Fixed Deposits"
        amount: { type: Number, required: true }, // Shared across all
      },
    ],
  },
  { timestamps: true }
);

const IncomeInterest = mongoose.model("IncomeInterest", InterestIncomeSchema);
module.exports = IncomeInterest;
