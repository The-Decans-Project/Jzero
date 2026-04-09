# Jzero Astrology Framework

A comprehensive JavaScript framework providing all the essential building blocks for astrology applications, designed so developers can build upon it rather than being a complete software solution.

## 🎯 What This Framework Provides

This framework gives you the core calculations, data structures, and utilities needed to build astrology applications. It's intentionally designed as a "starter kit" that handles the complex astronomical calculations while leaving the UI, integration, and final application development to you.

### Core Features

- **Ephemeris Calculations**: Basic planetary position calculations (replace with Swiss Ephemeris for production)
- **House Systems**: Equal, Porphyry, Whole Sign, and basic Placidus implementations
- **Transits**: Current planetary positions and transit aspects
- **Synastry**: Chart comparison for relationships with compatibility scoring
- **Progressions**: Secondary progressions, solar arc directions, and solar returns
- **Time Utilities**: Julian days, sidereal time, timezone conversions
- **Location Database**: City lookup with coordinates and timezones
- **Chart Database**: Basic CRUD operations for chart storage
- **Report System**: Extensible reporting framework

## 🚀 Quick Start

1. **Open the project** in your development environment
2. **Open `index.html`** in your browser to see the demo
3. **Extend the modules** with your own calculations and UI

## 📁 Project Structure

```
astrology/
├── calculations/          # Core calculation modules
│   ├── ephemeris.js      # Planetary position calculations
│   ├── house-systems.js  # House cusp calculations
│   ├── transits.js       # Current planetary positions
│   ├── synastry.js       # Chart comparison
│   └── progressions.js   # Predictive techniques
├── utilities/            # Helper utilities
│   ├── time-utils.js     # Date/time conversions
│   ├── location-database.js # City/coordinates lookup
│   └── chart-database.js # Chart storage operations
├── controllers/          # MVC controllers
├── models/              # Data models
├── sample-data/         # Example charts
└── index.html           # Demo page
```

## 💡 How to Use

### Calculate a Natal Chart

```javascript
// Create a chart object
var chart = new Chart({
    name: 'John Doe',
    birthdate: '1990-05-15T14:30:00Z',
    location: 'New York, USA'
});

// Calculate planetary positions (implement your own ephemeris)
chart[Sun] = { longitude: 245.5, sign: Taurus, degree: 25, minutes: 30 };
chart[Moon] = { longitude: 120.3, sign: Virgo, degree: 15, minutes: 20 };
// ... add other planets

// Calculate aspects
var aspects = chart.getAllAspects();
```

### Calculate Transits

```javascript
// Get current transits for a natal chart
var natalChart = ChartController.getAllCharts()[0];
var transits = Transits.calculateTransits(natalChart, new Date());

// Find upcoming significant transits
var upcoming = Transits.findUpcomingTransits(natalChart, 30); // Next 30 days
```

### Synastry Analysis

```javascript
// Compare two charts for relationships
var synastry = Synastry.calculateSynastry(chart1, chart2);

console.log('Compatibility score:', synastry.scores.overall);
console.log('Relationship themes:', synastry.findRelationshipThemes(synastry));
```

### Progressions

```javascript
// Calculate secondary progression
var progressed = Progressions.calculateSecondaryProgression(natalChart, 25);

// Calculate solar return
var solarReturn = Progressions.calculateSolarReturn(natalChart, 2024);
```

## 🔧 Extending the Framework

### Replace Ephemeris Calculations

The included ephemeris calculations are simplified approximations. For production use:

1. **Swiss Ephemeris**: Use the professional astronomical library
2. **Web APIs**: Integrate with astrology API services
3. **Custom Calculations**: Implement your own astronomical algorithms

### Add More House Systems

Extend `house-systems.js` with additional systems:

```javascript
HouseSystems.kampanus = function(ascendant, midheaven, latitude) {
    // Implement Kampanus house system
    // ...
};
```

### Database Integration

Replace the in-memory chart database with a real database:

```javascript
// Extend ChartDatabase to use localStorage, IndexedDB, or server API
ChartDatabase.saveChart = function(chart) {
    // Your database implementation
};
```

### Add UI Components

Create chart wheels, aspect grids, and interactive displays:

```javascript
// Example: Chart wheel rendering
function drawChartWheel(chart, canvas) {
    // Implement SVG/Canvas chart wheel
}
```

## 📚 Key Modules Explained

### Ephemeris (`calculations/ephemeris.js`)
- Basic planetary position calculations
- Moon phase calculations
- Framework for astronomical accuracy

### House Systems (`calculations/house-systems.js`)
- Multiple house system implementations
- House ruler calculations
- Planet-to-house assignments

### Transits (`calculations/transits.js`)
- Current planetary positions
- Transit aspect calculations
- Void-of-course Moon detection

### Synastry (`calculations/synastry.js`)
- Inter-chart aspect analysis
- Composite chart calculations
- Relationship compatibility scoring

### Progressions (`calculations/progressions.js`)
- Secondary progressions
- Solar arc directions
- Solar and lunar returns

### Time Utils (`utilities/time-utils.js`)
- Julian day calculations
- Timezone conversions
- Sidereal time calculations

### Location Database (`utilities/location-database.js`)
- City coordinate lookup
- Timezone information
- Geographic distance calculations

## 🎯 Development Philosophy

This framework follows the principle of "just enough, but not too much":

- ✅ Provides core astronomical calculations
- ✅ Includes essential astrology data structures
- ✅ Offers extensible architecture
- ✅ Leaves UI and application logic to developers
- ❌ Is not a complete astrology software
- ❌ Does not include user interfaces
- ❌ Does not handle all edge cases

## 📖 Learning Resources

- [Swiss Ephemeris](https://www.astro.com/swisseph/) - Professional astronomical calculations
- [Astrology APIs](https://www.astrology-api.com/) - Web service alternatives
- [Open Source Astrology](https://github.com/topics/astrology) - Community projects
- [Astronomical Algorithms](https://www.willbell.com/math/) - Technical references

## 🤝 Contributing

This is a starter framework designed to be extended. Consider:

1. Adding more house systems
2. Implementing additional asteroids
3. Creating fixed star calculations
4. Adding more predictive techniques
5. Building UI components
6. Integrating with databases

## 📄 License

MIT License - See LICENSE file in the root directory.

---

**Remember**: This framework provides the building blocks. The artistry of astrology interpretation and the user experience are yours to create!