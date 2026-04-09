/**
 * Example: Synastry (Chart Comparison)
 * 
 * Demonstrates how to calculate and compare two birth charts
 * for relationship analysis.
 */

import { calculateBirthChart } from '../astrology/core/calculator.js';

// Chart 1
const person1 = {
  name: 'Person 1',
  birth: {
    year: 1990,
    month: 5,
    day: 15,
    hour: 10,
    minute: 30,
    timezone: -5,
    latitude: 40.7128,
    longitude: -74.0060
  }
};

// Chart 2
const person2 = {
  name: 'Person 2',
  birth: {
    year: 1992,
    month: 11,
    day: 8,
    hour: 14,
    minute: 45,
    timezone: -5,
    latitude: 40.7128,
    longitude: -74.0060
  }
};

console.log('Synastry Analysis Example\n');
console.log('Calculating charts for comparison...\n');

try {
  const chart1 = calculateBirthChart({
    ...person1.birth,
    csvOnly: true
  });
  const chart2 = calculateBirthChart({
    ...person2.birth,
    csvOnly: true
  });
  
  console.log(`${person1.name}:`);
  console.log(`  Sun: ${chart1.planets.Sun?.longitude_formatted || 'N/A'}`);
  console.log(`  Moon: ${chart1.planets.Moon?.longitude_formatted || 'N/A'}`);
  console.log(`  Venus: ${chart1.planets.Venus?.longitude_formatted || 'N/A'}\n`);
  
  console.log(`${person2.name}:`);
  console.log(`  Sun: ${chart2.planets.Sun?.longitude_formatted || 'N/A'}`);
  console.log(`  Moon: ${chart2.planets.Moon?.longitude_formatted || 'N/A'}`);
  console.log(`  Venus: ${chart2.planets.Venus?.longitude_formatted || 'N/A'}\n`);
  
  // Simple compatibility check for Sun signs
  const sun1Sign = chart1.planets.Sun?.sign;
  const sun2Sign = chart2.planets.Sun?.sign;
  
  console.log('Relationship Overview:');
  console.log(`${person1.name} Sun (${sun1Sign}) + ${person2.name} Sun (${sun2Sign})`);
  console.log('\n📌 For detailed synastry: Use Swiss Ephemeris');
  
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
