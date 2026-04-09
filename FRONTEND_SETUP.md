# Frontend Setup Guide — React + shadcn/ui + Tailwind CSS

This guide explains the frontend technology stack and how to extend it.

## Overview

The Jzero frontend uses a modern component-driven architecture:

```
┌─────────────────────────────────────┐
│     React 18 Components             │
└──────────────┬──────────────────────┘
               │
┌──────────────┴──────────────────────┐
│  shadcn/ui Components               │  Accessible, ready-to-use
│  (Radix UI + Tailwind Styling)      │  (Tabs, Alert, etc.)
└──────────────┬──────────────────────┘
               │
┌──────────────┴──────────────────────┐
│  Tailwind CSS Utilities             │  Utility-first styling
│  (@tailwind directives)             │  Responsive design
└──────────────┬──────────────────────┘
               │
┌──────────────┴──────────────────────┐
│  PostCSS Pipeline                   │  Compilation and optimization
│  (tailwindcss + autoprefixer)       │
└─────────────────────────────────────┘
```

## Styling Architecture

### Tailwind CSS Utility Classes

Instead of writing CSS files, Tailwind provides utility classes:

**Traditional CSS:**
```css
/* BirthChartForm.css */
.form-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  padding: 1rem;
}
```

**Tailwind CSS:**
```jsx
// BirthChartForm.jsx
<div className="grid grid-cols-2 gap-6 p-4">
  {/* No CSS file needed! */}
</div>
```

### Responsive Design

Breakpoints use prefixes:

```jsx
{/* Responsive grid: 1 col mobile, 2 cols tablet, 3 cols desktop */}
<div className="
  grid
  grid-cols-1        // 0px and up
  md:grid-cols-2     // 768px and up
  lg:grid-cols-3     // 1024px and up
  gap-4
">
  {/* Items */}
</div>
```

### Dark Mode

Tailwind automatically switches colors with `.dark` class:

```jsx
{/* Text color changes in dark mode */}
<p className="text-gray-900 dark:text-gray-100">
  Text color: Black in light mode, White in dark mode
</p>
```

Defined in `tailwind.config.js`:
```javascript
darkMode: 'class',  // Use class-based dark mode (not media query)
```

## Component Library Structure

### shadcn/ui Pattern

shadcn/ui wraps Radix UI primitives with Tailwind styling:

```jsx
// 1. Radix UI provides accessible primitive
import * as Tabs from "@radix-ui/react-tabs"

// 2. shadcn adds Tailwind styling
const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1",
      className  // Allow overrides
    )}
    {...props}
  />
))

// 3. Consumer uses simple API
<Tabs.Root>
  <Tabs.List>
    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
  </Tabs.List>
</Tabs.Root>
```

### Creating New shadcn/ui Components

**Pattern to follow:**

1. **Create wrapper** in `src/components/ui/mycomponent.jsx`
2. **Import Radix primitive**
3. **Add Tailwind utility classes** with `cn()` function
4. **Export for use**

Example — Alert component wrapper:

```jsx
// src/components/ui/alert.jsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Alert = React.forwardRef(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7",
        variant === "default" && "bg-white text-slate-950 border-slate-200",
        variant === "destructive" &&
          "border-destructive/50 text-destructive bg-destructive/10",
        className
      )}
      {...props}
    />
  )
)
Alert.displayName = "Alert"

export { Alert }
```

## Dependencies

### Core Dependencies

| Package | Purpose | Size |
|---------|---------|------|
| `react` | UI framework | ~40KB |
| `react-dom` | DOM rendering | ~40KB |
| `@radix-ui/react-tabs` | Accessible tabs | ~20KB |
| `@radix-ui/react-dialog` | Modal dialogs | ~25KB |
| `tailwindcss` | Styling engine | ~3.3MB (dev only) |
| `clsx` | Conditional classes | ~2KB |
| `tailwind-merge` | Merge Tailwind classes | ~4KB |
| `lucide-react` | Icons (400+ SVG) | ~50KB |

### Dev Dependencies

| Package | Purpose |
|---------|---------|
| `vite` | Build tool |
| `@vitejs/plugin-react` | React support in Vite |
| `postcss` | CSS processor |
| `autoprefixer` | Browser prefixes |
| `eslint` | Code quality |

### Installation

```bash
npm install
```

Installs dependencies from `package.json`.

## Configuration Files

### tailwind.config.js

Theme configuration:

```javascript
// src/tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",  // Scan these files for class names
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7c3aed",    // Jzero brand purple
        secondary: "#64748b",  // Slate
      },
      spacing: {
        // Add custom spacing if needed
      },
    },
  },
  plugins: [],
}
```

The `content` array tells Tailwind which files to scan for utility classes. This enables tree-shaking (removes unused CSS).

### postcss.config.js

CSS processing pipeline:

```javascript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

Runs Tailwind CSS processing followed by autoprefixer (adds browser prefixes like `-webkit-`).

### vite.config.js

Build configuration:

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  
  // Optimization settings
  build: {
    rollupOptions: {
      output: {
        // ... chunk splitting config
      }
    }
  },
  
  // Dev server
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
```

## Common Tailwind Patterns

### Buttons

```jsx
// Primary button
<button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
  Click me
</button>

// Secondary (outline)
<button className="border-2 border-slate-300 text-slate-900 hover:bg-slate-50 px-4 py-2 rounded">
  Secondary
</button>

// Disabled
<button className="opacity-50 cursor-not-allowed" disabled>
  Disabled
</button>
```

### Forms

```jsx
// Input field
<input className="
  w-full
  px-3 py-2
  border border-slate-300
  rounded
  focus:outline-none focus:ring-2 focus:ring-purple-500
  dark:bg-slate-800 dark:border-slate-600
" />

// Label + input group
<div className="mb-4">
  <label className="block text-sm font-medium mb-2">
    Your Name
  </label>
  <input className="..." />
</div>
```

### Responsive Grid

```jsx
{/* Changes columns at breakpoints */}
<div className="
  grid
  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
  gap-4
">
  <div>Item 1</div>
  <div>Item 2</div>
  {/* ... */}
</div>
```

### Flex Layouts

```jsx
{/* Horizontal centering */}
<div className="flex items-center justify-center h-screen">
  <div>Centered content</div>
</div>

{/* Vertical stack with space between */}
<div className="flex flex-col justify-between h-screen">
  <header>Header</header>
  <main>Content</main>
  <footer>Footer</footer>
</div>
```

### Cards

```jsx
{/* Styled card with border and shadow */}
<div className="
  bg-white
  border border-slate-200
  rounded-lg
  shadow-md
  p-6
  space-y-4
">
  <h3 className="text-lg font-semibold">Card Title</h3>
  <p className="text-slate-600">Card content</p>
</div>
```

## Helper Functions

### cn() — Merge Tailwind Classes

Located in `src/lib/utils.js`:

```javascript
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
```

**Why needed?** Tailwind has conflicting utility classes (e.g., `w-full` vs `w-1/2`). `twMerge` intelligently resolves conflicts:

Usage:

```jsx
// Merge conditional classes with Tailwind conflict resolution
const colorClass = isError ? "bg-red-500" : "bg-green-500"
<div className={cn("p-4 rounded", colorClass)}>
  Content
</div>
```

## 🚀 Development Workflow

### Adding a New Component

1. **Create file** `src/components/MyComponent.jsx`
2. **Use Tailwind classes** directly
3. **Use `cn()` for conditionals**
4. **Import in parent**

Example:

```jsx
// src/components/PlanetCard.jsx
import { cn } from "@/lib/utils"

export function PlanetCard({ planet, isRetrograde }) {
  return (
    <div className={cn(
      "p-4 rounded-lg border",
      "bg-slate-800 border-slate-700",
      isRetrograde && "bg-red-900/20 border-red-500"
    )}>
      <h3 className="font-semibold text-white">
        {planet.name}
      </h3>
      <p className="text-sm text-slate-300">
        {planet.longitude}°
      </p>
    </div>
  )
}
```

### Hot Module Reload (HMR)

Vite provides instant feedback during development:

```bash
npm run dev
```

Change a file → automatic browser reload (<100ms)

### Building for Production

```bash
npm run build
```

Creates optimized bundle in `dist/`:
- Tree-shaken CSS (~15KB)
- Minified JavaScript
- Asset optimization

## Resources

### Official Docs
- **Tailwind CSS**: https://tailwindcss.com/
- **shadcn/ui**: https://ui.shadcn.com/
- **Radix UI**: https://www.radix-ui.com/
- **Vite**: https://vitejs.dev/
- **React**: https://react.dev/

### Useful Tools
- **Tailwind CSS IntelliSense** (VS Code) — Class autocomplete
- **Tailwind CSS DevTools** (Chrome) — Inspect Tailwind classes
- **Color palette generator** — https://tailwindcss.com/resources

## 🔄 Migration from Custom CSS

If adding old CSS files, consider converting to Tailwind:

**Before (Custom CSS):**
```css
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-label {
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
}
```

**After (Tailwind):**
```jsx
<div className="flex flex-col gap-2 mb-4">
  <label className="font-semibold text-sm text-gray-700">
    {/* Content */}
  </label>
</div>
```

Benefits:
- No separate CSS files
- Type-safe className strings
- Tree-shaking unused styles
- Faster iteration (instant HMR)
- Consistent design tokens

## Best Practices

1. **Use Tailwind utility classes** instead of custom CSS
2. **Leverage `cn()` function** for conditional styling
3. **Create shadcn/ui components** for reusable patterns
4. **Keep components small** and focused
5. **Use responsive prefixes** (md:, lg:, xl:) for mobile-first design
6. **Document component props** with JSDoc
7. **Use ESLint** to enforce code quality

## Troubleshooting

### Classes not applying

Check `tailwind.config.js` content paths:
```javascript
content: [
  "./index.html",
  "./src/**/*.{js,jsx}",  // Make sure this matches your files
]
```

Run: `npm run build` to verify CSS generation.

### Build size too large

Enable tree-shaking in `vite.config.js`:
```javascript
build: {
  minify: 'terser',
  rollupOptions: {
    output: {
      manualChunks: {
        // Split vendor bundles
      }
    }
  }
}
```

### Hot reload not working

Restart dev server:
```bash
npm run dev
```

Check that all files are saved (VS Code might show modified files).

## Next Steps

1. Read [public/app/README.md](public/app/README.md) for component details
2. Study existing components (BirthChartForm, PlanetaryTable, etc.)
3. Explore Tailwind docs for styling patterns
4. Try adding a new shadcn/ui component
5. Experiment with responsive design at different breakpoints
