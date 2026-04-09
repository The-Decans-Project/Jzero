/**
 * Example: Basic Birth Chart Calculation
 * 
 * This example demonstrates how to calculate a simple birth chart
 * using Jzero's integrated calculator with CSV fallback.
 */

import { calculateBirthChart } from '../astrology/core/calculator.js';

// Birth data for calculation
const birthData = {
  year: 1994,
  month: 3,
  day: 1,
  hour: 14,
  minute: 28,
  timezone: -5, // EST
  latitude: 40.7167, // New York City
  longitude: -74.0
};

console.log('Birth Chart Calculation Example\n');
console.log('Input:');
console.log(`  Date: ${birthData.month}/${birthData.day}/${birthData.year}`);
console.log(`  Time: ${birthData.hour}:${String(birthData.minute).padStart(2, '0')} (${birthData.timezone < 0 ? 'EST' : 'EDT'})`);
console.log(`  Location: New York City (${birthData.latitude}°N, ${Math.abs(birthData.longitude)}°W)\n`);

try {
  // Calculate the birth chart (uses CSV calibration)
  const chart = calculateBirthChart({
    ...birthData,
    csvOnly: true // Demonstrates CSV-based calculation
  });
  
  console.log(`Calculation Mode: ${chart.mode}`);
  console.log(`Date: ${chart.date}\n`);
  
  console.log('Planetary Positions:\n');
  
  const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
  
  for (const planet of planets) {
    const pos = chart.planets[planet];
    if (pos && pos.sign) {
      console.log(`${planet.padEnd(10)}: ${pos.longitude_formatted}`);
    }
  }
  
  console.log(`\n📌 Note: ${chart.recommendation}`);
  
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
