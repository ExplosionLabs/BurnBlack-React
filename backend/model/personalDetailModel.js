const mongoose = require("mongoose");

const personalDetailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  firstName: { type: String },
  middleName: { type: String },
  lastName: { type: String },
  dob: { type: Date },
  martialStatus: {
    type: String,
  },
});

module.exports = mongoose.model("PersonalDetail", personalDetailSchema);
