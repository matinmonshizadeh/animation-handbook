# 07 — Ambient & Background

Passive, looping effects that hold visual interest without demanding attention. Ambient animations run continuously, cycle slowly, and look intentional after two minutes of watching.

## Animations

| Demo | Description |
|------|-------------|
| [Animated Gradient Background](animated-gradient-background/) | Colors slowly drift across a soft gradient background. Best for hero sections. |
| [Mesh Gradient Animation](mesh-gradient/) | Blurred blobs of color drift and melt together. Best for landing pages. |
| [Aurora / Northern Lights](aurora/) | Blurred bands of light sway like the northern lights. Best for dark backgrounds. |
| [Grain / Film Noise Overlay](grain-overlay/) | Fine grain flickers over the page, like old film. Best for editorial sites. |
| [Scanline Effect](scanline/) | Dark lines and a sweeping beam imitate an old TV screen. Best for retro sites. |
| [Light Leak](light-leak/) | Warm light washes in from a corner at random times. Best for photo sites. |
| [Starfield / Space Particles](starfield/) | Stars stream toward you out of the dark. Best for space themes. |
| [Breathing / Pulsing Glow](breathing-glow/) | A soft glow slowly grows and shrinks, like calm breathing. Best for idle states. |
| [Ambient Ripple Effect](ambient-ripple/) | Rings spread from a few spots, like drops on a still pond. Best for hero areas. |
| [Floating Elements](floating-elements/) | Small shapes drift slowly, each on its own path. Best for hero backgrounds. |
| [Grid / Dot Pattern Parallax](grid-dot-pattern-parallax/) | A dot grid shifts gently against your pointer for depth. Best for tech sites. |
| [Abstract Geometric Motion](abstract-geometric-motion/) | Shapes turn, spread and flow in a calm, endless pattern. Best for music players. |
| [Particle Constellation](particle-constellation/) | Drifting dots link up with lines whenever they come close. Best for tech sites. |
| [Flow Field](flow-field/) | Particles ride invisible currents, leaving fading trails. Best for art pages. |
| [Synthwave Grid](synthwave-grid/) | A glowing grid rolls toward you under a striped sun. Best for music and games. |
| [Matrix Rain](matrix-rain/) | Columns of glowing characters rain down a dark screen. Best for tech themes. |
| [Plasma Field](plasma/) | Smooth waves of color flow endlessly, made from math. Best for creative sites. |
| [Wave Layers](wave-layers/) | Layers of waves drift sideways, each at its own speed. Best for hero sections and footers. |
| [Snow / Rain](snow-rain/) | Snow drifts down, or rain falls in streaks, over a dark town. Best for seasonal pages. |
| [Fireworks](fireworks/) | Rockets rise and burst into glowing sparks that fall and fade. Best for celebrations. |

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
| CSS transition + JS timers | Light leak (random timing) |
| JS moving elements with `transform` | Floating elements, grid parallax (pointer events and a slow drift) |
| Canvas 2D | Grain (or an SVG noise filter), starfield, ambient ripple, abstract geometric, particle constellation, flow field, synthwave grid, matrix rain, plasma |

## See also
- [06 — 3D & Advanced](../06-3d-advanced/) — GPU-intensive effects; WebGL shaders and particles
- [04 — Micro-Interactions](../04-micro-interactions/) — the opposite end: brief, triggered, reactive
