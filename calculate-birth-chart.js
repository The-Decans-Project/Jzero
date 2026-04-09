// Calculate birth chart for March 1, 1994 at 14:28 in New York, NY
import { calculateBirthChart } from './astrology/core/calculator.js'; // Updated to use new consolidated module

async function calculateChart() {
  try {
    // Birth data for March 1, 1994 at 14:28 in New York, NY
    const birthData = {
      year: 1994,
      month: 3,
      day: 1,
      hour: 14,
      minute: 28,
      second: 0,
      latitude: 40.7128,  // New York, NY coordinates
      longitude: -74.0060,
      houseSystem: 'porphyry',
      timezoneOffset: -5,  // EST (Eastern Standard Time) - will be adjusted for DST if needed
      isLocalTime: true
    };

    console.log('🪐 Calculating birth chart for March 1, 1994 at 14:28 in New York, NY');
    console.log('=' .repeat(70));

    const chart = await calculateBirthChart(birthData);

    // Display birth information
    console.log('\n📅 Birth Information:');
    console.log(`   Date: ${chart.birthData.date}`);
    console.log(`   Time: ${chart.birthData.time} (Local)`);
    console.log(`   UTC Time: ${chart.birthData.timeUTC}`);
    console.log(`   Location: ${chart.birthData.latitude}°N, ${chart.birthData.longitude}°W`);
    console.log(`   Julian Day (TT): ${chart.birthData.julianDay.toFixed(6)}`);
    console.log(`   ΔT correction: ${chart.birthData.deltaT.toFixed(3)} seconds`);

    // Display angles
    console.log('\n🏠 Angles:');
    console.log(`   Ascendant: ${chart.angles.ascendant.sign} ${chart.angles.ascendant.degrees.toFixed(2)}°`);
    console.log(`   Midheaven: ${chart.angles.mc.sign} ${chart.angles.mc.degrees.toFixed(2)}°`);
    console.log(`   Descendant: ${chart.angles.descendant.sign} ${chart.angles.descendant.degrees.toFixed(2)}°`);
    console.log(`   IC: ${chart.angles.ic.sign} ${chart.angles.ic.degrees.toFixed(2)}°`);

    // Display planetary positions
    console.log('\n🪐 Planetary Positions:');
    chart.planets.forEach(planet => {
      const retrograde = planet.retrograde ? ' (R)' : '';
      console.log(`   ${planet.planet.padEnd(10)}: ${planet.sign.padEnd(12)} ${planet.degrees.toFixed(2).padStart(6)}°${retrograde} (House ${planet.house})`);
    });

    // Display houses
    console.log('\n🏠 House Cusps:');
    chart.houses.forEach((house, index) => {
      console.log(`   House ${String(index + 1).padStart(2)}: ${house.sign} ${house.degrees.toFixed(2)}°`);
    });

    console.log('\n📊 Metadata:');
    console.log(`   House System: ${chart.houseSystem}`);
    console.log(`   Data Source: ${chart.dataSource}`);
    console.log(`   Accuracy: ${chart.metadata.accuracy}`);
    console.log(`   Calculated: ${chart.metadata.calculatedAt}`);

  } catch (error) {
    console.error('❌ Error calculating chart:', error.message);
    console.error(error.stack);
  }
}

// Run the calculation
calculateChart();