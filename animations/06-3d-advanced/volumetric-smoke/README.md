# Volumetric Smoke / 3D Noise

## What it is
Volumetric smoke is drawn as a real 3D cloud rather than a flat picture. For every pixel, a ray passes through a cloud of smooth noise and adds up how much smoke it meets, shading each part by how much smoke lies between it and the light. That gives soft edges and depth, which is how films draw smoke, fog and clouds.

## When to use it
- Atmospheric background effects: rising smoke, volumetric fog, cloud formations
- Sci-fi or fantasy environments where volumetric haze sets mood
- Data visualization where density/volume is the visual metaphor
- Animated title cards and hero sections with environmental effects

## How it works
For each pixel, a ray is marched through 3D space. At each step, the density of the noise field is sampled and accumulated. Light attenuation is computed by casting a short shadow ray toward the light:

```glsl
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
  vec3 ro = vec3(0., 0., 3.);        // camera origin
  vec3 rd = normalize(vec3(uv, -0.9)); // ray direction

  float transmittance = 1.0;
  vec3 color = vec3(0.0);            // background is composited once, at the end
  float stepSize = 3.0 / float(uSteps);

  for (int i = 0; i < MAX_STEPS; i++) {
    if (i >= uSteps) break;
    vec3 p = ro + rd * float(i) * stepSize;

    float d = smokeDensity(p, uTime);  // sample noise at this 3D point
    if (d > 0.0) {
      // Shadow ray: march toward light
      float shadow = 1.0;
      for (int s = 1; s <= 3; s++) {
        shadow *= exp(-smokeDensity(p + lightDir * float(s) * 0.18, uTime) * stepSize * 2.5);
      }
      float alpha = 1.0 - exp(-d * stepSize * 8.0);
      color += transmittance * alpha * uSmokeColor * (0.15 + 0.85 * shadow);
      transmittance *= (1.0 - alpha);
    }
    if (transmittance < 0.01) break;
  }
  gl_FragColor = vec4(color + uBackground * transmittance, 1.0);
}
```

**3D noise density function** — fBm over the rising smoke shape:

```glsl
float smokeDensity(vec3 p, float t) {
  float r = length(p.xz);
  // smoothstep needs edge0 < edge1, so the upper falloff is inverted rather than reversed
  float src = exp(-r * 3.0) * smoothstep(-0.2, 0.6, p.y) * (1.0 - smoothstep(1.0, 1.8, p.y));
  if (src < 0.001) return 0.0;  // nothing to add here, so skip the noise
  float n = fbm(p * 1.4 + vec3(windDrift, rise, 0.0));
  return max(0.0, n - 0.45) * src * density;
}
```

`rise` grows every frame by the frame's time × the speed, on the page, so changing the speed never makes the smoke jump.

Wherever `src` has faded to almost nothing the function returns before the noise, so the five noise samples are only taken where there can be smoke. That, together with the smaller canvas described under Mobile cost, keeps the demo smooth on laptops and phones.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Thickness | Medium | How dense the smoke is: thin is 0.4, medium 0.7 and thick 1.2; thin looks wispy, thick hides what is behind |
| Speed | Normal | How fast the smoke rises: slow is 0.35, normal 0.6 and fast 1 |
| Detail | Medium | How many steps each ray takes: low is 16, medium 32 and high 64 (48 on phones); fewer steps leave visible stripes |
| Smoke color | Gray blue | The color of the lit smoke; the shadowed parts are darker shades of it |
| Wind | on | The whole plume drifts slowly to one side |
| Fine grain | on | Starts each ray at a slightly random point, which turns the stripes that few steps leave into fine grain |

## Production notes
- **Precision**: the `sin`-based hash multiplies by 43758.5, which overflows the usable range of a 16-bit `mediump` float and collapses the noise to flat blocks on many mobile GPUs. Request `highp` in the fragment shader (guarded by `GL_FRAGMENT_PRECISION_HIGH`) or swap the hash for an integer-free variant with a smaller multiplier.
- **Mobile cost**: this is fill-rate bound — every fragment runs up to `steps x (fbm + 3 shadow taps)`, so the demo trims it three ways. `smokeDensity` returns before the noise wherever the plume has faded out. The backing store is capped at about 90,000 pixels and the browser scales it up to the stage, which suits soft smoke; it never exceeds 1 CSS pixel per fragment either. On phones (screens 600px wide or less, or 500px tall or less when held sideways) the backing store is also at most 0.75 of the stage and the march at most 48 steps. Honouring a 3x phone DPR would multiply the cost ninefold.
- **Context loss**: a GPU reset, a backgrounded tab on mobile, or a driver hiccup fires `webglcontextlost`. Without a listener the canvas goes permanently black with no error. Preventing the default event and rebuilding shaders and buffers on `webglcontextrestored` is the production path; this demo takes the simpler route of stopping the loop and showing a message.
- **Step count vs quality**: each additional march step increases pixel cost linearly. 32 steps is generally sufficient for soft smoke; use 64 only for hero-quality renders. Add blue-noise dithering to random-offset each ray's start, breaking up banding artifacts at low step counts. The offset has to be a fraction of a *full step* to help — jittering by a few thousandths of a unit is invisible.
- **Shadow rays**: the 3-step shadow march adds 3× extra density samples per lit pixel. Toggle off on low-end devices. For production, pre-compute a voxelized shadow map and sample it instead.
- **Real-time fire and smoke**: game engines use particle systems with additive-blended sprite sheets for fire/smoke, which is faster than ray marching. Ray-marched volumes are used in offline rendering (films, VFX) and cinematic-quality game cutscenes.
- **Three.js `FogExp2`**: for simple atmosphere, Three.js's built-in exponential fog is computationally free (depth-based fog applied in the vertex shader). Use volumetric ray marching only when fog must have specific 3D shape.
- **Temporal accumulation**: real-time volumetric engines (Unreal Engine's Volumetric Fog) spread the ray march samples across multiple frames and blend results. This reduces per-frame cost by 4–8× at the cost of minor ghosting artifacts during fast camera motion.

## See also
- [Ray Marching / SDF Scene](../ray-marching-sdf/) — rays that stop at surfaces instead of adding up smoke
- [Noise-Based Motion](../noise-based-motion/) — the same kind of noise, on a flat canvas
- [Fluid / Liquid Simulation](../fluid-simulation/) — a soft, liquid look drawn by a shader
