# Contributing

This is an open project. Contributions are welcome.

## Licensing

- **Jzero**: MIT licensed — your contributions will be MIT too
- **Swiss Ephemeris**: Has its own separate license for commercial use — see [LICENSING.md](LICENSING.md)

## How to Help

### Report Bugs

Open an [issue](https://github.com/The-Decans-Project/Jzero/issues) with:
- What happened
- What you expected
- How to reproduce it

### Contribute Code

1. Fork the repo
2. `git checkout -b feature/your-feature`
3. Make your changes
4. Test: `npm test`
5. Try an example: `node examples/basic-birth-chart.js`
6. Open a pull request

### Improve Documentation

Typos, clearer explanations, more examples — all welcome.

## Code Guidelines

- ES6 modules (`import`/`export`)
- Descriptive names: `calculateHousePosition()` not `calcH()`
- JSDoc on all public functions:

```javascript
/**
 * Calculate house cusps
 * @param {number} jd - Julian Day (Terrestrial Time)
 * @param {number} lat - Geographic latitude (-90 to 90)
 * @param {number} lon - Geographic longitude (-180 to 180)
 * @param {string} system - House system: 'placidus', 'porphyry', 'whole-sign', 'equal'
 * @returns {Object} House cusps and angles
 */
```

- Astronomical calculations should target ±0.1° or better
- Reference Swiss Ephemeris or CSV data — not approximations

## Pull Request Process

1. One logical change per PR
2. Include tests for new calculations
3. Update relevant documentation
4. Clear commit messages describing what changed and why

## Testing

```bash
npm test              # Run all tests
npm run validate      # Tests + lint
node examples/basic-birth-chart.js   # Manual check
```

## Community Standards

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Short version: be respectful.

## Questions?

- [GitHub Discussions](https://github.com/The-Decans-Project/Jzero/discussions) for design questions
- [GitHub Issues](https://github.com/The-Decans-Project/Jzero/issues) for bugs

---

By contributing, you agree your code will be licensed under MIT.
