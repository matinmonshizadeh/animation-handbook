# 07 — Ambient & Background

Passive, looping effects that hold visual interest without demanding attention. Ambient animations run continuously, cycle slowly, and look intentional after two minutes of watching.

## Animations

| Demo | Description |
|------|-------------|
| [Animated Gradient Background](animated-gradient-background/) | CSS gradient shifts hue and position — pure CSS, no JS, seamless loop |
| [Mesh Gradient](mesh-gradient/) | Blurred radial gradient blobs drift slowly — the Stripe aesthetic |
| [Aurora / Northern Lights](aurora/) | Tall color bands drift and skew — heavy blur fakes the curtain of light |
| [Grain / Film Noise Overlay](grain-overlay/) | Animated noise at 5–10% opacity adds cinematic warmth |
| [Scanline](scanline/) | CRT horizontal lines + optional sweep beam and phosphor glow |
| [Light Leak](light-leak/) | Warm gradient fires at random irregular intervals — analog film aesthetic |
| [Starfield](starfield/) | Stars drift outward from center with parallax depth — slow ambient speed |
| [Breathing Glow](breathing-glow/) | Radial glow expands/contracts on a 5s breath cycle — calm resting state |
| [Ambient Ripple](ambient-ripple/) | Concentric rings emit periodically from sources — passive, not click-driven |
| [Floating Elements](floating-elements/) | Geometric shapes drift on independent sine-wave paths — SaaS hero pattern |
| [Grid / Dot Pattern Parallax](grid-dot-pattern-parallax/) | Pattern shifts subtly opposite to mouse — depth felt, not seen |
| [Abstract Geometric Motion](abstract-geometric-motion/) | Four hypnotic loops — polygons, rings, bars, flowing lines |
| [Particle Constellation](particle-constellation/) | Drifting nodes link with lines when they come close — the network-mesh hero background |
| [Flow Field](flow-field/) | Particles follow a noise-driven vector field, leaving flowing trails |
| [Synthwave Grid](synthwave-grid/) | A perspective grid scrolls toward a glowing sun — the retro synthwave horizon |
| [Matrix Rain](matrix-rain/) | Columns of glowing characters fall on canvas — bright leaders, fading trails |
| [Plasma Field](plasma/) | Summed sine fields make a flowing, organic color plasma on canvas |

## The ambient mindset

**Passive**: runs continuously without user triggers. No events, no clicks, no narrative beats.

**Long cycles**: 15–30 second loops are normal here. Below 8 seconds, the motion becomes distracting. Above 30 seconds, it's nearly imperceptible. 20 seconds is the sweet spot.

**Intentional after 2 minutes**: unlike micro-interactions (brief and punchy), ambient effects must remain visually satisfying after extended watching. If you'd want to skip it after 30 seconds, it's too event-driven.

**Seamless loops**: no visible reset point. The loop should be impossible to identify without external timing.

**Subtlety is the technique**: grain at 8% opacity, parallax at 5% strength, glow at 0.6 opacity. Ambient effects work by being just barely perceptible — the user feels depth and life without being able to point to the source.

## Implementation summary

| Approach | Used by |
|----------|---------|
| Pure CSS keyframes | Animated gradient, mesh gradient, aurora, breathing glow, scanline |
| CSS + JS (controls) | Light leak (random timing), grid parallax (mousemove) |
| Canvas 2D | Grain, starfield, ambient ripple, floating elements, abstract geometric |

## See also
- [06 — 3D & Advanced](../06-3d-advanced/) — GPU-intensive effects; WebGL shaders and particles
- [04 — Micro-Interactions](../04-micro-interactions/) — the opposite end: brief, triggered, reactive
