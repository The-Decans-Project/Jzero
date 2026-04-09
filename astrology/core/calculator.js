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

/**
 * Calculate complete birth chart for given date, time, and location
 * @param {Object} params - Calculation parameters
 * @param {Date} params.date - Birth date/time (UTC)
 * @param {number} params.latitude - Birth latitude in degrees
 * @param {number} params.longitude - Birth longitude in degrees (east positive)
 * @param {string} params.houseSystem - House system to use (default: 'porphyry')
 * @returns {Object} Complete birth chart with all calculations
 */
export function calculateBirthChart(params) {
  const {
    date,
    latitude,
    longitude,
    houseSystem = 'porphyry'
  } = params;

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
    interpretation: generateInterpretation(planets, houses, aspects)
  };
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
