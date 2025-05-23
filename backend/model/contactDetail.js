const mongoose = require("mongoose");

const contactDetailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    aadharNumber: {
      type: String,
    },
    panNumber: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    email: {
      type: String,
    },
    secondaryMobileNumber: {
      type: String,
    },
    secondaryEmail: {
      type: String,
    },
    landlineNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactDetail", contactDetailSchema);
