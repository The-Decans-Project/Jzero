# Jzero

Accurate, open-source astrology calculations. Free forever.

---

## Why This Exists

I looked for a reliable, open astrology calculation library and couldn't find one that was accurate, well-documented, and free without strings attached. So I built it.

Jzero is my way of giving that back. If you're building an astrology app, learning astronomical math, or just curious — this is yours to use, modify, and share.

No paywalls. No licenses to negotiate. Just the math, done right.

---

## What It Does

Jzero calculates birth charts, transits, synastry, and house cusps using Swiss Ephemeris — the same engine professional astrology software relies on. It's accurate to ±0.0001°.

You can use it as a JavaScript library, as an HTTP API from any language, or fork it and port it to whatever stack you're working in. It's MIT licensed. Do what you want with it.

---

## Getting Started

```bash
git clone https://github.com/The-Decans-Project/Jzero.git
cd Jzero
npm install
node examples/basic-birth-chart.js
```

Full documentation in [QUICKSTART.md](QUICKSTART.md). API docs in [SERVER_API.md](SERVER_API.md).

---

## For Developers

The codebase is modular and well-documented. Core calculations are separated from higher-level techniques, so it's easy to understand, extend, or contribute to.

- [ARCHITECTURE.md](ARCHITECTURE.md) — how it's structured
- [CONTRIBUTING.md](CONTRIBUTING.md) — how to get involved
- [examples/](examples/) — working code to get you started

If you find a bug, open an issue. If you want to add something, open a PR. All skill levels welcome.

---

## License

MIT. Commercial use is fine — just be aware that [Swiss Ephemeris has its own license](SWISS_EPHEMERIS_SETUP.md) for commercial deployments.

---

## Support

This is a personal project, built and maintained in my own time. If it helps you build something, a coffee goes a long way.

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-☕-yellow)](https://www.buymeacoffee.com/thedecanproject)
