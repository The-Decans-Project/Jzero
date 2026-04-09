# Jzero Astrology Module

Core calculation library for Jzero. Handles all astronomical math — planetary positions, house systems, transits, synastry, and progressions.

## Structure

```
astrology/
├── core/                    # Fundamental calculations
│   ├── calculator.js        # Birth chart aggregator
│   ├── swiss-ephemeris.js   # Swiss Ephemeris wrapper (primary accuracy)
│   ├── ephemeris.js         # CSV data interpolation (fallback)
│   ├── planets.js           # Planetary position calculations
│   ├── houses.js            # House system calculations
│   ├── julianDay.js         # Julian Day & time system conversions
│   ├── time-corrections.js  # ΔT, DST, timezone handling
│   ├── errors.js            # Custom error classes
│   ├── validator.js         # Input validation
│   ├── logger.js            # Structured logging
│   └── config.js            # Configuration management
├── calculations/            # Higher-level astrological techniques
│   ├── houses.js            # House system selection
│   ├── transits.js          # Current & future transits
│   ├── synastry.js          # Chart comparison & compatibility
│   └── progressions.js      # Secondary progressions, solar arcs, returns
├── utilities/               # Helpers
│   ├── geolocation.js       # City database (~100 cities) + coordinate tools
│   └── chart-database.js    # In-memory chart storage
└── index.js                 # Re-exports everything
```

## Accuracy

Calculations use **Swiss Ephemeris** as the primary source (±0.0001°). A CSV interpolation fallback is included for environments where Swiss Ephemeris is unavailable (±0.1°).

## Usage

```javascript
import { calculateBirthChart } from './core/calculator.js';
import { getAllPlanetPositions, getHouses } from './core/swiss-ephemeris.js';
import { calculateSynastry } from './calculations/synastry.js';
import { calculateSecondaryProgression } from './calculations/progressions.js';
import { searchCities } from './utilities/geolocation.js';

// Or import everything at once
import { calculateBirthChart, longitudeToZodiac, searchCities } from './index.js';
```

See the [examples/](../examples/) directory for working code.
