/**
 * Synastry Module
 * Calculates relationships between two charts
 * Framework for relationship astrology
 * Integrated with Jzero's chart system
 */

import { getEphemerisPosition } from '../core/ephemeris.js';
import { dateToJulianDay } from '../core/julianDay.js';

/**
 * Calculate synastry between two charts
 * @param {Object} chart1 - First chart
 * @param {Object} chart2 - Second chart
 * @returns {Object} Synastry analysis
 */
export function calculateSynastry(chart1, chart2) {
    const interAspects = calculateInterAspects(chart1, chart2);
    const composite = calculateCompositeChart(chart1, chart2);
    const scores = calculateSynastryScores(interAspects);

    return {
        interAspects: interAspects,
        composite: composite,
        scores: scores,
        summary: generateSummary(scores)
    };
}

/**
 * Calculate aspects between planets of two different charts
 * @param {Object} chart1 - First chart
 * @param {Object} chart2 - Second chart
 * @returns {Array} Inter-chart aspects
 */
export function calculateInterAspects(chart1, chart2) {
    const aspects = [];
    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

    planets.forEach(planet1 => {
        planets.forEach(planet2 => {
            if (!chart1[planet1] || !chart2[planet2]) return;
            if (!chart1[planet1].longitude || !chart2[planet2].longitude) return;

            const aspect = getAspectForPoints(
                chart1[planet1].longitude, 0, 0, 0,
                chart2[planet2].longitude, 0, 0, 0
            );

            if (aspect) {
                aspects.push({
                    planet1: planet1,
                    chart1: true,
                    planet2: planet2,
                    chart2: true,
                    aspect: aspect,
                    orb: calculateOrb(
                        chart1[planet1].longitude,
                        chart2[planet2].longitude,
                        aspect
                    )
                });
            }
        });
    });

    return aspects;
}

/**
 * Calculate composite chart (midpoint between two charts)
 * @param {Object} chart1 - First chart
 * @param {Object} chart2 - Second chart
 * @returns {Object} Composite chart
 */
export function calculateCompositeChart(chart1, chart2) {
    const composite = {};
    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

    planets.forEach(planet => {
        if (chart1[planet] && chart2[planet] &&
            chart1[planet].longitude !== undefined &&
            chart2[planet].longitude !== undefined) {

            let lon1 = chart1[planet].longitude;
            let lon2 = chart2[planet].longitude;

            // Calculate midpoint
            let diff = Math.abs(lon1 - lon2);
            let midpoint = diff <= 180 ?
                (lon1 + lon2) / 2 :
                ((lon1 + lon2) / 2 + 180) % 360;

            composite[planet] = {
                longitude: midpoint,
                sign: longitudeToSign(midpoint)
            };
        }
    });

    return composite;
}

/**
 * Calculate synastry compatibility scores
 * @param {Array} interAspects - Inter-chart aspects
 * @returns {Object} Compatibility scores
 */
export function calculateSynastryScores(interAspects) {
    const scores = {
        overall: 0,
        harmony: 0,
        tension: 0,
        communication: 0,
        passion: 0
    };

    interAspects.forEach(aspect => {
        const weight = getAspectWeight(aspect.aspect, aspect.orb);
        scores.overall += weight;

        // Categorize aspects
        if (['Trine', 'Sextile'].includes(aspect.aspect)) {
            scores.harmony += weight;
        } else if (['Square', 'Opposition'].includes(aspect.aspect)) {
            scores.tension += weight;
        } else if (aspect.aspect === 'Conjunction') {
            if (isHarmoniousConjunction(aspect.planet1, aspect.planet2)) {
                scores.harmony += weight;
            } else {
                scores.tension += weight;
            }
        }

        // Communication aspects (Mercury, Venus)
        if ([aspect.planet1, aspect.planet2].includes('Mercury') ||
            [aspect.planet1, aspect.planet2].includes('Venus')) {
            scores.communication += weight;
        }

        // Passion aspects (Mars, Venus, Pluto)
        if ([aspect.planet1, aspect.planet2].some(p => ['Mars', 'Venus', 'Pluto'].includes(p))) {
            scores.passion += Math.abs(weight);
        }
    });

    return scores;
}

/**
 * Get weight for aspect based on type and orb
 * @param {string} aspect - Aspect type
 * @param {number} orb - Orb in degrees
 * @returns {number} Weight score
 */
function getAspectWeight(aspect, orb) {
    const baseWeights = {
        Conjunction: 10,
        Trine: 8,
        Sextile: 6,
        Square: -4,
        Opposition: -6,
        Quintile: 3,
        Septile: 2
    };

    const baseWeight = baseWeights[aspect] || 0;
    const orbPenalty = Math.max(0, orb - 2) * 0.5; // Penalty for wide orbs

    return baseWeight - orbPenalty;
}

/**
 * Check if conjunction is harmonious
 * @param {string} planet1 - First planet
 * @param {string} planet2 - Second planet
 * @returns {boolean} True if harmonious
 */
function isHarmoniousConjunction(planet1, planet2) {
    const harmonious = [
        ['Sun', 'Venus'], ['Sun', 'Jupiter'], ['Moon', 'Venus'], ['Moon', 'Jupiter'],
        ['Venus', 'Jupiter'], ['Mercury', 'Venus'], ['Mercury', 'Jupiter']
    ];

    return harmonious.some(pair => {
        return (pair[0] === planet1 && pair[1] === planet2) ||
               (pair[0] === planet2 && pair[1] === planet1);
    });
}

/**
 * Generate summary interpretation
 * @param {Object} scores - Synastry scores
 * @returns {string} Summary text
 */
function generateSummary(scores) {
    let summary = '';

    if (scores.overall > 20) {
        summary += 'Strong compatibility indicated. ';
    } else if (scores.overall > 0) {
        summary += 'Moderate compatibility. ';
    } else {
        summary += 'Challenging compatibility. ';
    }

    if (scores.harmony > scores.tension) {
        summary += 'Relationship likely harmonious with good understanding. ';
    } else {
        summary += 'Relationship may have challenges requiring work. ';
    }

    if (scores.communication > 5) {
        summary += 'Good communication potential. ';
    }

    if (scores.passion > 8) {
        summary += 'Strong passionate connection. ';
    }

    return summary;
}

/**
 * Find relationship patterns and themes
 * @param {Object} synastry - Synastry analysis
 * @returns {Array} Key relationship themes
 */
export function findRelationshipThemes(synastry) {
    const themes = [];

    // Check for Venus-Mars connections
    const venusMarsAspects = synastry.interAspects.filter(aspect => {
        return ((aspect.planet1 === 'Venus' && aspect.planet2 === 'Mars') ||
                (aspect.planet1 === 'Mars' && aspect.planet2 === 'Venus'));
    });

    if (venusMarsAspects.length > 0) {
        themes.push('Strong romantic and sexual attraction');
    }

    // Check for Sun-Moon connections
    const sunMoonAspects = synastry.interAspects.filter(aspect => {
        return ((aspect.planet1 === 'Sun' && aspect.planet2 === 'Moon') ||
                (aspect.planet1 === 'Moon' && aspect.planet2 === 'Sun'));
    });

    if (sunMoonAspects.length > 0) {
        themes.push('Complementary masculine/feminine energies');
    }

    // Check for Mercury connections
    const mercuryAspects = synastry.interAspects.filter(aspect => {
        return aspect.planet1 === 'Mercury' || aspect.planet2 === 'Mercury';
    });

    if (mercuryAspects.length > 2) {
        themes.push('Strong mental connection and communication');
    }

    return themes;
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
    calculateSynastry,
    calculateInterAspects,
    calculateCompositeChart,
    calculateSynastryScores,
    findRelationshipThemes
};