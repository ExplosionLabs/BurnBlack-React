const mongoose = require("mongoose");

const BussinesFundSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    section: { type: String },
    entityType: { type: String },
    entityName: { type: String },
    entityPAN: { type: String },
    incomeShare: { type: Number },
    lossShare: { type: Number },
    tdsAmount: { type: Number },
    natureOfIncome: { type: String },
    periodOfReceipt: { type: String },
    descriptionCode: { type: String },
  },
  { timestamps: true }
);

const BussinessFund = mongoose.model("BussinessFund", BussinesFundSchema);
module.exports = BussinessFund;
