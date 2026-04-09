# Architecture & Technical Design

This document describes the system design, module organization, and technical decisions in Jzero.

## Core Philosophy

**Transparent. Modular. Accurate.**

Jzero is designed to be:
1. **Understandable** - Each calculation is traceable to astronomical literature
2. **Modular** - Components work independently and compose cleanly
3. **Accurate** - Professional-grade calculations (±0.1°-1° depending on component)
4. **Maintainable** - Clear separation of concerns, minimal dependencies

## System Architecture

```
┌─────────────────────────────────────────────────┐
│           Application Layer                     │
│  (Web UI, API, CLI tools, integrations)        │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────┐
│         High-Level Calculations                 │
│  (Birth charts, transits, progressions)         │
├──────────────┬──────────────┬──────────────┐
│              │              │              │
└──────────────┴──────────────┴──────────────┘
  astrology/calculations/           
├── transits.js        → Transit interpretation
├── progressions.js    → Secondary progressions  
├── synastry.js        → Synastry analysis
└── houses.js          → House system selection
                     │
┌────────────────────┴────────────────────────────┐
│         Core Calculations                       │
│  (Fundamental astronomical algorithms)          │
├─────────────────┬──────────────┬───────────────┐
│                 │              │               │
└─────────────────┴──────────────┴───────────────┘
  astrology/core/
├── julianDay.js         → Time system (UT, TT, LST)
├── planets.js           → VSOP87 planetary positions
├── houses.js            → House systems (Placidus, etc.)
├── ephemeris.js         → CSV data interpolation
├── time-corrections.js  → ΔT, DST handling
└── calculator.js        → Aggregator
                     │
┌────────────────────┴────────────────────────────┐
│         Utilities                               │
│  (Helper functions and data)                    │
├──────────────┬──────────────┬──────────────┐
│              │              │              │
└──────────────┴──────────────┴──────────────┘
  astrology/utilities/
├── geolocation.js       → City database, timezones
├── chart-database.js    → Chart storage/retrieval
└── time-utils.js        → Timezone helpers
```

## Module Responsibilities

### Core Calculations Layer (`astrology/core/`)

#### 1. **julianDay.js** — Temporal Reference System
**Purpose**: Convert between calendar dates and Julian Day numbers with astronomical corrections.

**Key Functions**:
- `dateToJulianDayTT(year, month, day, hour, minute, second)` → Terrestrial Time JD
- `calculateDeltaT(jd)` → ΔT correction (UTC → TT)
- `calculateLST(jd, longitude)` → Local Sidereal Time

**Technical Details**:
- Uses J2000.0 as reference epoch (JD 2451545.0)
- Implements ΔT polynomial from NASA (accurate to ~0.1 second)
- Handles leap seconds and historical calendar changes

**Why This Matters**: All astronomical calculations depend on precise time. Small errors here propagate through all other calculations.

#### 2. **planets.js** — Planetary Positions  
**Purpose**: Calculate planetary geocentric ecliptic coordinates.

**Algorithm**: VSOP87 (Variations Séculaires des Orbites Planétaires)
- Series expansion convergent to ~10⁻¹¹ AU accuracy
- Valid from -3000 to +3000
- Describes heliocentric positions only—geocentric requires Earth position

**Key Functions**:
- `calculatePlanetPosition(planet, jd)` → {longitude, latitude, distance}
- Covers: Sun ☉, Moon ☾, Mercury ☿, Venus ♀, Mars ♂, Jupiter ♃, Saturn ♄, Uranus ♅, Neptune ♆, Pluto ♇

**Implementation Strategy**:
- Meeus' "Astronomical Algorithms" polynomial coefficients
- Terrestrial Time (TT) input for consistency
- Returns ecliptic coordinates for astrology conventions

#### 3. **houses.js** — House Systems & Cusps
**Purpose**: Calculate zodiac divisions and interpretive framework.

**Supported Systems**:
1. **Placidus** - Divides zodiac by time above horizon (standard Western astrology)
2. **Porphyry** - Quadrant trisection (ancient method)
3. **Whole Sign** - 30° sign divisions (modern revival)
4. **Equal House** - 30° divisions from Ascendant

**Algorithm**: Placidus (most complex)
- Given LST and latitude, find ecliptic degree at each hour above horizon
- Requires iterative solving (Meeus Chapter 13)
- Output: 12 house cusps in ecliptic longitude

**Application**: House placement determines life area interpretation in birth charts.

#### 4. **time-corrections.js** — Time System Conversions
**Purpose**: Handle timezone, daylight saving, and historical time variations.

**Key Corrections**:
- ΔT (Delta T) — Dynamic Time vs UTC offset
- DST rules — Historical DST transitions
- Timezone offsets — Geographic + historical
- Calendar transitions — Julian to Gregorian

**Why Complex**: Different countries adopted Gregorian calendar at different times; historic DST rules vary.

#### 5. **ephemeris.js** — Data Interpolation
**Purpose**: Load and interpolate high-resolution positional data.

**Data Sources**:
- CSV format: JD, planetary positions, date
- Coverage: 1950-2050 (100 years of data)
- Resolution: Daily for Sun/inner planets, 2-day for outer

**Interpolation Method**:
- Linear interpolation between known points
- Lagrange polynomial for smoother curves (optional upgrade)
- Matches CSV accuracy ±0.01° for intermediate dates

### Calculation Layers (`astrology/calculations/`)

#### **transits.js** — Current Planetary Positions
Returns where planets are *now* for transit interpretations.

```javascript
const currentPlanetPositions = getTransits(Date.now());
// Used for: "Jupiter is transiting my 7th house—relationships"
```

#### **progressions.js** — Secondary Progressions
Advance birth chart at 1 day/year rate for analyzing development.

```javascript
const progressedChart = calculateSecondaryProgressions(birthJD, currentDate);
// Used for: "My progressed Moon entered Scorpio—time for intensity"
```

#### **synastry.js** — Composite Charts & Compatibility
Compare two charts for relationship dynamics.

```javascript
const synastry = calculateSynastry(chartA, chartB);
// Returns: overlays, composites, aspect connections
```

### Utility Layer (`astrology/utilities/`)

#### **geolocation.js** — Location Database
~100 cities with coordinates and timezone rules.

```javascript
const location = getLocation("New York");
// Returns: { lat: 40.7128, lon: -74.0060, timezone: "America/New_York" }
```

#### **chart-database.js** — Data Persistence
Stores and retrieves calculated charts for reanalysis.

## Data Flow: Birth Chart Calculation

```
Input: { year, month, day, hour, minute, location }
   │
   ├─→ dateToJulianDayTT() ────→ Temporal reference (JD_TT)
   │
   ├─→ getLocation() ────────────→ { lat, lon, timezone }
   │
   ├─→ calculatePlanetPosition() → Planetary positions per sign
   │
   ├─→ calculateHouses() ────────→ Zodiac divisions (12 houses)
   │
   └─→ Chart Object:
       {
         timestamp: { jd, deltaT },
         location: { lat, lon, timezone },
         planets: { Sun, Moon, Mercury, ... },
         houses: { ... },
         angles: { Ascendant, MC, Descendant, IC }
       }
```

## Accuracy Tiers

| Component | Accuracy | Source | Use Case |
|-----------|----------|--------|----------|
| **Julian Day** | ±0.001 sec | ΔT polynomial | Professional |
| **Planetary positions** | ±0.1° | VSOP87 | Astrology standard |
| **House cusps** | ±0.01° | Placidus algorithm | Professional |
| **Moon positions** | ±0.1° | VSOP87 + Meeus | Standard |
| **Time zones** | ±0 min | Database | Exact |

## Design Decisions

### 1. **ES6 Modules Over CommonJS**
- Cleaner import/export syntax
- Tree-shaking support for smaller bundles
- Future-proof (ES standard)

### 2. **Functional Over Object-Oriented**
- Pure functions with no side effects
- Easier to test and reason about
- Composable calculations

### 3. **VSOP87 Over Swiss Ephemeris**
- Pure algorithmic (no binary dependencies)
- Transparent source (published literature)
- MIT-compatible (no license restrictions)
- Trade-off: Slightly lower accuracy for planets beyond Saturn

### 4. **CSV Data + Interpolation Over Full Database**
- Smaller memory footprint
- Platform-independent (text format)
- Can be extended to full ephemeris data
- Allows both data-driven and algorithmic approaches

### 5. **Terrestrial Time (TT) as Internal Standard**
- Consistent across all calculations
- Handles relativistic corrections automatically
- Matches astronomical literature conventions
- Conversion to UTC handled at boundaries

## Performance Considerations

### Calculation Performance
```javascript
// Single calculation: ~1-5ms
const pos = calculatePlanetPosition('Moon', jd);

// Full birth chart: ~20-50ms
const chart = calculateBirthChart(jdData, lat, lon);

// Large analysis (100 years of transits): ~500-1000ms
```

### Memory
- Core module (no data): ~50KB minified
- With ephemeris CSVs: ~2MB
- Browser: Loads on demand for smaller footprint

### Optimization Opportunities
- Cache frequently calculated positions
- Parallelize multi-planet calculations
- Pre-compute house cusps for common latitudes
- Use Simd.js for vectorized calculations

## Extension Points

### Adding a New House System
1. Add calculation function to `houses.js`
2. Export from `astrology/index.js`  
3. Update house selection in calculations

### Adding a New Planet
1. Add VSOP87 coefficients to `planets.js`
2. Extend `calculatePlanetPosition()` switch statement
3. Update type definitions and documentation

### Integrating Swiss Ephemeris
1. Wrapper module: `astrology/core/swiss-ephemeris.js`
2. Conditional import based on environment
3. Fallback to VSOP87 if unavailable

**⚠️ Licensing Note**: Swiss Ephemeris is NOT MIT licensed. Commercial use requires a separate license. See [LICENSING.md](LICENSING.md) for details.

## Testing Strategy

### Unit Tests
- Individual function accuracy against reference data
- Edge cases (poles, date line, extreme dates)
- Time zone transitions and DST

### Integration Tests
- Full birth chart calculations
- Compare against known software (Swiss Ephemeris, etc.)
- Chart examples with historical accuracy verification

### Accuracy Tests
- Known planetary positions from NASA JPL
- Historical birth times from biographical records
- Regress for consistency across versions

## Future Architecture

### Phase 1 (Current)
- Core calculations solidified
- Modular house systems
- Community contributions welcome

### Phase 2
- Advanced calculations (aspects, asteroid positions)
- UI/visualization layer
- API server for web integration

### Phase 3
- Professional accuracy (Swiss Ephemeris integration)
- Database expansion (10,000+ cities)
- Performance optimization

---

**Questions about the architecture?** Open a discussion in GitHub Discussions.
