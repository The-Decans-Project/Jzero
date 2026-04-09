// Simple birth chart calculation for March 1, 1994 at 14:28 in New York, NY
import { dateToJulianDayTT, calculateInnerPlanet, calculateMoonPosition, calculateHouses, longitudeToZodiac } from './astrology/index.js';

// Calculate Julian Day for March 1, 1994 at 14:28 EST (UTC-5)
const jdData = dateToJulianDayTT(1994, 3, 1, 14, 28, 0);
const jd = jdData.jd_tt; // Use Terrestrial Time for accuracy

console.log('🪐 Birth Chart Calculation: March 1, 1994 at 14:28 in New York, NY');
console.log('=' .repeat(70));
console.log(`Julian Day (TT): ${jd.toFixed(6)}`);
console.log(`ΔT correction: ${jdData.deltaT.toFixed(3)} seconds`);

// New York coordinates
const latitude = 40.7128;
const longitude = -74.0060;

// Calculate planetary positions
console.log('\n🪐 Planetary Positions:');

// Inner planets (Mercury, Venus, Mars)
const innerPlanets = ['Mercury', 'Venus', 'Mars'];
innerPlanets.forEach(planet => {
  const pos = calculateInnerPlanet(planet, jd);
  if (pos) {
    const zodiac = longitudeToZodiac(pos.longitude);
    console.log(`${planet.padEnd(10)}: ${zodiac.sign.padEnd(12)} ${zodiac.degrees.toFixed(2).padStart(6)}°`);
  }
});

// Moon
const moonPos = calculateMoonPosition(jd);
const moonZodiac = longitudeToZodiac(moonPos.longitude);
console.log(`${'Moon'.padEnd(10)}: ${moonZodiac.sign.padEnd(12)} ${moonZodiac.degrees.toFixed(2).padStart(6)}°`);

// Calculate houses
const houses = calculateHouses(jd, latitude, longitude, 'porphyry');
console.log('\n🏠 House Cusps:');
houses.houses.forEach((house, index) => {
  const zodiac = longitudeToZodiac(house.longitude);
  console.log(`House ${String(index + 1).padStart(2)}: ${zodiac.sign} ${zodiac.degrees.toFixed(2)}°`);
});

// Angles
const ascZodiac = longitudeToZodiac(houses.ascendant);
const mcZodiac = longitudeToZodiac(houses.mc);
console.log('\n🏠 Angles:');
console.log(`Ascendant: ${ascZodiac.sign} ${ascZodiac.degrees.toFixed(2)}°`);
console.log(`Midheaven: ${mcZodiac.sign} ${mcZodiac.degrees.toFixed(2)}°`);

console.log('\n✅ Calculation completed successfully!');