# 🌟 AstroCalc - Open Source Astrology Framework

**A minimal, honest astrology calculation framework for developers.**

## 🎯 What This Is

This is **infrastructure code** for astrology apps - the boring but necessary stuff:
- Time conversions (UTC/TT with ΔT correction)
- Julian Day calculations (J2000-calibrated)
- House system implementations (Porphyry, Whole Sign, Equal)
- Chart angle calculations (ASC, MC, DSC, IC)
- Basic zodiac conversions

**This is NOT a complete astrology app.** It's a starting point.

---

## 📦 What's Included

### ✅ Working Components

1. **Time Systems** (`astrology/core/julianDay.js`, `astrology/core/time-corrections.js`)
   - Julian Day conversions
   - J2000.0 reference epoch (JD 2451545.0)
   - ΔT correction (TT-UTC)
   - Timezone handling
   - DST support

2. **House Systems** (`astrology/core/houses.js`)
   - Porphyry (quadrant trisection)
   - Whole Sign (ancient method)
   - Equal House (30° divisions)

3. **Chart Angles** (`astrology/core/houses.js`)
   - Ascendant (ASC)
   - Midheaven (MC)
   - Descendant (DSC)
   - Imum Coeli (IC)

4. **Ephemeris Data** (`data/`)
   - CSV files for all major planets
   - Date range: 1950-2050
   - Includes: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto

5. **Geolocation** (`src/geolocation.js`)
   - City database
   - Coordinate formatting
   - Timezone helpers

### ⚠️ Limitations

**Planetary Position Data:**
- CSV files contain **sign ingress data** (when planets change signs)
- NOT daily positions for all planets
- You'll need to:
  - Add interpolation between ingresses (low accuracy)
  - OR integrate Swiss Ephemeris (recommended)


**Moon:**
- Includes simplified calculation
- Accuracy: ±1-2° (adequate for basic charts)

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repo
git clone <your-repo>
cd astrocalc

# No build needed - pure ES6 modules
# Just serve with any static server
python3 -m http.server 8000
```

### Basic Usage

```javascript
import { dateToJulianDayTT } from './astrology/core/julianDay.js';
import { calculateHouses } from './astrology/calculations/houses.js';

// Calculate Julian Day with time corrections
const jdData = dateToJulianDayTT(2000, 1, 1, 12, 0, 0);
console.log('JD (TT):', jdData.jd_tt);
console.log('ΔT:', jdData.deltaT, 'seconds');

// Calculate house cusps
const houses = calculateHouses(
  jdData.jd_tt,
  41.12,  // latitude
  -73.41, // longitude
  'porphyry'
);

console.log('ASC:', houses.ascendant);
console.log('MC:', houses.mc);
console.log('Houses:', 
## 📁 Project Structure

```
astrocalc/
├── src/
│   ├── julianDay.js         # Time conversions
│   ├── time-corrections.js  # ΔT, UTC/TT
│   ├── houses.js            # House systems
│   ├── geolocation.js       # Location helpers
│   ├── planets.js           # Zodiac conversions
│   └── calculator.js        # Basic chart structure
├── data/
│   ├── Ephem_Sun_1950_2050.csv
│   ├── Ephem_Moon_1950_2050.csv
│   └── ... (all planets)
├── public/
│   ├── index.html           # Basic web interface
│   └── app.js               # Frontend code
└── README.md
```

---

## 🎓 What You'll Learn

By using/extending this framework, you'll understand:
- How Julian Day calculations work
- Why ΔT correction matters
- How house systems differ mathematically
- The structure of astrological calculations
- How to integrate ephemeris data

---

## 🤝 Contributing

This is a **community starting point**. Contributions welcome:

- Add Swiss Ephemeris integration
- Implement additional house systems
- Add aspect calculation improvements
- Create better documentation
- Add tests
- Fix bugs

---

## ⚠️ Important Notes

### Accuracy

**Current planetary positions:**
- Based on CSV ingress data only
- NOT suitable for professional astrology
- Good for: learning, testing, development
- Bad for: real client charts

**What's accurate:**
- Time conversions ✓
- House calculations ✓
- Angle calculations ✓
- Framework structure ✓

### Date Range

**Ephemeris Data:** 1950-2050 (100 years)

For dates outside this range:
- Add more ephemeris data
- Use Swiss Ephemeris
- Use online APIs

---

## 📖 Example: Adding Swiss Ephemeris

```javascript
// Install: npm install swisseph
import swisseph from 'swisseph';

// Set ephemeris path
swisseph.swe_set_ephe_path('./ephe');

// Calculate planet position
function getPlanetPosition(planetId, jd) {
  const flags = swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED;
  const result = swisseph.swe_calc_ut(jd, planetId, flags);
  
  return {
    longitude: result.longitude,
    latitude: result.latitude,
    distance: result.distance
  };
}

// Use it
const jd = 2449413.311805;
const mercury = getPlanetPosition(swisseph.SE_MERCURY, jd);
console.log('Mercury:', mercury.longitude, '°');
```

---

## 📜 License

MIT License - Free to use, modify, and distribute.

---

## 🎯 Philosophy

This project believes in:
- **Honesty**: Clear about limitations
- **Education**: Teach how calculations work
- **Community**: Open source, collaborative
- **Quality**: Accurate time math, clean code
- **Extensibility**: Easy to add features

**We give you the foundation. You build the calculator.**

---

## 🙏 Acknowledgments

- Time correction formulas: Espenak-Meeus 2006
- House systems: Classical astronomical formulas
- Ephemeris data: Provided CSV files (1950-2050)

---

## ❓ FAQ

**Q: Is this suitable for professional astrology?**
A: Not out of the box. Add Swiss Ephemeris or another accurate data source first.

**Q: What's the accuracy of current planetary positions?**
A: Based on sign ingress data only - not accurate enough for charts. This is a FRAMEWORK.

**Q: Can I use this in production?**
A: Yes, after adding accurate planetary position calculations (Swiss Ephemeris recommended).

**Q: Why 1950-2050 only?**
A: Balance between data size and usefulness. Add more CSV data or use Swiss Ephemeris for extended range.

---

**Built with 💜 for the astrology developer community**

*"Start with a solid foundation, build what you need."*
