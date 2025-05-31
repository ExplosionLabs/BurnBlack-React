const {
  registerController,
  loginController,
  signupGoogleController,
  forgotPasswordController,
  resetPasswordController,
} = require("../controller/authController");

const router = require("express").Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/google-signup", signupGoogleController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

module.exports = router;
