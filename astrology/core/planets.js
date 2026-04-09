/**
 * Planetary Data and Calculations
 * VSOP87 orbital elements and simplified planetary position calculations
 * Open Source Astrology Calculator
 */

/**
 * Planetary orbital constants (J2000.0 epoch)
 * VSOP87 mean orbital elements
 */
export const PLANETARY_CONSTANTS = {
  Mercury: {
    symbol: '☿',
    color: '#8C7853',
    orbitalPeriod: 87.969,
    semimajorAxis: 0.38709893,
    eccentricity: 0.20563069,
    inclination: 7.00487,
    ascendingNode: 48.33167,
    argumentOfPerihelion: 77.45645,
    meanAnomaly: 252.25084,
    meanMotion: 4.09273635,
    mass: 0.0553,
    radius: 2440
  },
  Venus: {
    symbol: '♀',
    color: '#FFC649',
    orbitalPeriod: 224.701,
    semimajorAxis: 0.72333199,
    eccentricity: 0.00677323,
    inclination: 3.39471,
    ascendingNode: 76.68069,
    argumentOfPerihelion: 131.53298,
    meanAnomaly: 181.97973,
    meanMotion: 1.60213034,
    mass: 0.815,
    radius: 6052
  },
  Earth: {
    symbol: '⊕',
    color: '#2E68FF',
    orbitalPeriod: 365.256363004,
    semimajorAxis: 1.00000011,
    eccentricity: 0.01671022,
    inclination: 0.00005,
    ascendingNode: -11.26064,
    argumentOfPerihelion: 102.94719,
    meanAnomaly: 100.46435,
    meanMotion: 0.98560999,
    mass: 1.0,
    radius: 6371
  },
  Sun: {
    symbol: '☉',
    color: '#FDB813',
    orbitalPeriod: 0,
    semimajorAxis: 0,
    eccentricity: 0,
    inclination: 0,
    ascendingNode: 0,
    argumentOfPerihelion: 0,
    meanAnomaly: 0,
    meanMotion: 0,
    mass: 332946.0,
    radius: 696000
  },
  Moon: {
    symbol: '☽',
    color: '#D3D3D3',
    orbitalPeriod: 27.321662,
    semimajorAxis: 0.00257,
    eccentricity: 0.0549,
    inclination: 5.145,
    ascendingNode: 125.04,
    argumentOfPerihelion: 318.15,
    meanAnomaly: 115.3654,
    meanMotion: 13.2555,
    mass: 0.01230,
    radius: 1737
  },
  Mars: {
    symbol: '♂',
    color: '#E27B58',
    orbitalPeriod: 686.971,
    semimajorAxis: 1.52366231,
    eccentricity: 0.09341233,
    inclination: 1.85061,
    ascendingNode: 49.57854,
    argumentOfPerihelion: 336.04084,
    meanAnomaly: 355.45332,
    meanMotion: 0.52441314,
    mass: 0.1074,
    radius: 3390
  },
  Jupiter: {
    symbol: '♃',
    color: '#C88B3A',
    orbitalPeriod: 4332.89,
    semimajorAxis: 5.20336301,
    eccentricity: 0.04839266,
    inclination: 1.30530,
    ascendingNode: 100.49297,
    argumentOfPerihelion: 14.72847,
    meanAnomaly: 34.40438,
    meanMotion: 0.08308529,
    mass: 317.83,
    radius: 69911
  },
  Saturn: {
    symbol: '♄',
    color: '#FAD5A5',
    orbitalPeriod: 10759.22,
    semimajorAxis: 9.53707032,
    eccentricity: 0.05386179,
    inclination: 2.48446,
    ascendingNode: 113.66529,
    argumentOfPerihelion: 92.59887,
    meanAnomaly: 49.94432,
    meanMotion: 0.03393631,
    mass: 95.162,
    radius: 58232
  },
  Uranus: {
    symbol: '♅',
    color: '#4FD0E7',
    orbitalPeriod: 30688.5,
    semimajorAxis: 19.1912784,
    eccentricity: 0.04716771,
    inclination: 0.76986,
    ascendingNode: 74.22988,
    argumentOfPerihelion: 170.96424,
    meanAnomaly: 313.23218,
    meanMotion: 0.01172834,
    mass: 14.536,
    radius: 25362
  },
  Neptune: {
    symbol: '♆',
    color: '#4166F5',
    orbitalPeriod: 60182,
    semimajorAxis: 30.0699541,
    eccentricity: 0.00858587,
    inclination: 1.76917,
    ascendingNode: 131.72169,
    argumentOfPerihelion: 44.97135,
    meanAnomaly: 304.88003,
    meanMotion: 0.00597862,
    mass: 17.147,
    radius: 24622
  },
  Pluto: {
    symbol: '♇',
    color: '#AF8F6B',
    orbitalPeriod: 90520,
    semimajorAxis: 39.48211675,
    eccentricity: 0.24882730,
    inclination: 17.14001,
    ascendingNode: 110.29673,
    argumentOfPerihelion: 113.83353,
    meanAnomaly: 14.53352,
    meanMotion: 0.00398351,
    mass: 0.00213,
    radius: 1188
  }
};

/**
 * Zodiac signs with symbols, rulers, and elements
 */
export const ZODIAC_SIGNS = [
  { sign: 'Aries', symbol: '♈', element: 'Fire', ruler: 'Mars', modality: 'Cardinal' },
  { sign: 'Taurus', symbol: '♉', element: 'Earth', ruler: 'Venus', modality: 'Fixed' },
  { sign: 'Gemini', symbol: '♊', element: 'Air', ruler: 'Mercury', modality: 'Mutable' },
  { sign: 'Cancer', symbol: '♋', element: 'Water', ruler: 'Moon', modality: 'Cardinal' },
  { sign: 'Leo', symbol: '♌', element: 'Fire', ruler: 'Sun', modality: 'Fixed' },
  { sign: 'Virgo', symbol: '♍', element: 'Earth', ruler: 'Mercury', modality: 'Mutable' },
  { sign: 'Libra', symbol: '♎', element: 'Air', ruler: 'Venus', modality: 'Cardinal' },
  { sign: 'Scorpio', symbol: '♏', element: 'Water', ruler: 'Mars', modality: 'Fixed' },
  { sign: 'Sagittarius', symbol: '♐', element: 'Fire', ruler: 'Jupiter', modality: 'Mutable' },
  { sign: 'Capricorn', symbol: '♑', element: 'Earth', ruler: 'Saturn', modality: 'Cardinal' },
  { sign: 'Aquarius', symbol: '♒', element: 'Air', ruler: 'Uranus', modality: 'Fixed' },
  { sign: 'Pisces', symbol: '♓', element: 'Water', ruler: 'Neptune', modality: 'Mutable' }
];

/**
 * Convert ecliptic longitude to zodiac sign and position
 * @param {number} longitude - Ecliptic longitude in degrees (0-360)
 * @returns {Object} Sign name, index, and degrees within sign
 */
export function longitudeToZodiac(longitude) {
  const normalizedLon = longitude % 360;
  const signIndex = Math.floor(normalizedLon / 30);
  const degInSign = normalizedLon % 30;
  
  return {
    sign: ZODIAC_SIGNS[signIndex].sign,
    symbol: ZODIAC_SIGNS[signIndex].symbol,
    index: signIndex,
    degInSign: degInSign,
    element: ZODIAC_SIGNS[signIndex].element,
    ruler: ZODIAC_SIGNS[signIndex].ruler
  };
}

/**
 * Calculate planet position using simplified VSOP87 method
 * This is intentionally simplified for learning/demonstration
 * Production code should use full JPL ephemeris or full VSOP87 coefficients
 * @param {string} planet - Planet name
 * @param {number} jd - Julian Day Number
 * @returns {Object} Planet position with longitude, latitude, distance
 */
export function calculatePlanetPosition(planet, jd) {
  const constants = PLANETARY_CONSTANTS[planet];
  if (!constants) {
    return null;
  }

  // Simplified calculation: use mean orbital elements with basic motion
  const t = (jd - 2451545.0) / 36525; // Centuries from J2000.0
  const meanMotion = constants.meanMotion;
  const meanAnomaly = (constants.meanAnomaly + meanMotion * t * 36525) % 360;

  // Simplified elliptic orbit calculation (more accurate uses Kepler's equation)
  const e = constants.eccentricity;
  const a = constants.semimajorAxis;
  
  // Approximate true anomaly using simple formula
  const trueAnomaly = meanAnomaly + 2 * e * Math.sin(meanAnomaly * Math.PI / 180) * (180 / Math.PI);
  
  // Orbital longitude
  const argumentOfPerihelion = (constants.argumentOfPerihelion + 0.1 * t) % 360;
  const longitude = (argumentOfPerihelion + trueAnomaly) % 360;
  
  // Distance (simplified)
  const distance = a * (1 - e * e) / (1 + e * Math.cos((trueAnomaly * Math.PI / 180)));
  
  return {
    planet: planet,
    longitude: longitude,
    latitude: 0, // Simplified - ignores orbital inclination
    distance: distance,
    zodiac: longitudeToZodiac(longitude)
  };
}

/**
 * Calculate all planet positions for a given JD
 * @param {number} jd - Julian Day Number
 * @returns {Object} All planetary positions keyed by planet name
 */
export function calculateAllPlanets(jd) {
  const positions = {};
  
  Object.keys(PLANETARY_CONSTANTS).forEach(planet => {
    positions[planet] = calculatePlanetPosition(planet, jd);
  });
  
  return positions;
}

/**
 * Get planetary qualities (fast/slow, benefic/malefic)
 * @param {string} planet - Planet name
 * @returns {Object} Planetary qualities
 */
export function getPlanetaryQualities(planet) {
  const qualities = {
    Sun: { speed: 'fast', nature: 'benefic', gender: 'masculine' },
    Moon: { speed: 'fast', nature: 'benefic', gender: 'feminine' },
    Mercury: { speed: 'fast', nature: 'neutral', gender: 'masculine' },
    Venus: { speed: 'fast', nature: 'benefic', gender: 'feminine' },
    Mars: { speed: 'fast', nature: 'malefic', gender: 'masculine' },
    Jupiter: { speed: 'slow', nature: 'benefic', gender: 'masculine' },
    Saturn: { speed: 'slow', nature: 'malefic', gender: 'masculine' },
    Uranus: { speed: 'slowest', nature: 'neutral', gender: 'masculine' },
    Neptune: { speed: 'slowest', nature: 'neutral', gender: 'feminine' },
    Pluto: { speed: 'slowest', nature: 'malefic', gender: 'masculine' }
  };
  
  return qualities[planet] || null;
}

export default {
  PLANETARY_CONSTANTS,
  ZODIAC_SIGNS,
  longitudeToZodiac,
  calculatePlanetPosition,
  calculateAllPlanets,
  getPlanetaryQualities
};
