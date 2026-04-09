# Quick Start

Get Jzero running in 5 minutes.

## Prerequisites

- Node.js 18+
- Git

## Install

```bash
git clone https://github.com/The-Decans-Project/Jzero.git
cd Jzero
npm install
```

## Try It

Run an example:

```bash
node examples/basic-birth-chart.js
```

## Start the API Server

```bash
npm run dev
# API running at http://localhost:3001
```

Test it:

```bash
curl http://localhost:3001/api/health
```

## Start the Full Stack (API + Frontend)

```bash
npm run setup       # installs frontend dependencies too
npm run dev:full    # starts both servers

# Frontend: http://localhost:3000
# API:      http://localhost:3001
```

## Use in Your Code

```javascript
import { calculateBirthChart } from './astrology/core/calculator.js';

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

## Licensing Note

Jzero is MIT licensed. If you use Swiss Ephemeris for commercial purposes, its own license terms apply separately. See [SWISS_EPHEMERIS_SETUP.md](SWISS_EPHEMERIS_SETUP.md).

## Next Steps

- [examples/](examples/) — more working code samples
- [SERVER_API.md](SERVER_API.md) — full API reference
- [ARCHITECTURE.md](ARCHITECTURE.md) — how it's structured
- [CONTRIBUTING.md](CONTRIBUTING.md) — how to contribute
