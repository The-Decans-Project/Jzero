// VSOP87 Theory Analysis for Inner Planets
// The Jzero calculator uses simplified VSOP87 with linear terms only

// FULL VSOP87 THEORY OVERVIEW:
// VSOP87 (Variations Séculaires des Orbites Planétaires) is a mathematical theory
// that expresses planetary coordinates as trigonometric series with hundreds of terms.
// The full theory provides arcsecond accuracy but requires extensive calculations.

// JZERO'S VSOP87 IMPLEMENTATION:
// The current code uses only the linear terms of VSOP87:
// - L = L0 + L1 * T  (mean longitude)
// - M = M0 + n * days (mean anomaly)
// - Basic Kepler equation solution
// - Simple geocentric conversion

// LIMITATIONS:
// - Only linear terms (full VSOP87 has T^2, T^3, sin/cos terms)
// - No perturbation terms from other planets
// - Simplified Kepler solution
// - Accuracy: ~1° (sufficient for astrology but not astronomy)

// WHY EPHEMERIS INTERPOLATION IS BETTER:
// - The CSV data contains actual astronomical ephemeris
// - Interpolation between ingress points gives high accuracy
// - Matches the design intent of Jzero (ephemeris + formula fallback)

console.log('🔬 VSOP87 THEORY ANALYSIS');
console.log('========================');
console.log('');
console.log('📚 VSOP87 OVERVIEW:');
console.log('• Full theory: Trigonometric series with 1000+ terms per planet');
console.log('• Accuracy: Arcseconds (0.01°)');
console.log('• Time range: 1900-2100 AD');
console.log('');
console.log('⚙️ JZERO IMPLEMENTATION:');
console.log('• Simplified: Linear terms only (L0, L1, M0, n)');
console.log('• Kepler equation: Newton-Raphson approximation');
console.log('• Geocentric conversion: Basic formula');
console.log('• Accuracy: ~1° (astrological precision)');
console.log('');
console.log('🎯 RECOMMENDATION:');
console.log('• Use ephemeris interpolation for accuracy');
console.log('• VSOP87 simplified version is fallback only');
console.log('• For March 1, 1994: Ephemeris data is more reliable');
console.log('');
console.log('📊 CONCLUSION:');
console.log('The corrected positions using ephemeris interpolation');
console.log('are more accurate than the simplified VSOP87 calculations.');