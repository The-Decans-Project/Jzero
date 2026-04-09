// Quick test of the enhanced inner-planets-calculator.js
import { calculateInnerPlanet, calculatePlanetDistance, isPlanetRetrograde, calculatePlanetSpeed, getPlanetPhase } from '../astrology/index.js';

// Test date: January 1, 2024
const testJD = 2460311.5; // Approximate JD for 2024-01-01

console.log('Testing Jzero Inner Planets Calculator Enhancements');
console.log('==================================================');

try {
  // Test Mercury position
  const mercury = calculateInnerPlanet('Mercury', testJD);
  console.log('Mercury position:', mercury ? `${mercury.longitude.toFixed(2)}°` : 'null');

  // Test distance calculation
  const distance = calculatePlanetDistance('Mercury', testJD);
  console.log('Mercury distance:', distance ? `${distance.toFixed(3)} AU` : 'null');

  // Test retrograde detection
  const retrograde = isPlanetRetrograde('Mercury', testJD);
  console.log('Mercury retrograde:', retrograde);

  // Test speed calculation
  const speed = calculatePlanetSpeed('Mercury', testJD);
  console.log('Mercury speed:', speed ? `${speed.toFixed(3)}°/day` : 'null');

  // Test phase information
  const phase = getPlanetPhase('Mercury', testJD);
  console.log('Mercury phase:', phase ? `${phase.phase} (${phase.phasePercent.toFixed(1)}%)` : 'null');

  console.log('\nAll tests completed successfully!');

} catch (error) {
  console.error('Test failed:', error.message);
}
