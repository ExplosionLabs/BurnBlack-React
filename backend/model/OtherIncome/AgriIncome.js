const mongoose = require("mongoose");
const AgricultureSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  generalDetails: {
    grossReceipt: String,
    expenditure: String,
    loss: String,
  },
  landDetails: [
    {
      district: String,
      pincode: String,
      measurement: String,
      ownership: String,
      waterSource: String,
    },
  ],
});

const Agriculture = mongoose.model("Agriculture", AgricultureSchema);
module.exports = Agriculture;
