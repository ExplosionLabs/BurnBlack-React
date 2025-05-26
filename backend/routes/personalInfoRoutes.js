const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  updatePersonalDetails,
  getPersonalDetails,
  updateContactDetails,
  getContactDetails,
  updateAddressDetails,
  getAddressDetails,
  updateBankDetails,
  getBankDetails
} = require('../controllers/PersonalInfoController');

// Personal Details Routes
router.post('/personal-details', authMiddleware, updatePersonalDetails);
router.get('/personal-details', authMiddleware, getPersonalDetails);

// Contact Details Routes
router.post('/contact-details', authMiddleware, updateContactDetails);
router.get('/contact-details', authMiddleware, getContactDetails);

// Address Details Routes
router.post('/address-details', authMiddleware, updateAddressDetails);
router.get('/address-details', authMiddleware, getAddressDetails);

// Bank Details Routes
router.post('/bank-details', authMiddleware, updateBankDetails);
router.get('/bank-details', authMiddleware, getBankDetails);

module.exports = router; 