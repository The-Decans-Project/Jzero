# Quick Start

Get Jzero running in 5 minutes.

## Prerequisites

- Node.js 18+
- Git

## ⚠️ Licensing Note

**Important**: If you use Swiss Ephemeris for **commercial purposes**, you must comply with Swiss Ephemeris licensing terms (separate from Jzero's MIT license).

See [LICENSING.md](LICENSING.md) for details.

## Install

```bash
git clone https://github.com/The-Decans-Project/Jzero.git
cd Jzero
npm install
```

## Try It

Run an example:

```bash
node examples/simple-chart.js
```

This calculates a birth chart for July 20, 1969 in Cape Canaveral.

## Use in Your Code

```javascript
import { calculateBirthChart } from './astrology/index.js';

const chart = calculateBirthChart({
  year: 1994,
  month: 3,
  day: 1,
  hour: 14,
  minute: 28,
  latitude: 40.7128,
  longitude: -74.0060
});

console.log('Sun:', chart.planets.sun);
console.log('Moon:', chart.planets.moon);
```

## For Swiss Ephemeris

See [SWISS_EPHEMERIS.md](SWISS_EPHEMERIS.md) for setup.

## Next Steps

- Check [examples/](examples/) for more code samples
- Read [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- Open an [issue](https://github.com/The-Decans-Project/Jzero/issues) with questions
# Build frontend and backend for production
npm run build:full
```

Frontend:
- Built files in `public/app/dist/`
- Deploy to Vercel, Netlify, or any static hosting

Backend:
- Run with `npm run server:start`
- Deploy to Railway, Heroku, or any Node.js hosting

## Project Structure

```
Jzero/
├── astrology/           # Core calculation library
├── server/              # Express.js API backend
├── public/app/          # React frontend
│   ├── src/             # React components
│   ├── index.html       # HTML entry point
│   └── dist/            # Production build output
└── docs/                # Documentation
```

## Common Tasks

### Frontend Development
```bash
cd public/app
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Check code quality
```

### Backend Development
```bash
npm run server:dev       # Start with hot reload
npm run server:start     # Start production server
npm run test             # Run tests
```

### Full Stack Testing
```bash
# With both servers running, navigate to http://localhost:3000
# Try calculating a birth chart with:
# Date: 1990-07-23
# Time: 14:30
# Location: New York
```

## API Endpoints

Once backend is running on http://localhost:5000:

**Calculate Birth Chart**
```bash
curl -X POST http://localhost:5000/api/chart/birth-chart \
  -H "Content-Type: application/json" \
  -d '{
    "date": "1990-07-23",
    "time": "14:30",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "timezone": "America/New_York"
  }'
```

**Search Locations**
```bash
curl "http://localhost:5000/api/locations?q=New%20York"
```

**Current Transits**
```bash
curl -X POST http://localhost:5000/api/chart/transits \
  -H "Content-Type: application/json" \
  -d '{ "birthChart": {...} }'
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Or port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Dependencies Not Installing
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Frontend Can't Connect to Backend
- Verify backend is running: `http://localhost:5000/api/locations?q=test`
- Check `VITE_API_BASE_URL` in `public/app/.env.local`
- Look for CORS errors in browser console

## Next Steps

- 📖 Read [ARCHITECTURE.md](./ARCHITECTURE.md)
- 🚀 Deploy with [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- 🤝 Contribute with [CONTRIBUTING.md](./CONTRIBUTING.md)
- 📚 Learn about [Swiss Ephemeris](./SWISS_EPHEMERIS_SETUP.md)

## Support

- 🐛 Found a bug? [Report it](https://github.com/The-Decans-Project/Jzero/issues)
- 💡 Have an idea? [Start a discussion](https://github.com/The-Decans-Project/Jzero/discussions)
- ⭐ Like Jzero? [Star the repo](https://github.com/The-Decans-Project/Jzero)
- 💰 Support development:
  - [GitHub Sponsors](https://github.com/sponsors/The-Decans-Project)
  - [Buy Me a Coffee](https://buymeacoffee.com/)
  - [Patreon](https://patreon.com/)

## License

MIT License - See [LICENSE](./LICENSE) for details
