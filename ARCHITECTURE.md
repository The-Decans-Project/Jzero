# Architecture & Technical Design

## Core Philosophy

**Transparent. Modular. Accurate. Language-Agnostic.**

Jzero is designed to be:
1. **Understandable** — Each calculation is traceable to its source
2. **Modular** — Components work independently and compose cleanly
3. **Accurate** — Swiss Ephemeris for primary calculations (±0.0001°), CSV interpolation as fallback
4. **Maintainable** — Clear separation of concerns, minimal dependencies
5. **Accessible** — Use from JavaScript directly, or from any language via HTTP API

## System Architecture

```
┌─────────────────────────────────────────────────┐
│           Application Layer                     │
│  (Web UI, API, CLI tools, integrations)         │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────┐
│         High-Level Calculations                 │
│  astrology/calculations/                        │
│  ├── transits.js       Transit interpretation   │
│  ├── progressions.js   Secondary progressions   │
│  ├── synastry.js       Chart comparison         │
│  └── houses.js         House system selection   │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────┐
│         Core Calculations                       │
│  astrology/core/                                │
│  ├── swiss-ephemeris.js  Primary accuracy       │
│  ├── ephemeris.js        CSV fallback           │
│  ├── planets.js          Planetary positions    │
│  ├── houses.js           House systems          │
│  ├── julianDay.js        Time conversions       │
│  ├── time-corrections.js ΔT, DST               │
│  └── calculator.js       Birth chart aggregator │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────┐
│         Utilities                               │
│  astrology/utilities/                           │
│  ├── geolocation.js    City database            │
│  └── chart-database.js Chart storage            │
└─────────────────────────────────────────────────┘
```

## Module Responsibilities

### `astrology/core/`

#### `swiss-ephemeris.js` — Primary Accuracy
Swiss Ephemeris wrapper for professional-grade planetary positions.
- Accuracy: ±0.0001°
- Valid range: 1900–2100
- Used when the `swisseph` npm package is available

#### `ephemeris.js` — CSV Fallback
CSV-based planetary position lookup with linear interpolation.
- Accuracy: ±0.1°
- Coverage: 1950–2050
- Used automatically when Swiss Ephemeris is not available

#### `julianDay.js` — Time Reference System
Converts between calendar dates and Julian Day numbers.
- `dateToJulianDayTT(year, month, day, hour, minute, second)` → JD_TT
- `calculateDeltaT(jd)` → ΔT correction (UTC → TT)
- `calculateLST(jd, longitude)` → Local Sidereal Time
- ΔT polynomial from NASA (±0.1 second accuracy)

#### `planets.js` — Planetary Positions
Geocentric ecliptic coordinates for all 10 bodies via Swiss Ephemeris.
- `calculatePlanetPosition(planet, jd)` → {longitude, latitude, distance}
- `calculateAllPlanets(jd)` → all planets at once
- `longitudeToZodiac(longitude)` → sign + degree

#### `houses.js` — House Systems
Calculates zodiac house divisions.
- Placidus (default) — time-above-horizon method
- Porphyry — quadrant trisection
- Whole Sign — 30° sign divisions
- Equal House — 30° divisions from Ascendant

#### `time-corrections.js` — Time Conversions
- ΔT (Dynamic Time vs UTC)
- DST detection
- UTC/TT conversion

#### `calculator.js` — Birth Chart Aggregator
Orchestrates a complete birth chart: Julian Day → planets → houses → angles.

### `astrology/calculations/`

#### `transits.js`
Current planet positions vs. natal chart. Returns aspects and interpretation.

#### `progressions.js`
- `calculateSecondaryProgression(natalChart, years)` — 1 day = 1 year
- `calculateSolarArc(natalChart, years)`
- `calculateTertiaryProgression(natalChart, months)`
- `calculateSolarReturn(natalChart, year)`

#### `synastry.js`
- `calculateSynastry(chart1, chart2)` — inter-aspects, composite, compatibility scores
- `calculateCompositeChart(chart1, chart2)` — midpoint chart
- `findRelationshipThemes(synastry)` — key relationship patterns

#### `houses.js`
House system selector that delegates to the appropriate algorithm in core.

### `astrology/utilities/`

#### `geolocation.js`
~100 major cities with coordinates and IANA timezone names.
- `searchCities(query)` — partial name match
- `findClosestCity(lat, lon)` — nearest city by coordinates
- `getCityByName(name)` — exact name lookup

#### `chart-database.js`
In-memory CRUD for calculated charts (save, load, search, delete).

---

## Data Flow: Birth Chart

```
Input: { year, month, day, hour, minute, location }
   │
   ├─→ dateToJulianDayTT()        → JD_TT (Terrestrial Time)
   ├─→ getLocation() / coordinates → { lat, lon, timezone }
   ├─→ getAllPlanetPositions(jd)   → planetary longitudes/signs
   ├─→ getHouses(jd, lat, lon)    → 12 house cusps + angles
   │
   └─→ Chart: { jd, planets, houses, angles }
```

---

## Accuracy

| Component | Accuracy | Source |
|-----------|----------|--------|
| Julian Day | ±0.001 sec | NASA ΔT polynomial |
| Planetary positions | ±0.0001° | Swiss Ephemeris |
| CSV fallback | ±0.1° | Interpolation |
| House cusps | ±0.01° | Placidus algorithm |
| Time zones | Exact | IANA database |

---

## Design Decisions

### ES6 Modules over CommonJS
- Cleaner import/export syntax
- Tree-shaking support
- Future-proof (ES standard)

### Functional over Object-Oriented
- Pure functions with no side effects
- Easier to test and reason about
- Composable calculations

### Swiss Ephemeris as Primary, CSV as Fallback
- Swiss Ephemeris: ±0.0001° accuracy, professional standard
- CSV fallback: works without native dependencies, ±0.1° accuracy
- The system detects availability and uses the best option automatically

### Terrestrial Time (TT) as Internal Standard
- Consistent across all calculations
- Handles relativistic corrections automatically
- Matches astronomical literature conventions

---

## Extending Jzero

### Add a House System
1. Add calculation to `astrology/core/houses.js`
2. Export from `astrology/index.js`

### Add a Planet or Asteroid
1. Extend `calculatePlanetPosition()` in `astrology/core/planets.js`
2. Swiss Ephemeris supports asteroids, Chiron, lunar nodes

### Add an API Endpoint
1. Add route to `server/api.js`
2. Call calculation functions from `astrology/index.js`
3. See [SERVER_API.md](SERVER_API.md) for response format conventions

---

**Questions?** Open a discussion on [GitHub Discussions](https://github.com/The-Decans-Project/Jzero/discussions).
