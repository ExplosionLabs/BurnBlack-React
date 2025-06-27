const express = require('express');
const router = express.Router();
const TaxCalculationService = require('../services/taxCalculationService');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const {
  taxCalculationValidation,
  deductionValidation,
  taxSummaryUpdateValidation
} = require('../validations/taxValidations');

// All routes are protected
router.use(protect);

// Calculate tax
router.post('/calculate', validate(taxCalculationValidation), async (req, res, next) => {
  try {
    const taxCalculation = await TaxCalculationService.calculateTax({
      grossIncome: req.body.grossIncome,
      totalDeductions: req.body.totalDeductions,
      userType: req.body.userType,
      taxPaid: req.body.taxPaid || 0
    });

    // Save calculation if requested
    if (req.body.save) {
      const savedCalculation = await TaxCalculationService.saveTaxCalculation(
        req.user.id,
        {
          ...taxCalculation,
          financialYear: req.body.financialYear || TaxSummary.getCurrentFinancialYear()
        }
      );
      return res.json({
        success: true,
        data: {
          taxCalculation: savedCalculation
        }
      });
    }

    res.json({
      success: true,
      data: {
        taxCalculation
      }
    });
  } catch (error) {
    next(error);
  }
});

// Calculate deductions
router.post('/deductions', validate(deductionValidation), async (req, res, next) => {
  try {
    const deductions = await TaxCalculationService.calculateDeductions(req.body);
    res.json({
      success: true,
      data: {
        deductions
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get tax history
router.get('/history', async (req, res, next) => {
  try {
    const taxHistory = await TaxCalculationService.getTaxHistory(req.user.id);
    res.json({
      success: true,
      data: {
        taxHistory
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get current tax summary
router.get('/summary', async (req, res, next) => {
  try {
    const financialYear = req.query.financialYear || TaxSummary.getCurrentFinancialYear();
    const taxSummary = await TaxSummary.findOne({
      userId: req.user.id,
      financialYear
    });

    if (!taxSummary) {
      return res.json({
        success: true,
        data: {
          taxSummary: null
        }
      });
    }

    res.json({
      success: true,
      data: {
        taxSummary
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update tax summary
router.patch('/summary/:id', validate(taxSummaryUpdateValidation), async (req, res, next) => {
  try {
    const taxSummary = await TaxSummary.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!taxSummary) {
      throw new AppError('Tax summary not found', 404);
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (taxSummary[key] !== undefined) {
        taxSummary[key] = req.body[key];
      }
    });

    // Recalculate tax if income or deductions changed
    if (req.body.grossIncome || req.body.totalDeductions) {
      const newCalculation = await TaxCalculationService.calculateTax({
        grossIncome: req.body.grossIncome || taxSummary.grossIncome,
        totalDeductions: req.body.totalDeductions || taxSummary.totalDeductions,
        userType: taxSummary.userType,
        taxPaid: req.body.taxPaid || taxSummary.taxPaid
      });

      Object.assign(taxSummary, newCalculation);
    }

    await taxSummary.save();

    res.json({
      success: true,
      data: {
        taxSummary
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get tax status
router.get('/status', async (req, res, next) => {
  try {
    const financialYear = req.query.financialYear || TaxSummary.getCurrentFinancialYear();
    const taxSummary = await TaxSummary.findOne({
      userId: req.user.id,
      financialYear
    });

    const status = {
      isFilingComplete: false,
      hasTaxDue: false,
      hasRefundDue: false,
      filingStatus: 'NOT_STARTED',
      lastUpdated: null
    };

    if (taxSummary) {
      status.isFilingComplete = taxSummary.isCalculationComplete();
      status.hasTaxDue = taxSummary.hasTaxDue();
      status.hasRefundDue = taxSummary.hasRefundDue();
      status.filingStatus = taxSummary.status;
      status.lastUpdated = taxSummary.lastUpdated;
    }

    res.json({
      success: true,
      data: {
        status
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 