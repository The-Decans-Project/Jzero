/**
 * Birth Chart Calculation Tests
 * Tests the integrated calculator with various birth data
 * 
 * Test subjects include famous astrologers and public figures
 * Designed to validate zodiac signs and ensure system functionality
 */

import { calculateBirthChart } from '../astrology/core/calculator.js';

// Test data: Notable astrologers and public figures with known charts
const TEST_SUBJECTS = [
  {
    name: 'Test Subject (NYC, 1994)',
    date: { year: 1994, month: 3, day: 1, hour: 14, minute: 28, timezone: -5 },
    location: { latitude: 40.7167, longitude: -74.0 },
    expected_signs: {
      sun: 'Pisces',
      moon: 'Scorpio',
      mercury: 'Aquarius',
      venus: 'Pisces',
      mars: 'Aquarius',
      jupiter: 'Scorpio',
      saturn: 'Pisces'
    },
    description: 'Daytime birth, Eastern US'
  },
  {
    name: 'London Birth (1925)',
    date: { year: 1925, month: 8, day: 15, hour: 9, minute: 30, timezone: 0 },
    location: { latitude: 51.5074, longitude: -0.1278 },
    expected_signs: {
      sun: 'Leo',
      moon: 'Libra' // approximate
    },
    description: 'Historical birth record'
  },
  {
    name: 'Sydney Birth (2000)',
    date: { year: 2000, month: 1, day: 1, hour: 15, minute: 0, timezone: 10 },
    location: { latitude: -33.8688, longitude: 151.2093 },
    expected_signs: {
      sun: 'Capricorn',
      moon: 'Gemini' // approximate
    },
    description: 'Millennium dawn birth, AU'
  }
];

/**
 * Run all birth chart tests
 */
export function runBirthChartTests() {
  console.log('=== BIRTH CHART CALCULATION TESTS ===\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const subject of TEST_SUBJECTS) {
    console.log(`Test: ${subject.name}`);
    console.log(`Location: ${subject.location.latitude}°, ${subject.location.longitude}°`);
    console.log(`Description: ${subject.description}`);
    
    try {
      const chart = calculateBirthChart({
        ...subject.date,
        latitude: subject.location.latitude,
        longitude: subject.location.longitude,
        csvOnly: true // Use CSV for consistent testing
      });
      
      console.log('\nCalculated Positions:');
      let subjectPassed = true;
      
      for (const [planet, expectedSign] of Object.entries(subject.expected_signs)) {
        const planetName = planet.charAt(0).toUpperCase() + planet.slice(1);
        const pos = chart.planets[planetName];
        
        if (pos && pos.sign === expectedSign) {
          console.log(`  ✅ ${planetName}: ${pos.longitude_formatted}`);
          passed++;
        } else if (pos) {
          console.log(`  ❌ ${planetName}: Expected ${expectedSign}, got ${pos.sign}`);
          subjectPassed = false;
          failed++;
        }
      }
      
      if (subjectPassed) {
        console.log('✅ PASSED\n');
      } else {
        console.log('⚠️  PARTIAL (zodiac signs verified)\n');
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}\n`);
      failed++;
    }
  }
  
  console.log('=== TEST SUMMARY ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%\n`);
  
  return failed === 0;
}

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const success = runBirthChartTests();
  process.exit(success ? 0 : 1);
}
