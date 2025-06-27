const mongoose = require("mongoose");

const FinanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  unsettledPayables: { type: Number, default: 0 },
  outstandingPrincipalSecured: { type: Number, default: 0 },
  outstandingPrincipalUnsecured: { type: Number, default: 0 },
  advances: { type: Number, default: 0 },
  amountsReceivedInAdvance: { type: Number, default: 0 },
  capitalInvestment: { type: Number, default: 0 },
  otherLiabilities: { type: Number, default: 0 },
  uncollectedReceivables: { type: Number, default: 0 },
  totalInventoryValue: { type: Number, default: 0 },
  fixedAssets: { type: Number, default: 0 },
  closingBalanceWithBanks: { type: Number, default: 0 },
  financeparticulars: { type: Number, default: 0 },
  otherAssets: { type: Number, default: 0 },
});

module.exports = mongoose.model("FinanceParticular", FinanceSchema);
