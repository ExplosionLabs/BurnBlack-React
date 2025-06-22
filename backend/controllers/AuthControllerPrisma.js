const UserService = require('../services/UserServicePrisma');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register User
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, phone, role } = req.body;
  
  // Validate required fields
  if (!name || !email || !password) {
    return next(new AppError('Name, email, and password are required', 400));
  }

  const result = await UserService.registerUser({
    name,
    email,
    password,
    phone,
    role
  });
  
  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: result
  });
});

// Login User
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  // Validate required fields
  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  const result = await UserService.loginUser(email, password);
  
  res.status(200).json({
    status: 'success',
    message: 'Login successful',
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
    message: 'Profile updated successfully',
    data: profile
  });
});

// Google OAuth Login/Register
exports.googleAuth = catchAsync(async (req, res, next) => {
  const { idToken } = req.body;
  
  if (!idToken) {
    return next(new AppError('Google ID token is required', 400));
  }

  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const googleUser = {
      email: payload.email,
      name: payload.name,
      verified: payload.email_verified
    };

    const result = await UserService.handleGoogleAuth(googleUser);
    
    res.status(200).json({
      status: 'success',
      message: 'Google authentication successful',
      data: result
    });
  } catch (error) {
    return next(new AppError('Invalid Google token', 400));
  }
});

// Logout User (optional - mainly for clearing client-side token)
exports.logout = catchAsync(async (req, res, next) => {
  // Since we're using stateless JWT, logout is mainly client-side
  res.status(200).json({
    status: 'success',
    message: 'Logout successful'
  });
});

// Verify Email
exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserService.verifyUserEmail(decoded.userId);
    
    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
      data: user
    });
  } catch (error) {
    return next(new AppError('Invalid or expired verification token', 400));
  }
});

// Request Password Reset
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  
  if (!email) {
    return next(new AppError('Email is required', 400));
  }

  const user = await UserService.findUserByEmail(email);
  if (!user) {
    return next(new AppError('No user found with this email', 404));
  }

  // Generate reset token
  const resetToken = jwt.sign(
    { userId: user.id, purpose: 'password-reset' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // In a real application, send email with reset link
  // For now, return the token (remove in production)
  res.status(200).json({
    status: 'success',
    message: 'Password reset token generated',
    resetToken // Remove this in production - send via email instead
  });
});

// Reset Password
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token, newPassword } = req.body;
  
  if (!token || !newPassword) {
    return next(new AppError('Token and new password are required', 400));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.purpose !== 'password-reset') {
      return next(new AppError('Invalid reset token', 400));
    }

    const user = await UserService.updateUserProfile(decoded.userId, {
      password: newPassword
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Password reset successful',
      data: user
    });
  } catch (error) {
    return next(new AppError('Invalid or expired reset token', 400));
  }
});

// Get All Users (Admin only)
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  const result = await UserService.getAllUsers(page, limit);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

// Delete User (Admin only)
exports.deleteUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  
  if (!userId) {
    return next(new AppError('User ID is required', 400));
  }

  const deletedUser = await UserService.deleteUser(userId);
  
  res.status(200).json({
    status: 'success',
    message: 'User deleted successfully',
    data: deletedUser
  });
});

// Check Authentication Status
exports.checkAuth = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      authenticated: true,
      user: req.user
    }
  });
});