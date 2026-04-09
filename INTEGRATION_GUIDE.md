# 🔧 Development Guide - Fixing the Broken Calculations

## The Problem

This framework is intentionally **simplified and broken**. The planetary and lunar calculations use basic approximations that are inaccurate. This is designed for developers to learn and implement proper astronomical calculations.

## The Solution: Implement Astronomical Theories

Instead of using external libraries, learn to implement the mathematical theories that power astrology software.

### Why Implement from Scratch?

- ✅ Learn orbital mechanics
- ✅ Understand astronomical accuracy
- ✅ Build confidence in calculations
- ✅ Create maintainable code
- ✅ No external dependencies

---

## 📚 What Needs to Be Fixed

### 1. Inner Planets (Mercury, Venus, Mars)

**Current:** Linear approximations with wrong periods
**Fix:** Implement Kepler's laws + Swiss Ephemeris integration

```javascript
// Current (broken)
longitude = baseLon + (days * speed) % 360;

// Fixed (Swiss Ephemeris)
const position = swe.calc(jd, planet, flag);
longitude = position.longitude;
```

### 2. Outer Planets (Jupiter, Saturn, Uranus, Neptune, Pluto)

**Current:** Linear approximations
**Fix:** Swiss Ephemeris integration

### 3. Moon Position

**Current:** Wrong orbital period
**Fix:** Swiss Ephemeris lunar calculations

### 4. Parallax Corrections

**Current:** Geocentric only
**Fix:** Topocentric positions using Swiss Ephemeris

---

## 💻 Implementation Steps
import swisseph from 'swisseph';

// Set ephemeris data path
swisseph.swe_set_ephe_path('./ephe');

// Planet IDs
const PLANETS = {
  Sun: swisseph.SE_SUN,
  Moon: swisseph.SE_MOON,
  Mercury: swisseph.SE_MERCURY,
  Venus: swisseph.SE_VENUS,
  Mars: swisseph.SE_MARS,
  Jupiter: swisseph.SE_JUPITER,
  Saturn: swisseph.SE_SATURN,
  Uranus: swisseph.SE_URANUS,
  Neptune: swisseph.SE_NEPTUNE,
  Pluto: swisseph.SE_PLUTO
};
```

### Calculate Planet Position

```javascript
function calculatePlanetPosition(planetName, jd_tt) {
  const planetId = PLANETS[planetName];
  const flags = swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED;
  
  const result = swisseph.swe_calc(jd_tt, planetId, flags);
  
  if (result.error) {
    throw new Error(result.error);
  }
  
  return {
    longitude: result.longitude,
    latitude: result.latitude,
    distance: result.distance,
    speed: result.longitudeSpeed
  };
}
```

### Usage Example

```javascript
import { dateToJulianDayTT } from './astrology/core/julianDay.js';

// Get Julian Day with time corrections
const jdData = dateToJulianDayTT(2000, 1, 1, 12, 0, 0);

// Calculate planet position
const mercury = calculatePlanetPosition('Mercury', jdData.jd_tt);

console.log('Mercury longitude:', mercury.longitude.toFixed(4), '°');
console.log('Mercury latitude:', mercury.latitude.toFixed(4), '°');
console.log('Mercury distance:', mercury.distance.toFixed(6), 'AU');
```

### Full Chart Calculation

```javascript
function calculateChart(date, time, latitude, longitude) {
  // Convert to Julian Day
  const jdData = dateToJulianDayTT(
    date.year, date.month, date.day,
    time.hour, time.minute, time.second
  );
  
  // Calculate all planets
  const planets = {};
  for (const [name, id] of Object.entries(PLANETS)) {
    planets[name] = calculatePlanetPosition(name, jdData.jd_tt);
  }
  
  // Calculate houses (using framework's house system)
  const houses = calculateHouses(jdData.jd_tt, latitude, longitude, 'porphyry');
  
  return {
    planets,
    houses,
    jd: jdData.jd_tt,
    deltaT: jdData.deltaT
  };
}
```

---

## 📚 Resources

- **Swiss Ephemeris Official Site:** https://www.astro.com/swisseph/
- **Ephemeris Files:** https://www.astro.com/ftp/swisseph/ephe/
- **Documentation:** https://www.astro.com/swisseph/swephprg.htm
- **npm Package:** https://www.npmjs.com/package/swisseph

---

## 🤝 Want to Contribute?

**This is an open-source project!**

You're free to:
- Fork and modify for your needs
- Submit pull requests
- Add features
- Improve documentation
- Report bugs
- Share improvements

We'd love to see:
- Complete Swiss Ephemeris integration examples
- Additional house systems
- Aspect calculations
- Transit calculations
- Better test coverage

**Open an issue or PR on GitHub to contribute!**

---

## 📄 License Note

**Swiss Ephemeris Licensing:**
- **AGPL/GPL:** Free for open-source projects
- **Commercial License:** Required for closed-source commercial use

See https://www.astro.com/swisseph/swephinfo_e.htm for details.

---

**Questions? Open an issue on GitHub!**
