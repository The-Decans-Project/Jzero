// Test Julian Day calculation for March 1, 1994 at 14:28 EST
import { dateToJulianDayTT } from './astrology/core/julianDay.js';

console.log('Testing Julian Day calculation for March 1, 1994 at 14:28 EST');
console.log('=' .repeat(60));

// Convert EST to UTC: 14:28 EST = 19:28 UTC
const jdData = dateToJulianDayTT(1994, 3, 1, 19, 28, 0);

console.log(`Date: March 1, 1994 at 19:28 UTC (14:28 EST)`);
console.log(`JD UTC: ${jdData.jd_utc.toFixed(6)}`);
console.log(`JD TT: ${jdData.jd_tt.toFixed(6)}`);
console.log(`ΔT: ${jdData.deltaT.toFixed(3)} seconds`);
console.log(`ΔT in days: ${jdData.deltaT_days.toFixed(6)}`);

// Check if this JD is within CSV range
console.log('\nChecking CSV data range:');
console.log('From CSV - Sun enters Pisces: Feb 18, 1994 ~ JD 2449398.39');
console.log('From CSV - Sun enters Aries: Mar 20, 1994 ~ JD 2449428.35');
console.log(`Our calculation: JD ${jdData.jd_tt.toFixed(6)}`);
console.log(`Days from Pisces ingress: ${(jdData.jd_tt - 2449398.39).toFixed(1)}`);
console.log(`Days to Aries ingress: ${(2449428.35 - jdData.jd_tt).toFixed(1)}`);