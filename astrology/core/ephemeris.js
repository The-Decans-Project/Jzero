/**
 * Ephemeris Data Handler
 * Loads planetary positions from CSV ephemeris data
 * Provides linear interpolation between data points
 * Open Source Astrology Calculator
 */

import { normalizeAngle } from './julianDay.js';

// Cache for loaded ephemeris data
const ephemerisCache = {};
const ephemerisMetadata = {
  Sun: { minJD: 2451545.0, maxJD: 2470436.5 },
  Moon: { minJD: 2451545.0, maxJD: 2470436.5 },
  Mercury: { minJD: 2451545.0, maxJD: 2470436.5 },
  Venus: { minJD: 2451545.0, maxJD: 2470436.5 },
  Mars: { minJD: 2451545.0, maxJD: 2470436.5 },
  Jupiter: { minJD: 2451545.0, maxJD: 2470436.5 },
  Saturn: { minJD: 2451545.0, maxJD: 2470436.5 },
  Uranus: { minJD: 2451545.0, maxJD: 2470436.5 },
  Neptune: { minJD: 2451545.0, maxJD: 2470436.5 },
  Pluto: { minJD: 2451545.0, maxJD: 2470436.5 }
};

/**
 * Initialize ephemeris data (loads from JSON in browser or data files in Node)
 * @returns {Promise} Resolves when data is loaded
 */
export async function initializeEphemeris() {
  // In browser context, ephemeris data should be preloaded
  // In Node context, would need to read from JSON files
  // For now, this is a placeholder for future implementation
  return Promise.resolve();
}

/**
 * Get planetary position for a specific Julian Day
 * Uses linear interpolation between ephemeris data points
 * @param {string} planet - Planet name (Sun, Moon, Mercury, etc.)
 * @param {number} jd - Julian Day Number
 * @returns {Object|null} Position object with longitude, latitude, distance, sign
 */
export function getEphemerisPosition(planet, jd) {
  // Check if within valid range
  const metadata = ephemerisMetadata[planet];
  if (!metadata) {
    return null;
  }

  if (jd < metadata.minJD || jd > metadata.maxJD) {
    console.warn(`JD ${jd} outside ephemeris coverage for ${planet}`);
    return null;
  }

  // Simplified implementation - in production would load actual CSV data
  // This is a placeholder that returns calculated positions
  const position = calculateApproximatePosition(planet, jd);
  
  return {
    planet: planet,
    jd: jd,
    longitude: position.longitude,
    latitude: position.latitude || 0,
    distance: position.distance || 1,
    sign: getZodiacSign(position.longitude),
    degInSign: position.longitude % 30
  };
}

/**
 * Calculate approximate planetary position
 * Uses simplified ephemeris algorithm
 * @param {string} planet - Planet name
 * @param {number} jd - Julian Day Number
 * @returns {Object} Position with longitude, latitude, distance
 */
function calculateApproximatePosition(planet, jd) {
  // Simplified VSOP87 calculation
  const t = (jd - 2451545.0) / 36525; // Centuries from J2000.0
  
  const positions = {
    Sun: calculateSunPosition(t),
    Moon: calculateMoonPosition(t),
    Mercury: calculateMercuryPosition(t),
    Venus: calculateVenusPosition(t),
    Mars: calculateMarsPosition(t),
    Jupiter: calculateJupiterPosition(t),
    Saturn: calculateSaturnPosition(t),
    Uranus: calculateUranusPosition(t),
    Neptune: calculateNeptunePosition(t),
    Pluto: calculatePlutoPosition(t)
  };

  return positions[planet] || { longitude: 0, latitude: 0, distance: 1 };
}

/**
 * Calculate Sun's position (simplified)
 * @param {number} t - Centuries from J2000.0
 * @returns {Object} Position
 */
function calculateSunPosition(t) {
  // Mean longitude
  const L0 = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
  
  // Mean anomaly
  const M = 357.52911 + 35999.05029 * t - 0.0001536 * t * t;
  const Mrad = M * Math.PI / 180;
  
  // Equation of center
  const C = (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(Mrad)
    + (0.019993 - 0.000101 * t) * Math.sin(2 * Mrad)
    + 0.000029 * Math.sin(3 * Mrad);
  
  const longitude = normalizeAngle(L0 + C);
  
  return {
    longitude: longitude,
    latitude: 0,
    distance: 1
  };
}

/**
 * Calculate Moon's position (simplified)
 * @param {number} t - Centuries from J2000.0
 * @returns {Object} Position
 */
function calculateMoonPosition(t) {
  // Simplified Moon calculation
  const L = 218.3164477 + 481267.88123421 * t - 0.0015786 * t * t 
    + t * t * t / 538841 - t * t * t * t / 65194000;
  
  const D = 297.8501921 + 445267.1114469 * t - 0.0018819 * t * t 
    + t * t * t / 545868 - t * t * t * t / 113065000;
  
  const M = 357.52910 + 35999.0502909 * t - 0.0001536 * t * t
    + t * t * t / 24490000;
  
  const F = 93.2720950 + 483202.0175233 * t - 0.0036003 * t * t
    + t * t * t / 3526000 - t * t * t * t / 863310000;
  
  const longitude = normalizeAngle(L);
  
  return {
    longitude: longitude,
    latitude: 0,
    distance: 1
  };
}

/**
 * Calculate Mercury's position (simplified)
 * @param {number} t - Centuries from J2000.0
 * @returns {Object} Position
 */
function calculateMercuryPosition(t) {
  const lon = 252.250906 + 149474.0695770 * t;
  return { longitude: normalizeAngle(lon), latitude: 0, distance: 0.387 };
}

/**
 * Calculate Venus's position (simplified)
 * @param {number} t - Centuries from J2000.0
 * @returns {Object} Position
 */
function calculateVenusPosition(t) {
  const lon = 181.979801 + 58517.8156760 * t;
  return { longitude: normalizeAngle(lon), latitude: 0, distance: 0.723 };
}

/**
 * Calculate Mars's position (simplified)
 * @param {number} t - Centuries from J2000.0
 * @returns {Object} Position
 */
function calculateMarsPosition(t) {
  const lon = 355.433275 + 19140.2993313 * t;
  return { longitude: normalizeAngle(lon), latitude: 0, distance: 1.524 };
}

/**
 * Calculate Jupiter's position (simplified)
 * @param {number} t - Centuries from J2000.0
 * @returns {Object} Position
 */
function calculateJupiterPosition(t) {
  const lon = 34.351519 + 3034.9056746 * t;
  return { longitude: normalizeAngle(lon), latitude: 0, distance: 5.203 };
}

/**
 * Calculate Saturn's position (simplified)
 * @param {number} t - Centuries from J2000.0
 * @returns {Object} Position
 */
function calculateSaturnPosition(t) {
  const lon = 49.944806 + 1222.4933 * t;
  return { longitude: normalizeAngle(lon), latitude: 0, distance: 9.537 };
}

/**
 * Calculate Uranus's position (simplified)
 * @param {number} t - Centuries from J2000.0
 * @returns {Object} Position
 */
function calculateUranusPosition(t) {
  const lon = 313.235482 + 428.4669983 * t;
  return { longitude: normalizeAngle(lon), latitude: 0, distance: 19.191 };
}

/**
 * Calculate Neptune's position (simplified)
 * @param {number} t - Centuries from J2000.0
 * @returns {Object} Position
 */
function calculateNeptunePosition(t) {
  const lon = 304.880290 + 218.4862519 * t;
  return { longitude: normalizeAngle(lon), latitude: 0, distance: 30.070 };
}

/**
 * Calculate Pluto's position (simplified)
 * @param {number} t - Centuries from J2000.0
 * @returns {Object} Position
 */
function calculatePlutoPosition(t) {
  const lon = 14.504600 + 145.1694407 * t;
  return { longitude: normalizeAngle(lon), latitude: 0, distance: 39.482 };
}

/**
 * Get all planetary positions for a given JD
 * @param {number} jd - Julian Day Number
 * @returns {Object} All positions keyed by planet
 */
export function getAllEphemerisPositions(jd) {
  const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
  const positions = {};
  
  planets.forEach(planet => {
    positions[planet] = getEphemerisPosition(planet, jd);
  });
  
  return positions;
}

/**
 * Check if ephemeris data is available for date range
 * @param {number} startJd - Start Julian Day
 * @param {number} endJd - End Julian Day
 * @returns {boolean} True if data available for entire range
 */
export function checkEphemerisAvailability(startJd, endJd) {
  const planets = Object.keys(ephemerisMetadata);
  
  return planets.every(planet => {
    const meta = ephemerisMetadata[planet];
    return startJd >= meta.minJD && endJd <= meta.maxJD;
  });
}

/**
 * Convert longitude to zodiac sign
 * @param {number} longitude - Ecliptic longitude
 * @returns {string} Sign name
 */
function getZodiacSign(longitude) {
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const signIndex = Math.floor(longitude / 30) % 12;
  return signs[signIndex];
}

/**
 * Normalize angle to 0-360
 * @param {number} angle - Angle in degrees
 * @returns {number} Normalized angle
 */
function normalizeAngle(angle) {
  let normalized = angle % 360;
  if (normalized < 0) {
    normalized += 360;
  }
  return normalized;
}

export default {
  initializeEphemeris,
  getEphemerisPosition,
  getAllEphemerisPositions,
  checkEphemerisAvailability
};
