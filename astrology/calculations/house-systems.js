/**
 * Deprecated module stub.
 * Use astrology/calculations/houses.js directly instead of this delegation shim.
 */

export * from '../calculations/houses.js';
     * @param {number} midheaven - Midheaven longitude in degrees (optional)
     * @returns {Object} House cusps object
     */
    equal: function(ascendant, midheaven) {
        var houses = {};
        for (var i = 1; i <= 12; i++) {
            houses[i] = (ascendant + (i - 1) * 30) % 360;
        }
        return houses;
    },

    /**
     * Calculate houses using Porphyry system (equal from ASC and MC)
     * @param {number} ascendant - Ascendant longitude in degrees
     * @param {number} midheaven - Midheaven longitude in degrees
     * @returns {Object} House cusps object
     */
    porphyry: function(ascendant, midheaven) {
        var houses = {};

        // Calculate quadrant sizes
        var ascToMc = (midheaven - ascendant + 360) % 360;
        var mcToAsc = 360 - ascToMc;

        // Each quadrant divided into 3 equal houses
        var quadSize1 = ascToMc / 3;
        var quadSize2 = mcToAsc / 3;

        // First quadrant (ASC to MC)
        houses[1] = ascendant;
        houses[2] = (ascendant + quadSize1) % 360;
        houses[3] = (ascendant + 2 * quadSize1) % 360;
        houses[10] = midheaven;

        // Second quadrant (MC to DESC)
        houses[11] = (midheaven + quadSize2) % 360;
        houses[12] = (midheaven + 2 * quadSize2) % 360;
        houses[7] = (midheaven + 3 * quadSize2) % 360; // DESC

        // Third quadrant (DESC to IC)
        var descToIc = ascToMc; // Equal to ASC-MC arc
        var quadSize3 = descToIc / 3;
        houses[8] = (houses[7] + quadSize3) % 360;
        houses[9] = (houses[7] + 2 * quadSize3) % 360;
        houses[4] = (houses[7] + 3 * quadSize3) % 360; // IC

        // Fourth quadrant (IC to ASC)
        var quadSize4 = mcToAsc / 3;
        houses[5] = (houses[4] + quadSize4) % 360;
        houses[6] = (houses[4] + 2 * quadSize4) % 360;

        return houses;
    },

    /**
     * Calculate houses using Whole Sign system
     * @param {number} ascendant - Ascendant longitude in degrees
     * @returns {Object} House cusps object
     */
    wholeSign: function(ascendant) {
        var houses = {};
        var ascSign = Math.floor(ascendant / 30);

        for (var i = 1; i <= 12; i++) {
            houses[i] = ((ascSign + i - 1) % 12) * 30;
        }

        return houses;
    },

    /**
     * Calculate houses using Placidus system (simplified approximation)
     * @param {number} ascendant - Ascendant longitude in degrees
     * @param {number} midheaven - Midheaven longitude in degrees
     * @param {number} latitude - Geographic latitude in degrees
     * @returns {Object} House cusps object
     */
    placidus: function(ascendant, midheaven, latitude) {
        // Simplified Placidus - in practice this requires complex trigonometric calculations
        // This is a basic approximation for starter purposes

        var houses = {};
        houses[1] = ascendant;
        houses[4] = (ascendant + 180) % 360; // IC opposite ASC
        houses[7] = (ascendant + 180) % 360; // DESC opposite ASC
        houses[10] = midheaven;

        // Approximate other houses
        var ascToMc = (midheaven - ascendant + 360) % 360;
        houses[2] = (ascendant + ascToMc * 0.33) % 360;
        houses[3] = (ascendant + ascToMc * 0.67) % 360;
        houses[11] = (midheaven + 30) % 360;
        houses[12] = (midheaven + 60) % 360;
        houses[5] = (houses[11] + 180) % 360;
        houses[6] = (houses[12] + 180) % 360;
        houses[8] = (houses[2] + 180) % 360;
        houses[9] = (houses[3] + 180) % 360;

        return houses;
    },

    /**
     * Determine which house a planet is in
     * @param {number} planetLongitude - Planet's longitude in degrees
     * @param {Object} houses - House cusps object
     * @param {string} system - House system used ('equal', 'porphyry', 'wholeSign', 'placidus')
     * @returns {number} House number (1-12)
     */
    getHouseForPlanet: function(planetLongitude, houses, system) {
        if (system === 'wholeSign') {
            // Whole sign: planet is in the sign that matches its longitude range
            var signStart = Math.floor(planetLongitude / 30) * 30;
            for (var house = 1; house <= 12; house++) {
                if (houses[house] === signStart) {
                    return house;
                }
            }
        } else {
            // For other systems, find which house cusp range contains the planet
            for (var house = 1; house <= 12; house++) {
                var nextHouse = house === 12 ? 1 : house + 1;
                var houseStart = houses[house];
                var houseEnd = houses[nextHouse];

                if (houseEnd < houseStart) {
                    // Handle 360-degree wraparound
                    if (planetLongitude >= houseStart || planetLongitude < houseEnd) {
                        return house;
                    }
                } else {
                    if (planetLongitude >= houseStart && planetLongitude < houseEnd) {
                        return house;
                    }
                }
            }
        }

        return 1; // Default to 1st house if not found
    },

    /**
     * Get house rulers for a chart
     * @param {Object} houses - House cusps object
     * @param {string} system - House system used
     * @returns {Object} Object mapping house numbers to ruling planets
     */
    getHouseRulers: function(houses, system) {
        var rulers = {};

        for (var house = 1; house <= 12; house++) {
            var cuspLongitude = houses[house];
            var sign = this.longitudeToSign(cuspLongitude);
            rulers[house] = Rulers[sign];
        }

        return rulers;
    },

    /**
     * Convert longitude to zodiac sign
     * @param {number} longitude - Longitude in degrees
     * @returns {string} Zodiac sign name
     */
    longitudeToSign: function(longitude) {
        var signs = [Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces];
        var signIndex = Math.floor(longitude / 30) % 12;
        return signs[signIndex];
    },

    /**
     * Calculate all house positions for planets in a chart
     * @param {Object} chart - Chart object with planetary positions
     * @param {Object} houses - House cusps object
     * @param {string} system - House system used
     * @returns {Object} Object mapping planets to their house positions
     */
    calculatePlanetHouses: function(chart, houses, system) {
        var planetHouses = {};

        Planets.all.forEach(function(planet) {
            if (chart[planet] && chart[planet].longitude !== undefined) {
                planetHouses[planet] = this.getHouseForPlanet(chart[planet].longitude, houses, system);
            }
        }.bind(this));

        return planetHouses;
    }
};