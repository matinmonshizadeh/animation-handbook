# Ray Marching / SDF Scene

## What it is
Ray marching draws a 3D scene without any 3D models. Each shape is a formula that gives the distance to its surface, and for every pixel the shader steps a ray forward by that distance until it touches something, then lights that point. Because the shapes are formulas, they can melt together, be carved out of each other or repeat forever.

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
| Scene | Blend | Blend melts a sphere, a box and a ring together; Cut-out carves a box out of a sphere, with a small ball inside; Endless repeats a carved box across the floor without end |
| Camera speed | Normal | How fast the camera circles the shapes: once in about 18 seconds at slow, 10 at normal and 6 at fast |
| Soft shadows | off | Casts a second ray toward the light from every surface point, for soft shadows; the most costly option |
| Corner shading | on | Darkens creases and corners where surfaces meet, by testing a few points just above each surface |
| Detail | Medium | The most steps a ray may take: low is 24, medium 48 and high 96; phones take two thirds as many |
| Step count view | off | Colors each pixel by how many steps its ray took: edges and near misses take the most |

## Production notes
- **Shadertoy convention**: uniforms are `iTime`, `iResolution`, `iMouse`. Porting Shadertoy code to WebGL requires renaming these to your own uniform names and adding the WebGL boilerplate (vertex shader + quad).
- **Performance scales with pixel count, not scene complexity**: adding 10 more SDF operations costs very little — adding a 4K display multiplies cost by 4×. Run at half resolution and upscale for complex shaders on mobile.
- **Soft shadows and AO**: both require additional rays per fragment (shadow ray, AO samples). Soft shadows are expensive — 20 shadow-march steps per lit pixel doubles the total march work. Toggle off on low-end devices.
- **`mediump` precision**: complex distance functions with large-scale repetition can lose precision at `mediump`. Use `highp float` for SDF scenes with repetition patterns or fine geometry.
- **Three.js alternative**: Three.js with `ShaderMaterial` passes the same uniforms to the same fragment shader — the GLSL is identical, only the WebGL boilerplate changes.

## See also
- [Volumetric Smoke / 3D Noise](../volumetric-smoke/) — rays that add up smoke instead of stopping at a surface
- [WebGL Shader Animation](../webgl-shader-animation/) — simpler shaders on the same setup
- [Fluid / Liquid Simulation](../fluid-simulation/) — the same melting of shapes, in 2D
