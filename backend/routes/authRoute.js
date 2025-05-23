const {
  registerController,
  loginController,
  signupGoogleController,
} = require("../controller/authController");

const router = require("express").Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/google-signup", signupGoogleController);
// router.post("/send-phone-otp", sendOtpPhone);
// router.post("/send-email-otp", sendOtpEmail);
// router.post("/verify-otp", verifyOtp);

module.exports = router;
