// Precise Julian Day calculation for March 1, 1994 at 14:28 EST using CSV reference points

// CSV Reference Points (already in UTC):
// Sun enters Pisces: Feb 18, 1994 at 21:22 EST = Feb 19, 1994 at 02:22 UTC = JD 2449398.39028
// Sun enters Aries:  Mar 20, 1994 at 20:28 EST = Mar 21, 1994 at 01:28 UTC = JD 2449428.35278

// Birth time: March 1, 1994 at 14:28 EST = March 1, 1994 at 19:28 UTC

// Calculate days from Pisces ingress reference point:
// From Feb 19 at 02:22 UTC to March 1 at 19:28 UTC:
// - Date difference: Feb 19 to March 1 = 10 days
// - Time difference: 19:28 - 02:22 = 17 hours 6 minutes = 17.1 hours = 0.7125 days
// - Total days: 10.7125

const piscesIngressJD = 2449398.39028;
const daysFromPiscesIngress = 10.7125;
const jd_utc = piscesIngressJD + daysFromPiscesIngress;

// ΔT correction for 1994 (from Espenak-Meeus polynomial)
const year = 1994;
const t = year - 2000; // t = -6
const deltaT_seconds = 63.86 + 0.3345 * t - 0.060374 * t * t + 0.0017275 * t * t * t +
                      0.000651814 * t * t * t * t + 0.00002373599 * t * t * t * t * t;
const deltaT_days = deltaT_seconds / 86400;

const jd_tt = jd_utc + deltaT_days;

// Verify position calculation
const ariesIngressJD = 2449428.35278;
const totalPiscesDays = ariesIngressJD - piscesIngressJD; // 29.9625 days
const sunDegreesPerDay = 360 / 365.25; // ~0.986° per day
const positionInPisces = (jd_tt - piscesIngressJD) * sunDegreesPerDay;
const sunLongitude = 330 + positionInPisces; // Pisces starts at 330°

console.log('🧮 PRECISE JULIAN DAY CALCULATION');
console.log('================================');
console.log(`Birth Date/Time: March 1, 1994 at 14:28 EST`);
console.log(`UTC Time: March 1, 1994 at 19:28 UTC`);
console.log('');

console.log('📊 REFERENCE POINTS FROM CSV:');
console.log(`Pisces Ingress: JD ${piscesIngressJD} (Feb 18, 1994 21:22 EST)`);
console.log(`Aries Ingress:  JD ${ariesIngressJD} (Mar 20, 1994 20:28 EST)`);
console.log(`Total Pisces period: ${totalPiscesDays.toFixed(4)} days`);
console.log('');

console.log('⏰ TIME CALCULATION:');
console.log(`Days from Pisces ingress: ${daysFromPiscesIngress} days`);
console.log(`JD (UTC): ${jd_utc.toFixed(6)}`);
console.log(`ΔT correction: ${deltaT_seconds.toFixed(3)} seconds (${deltaT_days.toFixed(6)} days)`);
console.log(`JD (TT): ${jd_tt.toFixed(6)}`);
console.log('');

console.log('☀️ SUN POSITION VERIFICATION:');
console.log(`Sun movement rate: ${sunDegreesPerDay.toFixed(3)}° per day`);
console.log(`Position in Pisces: ${positionInPisces.toFixed(2)}°`);
console.log(`Sun longitude: ${sunLongitude.toFixed(2)}° (${(sunLongitude % 30).toFixed(1)}° Pisces)`);
console.log('');

console.log('✅ VERIFICATION:');
const expectedPiscesPosition = 11.0; // From our earlier manual calculation
const calculatedPiscesPosition = sunLongitude % 30;
console.log(`Expected Sun position: ${expectedPiscesPosition}° Pisces`);
console.log(`Calculated position: ${calculatedPiscesPosition.toFixed(1)}° Pisces`);
console.log(`Match: ${Math.abs(calculatedPiscesPosition - expectedPiscesPosition) < 0.5 ? '✅' : '❌'}`);