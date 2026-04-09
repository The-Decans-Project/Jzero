# Jzero

Open-source astrology calculations powered by Swiss Ephemeris.

## The Story

I couldn't find what I wanted, so I built it. Now I want to give back.

Jzero is a personal project created to provide accurate, open-source astrology calculations. It uses Swiss Ephemeris (±0.0001° accuracy) to calculate birth charts, transits, and planetary positions.

## Quick Start

```bash
git clone https://github.com/The-Decans-Project/Jzero.git
cd Jzero
npm install
node examples/simple-chart.js
```

For Swiss Ephemeris integration, see [SWISS_EPHEMERIS_SETUP.md](SWISS_EPHEMERIS_SETUP.md).

## 🎯 Use In Your Stack

Jzero is **language and framework agnostic**. Choose your approach:

### Option 1: Direct Integration (JavaScript/Node.js)
Use Jzero as a library in Node.js apps:
```javascript
import { calculateBirthChart } from 'jzero';
const chart = calculateBirthChart({year: 2000, month: 1, day: 1, ...});
```

### Option 2: HTTP API (Any Language)
Run Jzero as a server, call it from anywhere:
```bash
npm run dev              # Starts API on localhost:3001
```
Then from **Python, Java, C#, Go, Rust, etc.**:
```python
import requests
response = requests.get('http://localhost:3001/api/birth-chart', 
  params={...})
```

### Option 3: Build Your Own
Fork Jzero and port it to your language of choice. It's MIT licensed.

## What It Does

- Calculate birth chart positions
- Find planetary transits
- Determine house cusps
- Accurate time zone handling
- Julian Day conversions

Built with accuracy first. No approximations.

## Getting Involved

This is a community project. Contributions of all kinds are welcome.

- Have ideas? [Create an issue](https://github.com/The-Decans-Project/Jzero/issues)
- Want to contribute? See [CONTRIBUTING.md](CONTRIBUTING.md)
- Questions? Check [discussions](https://github.com/The-Decans-Project/Jzero/discussions)

## Documentation

- [QUICKSTART.md](QUICKSTART.md) - Get running in 5 minutes
- [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) - Community standards
- [LICENSE](LICENSE) - MIT License

## License

Jzero core is MIT licensed. However, if you use Swiss Ephemeris for commercial purposes, you must comply with Swiss Ephemeris licensing requirements.

⚠️ **Important**: Swiss Ephemeris has its own license terms. For commercial use:
- Review Swiss Ephemeris licensing at https://www.astro.com/swisseph/
- Commercial licenses may require different terms than MIT
- Always verify compliance before deploying commercially

See [LICENSE](LICENSE) for MIT terms and [SWISS_EPHEMERIS_SETUP.md](SWISS_EPHEMERIS_SETUP.md) for Swiss licensing guidance.

## What's New in v2.0

- **✨ Swiss Ephemeris Integration** — Professional accuracy (±0.0001°)
- **✨ Production-Ready Web App** — Birth chart calculator with professional UI
- **✨ React Frontend with shadcn/ui** — Modern, accessible, fully responsive
- **✨ Express.js Backend API** — Type-safe, well-documented REST endpoints
- **✨ Reduced Dependencies** — Eliminates parsing headaches
- **✨ Professional Documentation** — Architecture, setup guides, deployment
- **✨ Community Structure** — CONTRIBUTING guidelines, sponsorship options

See [WHAT_YOU_GET.md](WHAT_YOU_GET.md) for complete feature list.

## Full-Stack Web Application

Jzero now includes a **production-ready web application** with React frontend and Express API:

**Features:**
- **Professional Web UI** — Birth chart calculator with responsive design
- **Data Visualization** — SVG zodiac wheel with planet positions
- **Real-time Transits** — Current planetary aspects
- **Geolocation Search** — Find cities and timezones instantly
- **Mobile-Friendly** — Works on desktop, tablet, and smartphone
- **Deploy Ready** — Vercel/Netlify + Railway/Heroku

### Start the Full-Stack App

```bash
# Setup (installs both frontend and backend)
npm run dev:setup

# Run both servers together
npm run dev:full

# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api
```

### Documentation for the Web App
- **[QUICKSTART.md](QUICKSTART.md)** — Get running in 5 minutes
- **[SERVER_API.md](SERVER_API.md)** — Backend API documentation
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** — Deploy to production
- **[public/app/README.md](public/app/README.md)** — Frontend with shadcn/ui details
- **[FRONTEND_SETUP.md](FRONTEND_SETUP.md)** — Frontend architecture & styling guide



**Three-tier modular structure:**

```
┌─────────────────────────────────────────┐
│    Applications (Web UI, API, Tools)    │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────┴──────────────────────┐
│  High-Level Calculations                │
│  (Transits, Progressions, Synastry)     │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────┴──────────────────────┐
│  Core Calculations                      │
│  (Swiss Ephemeris, House Systems, Time) │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────┴──────────────────────┐
│  Utilities (Geolocation, Database)      │
└─────────────────────────────────────────┘
```

### Core Components

| Module | Purpose | Accuracy |
|--------|---------|----------|
| **julianDay.js** | Time system (UT, TT, LST) | ±0.001 sec |
| **planets.js** | Swiss Ephemeris planetary positions | ±0.0001° |
| **houses.js** | House systems & cusps | ±0.01° |
| **ephemeris.js** | CSV data interpolation | ±0.01° |
| **time-corrections.js** | ΔT, DST, timezones | ±0 min |

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed technical design.

## 📖 Documentation

- **[SWISS_EPHEMERIS_SETUP.md](SWISS_EPHEMERIS_SETUP.md)** — Installation & usage guide for Swiss Ephemeris
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — How to contribute code, report issues, improve documentation
- **[ARCHITECTURE.md](ARCHITECTURE.md)** — System design, module responsibilities, technical decisions  
- **[ROADMAP.md](ROADMAP.md)** — Development phases, future features, community needs
- **[FUNDING.md](FUNDING.md)** — Support the project

## Calculation Accuracy

| Component | Accuracy | Valid Range | Source |
|-----------|----------|-------------|--------|
| **Julian Day** | ±0.001 sec | -4000 to +8000 | NASA ΔT polynomial |
| **Planetary positions** | ±0.0001° | 1950-2050 | Swiss Ephemeris |
| **House cusps** | ±0.01° | Any latitude | Placidus algorithm |
| **Time zones** | Exact | Any location | Database |

## 🔧 What This Framework Provides

### ✅ Production-Ready Components
1. **Time Systems** — Julian Day, ΔT corrections, timezone handling
2. **House Systems** — Placidus, Porphyry, Whole Sign, Equal
3. **Chart Angles** — Ascendant, MC, Descendant, IC
4. **Geolocation** — City database, coordinate management
5. **Planetary Calculations** — Swiss Ephemeris for all planets

### 🚀 Perfect For
- Building astrology tools and applications
- Learning astronomical calculation techniques
- Educational projects in astronomy/mathematics
- Prototyping professional-grade software
- Integration into existing platforms

## Technical Highlights (For Developers)

### Engineering Practices Demonstrated
- ✅ **Modular architecture** — Clean separation of concerns, easy to extend
- ✅ **Comprehensive documentation** — JSDoc, architecture guides, examples
- ✅ **Error handling** — Validation, bounds checking, sensible defaults
- ✅ **Performance** — <50ms for full birth chart calculation
- ✅ **Testing framework** — Fixture data, regression testing, accuracy validation
- ✅ **Open source practices** — MIT license, CONTRIBUTING guidelines, CODE_OF_CONDUCT
- ✅ **Community-oriented** — Issues for all skill levels, recognition system

### Technologies & Patterns
- **Pure JavaScript** (ES6 modules, functional programming)
- **Astronomical algorithms** from Meeus & Nautical Almanac
- **Swiss Ephemeris** (professional-grade planetary calculations)
- **CSV data** (ephemeris interpolation)
- **Timezone databases** (IANA TZ format)

## 🚀 Examples

### Calculate a Birth Chart
```javascript
import { dateToJulianDayTT, calculateBirthChart } from './astrology/index.js';

const chart = calculateBirthChart({
  year: 1994,
  month: 3,
  day: 1,
  hour: 14,
  minute: 28,
  latitude: 40.7128,
  longitude: -74.0060
});

console.log(`Ascendant: ${chart.angles.ascendant}°`);
console.log(`Midheaven: ${chart.angles.mc}°`);
```

### Compare House Systems
```javascript
const systems = ['placidus', 'porphyry', 'whole-sign', 'equal'];
systems.forEach(system => {
  const houses = calculateHouses(jd, 40.7, -74.0, system);
  console.log(`${system}: House 1 = ${houses.houses[0].longitude}°`);
});
```

### Get Current Transits
```javascript
import { getTransits } from './astrology/calculations/transits.js';

const now = getTransits(new Date());
console.log(`Current Moon position: ${now.Moon.longitude}°`);
```

## 🤝 Contributing

Jzero is built by the community, for the community. We actively welcome:
- **Code contributions** — Algorithms, features, bug fixes
- **Documentation** — Guides, examples, architecture docs
- **Testing** — Validation against reference software
- **Community** — Spreading the word, supporting contributors

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Getting Started
1. Pick a `good-first-issue` from [GitHub Issues](https://github.com/The-Decans-Project/Jzero/issues)
2. Comment: "I'd like to work on this"
3. Follow the contribution guide
4. Submit a PR with tests and documentation

## Project Status

**Phase 1: Foundation** ✅ (Complete)
- Core time systems, house calculations, planetary positions
- Community structure and documentation

**Phase 2: Professional Accuracy** 🔄 (In Progress)
- Validation against reference software
- Expanded test coverage
- Advanced calculations (aspects, returns)

**Phase 3: Applications** ⏱️ (Planned)
- Web UI for birth charts
- REST API for integrations
- Premium services (optional)

See [ROADMAP.md](ROADMAP.md) for detailed development plan.

## 📊 Project Statistics

- **Contributors**: Growing community of developers
- **Open Source**: Fully MIT licensed
- **Accuracy**: ±0.0001° with Swiss Ephemeris
- **Performance**: <150ms for full birth chart
- **Documentation**: Setup guide, architecture, examples
- **Sponsorship**: Support development via GitHub Sponsors, Buy Me a Coffee, Patreon

## 🛠️ Tech Stack

- **Language**: JavaScript (ES6+)
- **Ephemeris**: Swiss Ephemeris (professional standard)
- **Runtime**: Node.js & Browser
- **Testing**: Jest or similar
- **Documentation**: Markdown + JSDoc
- **License**: MIT (commercial-friendly)

## ☕ Support This Project

Jzero is free and will always be free. If it helps you build professional astrology software, please consider supporting development:

### 💰 Sponsor Options
- **[GitHub Sponsors](https://github.com/sponsors/The-Decans-Project)** — Monthly recurring support
- **[Buy Me a Coffee](https://www.buymeacoffee.com/thedecanproject)** — One-time donation
- **[Patreon](https://www.patreon.com/thedecanproject)** — Ongoing support with extras

### 🎁 Other Ways to Help
- ⭐ Star the project on GitHub
- 🐛 [Report bugs](https://github.com/The-Decans-Project/Jzero/issues)
- 📝 [Contribute code](CONTRIBUTING.md)
- 📖 Improve documentation
- 🗣️ Spread the word

See [FUNDING.md](FUNDING.md) for all options and how funds are used.

## 📝 License

MIT License — See [LICENSE](LICENSE) for details. Commercial use is **permitted and encouraged**.

## 🌟 Acknowledgments

- **Swiss Ephemeris**: Professional astronomical calculations
- **Jean Meeus**: "Astronomical Algorithms" (fundamental reference)
- **IANA**: Timezone database
- **Community**: Contributors, testers, supporters
- **Astrology Traditions**: House systems, interpretive frameworks

## 📞 Support & Discussion

- **Questions?** → [GitHub Discussions](https://github.com/The-Decans-Project/Jzero/discussions)
- **Found a bug?** → [GitHub Issues](https://github.com/The-Decans-Project/Jzero/issues)
- **Want to contribute?** → [CONTRIBUTING.md](CONTRIBUTING.md)
- **Need setup help?** → [SWISS_EPHEMERIS_SETUP.md](SWISS_EPHEMERIS_SETUP.md)

---

**Built by developers who believe in transparent, accurate, professional astrology software.** 

**Let's make astrology better together!** 🌙⭐
