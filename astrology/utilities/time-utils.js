/**
 * Deprecated module stub.
 * Use astrology/core/time-corrections.js and astrology/core/julianDay.js directly instead.
 */

export * from '../core/time-corrections.js';
export * from '../core/julianDay.js';
    localToUTC: function(localDate, timezone) {
        var offset = this.parseTimezoneOffset(timezone);
        var utcTime = localDate.getTime() - (offset * 60 * 1000);
        return new Date(utcTime);
    },

    /**
     * Convert UTC to local time
     * @param {Date} utcDate - UTC date/time
     * @param {string} timezone - Timezone offset
     * @returns {Date} Local date/time
     */
    utcToLocal: function(utcDate, timezone) {
        var offset = this.parseTimezoneOffset(timezone);
        var localTime = utcDate.getTime() + (offset * 60 * 1000);
        return new Date(localTime);
    },

    /**
     * Parse timezone offset string to minutes
     * @param {string} timezone - Timezone string (e.g., '+05:30', 'UTC-8')
     * @returns {number} Offset in minutes
     */
    parseTimezoneOffset: function(timezone) {
        if (!timezone) return 0;

        // Handle different formats
        var match = timezone.match(/([+-])(\d{1,2}):?(\d{2})?/);
        if (match) {
            var sign = match[1] === '+' ? 1 : -1;
            var hours = parseInt(match[2]) || 0;
            var minutes = parseInt(match[3]) || 0;
            return sign * (hours * 60 + minutes);
        }

        // Handle 'UTC+X' or 'GMT+X' format
        match = timezone.match(/(?:UTC|GMT)([+-])(\d{1,2})/);
        if (match) {
            var sign = match[1] === '+' ? 1 : -1;
            var hours = parseInt(match[2]) || 0;
            return sign * (hours * 60);
        }

        return 0;
    },

    /**
     * Get Julian Day Number for a date
     * @param {Date} date - Date for calculation
     * @returns {number} Julian Day Number
     */
    getJulianDay: function(date) {
        var a = Math.floor((14 - (date.getMonth() + 1)) / 12);
        var y = date.getFullYear() + 4800 - a;
        var m = (date.getMonth() + 1) + 12 * a - 3;

        var jd = date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y +
                 Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

        // Add fractional day
        var fractionalDay = (date.getHours() - 12) / 24 +
                           date.getMinutes() / (24 * 60) +
                           date.getSeconds() / (24 * 60 * 60);

        return jd + fractionalDay;
    },

    /**
     * Convert Julian Day back to Date
     * @param {number} jd - Julian Day Number
     * @returns {Date} Date object
     */
    julianDayToDate: function(jd) {
        var jdInt = Math.floor(jd + 0.5);
        var a = jdInt + 32044;
        var b = Math.floor((4 * a + 3) / 146097);
        var c = a - Math.floor(146097 * b / 4);

        var d = Math.floor((4 * c + 3) / 1461);
        var e = c - Math.floor(1461 * d / 4);
        var m = Math.floor((5 * e + 2) / 153);

        var day = e - Math.floor((153 * m + 2) / 5) + 1;
        var month = m + 3 - 12 * Math.floor(m / 10);
        var year = 100 * b + d - 4800 + Math.floor(m / 10);

        var date = new Date(year, month - 1, day);

        // Add fractional time
        var fractionalDay = jd - jdInt + 0.5;
        var hours = fractionalDay * 24;
        var minutes = (hours % 1) * 60;
        var seconds = (minutes % 1) * 60;

        date.setHours(Math.floor(hours), Math.floor(minutes), Math.floor(seconds));
        return date;
    },

    /**
     * Calculate sidereal time for a location and date
     * @param {Date} date - Date for calculation
     * @param {number} longitude - Longitude in degrees
     * @returns {number} Sidereal time in degrees
     */
    getSiderealTime: function(date, longitude) {
        var jd = this.getJulianDay(date);
        var t = (jd - 2451545.0) / 36525.0; // Julian centuries since J2000.0

        // Mean sidereal time at Greenwich
        var gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) +
                   0.0003875 * t * t - (t * t * t) / 38710000.0;

        // Adjust for longitude
        var lst = gmst + longitude;

        return lst % 360;
    },

    /**
     * Calculate RAMC (Right Ascension of Midheaven)
     * @param {Date} date - Date for calculation
     * @param {number} longitude - Longitude in degrees
     * @returns {number} RAMC in degrees
     */
    getRAMC: function(date, longitude) {
        return this.getSiderealTime(date, longitude);
    },

    /**
     * Calculate house cusps using RAMC and latitude
     * @param {number} ramc - RAMC in degrees
     * @param {number} latitude - Latitude in degrees
     * @param {string} system - House system ('placidus', 'koch', etc.)
     * @returns {Object} House cusps
     */
    calculateHousesFromRAMC: function(ramc, latitude, system) {
        var houses = {};

        if (system === 'placidus') {
            // Simplified Placidus calculation
            houses[10] = this.getMidheaven(ramc, latitude);
            houses[4] = (houses[10] + 180) % 360;

            // Calculate other houses (simplified)
            var ascendant = this.getAscendant(ramc, latitude);
            houses[1] = ascendant;
            houses[7] = (ascendant + 180) % 360;

            // Approximate other houses
            var quadSize = 90; // 90 degrees per quadrant
            houses[2] = (ascendant + quadSize * 0.33) % 360;
            houses[3] = (ascendant + quadSize * 0.67) % 360;
            houses[11] = (houses[10] + 30) % 360;
            houses[12] = (houses[10] + 60) % 360;
            houses[5] = (houses[11] + 180) % 360;
            houses[6] = (houses[12] + 180) % 360;
            houses[8] = (houses[2] + 180) % 360;
            houses[9] = (houses[3] + 180) % 360;

        } else {
            // Default to equal houses
            var ascendant = this.getAscendant(ramc, latitude);
            houses = HouseSystems.equal(ascendant, this.getMidheaven(ramc, latitude));
        }

        return houses;
    },

    /**
     * Calculate Midheaven from RAMC and latitude
     * @param {number} ramc - RAMC in degrees
     * @param {number} latitude - Latitude in degrees
     * @returns {number} Midheaven in degrees
     */
    getMidheaven: function(ramc, latitude) {
        var latRad = latitude * Math.PI / 180;
        var ramcRad = ramc * Math.PI / 180;

        var mh = Math.atan2(Math.tan(ramcRad), Math.cos(latRad));
        return (mh * 180 / Math.PI + 360) % 360;
    },

    /**
     * Calculate Ascendant from RAMC and latitude
     * @param {number} ramc - RAMC in degrees
     * @param {number} latitude - Latitude in degrees
     * @returns {number} Ascendant in degrees
     */
    getAscendant: function(ramc, latitude) {
        var latRad = latitude * Math.PI / 180;
        var ramcRad = ramc * Math.PI / 180;

        var asc = Math.atan2(-Math.cos(ramcRad), Math.sin(ramcRad) * Math.sin(latRad) + Math.tan(latRad) * Math.cos(latRad));
        return (asc * 180 / Math.PI + 360) % 360;
    },

    /**
     * Format date for display
     * @param {Date} date - Date to format
     * @param {string} format - Format string ('short', 'long', 'iso')
     * @returns {string} Formatted date string
     */
    formatDate: function(date, format) {
        if (format === 'iso') {
            return date.toISOString();
        }

        if (format === 'short') {
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        }

        // Long format
        var options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };

        return date.toLocaleDateString('en-US', options);
    },

    /**
     * Parse date from various string formats
     * @param {string} dateString - Date string to parse
     * @returns {Date|null} Parsed date or null if invalid
     */
    parseDate: function(dateString) {
        // Try ISO format first
        var date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return date;
        }

        // Try common formats
        var formats = [
            /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i,
            /^(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/i,
            /^(\w+)\s+(\d{1,2}),?\s+(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i
        ];

        for (var i = 0; i < formats.length; i++) {
            var match = dateString.match(formats[i]);
            if (match) {
                return this.parseDateMatch(match);
            }
        }

        return null;
    },

    /**
     * Parse date from regex match
     * @param {Array} match - Regex match result
     * @returns {Date} Parsed date
     */
    parseDateMatch: function(match) {
        // This would need implementation based on the specific format
        // Simplified version
        return new Date(match[0]);
    },

    /**
     * Calculate age in years from birth date
     * @param {Date} birthDate - Birth date
     * @param {Date} currentDate - Current date (optional, defaults to now)
     * @returns {number} Age in years
     */
    calculateAge: function(birthDate, currentDate) {
        currentDate = currentDate || new Date();
        var age = currentDate.getFullYear() - birthDate.getFullYear();
        var monthDiff = currentDate.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    },

    /**
     * Check if date is valid
     * @param {Date} date - Date to check
     * @returns {boolean} True if valid date
     */
    isValidDate: function(date) {
        return date instanceof Date && !isNaN(date.getTime());
    }
};