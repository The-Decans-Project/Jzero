# Jzero Frontend

React frontend for the Jzero birth chart calculator. Built with shadcn/ui and Tailwind CSS.

## Features

- **Modern UI Framework** — shadcn/ui components with Radix UI accessibility
- **Responsive Design** — Mobile-first approach, optimized for all screen sizes
- **Dark Mode** — Professional dark theme with purple brand accents
- **Fast Build** — Vite dev server with instant hot module reload (<100ms)
- **Interactive Charts** — SVG zodiac wheel with real-time planet visualization
- **Tab Navigation** — Easy switching between Calculator, Chart, and Transits
- **Type-Safe** — React hooks with modern ES6+ patterns
- **Accessible** — WCAG AA compliance via Radix UI primitives

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 18 + Vite | Modern UI with fast builds |
| **Components** | shadcn/ui | Production-ready, accessible components |
| **Styling** | Tailwind CSS + PostCSS | Utility-first CSS, responsive design |
| **Icons** | Lucide React | 400+ professional SVG icons |
| **Utilities** | clsx + tailwind-merge | Smart className merging |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend server running on `http://localhost:3001`

### Installation

```bash
# Install dependencies
npm install

# Create local environment
cp .env.example .env.local
```

### Development

```bash
# Start development server with hot reload
npm run dev

# The app will open at http://localhost:3000
# Page automatically reloads when files change (~100ms)
```

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview

# Built files are in the dist/ directory (~200KB gzipped with tree-shaking)
```

## 📁 Project Structure

```
public/app/
├── src/
│   ├── App.jsx                          # Main app component with Tabs
│   ├── index.jsx                        # React entry point
│   ├── index.css                        # Global Tailwind + theme variables
│   ├── components/
│   │   ├── BirthChartForm.jsx           # Form using Tailwind grid layout
│   │   ├── PlanetaryTable.jsx           # Responsive table with Tailwind
│   │   ├── ChartDisplay.jsx             # SVG chart + legend
│   │   ├── TransitsViewer.jsx           # Card grid layout
│   │   └── ui/                          # shadcn/ui components
│   │       ├── tabs.jsx                 # Tabs (Radix + Tailwind)
│   │       ├── alert.jsx                # Alert component
│   │       └── ...
│   └── lib/
│       └── utils.js                     # cn() className helper
├── index.html                           # HTML entry point
├── package.json                         # Dependencies and scripts
├── vite.config.js                       # Vite configuration
├── tailwind.config.js                   # Tailwind theme config
├── postcss.config.js                    # PostCSS pipeline
├── .eslintrc.json                       # ESLint rules
├── .env.example                         # Environment variables template
└── .gitignore                           # Git ignore rules
```

## 🎨 Styling System

### Tailwind CSS

All components use Tailwind utility classes:

```jsx
// Example: Responsive button with Tailwind
<button className="md:hidden lg:block bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
  Click me
</button>

// Responsive utilities:
// sm: 640px,  md: 768px,  lg: 1024px,  xl: 1280px
// hidden md:block = hidden on mobile, visible on tablet+
```

### Theme Configuration

Theme colors defined in `tailwind.config.js` with CSS custom properties in `src/index.css`:

- **Primary**: Purple (#7c3aed) — Jzero brand color
- **Secondary**: Slate (#64748b) — UI elements
- **Destructive**: Red (#ef4444) — Errors and alerts
- **Muted**: Slate-600 (#475569) — Disabled states
- **Accent**: Purple-400 (#a78bfa) — Highlights

### Dark Mode

Automatically applied via `.dark` class on `<html>` element:

```css
/* Defined in tailwind.config.js */
darkMode: 'class',  /* Use class strategy, not media query */
```

## 🧩 shadcn/ui Components

### tabs.jsx

Accessible tab interface using Radix UI:

```jsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

<Tabs defaultValue="calculator">
  <TabsList>
    <TabsTrigger value="calculator">Calculator</TabsTrigger>
    <TabsTrigger value="chart">Chart</TabsTrigger>
  </TabsList>
  <TabsContent value="calculator">
    {/* Content */}
  </TabsContent>
</Tabs>
```

### alert.jsx

Alert/notification component:

```jsx
import { Alert, AlertDescription } from '@/components/ui/alert';

<Alert variant="destructive">
  <AlertDescription>Error message here</AlertDescription>
</Alert>
```

## 🔌 API Integration

All API calls use native `fetch` API (no axios needed):

```javascript
// Example API call
const response = await fetch('http://localhost:3001/api/calculate-chart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});

const data = await response.json();
```

### Environment Configuration

Create a `.env.local` file (copy from `.env.example`):

The frontend communicates with the backend REST API:

### Birth Chart Calculation
```javascript
// POST /api/chart/birth-chart
{
  date: "1990-07-23",
  time: "14:30",
  latitude: 40.7128,
  longitude: -74.0060,
  timezone: "America/New_York"
}
```

### Current Transits
```javascript
// POST /api/chart/transits
{
  birthChart: { /* full chart data */ }
```

## 🎯 Environment Variables

Create `.env.local`:

```env
# API endpoint (default: backend on port 5000)
VITE_API_BASE_URL=http://localhost:3001/api

# App title for browser tab
VITE_APP_TITLE=Jzero - Astrology Birth Chart Calculator

# Feature flags
VITE_ENABLE_TRANSITS=true

# Log level
VITE_LOG_LEVEL=info
```

## 📡 API Integration

Backend endpoints used:

### Birth Chart Calculation
```
POST /api/chart/birth-chart
Content-Type: application/json

{
  "year": 1990,
  "month": 7,
  "day": 23,
  "hour": 14,
  "minute": 30,
  "latitude": 40.7128,
  "longitude": -74.0060,
  "timezone": "America/New_York"
}

Response:
{
  "planets": {
    "sun": { "longitude": 29.5, "sign": "Aquarius", ... },
    ...
  },
  "houses": { "1": 5.2, "2": 35.5, ... },
  "angles": { "asc": 5.2, "mc": 135.8, ... }
}
```

### Current Transits
```
POST /api/chart/transits
Content-Type: application/json

{
  "birthChart": { /* full chart data */ }
}

Response:
{
  "transits": [
    {
      "planet": "Sun",
      "position": 12.5,
      "aspects": [
        { "type": "Conjunction", "target": "Moon", "orb": 2.3 }
      ]
    }
  ]
}
```

### City Search
```
GET /api/locations?search=New York

Response:
[
  {
    "name": "New York, NY, United States",
    "longitude": -74.0060,
    "latitude": 40.7128,
    "timezone": "America/New_York"
  }
]
```

## 🏗️ Component Architecture

### App.jsx

Main application component built with shadcn/ui Tabs:

```jsx
– Manages tab state (calculator, chart, transits)
– Fetches chart data from backend
– Handles loading and error states
– Responsive layout with dark theme
```

**Key Features:**
- Uses shadcn Tabs for tab navigation
- Alert component for error display
- Loader icon from lucide-react
- Full-page dark gradient background
- Mobile responsive with Tailwind breakpoints

### BirthChartForm.jsx

Birth data input form using Tailwind grid layout:

```jsx
Grid Layout: md:grid-cols-2 (1 col mobile, 2 cols tablet+)

Form Fields:
– Date input (HTML5 date picker)
– Time input (HTML5 time picker)
– Location search (city autocomplete)
– Latitude/Longitude inputs
– Timezone selector
– Submit button with gradient background
```

**Styling:**
- Tailwind utility classes (no CSS file)
- Focus states with ring utilities
- Dark theme matching app
- Responsive spacing and sizing

### PlanetaryTable.jsx

Responsive table displaying planetary positions:

```jsx
Responsive Table:
– All columns visible on desktop
– Hidden on mobile: Latitude, Distance (md:hidden, lg:hidden)
– Sticky header with scroll
– Hover effects on rows
– Center-aligned numeric columns

Columns: Planet, Sign, Degree, Longitude, [Latitude], [Distance]
```

**Styling:**
- Tailwind table utilities
- Border utilities (divide-y, divide-slate-700)
- Background colors (hover:bg-slate-800/30)
- Text sizing and alignment

### ChartDisplay.jsx

SVG zodiac wheel visualization with legend:

```jsx
Chart Container:
– SVG canvas (300×300 or responsive)
– Drop shadow effect (drop-shadow-lg)
– Centered zodiac wheel
– Planet circles (blue, radius 8px)
– Angle markers (red squares)
– Legend grid (2 columns)

Legend:
– Planet name, sign, degree
– Color-coded circles
– Tailwind grid layout
```

### TransitsViewer.jsx

Card grid showing current planetary transits:

```jsx
Responsive Grid:
– 1 column on mobile
– 2 columns on tablet (md:grid-cols-2)
– 3 columns on desktop (lg:grid-cols-3)

Each Card:
– Planet name and current position
– Birth position and difference
– Aspect type and exactness
– Interpretation text
– Tailwind border and background styling
```

## 🛠️ Development Workflow

### Component Development

1. **Create new component** in `src/components/`
2. **Add Tailwind classes** directly to JSX elements
3. **Use shadcn/ui components** for common patterns
4. **Import utilities** from `src/lib/utils.js` (especially `cn()`)

Example:

```jsx
import { cn } from '@/lib/utils';

export function MyComponent({ variant }) {
  return (
    <div className={cn(
      'p-4 rounded-lg border',
      variant === 'error' ? 'border-red-500 bg-red-50' : 'border-slate-300'
    )}>
      Content
    </div>
  );
}
```

### Responsive Design

Use Tailwind breakpoint prefixes:

```jsx
<div className="
  grid
  grid-cols-1          /* Mobile: 1 column */
  md:grid-cols-2       /* Tablet+: 2 columns */
  lg:grid-cols-3       /* Desktop+: 3 columns */
  gap-4
">
  {/* Items */}
</div>
```

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Vercel detects vite.config.js and builds automatically
# Set VITE_API_BASE_URL in Vercel environment variables
```

### GitHub Pages

```bash
# Update vite.config.js:
# export default defineConfig({
#   base: '/jzero-frontend/'
# })

npm run build
git add dist/
git commit "Build"
git push
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

Build: `docker build -t jzero-frontend .`
Run: `docker run -p 3000:3000 jzero-frontend`

## ✅ Testing

Run linter:
```bash
npm run lint
```

Fix issues:
```bash
npm run lint -- --fix
```

## 📚 Learn More

- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com/
- **Radix UI**: https://www.radix-ui.com/
- **Vite**: https://vitejs.dev/guide/
- **React**: https://react.dev/

## 💡 Contributing

To contribute:

1. Create a feature branch
2. Make changes in components
3. Update documentation
4. Test responsiveness
5. Submit pull request

See [../../CONTRIBUTING.md](../../CONTRIBUTING.md) for full guidelines.

### Linting
```bash
npm run lint          # Check code quality
npm run lint -- --fix # Auto-fix issues
```

### Adding New Components

```jsx
/**
 * MyComponent
 * @param {Object} props - Component props
 * @param {string} props.title - Component title
 * @returns {React.ReactElement}
 */
function MyComponent({ title }) {
  return (
    <div className="my-component">
      <h2>{title}</h2>
    </div>
  );
}

export default MyComponent;
```

Create accompanying CSS in `components/MyComponent.css` with class naming:
```css
.my-component { /* styles */ }
.my-component h2 { /* styles */ }
```

## Performance Optimization

- **Code Splitting**: Vite automatically bundles vendor code separately
- **Lazy Loading**: Components can be lazy-loaded with React.lazy()
- **Image Optimization**: SVG for charts (scalable, lightweight)
- **CSS Optimization**: Vite purges unused CSS
- **Production Build**: Minified and tree-shaken

### Bundle Analysis
```bash
# Monitor bundle size in development
npm run build -- --analyze
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android Latest

## Troubleshooting

### API Connection Issues
- Verify backend is running on port 5000
- Check `VITE_API_BASE_URL` in `.env.local`
- Look for CORS errors in browser console
- Ensure backend has CORS properly configured

### Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run build
```

### Port Already in Use
```bash
# Change dev port in vite.config.js server.port
# Or kill process using port 3000:
lsof -ti:3000 | xargs kill -9
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) in the root directory.

## License

MIT License - See [LICENSE](../../LICENSE)

## Support

- **Issues**: [GitHub Issues](https://github.com/The-Decans-Project/Jzero/issues)
- **Discussions**: [GitHub Discussions](https://github.com/The-Decans-Project/Jzero/discussions)
