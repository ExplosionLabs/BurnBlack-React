const mongoose = require("mongoose");

const ExcemptIncomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["Income from PPF", "Income from NRE", "Other Exempt Income"],
      required: true,
    },
    data: [
      {
        fieldType: { type: String },
        description: { type: String }, // For "Fixed Deposits"
        amount: { type: Number, required: true }, // Shared across all
      },
    ],
  },
  { timestamps: true }
);

const ExcemptIncome = mongoose.model("ExcemptIncome", ExcemptIncomeSchema);
module.exports = ExcemptIncome;
