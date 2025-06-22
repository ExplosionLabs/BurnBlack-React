export class ApiError extends Error {
  statusCode: number;
  details?: any;

  constructor(statusCode: number, message: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ApiError';

    // Maintain proper stack trace (only in Node.js environment)
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, ApiError);
    }
  }

  static badRequest(message: string, details?: any) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message: string = 'Unauthorized', details?: any) {
    return new ApiError(401, message, details);
  }

  static forbidden(message: string = 'Forbidden', details?: any) {
    return new ApiError(403, message, details);
  }

  static notFound(message: string = 'Not Found', details?: any) {
    return new ApiError(404, message, details);
  }

  static tooManyRequests(message: string = 'Too Many Requests', details?: any) {
    return new ApiError(429, message, details);
  }

  static internal(message: string = 'Internal Server Error', details?: any) {
    return new ApiError(500, message, details);
  }

  toJSON() {
    return {
      success: false,
      error: {
        code: this.name,
        message: this.message,
        details: this.details,
      },
    };
  }
} 