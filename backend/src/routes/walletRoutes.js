const express = require("express");
const router = express.Router();
const {
  getWallet,
  createAddMoneyOrder,
  verifyPayment,
} = require("../controller/walletController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.get("/getWallet", authMiddleware, getWallet);
router.post("/add-money", authMiddleware, createAddMoneyOrder);
router.post("/verify-payment", authMiddleware, verifyPayment);

module.exports = router;
