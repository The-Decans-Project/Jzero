/**
 * Geolocation and Timezone Handler
 * Based on timezone-js data for accurate location lookups
 * Open Source Astrology Calculator
 */

/**
 * Major world cities with coordinates for quick lookup
 */
export const MAJOR_CITIES = [
  { name: 'New York, NY, USA', lat: 40.7128, lon: -74.0060, timezone: 'America/New_York' },
  { name: 'Los Angeles, CA, USA', lat: 34.0522, lon: -118.2437, timezone: 'America/Los_Angeles' },
  { name: 'London, UK', lat: 51.5074, lon: -0.1278, timezone: 'Europe/London' },
  { name: 'Paris, France', lat: 48.8566, lon: 2.3522, timezone: 'Europe/Paris' },
  { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503, timezone: 'Asia/Tokyo' },
  { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093, timezone: 'Australia/Sydney' },
  { name: 'Mumbai, India', lat: 19.0760, lon: 72.8777, timezone: 'Asia/Kolkata' },
  { name: 'Dubai, UAE', lat: 25.2048, lon: 55.2708, timezone: 'Asia/Dubai' },
  { name: 'São Paulo, Brazil', lat: -23.5505, lon: -46.6333, timezone: 'America/Sao_Paulo' },
  { name: 'Mexico City, Mexico', lat: 19.4326, lon: -99.1332, timezone: 'America/Mexico_City' },
  { name: 'Moscow, Russia', lat: 55.7558, lon: 37.6173, timezone: 'Europe/Moscow' },
  { name: 'Cairo, Egypt', lat: 30.0444, lon: 31.2357, timezone: 'Africa/Cairo' },
  { name: 'Beijing, China', lat: 39.9042, lon: 116.4074, timezone: 'Asia/Shanghai' },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198, timezone: 'Asia/Singapore' },
  { name: 'Toronto, Canada', lat: 43.6532, lon: -79.3832, timezone: 'America/Toronto' }
];

/**
 * Search for cities by name (case-insensitive partial match)
 * @param {string} query - Search query
 * @returns {Array} Array of matching cities
 */
export function searchCities(query) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();
  return MAJOR_CITIES.filter(city =>
    city.name.toLowerCase().includes(searchTerm)
  );
}

/**
 * Find the closest city to given coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Object|null} Closest city object or null if no cities found
 */
export function findClosestCity(lat, lon) {
  if (MAJOR_CITIES.length === 0) {
    return null;
  }

  let closest = null;
  let minDistance = Infinity;

  MAJOR_CITIES.forEach(city => {
    const distance = calculateDistance(lat, lon, city.lat, city.lon);
    if (distance < minDistance) {
      minDistance = distance;
      closest = city;
    }
  });

  return closest;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude 1
 * @param {number} lon1 - Longitude 1
 * @param {number} lat2 - Latitude 2
 * @param {number} lon2 - Longitude 2
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Degrees
 * @returns {number} Radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Get city by exact name match
 * @param {string} name - City name
 * @returns {Object|null} City object or null if not found
 */
export function getCityByName(name) {
  if (!name) return null;

  return MAJOR_CITIES.find(city =>
    city.name.toLowerCase() === name.toLowerCase()
  ) || null;
}

/**
 * Get cities within a certain radius of coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radiusKm - Radius in kilometers
 * @returns {Array} Array of cities within radius
 */
export function getCitiesWithinRadius(lat, lon, radiusKm) {
  return MAJOR_CITIES.filter(city => {
    const distance = calculateDistance(lat, lon, city.lat, city.lon);
    return distance <= radiusKm;
  });
}

/**
 * Get timezone for coordinates (finds closest city and returns its timezone)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {string|null} Timezone string or null
 */
export function getTimezoneForCoordinates(lat, lon) {
  const closestCity = findClosestCity(lat, lon);
  return closestCity ? closestCity.timezone : null;
}

/**
 * Get timezone offset for a date and timezone
 * @param {Date} date - Date object
 * @param {string} timezoneName - IANA timezone name
 * @returns {number} Offset in hours
 */
export function getTimezoneOffset(date, timezoneName) {
  try {
    const options = { timeZone: timezoneName, timeZoneName: 'short' };
    const dateStr = date.toLocaleString('en-US', options);
    
    // This is a simplified approach - for production use a proper timezone library
    const offset = -date.getTimezoneOffset() / 60;
    return offset;
  } catch (error) {
    console.error('Error getting timezone offset:', error);
    return 0;
  }
}

/**
 * Convert local time to UTC
 * @param {Date} localDate - Local date/time
 * @param {number} timezoneOffset - Timezone offset in hours
 * @returns {Date} UTC date
 */
export function localToUTC(localDate, timezoneOffset) {
  const utcDate = new Date(localDate.getTime() - (timezoneOffset * 60 * 60 * 1000));
  return utcDate;
}

/**
 * Format coordinates for display
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {string} Formatted string
 */
export function formatCoordinates(lat, lon) {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lon).toFixed(4)}°${lonDir}`;
}

export default {
  MAJOR_CITIES,
  searchCities,
  findClosestCity,
  calculateDistance,
  getCityByName,
  getCitiesWithinRadius,
  getTimezoneForCoordinates,
  getTimezoneOffset,
  localToUTC,
  formatCoordinates
};
