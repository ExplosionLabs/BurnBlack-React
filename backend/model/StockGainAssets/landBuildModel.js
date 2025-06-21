const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the land form
const improvementDetailsSchema = new Schema({
  description: { type: String },
  amount: { type: Number },
});

const buyerSchema = new Schema({
  buyerName: { type: String },
  ownershipPercentage: { type: String },
  aadhaar: { type: String },
  pan: { type: String },
  amountPaid: { type: String },
});

const propertyAddressSchema = new Schema({
  pincode: { type: String },
  addressLine: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
});

const landFormSchema = new Schema(
  {
    assetSubType: { type: String },
    dateOfSale: { type: Date },
    dateOfPurchase: { type: Date },
    description: { type: String },
    salePrice: { type: String },
    transferExpenses: { type: String },
    purchasePrice: { type: String },
    stampDutyPrice: { type: String },
    totalProfit: { type: Number, default: 0 },
    isHouseProperty: { type: Boolean },
    improvementDetails: [improvementDetailsSchema],
    propertyAddress: propertyAddressSchema,
    buyers: [buyerSchema],
    addCostImprovement: { type: Boolean },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

landFormSchema.pre("save", function (next) {
  // Ensure all required fields are present
  if (
    this.salePrice &&
    this.purchasePrice &&
    this.transferExpenses !== undefined
  ) {
    // Calculate totalProfit
    this.totalProfit =
      this.salePrice - this.transferExpenses - this.purchasePrice;
  }
  next();
});

// Create the model
const LandForm = mongoose.model("LandForm", landFormSchema);

module.exports = LandForm;
