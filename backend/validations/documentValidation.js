const Joi = require('joi');

// Document upload validation
const documentUploadSchema = Joi.object({
  documentType: Joi.string()
    .valid(
      'FORM16',
      'FORM16A',
      'BANK_STATEMENT',
      'RENT_RECEIPT',
      'PROPERTY_TAX_RECEIPT',
      'BUSINESS_INCOME_PROOF',
      'INTEREST_CERTIFICATE',
      'DIVIDEND_STATEMENT',
      'OTHER'
    )
    .required()
    .messages({
      'any.only': 'Invalid document type',
      'any.required': 'Document type is required'
    }),
  financialYear: Joi.string()
    .pattern(/^\d{4}-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'Financial year must be in YYYY-YY format',
      'any.required': 'Financial year is required'
    }),
  relatedIncome: Joi.object({
    incomeType: Joi.string()
      .valid('SALARY', 'BUSINESS', 'PROPERTY', 'OTHER')
      .required()
      .messages({
        'any.only': 'Invalid income type',
        'any.required': 'Income type is required'
      }),
    incomeId: Joi.string()
      .required()
      .messages({
        'string.empty': 'Income ID cannot be empty',
        'any.required': 'Income ID is required'
      })
  })
    .required()
    .messages({
      'any.required': 'Related income information is required'
    }),
  metadata: Joi.object()
    .pattern(
      Joi.string(),
      Joi.alternatives().try(
        Joi.string(),
        Joi.number(),
        Joi.boolean(),
        Joi.date()
      )
    )
    .default({})
});

// Document verification validation
const documentVerificationSchema = Joi.object({
  isVerified: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'Verification status must be a boolean',
      'any.required': 'Verification status is required'
    }),
  notes: Joi.string()
    .max(500)
    .allow('')
    .default('')
    .messages({
      'string.max': 'Notes cannot exceed 500 characters'
    })
});

// Document query validation
const documentQuerySchema = Joi.object({
  documentType: Joi.string()
    .valid(
      'FORM16',
      'FORM16A',
      'BANK_STATEMENT',
      'RENT_RECEIPT',
      'PROPERTY_TAX_RECEIPT',
      'BUSINESS_INCOME_PROOF',
      'INTEREST_CERTIFICATE',
      'DIVIDEND_STATEMENT',
      'OTHER'
    ),
  financialYear: Joi.string()
    .pattern(/^\d{4}-\d{2}$/),
  status: Joi.string()
    .valid('PENDING', 'VERIFIED', 'REJECTED'),
  incomeType: Joi.string()
    .valid('SALARY', 'BUSINESS', 'PROPERTY', 'OTHER'),
  incomeId: Joi.string(),
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10),
  sortBy: Joi.string()
    .valid('createdAt', 'updatedAt', 'status', 'documentType')
    .default('createdAt'),
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
});

// Document update validation
const documentUpdateSchema = Joi.object({
  documentType: Joi.string()
    .valid(
      'FORM16',
      'FORM16A',
      'BANK_STATEMENT',
      'RENT_RECEIPT',
      'PROPERTY_TAX_RECEIPT',
      'BUSINESS_INCOME_PROOF',
      'INTEREST_CERTIFICATE',
      'DIVIDEND_STATEMENT',
      'OTHER'
    ),
  metadata: Joi.object()
    .pattern(
      Joi.string(),
      Joi.alternatives().try(
        Joi.string(),
        Joi.number(),
        Joi.boolean(),
        Joi.date()
      )
    )
}).min(1); // At least one field must be provided

module.exports = {
  documentUploadSchema,
  documentVerificationSchema,
  documentQuerySchema,
  documentUpdateSchema
}; 