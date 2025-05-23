const mongoose = require("mongoose");

const PoliticalContriSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  cashAmount: {
    type: Number,
  },
  nonCashAmount: {
    type: Number,
  },
  contriDate: {
    type: String,
  },
  tranNo: {
    type: String,
  },
  ifscCode: {
    type: String,
  },
});

module.exports = mongoose.model("PoliticalContri", PoliticalContriSchema);
