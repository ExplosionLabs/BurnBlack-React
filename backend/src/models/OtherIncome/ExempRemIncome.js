const mongoose = require("mongoose");

const ExcemptRemIncomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "Lottery and Gift",
        "Online Gaming",
        "Invoice Discounting",
        "Income from Other Sources",
      ],
      required: true,
    },
    data: [
      {
        name: { type: String },
        fieldType: { type: String },
        description: { type: String }, // For "Fixed Deposits"
        amount: { type: Number, required: true }, // Shared across all
      },
    ],
  },
  { timestamps: true }
);

const ExcemptRemIncome = mongoose.model(
  "ExcempRemIncome",
  ExcemptRemIncomeSchema
);
module.exports = ExcemptRemIncome;
