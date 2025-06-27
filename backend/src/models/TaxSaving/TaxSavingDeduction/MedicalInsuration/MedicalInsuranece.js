const mongoose = require("mongoose");

const Medical80DSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  selfAndFamily: {
    hasInsurance: { type: String },
    premium: { type: String },
    healthCheckup: { type: String },
    isSeniorCitizen: { type: Boolean },
    medicalExpenditure: { type: String },
  },
  parents: {
    hasInsurance: { type: String },
    premium: { type: String },
    healthCheckup: { type: String },
    isSeniorCitizen: { type: Boolean },
    medicalExpenditure: { type: String },
  },
  disabilityDetails: {
    disabilityNature: { type: String },
    dependentType: { type: String },
    panOfDependent: { type: String },
    aadhaarOfDependent: { type: String },
    form10IA: {
      filingDate: { type: String },
      ackNumber: { type: String },
      udidNumber: { type: String },
    },
  },
});

module.exports = mongoose.model("Medical80D", Medical80DSchema);
