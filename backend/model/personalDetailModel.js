const mongoose = require("mongoose");

const personalDetailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    dob: { type: Date },
    gender: {
      type: String,
    },
    maritalStatus: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PersonalDetail", personalDetailSchema);
