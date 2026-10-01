# 06 — 3D & Advanced

WebGL, shaders, particles, 3D transforms, and the performance-sensitive effects that push the browser's limits. The demos that move by themselves have Pause (SVG Path Animation has Replay and Loop); the ones you hover, click or scroll have Show me or Play.

## Animations

| Demo | Description |
|------|-------------|
| [3D Model Orbit](3d-model-orbit/) | A lit 3D shape spins, or turns to face your pointer. Best for product views. |
| [Scroll-Driven 3D Rotation](scroll-driven-3d-rotation/) | Scrolling turns a 3D cube from pose to pose. Best for product tours. |
| [Parallax 3D Tilt](parallax-3d-tilt/) | A card tilts toward your pointer, and a light slides over it. Best for cards. |
| [Canvas Particle Effect](canvas-particle-effect/) | Dots drift, link up when close, and dodge your pointer. Best for tech sites. |
| [Fluid Simulation](fluid-simulation/) | Blobs drift and melt into each other like liquid. Best for hero backgrounds. |
| [Glassmorphism Animated](glassmorphism-animated/) | Frosted glass cards blur the colors behind them. Best for cards and panels. |
| [WebGL Shader Animation](webgl-shader-animation/) | Moving color patterns computed for every pixel. Best for bold backgrounds. |
| [Noise-Based Motion](noise-based-motion/) | Smooth noise makes dots sway and a blob ripple. Best for calm backgrounds. |
| [SVG Path Animation](svg-path-animation/) | A line drawing draws itself, stroke by stroke. Best for icons and logos. |
| [Chromatic Aberration](chromatic-aberration/) | A word splits into red, green and blue fringes. Best for bold titles. |
| [2.5D / Pseudo-3D](2-5d-pseudo-3d/) | Flat layers slide by different amounts, faking depth. Best for hero scenes. |
| [Ray Marching / SDF](ray-marching-sdf/) | A 3D scene drawn only from formulas, circled by a camera. Best for art pages. |
| [GPGPU Particle System](gpgpu-particle-system/) | Tens of thousands of particles flow on the graphics chip. Best for hero effects. |
| [Image Distortion on Hover](image-distortion-hover/) | The picture ripples and bends around your pointer. Best for portfolio images. |
| [Cloth Simulation](cloth-simulation/) | A cloth sways in the wind, and you can drag it around. Best for playful pages. |
| [Volumetric Smoke](volumetric-smoke/) | Soft smoke curls upward, drawn as a real 3D cloud. Best for moody backgrounds. |
| [Morphing Blob](morphing-blob/) | Blobs melt together, and one drop chases your pointer. Best for hero sections. |
| [3D Flip Card](flip-card-3d/) | A card turns over in 3D to show its back. Best for profile and product cards. |
| [Flocking](flocking/) | Birds swirl and turn together as one flock. Best for calm backgrounds. |

## Key concepts

**WebGL boilerplate is always the same.** Vertex shader (trivial for fullscreen-quad shaders), fragment shader (where all the work happens), buffer setup, uniform binding, render loop. Every shader demo in this category shares that skeleton.

**Fullscreen quad pattern.** For 2D shader effects (plasma, metaballs, ray marching, volumetric smoke), render a single quad covering the entire canvas. The fragment shader runs once per pixel. No mesh geometry required.

**Performance scales differently.** Canvas 2D scales with particle count (O(n) to O(n²)). WebGL shaders scale with pixel count. Ray marching scales with scene complexity × pixel count. GPGPU scales with texture size × physics pass complexity.

**Reduce motion.** When `prefers-reduced-motion: reduce` is set, nothing starts moving by itself: the looping demos start paused, Show me and Play wait to be pressed, and SVG Path Animation shows its drawing complete. Never autoplay GPU-intensive animations without this check.

## Browser requirements

| Demo | Requirement |
|------|-------------|
| All WebGL demos | WebGL 1.0 (all modern browsers) |
| GPGPU Particle System | WebGL2 (Chrome 56+, Firefox 51+, Safari 15+) |
| backdrop-filter (Glassmorphism) | Chrome, Edge, Safari; Firefox 103+ |

## See also
- [04 — Micro-Interactions](../04-micro-interactions/) — lighter-weight interactive animations
- [05 — Text & Typography](../05-text-typography/) — text-specific GPU effects (gradient, scramble, variable font)
