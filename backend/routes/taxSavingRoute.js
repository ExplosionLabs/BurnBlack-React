const {
  posttaxInvestmentController,
  getTaxInvestmentController,
  post80GDonationController,
  get80GDonationController,
  postRuralGDonationController,
  getRuralDonationController,
  postContriPartyController,
  getContriPartyController,
} = require("../controller/taxSavingController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.put("/postTaxInvestment", authMiddleware, posttaxInvestmentController);
router.get("/getTaxInvestment", authMiddleware, getTaxInvestmentController);
router.put("/postDonation80G", authMiddleware, post80GDonationController);
router.get("/getDonation80G", authMiddleware, get80GDonationController);
router.put("/postRurualDonation", authMiddleware, postRuralGDonationController);
router.get("/getRuralDonation", authMiddleware, getRuralDonationController);
router.put("/postContriParty", authMiddleware, postContriPartyController);
router.get("/getContriParty", authMiddleware, getContriPartyController);
module.exports = router;
