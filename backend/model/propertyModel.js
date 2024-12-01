const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  propertyType: String,
  houseAddress: {
    flatNo: String,
    premiseName: String,
    roadStreet: String,
    areaLocality: String,
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
});

const Property = mongoose.model("Property", propertySchema);
module.exports = Property;
