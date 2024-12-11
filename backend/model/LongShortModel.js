const mongoose = require("mongoose");

const EntrySchemaShort = new mongoose.Schema({
  shortPrevYear: Number,
  shortSection: String,
  shortYearNewAsset: Number,
  shortAmountUtilised: Number,
  shortAmountNotUsed: Number,
});

const EntrySchemaLong = new mongoose.Schema({
  longPrevYear: Number,
  longSection: String,
  longYearNewAsset: Number,
  longAmountUtilised: Number,
  longAmountNotUsed: Number,
});

const longShortSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shortTermDetails: {
      shortTermCapitalGain: String,
      shortOtherAmountDeemed: String,
      shortTotalAmountDeemed: { type: String, default: "0" },
      shortUnutilizedCapitalGain: String,
      shortEntries: [EntrySchemaShort], // Embedded sub-schema for short entries
    },
    longTermDetails: {
      longTermCapitalGain: String,
      longOtherAmountDeemed: String,
      longTotalAmountDeemed: { type: String, default: "0" },
      unutilizedCapitalGain: String,
      longEntries: [EntrySchemaLong], // Embedded sub-schema for long entries
    },
  },
  { timestamps: true }
);

// Pre-save hook to calculate and set longTotalAmountDeemed and shortTotalAmountDeemed
longShortSchema.pre("save", function (next) {
  // Calculate longTotalAmountDeemed
  const longOtherAmountDeemed =
    parseFloat(this.longTermDetails.longOtherAmountDeemed) || 0;
  const longAmountNotUsed =
    parseFloat(this.longTermDetails.longAmountNotUsed) || 0;
  this.longTermDetails.longTotalAmountDeemed = (
    longOtherAmountDeemed + longAmountNotUsed
  ).toString();

  // Calculate shortTotalAmountDeemed
  const shortOtherAmountDeemed =
    parseFloat(this.shortTermDetails.shortOtherAmountDeemed) || 0;
  const shortAmountNotUsed =
    parseFloat(this.shortTermDetails.shortAmountNotUsed) || 0;
  this.shortTermDetails.shortTotalAmountDeemed = (
    shortOtherAmountDeemed + shortAmountNotUsed
  ).toString();

  next();
});

const LongShortModel = mongoose.model("LongShortModel", longShortSchema);

module.exports = LongShortModel;
