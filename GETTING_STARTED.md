# Getting Started

## Choose Your Integration Path

Jzero works from any stack:

| Approach | Use Case | Setup |
|----------|----------|-------|
| **Node.js library** | JavaScript/TypeScript backend | 5 min |
| **HTTP API** | Python, Java, Go, C#, Rust, PHP, etc. | 10 min |

---

## Option 1: Node.js Library

```bash
git clone https://github.com/The-Decans-Project/Jzero.git
cd Jzero
npm install
```

```javascript
import { calculateBirthChart } from './astrology/core/calculator.js';
import { dateToJulianDayTT, longitudeToZodiac } from './astrology/index.js';
import { getAllPlanetPositions, getHouses } from './astrology/index.js';

// Calculate a birth chart
const chart = calculateBirthChart({
  year: 1994,
  month: 3,
  day: 1,
  hour: 14,
  minute: 28,
  timezone: -5,
  latitude: 40.7128,
  longitude: -74.0060
});

console.log('Sun:', chart.planets.Sun);
console.log('Ascendant:', chart.angles.ascendant);
```

See [examples/](examples/) for more working code.

---

## Option 2: HTTP API

Start the server:

```bash
npm run dev
# Listening on http://localhost:3001
```

Then call it from any language. From Python:

```python
import requests

response = requests.post('http://localhost:3001/api/chart/birth-chart', json={
  'date': '1994-03-01',
  'time': '14:28:00',
  'latitude': 40.7128,
  'longitude': -74.0060
})
chart = response.json()
print(chart['planets'])
```

See [examples/http-api-examples.md](examples/http-api-examples.md) for examples in 10+ languages.

---

## API Endpoints

```bash
GET  /api/health
POST /api/chart/birth-chart
POST /api/chart/transits
POST /api/chart/synastry
GET  /api/locations?search=London
```

Full reference: [SERVER_API.md](SERVER_API.md)

---

## Configuration

```bash
cp .env.example .env
# Edit .env for your setup
```

Common settings:

```bash
PORT=3001
NODE_ENV=development
LOG_LEVEL=INFO          # DEBUG, INFO, WARN, ERROR
CORS_ORIGIN=*
CACHE_ENABLED=true
```

---

## Error Handling

```javascript
import { validateBirthChartData } from './astrology/core/validator.js';
import { ValidationError, CalculationError } from './astrology/core/errors.js';

try {
  const data = validateBirthChartData(userInput);
  const chart = calculateBirthChart(data);
  return chart;
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(`Invalid ${error.field}: ${error.message}`);
  } else if (error instanceof CalculationError) {
    console.error('Calculation failed:', error.operation);
  }
}
```

---

## Docs

- [QUICKSTART.md](QUICKSTART.md) — bare minimum to get running
- [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) — full technical reference
- [ARCHITECTURE.md](ARCHITECTURE.md) — how the codebase is structured
- [SERVER_API.md](SERVER_API.md) — API endpoint reference
- [SWISS_EPHEMERIS_SETUP.md](SWISS_EPHEMERIS_SETUP.md) — accuracy and licensing
