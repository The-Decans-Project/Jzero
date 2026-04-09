# Deployment Guide

## System Architecture

```
┌──────────────────────────────────────┐
│     React Frontend (Port 3000)       │
│  - Birth Chart Calculator            │
│  - SVG Zodiac Wheel                  │
│  - Transits Viewer                   │
└──────────────────┬───────────────────┘
                   │ HTTP/REST
                   ▼
┌──────────────────────────────────────┐
│   Express.js Backend (Port 3001)     │
│  - POST /api/chart/birth-chart       │
│  - POST /api/chart/transits          │
│  - POST /api/chart/synastry          │
│  - GET  /api/locations               │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│      Swiss Ephemeris                 │
│  - Planetary positions (±0.0001°)    │
│  - House calculations                │
│  - CSV fallback if unavailable       │
└──────────────────────────────────────┘
```

**Tech:**
- Frontend: React 18, Vite, Tailwind CSS, shadcn/ui
- Backend: Node.js, Express.js
- License: MIT

> **Licensing note**: Swiss Ephemeris has its own license for commercial use. See [LICENSING.md](LICENSING.md).

---

## Development Setup

```bash
git clone https://github.com/The-Decans-Project/Jzero.git
cd Jzero
npm run setup        # installs both backend and frontend deps
```

Backend `.env`:
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

Frontend `.env.local` (inside `public/app/`):
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

Run both servers:
```bash
npm run dev:full
# Backend:  http://localhost:3001
# Frontend: http://localhost:3000
```

---

## Production Deployment

### Option A: Vercel (Frontend) + Railway (Backend)

**Frontend on Vercel:**
1. Go to [vercel.com/new](https://vercel.com/new) → import the GitHub repo
2. Set project root to `public/app`
3. Add environment variable: `VITE_API_BASE_URL=https://your-backend.railway.app/api`
4. Deploy

**Backend on Railway:**
1. [railway.app](https://railway.app) → new project → deploy from GitHub
2. Set environment variables:
   ```
   PORT=3001
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend.vercel.app
   ```

---

### Option B: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app

# Backend
COPY package*.json ./
RUN npm ci --only=production

# Frontend build
COPY public/app/package*.json ./public/app/
RUN cd public/app && npm ci
COPY public/app/ ./public/app/
RUN cd public/app && npm run build

COPY server/ ./server/
COPY astrology/ ./astrology/
COPY data/ ./data/

EXPOSE 3001
ENV NODE_ENV=production
CMD ["node", "server/api.js"]
```

```yaml
# docker-compose.yml
services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: production
      PORT: 3001
      CORS_ORIGIN: "*"
    restart: always
```

---

### Option C: Traditional Node.js + Nginx

Build the frontend:
```bash
cd public/app && npm run build && cd ../..
```

Nginx config:
```nginx
server {
  listen 80;
  server_name your-domain.com;

  # Serve React build
  location / {
    root /var/www/jzero/dist;
    try_files $uri $uri/ /index.html;
  }

  # Proxy API
  location /api {
    proxy_pass http://localhost:3001;
    proxy_set_header Host $host;
  }
}
```

Start backend:
```bash
NODE_ENV=production npm start
```

---

## Environment Variables

```env
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-domain.com
LOG_LEVEL=warn
CACHE_ENABLED=true
CACHE_TTL=3600
```

---

## Security Checklist

- CORS configured to your domain
- Input validation on all endpoints
- Errors don't expose sensitive data
- HTTPS enforced in production
- Environment variables not in code

---

## Troubleshooting

**Frontend not loading**
- Check `public/app/dist/` exists (run `npm run build`)
- Verify `VITE_API_BASE_URL` in `.env.local`
- Check browser console for errors

**API calls failing**
- Verify backend is running: `curl http://localhost:3001/api/health`
- Check CORS config in `server/api.js`
- Confirm frontend is pointing to the right port

**Swiss Ephemeris errors**
- Verify `swisseph` package installed: `npm install swisseph`
- Check input date is in valid range (1900-2100)
- See [SWISS_EPHEMERIS_SETUP.md](SWISS_EPHEMERIS_SETUP.md)
