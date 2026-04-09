// Jzero unified astrology module index
// Single canonical entrypoint for all astrology calculations
// Professional-grade framework with Swiss Ephemeris support
//
// 🌍 Language Agnostic:
// - Use as JavaScript/Node.js library: import { calculateBirthChart } from 'jzero'
// - Use via HTTP API: call http://api-server:3001/api/chart/birth-chart from Python, Go, Java, etc.
// - Fork and port to your preferred language (MIT licensed)

// Core modules - Fundamental calculations (5)
export * from './core/julianDay.js';
export * from './core/time-corrections.js';
export * from './core/planets.js';
export * from './core/calculator.js';
export * from './core/ephemeris.js';

// Professional infrastructure (3)
export * from './core/errors.js';
export * from './core/validator.js';
export * from './core/logger.js';
export * from './core/config.js';

// Calculation modules - Astrological techniques (4)
export * from './calculations/houses.js';
export * from './calculations/progressions.js';
export * from './calculations/synastry.js';
export * from './calculations/transits.js';

// Utility modules - Helpers and database (2)
export * from './utilities/chart-database.js';
export * from './utilities/geolocation.js';
export * from './utilities/geolocation.js';
