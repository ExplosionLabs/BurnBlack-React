const { ApiError } = require('../utils/apiError');

const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = { notFoundHandler }; 