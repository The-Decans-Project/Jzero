/**
 * Deprecated module stub.
 * Use astrology/utilities/geolocation.js directly instead of this delegation shim.
 */

export * from '../utilities/geolocation.js';,
            offset: '-05:00'
        },
        {
            name: 'London',
            country: 'UK',
            latitude: 51.5074,
            longitude: -0.1278,
            timezone: 'Europe/London',
            offset: '+00:00'
        },
        {
            name: 'Tokyo',
            country: 'Japan',
            latitude: 35.6762,
            longitude: 139.6503,
            timezone: 'Asia/Tokyo',
            offset: '+09:00'
        },
        {
            name: 'Sydney',
            country: 'Australia',
            latitude: -33.8688,
            longitude: 151.2093,
            timezone: 'Australia/Sydney',
            offset: '+10:00'
        },
        {
            name: 'Mumbai',
            country: 'India',
            latitude: 19.0760,
            longitude: 72.8777,
            timezone: 'Asia/Kolkata',
            offset: '+05:30'
        },
        {
            name: 'São Paulo',
            country: 'Brazil',
            latitude: -23.5505,
            longitude: -46.6333,
            timezone: 'America/Sao_Paulo',
            offset: '-03:00'
        },
        {
            name: 'Cairo',
            country: 'Egypt',
            latitude: 30.0444,
            longitude: 31.2357,
            timezone: 'Africa/Cairo',
            offset: '+02:00'
        },
        {
            name: 'Moscow',
            country: 'Russia',
            latitude: 55.7558,
            longitude: 37.6173,
            timezone: 'Europe/Moscow',
            offset: '+03:00'
        },
        {
            name: 'Los Angeles',
            country: 'USA',
            latitude: 34.0522,
            longitude: -118.2437,
            timezone: 'America/Los_Angeles',
            offset: '-08:00'
        },
        {
            name: 'Berlin',
            country: 'Germany',
            latitude: 52.5200,
            longitude: 13.4050,
            timezone: 'Europe/Berlin',
            offset: '+01:00'
        }
    ],

    /**
     * Search for cities by name
     * @param {string} query - Search query
     * @param {number} limit - Maximum results to return
     * @returns {Array} Matching cities
     */
    searchCities: function(query, limit) {
        limit = limit || 10;
        query = query.toLowerCase();

        return this.cities.filter(function(city) {
            return city.name.toLowerCase().includes(query) ||
                   city.country.toLowerCase().includes(query);
        }).slice(0, limit);
    },

    /**
     * Get city by exact name
     * @param {string} name - City name
     * @param {string} country - Country (optional)
     * @returns {Object|null} City data or null if not found
     */
    getCity: function(name, country) {
        return this.cities.find(function(city) {
            var nameMatch = city.name.toLowerCase() === name.toLowerCase();
            var countryMatch = !country || city.country.toLowerCase() === country.toLowerCase();
            return nameMatch && countryMatch;
        }) || null;
    },

    /**
     * Find nearest cities to coordinates
     * @param {number} latitude - Latitude
     * @param {number} longitude - Longitude
     * @param {number} limit - Maximum results
     * @returns {Array} Nearest cities with distances
     */
    findNearestCities: function(latitude, longitude, limit) {
        limit = limit || 5;

        var citiesWithDistance = this.cities.map(function(city) {
            var distance = this.calculateDistance(latitude, longitude, city.latitude, city.longitude);
            return {
                city: city,
                distance: distance
            };
        }.bind(this));

        citiesWithDistance.sort(function(a, b) {
            return a.distance - b.distance;
        });

        return citiesWithDistance.slice(0, limit).map(function(item) {
            return {
                name: item.city.name,
                country: item.city.country,
                latitude: item.city.latitude,
                longitude: item.city.longitude,
                timezone: item.city.timezone,
                offset: item.city.offset,
                distance: Math.round(item.distance * 10) / 10 // Round to 1 decimal
            };
        });
    },

    /**
     * Calculate distance between two coordinates (Haversine formula)
     * @param {number} lat1 - Latitude 1
     * @param {number} lon1 - Longitude 1
     * @param {number} lat2 - Latitude 2
     * @param {number} lon2 - Longitude 2
     * @returns {number} Distance in kilometers
     */
    calculateDistance: function(lat1, lon1, lat2, lon2) {
        var R = 6371; // Earth's radius in kilometers
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);

        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    },

    /**
     * Get timezone for coordinates (simplified)
     * @param {number} latitude - Latitude
     * @param {number} longitude - Longitude
     * @returns {string} Timezone identifier
     */
    getTimezoneForCoordinates: function(latitude, longitude) {
        // Find nearest city and return its timezone
        var nearest = this.findNearestCities(latitude, longitude, 1);
        return nearest.length > 0 ? nearest[0].timezone : 'UTC';
    },

    /**
     * Get timezone offset for coordinates
     * @param {number} latitude - Latitude
     * @param {number} longitude - Longitude
     * @returns {string} Timezone offset string
     */
    getTimezoneOffsetForCoordinates: function(latitude, longitude) {
        var nearest = this.findNearestCities(latitude, longitude, 1);
        return nearest.length > 0 ? nearest[0].offset : '+00:00';
    },

    /**
     * Add a new city to the database
     * @param {Object} cityData - City data {name, country, latitude, longitude, timezone, offset}
     * @returns {boolean} True if added successfully
     */
    addCity: function(cityData) {
        // Validate required fields
        if (!cityData.name || !cityData.country ||
            cityData.latitude === undefined || cityData.longitude === undefined) {
            return false;
        }

        // Check if city already exists
        if (this.getCity(cityData.name, cityData.country)) {
            return false;
        }

        this.cities.push({
            name: cityData.name,
            country: cityData.country,
            latitude: cityData.latitude,
            longitude: cityData.longitude,
            timezone: cityData.timezone || 'UTC',
            offset: cityData.offset || '+00:00'
        });

        return true;
    },

    /**
     * Get all cities in a country
     * @param {string} country - Country name
     * @returns {Array} Cities in the country
     */
    getCitiesInCountry: function(country) {
        return this.cities.filter(function(city) {
            return city.country.toLowerCase() === country.toLowerCase();
        });
    },

    /**
     * Get cities within a coordinate bounds
     * @param {number} north - North latitude
     * @param {number} south - South latitude
     * @param {number} east - East longitude
     * @param {number} west - West longitude
     * @returns {Array} Cities within bounds
     */
    getCitiesInBounds: function(north, south, east, west) {
        return this.cities.filter(function(city) {
            return city.latitude <= north && city.latitude >= south &&
                   ((east > west && city.longitude <= east && city.longitude >= west) ||
                    (east < west && (city.longitude <= east || city.longitude >= west)));
        });
    },

    /**
     * Format location string for display
     * @param {Object} location - Location data
     * @returns {string} Formatted location string
     */
    formatLocation: function(location) {
        if (typeof location === 'string') {
            return location;
        }

        if (location.name && location.country) {
            return location.name + ', ' + location.country;
        }

        if (location.latitude && location.longitude) {
            return location.latitude + ', ' + location.longitude;
        }

        return 'Unknown Location';
    },

    /**
     * Parse location string into coordinates
     * @param {string} locationString - Location string (e.g., "40.7128,-74.0060" or "New York, USA")
     * @returns {Object|null} Location data or null if parsing failed
     */
    parseLocation: function(locationString) {
        // Try coordinate format first
        var coordMatch = locationString.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
        if (coordMatch) {
            return {
                latitude: parseFloat(coordMatch[1]),
                longitude: parseFloat(coordMatch[2])
            };
        }

        // Try city, country format
        var cityMatch = locationString.match(/^(.+),\s*(.+)$/);
        if (cityMatch) {
            var city = this.getCity(cityMatch[1].trim(), cityMatch[2].trim());
            if (city) {
                return city;
            }
        }

        // Try just city name
        var city = this.searchCities(locationString, 1)[0];
        if (city) {
            return city;
        }

        return null;
    },

    /**
     * Get location statistics
     * @returns {Object} Database statistics
     */
    getStatistics: function() {
        var stats = {
            totalCities: this.cities.length,
            countries: {}
        };

        this.cities.forEach(function(city) {
            if (!stats.countries[city.country]) {
                stats.countries[city.country] = 0;
            }
            stats.countries[city.country]++;
        });

        return stats;
    },

    /**
     * Export location data
     * @returns {string} JSON string of all cities
     */
    exportData: function() {
        return JSON.stringify(this.cities, null, 2);
    },

    /**
     * Import location data
     * @param {string} jsonData - JSON string of city data
     * @returns {boolean} True if import successful
     */
    importData: function(jsonData) {
        try {
            var cities = JSON.parse(jsonData);
            if (Array.isArray(cities)) {
                this.cities = cities;
                return true;
            }
        } catch (e) {
            // Ignore error
        }
        return false;
    }
};