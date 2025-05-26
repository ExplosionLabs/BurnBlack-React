const {
  registerController,
  loginController,
  signupGoogleController,
} = require("../controller/authController");
const { rateLimiter } = require("../middleware/security");
const router = require("express").Router();

// Apply rate limiting to sensitive endpoints
router.post("/register", rateLimiter, registerController);
router.post("/login", rateLimiter, loginController);
router.post("/google-signup", signupGoogleController);
// router.post("/send-phone-otp", rateLimiter, sendOtpPhone);
// router.post("/send-email-otp", rateLimiter, sendOtpEmail);
// router.post("/verify-otp", rateLimiter, verifyOtp);

module.exports = router;
