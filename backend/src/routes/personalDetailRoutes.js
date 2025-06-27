const express = require('express');
const router = express.Router();
const PersonalDetailService = require('../services/personalDetailService');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { personalDetailValidation } = require('../validations/personalDetailValidations');

// All routes are protected
router.use(protect);

// Get personal details
router.get('/', async (req, res, next) => {
  try {
    const personalDetails = await PersonalDetailService.getPersonalDetails(req.user.id);
    res.json({
      success: true,
      data: {
        personalDetails: {
          firstName: personalDetails.firstName,
          middleName: personalDetails.middleName,
          lastName: personalDetails.lastName,
          fullName: personalDetails.fullName,
          dob: personalDetails.dob,
          gender: personalDetails.gender,
          maritalStatus: personalDetails.maritalStatus
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Create or update personal details
router.post('/', validate(personalDetailValidation), async (req, res, next) => {
  try {
    const personalDetails = await PersonalDetailService.upsertPersonalDetails(req.user.id, req.body);
    res.json({
      success: true,
      data: {
        personalDetails: {
          firstName: personalDetails.firstName,
          middleName: personalDetails.middleName,
          lastName: personalDetails.lastName,
          fullName: personalDetails.fullName,
          dob: personalDetails.dob,
          gender: personalDetails.gender,
          maritalStatus: personalDetails.maritalStatus
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Delete personal details
router.delete('/', async (req, res, next) => {
  try {
    await PersonalDetailService.deletePersonalDetails(req.user.id);
    res.json({
      success: true,
      message: 'Personal details deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Check profile completion status
router.get('/status', async (req, res, next) => {
  try {
    const isComplete = await PersonalDetailService.isProfileComplete(req.user.id);
    res.json({
      success: true,
      data: {
        isProfileComplete: isComplete
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 