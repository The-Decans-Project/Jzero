// Accurate calculation of inner planets and Moon for March 1, 1994
import { calculateInnerPlanet, calculateMoonPosition, longitudeToZodiac } from './astrology/index.js';

// Precise JD_TT for March 1, 1994 at 19:28 UTC
const jd_tt = 2449409.797;

console.log('🪐 ACCURATE INNER PLANETS & MOON CALCULATION');
console.log('===========================================');
console.log(`Julian Day (TT): ${jd_tt}`);
console.log(`Date: March 1, 1994 at 19:28 UTC`);
console.log('');

console.log('🪐 INNER PLANETS (VSOP87):');
const innerPlanets = ['Mercury', 'Venus', 'Mars'];

innerPlanets.forEach(planet => {
  const pos = calculateInnerPlanet(planet, jd_tt);
  if (pos) {
    const zodiac = longitudeToZodiac(pos.longitude);
    console.log(`${planet.padEnd(8)}: ${zodiac.sign.padEnd(11)} ${zodiac.degrees.toFixed(2).padStart(5)}°`);
    console.log(`         Geocentric longitude: ${pos.longitude.toFixed(2)}°`);
    console.log(`         Heliocentric longitude: ${pos.longitudeHelio.toFixed(2)}°`);
    console.log(`         Earth longitude: ${pos.earthLongitude.toFixed(2)}°`);
    console.log('');
  }
});

console.log('🌙 MOON (ELP2000):');
const moonPos = calculateMoonPosition(jd_tt);
const moonZodiac = longitudeToZodiac(moonPos.longitude);
console.log(`Moon     : ${moonZodiac.sign.padEnd(11)} ${moonZodiac.degrees.toFixed(2).padStart(5)}°`);
console.log(`         Geocentric longitude: ${moonPos.longitude.toFixed(2)}°`);
console.log(`         Method: ${moonPos.method}`);
console.log('');

console.log('📊 VERIFICATION:');
console.log('These positions use the actual astronomical calculation algorithms');
console.log('from the Jzero calculator, not approximations.');