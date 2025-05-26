const User = require("../models/User");
const OtpModel = require("../models/OtpModel");
const UserService = require('../services/UserService');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register User
exports.register = catchAsync(async (req, res, next) => {
  const result = await UserService.registerUser(req.body);
  
  res.status(201).json({
    status: 'success',
    data: result
  });
});

// Login User
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const result = await UserService.loginUser(email, password);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

// Get User Profile
exports.getProfile = catchAsync(async (req, res, next) => {
  const profile = await UserService.getUserProfile(req.user.id);
  
  res.status(200).json({
    status: 'success',
    data: profile
  });
});

// Update User Profile
exports.updateProfile = catchAsync(async (req, res, next) => {
  const profile = await UserService.updateUserProfile(req.user.id, req.body);
  
  res.status(200).json({
    status: 'success',
    data: profile
  });
});

// Change Password
exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const result = await UserService.changePassword(
    req.user.id,
    currentPassword,
    newPassword
  );
  
  res.status(200).json({
    status: 'success',
    ...result
  });
});

// Google Signup/Login
exports.googleAuth = catchAsync(async (req, res, next) => {
  const { token } = req.body;

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
      googleId: sub
    });
  }

  const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.status(200).json({
    status: 'success',
    data: {
      token: jwtToken,
      user
    }
  });
});

// Note: OTP related functions are commented out as they need to be implemented
// with proper email/SMS service integration. They will be moved to a separate
// VerificationController when implemented. 