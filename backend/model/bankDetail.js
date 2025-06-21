const mongoose = require("mongoose");

const BankDetailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    bankDetails: [
      {
        accountNo: { type: String },
        ifscCode: { type: String },
        bankName: { type: String },
        type: { type: String },
      },
    ],
  },
  { timestamps: true },

  { versionKey: false }
);

module.exports = mongoose.model("BankDetail", BankDetailSchema);
