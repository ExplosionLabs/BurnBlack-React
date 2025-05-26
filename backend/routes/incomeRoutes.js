const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const IncomeService = require('../services/incomeService');
const {
  salaryIncomeSchema,
  businessIncomeSchema,
  propertyIncomeSchema,
  otherIncomeSchema,
  verificationStatusSchema
} = require('../validations/incomeValidation');
const validate = require('../middleware/validationMiddleware');

// Get total income
router.get('/total', protect, async (req, res, next) => {
  try {
    const { financialYear } = req.query;
    const incomeSummary = await IncomeService.calculateTotalIncome(req.user.id, financialYear);
    res.json(incomeSummary);
  } catch (error) {
    next(error);
  }
});

// Get income history
router.get('/history', protect, async (req, res, next) => {
  try {
    const { financialYear } = req.query;
    const incomeHistory = await IncomeService.getIncomeHistory(req.user.id, financialYear);
    res.json(incomeHistory);
  } catch (error) {
    next(error);
  }
});

// Add salary income
router.post('/salary', protect, validate(salaryIncomeSchema), async (req, res, next) => {
  try {
    const salaryIncome = await IncomeService.addSalaryIncome(req.user.id, req.body);
    res.status(201).json(salaryIncome);
  } catch (error) {
    next(error);
  }
});

// Add business income
router.post('/business', protect, validate(businessIncomeSchema), async (req, res, next) => {
  try {
    const businessIncome = await IncomeService.addBusinessIncome(req.user.id, req.body);
    res.status(201).json(businessIncome);
  } catch (error) {
    next(error);
  }
});

// Add property income
router.post('/property', protect, validate(propertyIncomeSchema), async (req, res, next) => {
  try {
    const propertyIncome = await IncomeService.addPropertyIncome(req.user.id, req.body);
    res.status(201).json(propertyIncome);
  } catch (error) {
    next(error);
  }
});

// Add other income
router.post('/other', protect, validate(otherIncomeSchema), async (req, res, next) => {
  try {
    const otherIncome = await IncomeService.addOtherIncome(req.user.id, req.body);
    res.status(201).json(otherIncome);
  } catch (error) {
    next(error);
  }
});

// Update income verification status
router.patch('/:incomeType/:incomeId/verify', protect, validate(verificationStatusSchema), async (req, res, next) => {
  try {
    const { incomeType, incomeId } = req.params;
    const { isVerified } = req.body;
    const updatedIncome = await IncomeService.updateVerificationStatus(incomeId, incomeType, isVerified);
    res.json(updatedIncome);
  } catch (error) {
    next(error);
  }
});

module.exports = router; 