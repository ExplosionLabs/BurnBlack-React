const {
  posttaxInvestmentController,
  getTaxInvestmentController,
} = require("../controller/taxSavingController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.put("/postTaxInvestment", authMiddleware, posttaxInvestmentController);
router.get("/getTaxInvestment", authMiddleware, getTaxInvestmentController);

module.exports = router;
