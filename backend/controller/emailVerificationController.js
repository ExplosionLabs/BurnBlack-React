const User = require('../model/User');
const EmailVerificationToken = require('../model/EmailVerificationToken');
const { generateToken, sendEmail } = require('../utils/emailService');

// Send verification email
const sendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Check if user can request new verification email
    if (!user.canRequestVerificationEmail) {
      return res.status(429).json({
        success: false,
        message: 'Please wait before requesting another verification email'
      });
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

    res.json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification email'
    });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    // Find token
    const verificationToken = await EmailVerificationToken.findOne({ token });
    if (!verificationToken) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Check if token is valid
    if (!verificationToken.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Token has expired or has already been used'
      });
    }

    // Find user
    const user = await User.findById(verificationToken.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
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

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify email'
    });
  }
};

module.exports = {
  sendVerificationEmail,
  verifyEmail
}; 