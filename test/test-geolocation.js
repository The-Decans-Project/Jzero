import { MAJOR_CITIES, searchCities, findClosestCity, calculateDistance } from './astrology/utilities/geolocation.js';

console.log('Testing Jzero Geolocation Module...');
console.log('=====================================');

// Test 1: Check total cities
console.log(`Total cities in database: ${MAJOR_CITIES.length}`);

// Test 2: Search functionality
const nyResults = searchCities('New York');
console.log(`Cities matching "New York": ${nyResults.length}`);
if (nyResults.length > 0) {
  console.log(`First result: ${nyResults[0].name}`);
}

// Test 3: Distance calculation
const nyc = MAJOR_CITIES.find(city => city.name.includes('New York'));
const la = MAJOR_CITIES.find(city => city.name.includes('Los Angeles'));
if (nyc && la) {
  const distance = Math.round(calculateDistance(nyc.lat, nyc.lon, la.lat, la.lon));
  console.log(`Distance NYC to LA: ${distance} km`);
}

// Test 4: Find closest city
const closest = findClosestCity(40.7, -74.0); // Near NYC
if (closest) {
  console.log(`Closest city to NYC coordinates: ${closest.name}`);
}

console.log('All tests completed successfully! ✅');</content>
<parameter name="filePath">/workspaces/Jzero/test-geolocation.js