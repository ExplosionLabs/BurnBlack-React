const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rentalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  propertyType: String,
  houseAddress: {
    flatNo: String,
    premiseName: String,
    road: String,
    area: String,
    pincode: String,
    country: String,
    state: String,
    city: String,
  },
  ownerDetails: {
    ownerName: String,
    ownerPan: String,
    ownerShare: Number,
    hasMultipleOwners: Boolean,
    coOwners: [
      {
        coOwnerName: String,
        coOwnerPan: String,
        coOwnerShare: Number,
      },
    ],
  },
  taxSavings: {
    constructionYear: String,
    interestDuringConstruction: Number,
    interestAfterCompletion: Number,
    totalDeduction: Number,
  },
  rentalIncomeDetails: {
    annualRent: String,
    taxPaid: Number,
    standardDeduction: Number,
    netIncome: Number,
  },
  tentatDetails: [
    {
      name: String,
      panOrTan: String,
      aadhaar: String,
    },
  ],
});

const RentalProperty = mongoose.model("RentalProperty", rentalSchema);
module.exports = RentalProperty;
