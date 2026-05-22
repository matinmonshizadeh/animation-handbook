# Animation Atlas

A visual reference of 100 web animation techniques. Each entry is a
self-contained HTML demo with an explanation of the mechanic — open
any file in a browser and it runs offline, no build step.

## Categories

| # | Category | Animations |
|---|----------|-----------|
| 01 | [Scroll-Based](animations/01-scroll-based/) | 19 |
| 02 | [Entrance & Exit](animations/02-entrance-and-exit/) | 13 |
| 03 | [Page Transitions](animations/03-page-transitions/) | 12 |
| 04 | [Micro-Interactions](animations/04-micro-interactions/) | 17 |
| 05 | [Text & Typography](animations/05-text-typography/) | 11 |
| 06 | [3D & Advanced](animations/06-3d-advanced/) | 16 |
| 07 | [Ambient & Background](animations/07-ambient-background/) | 12 |

## What's inside each entry

Every animation folder contains:

- `index.html` — a working demo with live controls (single file, runs offline)
- `README.md` — what it is, when to use it, how it works, key parameters, production notes, and related techniques

## Design principles

**One technique, one file.** No build step, no frameworks, no external
dependencies. Open the HTML and it runs.

**Show, then explain.** The demo is the main artifact. The README supports it.

**Technique over tool.** GSAP, Framer Motion, and Three.js get mentioned in
production notes — they are never the subject of an entry.

## Contributing

Each animation lives under `animations/<category>/<slug>/` with exactly
`index.html` and `README.md`. See [CLAUDE.md](CLAUDE.md) for the full
authoring guide — file templates, taxonomy rules, and responsiveness
requirements.
