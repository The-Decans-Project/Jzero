/**
 * Time Corrections Module
 * ΔT (Delta T) calculations, UTC/TT conversions, DST handling
 * Based on Espenak-Meeus 2006 polynomial
 * Open Source Astrology Calculator
 */

/**
 * Calculate Delta T (TT - UT) in seconds using Espenak-Meeus 2006 polynomial
 * Valid for -500 to 2150 with polynomial expansions overlapping different eras
 * @param {number} jd - Julian Day Number
 * @returns {number} Delta T in seconds
 */
export function calculateDeltaT(jd) {
  // Convert JD to decimal year
  const year = jdToDecimalYear(jd);

  let deltaT;

  // Use polynomial based on era
  if (year < 948) {
    deltaT = calculateDeltaTPreHistoric(year);
  } else if (year < 1600) {
    deltaT = calculateDeltaTHistoric(year);
  } else if (year < 1900) {
    deltaT = calculateDeltaTModern(year);
  } else if (year < 1920) {
    deltaT = calculateDeltaTModern1(year);
  } else if (year < 1941) {
    deltaT = calculateDeltaTModern2(year);
  } else if (year < 1961) {
    deltaT = calculateDeltaTModern3(year);
  } else if (year < 1986) {
    deltaT = calculateDeltaTModern4(year);
  } else if (year < 2005) {
    deltaT = calculateDeltaTModern5(year);
  } else if (year < 2050) {
    deltaT = calculateDeltaTModern6(year);
  } else if (year < 2150) {
    deltaT = calculateDeltaTFuture(year);
  } else {
    deltaT = calculateDeltaTExtrapolated(year);
  }

  return deltaT;
}

/**
 * Convert JD to decimal year for Delta T calculations
 * @param {number} jd - Julian Day Number
 * @returns {number} Decimal year
 */
function jdToDecimalYear(jd) {
  // JD 2451545.0 = J2000.0 = 2000 January 1.5 = noon on Jan 1, 2000
  // This is approximately 86400.5 seconds into the year 2000
  const jd2000 = 2451545.0; // J2000.0 epoch
  const daysSinceJ2000 = jd - jd2000;
  const yearsSinceJ2000 = daysSinceJ2000 / 365.25; // Average year length
  return 2000 + yearsSinceJ2000;
}

/**
 * Calculate Delta T for prehistoric times (year < 948)
 * @param {number} year - Decimal year
 * @returns {number} Delta T in seconds
 */
function calculateDeltaTPreHistoric(year) {
  // Extrapolation for far past
  const u = (year - 1820) / 100;
  return -20 + 32 * u * u;
}

/**
 * Calculate Delta T for historic times (948 <= year < 1600)
 * @param {number} year - Decimal year
 * @returns {number} Delta T in seconds
 */
function calculateDeltaTHistoric(year) {
  const u = (year - 1000) / 100;
  return 102 + 102 * u + 106 * u * u;
}

/**
 * Calculate Delta T for modern times (1600 <= year < 1900)
 * @param {number} year - Decimal year
 * @returns {number} Delta T in seconds
 */
function calculateDeltaTModern(year) {
  const t = year - 1600;
  return (((t / 100) ** 2) * -9.20) + ((t / 100) * 9.3803) + 120;
}

/**
 * Calculate Delta T (1900 <= year < 1920)
 * @param {number} year - Decimal year
 * @returns {number} Delta T in seconds
 */
function calculateDeltaTModern1(year) {
  const t = year - 1900;
  return -0.02752 * t + 0.102102 * (t ** 2) + 0.0083 * ((t ** 3) / 100);
}

/**
 * Calculate Delta T (1920 <= year < 1941)
 * @param {number} year - Decimal year
 * @returns {number} Delta T in seconds
 */
function calculateDeltaTModern2(year) {
  const t = year - 1920;
  return 0.020772 * t - 0.009065 * (t ** 2) + 0.004673 * ((t ** 3) / 100);
}

/**
 * Calculate Delta T (1941 <= year < 1961)
 * @param {number} year - Decimal year
 * @returns {number} Delta T in seconds
 */
function calculateDeltaTModern3(year) {
  const t = year - 1950;
  return 0.29965 * t + 0.020672 * (t ** 2) - 0.009595 * ((t ** 3) / 100);
}

/**
 * Calculate Delta T (1961 <= year < 1986)
 * @param {number} year - Decimal year
 * @returns {number} Delta T in seconds
 */
function calculateDeltaTModern4(year) {
  const t = year - 1975;
  return 0.40976 * t + 0.0069814 * (t ** 2) + 0.0059057 * ((t ** 3) / 100);
}

/**
 * Calculate Delta T (1986 <= year < 2005)
 * @param {number} year - Decimal year
 * @returns {number} Delta T in seconds
 */
function calculateDeltaTModern5(year) {
  const t = year - 2000;
  return 0.3345 * t - 0.060374 * (t ** 2) + 0.0017275 * ((t ** 3) / 100) +
         0.0078704 * ((t ** 4) / 10000);
}

/**
 * Calculate Delta T (2005 <= year < 2050)
 * @param {number} year - Decimal year
 * @returns {number} Delta T in seconds
 */
function calculateDeltaTModern6(year) {
  const t = year - 2000;
  return 0.62401 * t + 0.02833 * (t ** 2) - 0.005050 * ((t ** 3) / 100) -
         0.003336 * ((t ** 4) / 10000);
}

/**
 * Calculate Delta T for future (2050 <= year < 2150)
 * @param {number} year - Decimal year
 * @returns {number} Delta T in seconds
 */
function calculateDeltaTFuture(year) {
  return -20 + 32 * (((year - 1820) / 100) ** 2) - 0.5628 * (2150 - year);
}

/**
 * Calculate Delta T by extrapolation beyond 2150
 * @param {number} year - Decimal year
 * @returns {number} Delta T in seconds
 */
function calculateDeltaTExtrapolated(year) {
  return -20 + 32 * (((year - 1820) / 100) ** 2);
}

/**
 * Convert UTC time to TT (Terrestrial Time)
 * @param {Date} utcDate - UTC date/time
 * @returns {Date} TT time
 */
export function utcToTT(utcDate) {
  const jd = dateToJulianDay(utcDate);
  const deltaT = calculateDeltaT(jd);
  const ttMilliseconds = utcDate.getTime() + (deltaT * 1000);
  return new Date(ttMilliseconds);
}

/**
 * Convert TT to UTC
 * @param {Date} ttDate - TT date/time
 * @returns {Date} UTC time
 */
export function ttToUTC(ttDate) {
  const jd = dateToJulianDay(ttDate);
  const deltaT = calculateDeltaT(jd);
  const utcMilliseconds = ttDate.getTime() - (deltaT * 1000);
  return new Date(utcMilliseconds);
}

/**
 * Convert local time to UTC
 * @param {Date} localDate - Local date/time
 * @param {number} timezoneOffsetHours - Timezone offset in hours (positive west)
 * @returns {Date} UTC time
 */
export function localToUTC(localDate, timezoneOffsetHours) {
  const offsetMs = timezoneOffsetHours * 60 * 60 * 1000;
  return new Date(localDate.getTime() + offsetMs);
}

/**
 * Check if date is in DST (simplified heuristic for US/most of Northern Hemisphere)
 * @param {Date} date - Date to check
 * @returns {boolean} True if in DST
 */
export function isDSTHeuristic(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const dayOfWeek = date.getUTCDay();
  const dayOfMonth = date.getUTCDate();

  // DST typically starts 2nd Sunday of March, ends 1st Sunday of November
  if (month < 2 || month > 10) return false; // Simplified
  if (month > 2 && month < 10) return true;  // Simplified

  // March: Check if on or after 2nd Sunday
  if (month === 2) {
    const firstSunday = 1 + (7 - (new Date(year, 2, 1).getDay()));
    const secondSunday = firstSunday + 7;
    return dayOfMonth >= secondSunday;
  }

  // November: Check if before 1st Sunday
  if (month === 10) {
    const firstSunday = 1 + (7 - (new Date(year, 10, 1).getDay()));
    return dayOfMonth < firstSunday;
  }

  return false;
}

/**
 * Calculate Moon parallax for topocentric correction
 * @param {number} Distance to Moon in AU
 * @returns {number} Parallax in degrees
 */
export function calculateMoonParallax(distanceAU) {
  const auInKm = 149597870.7;
  const moonDistanceKm = distanceAU * auInKm;
  return Math.atan2(6371, moonDistanceKm) * (180 / Math.PI); // Earth radius ~6371 km
}

/**
 * Convert JD to date (helper function)
 * @param {number} jd - Julian Day Number
 * @returns {Date} Date object
 */
function dateToJulianDay(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // JavaScript months are 0-based
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();

  let a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  const jd = jdn + (hour - 12) / 24 + minute / 1440 + second / 86400;

  return jd;
}

export default {
  calculateDeltaT,
  utcToTT,
  ttToUTC,
  localToUTC,
  isDSTHeuristic,
  calculateMoonParallax
};
