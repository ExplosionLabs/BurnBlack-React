const {
  registerController,
  verifyOtp,
  sendOtpEmail,
  sendOtpPhone,
} = require("../controller/authController");

const router = require("express").Router();

router.post("/register", registerController);
// router.post("/send-phone-otp", sendOtpPhone);
// router.post("/send-email-otp", sendOtpEmail);
// router.post("/verify-otp", verifyOtp);

module.exports = router;
