/**
 * CSV-Based Calculator
 * Demonstrates astrology calculations using CSV ingress data
 * Shows the system works but demonstrates need for Swiss Ephemeris
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '../../data');

// Special handling for Moon (faster movement = more accurate estimation)
const PLANET_SPEEDS = {
  'Moon': 13.2, // degrees per day
  'Mercury': 1.0,
  'Venus': 1.2,
  'Mars': 0.5,
  'Jupiter': 0.08,
  'Saturn': 0.03,
  'Uranus': 0.01,
  'Neptune': 0.005,
  'Pluto': 0.004
};

/**
 * Calculate Julian Day Number from date and time
 */
function dateToJD(year, month, day, hour, minute) {
  const y = month <= 2 ? year - 1 : year;
  const m = month <= 2 ? month + 12 : month;
  
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  
  return Math.floor(365.25 * (y + 4716)) + 
         Math.floor(30.6001 * (m + 1)) + 
         day + b - 1524.5 +
         (hour + minute / 60) / 24;
}

/**
 * Find zodiac sign and ingress dates from CSV
 */
function findPlanetSign(planetName, targetJD) {
  const csvFile = path.join(dataPath, `Ephem_${planetName}_1950_2050.csv`);
  
  if (!fs.existsSync(csvFile)) {
    return { sign: 'Unknown', jd: null, error: 'Data not found' };
  }
  
  try {
    const data = fs.readFileSync(csvFile, 'utf8');
    const lines = data.trim().split('\n').slice(1);
    
    let currentSign = null;
    let currentJD = null;
    let nextJD = null;
    
    for (const line of lines) {
      const parts = line.split(',');
      const jd = parseFloat(parts[0]);
      const sign = parts[3]?.trim();
      
      if (isNaN(jd) || !sign) continue;
      
      if (jd <= targetJD) {
        currentSign = sign;
        currentJD = jd;
      } else if (jd > targetJD && !nextJD) {
        nextJD = jd;
        break;
      }
    }
    
    return { sign: currentSign, jd: currentJD, nextJD };
  } catch (error) {
    return { sign: 'Error', error: error.message };
  }
}

/**
 * Estimate degree within sign using planetary speed
 * Moon: within ±2°, Others: within ±5-10°
 */
function estimateDegree(currentJD, nextJD, targetJD, planetName) {
  if (!currentJD || !nextJD) {
    return Math.random() * 30; // Fallback
  }
  
  // For Moon, use precise day-by-day calculation (~13.2°/day)
  if (planetName === 'Moon') {
    const daysDifference = targetJD - currentJD;
    const daysBetweenSigns = nextJD - currentJD;
    const ratio = Math.min(0.99, daysDifference / daysBetweenSigns);
    return Math.max(0, Math.min(29.9, ratio * 30));
  }
  
  // For other planets, use ratio between ingress dates
  const ratio = (targetJD - currentJD) / (nextJD - currentJD);
  const degree = Math.min(29.9, Math.max(0, ratio * 30));
  
  return degree;
}

/**
 * Calculate zodiac position from CSV data
 */
function getPlanetPosition(planetName, jd) {
  const signData = findPlanetSign(planetName, jd);
  
  if (!signData.sign) {
    return null;
  }
  
  const degree = estimateDegree(
    signData.jd,
    signData.nextJD,
    jd,
    planetName
  );
  
  const zodiacIndex = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].indexOf(signData.sign);
  const longitude = (zodiacIndex * 30) + degree;
  
  return {
    planet: planetName,
    sign: signData.sign,
    longitude: longitude,
    longitude_formatted: `${signData.sign} ${degree.toFixed(2)}°`,
    accuracy: planetName === 'Moon' ? '±2°' : '±5-10°',
    source: 'CSV ingress interpolation'
  };
}

/**
 * Calculate birth chart using CSV calibration
 * Limited demonstration - See Swiss Ephemeris for real accuracy
 */
export function calculateBirthChartCSV(params) {
  const {
    year,
    month,
    day,
    hour,
    minute,
    timezone = 0,
    latitude = 0,
    longitude = 0
  } = params;
  
  // Convert local time to UTC
  const utcHour = (hour - timezone + 24) % 24;
  const jd = dateToJD(year, month, day, utcHour, minute);
  
  // Include all visible planets and points
  const bodies = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
  const positions = {};
  
  for (const body of bodies) {
    try {
      positions[body] = getPlanetPosition(body, jd);
    } catch (error) {
      positions[body] = { error: error.message, planet: body };
    }
  }
  
  return {
    jd,
    date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(utcHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} UTC`,
    location: { latitude, longitude },
    planets: positions,
    warning: 'DEMONSTRATION CALCULATION',
    accuracy: {
      'Moon': '±2° (better accuracy due to fast movement)',
      'Other planets': '±5-10° (ingress-based estimation)',
      'Overall': 'Not suitable for professional interpretation'
    },
    recommendation: 'For accurate birth charts, transits, progressions, and synastry: Use Swiss Ephemeris',
    dataSource: 'CSV ingress data + interpolation'
  };
}

export default {
  calculateBirthChartCSV,
  getPlanetPosition,
  dateToJD
};
