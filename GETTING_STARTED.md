# Jzero: Getting Started for Developers

**Version**: 2.0.0 Professional Edition  
**Status**: ✅ Production Ready  
**Perfect For**: Building astrology applications on a solid, professional foundation

---

## 🚀 5-Minute Setup

```bash
# 1. Clone and setup
git clone https://github.com/The-Decans-Project/Jzero.git
cd Jzero
npm install

# 2. Copy environment template
cp .env.example .env

# 3. Start development server
npm run dev

# 4. Test it works
curl http://localhost:3001/api/health
```

That's it! You now have a production-grade astrology calculation engine running.

---

## 📚 What You Have

### Core Modules (Ready to Use)
```javascript
import { 
  // Time & Calculations
  dateToJulianDayTT,
  calculateHouses,
  calculateBirthChart,
  longitudeToZodiac,
  
  // Astrological Techniques
  calculateTransits,
  calculateSynastry,
  calculateProgressions,
  
  // Professional Infrastructure
  createLogger,
  validateBirthChartData,
  config
} from 'jzero';
```

### Professional Features (Built-In)
- ✅ Error handling with HTTP codes
- ✅ Input validation framework
- ✅ Structured logging
- ✅ Configuration management
- ✅ Express middleware suite
- ✅ Health check endpoint

---

## 💡 Building Your Application

### Pattern 1: Birth Chart Calculation

```javascript
import { 
  validateBirthChartData, 
  calculateBirthChart,
  createLogger 
} from 'jzero';

const logger = createLogger('MyApp');

async function calculateChart(userInput) {
  try {
    // 1. Validate input
    const data = validateBirthChartData(userInput);
    
    // 2. Calculate
    const chart = calculateBirthChart(data);
    
    // 3. Log and return
    logger.info('Chart calculated', { name: chart.name });
    return chart;
  } catch (error) {
    logger.exception(error);
    throw error;
  }
}
```

### Pattern 2: API Endpoint

```javascript
import express from 'express';
import { asyncHandler, success } from './server/middleware.js';
import { calculateBirthChart, validateBirthChartData } from 'jzero';

const app = express();

app.post('/api/chart', asyncHandler(async (req, res) => {
  // Validation happens automatically
  const data = validateBirthChartData(req.body);
  
  // Calculate chart
  const chart = calculateBirthChart(data);
  
  // Return formatted response
  res.json(success(chart, 'Birth chart calculated'));
}));
```

### Pattern 3: Using Configuration

```javascript
import config from 'jzero/core/config.js';

// Get settings (from .env or defaults)
const maxCharts = config.get('cache.maxSize', 100);
const logLevel = config.get('logging.level', 'INFO');

// Configure for your app
if (process.env.ENABLE_ADVANCED_CALCS) {
  config.set('features.progressions', true);
}

// Validate everything works
const errors = config.validate();
if (errors.length > 0) {
  console.error('Config errors:', errors);
}
```

---

## 🔧 Development Commands

```bash
npm run dev              # Start with debug logging
npm test                 # Run all tests
npm run validate         # Test + lint
npm run build:frontend   # Build React app (if using)
npm start                # Production mode
```

---

## 📁 Project Structure

```
Jzero/
├── astrology/               # Core module library
│   ├── core/               # 11 core modules (calculations + infrastructure)
│   ├── calculations/       # Astrological techniques (re-exports)
│   ├── utilities/          # Helpers like geolocation (re-exports)
│   └── index.js           # Main entry point
│
├── server/                 # API server
│   ├── api.js             # Express server setup
│   └── middleware.js      # Express middleware utilities
│
├── public/app/             # React frontend (optional)
│   ├── src/
│   └── package.json
│
├── test/                   # Test suite
│   └── test-*.js
│
├── examples/               # Code examples
│   └── *.js
│
├── .env.example           # Configuration template
├── DEVELOPER_GUIDE.md     # Full development guide
└── QUICK_REFERENCE.md    # Quick usage guide
```

---

## 🎯 Next Steps (Choose Your Path)

### Path 1: Build a Web UI
```bash
cd public/app
npm install
npm run dev
# Your React components can call astrology calculations
```

### Path 2: Extend the API
```javascript
// server/api.js - Add your endpoints
app.post('/api/synastry', calculateSynastry);
app.post('/api/transits', calculateTransits);
app.post('/api/progressions', calculateProgressions);
```

### Path 3: Build a Library/Package
```javascript
// Export calc functions for npm
export { calculateBirthChart } from 'jzero';
export { validateBirthChartData } from 'jzero';
// Publish to npm...
```

### Path 4: Integrate with Existing App
```javascript
// Just import what you need
import { calculateBirthChart } from 'jzero';

// Use in your app - works with any framework
const chart = calculateBirthChart(data);
```

---

## ⚙️ Configuration for Your Environment

Edit `.env` (copied from `.env.example`):

```bash
# Your app settings
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://myapp.com

# Logging
LOG_LEVEL=INFO              # DEBUG, INFO, WARN, ERROR
LOG_STACK=false             # Include stack traces?

# Features you're using
FEATURE_BIRTH_CHART=true    # Enabled by default
FEATURE_TRANSITS=true
FEATURE_SYNASTRY=true
FEATURE_PROGRESSIONS=true

# Performance
CACHE_ENABLED=true
CACHE_TTL=3600
```

---

## 🛡️ Error Handling (Important!)

Always use try/catch and validate input:

```javascript
import { 
  ValidationError, 
  CalculationError,
  createLogger 
} from 'jzero';

const logger = createLogger('MyApp');

try {
  const data = validateBirthChartData(userInput);
  const chart = calculateBirthChart(data);
  
  return chart;
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation error
    console.error(`Invalid ${error.field}: ${error.message}`);
    return { error: error.message, field: error.field };
  } else if (error instanceof CalculationError) {
    // Handle calculation error
    logger.error('Calculation failed', { operation: error.operation });
    return { error: 'Calculation failed' };
  } else {
    // Handle unexpected errors
    logger.exception(error);
    return { error: 'An unexpected error occurred' };
  }
}
```

---

## 📖 Documentation You Have

1. **QUICK_REFERENCE.md** - This provides quick code examples
2. **DEVELOPER_GUIDE.md** - Complete setup and deployment guide
3. **PROFESSIONAL_SYSTEM.md** - System architecture and features
4. **IMPLEMENTATION_SUMMARY.md** - Technical implementation details
5. **API comments** - Every function has JSDoc documentation

Read the docs that match what you're building!

---

## ✅ Quality Checklist Before Releasing

- [ ] Validate input with `validateBirthChartData()`
- [ ] Use error-specific catch blocks
- [ ] Add logging for debugging: `logger.info()`, `logger.exception()`
- [ ] Configure environment variables in `.env`
- [ ] Test endpoints: `curl http://localhost:3001/api/health`
- [ ] Run: `npm run validate` (tests all code)

---

## 🚀 Deploy to Production

```bash
# 1. Stop development server (Ctrl+C)

# 2. Set production mode
echo "NODE_ENV=production" >> .env
echo "LOG_LEVEL=WARN" >> .env
echo "CORS_ORIGIN=https://yourapp.com" >> .env

# 3. Start production server
NODE_ENV=production npm start

# 4. Verify health
curl http://localhost:3001/api/health
```

---

## 🆘 Common Questions

**Q: How do I add a new house system?**  
A: Add it to `astrology/core/calculator.js` and export it from the calculations module.

**Q: Where do I add custom validation?**  
A: Create validators in `astrology/core/validator.js` and use them before calculations.

**Q: How do I add more logging?**  
A: Import `createLogger` and use `logger.debug()`, `logger.info()`, etc. throughout your code.

**Q: Can I use this without the API server?**  
A: Yes! Just import the calculation functions and use directly: `import { calculateBirthChart } from 'jzero'`

**Q: Where's the database?**  
A: Currently in-memory (`astrology/utilities/chart-database.js`). Configure SQLite/PostgreSQL in `.env`

---

## 🎓 Learning Resources

- **Astrology Theory**: Check `SERVER_API.md` for API documentation
- **Implementation Details**: Read `IMPLEMENTATION_SUMMARY.md`
- **Examples**: See `examples/` directory for code samples
- **Configuration**: Copy `.env.example` and see options

---

## 💪 You're Ready!

Everything is set up for you to:
- ✅ Build astrology web apps
- ✅ Create REST APIs
- ✅ Integrate with existing projects
- ✅ Publish npm packages
- ✅ Deploy to production

**Start with `npm run dev` and build something awesome!**

---

**Questions?**
- 📖 Check DEVELOPER_GUIDE.md
- 🔍 Read function JSDoc comments
- 💬 Open a GitHub issue
- ⭐ Star the project if you find it useful!

**Good luck building! 🌙⭐**
