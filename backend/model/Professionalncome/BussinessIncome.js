// models/Dividend.js
const mongoose = require("mongoose");

const professionDetailSchema = new mongoose.Schema({
  professionTypes: String,
  natureOfProfessions: String,
  companyNames: String,
  descriptions: String,
});

const businessIncomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    professionDetail: [professionDetailSchema],
    revenueCash: Number,
    revenueMode: Number,
    revenueDigitalMode: Number,
    totalRevenue: Number,
    profitcash: Number,
    profitMode: Number,
    profitDigitalMode: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("BussinessIncome", businessIncomeSchema);
