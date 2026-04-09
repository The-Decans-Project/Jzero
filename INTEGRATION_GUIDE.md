# Integration Guide - Getting the System Running

## Overview

Jzero provides two calculation modes:

1. **Swiss Ephemeris** (Best) - Professional-grade accuracy (±0.0001°)
2. **CSV Calibration** (Good) - Working fallback with reasonable accuracy (±0.1°)

The system is designed to work well out of the box. For production use and best accuracy, use Swiss Ephemeris.

---

## Quick Start

### Option 1: With Swiss Ephemeris (Recommended)

Install the Swiss Ephemeris package:

```bash
npm install swisseph
```

The system automatically detects and uses Swiss when available.

```javascript
import { calculateBirthChart } from './astrology/core/calculator.js';

const chart = calculateBirthChart({
  year: 1994,
  month: 3,
  day: 1,
  hour: 14,
  minute: 28,
  latitude: 40.7128,   // NYC
  longitude: -74.0060
});

console.log('Calculation Mode:', chart.calculationMode); // SWISS_EPHEMERIS
console.log('Sun:', chart.sun);
```

### Option 2: CSV Calibration (Fallback)

If Swiss Ephemeris isn't installed, the system automatically falls back to CSV-based calculation:

```javascript
// Same code - automatically uses CSV if Swiss unavailable
const chart = calculateBirthChart({
  year: 1994,
  month: 3,
  day: 1,
  hour: 14,
  minute: 28,
  latitude: 40.7128,
  longitude: -74.0060
});

console.log('Calculation Mode:', chart.calculationMode); // CSV_CALIBRATION
console.log('Sun position with ±0.1° accuracy');
```

---

## Using the Calculator

### Basic Birth Chart

```javascript
import { calculateBirthChart } from './astrology/core/calculator.js';

const chart = calculateBirthChart({
  year: 2000,
  month: 1,
  day: 1,
  hour: 12,
  minute: 0,
  latitude: 40.7128,    // New York
  longitude: -74.0060,
  timezone: -5          // EST
});

// Results include all 10 planets with zodiac signs
console.log(chart.sun);    // { sign: 'Capricorn', degree: 10.5, ... }
console.log(chart.moon);   // { sign: 'Scorpio', degree: 0.34, ... }
```

### Working with Julian Day

```javascript
import { dateToJulianDayTT } from './astrology/core/julianDay.js';
import { calculateAllPlanets } from './astrology/core/planets.js';

// Convert to Julian Day
const jdData = dateToJulianDayTT(2000, 1, 1, 12, 0, 0);

// Calculate planet positions
const positions = calculateAllPlanets(jdData.jd_tt);

console.log('Mercury:', positions.mercury);
console.log('Venus:', positions.venus);
```

---

## Accuracy Levels

| Mode | Accuracy | Best For |
|------|----------|----------|
| Swiss Ephemeris | ±0.0001° | Professional, commercial, precision |
| CSV Calibration | ±0.1° | General use, fallback, testing |

---

## Important: Example Files

The example files in the `examples/` directory contain simplified calculations and **should not be used for production**. They are for reference only. Please use the core calculator module directly instead.

For working examples, see:
- `test/test-birth-chart.js` - Real test subjects with verified results
- `examples/basic-birth-chart.js` - Basic calculator usage
- `examples/synastry-comparison.js` - Comparing two charts

---

## Setting Up for Production

### Environment Variables

```bash
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-domain.com
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "server/api.js"]
```

### Commercial Use

If deploying for commercial use with Swiss Ephemeris, you **must** obtain a Swiss Ephemeris commercial license. See [LICENSING.md](LICENSING.md) for details.

---

## Resources

- **Swiss Ephemeris:** https://www.astro.com/swisseph/
- **npm Package:** https://www.npmjs.com/package/swisseph
- **LICENSING.md** - License terms and commercial use
- **QUICKSTART.md** - 5-minute setup guide
- **ARCHITECTURE.md** - Technical design

---

## Contributing

We welcome contributions! The system is well-structured for adding:

- Additional house systems
- Aspect calculations
- Transit interpretations
- Progression calculations
- Better test coverage

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

**Ready to get started? Follow [QUICKSTART.md](QUICKSTART.md) for a 5-minute setup.**
