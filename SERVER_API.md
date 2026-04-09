# Server API Reference

Express.js REST API for Jzero astrology calculations.

## Start

```bash
npm run dev      # Development (port 3001)
npm start        # Production
```

```bash
curl http://localhost:3001/api/health
```

---

## Endpoints

### `GET /api/health`

```json
{
  "status": "healthy",
  "message": "Jzero API Server",
  "version": "2.0.0",
  "timestamp": "2024-01-15T21:30:00Z"
}
```

---

### `POST /api/chart/birth-chart`

**Request:**
```json
{
  "date": "1990-07-23",
  "time": "14:30:00",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

You can also pass `"city": "New York"` instead of coordinates.

**Response:**
```json
{
  "input": {
    "date": "1990-07-23",
    "time": "14:30",
    "location": "New York",
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "jd": {
    "jd_tt": "2448461.104167",
    "deltaT": "57.2",
    "deltaT_seconds": "57.2 seconds"
  },
  "planets": {
    "Sun": {
      "longitude": "120.4523",
      "latitude": "0.0001",
      "distance": "1.016523",
      "sign": "Leo",
      "zodiacDegree": "0.45",
      "speed": "0.9534",
      "accuracy": "±0.01\""
    }
  },
  "houses": {
    "houses": [
      { "degree": "162.34", "sign": "Virgo", "zodiacDegree": "12.34" }
    ],
    "angles": {
      "ascendant": { "name": "Ascendant", "longitude": "162.34", "sign": "Virgo", "zodiacDegree": "12.34" },
      "mc": { "name": "Midheaven", "longitude": "68.56", "sign": "Gemini", "zodiacDegree": "8.56" },
      "descendant": { "name": "Descendant", "longitude": "342.34", "sign": "Pisces", "zodiacDegree": "12.34" },
      "ic": { "name": "Imum Coeli", "longitude": "248.56", "sign": "Sagittarius", "zodiacDegree": "8.56" }
    }
  },
  "accuracy": {
    "planetary_positions": "±0.0001°",
    "house_cusps": "±0.01°",
    "note": "Professional-grade accuracy via Swiss Ephemeris"
  }
}
```

---

### `POST /api/chart/transits`

**Request:**
```json
{
  "birthChartDate": "1990-07-23",
  "birthChartTime": "14:30:00",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Response:**
```json
{
  "current_time": "2024-01-15T21:30:00Z",
  "current_jd": "2460325.395833",
  "birth_date": "1990-07-23T14:30",
  "transits": [
    {
      "planet": "Moon",
      "current_longitude": "75.67",
      "birth_longitude": "130.23",
      "difference": "-54.56",
      "interpretation": "Sextile"
    }
  ],
  "accuracy": "±0.0001° (Swiss Ephemeris)"
}
```

---

### `POST /api/chart/synastry`

**Request:**
```json
{
  "chart1": {
    "date": "1990-07-23",
    "time": "14:30:00",
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "chart2": {
    "date": "1985-03-15",
    "time": "09:00:00",
    "latitude": 51.5074,
    "longitude": -0.1278
  }
}
```

**Response:**
```json
{
  "chart1": { "date": "1990-07-23", "time": "14:30:00" },
  "chart2": { "date": "1985-03-15", "time": "09:00:00" },
  "interAspects": [
    {
      "planet1": "Sun",
      "planet2": "Moon",
      "aspect": "Trine",
      "orb": 2.3
    }
  ],
  "composite": {
    "Sun": { "longitude": 95.3, "sign": "Cancer" }
  },
  "scores": {
    "overall": 24,
    "harmony": 18,
    "tension": -4,
    "communication": 8,
    "passion": 12
  },
  "summary": "Strong compatibility indicated. Relationship likely harmonious.",
  "accuracy": "±0.0001° (Swiss Ephemeris)"
}
```

---

### `GET /api/locations?search=query`

**Request:**
```
GET /api/locations?search=New
```

**Response:**
```json
{
  "results": [
    {
      "name": "New York, NY, USA",
      "lat": 40.7128,
      "lon": -74.0060,
      "timezone": "America/New_York"
    }
  ],
  "total": 1
}
```

Search query must be at least 2 characters. Returns matching cities from the built-in database.

---

## Error Responses

```json
{
  "error": "Missing required fields: date, time"
}
```

| HTTP | Cause |
|------|-------|
| 400 | Missing or invalid input |
| 404 | City not found |
| 500 | Calculation error |

---

## Server Files

```
server/
├── api.js          # Express server, all routes
└── middleware.js   # Error handling, async wrapper, logging
```

---

## Testing

```bash
# Health check
curl http://localhost:3001/api/health

# Birth chart
curl -X POST http://localhost:3001/api/chart/birth-chart \
  -H "Content-Type: application/json" \
  -d '{"date":"1990-07-23","time":"14:30:00","latitude":40.7128,"longitude":-74.0060}'

# City search
curl "http://localhost:3001/api/locations?search=London"
```

---

## Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

**Licensing note**: Swiss Ephemeris has its own license for commercial use. See [LICENSING.md](LICENSING.md).
