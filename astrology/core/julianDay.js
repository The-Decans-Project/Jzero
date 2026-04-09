/**
 * Julian Day Calculator
 * Date/time to Julian Day conversions with astronomical corrections
 * Implements algorithms from Meeus "Astronomical Algorithms"
 * Open Source Astrology Calculator
 */

import { calculateDeltaT } from './time-corrections.js';

/**
 * Convert calendar date to Julian Day Number
 * Uses algorithm from Meeus (Chapter 7)
 * Accurate for Gregorian calendar dates
 * @param {Date} date - JavaScript Date object (UTC)
 * @returns {number} Julian Day Number
 */
export function dateToJulianDay(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // JavaScript months are 0-based
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();
  const millisecond = date.getUTCMilliseconds();

  // Handle month adjustment for astro calculations
  let a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  // Gregorian calendar day number
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + 
    Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  // Fractional day
  const fraction = (hour - 12) / 24 + minute / 1440 + second / 86400 + 
    millisecond / 86400000;

  return jdn + fraction;
}

/**
 * Convert calendar date to Julian Day in TT (Terrestrial Time)
 * @param {Date} date - JavaScript Date object (UTC)
 * @returns {number} Julian Day Number (TT)
 */
export function dateToJulianDayTT(date) {
  const jd = dateToJulianDay(date);
  const deltaT = calculateDeltaT(jd);
  return jd + (deltaT / 86400);
}

/**
 * Convert Julian Day to calendar date
 * @param {number} jd - Julian Day Number
 * @returns {Date} JavaScript Date object
 */
export function julianDayToDate(jd) {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;
  
  let a;
  if (z < 2299161) {
    a = z;
  } else {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }

  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);

  const day = b - d - Math.floor(30.6001 * e) + f;
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;

  const dayInt = Math.floor(day);
  const hourFrac = (day - dayInt) * 24;
  const hour = Math.floor(hourFrac);
  const minFrac = (hourFrac - hour) * 60;
  const minute = Math.floor(minFrac);
  const secFrac = (minFrac - minute) * 60;
  const second = Math.floor(secFrac);
  const millisecond = Math.floor((secFrac - second) * 1000);

  return new Date(Date.UTC(year, month - 1, dayInt, hour, minute, second, millisecond));
}

/**
 * Calculate Obliquity of the Ecliptic (Mean Obliquity)
 * Uses Laskar formula updated by Meeus (more accurate than older definitions)
 * @param {number} jd - Julian Day Number (JD)
 * @returns {number} Obliquity in degrees
 */
export function calculateObliquity(jd) {
  const t = (jd - 2451545.0) / 36525; // Julian centuries from J2000.0

  // Laskar et al. polynomial (valid -8000 to +12000)
  const arcsec = 84381.448 
    - 4680.93 * t 
    - 1.55 * t * t 
    + 1999.25 * t * t * t 
    - 51.38 * t * t * t * t 
    - 249.67 * t * t * t * t * t 
    - 39.05 * t * t * t * t * t * t 
    + 7.12 * t * t * t * t * t * t * t 
    + 27.87 * t * t * t * t * t * t * t * t 
    + 5.79 * t * t * t * t * t * t * t * t * t 
    + 2.45 * t * t * t * t * t * t * t * t * t * t;

  return arcsec / 3600; // Convert arcseconds to degrees
}

/**
 * Calculate Greenwich Mean Sidereal Time (GMST)
 * Implements algorithm from Meeus Chapter 12
 * @param {number} jd - Julian Day Number (UT)
 * @returns {number} GMST in degrees (0-360)
 */
export function calculateGMST(jd) {
  const jd0 = Math.floor(jd + 0.5) - 0.5; // Noon JD
  const ut = (jd - jd0) * 24; // UT in hours
  const t0 = (jd0 - 2451545.0) / 36525; // Julian centuries from J2000.0

  // GMST at 0h UT in seconds
  const gmst0 = 67310.54841 
    + (876600.0 * 3600 + 8640184.812866) * t0 
    + 0.093104 * t0 * t0 
    - 6.2e-6 * t0 * t0 * t0;

  // Seconds in UT since 0h
  const ut1 = ut * 3600;

  // Earth rotation angle
  const era = 0.7790572732640 + 1.00273790935 * ut1;

  // Total GMST in seconds
  const totalSeconds = gmst0 + 1.00273790935 * ut1;
  const gmstSeconds = totalSeconds % 86400;
  const gmstDegrees = (gmstSeconds / 86400) * 360;

  return normalizeAngle(gmstDegrees);
}

/**
 * Calculate Local Sidereal Time (LST)
 * @param {number} jd - Julian Day Number
 * @param {number} longitude - Observer's longitude in degrees (east positive)
 * @returns {number} LST in degrees (0-360)
 */
export function calculateLST(jd, longitude) {
  const gmst = calculateGMST(jd);
  const lst = gmst + longitude;
  return normalizeAngle(lst);
}

/**
 * Normalize angle to 0-360 range
 * @param {number} angle - Angle in degrees
 * @returns {number} Normalized angle
 */
export function normalizeAngle(angle) {
  let normalized = angle % 360;
  if (normalized < 0) {
    normalized += 360;
  }
  return normalized;
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
export function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 * @param {number} radians - Angle in radians
 * @returns {number} Angle in degrees
 */
export function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

/**
 * Calculate equation of time (approximate)
 * Difference between apparent solar time and mean solar time
 * @param {number} jd - Julian Day Number
 * @returns {number} Equation of time in minutes
 */
export function calculateEquationOfTime(jd) {
  const t = (jd - 2451545.0) / 36525;
  const epsilon = calculateObliquity(jd);
  const l0 = 280.46645 + 36000.76983 * t + 0.0003032 * t * t;
  const e = 0.016708634 - 0.000042037 * t - 0.0000001267 * t * t;
  const m = 357.52910 + 35999.05030 * t - 0.0001536 * t * t;
  
  const eot = 
    -7.657 * Math.sin(degreesToRadians(m))
    + 9.862 * Math.sin(degreesToRadians(2 * l0))
    - 0.037 * Math.sin(degreesToRadians(m + l0));
  
  return eot;
}

export default {
  dateToJulianDay,
  dateToJulianDayTT,
  julianDayToDate,
  calculateObliquity,
  calculateGMST,
  calculateLST,
  normalizeAngle,
  degreesToRadians,
  radiansToDegrees,
  calculateEquationOfTime
};
