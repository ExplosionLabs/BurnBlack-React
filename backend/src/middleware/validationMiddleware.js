const Joi = require('joi');
const { ApiError } = require('../utils/apiError');

// Common validation patterns
const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  gstin: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
};

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new ApiError(422, errorMessage));
  }

  next();
};

// Document validation schemas
const documentSchemas = {
  upload: Joi.object({
    type: Joi.string().required(),
    metadata: Joi.object({
      description: Joi.string().max(500),
      tags: Joi.array().items(Joi.string()),
      expiryDate: Joi.date().iso().min('now')
    }),
    tags: Joi.array().items(Joi.string())
  }),

  update: Joi.object({
    metadata: Joi.object({
      description: Joi.string().max(500),
      tags: Joi.array().items(Joi.string()),
      expiryDate: Joi.date().iso().min('now')
    }).required()
  }),

  share: Joi.object({
    recipientEmail: Joi.string().email().required(),
    accessLevel: Joi.string().valid('read', 'write', 'admin').required(),
    expiryType: Joi.string().valid('never', 'date', 'views').required(),
    password: Joi.string().min(6).when('accessLevel', {
      is: 'read',
      then: Joi.optional(),
      otherwise: Joi.required()
    }),
    allowedActions: Joi.array().items(
      Joi.string().valid('view', 'download', 'print', 'share', 'edit')
    ).min(1).required()
  }),

  search: Joi.object({
    q: Joi.string().min(1),
    filters: Joi.object({
      type: Joi.string(),
      status: Joi.string(),
      dateRange: Joi.object({
        start: Joi.date().iso(),
        end: Joi.date().iso().min(Joi.ref('start'))
      }),
      tags: Joi.array().items(Joi.string())
    }),
    facets: Joi.boolean(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().valid('relevance', 'date', 'name', 'size', 'type')
  })
};

// Query parameter validation schemas
const querySchemas = {
  list: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().pattern(/^[a-zA-Z]+:(asc|desc)$/),
    type: Joi.string(),
    status: Joi.string(),
    search: Joi.string()
  }),

  audit: Joi.object({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')),
    action: Joi.string(),
    userId: Joi.string()
  })
};

module.exports = {
  validate,
  patterns,
  documentSchemas,
  querySchemas
}; 