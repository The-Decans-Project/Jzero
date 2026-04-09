# Jzero Quick Reference

## 🚀 Getting Started (30 seconds)

```bash
# Setup
cp .env.example .env

# Development
npm run dev

# Production
NODE_ENV=production npm start

# Test it
curl http://localhost:3001/api/health
```

## 📚 Key Files

| File | Purpose |
|------|---------|
| `astrology/index.js` | Main entry point, exports all modules |
| `.env.example` | Configuration template |
| `DEVELOPER_GUIDE.md` | Complete setup & deployment guide |
| `PROFESSIONAL_SYSTEM.md` | System overview & features |

## 🛡️ Error Handling

```javascript
import { ValidationError, CalculationError } from 'jzero/core/errors.js';

try {
  const data = calculateChart(input);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Invalid input:', error.field);
  } else if (error instanceof CalculationError) {
    console.error('Calculation failed:', error.operation);
  }
}
```

## ✅ Input Validation

```javascript
import { validateBirthChartData } from 'jzero/core/validator.js';

try {
  const validated = validateBirthChartData({
    date: '1994-03-01',
    time: '14:28:00',
    latitude: 40.7128,
    longitude: -74.0060
  });
  // All validated and safe
} catch (error) {
  // error.field tells you which field failed
  console.error(`Invalid ${error.field}: ${error.message}`);
}
```

## 📊 Logging

```javascript
import { createLogger } from 'jzero/core/logger.js';

const logger = createLogger('MyApp');

logger.debug('Debug info', { context: 'data' });
logger.info('Chart calculated', { nodes: 10 });
logger.warn('Slow calculation', { duration: 5000 });
logger.error('Calculation failed', { code: 'NaN' });
logger.exception(error);  // Format exception with context
```

**Environment Control**:
```bash
LOG_LEVEL=DEBUG        # Show all logs
LOG_LEVEL=WARN         # Show only warnings+
LOG_STACK=true         # Include stack traces
```

## ⚙️ Configuration

```javascript
import config from 'jzero/core/config.js';

// Get values (with defaults)
const port = config.get('server.port', 3001);
const logLevel = config.get('logging.level');

// Set values
config.set('logging.level', 'DEBUG');

// Check if exists
if (config.has('cache.enabled')) {
  // ...
}

// Get all
const allSettings = config.getAll();

// Validate
const errors = config.validate();
```

**Common Settings**:
```javascript
config.get('server.port')           // 3001
config.get('server.environment')    // 'development'
config.get('logging.level')         // 'INFO'
config.get('cache.enabled')         // true
config.get('ephemeris.dataPath')    // './data'
```

## 🌐 Express API Patterns

```javascript
import express from 'express';
import { asyncHandler, errorHandler, success, error } from './server/middleware.js';

const app = express();

// Handle async routes properly
app.post('/api/calculate', asyncHandler(async (req, res) => {
  const result = await calculateChart(req.body);
  res.json(success(result, 'Chart calculated'));
}));

// Errors automatically converted to JSON
app.get('/api/chart/:id', asyncHandler(async (req, res) => {
  const chart = await getChart(req.params.id);
  if (!chart) throw new NotFoundError('Chart not found');
  res.json(success(chart));
}));

// Error handling (attach last)
app.use(errorHandler);
```

## 📈 Health Endpoint

```bash
curl http://localhost:3001/api/health

{
  "status": "healthy",
  "version": "2.0.0",
  "uptime": 123.45,
  "memory": {
    "heapUsed": 45,        // MB
    "heapTotal": 512,      // MB
    "external": 2          // MB
  }
}
```

## 🧪 Testing

```bash
npm test                # Run all tests
npm run test:accuracy   # Accuracy specific
npm run validate        # Test + lint
```

## 📝 Create .env File

```bash
# Copy template
cp .env.example .env

# Edit for your needs
# Common settings:
NODE_ENV=production
PORT=3001
LOG_LEVEL=INFO
CACHE_ENABLED=true
```

## 🔍 Debugging

```bash
# Development mode with debug logging
npm run dev

# Shows: [timestamp] [DEBUG] [Module] Message

# Production mode
NODE_ENV=production LOG_LEVEL=WARN npm start

# Shows only: [timestamp] [WARN] or [ERROR] [Module] Message
```

## 📊 Module Organization

```
Import from 'jzero':

Calculations:
├─ calculateBirthChart()
├─ calculateTransits()
├─ calculateSynastry()
└─ calculateProgressions()

Data:
├─ dateToJulianDayTT()
├─ calculateHouses()
├─ longitudeToZodiac()
└─ calculateAllPlanets()

Professional:
├─ createLogger()
├─ validateBirthChartData()
├─ config.get/set()
└─ Custom error classes
```

## 🚢 Deployment Checklist

- [ ] Copy `.env.example` to `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Set `LOG_LEVEL=WARN` or `ERROR`
- [ ] Enable caching: `CACHE_ENABLED=true`
- [ ] Configure database path if needed
- [ ] Run `npm run validate` (test + lint)
- [ ] Start with `NODE_ENV=production npm start`
- [ ] Check `/api/health` endpoint

## 💾 Environment Variables (Common)

```bash
# Server
NODE_ENV=production|development
PORT=3001
CORS_ORIGIN=*

# Logging
LOG_LEVEL=DEBUG|INFO|WARN|ERROR|CRITICAL
LOG_STACK=true|false

# Feature toggling
FEATURE_BIRTH_CHART=true
FEATURE_TRANSITS=true
FEATURE_SYNASTRY=true

# Caching
CACHE_ENABLED=true|false
CACHE_TTL=3600

# Database
DATABASE_TYPE=memory|sqlite|postgresql
DATABASE_PATH=./data/charts.db
```

## 📚 Documentation

- **Setup**: Read `DEVELOPER_GUIDE.md`
- **Features**: Read `PROFESSIONAL_SYSTEM.md`
- **Implementation**: Read `IMPLEMENTATION_SUMMARY.md`
- **API**: Check `server/middleware.js` docs
- **Config**: See `.env.example`

## ✨ Tips

1. **Always validate input**:  Use `validateBirthChartData()` before calculations

2. **Use proper logging**: Replace `console.log()` with `logger.debug()`

3. **Handle errors gracefully**: Catch specific error types, not generic `Error`

4. **Configure for environment**: Use `.env` files, not hardcoded values

5. **Check health endpoint**: Useful for monitoring production deployments

---

**Quick Links**:
- 📖 [Developer Guide](./DEVELOPER_GUIDE.md)
- 🎯 [Professional System](./PROFESSIONAL_SYSTEM.md)
- 📝 [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- ⚙️ [Configuration Template](./.env.example)

**Version**: 2.0.0  
**Status**: ✅ Production Ready
