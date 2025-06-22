const express = require('express');
const router = express.Router();
const { UserService } = require('../services');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const {
  registerValidation,
  loginValidation,
  updatePasswordValidation,
  resetPasswordValidation,
  googleAuthValidation
} = require('../validations/authValidations');

// Public routes
router.post('/register', validate(registerValidation), async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const user = await UserService.registerUser({ name, email, password, phone });
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', validate(loginValidation), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await UserService.loginUser(email, password);
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/google', validate(googleAuthValidation), async (req, res, next) => {
  try {
    const { token } = req.body;
    const { user, authToken } = await UserService.googleAuth(token);
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone
        },
        token: authToken
      }
    });
  } catch (error) {
    next(error);
  }
});

// Protected routes
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.user.id);
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

router.put('/update-password', protect, validate(updatePasswordValidation), async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await UserService.updatePassword(req.user.id, currentPassword, newPassword);
    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    await UserService.forgotPassword(email);
    res.json({
      success: true,
      message: 'Password reset instructions sent to email'
    });
  } catch (error) {
    next(error);
  }
});

router.post('/reset-password', validate(resetPasswordValidation), async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    await UserService.resetPassword(token, newPassword);
    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 