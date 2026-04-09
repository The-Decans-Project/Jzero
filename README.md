````markdown
# � JZero - Solid Astrology Framework (Needs TLC)

**A decent astrology calculation framework that just needs a little tender loving care.**

This framework has a solid foundation with working time systems, house calculations, and geolocation. The planetary calculations are basic approximations that work but need Swiss Ephemeris integration for professional accuracy.

## ⚡ Quick Start

```bash
# Clone
git clone <your-repo>
cd astrocalc-framework

# Run example - works immediately!
python3 -m http.server 8000
open http://localhost:8000/public/index.html
```

## ✅ What Works (But Is Broken)

**Solid foundation with working components:**

- ✅ **Time Systems** (±1-2° accuracy using J2000/ΔT corrections)
- ✅ **House cusps** (Porphyry, Whole Sign, Equal)
- ✅ **Chart angles** (ASC, MC, DSC, IC)
- ✅ **Geolocation** (city database, coordinates)

**Perfect for:**
- Learning how astrology calculations work
- Building and testing house system logic
- Educational projects
- Prototyping before adding Swiss Ephemeris

## 🚀 Fix and Improve the Calculations

The current calculations are intentionally broken. Here's what needs fixing:

- Replace linear approximations with Kepler's laws
- Add proper orbital elements and Swiss Ephemeris integration
- Implement accurate lunar positions using Swiss Ephemeris
- Add parallax corrections
- Integrate ephemeris data interpolation

See the source code for TODO comments indicating where improvements are needed.

---

## 📦 What This Framework Provides

### ✅ Working Components

1. **Time Systems** (`astrology/core/julianDay.js`, `astrology/core/time-corrections.js`)
   - Julian Day conversions
   - J2000.0 reference epoch (JD 2451545.0)
   - ΔT correction (TT-UTC)
   - Timezone handling
   - DST support

2. **House Systems** (`astrology/calculations/houses.js`)
   - Porphyry (quadrant trisection)
   - Whole Sign (ancient method)
   - Equal House (30° divisions)

3. **Chart Angles** (`astrology/calculations/houses.js`)
   - Ascendant (ASC)
   - Midheaven (MC)
   - Descendant (DSC)
   - Imum Coeli (IC)

4. **Geolocation** (`astrology/utilities/geolocation.js`)
   - City database
   - Coordinate formatting
   - Timezone helpers

### 🔧 Components Needing TLC

1. **Planetary Calculations** (`astrology/core/planets.js`, `astrology/index.js` for convenience)
   - Basic approximations work but need Swiss Ephemeris for accuracy
   - Framework is solid, just needs professional astronomical calculations

2. **Moon Calculations** (`astrology/index.js`)
   - Basic framework exists, needs Swiss Ephemeris integration
   - Structure is good, calculations need improvement

3. **Ephemeris Integration** (`astrology/core/ephemeris.js`)
   - CSV data available and well-structured
   - Ready for Swiss Ephemeris enhancement

### 🎯 What You Can Build Right Now

**Starting from a solid foundation:**

✅ **House System Calculator**
- Calculate Ascendant, MC, and all house cusps
- Compare different house systems
- Educational tools

✅ **Chart Skeleton**
- Basic birth chart structure
- Time and location handling
- Ready for accurate planetary data

❌ **Full Birth Chart Calculator** (needs Swiss Ephemeris)
- Framework exists, but planetary positions need improvement
- Perfect for adding professional astronomical calculations

### 🔧 Development Roadmap

1. **Fix Inner Planets** - Implement proper Kepler orbits for Mercury, Venus, Mars
2. **Add Swiss Ephemeris** - Replace linear approximations with professional astronomical calculations
3. **Implement Lunar Positions** - Accurate Moon positions using Swiss Ephemeris
4. **Ephemeris Interpolation** - Use CSV data for high accuracy
5. **Parallax Corrections** - Topocentric positions for precision
6. **Aspect Calculations** - Add planetary relationships
7. **Chart Rendering** - Visual birth chart display
- Full chart structure with houses and angles
- Moon position included
- Ready to add planets via Swiss Ephemeris

### 🌍 For Other Planets

The included CSV files have **sign ingress data** (when planets change signs) - useful for showing data structure, but not for calculating daily positions.

**For accurate Sun, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto:**
- Integrate Swiss Ephemeris (see `INTEGRATION_GUIDE.md`)
- Takes ~30 minutes
- Industry standard, professional accuracy

---

## 🚀 Basic Usage

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
console.log('Houses:', houses.houses);
```

---

## 📁 Project Structure

```
astrocalc-framework/
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

**This is an open-source project - you're free to work on it!**

Contributions welcome:

- ✨ Swiss Ephemeris integration examples
- ✨ Additional house systems (Placidus, Koch, Regiomontanus)
- ✨ Aspect calculations
- ✨ Transit calculations
- ✨ Progression algorithms
- ✨ Better documentation
- ✨ Test coverage
- ✨ Bug fixes
- ✨ Example applications

**Fork it, improve it, submit a PR!**

This is community infrastructure - make it better for everyone.

---

## 📊 Accuracy & Range

### What's Production-Ready

- ✅ **Moon:** ±1-2° accuracy (good for Moon sign, phase, general position)
- ✅ **Houses:** Professional accuracy (exact calculations)
- ✅ **Angles:** Professional accuracy (ASC, MC, DSC, IC)
- ✅ **Time:** Professional accuracy (ΔT corrections, J2000 calibration)

### Date Range

**Moon Calculator:** Any date (formulas work indefinitely)
**CSV Data:** 1950-2050 (for reference/structure)

### Adding Swiss Ephemeris

- ⭐ **All Planets:** ±0.001° accuracy (professional grade)
- ⭐ **Date Range:** 1800-2399+ (with standard files)
- ⭐ **Speed:** Very fast (local calculations)

See `INTEGRATION_GUIDE.md` for setup.

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

**Built with 💜 for the astrology developer community**

*"Start with a solid foundation, build what you need."*


### J2000 Calibration (Default Base)

If you call the calculator without a date, or pass `{ useJ2000: true }`, the engine computes at the **J2000.0** epoch.

- **Epoch:** J2000.0 (TT)
- **Julian Day (base number):** `2451545.0`

```js
// Example: compute precisely at J2000.0
import { calculateBirthChart } from './astrology/core/calculator.js';

const chart = calculateBirthChart({
  latitude: 0,
  longitude: 0,
  houseSystem: 'porphyry',
  useJ2000: true
});
```
