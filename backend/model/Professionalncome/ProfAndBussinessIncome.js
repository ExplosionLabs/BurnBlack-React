// models/Dividend.js
const mongoose = require("mongoose");

const professionDetailSchema = new mongoose.Schema({
  professionTypes: String,
  natureOfProfessions: String,
  companyNames: String,
  descriptions: String,
});

const profandBussinessIncomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    professionDetail: [professionDetailSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ProfandBussinessIncome",
  profandBussinessIncomeSchema
);
