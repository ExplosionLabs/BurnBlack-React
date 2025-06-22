const {
  taxableIncomeController,
  getTaxPaidController,
} = require("../controller/incomeCalculator");

const router = require("express").Router();

const { authMiddleware } = require("../middlewares/authMiddleware");

router.get("/getTaxableIncome", authMiddleware, taxableIncomeController);
router.get("/getTaxPaid", authMiddleware, getTaxPaidController);

module.exports = router;
