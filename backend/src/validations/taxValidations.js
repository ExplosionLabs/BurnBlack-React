const { body } = require('express-validator');

const taxCalculationValidation = [
  body('grossIncome')
    .isFloat({ min: 0 })
    .withMessage('Gross income must be a positive number')
    .toFloat(),

  body('totalDeductions')
    .isFloat({ min: 0 })
    .withMessage('Total deductions must be a positive number')
    .toFloat(),

  body('userType')
    .isIn(['INDIVIDUAL', 'SENIOR_CITIZEN', 'SUPER_SENIOR_CITIZEN'])
    .withMessage('Invalid user type'),

  body('taxPaid')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Tax paid must be a positive number')
    .toFloat(),

  body('financialYear')
    .optional()
    .matches(/^\d{4}-\d{2}$/)
    .withMessage('Financial year must be in YYYY-YY format')
];

const deductionValidation = [
  body('section80C')
    .optional()
    .isFloat({ min: 0, max: 150000 })
    .withMessage('Section 80C deduction must be between 0 and 150000')
    .toFloat(),

  body('housePropertyDeduction')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('House property deduction must be a positive number')
    .toFloat(),

  body('section80D')
    .optional()
    .isFloat({ min: 0, max: 25000 })
    .withMessage('Section 80D deduction must be between 0 and 25000')
    .toFloat(),

  body('section80E')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Section 80E deduction must be a positive number')
    .toFloat(),

  body('section80G')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Section 80G deduction must be a positive number')
    .toFloat(),

  body('section80TTA')
    .optional()
    .isFloat({ min: 0, max: 10000 })
    .withMessage('Section 80TTA deduction must be between 0 and 10000')
    .toFloat(),

  body('otherDeductions')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Other deductions must be a positive number')
    .toFloat()
];

const taxSummaryUpdateValidation = [
  body('status')
    .optional()
    .isIn(['DRAFT', 'CALCULATED', 'FILED', 'VERIFIED'])
    .withMessage('Invalid status'),

  body('grossIncome')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Gross income must be a positive number')
    .toFloat(),

  body('totalDeductions')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Total deductions must be a positive number')
    .toFloat(),

  body('taxPaid')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Tax paid must be a positive number')
    .toFloat()
];

module.exports = {
  taxCalculationValidation,
  deductionValidation,
  taxSummaryUpdateValidation
}; 