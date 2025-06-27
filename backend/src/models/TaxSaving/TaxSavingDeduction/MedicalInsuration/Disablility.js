const mongoose = require("mongoose");

const disabiltySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
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

module.exports = mongoose.model("Disability", disabiltySchema);
