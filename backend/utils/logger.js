const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');
const { format } = winston;

// Custom format for structured logging
const structuredFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.json()
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: structuredFormat,
  defaultMeta: { service: 'burnblack-api' },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
});

// Add Elasticsearch transport if configured
if (process.env.ELASTICSEARCH_URL) {
  logger.add(new ElasticsearchTransport({
    level: 'info',
    index: 'burnblack-logs',
    clientOpts: {
      node: process.env.ELASTICSEARCH_URL,
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD
      }
    }
  }));
}

// Create audit logger
const auditLogger = winston.createLogger({
  level: 'info',
  format: structuredFormat,
  defaultMeta: { service: 'burnblack-audit' },
  transports: [
    new winston.transports.File({
      filename: 'logs/audit.log',
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
});

// Add Elasticsearch transport for audit logs if configured
if (process.env.ELASTICSEARCH_URL) {
  auditLogger.add(new ElasticsearchTransport({
    level: 'info',
    index: 'burnblack-audit',
    clientOpts: {
      node: process.env.ELASTICSEARCH_URL,
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD
      }
    }
  }));
}

// Logging middleware
const loggingMiddleware = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  logger.info('Incoming request', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user?.id,
    requestId: req.id
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info('Request completed', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration,
      userId: req.user?.id,
      requestId: req.id
    });
  });

  next();
};

// Audit logging middleware
const auditLoggingMiddleware = (action, resource) => {
  return (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function (body) {
      // Log after response is sent
      auditLogger.info('Audit log', {
        action,
        resource,
        userId: req.user?.id,
        userRole: req.user?.role,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        requestBody: req.body,
        responseBody: body,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        timestamp: new Date().toISOString()
      });

      return originalSend.call(this, body);
    };

    next();
  };
};

module.exports = {
  logger,
  auditLogger,
  loggingMiddleware,
  auditLoggingMiddleware
}; 