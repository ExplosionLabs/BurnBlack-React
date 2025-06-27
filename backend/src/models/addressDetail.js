const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    flatNo: {
      type: String,
    },
    premiseName: {
      type: String,
    },
    road: {
      type: String,
    },
    area: {
      type: String,
    },
    pincode: {
      type: String,
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
