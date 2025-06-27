const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  updateFinanceParticulars,
  getFinanceParticulars,
  updateProfitLoss,
  getProfitLoss,
  updateBalanceSheet,
  getBalanceSheet,
  postDepreciation,
  getDepreciation,
  updateDepreciation
} = require('../controllers/BusinessController');

// Finance Particulars Routes
router.post('/finance-particulars', authMiddleware, updateFinanceParticulars);
router.get('/finance-particulars', authMiddleware, getFinanceParticulars);

// Profit & Loss Routes
router.post('/profit-loss', authMiddleware, updateProfitLoss);
router.get('/profit-loss', authMiddleware, getProfitLoss);

// Balance Sheet Routes
router.post('/balance-sheet', authMiddleware, updateBalanceSheet);
router.get('/balance-sheet', authMiddleware, getBalanceSheet);

// Depreciation Routes
router.post('/depreciation', authMiddleware, postDepreciation);
router.get('/depreciation', authMiddleware, getDepreciation);
router.put('/depreciation/:id', authMiddleware, updateDepreciation);

module.exports = router; 