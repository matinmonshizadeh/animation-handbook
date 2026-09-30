# Image Distortion on Hover

## What it is
Image distortion on hover bends a picture around the pointer. A WebGL shader draws the image, and near the pointer each pixel is read from a slightly shifted spot, so the picture seems to ripple, bulge, swirl or break into squares there, while the image itself never changes. The bending fades away after the pointer leaves.

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

The `uPhase` uniform advances each frame to animate the ripple outward even after the mouse stops. A separate **amplitude** term is what fades: it is pinned to 1 while the pointer is over the stage and decays exponentially once the pointer leaves, so the distortion settles back to the undisplaced image rather than snapping off.

```js
// Phase always advances; amplitude decays when the pointer is gone
phase += dt * 0.003;
if (!pointerActive) amp *= Math.max(0, 1 - DECAY * dt / 1000);
gl.uniform1f(uPhase, phase);
gl.uniform1f(uStrength, STRENGTH * amp);
```

For a **procedural texture** (no external image required), generate the pattern in the same shader:

```glsl
vec3 pattern(vec2 uv) {
  float s = sin(uv.x * 8.0 + uTime) * sin(uv.y * 8.0 + uTime * 0.7);
  return mix(vec3(0.2, 0.35, 0.6), vec3(0.6, 0.2, 0.7), s * 0.5 + 0.5);
}
```

In the demo the pattern stands still, as a real image would: its time value stays at 0, and only the distortion moves. Once the pointer has gone and the fade has finished, the demo stops drawing, and the pointer or Show me starts it again.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Effect | Ripple | Ripple sends rings out from the pointer; Push bulges the picture outward; Liquid swirls it; Pixels breaks it into squares |
| Strength | Medium | How far the picture bends: gentle is 4, medium 8 and strong 14; stronger looks more dramatic but harder to read |
| Size | Medium | How wide an area bends: small is 15%, medium 25% and large 40% of the picture's height |
| Fade-out speed | Normal | How fast the bending fades after the pointer leaves: each second it loses about three fifths of its strength at slow, about four fifths at normal and nine tenths at fast |
| Moving ripples | on | With Ripple, the rings keep moving outward while the pointer rests; off, they stand still |

## Production notes
- **Real images**: replace the procedural `pattern()` function with `texture2D(uTexture, distortedUV)`. Load images into WebGL via `gl.texImage2D()` from an `<img>` or `ImageBitmap`. Same-origin policy applies — external image URLs need CORS headers.
- **`CLAMP_TO_EDGE`**: set the texture's wrap mode to `gl.CLAMP_TO_EDGE` (both `TEXTURE_WRAP_S` and `TEXTURE_WRAP_T`) so UV values outside [0,1] don't tile or mirror at the image border when distortion pushes UVs out of range.
- **Pointer, not mouse**: bind `pointermove`/`pointerdown` rather than `mousemove`, or the effect never fires on a phone. The cursor position must be converted to backing-store pixels (multiply by the device pixel ratio used for the canvas) before it reaches the shader, or the distortion centre drifts away from the finger on high-DPI screens.
- **Backing store and DPR**: size the canvas to `clientWidth * dpr` and call `gl.viewport()` after every resize. Uncapped DPR is expensive for a fullscreen fragment shader — this demo caps it at 2, and at 1.5 on phones. Resizing clears the drawing buffer, so a demo that is not drawing every frame (this one stops at rest) has to repaint after a resize or it goes black.
- **Context loss**: a GPU reset or a restored tab fires `webglcontextlost`. Without a listener (and a `preventDefault()` so `webglcontextrestored` follows) the canvas dies permanently. Shaders, buffers and uniform locations all have to be rebuilt on restore.
- **CSS-only alternative**: CSS `filter: blur()` and `transform: translate()` on pseudo-elements can approximate push distortion for a single element at low intensity. WebGL is needed for per-pixel wave and liquid effects.
- **hover-effect-curtains / Curtains.js**: production libraries that wrap this exact pattern. They handle texture loading, canvas sizing, and the shader boilerplate. The GLSL fragment shader is identical to what this demo uses.
- **Shader Park**: a higher-level tool for declaring distortion effects with a JavaScript-like syntax that compiles to GLSL. Suitable for creative applications where writing raw GLSL is a barrier.

## See also
- [WebGL Shader Animation](../webgl-shader-animation/) — the same shader setup, painting patterns
- [Parallax 3D Tilt](../parallax-3d-tilt/) — a card leans toward the pointer instead of bending
- [Fluid / Liquid Simulation](../fluid-simulation/) — a liquid look that follows the pointer
