# Jzero

Open-source astrology calculations powered by Swiss Ephemeris.

## The Story

I couldn't find what I wanted, so I built it. Now I want to give back.

Jzero is a personal project created to provide accurate, open-source astrology calculations. It uses Swiss Ephemeris (±0.0001° accuracy) to calculate birth charts, transits, synastry, and planetary positions.

## Quick Start

```bash
git clone https://github.com/The-Decans-Project/Jzero.git
cd Jzero
npm install
node examples/basic-birth-chart.js
```

For Swiss Ephemeris integration, see [SWISS_EPHEMERIS_SETUP.md](SWISS_EPHEMERIS_SETUP.md).

## Use In Your Stack

Jzero is **language and framework agnostic**. Choose your approach:

### Option 1: Direct Integration (JavaScript/Node.js)
```javascript
import { calculateBirthChart } from './astrology/index.js';
const chart = calculateBirthChart({ year: 2000, month: 1, day: 1, ... });
```

### Option 2: HTTP API (Any Language)
```bash
npm run dev   # Starts API on localhost:3001
```

Then from **Python, Java, C#, Go, Rust, etc.**:
```python
import requests
response = requests.post('http://localhost:3001/api/chart/birth-chart', json={...})
```

See [examples/http-api-examples.md](examples/http-api-examples.md) for code examples in 10+ languages.

### Option 3: Fork It
MIT licensed. Port it to any language you like.

## What It Does

- Birth chart calculation (planetary positions + house cusps)
- Current and natal transits
- Synastry / chart comparison with compatibility scoring
- Four house systems: Placidus, Porphyry, Whole Sign, Equal
- Accurate time zone and DST handling
- Julian Day conversions with ΔT corrections

## Full-Stack Web Application

Jzero includes a production-ready web application with React frontend and Express API.

```bash
npm run dev:setup   # Install all dependencies
npm run dev:full    # Start API + frontend

# Frontend: http://localhost:3000
# Backend:  http://localhost:3001/api
```

See [FRONTEND_SETUP.md](FRONTEND_SETUP.md) and [SERVER_API.md](SERVER_API.md) for details.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/chart/birth-chart` | Full birth chart |
| POST | `/api/chart/transits` | Planetary transits |
| POST | `/api/chart/synastry` | Chart comparison |
| GET | `/api/locations?search=...` | City search |

See [SERVER_API.md](SERVER_API.md) for full request/response documentation.

## Architecture

Three-tier modular structure:

```
┌─────────────────────────────────────────┐
│    Applications (Web UI, API, Tools)    │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────┴──────────────────────┐
│  High-Level Calculations                │
│  (Transits, Progressions, Synastry)     │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────┴──────────────────────┐
│  Core Calculations                      │
│  (Swiss Ephemeris, House Systems, Time) │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────┴──────────────────────┐
│  Utilities (Geolocation, Database)      │
└─────────────────────────────────────────┘
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed technical design.

## Calculation Accuracy

| Component | Accuracy | Valid Range | Source |
|-----------|----------|-------------|--------|
| Julian Day | ±0.001 sec | -4000 to +8000 | NASA ΔT polynomial |
| Planetary positions | ±0.0001° | 1950-2050 | Swiss Ephemeris |
| House cusps | ±0.01° | Any latitude | Placidus algorithm |
| Time zones | Exact | Any location | IANA database |

## Examples

### Calculate a Birth Chart
```javascript
import { dateToJulianDayTT, getAllPlanetPositions, getHouses, longitudeToZodiac } from './astrology/index.js';

const jd = dateToJulianDayTT(1994, 3, 1, 14, 28, 0);
const planets = getAllPlanetPositions(jd.jd_tt);
const houses = getHouses(jd.jd_tt, 40.7128, -74.0060, 'P');

console.log(`Ascendant: ${longitudeToZodiac(houses.ascendant).sign}`);
```

### Get Current Transits
```javascript
import { getTransits } from './astrology/calculations/transits.js';
const now = getTransits(new Date());
console.log(`Moon: ${now.Moon.longitude}°`);
```

### Compare Two Charts (Synastry)
```javascript
import { calculateSynastry } from './astrology/calculations/synastry.js';
const result = calculateSynastry(chart1Planets, chart2Planets);
console.log(result.summary);
```

## Documentation

- [QUICKSTART.md](QUICKSTART.md) — Get running in 5 minutes
- [ARCHITECTURE.md](ARCHITECTURE.md) — System design and module responsibilities
- [SERVER_API.md](SERVER_API.md) — REST API reference
- [SWISS_EPHEMERIS_SETUP.md](SWISS_EPHEMERIS_SETUP.md) — Swiss Ephemeris installation
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) — Deploy to production
- [CONTRIBUTING.md](CONTRIBUTING.md) — How to contribute
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) — Community standards

## Getting Involved

- Have ideas? [Create an issue](https://github.com/The-Decans-Project/Jzero/issues)
- Want to contribute? See [CONTRIBUTING.md](CONTRIBUTING.md)
- Questions? [Start a discussion](https://github.com/The-Decans-Project/Jzero/discussions)

## Tech Stack

- **Language**: JavaScript (ES6+, pure functions, ESM)
- **Ephemeris**: Swiss Ephemeris
- **Runtime**: Node.js >= 18
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Express.js
- **License**: MIT

## License

MIT — see [LICENSE](LICENSE). Commercial use permitted and encouraged.

**Note**: Swiss Ephemeris has its own license for commercial use. See [SWISS_EPHEMERIS_SETUP.md](SWISS_EPHEMERIS_SETUP.md) and [LICENSING.md](LICENSING.md) for details.

## Acknowledgments

- [Swiss Ephemeris](https://www.astro.com/swisseph/) — Professional astronomical calculations
- Jean Meeus — *Astronomical Algorithms* (fundamental reference)
- IANA — Timezone database

## Support

If Jzero helps you build something, consider buying me a coffee.

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-☕-yellow)](https://www.buymeacoffee.com/thedecanproject)
