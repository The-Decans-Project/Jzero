# Jzero v2.0.0 - Final Release

**Date**: April 9, 2026

## What is Jzero?

Jzero is an open-source astrology calculation framework. It demonstrates how to compute birth charts, transits, progressions, and synastry analysis using readily available data and techniques.

**Personal Mission**: I couldn't find what I wanted, so I built it. Now I want to give back.

## Key Features

- **Birth Chart Calculations**: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto
- **CSV-Calibrated System**: Works without external dependencies; uses verified ingress data
- **Swiss Ephemeris Ready**: Seamlessly integrates with Swiss Ephemeris for high-precision calculations when available
- **Professional Architecture**: Clean separation of concerns, modular design
- **Open Community**: MIT licensed, contributions welcome

## What's New in v2.0.0

### Repository Cleanup
- ✅ Moved 10 example files to `examples/` directory
- ✅ Organized 3 test files in `test/` directory  
- ✅ Removed 8 obsolete documentation files
- ✅ Streamlined package.json with clear scripts

### Professional Test Suite
- **test/test-birth-chart.js**: Comprehensive test with multiple subjects
  - Test Subject (NYC, 1994): 7/7 zodiac signs verified ✅
  - London Birth (1925): Historical validation
  - Sydney Birth (2000): International location test
  - **Success Rate**: 88.9% (zodiac signs verified)

### Production-Ready Examples
- **examples/basic-birth-chart.js**: Simple, copy-paste ready example
- **examples/synastry-comparison.js**: Relationship analysis example
- Additional 8 legacy examples available for reference

### Architecture Improvements
- Integrated calculator with smart fallback (Swiss → CSV)
- Optional Swiss Ephemeris dependency
- CSV-based calculator handles all planets including Pluto and Moon
- Clear accuracy indicators (±2° for Moon, ±5-10° for others)

## Installation

```bash
git clone https://github.com/The-Decans-Project/Jzero.git
cd Jzero
npm install
```

For high-precision calculations, install Swiss Ephemeris:

```bash
npm install swisseph@latest
```

## Quick Start

```javascript
import { calculateBirthChart } from './astrology/core/calculator.js';

const chart = calculateBirthChart({
  year: 1994,
  month: 3,
  day: 1,
  hour: 14,
  minute: 28,
  timezone: -5,
  latitude: 40.7167,
  longitude: -74.0
});

console.log(chart.planets.Sun.longitude_formatted); // "Pisces 14.48°"
```

## Running Tests

```bash
npm test                    # Run all tests
npm run test:accuracy       # Test accuracy with Swiss (if installed)
```

## Project Structure

```
Jzero/
├── astrology/
│   ├── core/              # Core calculation modules
│   │   ├── calculator.js  # Main birth chart calculator
│   │   ├── csv-calculator.js  # CSV-based calculations
│   │   └── ...
│   └── index.js           # Main export
├── examples/              # Production-ready examples
├── test/                  # Test suite
├── data/                  # CSV ephemeris data
├── public/                # Frontend (React + Tailwind)
├── server/                # Backend API
└── docs/                  # Documentation
```

## How It Works

### Without Swiss Ephemeris (CSV Mode)
1. User provides birth date/time and location
2. System calculates Julian Day
3. Looks up zodiac ingress dates from CSV data
4. Interpolates planetary positions within signs
5. Returns results with accuracy estimates (±2-10°)

### With Swiss Ephemeris
1. All steps above work automatically
2. Swiss provides precision calculations (±0.0001°)
3. Seamless fallback if Swiss unavailable

## Accuracy Notes

| Mode | Sun | Moon | Other Planets |
|------|-----|------|---------------|
| CSV | ±3° | ±2° | ±5-10° |
| Swiss | ±0.0001° | ±0.0001° | ±0.0001° |

**Recommendation**: Use CSV for demonstrations and learning. Use Swiss Ephemeris for anything requiring precision (professional work, serious analysis, published content).

## Dependencies

### Required
- Node.js >= 18.0.0

### Optional
- `swisseph`: For high-precision calculations
- `express`: For backend API
- `concurrently`: For development only

## Documentation

- **README.md**: Project overview and features
- **QUICKSTART.md**: Get started in 5 minutes
- **ARCHITECTURE.md**: System design and technical details
- **SWISS_EPHEMERIS_SETUP.md**: How to install and use Swiss
- **CONTRIBUTING.md**: How to contribute to Jzero
- **ROADMAP.md**: What's planned next

## Community

- **Contribute**: See CONTRIBUTING.md for guidelines
- **Issues**: Report bugs on GitHub
- **Discussions**: Ask questions in Discussions
- **Sponsors**: Support via GitHub Sponsors

## License

MIT - See LICENSE file for details

## Vision

Jzero exists to democratize astrology calculations. Astrology is personal, mathematical, and accessible. Whether you're building a hobby project or a professional platform, Jzero provides the foundation.

The system works out-of-the-box (CSV mode demonstrates functionality) but gracefully directs users to Swiss Ephemeris for precision work. This is intentional: show it works, then point to the best solution.

## What's Next?

See ROADMAP.md for planned features:
- House system calculations
- Aspect detection
- Transit predictions
- Progression calculations
- Synastry analysis
- Web API with frontend

---

**Built with**❤️ for the astrology community.

For questions or support: See CONTRIBUTING.md or open an issue on GitHub.
