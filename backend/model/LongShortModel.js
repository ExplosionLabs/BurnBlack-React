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
      shortTotalAmountDeemed: String,
      shortUnutilizedCapitalGain: String,
      shortEntries: [EntrySchemaShort], // Embedded sub-schema for short entries
    },
    longTermDetails: {
      longTermCapitalGain: String,
      longOtherAmountDeemed: String,
      longTotalAmountDeemed: String,
      unutilizedCapitalGain: String,
      longEntries: [EntrySchemaLong], // Embedded sub-schema for long entries
    },
  },
  { timestamps: true }
);

const LongShortModel = mongoose.model("LongShortModel", longShortSchema);

module.exports = LongShortModel;
