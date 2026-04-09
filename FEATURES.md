# Jzero Features

## Core Calculations

### Planetary Positions
All 10 bodies calculated with Swiss Ephemeris accuracy:
- Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto

Per planet: zodiac sign, degree within sign, absolute longitude, ecliptic latitude, distance (AU), speed (deg/day), retrograde status.

### Chart Angles
- Ascendant (ASC)
- Midheaven (MC)
- Descendant (DSC)
- Imum Coeli (IC)

### House Systems
- Placidus (default)
- Porphyry
- Whole Sign
- Equal

### Aspects
- Conjunction (0° ± 8°)
- Sextile (60° ± 4°)
- Square (90° ± 8°)
- Trine (120° ± 8°)
- Opposition (180° ± 8°)
- Semi-sextile (30° ± 2°)
- Quincunx (150° ± 2°)

Includes: aspect name, orb, applying/separating status.

### Time Systems
- UT (Universal Time)
- TT (Terrestrial Time)
- LST (Local Sidereal Time)
- ΔT (Delta T via NASA polynomial)
- DST (Daylight Saving Time detection)
- Full IANA timezone database

### Progressions
- Secondary progressions (day-for-a-year)
- Solar arc progressions
- Tertiary progressions (day-for-a-month)
- Solar and lunar returns

### Transits
- Current planet positions vs. natal chart
- Active aspects within orb
- Transit interpretation

### Synastry
- Planet-to-planet inter-aspects
- Composite chart (midpoint method)
- Compatibility scoring (harmony, tension, communication, passion)
- Relationship theme analysis

---

## Web Application

- Birth chart calculator form with validation
- Planetary position table
- SVG zodiac wheel (interactive)
- Current transits viewer
- City/timezone search
- Responsive design (desktop, tablet, mobile)

---

## API

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Health check |
| `POST /api/chart/birth-chart` | Full birth chart |
| `POST /api/chart/transits` | Planetary transits |
| `POST /api/chart/synastry` | Chart comparison |
| `GET /api/locations?search=...` | City search |

---

## Accuracy

| Component | Accuracy | Range |
|-----------|----------|-------|
| Planetary positions | ±0.0001° | 1950-2050 |
| House cusps | ±0.01° | Any latitude |
| Time calculations | ±1 ms | - |

---

## Infrastructure

- Custom error classes with HTTP status codes
- Input validation for all endpoints
- Structured logging (5 levels)
- Environment-based configuration
- Express middleware suite
- CORS, rate limiting, input sanitization
