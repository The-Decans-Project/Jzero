# Swiss Ephemeris

Jzero uses Swiss Ephemeris for accurate planetary calculations (±0.0001°).

## ⚠️ Licensing & Legal

**IMPORTANT**: Swiss Ephemeris has its own license terms separate from Jzero's MIT license.

### For Personal/Non-Commercial Use
- Swiss Ephemeris is free
- MIT license applies to Jzero code
- No additional license required

### For Commercial Use
**You MUST comply with Swiss Ephemeris licensing terms.**

1. **Review the official license**: https://www.astro.com/swisseph/
2. **Contact Astodienst** if selling products/services that use Swiss Ephemeris
3. **Possible requirements**:
   - Commercial license may be required
   - License fees may apply
   - Different terms than MIT
4. **Always verify** before deploying commercially

### Jzero License
- Jzero core code: MIT License
- When using Swiss: Follow BOTH MIT (for Jzero) AND Swiss terms

**Never assume MIT covers Swiss Ephemeris - it doesn't. Always check Swiss terms before commercial use.**

## Install

```bash
npm install swisseph
```

## Use

```javascript
import { initializeEphemeris, getPlanetPosition } from './astrology/index.js';

initializeEphemeris();  // Once at startup

const sunPos = getPlanetPosition('Sun', 2451545.0);
console.log(sunPos.longitude);  // Degrees
```

## Learn More

- [Swiss Ephemeris](https://www.astro.com/swisseph/) - Official site with license info
- [Swiss Ephemeris License](https://www.astro.com/swisseph/swisseph_license.pdf)
- [npm swisseph](https://www.npmjs.com/package/swisseph) - Node.js package
- Examples in [examples/](examples/)

## Questions

- License questions: Contact Astodienst directly (Swiss Ephemeris)
- Jzero integration: Open an [issue](https://github.com/The-Decans-Project/Jzero/issues)
  houses: houses.houses.map(h => h.toFixed(2))
});
```

### House System Options

Swiss Ephemeris supports multiple house systems. Use these codes:

| Code | System | Description |
|------|--------|-------------|
| `P` | Placidus (default) | Most popular Western astrology system |
| `K` | Koch | Based on sunrise/sunset |
| `O` | Porphyry | Ancient quadrant trisection |
| `E` | Equal | 30° divisions from Ascendant |
| `W` | Whole Sign | Modern revival of ancient method |
| `H` | Horizontal | Horizon-based divisions |
| `T` | Topocentric | For topocentric coordinates |
| `B` | Alcabitus | Historical method |
| `M` | Morinus | Meridian-based |

```javascript
// Use different house systems
const systemCodes = ['P', 'K', 'O', 'E', 'W'];

systemCodes.forEach(code => {
  const houses = getHouses(jd, 40.7, -74.0, code);
  console.log(`${code}: ASC = ${houses.ascendant.toFixed(2)}°`);
});
```

## Full Birth Chart Example

```javascript
import { 
  initializeEphemeris,
  dateToJulianDayTT,
  getLocation,
  getHouses,
  getAllPlanetPositions,
  longitudeToZodiac
} from './astrology/index.js';

// Initialize
initializeEphemeris();

// Birth data
const birthDate = {
  year: 1994,
  month: 3,
  day: 1,
  hour: 14,
  minute: 28,
  second: 0
};

const location = getLocation('New York');
const jdData = dateToJulianDayTT(
  birthDate.year,
  birthDate.month,
  birthDate.day,
  birthDate.hour,
  birthDate.minute,
  birthDate.second
);

// Get planets
const planets = getAllPlanetPositions(jdData.jd_tt);

// Get houses
const houses = getHouses(jdData.jd_tt, location.lat, location.lon, 'P');

// Format output
console.log(`\n🌙 Birth Chart: March 1, 1994 at 14:28 in New York\n`);
console.log(`⏰ Julian Day (TT): ${jdData.jd_tt.toFixed(6)}`);
console.log(`Δ ΔT: ${jdData.deltaT.toFixed(3)} seconds\n`);

console.log(`🪐 Planetary Positions (from Swiss Ephemeris):`);
Object.entries(planets).forEach(([planet, pos]) => {
  if (pos) {
    const zodiac = longitudeToZodiac(pos.longitude);
    console.log(
      `${planet.padEnd(10)}: ${zodiac.sign.padEnd(12)} ${zodiac.degrees.toFixed(2)}° ` +
      `(±${(pos.accuracy * 3600).toFixed(2)}" accuracy)`
    );
  }
});

console.log(`\n🏠 Houses (Placidus System):`);
houses.houses.forEach((cusps, i) => {
  const zodiac = longitudeToZodiac(cusps);
  console.log(`House ${String(i + 1).padStart(2)}: ${zodiac.sign} ${zodiac.degrees.toFixed(2)}°`);
});

console.log(`\n🎯 Chart Angles:`);
console.log(`Ascendant (ASC): ${longitudeToZodiac(houses.ascendant).sign} ` +
            `${longitudeToZodiac(houses.ascendant).degrees.toFixed(2)}°`);
console.log(`Midheaven (MC):  ${longitudeToZodiac(houses.mc).sign} ` +
            `${longitudeToZodiac(houses.mc).degrees.toFixed(2)}°`);
```

## Browser Usage

For browser environments, you may need a build step:

```bash
npm run build
```

Then include in HTML:

```html
<script type="module">
  import { initializeEphemeris, getPlanetPosition } from './dist/jzero.js';
  
  initializeEphemeris();
  const sunPos = getPlanetPosition('Sun', 2451545.0);
  console.log(sunPos);
</script>
```

## Accuracy & Range

| Component | Accuracy | Valid Range |
|-----------|----------|-------------|
| **Sun** | ±0.0001° | -3000 to +3000 |
| **Moon** | ±0.0001° | -3000 to +3000 |
| **Inner planets** | ±0.0001° | -3000 to +3000 |
| **Outer planets** | ±0.0002° | -3000 to +3000 |
| **House cusps** | ±0.01° | Any latitude |

Swiss Ephemeris is the industry standard for professional astrology software.

## Troubleshooting

### "Cannot find module 'swisseph'"

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "Swiss Ephemeris calculation failed"

Ensure you've called `initializeEphemeris()` before calculations:

```javascript
import { initializeEphemeris } from './astrology/index.js';
initializeEphemeris();  // MUST call this first
```

### Platform-Specific Binary Issues

`swisseph` includes pre-compiled binaries for:
- ✅ macOS (Intel & Apple Silicon)
- ✅ Linux (x64)
- ✅ Windows (x64)

If you're on an unsupported platform, you may need to compile from source (advanced).

## Advanced Configuration

### Custom Ephemeris Path

```javascript
import { initializeEphemeris } from './astrology/index.js';

// Use custom ephemeris data path
initializeEphemeris('/path/to/ephemeris/data');
```

### Performance Optimization

For multiple calculations, batch them:

```javascript
// ❌ Slow: 10 individual calls
for (let i = 0; i < 10; i++) {
  const pos = getPlanetPosition('Sun', jd + i);
}

// ✅ Fast: Single batch call
const positions = getAllPlanetPositions(jd);
```

## Migration from VSOP87

If you were using previous versions with VSOP87:

```javascript
// OLD (VSOP87):
// import { calculateSunPosition } from './astrology/core/planets.js';
// const pos = calculateSunPosition(t);

// NEW (Swiss Ephemeris):
import { getPlanetPosition, initializeEphemeris } from './astrology/index.js';
initializeEphemeris();
const pos = getPlanetPosition('Sun', jd);
```

Key differences:
- Input is now Julian Day (more intuitive)
- Accuracy is dramatically improved (±0.0001°)
- Returns structured object with metadata
- Includes proper motion speeds

## Performance

- First calculation (after init): ~10-20ms
- Subsequent calculations: <10ms each
- All 10 planets: ~50-100ms total
- Full birth chart (planets + houses): ~150-200ms

## Resources

- **Swiss Ephemeris Documentation**: https://www.astro.com/swisseph/
- **Jzero ARCHITECTURE.md**: [System design](ARCHITECTURE.md)
- **GitHub Issues**: [Report problems](https://github.com/The-Decans-Project/Jzero/issues)

## Contributing

Improvements to Swiss Ephemeris integration (performance, features, examples) are welcome!

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

**Ready to calculate accurate astrology charts?** Start with the Quick Start above! 🌙✨
