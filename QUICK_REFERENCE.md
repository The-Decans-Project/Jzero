# Jzero Quick Reference

## Start

```bash
cp .env.example .env
npm run dev                        # API on port 3001
curl http://localhost:3001/api/health
```

## Key Files

| File | Purpose |
|------|---------|
| `astrology/index.js` | Main entry point, exports everything |
| `astrology/core/calculator.js` | Birth chart calculator |
| `server/api.js` | Express API server |
| `.env.example` | Configuration template |

## Common Imports

```javascript
import { calculateBirthChart } from './astrology/core/calculator.js';
import { dateToJulianDayTT, longitudeToZodiac } from './astrology/index.js';
import { getAllPlanetPositions, getHouses } from './astrology/index.js';
import { calculateSynastry } from './astrology/calculations/synastry.js';
import { calculateSecondaryProgression } from './astrology/calculations/progressions.js';
import { searchCities } from './astrology/utilities/geolocation.js';
```

## Error Handling

```javascript
import { ValidationError, CalculationError } from './astrology/core/errors.js';

try {
  const chart = calculateBirthChart(input);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Invalid input:', error.field);
  } else if (error instanceof CalculationError) {
    console.error('Calculation failed:', error.operation);
  }
}
```

## Input Validation

```javascript
import { validateBirthChartData } from './astrology/core/validator.js';

const validated = validateBirthChartData({
  date: '1994-03-01',
  time: '14:28:00',
  latitude: 40.7128,
  longitude: -74.0060
});
```

## Logging

```javascript
import { createLogger } from './astrology/core/logger.js';

const logger = createLogger('MyModule');
logger.debug('...', { data });
logger.info('...', { event });
logger.warn('...');
logger.error('...', { details });
logger.exception(error);
```

```bash
LOG_LEVEL=DEBUG        # DEBUG, INFO, WARN, ERROR, CRITICAL
LOG_STACK=true         # Include stack traces
```

## API Patterns (Express)

```javascript
import { asyncHandler, errorHandler, success } from './server/middleware.js';

app.post('/api/calculate', asyncHandler(async (req, res) => {
  const result = await calculateBirthChart(req.body);
  res.json(success(result));
}));

app.use(errorHandler);
```

## Health Endpoint

```bash
curl http://localhost:3001/api/health
# { "status": "healthy", "version": "2.0.0", ... }
```

## Environment Variables

```bash
NODE_ENV=production|development
PORT=3001
CORS_ORIGIN=*
LOG_LEVEL=DEBUG|INFO|WARN|ERROR|CRITICAL
LOG_STACK=true|false
CACHE_ENABLED=true|false
CACHE_TTL=3600
```

## npm Scripts

```bash
npm run dev          # Development server (port 3001)
npm run dev:full     # API + React frontend
npm start            # Production
npm test             # Tests
npm run validate     # Tests + lint
npm run build        # Build frontend
```

## Docs

- [QUICKSTART.md](QUICKSTART.md)
- [GETTING_STARTED.md](GETTING_STARTED.md)
- [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)
- [SERVER_API.md](SERVER_API.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [.env.example](.env.example)
