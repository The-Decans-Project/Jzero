/**
 * Jzero Validator
 * Input validation utilities for astrology calculations
 * Ensures data integrity and meaningful error messages
 */

import {
  ValidationError,
  EphemerisError,
  TimezoneError
} from './errors.js';

/**
 * Validate date string (format: YYYY-MM-DD)
 * @param {string} date - Date to validate
 * @returns {Object} Parsed {year, month, day} or throws ValidationError
 */
export function validateDate(date) {
  if (!date) {
    throw new ValidationError('Date is required');
  }

  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(date)) {
    throw new ValidationError(
      'Date must be in format YYYY-MM-DD',
      'date'
    );
  }

  const [year, month, day] = date.split('-').map(Number);

  if (month < 1 || month > 12) {
    throw new ValidationError(`Month must be 1-12, got ${month}`, 'date');
  }

  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year % 4 === 0 && year % 100 !== 0) daysInMonth[1] = 29;
  if (year % 400 === 0) daysInMonth[1] = 29;

  if (day < 1 || day > daysInMonth[month - 1]) {
    throw new ValidationError(
      `Day must be 1-${daysInMonth[month - 1]}, got ${day}`,
      'date'
    );
  }

  return { year, month, day };
}

/**
 * Validate time string (format: HH:MM:SS or HH:MM)
 * @param {string} time - Time to validate
 * @returns {Object} Parsed {hour, minute, second} or throws ValidationError
 */
export function validateTime(time) {
  if (!time) {
    throw new ValidationError('Time is required');
  }

  const timePattern = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;
  const match = time.match(timePattern);

  if (!match) {
    throw new ValidationError(
      'Time must be in format HH:MM or HH:MM:SS',
      'time'
    );
  }

  const [, hourStr, minuteStr, secondStr] = match;
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  const second = Number(secondStr) || 0;

  if (hour < 0 || hour > 23) {
    throw new ValidationError(`Hour must be 0-23, got ${hour}`, 'time');
  }

  if (minute < 0 || minute > 59) {
    throw new ValidationError(`Minute must be 0-59, got ${minute}`, 'time');
  }

  if (second < 0 || second > 59) {
    throw new ValidationError(`Second must be 0-59, got ${second}`, 'time');
  }

  return { hour, minute, second };
}

/**
 * Validate geographic coordinates
 * @param {number} latitude - Latitude (-90 to 90)
 * @param {number} longitude - Longitude (-180 to 180)
 * @returns {Object} Validated {latitude, longitude}
 * @throws ValidationError
 */
export function validateCoordinates(latitude, longitude) {
  if (latitude === null || latitude === undefined) {
    throw new ValidationError('Latitude is required', 'latitude');
  }

  if (longitude === null || longitude === undefined) {
    throw new ValidationError('Longitude is required', 'longitude');
  }

  const lat = Number(latitude);
  const lon = Number(longitude);

  if (isNaN(lat)) {
    throw new ValidationError('Latitude must be a number', 'latitude');
  }

  if (isNaN(lon)) {
    throw new ValidationError('Longitude must be a number', 'longitude');
  }

  if (lat < -90 || lat > 90) {
    throw new ValidationError(
      `Latitude must be -90 to 90, got ${lat}`,
      'latitude'
    );
  }

  if (lon < -180 || lon > 180) {
    throw new ValidationError(
      `Longitude must be -180 to 180, got ${lon}`,
      'longitude'
    );
  }

  return { latitude: lat, longitude: lon };
}

/**
 * Validate timezone offset
 * @param {number} offset - Timezone offset in hours
 * @returns {number} Validated offset
 * @throws TimezoneError
 */
export function validateTimezoneOffset(offset) {
  if (offset === null || offset === undefined) {
    return 0; // Default to UTC
  }

  const numOffset = Number(offset);

  if (isNaN(numOffset)) {
    throw new TimezoneError('Timezone offset must be a number', offset);
  }

  if (numOffset < -12 || numOffset > 14) {
    throw new TimezoneError(
      `Timezone offset must be -12 to 14, got ${numOffset}`,
      offset
    );
  }

  return numOffset;
}

/**
 * Validate house system name
 * @param {string} system - House system (porphyry, equal, whole-sign, placidus)
 * @returns {string} Validated system name
 * @throws ValidationError
 */
export function validateHouseSystem(system) {
  const validSystems = ['porphyry', 'equal', 'whole-sign', 'placidus', 'koch', 'regiomontanus'];
  const safeName = (system || 'porphyry').toLowerCase().trim();

  if (!validSystems.includes(safeName)) {
    throw new ValidationError(
      `House system must be one of: ${validSystems.join(', ')}`,
      'houseSystem'
    );
  }

  return safeName;
}

/**
 * Validate planet name
 * @param {string} planet - Planet name
 * @returns {string} Validated planet name
 * @throws EphemerisError
 */
export function validatePlanet(planet) {
  const validPlanets = [
    'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
    'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
    'Sun', 'ChiMoon', 'Chiron', 'Node', 'Lilith'
  ];

  const safeName = (planet || '').trim();
  const found = validPlanets.find(p => p.toLowerCase() === safeName.toLowerCase());

  if (!found) {
    throw new EphemerisError(
      `Unknown planet. Valid planets: ${validPlanets.slice(0, 10).join(', ')}, ...`,
      planet
    );
  }

  return found;
}

/**
 * Validate Julian Day Number
 * @param {number} jd - Julian Day Number
 * @returns {number} Validated JD
 * @throws ValidationError
 */
export function validateJulianDay(jd) {
  if (jd === null || jd === undefined) {
    throw new ValidationError('Julian Day Number is required', 'jd');
  }

  const numJd = Number(jd);

  if (isNaN(numJd)) {
    throw new ValidationError('Julian Day Number must be a number', 'jd');
  }

  if (numJd < 0) {
    throw new ValidationError('Julian Day Number must be positive', 'jd');
  }

  // Historical range check (1 AD to 2500 AD)
  if (numJd < 1721425.5 || numJd > 2634158.5) {
    console.warn(`Julian Day ${numJd} is outside common range (1 AD - 2500 AD)`);
  }

  return numJd;
}

/**
 * Validate birth chart input data
 * @param {Object} chartData - Chart data to validate
 * @returns {Object} Validated chart data
 * @throws ValidationError
 */
export function validateBirthChartData(chartData) {
  if (!chartData) {
    throw new ValidationError('Chart data is required');
  }

  // Validate required fields
  const validated = {};

  // Date and time
  if (chartData.date) {
    const dateValid = validateDate(chartData.date);
    Object.assign(validated, dateValid);
  }

  if (chartData.time) {
    const timeValid = validateTime(chartData.time);
    Object.assign(validated, timeValid);
  }

  // Location
  if (chartData.latitude !== undefined && chartData.longitude !== undefined) {
    const coordValid = validateCoordinates(chartData.latitude, chartData.longitude);
    Object.assign(validated, coordValid);
  }

  // Optional fields
  if (chartData.timezone !== undefined) {
    validated.timezone = validateTimezoneOffset(chartData.timezone);
  }

  if (chartData.houseSystem) {
    validated.houseSystem = validateHouseSystem(chartData.houseSystem);
  }

  return validated;
}

/**
 * Sanitize string input
 * @param {string} input - String to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeString(input) {
  if (typeof input !== 'string') {
    return String(input);
  }

  return input
    .trim()
    .slice(0, 255) // Limit length
    .replace(/[<>]/g, ''); // Remove dangerous characters
}

/**
 * Safe number conversion
 * @param {*} value - Value to convert
 * @param {number} defaultValue - Default if conversion fails
 * @returns {number} Converted number
 */
export function safeNumber(value, defaultValue = 0) {
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

export default {
  validateDate,
  validateTime,
  validateCoordinates,
  validateTimezoneOffset,
  validateHouseSystem,
  validatePlanet,
  validateJulianDay,
  validateBirthChartData,
  sanitizeString,
  safeNumber
};
