# Contributing

This is a community project. All contributions are welcome.

## Important: Licensing

When contributing, please be aware:

- **Jzero**: MIT Licensed (your contributions will be under MIT)
- **Swiss Ephemeris**: Separate license (not MIT)
  - If your contribution uses Swiss, follow Swiss licensing terms
  - For commercial use of Swiss, see [LICENSING.md](LICENSING.md)
  - No MIT contribution affects Swiss licensing requirements

See [LICENSING.md](LICENSING.md) for complete details.

## How to Help

### Report Issues

Found a bug or have a question? 

- Check if it's already reported
- Open an [issue](https://github.com/The-Decans-Project/Jzero/issues) with:
  - What happened
  - What you expected  
  - How to reproduce it

### Suggest Ideas

Have an idea for improvement?

- Describe what it does and why it helps
- Add any relevant references
- Open an issue with label `enhancement`

### Contribute Code

Want to write code?

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Test them: `node examples/simple-chart.js`
5. Commit with clear messages
6. Push and open a pull request

**Code style:** Keep it simple and readable. Comments welcome.

### Improve Documentation

Documentation help is valuable. You can:

- Fix typos and unclear sections
- Add examples
- Improve explanations
- Translate to other languages

## Guidelines

- Be respectful (see [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md))
- Test your changes
- Keep commits focused
- Write clear commit messages

## Questions?

- Check existing [discussions](https://github.com/The-Decans-Project/Jzero/discussions)
- Open a new discussion
- Comment on an issue

Thank you for helping make this better!
examples/           # Working examples / tests
test/               # Test files
```

**Code Guidelines:**

1. **Naming & Style**
   - Use descriptive names: `calculateHousePosition()` not `calcH()`
   - Use ES6 modules (import/export)
   - Jest-compatible for testing

2. **Documentation**
   - Add JSDoc comments to functions:
     ```javascript
     /**
      * Calculate house cusps using a specific system
      * @param {number} jd - Julian Day (Terrestrial Time)
      * @param {number} lat - Geographic latitude (-90 to 90)
      * @param {number} lon - Geographic longitude (-180 to 180)
      * @param {string} system - House system: 'porphyry', 'whole-sign', or 'equal'
      * @returns {Object} Object with houses array and angle positions
      */
     ```

3. **Testing**
   - Test calculations against known values
   - Include edge cases (poles, international date line, etc.)
   - Use descriptive test names

4. **Accuracy**
   - Astronomical calculations must be precise to ±0.1° or better
   - Reference sources: Meeus' "Astronomical Algorithms", VSOP2013, Swiss Ephemeris
   - Include accuracy notes in comments

#### Pull Request Process

1. **Fork & Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - One logical change per PR
   - Include tests
   - Update relevant documentation

3. **Commit Messages**
   ```
   feat: implement VSOP87 planetary calculations for Mercury
   
   - Adds accurate inner planet positions to ±0.1°
   - Uses VSOP87 series from Meeus
   - Includes test against known positions for year 2000
   
   Closes #42
   ```

4. **Push & Open PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   - Link related issues: "Closes #42"
   - Describe what changed and why
   - Include any performance considerations

5. **Code Review**
   - We'll review for accuracy, style, and design
   - Questions are normal—we're learning together
   - Respond to feedback promptly

### 4. **Improve Documentation** 📖
- Fix typos or clarify existing docs
- Add examples or tutorials
- Improve architecture documentation
- Label: `documentation`

### 5. **Help with Testing** ✅
- Test calculations against reference software
- Report discrepancies
- Add test cases for edge conditions
- Label: `testing`, `validation`

## Development Workflow

### Running Tests
```bash
npm test              # Run all tests
npm test -- houses.js # Run specific test
npm test -- --watch   # Watch mode
```

### Testing Calculations
```bash
# Run examples to verify calculations
node examples/simple-chart.js
node examples/calculate-birth-chart.js
```

### Checking Accuracy
- Use reference data (Swiss Ephemeris, NASA JPL, etc.)
- Document sources in code comments
- Include margin of error in calculations

## Recognition

### Contributors List
All contributors are listed in:
- `package.json` (contributors field)
- GitHub contributors graph
- Monthly contributor highlights

### Levels of Contribution
- **Code**: Algorithm implementations, bug fixes, features
- **Testing**: Validation, accuracy verification, edge case testing
- **Documentation**: Guides, examples, architecture docs
- **Community**: Answering questions, mentoring new contributors
- **Design**: Architecture decisions, API design

## Community Standards

### Code of Conduct
See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

**TL;DR**: Be respectful, inclusive, and assume good intent.

### Getting Help
- Questions? Open a discussion in GitHub Discussions
- Stuck? Comment on an issue or post in Discussions
- Want to discuss design? Start a discussion before opening PR

## Project Structure & Responsibility

| Area | Owner/Champion | Focus |
|------|---|---|
| Core calculations (`astrology/core/`) | TBD | Accuracy, performance, astronomical correctness |
| House systems | TBD | Different calculation methods, testing |
| Planetary positions | TBD | VSOP87 integration, Swiss Ephemeris alignment |
| Utilities | TBD | Geolocation, database, helpers |
| Documentation | TBD | Examples, guides, architecture |
| Testing | Community | Validation against reference data |

(Areas available for interested contributors to champion!)

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the full development plan and upcoming features.

## Questions?

- **How do I get started?** Pick a `good-first-issue` and comment to claim it
- **Can I work on X?** Check if there's already an issue or start a discussion
- **What about Y library/algorithm?** Propose it in a discussion first
- **Who maintains this?** See CODEOWNERS and package.json

## License

By contributing to Jzero, you agree your code will be licensed under the MIT License.

---

**Thank you for making astrology software better, one calculation at a time!** 🌙⭐
