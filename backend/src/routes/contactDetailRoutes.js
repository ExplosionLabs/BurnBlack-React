const express = require('express');
const router = express.Router();
const ContactDetailService = require('../services/contactDetailService');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { contactDetailValidation } = require('../validations/contactDetailValidations');

// All routes are protected
router.use(protect);

// Get contact details
router.get('/', async (req, res, next) => {
  try {
    const contactDetails = await ContactDetailService.getContactDetails(req.user.id);
    res.json({
      success: true,
      data: {
        contactDetails: {
          aadharNumber: contactDetails.aadharNumber,
          panNumber: contactDetails.panNumber,
          mobileNumber: contactDetails.mobileNumber,
          email: contactDetails.email,
          secondaryMobileNumber: contactDetails.secondaryMobileNumber,
          secondaryEmail: contactDetails.secondaryEmail,
          landlineNumber: contactDetails.landlineNumber,
          isAadharVerified: contactDetails.isAadharVerified,
          isPanVerified: contactDetails.isPanVerified,
          isMobileVerified: contactDetails.isMobileVerified,
          isEmailVerified: contactDetails.isEmailVerified
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Create or update contact details
router.post('/', validate(contactDetailValidation), async (req, res, next) => {
  try {
    const contactDetails = await ContactDetailService.upsertContactDetails(req.user.id, req.body);
    res.json({
      success: true,
      data: {
        contactDetails: {
          aadharNumber: contactDetails.aadharNumber,
          panNumber: contactDetails.panNumber,
          mobileNumber: contactDetails.mobileNumber,
          email: contactDetails.email,
          secondaryMobileNumber: contactDetails.secondaryMobileNumber,
          secondaryEmail: contactDetails.secondaryEmail,
          landlineNumber: contactDetails.landlineNumber,
          isAadharVerified: contactDetails.isAadharVerified,
          isPanVerified: contactDetails.isPanVerified,
          isMobileVerified: contactDetails.isMobileVerified,
          isEmailVerified: contactDetails.isEmailVerified
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Delete contact details
router.delete('/', async (req, res, next) => {
  try {
    await ContactDetailService.deleteContactDetails(req.user.id);
    res.json({
      success: true,
      message: 'Contact details deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Update verification status
router.patch('/verify/:field', async (req, res, next) => {
  try {
    const { field } = req.params;
    const { status } = req.body;
    
    if (typeof status !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Status must be a boolean value'
      });
    }

    const contactDetails = await ContactDetailService.updateVerificationStatus(
      req.user.id,
      field,
      status
    );

    res.json({
      success: true,
      data: {
        contactDetails: {
          aadharNumber: contactDetails.aadharNumber,
          panNumber: contactDetails.panNumber,
          mobileNumber: contactDetails.mobileNumber,
          email: contactDetails.email,
          isAadharVerified: contactDetails.isAadharVerified,
          isPanVerified: contactDetails.isPanVerified,
          isMobileVerified: contactDetails.isMobileVerified,
          isEmailVerified: contactDetails.isEmailVerified
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Check profile completion status
router.get('/status', async (req, res, next) => {
  try {
    const isComplete = await ContactDetailService.isProfileComplete(req.user.id);
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