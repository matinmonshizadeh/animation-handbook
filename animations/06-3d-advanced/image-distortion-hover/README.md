# Image Distortion on Hover

## What it is
Image distortion on hover applies a shader-based displacement effect to an image or texture when the cursor is nearby. The fragment shader samples the image at UV coordinates offset by a distortion function centered on the mouse position. The image itself is never modified — only the sampling coordinates change. This creates ripple, push, liquid, and pixelation effects that emanate from the cursor and decay over distance and time.

## When to use it
- Agency portfolio grids where each project card distorts on hover to signal interactivity
- Hero images that respond to cursor presence with a subtle liquid animation
- Product showcase tiles that feel "alive" when browsed
- Any static image that needs mouse interactivity without JavaScript-heavy animation

## How it works
The core operation is a UV displacement in the fragment shader. The pixel at UV coordinate `uv` samples the texture at `uv + displacement(uv, mouseUV)`:

```glsl
// Ripple distortion: concentric waves from mouse position
vec2 ripple(vec2 uv, vec2 mouseUV, float strength, float radius, float phase) {
  vec2 dir = uv - mouseUV;
  float dist = length(dir);
  float falloff = smoothstep(radius, 0.0, dist);   // fade with distance
  float wave = sin(dist / radius * 12.0 - phase) * falloff * strength;
  return normalize(dir) * wave;                     // offset along the ray
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 mouseUV = uMousePos / uResolution;

  vec2 distortedUV = uv + ripple(uv, mouseUV, 0.04, 0.25, uPhase);
  gl_FragColor = vec4(sampleTexture(distortedUV), 1.0);
}
```

The `uPhase` uniform advances each frame to animate the ripple outward even after the mouse stops. A **decay** multiplier fades the phase when the mouse is absent:

```js
// Advance phase while mouse is present; decay when absent
if (mouseActive) {
  phase += 0.05;
} else {
  phase *= Math.max(0, 1 - DECAY * 0.016);  // exponential decay
}
gl.uniform1f(uPhase, phase);
```

For a **procedural texture** (no external image required), generate the pattern in the same shader:

```glsl
vec3 pattern(vec2 uv) {
  float s = sin(uv.x * 8.0 + uTime) * sin(uv.y * 8.0 + uTime * 0.7);
  return mix(vec3(0.2, 0.35, 0.6), vec3(0.6, 0.2, 0.7), s * 0.5 + 0.5);
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Strength | 8 | Displacement magnitude — larger = more dramatic but can break UV at extremes |
| Radius | 0.25 (25% of canvas) | Area of effect from cursor — larger = whole canvas affected |
| Decay speed | 0.5 | How fast the distortion fades after mouse leaves |
| Distortion type | Ripple | Ripple = wave rings; Push = radial bulge; Liquid = turbulent noise; Pixelate = grid quantization |

## Production notes
- **Real images**: replace the procedural `pattern()` function with `texture2D(uTexture, distortedUV)`. Load images into WebGL via `gl.texImage2D()` from an `<img>` or `ImageBitmap`. Same-origin policy applies — external image URLs need CORS headers.
- **`gl.clampToEdge`**: ensure texture wrap mode is `CLAMP_TO_EDGE` so UV values outside [0,1] don't tile or mirror at the image border when distortion pushes UVs out of range.
- **CSS-only alternative**: CSS `filter: blur()` and `transform: translate()` on pseudo-elements can approximate push distortion for a single element at low intensity. WebGL is needed for per-pixel wave and liquid effects.
- **hover-effect-curtains / Curtains.js**: production libraries that wrap this exact pattern. They handle texture loading, canvas sizing, and the shader boilerplate. The GLSL fragment shader is identical to what this demo uses.
- **Shader Park**: a higher-level tool for declaring distortion effects with a JavaScript-like syntax that compiles to GLSL. Suitable for creative applications where writing raw GLSL is a barrier.

## See also
- [WebGL Shader Animation](../webgl-shader-animation/) — same WebGL structure, pattern-focused shaders
- [Parallax 3D Tilt](../parallax-3d-tilt/) — mouse-responsive 3D tilt without per-pixel distortion
- [Fluid Simulation](../fluid-simulation/) — SDF metaballs as an alternative organic mouse effect
