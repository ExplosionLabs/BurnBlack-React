const mongoose = require("mongoose");

const depLossSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true,
  },
  losses: [
    {
      year: String,
      filingDate: String,
      category: String,
      amount: Number,
    },
  ],
  hasDepreciationLoss: Boolean,
  depreciationLosses: [
    {
      year: String,
      amount: Number,
    },
  ],
});

module.exports = mongoose.model("DeprectationLoss", depLossSchema);
