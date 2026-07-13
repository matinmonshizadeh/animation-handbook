# 06 — 3D & Advanced

WebGL, shaders, particles, 3D transforms, and the performance-sensitive effects that push the browser's limits. All demos include an FPS counter and a pause button.

## Animations

| Demo | Description |
|------|-------------|
| [3D Model Orbit](3d-model-orbit/) | Phong-shaded WebGL geometry orbiting with mouse-follow and auto-spin |
| [Scroll-Driven 3D Rotation](scroll-driven-3d-rotation/) | CSS cube rotates through four choreographed stages as you scroll |
| [Parallax 3D Tilt](parallax-3d-tilt/) | CSS perspective + rotateX/Y follows mouse — shine highlight tracks the virtual light |
| [Canvas Particle Effect](canvas-particle-effect/) | 500 drifting particles with O(n²) proximity connections and mouse repel/attract |
| [Fluid Simulation](fluid-simulation/) | WebGL metaballs via SDF smooth-minimum in a fragment shader |
| [Glassmorphism Animated](glassmorphism-animated/) | backdrop-filter: blur() over animated gradient blobs — three frost variants |
| [WebGL Shader Animation](webgl-shader-animation/) | Four GLSL fragment shader presets: plasma, waves, Voronoi, kaleidoscope |
| [Noise-Based Motion](noise-based-motion/) | Simplex noise drives a wind field and a morphing blob on 2D canvas |
| [SVG Path Animation](svg-path-animation/) | stroke-dashoffset reveals three SVG drawings — icon, signature, logo mark |
| [Chromatic Aberration](chromatic-aberration/) | RGB channels offset via mix-blend-mode: screen — static, pulse, and glitch modes |
| [2.5D / Pseudo-3D](2-5d-pseudo-3d/) | Seven depth layers translate at different rates — mouse or auto-pan |
| [Ray Marching / SDF Scene](ray-marching-sdf/) | 3D scene entirely in a fragment shader — sphere blend, boolean, infinite repetition |
| [GPGPU Particle System](gpgpu-particle-system/) | 65k+ particles computed in WebGL2 textures — texture ping-pong physics |
| [Image Distortion on Hover](image-distortion-hover/) | Fragment shader displaces UV coordinates around the cursor — four distortion types |
| [Cloth Simulation](cloth-simulation/) | Verlet integration + distance constraints — draggable, gravity, and wind-responsive |
| [Volumetric Smoke](volumetric-smoke/) | Ray marching that accumulates 3D noise density — light scattering, shadow rays |
| [Morphing Blob](morphing-blob/) | Metaball circles fused by an SVG blur-plus-contrast filter — drifts and a droplet chases the pointer |
| [3D Flip Card](flip-card-3d/) | A card rotates in 3D to reveal its back face — preserve-3d + backface-visibility |

## Key concepts

**WebGL boilerplate is always the same.** Vertex shader (trivial for fullscreen-quad shaders), fragment shader (where all the work happens), buffer setup, uniform binding, render loop. Every shader demo in this category shares that skeleton.

**Fullscreen quad pattern.** For 2D shader effects (plasma, metaballs, ray marching, volumetric smoke), render a single quad covering the entire canvas. The fragment shader runs once per pixel. No mesh geometry required.

**Performance scales differently.** Canvas 2D scales with particle count (O(n) to O(n²)). WebGL shaders scale with pixel count. Ray marching scales with scene complexity × pixel count. GPGPU scales with texture size × physics pass complexity.

**Reduce motion.** All demos pause by default when `prefers-reduced-motion: reduce` is set. Users can resume manually. Never autoplay GPU-intensive animations without this check.

## Browser requirements

| Demo | Requirement |
|------|-------------|
| All WebGL demos | WebGL 1.0 (all modern browsers) |
| GPGPU Particle System | WebGL2 (Chrome 56+, Firefox 51+, Safari 15+) |
| backdrop-filter (Glassmorphism) | Chrome, Edge, Safari; Firefox 103+ |

## See also
- [04 — Micro-Interactions](../04-micro-interactions/) — lighter-weight interactive animations
- [05 — Text & Typography](../05-text-typography/) — text-specific GPU effects (gradient, scramble, variable font)
