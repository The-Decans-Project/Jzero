/**
 * Transits Module
 * Calculates current planetary positions and transit aspects
 * Framework for predictive astrology
 * Integrated with Jzero's ephemeris data system
 */

import { getEphemerisPosition } from '../core/ephemeris.js';
import { dateToJulianDay } from '../core/julianDay.js';

/**
 * Calculate transits for a natal chart
 * @param {Object} natalChart - Natal chart object
 * @param {Date} transitDate - Date for transit calculation
 * @returns {Object} Transit chart with aspects to natal planets
 */
export function calculateTransits(natalChart, transitDate) {
    const transitJd = dateToJulianDay(transitDate);
    const transitPositions = {};

    // Planets to calculate transits for
    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

    planets.forEach(planet => {
        const position = getEphemerisPosition(planet, transitJd);
        if (position) {
            transitPositions[planet] = {
                longitude: position.longitude,
                sign: position.sign,
                degInSign: position.degInSign
            };
        }
    });

    const transitAspects = calculateTransitAspects(natalChart, transitPositions);

    return {
        date: transitDate,
        jd: transitJd,
        positions: transitPositions,
        aspects: transitAspects,
        natalAspects: getNatalAspects(natalChart)
    };
}

/**
 * Calculate aspects between transiting planets and natal planets
 * @param {Object} natalChart - Natal chart
 * @param {Object} transitPositions - Current planetary positions
 * @returns {Array} Transit aspects
 */
export function calculateTransitAspects(natalChart, transitPositions) {
    const aspects = [];
    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

    planets.forEach(transitPlanet => {
        if (!transitPositions[transitPlanet]) return;

        planets.forEach(natalPlanet => {
            if (!natalChart[natalPlanet] || !natalChart[natalPlanet].longitude) return;

            const aspect = getAspectForPoints(
                transitPositions[transitPlanet].longitude, 0, 0, 0,
                natalChart[natalPlanet].longitude, 0, 0, 0
            );

            if (aspect) {
                aspects.push({
                    transitPlanet: transitPlanet,
                    natalPlanet: natalPlanet,
                    aspect: aspect,
                    orb: calculateOrb(
                        transitPositions[transitPlanet].longitude,
                        natalChart[natalPlanet].longitude,
                        aspect
                    ),
                    exactDate: estimateExactAspectDate(
                        transitPlanet, natalPlanet,
                        natalChart[natalPlanet].longitude,
                        transitPositions[transitPlanet].longitude,
                        aspect
                    )
                });
            }
        });
    });

    return aspects;
}

/**
 * Calculate orb between two points for a specific aspect
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
 * Estimate when an aspect will be exact (simplified)
 * @param {string} transitPlanet - Transiting planet
 * @param {string} natalPlanet - Natal planet
 * @param {number} natalLongitude - Natal planet longitude
 * @param {number} currentTransitLongitude - Current transit longitude
 * @param {string} aspect - Aspect type
 * @returns {Date} Estimated exact aspect date
 */
function estimateExactAspectDate(transitPlanet, natalPlanet, natalLongitude, currentTransitLongitude, aspect) {
    // Simplified calculation - would need proper ephemeris for accuracy
    const angles = {
        'Conjunction': 0,
        'Opposition': 180,
        'Trine': 120,
        'Square': 90,
        'Sextile': 60
    };

    const targetAngle = angles[aspect] || 0;
    const currentDiff = Math.abs(currentTransitLongitude - natalLongitude);
    const currentDistance = Math.min(currentDiff, 360 - currentDiff);

    if (Math.abs(currentDistance - targetAngle) < 2) {
        return new Date(); // Already close to exact
    }

    // Estimate days to exact aspect based on planetary speed
    const dailySpeed = getPlanetarySpeed(transitPlanet);
    const degreesToMove = Math.abs(targetAngle - currentDistance);
    const daysToExact = degreesToMove / dailySpeed;

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysToMove);

    return futureDate;
}

/**
 * Get approximate daily speed of a planet (degrees per day)
 * @param {string} planet - Planet name
 * @returns {number} Degrees per day
 */
function getPlanetarySpeed(planet) {
    const speeds = {
        Moon: 13.2,
        Mercury: 1.4,
        Venus: 1.2,
        Sun: 1.0,
        Mars: 0.5,
        Jupiter: 0.08,
        Saturn: 0.03,
        Uranus: 0.01,
        Neptune: 0.006,
        Pluto: 0.004
    };
    return speeds[planet] || 1.0;
}

/**
 * Get natal aspects for reference
 * @param {Object} natalChart - Natal chart
 * @returns {Array} Natal aspects
 */
function getNatalAspects(natalChart) {
    // This would need to be implemented based on Jzero's aspect calculation system
    return natalChart.getAllAspects ? natalChart.getAllAspects() : [];
}

/**
 * Find upcoming significant transits
 * @param {Object} natalChart - Natal chart
 * @param {number} daysAhead - Number of days to look ahead
 * @returns {Array} Significant upcoming transits
 */
export function findUpcomingTransits(natalChart, daysAhead) {
    const significantTransits = [];
    const today = new Date();

    for (let i = 0; i < daysAhead; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() + i);

        const transits = calculateTransits(natalChart, checkDate);

        // Filter for significant aspects (conjunctions, oppositions, trines, squares)
        const significantAspects = transits.aspects.filter(aspect => {
            return ['Conjunction', 'Opposition', 'Trine', 'Square'].includes(aspect.aspect) &&
                   aspect.orb < 2; // Within 2 degrees
        });

        if (significantAspects.length > 0) {
            significantTransits.push({
                date: checkDate,
                aspects: significantAspects
            });
        }
    }

    return significantTransits;
}

/**
 * Calculate void of course Moon periods
 * @param {Date} startDate - Start date
 * @param {number} hoursAhead - Hours to check ahead
 * @returns {Array} Void of course periods
 */
export function calculateVoidOfCourse(startDate, hoursAhead) {
    const voidPeriods = [];
    const currentDate = new Date(startDate);

    // Check every 30 minutes for aspect changes
    const intervalMinutes = 30;
    const totalIntervals = (hoursAhead * 60) / intervalMinutes;

    let previousAspects = null;
    let voidStart = null;

    for (let i = 0; i <= totalIntervals; i++) {
        const checkDate = new Date(currentDate);
        checkDate.setMinutes(currentDate.getMinutes() + (i * intervalMinutes));

        const moonPos = getEphemerisPosition('Moon', dateToJulianDay(checkDate));
        const currentAspects = getMoonAspects(moonPos ? moonPos.longitude : 0);

        if (previousAspects !== null) {
            const hasMajorAspect = hasMajorAspectCheck(currentAspects);

            if (!hasMajorAspect && voidStart === null) {
                voidStart = checkDate;
            } else if (hasMajorAspect && voidStart !== null) {
                voidPeriods.push({
                    start: voidStart,
                    end: checkDate
                });
                voidStart = null;
            }
        }

        previousAspects = currentAspects;
    }

    return voidPeriods;
}

/**
 * Get aspects for Moon at a specific longitude
 * @param {number} moonLongitude - Moon's longitude
 * @returns {Array} Aspects found
 */
function getMoonAspects(moonLongitude) {
    const aspects = [];
    const planets = ['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];

    planets.forEach(planet => {
        // This would need proper aspect calculation - simplified for now
        const planetPos = getEphemerisPosition(planet, dateToJulianDay(new Date()));
        if (planetPos) {
            const diff = Math.abs(moonLongitude - planetPos.longitude);
            const distance = Math.min(diff, 360 - diff);

            if (distance < 10) { // Within 10 degrees
                aspects.push({
                    planet: planet,
                    separation: distance
                });
            }
        }
    });

    return aspects;
}

/**
 * Check if aspects include major aspects
 * @param {Array} aspects - Array of aspects
 * @returns {boolean} True if has major aspect
 */
function hasMajorAspectCheck(aspects) {
    return aspects.some(aspect => aspect.separation < 10);
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