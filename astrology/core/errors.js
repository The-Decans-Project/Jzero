/**
 * Jzero Error Classes
 * Custom error definitions for astrology calculations
 * Enables precise error handling and debugging
 */

/**
 * Base error class for all Jzero errors
 * @extends Error
 */
export class JzeroError extends Error {
  constructor(message, code = 'JZERO_ERROR', statusCode = 500) {
    super(message);
    this.name = 'JzeroError';
    this.code = code;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        code: this.code,
        statusCode: this.statusCode
      }
    };
  }
}

/**
 * Validation error for invalid inputs
 * @extends JzeroError
 */
export class ValidationError extends JzeroError {
  constructor(message, field = null, statusCode = 400) {
    super(message, 'VALIDATION_ERROR', statusCode);
    this.name = 'ValidationError';
    this.field = field;
  }

  toJSON() {
    const json = super.toJSON();
    if (this.field) {
      json.error.field = this.field;
    }
    return json;
  }
}

/**
 * Ephemeris data error (missing or invalid data)
 * @extends JzeroError
 */
export class EphemerisError extends JzeroError {
  constructor(message, planet = null, statusCode = 400) {
    super(message, 'EPHEMERIS_ERROR', statusCode);
    this.name = 'EphemerisError';
    this.planet = planet;
  }

  toJSON() {
    const json = super.toJSON();
    if (this.planet) {
      json.error.planet = this.planet;
    }
    return json;
  }
}

/**
 * Location not found error
 * @extends JzeroError
 */
export class LocationError extends JzeroError {
  constructor(message, location = null, statusCode = 404) {
    super(message, 'LOCATION_NOT_FOUND', statusCode);
    this.name = 'LocationError';
    this.location = location;
  }

  toJSON() {
    const json = super.toJSON();
    if (this.location) {
      json.error.location = this.location;
    }
    return json;
  }
}

/**
 * Calculation error (computation failed)
 * @extends JzeroError
 */
export class CalculationError extends JzeroError {
  constructor(message, operation = null, statusCode = 500) {
    super(message, 'CALCULATION_ERROR', statusCode);
    this.name = 'CalculationError';
    this.operation = operation;
  }

  toJSON() {
    const json = super.toJSON();
    if (this.operation) {
      json.error.operation = this.operation;
    }
    return json;
  }
}

/**
 * Timezone error
 * @extends JzeroError
 */
export class TimezoneError extends JzeroError {
  constructor(message, timezone = null, statusCode = 400) {
    super(message, 'TIMEZONE_ERROR', statusCode);
    this.name = 'TimezoneError';
    this.timezone = timezone;
  }

  toJSON() {
    const json = super.toJSON();
    if (this.timezone) {
      json.error.timezone = this.timezone;
    }
    return json;
  }
}

/**
 * Configuration error
 * @extends JzeroError
 */
export class ConfigurationError extends JzeroError {
  constructor(message, configKey = null, statusCode = 500) {
    super(message, 'CONFIGURATION_ERROR', statusCode);
    this.name = 'ConfigurationError';
    this.configKey = configKey;
  }

  toJSON() {
    const json = super.toJSON();
    if (this.configKey) {
      json.error.configKey = this.configKey;
    }
    return json;
  }
}

export default {
  JzeroError,
  ValidationError,
  EphemerisError,
  LocationError,
  CalculationError,
  TimezoneError,
  ConfigurationError
};
