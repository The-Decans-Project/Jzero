# Architecture & Deployment Guide

## System Architecture

Jzero is a three-tier astrology calculation system:

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Port 3000)                │
│  - Birth Chart Calculator Form                              │
│  - Planetary Position Tables                                │
│  - SVG Zodiac Wheel Visualization                           │
│  - Current Transits Display                                 │
│  - Responsive UI for Desktop/Mobile                         │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST API
                       ▼
┌─────────────────────────────────────────────────────────────┐
│               Express.js Backend (Port 5000)                 │
│  - POST /api/chart/birth-chart                              │
│  - POST /api/chart/transits                                 │
│  - POST /api/chart/synastry (stub)                          │
│  - GET /api/locations                                       │
│  - Error Handling & CORS                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │ JD Calculations
                       ▼
┌─────────────────────────────────────────────────────────────┐
│          Swiss Ephemeris Engine (NPM Package)                │
│  - Planetary Position Calculations (±0.0001°)               │
│  - House Position Calculations                              │
│  - Angle Calculations (ASC, MC, DSC, IC)                    │
│  - Aspect Calculations                                      │
│  - 1950-2050 Ephemeris Data                                 │
└─────────────────────────────────────────────────────────────┘
```

## Technologies

- **Frontend**: React 18, Vite, Axios
- **Backend**: Node.js, Express.js, Swiss Ephemeris (NPM)
- **Build Tool**: Vite for frontend, standard Node.js for backend
- **Deployment**: Vercel/Netlify (frontend), Heroku/Railway/AWS (backend)
- **License**: MIT (Open Source)

⚠️ **Licensing Important**: If deploying with Swiss Ephemeris for commercial use, you must obtain a separate Swiss Ephemeris commercial license. See [LICENSING.md](LICENSING.md) for details.

## Development Setup

### 1. Initialize Project

```bash
# Clone repository
git clone https://github.com/yourusername/Jzero.git
cd Jzero

# Install backend dependencies
npm install

# Install frontend dependencies
cd public/app
npm install
cd ../..
```

### 2. Environment Configuration

**Backend (.env)**
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

**Frontend (.env.local)**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_LOG_LEVEL=info
```

### 3. Run Development Servers

Terminal 1 - Backend:
```bash
npm run server:dev
# Server running on http://localhost:5000
```

Terminal 2 - Frontend:
```bash
cd public/app
npm run dev
# Frontend running on http://localhost:3000
```

## Production Deployment

### Option A: Vercel (Frontend) + Railway (Backend)

#### Frontend Deployment (Vercel)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com/new
   - Import the GitHub repository
   - Set project root to `public/app`
   - Add environment variables:
     ```
     VITE_API_BASE_URL=https://your-backend.com/api
     ```
   - Deploy

3. **Vercel Configuration** (create `public/app/vercel.json`):
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist"
   }
   ```

#### Backend Deployment (Railway)

1. **Create Railway Project**
   - Go to https://railway.app
   - Create new project → Deploy from GitHub repo

2. **Set Environment Variables**
   ```
   PORT=5000
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend.vercel.app
   ```

3. **Deployment Script** (in `package.json`):
   ```json
   {
     "scripts": {
       "start": "node server/api.js",
       "build": "echo 'No build needed for backend'"
     }
   }
   ```

### Option B: Docker Deployment

**Dockerfile** (root):
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install backend dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy server code
COPY server/ ./server/
COPY astrology/ ./astrology/

# Install frontend dependencies
WORKDIR /app/public/app
COPY public/app/package*.json ./
RUN npm ci

# Build frontend
COPY public/app/ ./
RUN npm run build

WORKDIR /app

# Expose ports
EXPOSE 5000 3000

# Start backend (frontend served from backend)
CMD ["node", "server/api.js"]
```

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 5000
      CORS_ORIGIN: "*"
    restart: always
```

### Option C: Traditional Node.js Hosting

#### Nginx as Reverse Proxy

```nginx
upstream backend {
  server localhost:5000;
}

server {
  listen 80;
  server_name jzero.example.com;

  # Frontend (React build)
  location / {
    root /var/www/jzero/dist;
    try_files $uri $uri/ /index.html;
    add_header Cache-Control "public, max-age=31536000";
  }

  # API endpoints
  location /api {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

#### Build and Deploy

```bash
# Build frontend
cd public/app
npm run build
cd ../..

# Copy to server
scp -r public/app/dist user@server:/var/www/jzero/

# Install and start backend
npm install --production
npm start
```

## CI/CD Pipeline

### GitHub Actions Configuration

**`.github/workflows/deploy.yml`**:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm install
      
      - name: Lint
        run: npm run lint
      
      - name: Test
        run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel (Frontend)
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          npm install -g vercel
          vercel --token $VERCEL_TOKEN --prod --scope ${{ secrets.VERCEL_SCOPE }}
      
      - name: Deploy to Railway (Backend)
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          npm install -g @railway/cli
          railway up --token $RAILWAY_TOKEN
```

## Performance Optimization

### Frontend
- **Code Splitting**: Separate vendor bundles for React and Axios
- **Lazy Loading**: Load components on demand
- **Image Optimization**: SVG charts (scalable, lightweight)
- **Caching**: Far-future expires headers for built assets
- **Minification**: Vite automatically minifies production builds

### Backend
- **Response Caching**: Cache ephemeris calculations
- **Connection Pooling**: Reuse database connections if using one
- **Compression**: gzip compression enabled
- **Rate Limiting**: Prevent abuse
- **Error Handling**: Don't expose sensitive data in errors

### Example Response Times
- Birth Chart Calculation: ~100-150ms
- Transits Calculation: ~80-100ms
- City Search: ~50ms
- Full Page Load: ~1-2s (after first load with caching)

## Monitoring & Logging

### Backend Logging (Express)

```javascript
// Log API requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Log errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});
```

### Frontend Monitoring

```javascript
// Log API errors
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
```

### Recommended Services
- **Logging**: Sentry, LogRocket, DataDog
- **Monitoring**: Uptime Robot, New Relic
- **Analytics**: Plausible, Mixpanel
- **Error Tracking**: Sentry, Bugsnag

## Scaling Considerations

### Current Limits
- Handles ~100 concurrent users per backend instance
- Calculation time: 100-150ms per birth chart
- Memory usage: ~50-100MB idle per backend instance

### Scaling Strategy

1. **Horizontal Scaling**
   - Run multiple backend instances behind load balancer
   - Use Docker containers for easy scaling

2. **Caching Layer**
   - Redis for caching common calculations
   - Reduce database queries
   - Session management

3. **Database**
   - PostgreSQL for user accounts/saved charts
   - Connection pooling with PgBouncer
   - Read replicas for scaling reads

4. **CDN**
   - CloudFlare for static assets
   - Geographic distribution of frontend
   - DDoS protection

### Architecture for Scale

```
┌──────────────────────────────────────────────┐
│        CloudFlare CDN (Static Assets)        │
└────────────────────┬─────────────────────────┘
                     │
┌────────────────────▼─────────────────────────┐
│   Load Balancer (NGINX/HAProxy)              │
└──────────┬──────────────────────┬────────────┘
           │                      │
    ┌──────▼──────┐        ┌──────▼──────┐
    │ Backend 1   │        │ Backend 2   │
    │ (Node.js)   │        │ (Node.js)   │
    └──────┬──────┘        └──────┬──────┘
           │                      │
    ┌──────▼──────────────────────▼──────┐
    │    Redis Cache Layer               │
    └──────┬──────────────────────┬──────┘
           │                      │
    ┌──────▼──────┐        ┌──────▼──────┐
    │ PostgreSQL  │        │ PostgreSQL  │
    │ Primary     │        │ Replica     │
    └─────────────┘        └─────────────┘
```

## Troubleshooting Deployment

### Frontend Not Loading
- Check frontend build output: `public/app/dist/` exists
- Verify API URL in `.env.local` is correct
- Check browser console for JavaScript errors
- Verify CORS headers from backend

### API Calls Failing
- Verify backend is running on correct port
- Check CORS configuration in `server/api.js`
- Look for 502/503 errors (backend down)
- Test endpoint with curl: `curl http://localhost:5000/api/locations?q=New`

### Performance Issues
- Check network tab for slow requests
- Monitor backend CPU/memory usage
- Look for N+1 query problems
- Enable caching for ephemeris calculations

## Security Checklist

✅ CORS configured properly  
✅ Input validation on all endpoints  
✅ Errors don't expose sensitive data  
✅ Rate limiting enabled  
✅ HTTPS enforced in production  
✅ Dependencies kept updated  
✅ Environment variables not in code  
✅ API authentication (if needed)

## Additional Resources

- [Vite Documentation](https://vitejs.dev)
- [Express.js Guide](https://expressjs.com)
- [React Best Practices](https://react.dev)
- [Swiss Ephemeris](http://www.astro.com/swisseph/)
- [Deployment Platforms](https://github.com/Jzero/docs#deployment)
