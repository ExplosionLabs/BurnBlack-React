const TaxService = require('../services/TaxService');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get Tax Summary
exports.getTaxSummary = catchAsync(async (req, res, next) => {
  const { financialYear } = req.params;
  const summary = await TaxService.getTaxSummary(req.user.id, financialYear);
  
  res.status(200).json({
    status: 'success',
    data: summary
  });
});

// Calculate Tax Savings
exports.calculateTaxSavings = catchAsync(async (req, res, next) => {
  const { financialYear } = req.params;
  const savings = await TaxService.calculateTaxSavings(req.user.id, financialYear);
  
  res.status(200).json({
    status: 'success',
    data: savings
  });
});

// Calculate Tax Liability
exports.calculateTaxLiability = catchAsync(async (req, res, next) => {
  const { financialYear } = req.params;
  const liability = await TaxService.calculateTaxLiability(req.user.id, financialYear);
  
  res.status(200).json({
    status: 'success',
    data: liability
  });
}); 