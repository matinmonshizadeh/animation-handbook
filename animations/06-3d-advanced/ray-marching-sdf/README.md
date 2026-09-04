# Ray Marching / SDF Scene

## What it is
Ray marching renders a 3D scene entirely inside a fragment shader without any mesh geometry. Instead of triangles, shapes are defined as Signed Distance Functions (SDFs) — mathematical functions that return the distance from any point in space to the nearest surface. A ray is cast for each pixel; the shader advances the ray forward by the SDF value at each step (which is always safe — the SDF guarantees no overshoot), repeating until the ray hits a surface or exits the scene. Everything visible is pure math.

## When to use it
- Complex animated 3D shapes that are difficult to model as meshes (fractals, boolean blends, organic morphs)
- Fullscreen shader art and generative visuals
- Educational demonstrations of 3D math without Three.js overhead
- Shadertoy-style creative coding in the browser

## How it works
**Core ray march loop** — advances a ray until it's within epsilon of a surface:

```glsl
float rayMarch(vec3 ro, vec3 rd) {  // ray origin, ray direction
  float t = 0.0;
  for (int i = 0; i < MAX_STEPS; i++) {
    float d = scene(ro + rd * t);   // distance to nearest surface
    if (d < 0.001) return t;        // hit
    t += d;                          // safe to advance by d
    if (t > 20.0) break;            // escaped scene
  }
  return -1.0;                       // no hit
}
```

**SDF primitives** — the building blocks:

```glsl
float sdSphere(vec3 p, float r) { return length(p) - r; }

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}
```

**Smooth-minimum** blends two SDFs, creating the organic merging effect:

```glsl
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
```

**Normal via finite differences** — sample SDF in 6 directions:

```glsl
vec3 getNormal(vec3 p) {
  vec2 e = vec2(0.001, 0.0);
  return normalize(vec3(
    scene(p + e.xyy) - scene(p - e.xyy),
    scene(p + e.yxy) - scene(p - e.yxy),
    scene(p + e.yyx) - scene(p - e.yyx)
  ));
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Max steps | 48 (32 on mobile) | More steps = finer detail on concave surfaces, but lower FPS |
| Resolution scale | 0.7× under 600px, DPR capped at 1.5× above | Cost is per pixel, so the backing store — not the scene — sets the frame time |
| Step scale | 0.9× | Multiplying by <1 trades performance for accuracy on thin features |
| Epsilon (hit distance) | 0.001 | Smaller = sharper surface but more steps required |
| Smooth-min k | 0.3–0.5 | Controls blend radius between shapes |

## Production notes
- **Shadertoy convention**: uniforms are `iTime`, `iResolution`, `iMouse`. Porting Shadertoy code to WebGL requires renaming these to your own uniform names and adding the WebGL boilerplate (vertex shader + quad).
- **Performance scales with pixel count, not scene complexity**: adding 10 more SDF operations costs very little — adding a 4K display multiplies cost by 4×. Run at half resolution and upscale for complex shaders on mobile.
- **Soft shadows and AO**: both require additional rays per fragment (shadow ray, AO samples). Soft shadows are expensive — 20 shadow-march steps per lit pixel doubles the total march work. Toggle off on low-end devices.
- **`mediump` precision**: complex distance functions with large-scale repetition can lose precision at `mediump`. Use `highp float` for SDF scenes with repetition patterns or fine geometry.
- **Three.js alternative**: Three.js with `ShaderMaterial` passes the same uniforms to the same fragment shader — the GLSL is identical, only the WebGL boilerplate changes.

## See also
- [Volumetric Smoke](../volumetric-smoke/) — ray marching that accumulates density rather than finding surface hits
- [WebGL Shader Animation](../webgl-shader-animation/) — simpler fragment shaders on the same fullscreen-quad setup
- [Fluid Simulation](../fluid-simulation/) — SDF metaballs as a 2D application of the same SDF principle
