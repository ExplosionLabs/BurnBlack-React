const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the land form
const improvementDetailsSchema = new Schema({
  description: { type: String },
  amount: { type: Number },
});

const goldFormSchema = new Schema(
  {
    dateOfSale: { type: Date },
    dateOfPurchase: { type: Date },
    description: { type: String },
    salePrice: { type: String },
    transferExpenses: { type: String },
    purchasePrice: { type: String },
    improvementDetails: [improvementDetailsSchema],
    addCostImprovement: { type: Boolean },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Create the model
const GoldForm = mongoose.model("GoldForm", goldFormSchema);

module.exports = GoldForm;
