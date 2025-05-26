const User = require('../models/User');
const EmailVerificationToken = require('../models/EmailVerificationToken');
const { generateToken, sendEmail } = require('../utils/emailService');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Send verification email
exports.sendVerificationEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check if email is already verified
  if (user.emailVerified) {
    return next(new AppError('Email is already verified', 400));
  }

  // Check if user can request new verification email
  if (!user.canRequestVerificationEmail) {
    return next(new AppError('Please wait before requesting another verification email', 429));
  }

  // Generate token
  const token = generateToken();

  // Create verification token
  await EmailVerificationToken.create({
    userId: user._id,
    token,
    email: user.email
  });

  // Update last verification email sent timestamp
  user.lastVerificationEmailSent = new Date();
  await user.save();

  // Generate verification URL
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  // Send verification email
  await sendEmail(user.email, 'verification', {
    name: user.name,
    verificationUrl
  });

  res.status(200).json({
    status: 'success',
    message: 'Verification email sent successfully'
  });
});

// Verify email
exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.body;

  // Find token
  const verificationToken = await EmailVerificationToken.findOne({ token });
  if (!verificationToken) {
    return next(new AppError('Invalid or expired verification token', 400));
  }

  // Check if token is valid
  if (!verificationToken.isValid()) {
    return next(new AppError('Token has expired or has already been used', 400));
  }

  // Find user
  const user = await User.findById(verificationToken.userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Update user verification status
  user.emailVerified = true;
  user.emailVerificationDate = new Date();
  await user.save();

  // Mark token as used
  verificationToken.used = true;
  await verificationToken.save();

  // Send success email
  await sendEmail(user.email, 'verificationSuccess', {
    name: user.name
  });

  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully'
  });
}); 