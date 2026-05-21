# Fluid / Liquid Simulation

## What it is
The fluid simulation demo renders an organic blob effect — metaballs that merge softly when they come close and separate cleanly when far apart. It is not a true Navier-Stokes fluid simulation but a convincing approximation: signed distance field (SDF) spheres combined with a smooth-minimum function, rendered per-pixel in a WebGL fragment shader. The result looks like lava lamp blobs or liquid mercury.

## When to use it
- Liquid-aesthetic hero backgrounds on health, wellness, and creative product sites
- Generative branding elements where organic movement signals "alive"
- Hover effects that make UI elements feel soft and fluid
- Screensaver-style ambient backgrounds for kiosks or dashboards

## How it works
Each pixel's color is determined by evaluating the SDF of all metaballs at that pixel's world coordinate. The `smin` (smooth minimum) function blends overlapping SDFs:

```glsl
// Smooth minimum — merges two distance fields
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// Metaball scene
float scene(vec2 uv) {
  float d = 1e10;
  for (int i = 0; i < 5; i++) {
    vec2 center = ballPosition(i, uTime);  // animated with sin/cos
    float ballDist = length(uv - center) - RADIUS;
    d = smin(d, ballDist, SMOOTHNESS);    // merge softly
  }
  return d;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float d = scene(uv);
  float inside = smoothstep(0.01, -0.01, d);  // binary in/out
  gl_FragColor = vec4(mix(BG_COLOR, FLUID_COLOR, inside), 1.0);
}
```

Ball positions are animated with parametric sine/cosine curves to ensure continuous, non-repeating-feeling motion:

```glsl
vec2 ballPosition(int i, float t) {
  float fi = float(i);
  float s = 1.3 + fi * 0.4;
  float o = fi * 2.1;
  return vec2(0.5 + 0.38 * sin(t * s + o),
              0.5 + 0.38 * cos(t * s * 0.7 + o * 1.3));
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Metaball count | 5 | More = busier, more connections; 8+ at high res drops FPS |
| Smoothness (k) | 0.08 | 0 = sharp, hard edges (no blending); 0.2 = very soft merge radius |
| Ball radius | 0.14 | Larger = bigger blobs; overlaps more = more frequent merges |
| Speed | 0.8 | Faster = frantic; 0.3 = meditative |

## Production notes
- **Real fluid simulation**: Navier-Stokes-based fluid (velocity fields, pressure, diffusion) requires full-screen texture updates per frame. Pavel DoGreat's WebGL Fluid Simulation (open source) is the go-to — it renders truly interactive fluid at 60fps using a series of physics passes.
- **SDF metaballs are an approximation**: they look fluid but don't conserve volume, don't flow around obstacles, and don't respond to physical forces. For true fluid behavior, use a full simulation library.
- **Performance**: each additional metaball adds a distance evaluation per pixel. On a 1920×1080 canvas with 8 balls, that's ~16 million SDF evaluations per frame. This is why mobile frame rates drop — use a lower canvas resolution on mobile.
- **Shadertoy**: the metaball pattern is one of the classic Shadertoy exercises. [shadertoy.com](https://www.shadertoy.com) has hundreds of metaball variants.
- **`prefers-reduced-motion`**: pause the animation. The blobs should remain visible in their default positions.

## See also
- [WebGL Shader Animation](../webgl-shader-animation/) — same fullscreen-quad approach, different shader patterns
- [Canvas Particle Effect](../canvas-particle-effect/) — 2D canvas alternative for organic movement
- [Noise-Based Motion](../noise-based-motion/) — Perlin noise for similar organic feel with less WebGL complexity
