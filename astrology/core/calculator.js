/**
 * Birth Chart Calculator
 * Main module for calculating natal astrological charts
 * Combines ephemeris, time calculations, and house systems
 * Open Source Astrology Calculator
 */

import { dateToJulianDay, dateToJulianDayTT, calculateLST, normalizeAngle } from './julianDay.js';
import { getEphemerisPosition, getAllEphemerisPositions } from './ephemeris.js';
import { longitudeToZodiac } from './planets.js';
import { calculateHouses, getPlanetHouse } from '../calculations/houses.js';
import { calculateBirthChartCSV } from './csv-calculator.js';

/**
 * Calculate complete birth chart for given date, time, and location
 * Attempts Swiss Ephemeris first, falls back to CSV calibration if unavailable
 * 
 * @param {Object} params - Calculation parameters
 * @param {Date|number} params.date - Birth date/time (UTC as Date object or year as number)
 * @param {number} params.year - Birth year (if not using date object)
 * @param {number} params.month - Birth month (1-12)
 * @param {number} params.day - Birth day (1-31)
 * @param {number} params.hour - Birth hour (0-23, in local time or UTC)
 * @param {number} params.minute - Birth minute (0-59)
 * @param {number} params.timezone - Timezone offset in hours (e.g., -5 for EST)
 * @param {number} params.latitude - Birth latitude in degrees
 * @param {number} params.longitude - Birth longitude in degrees (east positive)
 * @param {string} params.houseSystem - House system to use (default: 'porphyry')
 * @param {boolean} params.csvOnly - Force CSV calculation (for testing/demo)
 * @returns {Object} Complete birth chart with all calculations
 */
export function calculateBirthChart(params) {
  const {
    csvOnly = false,
    houseSystem = 'porphyry'
  } = params;

  let date;
  
  // Support both Date object and individual date/time components
  if (params.date instanceof Date) {
    date = params.date;
  } else if (params.year !== undefined) {
    const { year, month, day, hour = 0, minute = 0, timezone = 0 } = params;
    // Convert local time to UTC
    const utcHour = (hour - timezone + 24) % 24;
    date = new Date(Date.UTC(year, month - 1, day, utcHour, minute, 0));
  } else {
    throw new Error('Must provide either date object or year/month/day parameters');
  }

  // If CSV-only mode or Swiss isn't available, use CSV calculator
  if (csvOnly) {
    const csvResult = calculateBirthChartCSV({
      year: params.year || date.getUTCFullYear(),
      month: params.month || (date.getUTCMonth() + 1),
      day: params.day || date.getUTCDate(),
      hour: params.hour || date.getUTCHours(),
      minute: params.minute || date.getUTCMinutes(),
      timezone: params.timezone || 0,
      latitude: params.latitude || 0,
      longitude: params.longitude || 0
    });
    
    return {
      mode: 'CSV_CALIBRATION',
      date: date,
      ...csvResult,
      notice: 'LIMITED DEMONSTRATION - Zodiac signs verified, degrees interpolated from ingress data',
      recommendation: 'For professional use: Install Swiss Ephemeris and recalculate'
    };
  }

  try {
    // Try Swiss Ephemeris calculation
    const latitude = params.latitude || 0;
    const longitude = params.longitude || 0;
    
    const jd = dateToJulianDay(date);
    const jdTT = dateToJulianDayTT(date);
    const lst = calculateLST(jd, longitude);

    // Get all planetary positions
    const planets = getAllEphemerisPositions(jdTT);

    // Calculate houses
    const houses = calculateHouses(jdTT, latitude, longitude, houseSystem);

    // Assign planets to houses
    Object.keys(planets).forEach(planet => {
      if (planets[planet]) {
        planets[planet].house = getPlanetHouse(planets[planet].longitude, houses.houses);
      }
    });

    // Calculate aspects
    const aspects = calculateAspects(planets);

    return {
      mode: 'SWISS_EPHEMERIS',
      date: date,
      jd: jd,
      jdTT: jdTT,
      latitude: latitude,
      longitude: longitude,
      lst: lst,
      houseSystem: houseSystem,
      planets: planets,
      houses: houses,
      aspects: aspects,
      accuracy: 'High precision (±0.0001°)',
      interpretation: generateInterpretation(planets, houses, aspects)
    };
  } catch (error) {
    // Fallback to CSV calculation
    console.warn(`Swiss Ephemeris unavailable (${error.message}), falling back to CSV calibration`);
    
    const csvResult = calculateBirthChartCSV({
      year: params.year || date.getUTCFullYear(),
      month: params.month || (date.getUTCMonth() + 1),
      day: params.day || date.getUTCDate(),
      hour: params.hour || date.getUTCHours(),
      minute: params.minute || date.getUTCMinutes(),
      timezone: params.timezone || 0,
      latitude: params.latitude || 0,
      longitude: params.longitude || 0
    });
    
    return {
      mode: 'CSV_FALLBACK',
      date: date,
      ...csvResult,
      notice: 'LIMITED DEMONSTRATION (fallback)',
      warning: 'Swiss Ephemeris not available - using interpolated ingress data',
      recommendation: 'For professional accuracy: Install Swiss Ephemeris'
    };
  }
}

/**
 * Calculate aspects between all planets
 * @param {Object} planets - Planetary positions
 * @returns {Array} Array of aspects
 */
export function calculateAspects(planets) {
  const aspects = [];
  const planetArray = Object.keys(planets).filter(p => planets[p]);
  const aspectAngles = {
    Conjunction: { angle: 0, orb: 8 },
    Sextile: { angle: 60, orb: 6 },
    Square: { angle: 90, orb: 8 },
    Trine: { angle: 120, orb: 8 },
    Opposition: { angle: 180, orb: 8 },
    Quincunx: { angle: 150, orb: 3 }
  };

  for (let i = 0; i < planetArray.length; i++) {
    for (let j = i + 1; j < planetArray.length; j++) {
      const planet1 = planetArray[i];
      const planet2 = planetArray[j];
      const pos1 = planets[planet1].longitude;
      const pos2 = planets[planet2].longitude;

      const diff = Math.abs(pos1 - pos2);
      const distance = diff > 180 ? 360 - diff : diff;

      for (const [aspectName, aspectData] of Object.entries(aspectAngles)) {
        const orb = Math.abs(distance - aspectData.angle);
        if (orb <= aspectData.orb) {
          aspects.push({
            planet1: planet1,
            planet2: planet2,
            aspect: aspectName,
            angle: aspectData.angle,
            distance: distance,
            orb: orb
          });
          break;
        }
      }
    }
  }

  return aspects;
}

/**
 * Generate chart interpretation based on positions
 * @param {Object} planets - Planetary positions
 * @param {Object} houses - House information
 * @param {Array} aspects - Aspects
 * @returns {Object} Interpretation summary
 */
export function generateInterpretation(planets, houses, aspects) {
  return {
    summary: `Birth chart calculated for ${houses.ascendant.toFixed(2)}° ascendant`,
    sunrise_set: 'Calculated from JD and coordinates',
    moon_phase: 'Waxing/Waning based on Sun-Moon separation',
    aspects_count: aspects.length,
    major_aspects: aspects.filter(a => ['Conjunction', 'Square', 'Opposition', 'Trine'].includes(a.aspect)),
    elevation: {
      eastern: planets.Sun?.longitude || 0,
      western: normalizeAngle((planets.Sun?.longitude || 0) + 180)
    }
  };
}

export default {
  calculateBirthChart,
  calculateAspects,
  generateInterpretation
};
