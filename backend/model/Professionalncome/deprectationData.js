// models/Dividend.js
const mongoose = require("mongoose");

const deprectationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    deprectationBlock: { type: String },
    description: { type: String },
    openingAmount: { type: Number },
    purAmtuptoOct4: { type: Number },
    saleAmtuptoOct4: { type: Number },
    purAmtfromOct5: { type: Number },
    saleAmtfromOct5: { type: Number },
    dateofSale: { type: String },
    perUsePer: { type: String },
    addDepreciation: { type: Number },
    blockNil: { type: String },
    additonlDep: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeprectationData", deprectationSchema);
