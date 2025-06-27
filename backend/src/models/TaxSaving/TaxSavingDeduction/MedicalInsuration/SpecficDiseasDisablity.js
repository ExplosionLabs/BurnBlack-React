const mongoose = require("mongoose");

const SpecficDieaseDisabilitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  selfDisability: {
    hasDisability: {
      type: String,
    },
    disabilityType: {
      type: String,
    },
    form10IA: {
      fillingDate: {
        type: String,
      },
      ackNo: {
        type: String,
      },
      uuidNo: {
        type: String,
      },
    },
  },
  specificDisease: {
    age: {
      type: String,
    },
    costOfTreatment: {
      type: Number,
    },
  },
});

module.exports = mongoose.model(
  "SpecificDiseases",
  SpecficDieaseDisabilitySchema
);
