# Backend API Server Configuration

Complete guide to setting up and running the Jzero backend API server.

## Overview

The Jzero backend is a professional Express.js REST API that:
- Calculates birth charts with Swiss Ephemeris accuracy (±0.0001°)
- Handles planetary transits and aspect calculations
- Searches for geographic locations
- Serves data to the React frontend
- Implements proper error handling and CORS

## Quick Start

```bash
# Install dependencies (if not already done)
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run server:dev

# Server running on http://localhost:5000
```

## Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
HOST=localhost

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug

# Ephemeris Configuration
EPHEMERIS_PATH=./data
MAX_YEARS_FUTURE=50
MAX_YEARS_PAST=100

# API Rate Limiting (optional)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## API Endpoints

### Birth Chart Calculation

**Endpoint:** `POST /api/chart/birth-chart`

**Request:**
```json
{
  "date": "1990-07-23",
  "time": "14:30",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "timezone": "America/New_York"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "date": "1990-07-23",
    "time": "14:30:00",
    "timezone": "America/New_York",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "city": "New York"
    },
    "planets": [
      {
        "name": "Sun",
        "symbol": "☉",
        "zodiac": "Leo",
        "degree": 29.45,
        "longitude": 119.45,
        "latitude": 0.01,
        "distance": 1.0155,
        "speed": 1.0163,
        "retrograde": false
      },
      // ... 9 more planets
    ],
    "angles": {
      "ASC": { "zodiac": "Virgo", "degree": 12.34, "longitude": 162.34 },
      "MC": { "zodiac": "Gemini", "degree": 8.56, "longitude": 68.56 },
      "DSC": { "zodiac": "Pisces", "degree": 12.34, "longitude": 342.34 },
      "IC": { "zodiac": "Sagittarius", "degree": 8.56, "longitude": 248.56 }
    },
    "houses": [
      { "house": 1, "zodiac": "Virgo", "degree": 12.34 },
      // ... 12 houses total
    ],
    "aspects": [
      {
        "planet1": "Sun",
        "planet2": "Moon",
        "aspect": "Conjunction",
        "orb": 2.34,
        "applying": true
      }
    ],
    "calculationTime": "145ms"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid date format",
  "details": "Expected date format: YYYY-MM-DD"
}
```

### Current Transits

**Endpoint:** `POST /api/chart/transits`

**Request:**
```json
{
  "birthChart": {
    "planets": [...],
    "angles": {...},
    "houses": [...]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "datetime": "2024-01-15T21:30:00Z",
    "transits": [
      {
        "planet": "Moon",
        "symbol": "☾",
        "currentPosition": {
          "zodiac": "Gemini",
          "degree": 15.67,
          "longitude": 75.67
        },
        "birthPosition": {
          "zodiac": "Leo",
          "degree": 10.23,
          "longitude": 130.23
        },
        "aspect": "Sextile",
        "orb": 1.23,
        "interpretation": "Harmonious flow support",
        "speed": 12.5,
        "retrograde": false
      }
      // ... one per planet
    ],
    "calculationTime": "89ms"
  }
}
```

### Location Search

**Endpoint:** `GET /api/locations?q=query`

**Query Parameters:**
- `q` (required): City name or partial name

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "New York",
      "state": "NY",
      "country": "United States",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "timezone": "America/New_York",
      "population": 8335897
    },
    {
      "name": "New York Mills",
      "state": "NY",
      "country": "United States",
      "latitude": 43.1641,
      "longitude": -75.3296,
      "timezone": "America/New_York",
      "population": 3500
    }
  ]
}
```

### Chart Synastry (Stub)

**Endpoint:** `POST /api/chart/synastry`

Currently returns a placeholder response. Full implementation coming soon.

## Server Architecture

### File Structure

```
server/
├── api.js                 # Main Express server (startup, routes, middleware)
├── middleware/            # Custom middleware (if needed)
├── utils/                 # Helper functions
└── config/               # Configuration files
```

### Main Server File: `server/api.js`

Key components:
- **Express App Setup**: Initialization with middleware
- **CORS Configuration**: Handles cross-origin requests
- **Routes**: API endpoints for calculations
- **Swiss Ephemeris Integration**: Uses wrapper from astrology/core/swiss-ephemeris.js
- **Error Handling**: Catches and formats errors for client
- **Logging**: Request/response logging

## Data Formats

### Planet Data

Each planet includes:
- `name`: Planet name (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto)
- `symbol`: Unicode symbol (☉, ☾, ☿, ♀, ♂, ♃, ♄, ♅, ♆, ♇)
- `zodiac`: Sign name (Aries through Pisces)
- `degree`: Position within sign (0-29.99°)
- `longitude`: Absolute position (0-359.99°)
- `latitude`: N/S of ecliptic (-90 to +90°)
- `distance`: AU from Sun
- `speed`: Degrees per day
- `retrograde`: Boolean

### Zodiac Signs

```javascript
const ZODIAC = [
  'Aries',      'Taurus',   'Gemini',    'Cancer',
  'Leo',        'Virgo',    'Libra',     'Scorpio',
  'Sagittarius','Capricorn','Aquarius',  'Pisces'
];

const ZODIAC_SYMBOLS = [
  '♈', '♉', '♊', '♋', '♌', '♍',
  '♎', '♏', '♐', '♑', '♒', '♓'
];
```

### House Systems

Supported house systems:
- Placidus (default)
- Koch
- Whole Sign
- Equal
- Campanus
- Regiomontanus

### Aspects

Standard aspects calculated:
- Conjunction (0° ± 8°)
- Sextile (60° ± 4°)
- Square (90° ± 8°)
- Trine (120° ± 8°)
- Opposition (180° ± 8°)
- Semi-sextile (30° ± 2°)
- Quincunx (150° ± 2°)

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Error title",
  "details": "Detailed error message",
  "code": "ERROR_CODE"
}
```

### Common Errors

| Code | Message | Solution |
|------|---------|----------|
| INVALID_DATE | Invalid date format | Use YYYY-MM-DD |
| INVALID_TIME | Invalid time format | Use HH:MM or HH:MM:SS |
| INVALID_LOCATION | Invalid latitude/longitude | Check coordinate ranges |
| INVALID_TIMEZONE | Unknown timezone | Check timezone name |
| CALCULATION_ERROR | Swiss Ephemeris error | Check input values |
| NOT_FOUND | Resource not found | Verify endpoint/query |

## Performance Considerations

### Calculation Times

- Single Planet Position: ~10ms
- Full Birth Chart (10 planets + angles): ~100-150ms
- Transits Calculation: ~80-100ms
- Location Search: ~50ms

### Memory Usage

- Idle process: ~30-50MB
- Per calculation: +5-10MB temporary
- Max cached calculations: ~100 = ~200MB

### Optimization Strategies

1. **Caching**: Cache common calculations
2. **Batch Requests**: Combine API calls
3. **Lazy Loading**: Load data on demand
4. **Compression**: gzip all responses

## Security

### Input Validation

All endpoints validate:
- Date format and range (1950-2050)
- Time format and range (00:00-23:59)
- Coordinates range (-90/+90, -180/+180)
- Timezone validity
- String length limits

### CORS Policy

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));
```

### Rate Limiting (Optional)

Implement rate limiting to prevent abuse:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Testing

### Manual Testing with curl

```bash
# Test birth chart calculation
curl -X POST http://localhost:5000/api/chart/birth-chart \
  -H "Content-Type: application/json" \
  -d '{
    "date": "1990-07-23",
    "time": "14:30",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "timezone": "America/New_York"
  }'

# Test location search
curl "http://localhost:5000/api/locations?q=New%20York"

# Test transits
curl -X POST http://localhost:5000/api/chart/transits \
  -H "Content-Type: application/json" \
  -d '{"birthChart": {...}}'
```

### Integration Tests

```bash
npm test
```

## Deployment

### Production Setup

⚠️ **Licensing Note**: If your production deployment will use Swiss Ephemeris, you must obtain a separate Swiss Ephemeris commercial license for commercial use. See [LICENSING.md](LICENSING.md).

```bash
# Install production dependencies only
npm install --production

# Set environment
export NODE_ENV=production
export PORT=5000
export CORS_ORIGIN=https://your-frontend.com

# Start server
npm run server:start
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server/api.js"]
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-domain.com
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Monitoring

### Health Check Endpoint

Add a health check for load balancers:

```javascript
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    version: '2.0.0',
    uptime: process.uptime()
  });
});
```

### Logging Best Practices

- Log all API requests
- Log calculation errors
- Don't log sensitive input data
- Use structured logging (JSON format)

### Recommended Monitoring Services

- Sentry (error tracking)
- DataDog (APM)
- New Relic (monitoring)
- Logz.io (logging)

## Extending the API

### Adding New Endpoints

1. Create handler function in `server/api.js`
2. Define route with app.post() or app.get()
3. Add input validation
4. Call calculation functions
5. Return formatted response
6. Handle errors

```javascript
// Example: Add new endpoint
app.post('/api/chart/progressions', (req, res) => {
  try {
    // Validate input
    // Call calculation
    // Format response
    res.json({ success: true, data: {...} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
```

## Support & Troubleshooting

### Common Issues

**Issue: Server won't start**
- Check if port is already in use
- Verify Node.js version (18+)
- Check environment variables

**Issue: Swiss Ephemeris errors**
- Verify swisseph package installed
- Check ephemeris data files exist
- Review input date range

**Issue: CORS errors**
- Verify CORS_ORIGIN matches frontend URL
- Check http vs https
- Verify proxy configuration

### Getting Help

- 📖 Read the [ARCHITECTURE.md](./ARCHITECTURE.md)
- 🐛 Check [GitHub Issues](https://github.com/The-Decans-Project/Jzero/issues)
- 💬 Join [GitHub Discussions](https://github.com/The-Decans-Project/Jzero/discussions)
