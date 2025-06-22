const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  postExemptIncome,
  getExemptIncome,
  postAgriculturalIncome,
  getAgriculturalIncome,
  postBusinessFund,
  getBusinessFund,
  updateBusinessFund
} = require('../controllers/OtherIncomeController');

// Exempt Income Routes
router.post('/exempt', authMiddleware, postExemptIncome);
router.get('/exempt/:type', authMiddleware, getExemptIncome);

// Agricultural Income Routes
router.post('/agricultural', authMiddleware, postAgriculturalIncome);
router.get('/agricultural', authMiddleware, getAgriculturalIncome);

// Business Fund Routes
router.post('/business-fund', authMiddleware, postBusinessFund);
router.get('/business-fund/:section', authMiddleware, getBusinessFund);
router.put('/business-fund/:id', authMiddleware, updateBusinessFund);

module.exports = router; 