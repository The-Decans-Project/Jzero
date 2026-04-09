/**
 * Jzero Logger
 * Structured logging for debugging, monitoring, and audit trails
 * Supports console, file (future), and third-party integrations
 */

// Log levels with numeric values for filtering
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  CRITICAL: 4
};

// Current log level (can be overridden by environment)
let currentLogLevel = process.env.LOG_LEVEL
  ? LOG_LEVELS[process.env.LOG_LEVEL.toUpperCase()] ?? LOG_LEVELS.INFO
  : LOG_LEVELS.INFO;

// Color codes for console output (if supported)
const COLORS = {
  DEBUG: '\x1b[36m',    // Cyan
  INFO: '\x1b[32m',     // Green
  WARN: '\x1b[33m',     // Yellow
  ERROR: '\x1b[31m',    // Red
  CRITICAL: '\x1b[35m', // Magenta
  RESET: '\x1b[0m'
};

/**
 * Check if color output is supported
 * @returns {boolean}
 */
function supportsColor() {
  return !process.env.NO_COLOR && (process.env.FORCE_COLOR || process.stdout.isTTY);
}

/**
 * Format timestamp
 * @param {Date} date
 * @returns {string}
 */
function formatTimestamp(date = new Date()) {
  return date.toISOString();
}

/**
 * Format log message with context
 * @param {string} level
 * @param {string} message
 * @param {Object} context
 * @returns {string}
 */
function formatLogMessage(level, message, context = {}) {
  const timestamp = formatTimestamp();
  const contextStr = Object.keys(context).length > 0
    ? ` | ${JSON.stringify(context)}`
    : '';

  return `[${timestamp}] [${level}] ${message}${contextStr}`;
}

/**
 * Output log to console with optional coloring
 * @param {string} level
 * @param {string} message
 * @param {Object} context
 */
function outputConsole(level, message, context = {}) {
  const formatted = formatLogMessage(level, message, context);

  if (supportsColor()) {
    const color = COLORS[level] || '';
    console.log(`${color}${formatted}${COLORS.RESET}`);
  } else {
    console.log(formatted);
  }
}

/**
 * Logger class
 */
export class Logger {
  constructor(namespace = 'Jzero') {
    this.namespace = namespace;
  }

  /**
   * Debug level logging
   * @param {string} message
   * @param {Object} context
   */
  debug(message, context = {}) {
    if (currentLogLevel <= LOG_LEVELS.DEBUG) {
      this._log('DEBUG', message, context);
    }
  }

  /**
   * Info level logging
   * @param {string} message
   * @param {Object} context
   */
  info(message, context = {}) {
    if (currentLogLevel <= LOG_LEVELS.INFO) {
      this._log('INFO', message, context);
    }
  }

  /**
   * Warn level logging
   * @param {string} message
   * @param {Object} context
   */
  warn(message, context = {}) {
    if (currentLogLevel <= LOG_LEVELS.WARN) {
      this._log('WARN', message, context);
    }
  }

  /**
   * Error level logging
   * @param {string} message
   * @param {Object} context
   */
  error(message, context = {}) {
    if (currentLogLevel <= LOG_LEVELS.ERROR) {
      this._log('ERROR', message, context);
    }
  }

  /**
   * Critical level logging
   * @param {string} message
   * @param {Object} context
   */
  critical(message, context = {}) {
    if (currentLogLevel <= LOG_LEVELS.CRITICAL) {
      this._log('CRITICAL', message, context);
    }
  }

  /**
   * Log exception/error
   * @param {Error} error
   * @param {Object} context
   */
  exception(error, context = {}) {
    const errorContext = {
      ...context,
      errorName: error.name,
      errorMessage: error.message,
      errorCode: error.code,
      stack: process.env.LOG_STACK === 'true' ? error.stack : undefined
    };

    this.error(error.message, errorContext);
  }

  /**
   * Log HTTP request
   * @param {Object} request
   * @param {Object} context
   */
  request(request, context = {}) {
    const requestContext = {
      ...context,
      method: request.method,
      url: request.url,
      ip: request.ip,
      timestamp: new Date().toISOString()
    };

    this.debug(`${request.method} ${request.url}`, requestContext);
  }

  /**
   * Log HTTP response
   * @param {number} statusCode
   * @param {number} duration
   * @param {Object} context
   */
  response(statusCode, duration, context = {}) {
    const level = statusCode >= 400 ? 'WARN' : 'DEBUG';
    const responseContext = {
      ...context,
      statusCode,
      durationMs: duration
    };

    this._log(level, `HTTP Response ${statusCode}`, responseContext);
  }

  /**
   * Log calculation operation
   * @param {string} operation
   * @param {Object} context
   */
  calculation(operation, context = {}) {
    this.debug(`Calculation: ${operation}`, context);
  }

  /**
   * Internal log method
   * @private
   * @param {string} level
   * @param {string} message
   * @param {Object} context
   */
  _log(level, message, context = {}) {
    const fullMessage = `[${this.namespace}] ${message}`;
    outputConsole(level, fullMessage, context);
  }
}

/**
 * Set global log level
 * @param {string} level - DEBUG, INFO, WARN, ERROR, CRITICAL
 */
export function setLogLevel(level) {
  const levelNum = LOG_LEVELS[level.toUpperCase()];
  if (levelNum !== undefined) {
    currentLogLevel = levelNum;
  }
}

/**
 * Get current log level
 * @returns {number}
 */
export function getLogLevel() {
  return currentLogLevel;
}

/**
 * Get log level name from numeric value
 * @param {number} level
 * @returns {string}
 */
export function getLogLevelName(level) {
  for (const [name, value] of Object.entries(LOG_LEVELS)) {
    if (value === level) return name;
  }
  return 'UNKNOWN';
}

/**
 * Create named logger
 * @param {string} namespace
 * @returns {Logger}
 */
export function createLogger(namespace = 'Jzero') {
  return new Logger(namespace);
}

// Default logger instance
export const logger = createLogger();

export default {
  Logger,
  createLogger,
  logger,
  setLogLevel,
  getLogLevel,
  getLogLevelName,
  LOG_LEVELS
};
