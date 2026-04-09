# Jzero Developer Guide

Open-source astrology calculations — birth charts, transits, progressions, synastry. Built to be accurate and easy to work with.

**Core**: JavaScript/Node.js  
**API**: HTTP REST (call from any language/framework)  
**License**: MIT — use it, fork it, build on it

## What's Included

- Modular architecture — easy to understand and extend
- Error handling and input validation
- Structured logging
- Express.js REST API
- Works from any language via HTTP
- Full JSDoc documentation on all functions

---

## Setup

```bash
git clone https://github.com/The-Decans-Project/Jzero.git
cd Jzero
npm install
cp .env.example .env
npm run dev
```

---

## Module Structure

```
astrology/
├── core/                  # Core calculations
│   ├── calculator.js      # Main birth chart calculator
│   ├── ephemeris.js       # Planetary position data & interpolation
│   ├── houses.js          # House system calculations
│   ├── julianDay.js       # Julian Day & time conversions
│   ├── planets.js         # Planetary constants & calculations
│   ├── swiss-ephemeris.js # Swiss Ephemeris integration
│   ├── time-corrections.js# ΔT and other time corrections
│   ├── errors.js          # Custom error classes
│   ├── validator.js       # Input validation
│   ├── logger.js          # Structured logging
│   └── config.js          # Configuration management
├── calculations/          # Astrological techniques
│   ├── houses.js          # House system selection
│   ├── progressions.js    # Secondary progressions, solar arcs, returns
│   ├── synastry.js        # Chart comparison and composite
│   └── transits.js        # Current and future transits
├── utilities/
│   ├── geolocation.js     # City database and coordinate helpers
│   └── chart-database.js  # In-memory chart storage
└── index.js               # Re-exports everything
```

---

## Key Imports

```javascript
// Birth chart
import { calculateBirthChart } from './astrology/core/calculator.js';

// Time & coordinates
import { dateToJulianDayTT, calculateLST } from './astrology/core/julianDay.js';
import { longitudeToZodiac, calculateAllPlanets } from './astrology/core/planets.js';
import { getAllPlanetPositions, getHouses } from './astrology/core/swiss-ephemeris.js';

// Astrological techniques
import { calculateTransits } from './astrology/calculations/transits.js';
import { calculateSynastry } from './astrology/calculations/synastry.js';
import { calculateSecondaryProgression } from './astrology/calculations/progressions.js';

// Infrastructure
import { createLogger } from './astrology/core/logger.js';
import { validateBirthChartData } from './astrology/core/validator.js';
import { ValidationError, CalculationError } from './astrology/core/errors.js';

// Or import everything from the index
import { calculateBirthChart, longitudeToZodiac, searchCities } from './astrology/index.js';
```

---

## Error Handling

```javascript
import { ValidationError, EphemerisError, CalculationError } from './astrology/core/errors.js';

try {
  const chart = calculateBirthChart(data);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Invalid input:', error.field);
  } else if (error instanceof EphemerisError) {
    console.error('Ephemeris error:', error.planet);
  } else if (error instanceof CalculationError) {
    console.error('Calculation failed:', error.operation);
  }
}
```

---

## Logging

```javascript
import { createLogger } from './astrology/core/logger.js';

const logger = createLogger('MyModule');

logger.debug('Debug info', { context: 'data' });
logger.info('Chart calculated', { event: 'birth_chart' });
logger.warn('Slow calc', { duration: 5000 });
logger.error('Failed', { details });
logger.exception(error);
```

Environment control:
```bash
LOG_LEVEL=DEBUG    # DEBUG, INFO, WARN, ERROR, CRITICAL
LOG_STACK=true     # Include stack traces
```

---

## Configuration

All settings via `.env`:

```bash
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://example.com
LOG_LEVEL=INFO
LOG_STACK=false
CACHE_ENABLED=true
CACHE_TTL=3600
```

---

## Running Commands

```bash
npm run dev          # Development with debug logging (port 3001)
npm run dev:full     # API + React frontend
npm start            # Production
npm test             # Run test suite
npm run validate     # Tests + lint
npm run build        # Build React frontend
```

---

## Adding New Calculations

```javascript
/**
 * @param {number} jd - Julian Day Number
 * @param {Object} params - Parameters
 * @returns {Object} Result
 * @throws {ValidationError} If parameters are invalid
 */
export function myCalculation(jd, params = {}) {
  const result = doMath(jd, params);
  return result;
}
```

---

## Deployment

```bash
cp .env.example .env
# Set NODE_ENV=production, LOG_LEVEL=WARN, CORS_ORIGIN=your-domain
npm start
curl http://localhost:3001/api/health
```

Docker:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
ENV NODE_ENV=production
CMD ["npm", "start"]
```

---

## Testing

```bash
npm test             # All tests
npm run test:accuracy# Accuracy validation
npm run validate     # Tests + lint
```

---

## Contributing

1. Fork the repo
2. `git checkout -b feature/your-feature`
3. Make changes with JSDoc on all public functions
4. `npm run validate`
5. Open a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md).
