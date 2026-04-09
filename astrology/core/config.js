/**
 * Jzero Configuration Management
 * Centralized configuration with environment variable support
 * Defaults to development settings, can be overridden for production
 */

import { ConfigurationError } from './errors.js';

/**
 * Default configuration
 */
const DEFAULT_CONFIG = {
  // Server settings
  server: {
    port: 3001,
    host: '0.0.0.0',
    environment: 'development',
    corsOrigin: '*'
  },

  // Logging
  logging: {
    level: 'INFO',
    colorOutput: true,
    stackTraces: false,
    requestLogging: true
  },

  // Ephemeris and calculations
  ephemeris: {
    dataPath: './data',
    csvEnabled: true,
    swissEphemerisEnabled: false,
    year Range: {
      min: 1900,
      max: 2100
    },
    defaultAccuracy: 'standard' // standard, high, precise
  },

  // API settings
  api: {
    maxRequestSize: '10mb',
    timeout: 30000,
    requestValidation: true,
    responseCompression: true
  },

  // Cache settings
  cache: {
    enabled: true,
    ttl: 3600, // seconds
    maxSize: 100 // number of entries
  },

  // Rate limiting
  rateLimit: {
    enabled: false,
    windowMs: 900000, // 15 minutes
    maxRequests: 100
  },

  // Database (placeholder for future)
  database: {
    type: 'memory', // memory, sqlite, postgresql, mongodb
    path: './data/charts.db'
  },

  // Feature flags
  features: {
    birthChart: true,
    transits: true,
    synastry: true,
    progressions: true,
    reports: true
  }
};

/**
 * Configuration manager
 */
class ConfigManager {
  constructor() {
    this.config = structuredClone(DEFAULT_CONFIG);
    this.loaded = false;
  }

  /**
   * Initialize configuration from environment
   */
  initialize() {
    this._loadFromEnvironment();
    this.loaded = true;
    return this.config;
  }

  /**
   * Load settings from environment variables
   * @private
   */
  _loadFromEnvironment() {
    // Server
    if (process.env.PORT) {
      this.config.server.port = parseInt(process.env.PORT, 10);
    }
    if (process.env.NODE_ENV) {
      this.config.server.environment = process.env.NODE_ENV;
    }
    if (process.env.CORS_ORIGIN) {
      this.config.server.corsOrigin = process.env.CORS_ORIGIN;
    }

    // Logging
    if (process.env.LOG_LEVEL) {
      this.config.logging.level = process.env.LOG_LEVEL.toUpperCase();
    }
    if (process.env.LOG_STACK === 'true') {
      this.config.logging.stackTraces = true;
    }

    // Ephemeris
    if (process.env.EPHEMERIS_DATA_PATH) {
      this.config.ephemeris.dataPath = process.env.EPHEMERIS_DATA_PATH;
    }
    if (process.env.SWISS_EPHEMERIS === 'true') {
      this.config.ephemeris.swissEphemerisEnabled = true;
    }

    // Cache
    if (process.env.CACHE_ENABLED === 'false') {
      this.config.cache.enabled = false;
    }
    if (process.env.CACHE_TTL) {
      this.config.cache.ttl = parseInt(process.env.CACHE_TTL, 10);
    }

    // Database
    if (process.env.DATABASE_TYPE) {
      this.config.database.type = process.env.DATABASE_TYPE;
    }
    if (process.env.DATABASE_PATH) {
      this.config.database.path = process.env.DATABASE_PATH;
    }

    // Rate limiting
    if (process.env.RATE_LIMIT === 'true') {
      this.config.rateLimit.enabled = true;
    }
    if (process.env.RATE_LIMIT_WINDOW) {
      this.config.rateLimit.windowMs = parseInt(process.env.RATE_LIMIT_WINDOW, 10);
    }
  }

  /**
   * Get configuration value
   * @param {string} path - Dot-notation path (e.g., 'server.port')
   * @param {*} defaultValue - Default if not found
   * @returns {*} Configuration value
   */
  get(path, defaultValue = undefined) {
    const keys = path.split('.');
    let value = this.config;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }

    return value;
  }

  /**
   * Set configuration value
   * @param {string} path - Dot-notation path
   * @param {*} value - Value to set
   */
  set(path, value) {
    const keys = path.split('.');
    let obj = this.config;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in obj) || typeof obj[key] !== 'object') {
        obj[key] = {};
      }
      obj = obj[key];
    }

    obj[keys[keys.length - 1]] = value;
  }

  /**
   * Check if configuration path exists
   * @param {string} path - Dot-notation path
   * @returns {boolean}
   */
  has(path) {
    const keys = path.split('.');
    let value = this.config;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return false;
      }
    }

    return true;
  }

  /**
   * Get entire configuration object
   * @returns {Object}
   */
  getAll() {
    return structuredClone(this.config);
  }

  /**
   * Reset to defaults
   */
  reset() {
    this.config = structuredClone(DEFAULT_CONFIG);
  }

  /**
   * Validate configuration
   * @returns {Array} Array of validation errors (empty if valid)
   */
  validate() {
    const errors = [];

    // Server port validation
    const port = this.config.server.port;
    if (typeof port !== 'number' || port < 0 || port > 65535) {
      errors.push('server.port must be a valid port number (0-65535)');
    }

    // Log level validation
    const logLevel = this.config.logging.level;
    if (!['DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL'].includes(logLevel)) {
      errors.push(`logging.level must be one of: DEBUG, INFO, WARN, ERROR, CRITICAL`);
    }

    // Cache TTL validation
    const cacheTtl = this.config.cache.ttl;
    if (typeof cacheTtl !== 'number' || cacheTtl < 0) {
      errors.push('cache.ttl must be a non-negative number');
    }

    // Database type validation
    const dbType = this.config.database.type;
    if (!['memory', 'sqlite', 'postgresql', 'mongodb'].includes(dbType)) {
      errors.push('database.type must be one of: memory, sqlite, postgresql, mongodb');
    }

    return errors;
  }

  /**
   * Get configuration as JSON (safe for logging)
   * @returns {Object}
   */
  toJSON() {
    const safe = structuredClone(this.config);
    // Remove sensitive data if any (placeholder for future)
    return safe;
  }
}

// Global singleton instance
const configManager = new ConfigManager();

// Initialize on module load if in Node environment
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  configManager.initialize();
}

export default configManager;
export { ConfigManager, ConfigurationError };
