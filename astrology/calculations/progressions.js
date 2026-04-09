/**
 * Progressions Module
 * Calculates secondary progressions and other predictive techniques
 * Framework for developmental astrology
 * Integrated with Jzero's ephemeris system
 */

import { getEphemerisPosition } from '../core/ephemeris.js';
import { dateToJulianDay } from '../core/julianDay.js';
/**
 * Calculate secondary progressions for a natal chart
 * @param {Object} natalChart - Natal chart
 * @param {number} yearsProgressed - Years to progress
 * @returns {Object} Progressed chart
 */
export function calculateSecondaryProgression(natalChart, yearsProgressed) {
    const progressed = {};

    // Secondary progression: 1 day = 1 year
    const progressionJd = natalChart.jd + yearsProgressed;

    // Planets to progress
    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

    planets.forEach(planet => {
        if (natalChart[planet] && natalChart[planet].longitude !== undefined) {
            // Get progressed position from ephemeris
            const progressedPos = getEphemerisPosition(planet, progressionJd);

            if (progressedPos) {
                progressed[planet] = {
                    longitude: progressedPos.longitude,
                    sign: progressedPos.sign,
                    degInSign: progressedPos.degInSign
                };
            } else {
                // Fallback: simple linear progression
                const dailyMotion = getDailyMotion(planet);
                const progressedLongitude = (natalChart[planet].longitude + dailyMotion * yearsProgressed) % 360;

                progressed[planet] = {
                    longitude: progressedLongitude,
                    sign: longitudeToSign(progressedLongitude),
                    degInSign: progressedLongitude % 30
                };
            }
        }
    });

    return {
        jd: progressionJd,
        positions: progressed,
        age: yearsProgressed
    };
}

/**
 * Get daily motion for secondary progressions (degrees per day)
 * @param {string} planet - Planet name
 * @returns {number} Degrees per day
 */
function getDailyMotion(planet) {
    // Approximate daily motions for secondary progressions
    const motions = {
        Sun: 0.98,      // ~1 degree per day (solar motion)
        Moon: 13.2,     // Moon's actual daily motion
        Mercury: 1.4,
        Venus: 1.2,
        Mars: 0.5,
        Jupiter: 0.08,
        Saturn: 0.03,
        Uranus: 0.01,
        Neptune: 0.006,
        Pluto: 0.004
    };
    return motions[planet] || 1.0;
}

/**
 * Calculate solar arc progressions
 * @param {Object} natalChart - Natal chart
 * @param {number} yearsProgressed - Years progressed
 * @returns {Object} Solar arc progressed chart
 */
export function calculateSolarArc(natalChart, yearsProgressed) {
    const progressed = {};

    // Solar arc: all planets move by the same amount as the Sun
    const solarArc = yearsProgressed * 0.98; // Sun's daily motion

    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

    planets.forEach(planet => {
        if (natalChart[planet] && natalChart[planet].longitude !== undefined) {
            const progressedLongitude = (natalChart[planet].longitude + solarArc) % 360;

            progressed[planet] = {
                longitude: progressedLongitude,
                sign: longitudeToSign(progressedLongitude)
            };
        }
    });

    return {
        positions: progressed,
        solarArc: solarArc,
        age: yearsProgressed
    };
}

/**
 * Calculate tertiary progressions (1 day = 1 month)
 * @param {Object} natalChart - Natal chart
 * @param {number} monthsProgressed - Months progressed
 * @returns {Object} Tertiary progressed chart
 */
export function calculateTertiaryProgression(natalChart, monthsProgressed) {
    const progressed = {};

    // Convert months to days for tertiary progression
    const daysProgressed = monthsProgressed;

    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

    planets.forEach(planet => {
        if (natalChart[planet] && natalChart[planet].longitude !== undefined) {
            const dailyMotion = getDailyMotion(planet);
            const progressedLongitude = (natalChart[planet].longitude + dailyMotion * daysProgressed) % 360;

            progressed[planet] = {
                longitude: progressedLongitude,
                sign: longitudeToSign(progressedLongitude)
            };
        }
    });

    return {
        positions: progressed,
        months: monthsProgressed
    };
}

/**
 * Find progressed aspects to natal planets
 * @param {Object} natalChart - Natal chart
 * @param {Object} progressedChart - Progressed chart
 * @returns {Array} Progressed aspects
 */
export function calculateProgressedAspects(natalChart, progressedChart) {
    const aspects = [];
    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

    planets.forEach(progressedPlanet => {
        planets.forEach(natalPlanet => {
            if (!progressedChart.positions[progressedPlanet] ||
                !natalChart[natalPlanet] ||
                !natalChart[natalPlanet].longitude) return;

            const aspect = getAspectForPoints(
                progressedChart.positions[progressedPlanet].longitude, 0, 0, 0,
                natalChart[natalPlanet].longitude, 0, 0, 0
            );

            if (aspect) {
                aspects.push({
                    progressedPlanet: progressedPlanet,
                    natalPlanet: natalPlanet,
                    aspect: aspect,
                    orb: calculateOrb(
                        progressedChart.positions[progressedPlanet].longitude,
                        natalChart[natalPlanet].longitude,
                        aspect
                    )
                });
            }
        });
    });

    return aspects;
}

/**
 * Calculate solar return chart
 * @param {Object} natalChart - Natal chart
 * @param {number} year - Year for return
 * @returns {Object} Solar return chart
 */
export function calculateSolarReturn(natalChart, year) {
    // Find when Sun returns to natal position in the given year
    const natalSunLongitude = natalChart.Sun.longitude;
    const returnJd = findSolarReturnJd(natalSunLongitude, year);

    // Calculate planetary positions for return date
    const returnPositions = {};
    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

    planets.forEach(planet => {
        const position = getEphemerisPosition(planet, returnJd);
        if (position) {
            returnPositions[planet] = {
                longitude: position.longitude,
                sign: position.sign,
                degInSign: position.degInSign
            };
        }
    });

    return {
        jd: returnJd,
        positions: returnPositions,
        year: year
    };
}

/**
 * Find Julian Day when Sun returns to natal position
 * @param {number} natalSunLongitude - Natal Sun longitude
 * @param {number} year - Year for return
 * @returns {number} Julian Day of solar return
 */
function findSolarReturnJd(natalSunLongitude, year) {
    // Simplified calculation - find JD where Sun is at natal longitude
    // This would need proper solar ephemeris for accuracy

    // Start at beginning of year
    const startJd = dateToJulianDay(new Date(year, 0, 1));

    // Approximate: Sun moves ~1 degree per day
    const daysToAdd = Math.round(natalSunLongitude / 0.9856474);

    return startJd + daysToAdd;
}

/**
 * Analyze progression significance
 * @param {Array} progressedAspects - Progressed aspects
 * @returns {Object} Analysis of significant progressions
 */
export function analyzeProgressionSignificance(progressedAspects) {
    const analysis = {
        major: [],
        minor: [],
        themes: []
    };

    progressedAspects.forEach(aspect => {
        if (aspect.orb < 2) { // Within 2 degrees
            if (['Conjunction', 'Opposition', 'Trine', 'Square'].includes(aspect.aspect)) {
                analysis.major.push(aspect);
            } else {
                analysis.minor.push(aspect);
            }
        }
    });

    // Identify themes
    if (analysis.major.some(a => a.progressedPlanet === 'Sun' || a.natalPlanet === 'Sun')) {
        analysis.themes.push('Identity and self-expression');
    }

    if (analysis.major.some(a => a.progressedPlanet === 'Moon' || a.natalPlanet === 'Moon')) {
        analysis.themes.push('Emotional development');
    }

    if (analysis.major.some(a => ['Mercury', 'Venus', 'Mars'].includes(a.progressedPlanet) ||
                               ['Mercury', 'Venus', 'Mars'].includes(a.natalPlanet))) {
        analysis.themes.push('Personal growth and relationships');
    }

    return analysis;
}

/**
 * Calculate orb between two points
 * @param {number} point1 - First longitude
 * @param {number} point2 - Second longitude
 * @param {string} aspect - Aspect type
 * @returns {number} Orb in degrees
 */
function calculateOrb(point1, point2, aspect) {
    const angles = {
        'Conjunction': 0,
        'Opposition': 180,
        'Trine': 120,
        'Square': 90,
        'Quintile': 72,
        'Sextile': 60,
        'Septile': 51.428,
        'Semisquare': 45,
        'Novile': 40
    };

    const angle = angles[aspect] || 0;
    const diff = Math.abs(point1 - point2);
    const distance = Math.min(diff, 360 - diff);
    return Math.abs(distance - angle);
}

/**
 * Convert longitude to zodiac sign
 * @param {number} longitude - Longitude in degrees
 * @returns {string} Zodiac sign name
 */
function longitudeToSign(longitude) {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const signIndex = Math.floor(longitude / 30) % 12;
    return signs[signIndex];
}

/**
 * Simplified aspect calculation (placeholder - integrate with Jzero's aspect system)
 */
function getAspectForPoints(lon1, deg1, min1, sec1, lon2, deg2, min2, sec2) {
    // This is a placeholder - Jzero likely has its own aspect calculation
    const diff = Math.abs(lon1 - lon2);
    const distance = Math.min(diff, 360 - diff);

    if (distance < 10) return 'Conjunction';
    if (Math.abs(distance - 60) < 6) return 'Sextile';
    if (Math.abs(distance - 90) < 6) return 'Square';
    if (Math.abs(distance - 120) < 6) return 'Trine';
    if (Math.abs(distance - 180) < 6) return 'Opposition';

    return null;
}

export default {
    calculateSecondaryProgression,
    calculateSolarArc,
    calculateTertiaryProgression,
    calculateProgressedAspects,
    calculateSolarReturn,
    analyzeProgressionSignificance
};