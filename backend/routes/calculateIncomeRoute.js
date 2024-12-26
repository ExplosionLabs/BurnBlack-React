const taxableIncomeController = require("../controller/incomeCalculator");

const router = require("express").Router();

const authMiddleware = require("../middlewares/authMiddleware");

router.get("/getTaxableIncome", authMiddleware, taxableIncomeController);

module.exports = router;
