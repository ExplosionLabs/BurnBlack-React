const {
  posttaxInvestmentController,
  getTaxInvestmentController,
  post80GDonationController,
  get80GDonationController,
  postRuralGDonationController,
  getRuralDonationController,
  postContriPartyController,
  getContriPartyController,
  postMedical80DController,
  getMedical80DController,
  postDisablityController,
  getDisablilityController,
  postSpecficDieaseController,
  getSpecificDieaseaseController,
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
router.put("/postMedical80D", authMiddleware, postMedical80DController);
router.get("/getMedical80D", authMiddleware, getMedical80DController);
router.put("/postDisablity", authMiddleware, postDisablityController);
router.get("/getDisablity", authMiddleware, getDisablilityController);
router.put(
  "/postSpecificDisablity",
  authMiddleware,
  postSpecficDieaseController
);
router.get(
  "/getSpecificDisablity",
  authMiddleware,
  getSpecificDieaseaseController
);
module.exports = router;
