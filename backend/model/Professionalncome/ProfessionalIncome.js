// models/Dividend.js
const mongoose = require("mongoose");

const professionDetailSchema = new mongoose.Schema({
  professionTypes: String,
  natureOfProfessions: String,
  companyNames: String,
  descriptions: String,
});

const professionalIncomeSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProfessionalIncome", professionalIncomeSchema);
