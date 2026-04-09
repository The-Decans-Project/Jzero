# Jzero: Professional Astrology Calculation Engine

A production-ready, open-source astrology calculation framework. Provides accurate birth chart calculations, transits, progressions, synastry analysis, and more.

**Core**: JavaScript/Node.js  
**API**: HTTP REST (call from any language/framework)  
**License**: MIT (open source, free to use and modify)

## 📋 Status: Professional Production System

✅ **Module Architecture**: Clean 11-core + delegation layer structure  
✅ **Error Handling**: Comprehensive error classes and validation  
✅ **Logging**: Structured logging with multiple levels  
✅ **Configuration**: Environment-based configuration management  
✅ **API**: Express.js REST API with middleware infrastructure  
✅ **Language Agnostic**: Use from JavaScript, Python, Java, C#, Go, Rust, etc.  
✅ **Documentation**: Full JSDoc and API documentation  

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/The-Decans-Project/Jzero.git
cd Jzero

# Install dependencies
npm install

# Setup frontend (if using web UI)
npm run setup
```

### Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env for your environment
# See .env.example for all available options
```

### Running

```bash
# Development mode (with debug logging)
npm run dev

# Production mode
NODE_ENV=production npm start

# With full frontend
npm run dev:full
```

## 📚 API Documentation

### Health Check
```bash
GET /api/health
```

### Calculate Birth Chart
```bash
POST /api/chart/birth-chart

Body: {
  "date": "1994-03-01",
  "time": "14:28:00",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "houseSystem": "porphyry"
}

Response: {
  "success": true,
  "data": {
    "jd": 2449409.797,
    "planets": { ... },
    "houses": { ... },
    "angles": { ... }
  }
}
```

### Calculate Transits
```bash
POST /api/chart/transits

Body: {
  "natalChart": { ... },
  "transitDate": "2024-04-09"
}

Response: {
  "success": true,
  "data": {
    "transits": [ ... ],
    "aspects": [ ... ]
  }
}
```

## 🏗️ Architecture

### Module Structure

```
astrology/
├── core/                  # Core calculations
│   ├── calculator.js      # Main birth chart calculator
│   ├── ephemeris.js       # Planetary position data & interpolation
│   ├── houses.js          # House system calculations
│   ├── julianDay.js       # Julian Day & time conversions
│   ├── planets.js         # Planetary constants & calculations
│   ├── time-corrections.js # ΔT and other time corrections
│   ├── errors.js          # Custom error classes
│   ├── validator.js       # Input validation
│   ├── logger.js          # Structured logging
│   └── config.js          # Configuration management
├── calculations/          # Astrological techniques
│   ├── houses.js
│   ├── progressions.js
│   ├── synastry.js
│   └── transits.js
├── utilities/             # Helper modules
│   ├── geolocation.js
│   └── chart-database.js
└── index.js              # Main entry point
```

### Core Exports

```javascript
// Time calculations
import { dateToJulianDayTT, calculateLST } from 'jzero';

// Planetary positions
import { calculateAllPlanets, longitudeToZodiac } from 'jzero';

// House systems
import { calculateHouses } from 'jzero';

// Astrological techniques
import { calculateTransits, calculateSynastry, calculateProgressions } from 'jzero';

// Professional infrastructure
import { createLogger, validateBirthChartData, config } from 'jzero';
```

## 🛡️ Error Handling

All functions include comprehensive error handling through custom error classes:

```javascript
import { 
  ValidationError, 
  EphemerisError, 
  CalculationError 
} from 'jzero';

try {
  const chart = calculateBirthChart(data);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Invalid input:', error.field);
  } else if (error instanceof EphemerisError) {
    console.error('Missing ephemeris data for:', error.planet);
  } else if (error instanceof CalculationError) {
    console.error('Calculation failed:', error.operation);
  }
}
```

## 📊 Logging

Structured logging at multiple levels:

```javascript
import { createLogger } from 'jzero';

const logger = createLogger('MyApp');

logger.debug('Debug info', { context: 'data' });
logger.info('Information', { event: 'chart_calculated' });
logger.warn('Warning', { deprecation: 'old_api' });
logger.error('Error', { error: details });
logger.exception(error);  // Log exceptions with stack traces
```

Configuration via environment:
```bash
LOG_LEVEL=DEBUG        # DEBUG, INFO, WARN, ERROR, CRITICAL
LOG_STACK=true         # Include stack traces
```

## ⚙️ Configuration

All settings can be configured via `.env`:

```bash
# Server
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://example.com

# Logging
LOG_LEVEL=INFO
LOG_STACK=false

# Ephemeris
EPHEMERIS_DATA_PATH=./data
SWISS_EPHEMERIS=false

# Caching
CACHE_ENABLED=true
CACHE_TTL=3600
```

Or programmatically:

```javascript
import config from 'jzero/core/config.js';

const port = config.get('server.port');
config.set('logging.level', 'DEBUG');

// Validate configuration
const errors = config.validate();
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Test accuracy
npm run test:accuracy

# Validate everything
npm run validate
```

## 📖 Development

### Code Structure

- **Pure Functions**: All calculations are pure functions with no side effects
- **Error-First**: Functions throw descriptive errors on invalid input
- **Immutable Data**: Calculations don't modify input objects
- **Well-Documented**: Every function has JSDoc documentation

### Adding New Calculations

```javascript
/**
 * Your calculation function
 * @param {number} jd - Julian Day Number
 * @param {Object} params - Calculation parameters
 * @returns {Object} Calculation results
 * @throws {ValidationError} If parameters are invalid
 * @throws {CalculationError} If calculation fails
 */
export function yourCalculation(jd, params = {}) {
  // Validate inputs
  const validParams = validateYourParams(params);
  
  // Perform calculation
  const result = performCalculation(jd, validParams);
  
  // Return result
  return result;
}
```

### Logging in Calculations

```javascript
import { createLogger } from '../core/logger.js';

const logger = createLogger('YourModule');

export function expensiveCalculation(data) {
  logger.debug('Starting calculation', { dataSize: data.length });
  
  try {
    const result = doCalculation(data);
    logger.info('Calculation complete', { resultType: typeof result });
    return result;
  } catch (error) {
    logger.exception(error, { data: data.slice(0, 10) });
    throw error;
  }
}
```

## 🚢 Deployment

### Production Checklist

- [ ] Copy `.env.example` to `.env` and configure
- [ ] Set `NODE_ENV=production`
- [ ] Set `LOG_LEVEL=WARN` or `ERROR`
- [ ] Enable caching: `CACHE_ENABLED=true`
- [ ] Configure database for persistence
- [ ] Setup monitoring/error tracking
- [ ] Run validation: `npm run validate`
- [ ] Test endpoints thoroughly

### Docker (Optional)

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

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards

- ESLint configuration enforced
- 100% functions must have JSDoc
- All public APIs must have error handling
- Configuration changes require environment variable support

## 📄 License

MIT License - See LICENSE file

## 🤝 Support

- 📖 [Documentation](./docs)
- 🐛 [Report Issues](https://github.com/The-Decans-Project/Jzero/issues)
- 💬 [Discussions](https://github.com/The-Decans-Project/Jzero/discussions)

## ⭐ Credits

Built by the Jzero community with support from The-Decans-Project

---

**Current Version**: 2.0.0 (Professional Release)  
**Status**: Production Ready ✅  
**Last Updated**: 2026-04-09
