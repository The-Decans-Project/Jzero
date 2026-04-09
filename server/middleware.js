/**
 * Jzero API Middleware & Utilities
 * Express middleware for error handling, validation, and logging
 */

import { createLogger } from '../astrology/core/logger.js';
import { JzeroError, ValidationError } from '../astrology/core/errors.js';

const logger = createLogger('API');

/**
 * Express error handling middleware
 * Should be attached last in middleware chain
 * @param {Error} error
 * @param {Object} request
 * @param {Object} response
 * @param {Function} next
 */
export function errorHandler(error, request, response, next) {
  logger.exception(error, {
    method: request.method,
    path: request.path,
    ip: request.ip
  });

  // Handle Jzero custom errors
  if (error instanceof JzeroError) {
    return response.status(error.statusCode).json(error.toJSON());
  }

  // Handle validation errors
  if (error instanceof ValidationError) {
    return response.status(error.statusCode).json(error.toJSON());
  }

  // Handle JSON parsing errors
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return response.status(400).json({
      error: {
        name: 'JSONParseError',
        message: 'Invalid JSON in request body',
        code: 'INVALID_JSON'
      }
    });
  }

  // Handle generic errors
  const statusCode = error.statusCode || 500;
  response.status(statusCode).json({
    error: {
      name: error.name || 'InternalServerError',
      message: error.message || 'An unexpected error occurred',
      code: error.code || 'INTERNAL_SERVER_ERROR',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }
  });
}

/**
 * Async handler wrapper for Express routes
 * Catches async errors and passes to error handler
 * @param {Function} handler
 * @returns {Function}
 */
export function asyncHandler(handler) {
  return (request, response, next) => {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
}

/**
 * Request logging middleware
 * Logs incoming requests and outgoing responses
 * @param {Object} request
 * @param {Object} response
 * @param {Function} next
 */
export function requestLogger(request, response, next) {
  const startTime = Date.now();

  logger.request(request);

  // Intercept response.json to log response
  const originalJson = response.json.bind(response);
  response.json = function (data) {
    const duration = Date.now() - startTime;
    logger.response(response.statusCode, duration, {
      method: request.method,
      path: request.path
    });
    return originalJson(data);
  };

  // Intercept response.send for non-JSON responses
  const originalSend = response.send.bind(response);
  response.send = function (data) {
    const duration = Date.now() - startTime;
    logger.response(response.statusCode, duration, {
      method: request.method,
      path: request.path
    });
    return originalSend(data);
  };

  next();
}

/**
 * Request validation middleware factory
 * Validates request bodies against a validation function
 * @param {Function} validator - Validation function
 * @returns {Function} Middleware
 */
export function validationMiddleware(validator) {
  return (request, response, next) => {
    try {
      request.validated = validator(request.body);
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        return errorHandler(error, request, response, next);
      }
      next(error);
    }
  };
}

/**
 * Health check endpoint handler
 * @param {Object} config - Configuration object
 * @returns {Function} Route handler
 */
export function healthCheck(config) {
  return (request, response) => {
    const health = {
      status: 'healthy',
      service: 'Jzero API',
      version: '2.0.0',
      environment: config.get('server.environment'),
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: {
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      }
    };

    response.json(health);
  };
}

/**
 * Create standardized API response
 * @param {*} data - Response data
 * @param {string} message - Optional message
 * @returns {Object} Formatted response
 */
export function success(data, message = 'Success') {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
}

/**
 * Create standardized error response
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @param {*} details - Additional details
 * @returns {Object} Formatted error response
 */
export function error(message, code = 'ERROR', details = null) {
  return {
    success: false,
    error: {
      message,
      code,
      ...(details && { details })
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * 404 Not Found handler
 * @param {Object} request
 * @param {Object} response
 */
export function notFoundHandler(request, response) {
  response.status(404).json(
    error(`Endpoint not found: ${request.method} ${request.path}`, 'NOT_FOUND')
  );
}

export default {
  errorHandler,
  asyncHandler,
  requestLogger,
  validationMiddleware,
  healthCheck,
  success,
  error,
  notFoundHandler
};
