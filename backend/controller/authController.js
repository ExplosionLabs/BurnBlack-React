const Otpmodel = require("../model/Otpmodel");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const userService = require('../services/UserService');

// Register User
const register = async (req, res) => {
  try {
    const result = await userService.registerUser(req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

// Get User Profile
const getProfile = async (req, res) => {
  try {
    const profile = await userService.getUserProfile(req.user.id);
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// Update User Profile
const updateProfile = async (req, res) => {
  try {
    const profile = await userService.updateUserProfile(req.user.id, req.body);
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await userService.changePassword(
      req.user.id,
      currentPassword,
      newPassword
    );
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signupGoogleController = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub } = payload;

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user
      user = await User.create({
        email,
        name,
      });
    }
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Return user data
    res.json({ token: jwtToken, user });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid Google token" });
  }
};
// const sendOtpPhone = async (req, res) => {
//   const { phoneNumber } = req.body;
//   const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

//   try {
//     // Save OTP to database
//     await Otpmodel.create({
//       type: "phone",
//       identifier: phoneNumber,
//       otp: otp,
//     });

//     // Log OTP for testing (replace with actual SMS service)
//     console.log("Phone OTP:", otp);

//     res.status(200).json({ message: "OTP sent to phone number" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to send OTP" });
//   }
// };
// const sendOtpEmail = async (req, res) => {
//   const { email } = req.body;
//   const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

//   try {
//     // Save OTP to database
//     await Otpmodel.create({
//       type: "email",
//       identifier: email,
//       otp: otp,
//     });

//     // Log OTP for testing (replace with actual email service)
//     console.log("Email OTP:", otp);

//     res.status(200).json({ message: "OTP sent to email" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to send OTP" });
//   }
// };

// const verifyOtp = async (req, res) => {
//   const { otp, type, identifier } = req.body;

//   try {
//     // Find OTP in the database
//     const otpRecord = await Otpmodel.findOne({ type, identifier });

//     console.log("otp record");
//     if (!otpRecord) {
//       return res
//         .status(400)
//         .json({ error: `OTP verified. Proceed to register.` });
//     }

//     // Check if OTP matches
//     if (otpRecord.otp === otp) {
//       // Delete OTP after successful verification
//       await Otpmodel.deleteOne({ _id: otpRecord._id });

//       return res
//         .status(200)
//         .json({ message: `OTP verified. Proceed to register.` });
//     } else {
//       return res.status(400).json({ error: "Invalid OTP." });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to verify OTP." });
//   }
// };

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  signupGoogleController,
};
