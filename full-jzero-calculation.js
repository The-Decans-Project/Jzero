// Complete Jzero Birth Chart Calculation
// Using all available calculation methods from the Jzero system

import { calculateBirthChart } from './astrology/core/calculator.js';
import { longitudeToZodiac } from './astrology/core/planets.js';
import { getPlanetHouse } from './astrology/calculations/houses.js';

// Birth data for March 1, 1994 at 14:28 EST in New York
const birthData = {
  year: 1994,
  month: 3,
  day: 1,
  hour: 14,
  minute: 28,
  second: 0,
  latitude: 40.7128,  // New York, NY
  longitude: -74.0060,
  houseSystem: 'porphyry',
  timezoneOffset: -5,  // EST
  isLocalTime: true
};

async function calculateCompleteChart() {
  try {
    console.log('🪐 JZERO COMPLETE BIRTH CHART CALCULATION');
    console.log('========================================');
    console.log(`Birth: March 1, 1994 at 14:28 EST`);
    console.log(`Location: New York, NY (40.7128°N, 74.0060°W)`);
    console.log('');

    // Calculate the complete birth chart
    const chart = await calculateBirthChart(birthData);

    // Display birth information
    console.log('📅 BIRTH INFORMATION:');
    console.log(`Date: ${chart.birthData.date}`);
    console.log(`Time: ${chart.birthData.time} (Local)`);
    console.log(`UTC Time: ${chart.birthData.timeUTC}`);
    console.log(`Julian Day (TT): ${chart.birthData.julianDay.toFixed(6)}`);
    console.log(`ΔT Correction: ${chart.birthData.deltaT.toFixed(3)} seconds`);
    console.log('');

    // Display angles
    console.log('🏠 ANGLES:');
    console.log(`Ascendant: ${chart.angles.ascendant.sign} ${chart.angles.ascendant.degrees.toFixed(2)}°`);
    console.log(`Midheaven: ${chart.angles.mc.sign} ${chart.angles.mc.degrees.toFixed(2)}°`);
    console.log(`Descendant: ${chart.angles.descendant.sign} ${chart.angles.descendant.degrees.toFixed(2)}°`);
    console.log(`IC: ${chart.angles.ic.sign} ${chart.angles.ic.degrees.toFixed(2)}°`);
    console.log('');

    // Display planetary positions
    console.log('🪐 PLANETARY POSITIONS:');
    chart.planets.forEach(planet => {
      const retrograde = planet.longitudeSpeed && planet.longitudeSpeed < 0 ? ' (R)' : '';
      console.log(`${planet.planet.padEnd(10)}: ${planet.sign.padEnd(12)} ${planet.degrees.toFixed(2).toString().padStart(5)}°${retrograde} (House ${planet.house})`);
    });
    console.log('');

    // Display houses
    console.log('🏠 HOUSE CUSPS:');
    chart.houses.forEach((house, index) => {
      console.log(`House ${String(index + 1).padStart(2)}: ${house.sign} ${house.degrees.toFixed(2)}°`);
    });
    console.log('');

    // Display aspects (if calculated)
    if (chart.aspects) {
      console.log('⭐ MAJOR ASPECTS:');
      chart.aspects.slice(0, 10).forEach(aspect => {
        console.log(`${aspect.planet1} ${aspect.aspect} ${aspect.planet2} (${aspect.orb.toFixed(1)}° orb)`);
      });
      console.log('');
    }

    // Display metadata
    console.log('📊 TECHNICAL DETAILS:');
    console.log(`House System: ${chart.houseSystem}`);
    console.log(`Data Source: ${chart.dataSource}`);
    console.log(`Ephemeris Range: ${chart.ephemerisRange.minDate} to ${chart.ephemerisRange.maxDate}`);
    console.log(`Accuracy: ${chart.metadata.accuracy}`);
    console.log(`Calculated: ${chart.metadata.calculatedAt}`);
    console.log('');

    console.log('✅ CALCULATION COMPLETE');
    console.log('This chart uses the full Jzero calculation engine with:');
    console.log('• VSOP87 theory for inner planets');
    console.log('• Ephemeris interpolation for outer planets');
    console.log('• ELP2000 lunar theory');
    console.log('• Porphyry house system');
    console.log('• ΔT time corrections');

  } catch (error) {
    console.error('❌ CALCULATION ERROR:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the calculation
calculateCompleteChart();