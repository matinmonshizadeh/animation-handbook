# Fluid / Liquid Simulation

## What it is
This fluid effect looks like liquid but is not a real fluid simulation. A WebGL shader works out, for every pixel, how far it is from a few moving circles, and blends those distances so circles that come close melt into one smooth shape, like drops of mercury or a lava lamp. Circles that drift apart separate cleanly again.

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
| Melting | Medium | How far apart two blobs start to melt together: a little is 0.03, medium 0.08 and a lot 0.15 of the stage height; a lot gives thick, soft necks |
| Number of blobs | Medium | Few is 3, medium 5 and many 8 blobs; each one adds work for every pixel |
| Speed | Normal | How fast the blobs move on their paths: slow is 0.5, normal 0.8 and fast 1.3 |
| Blob size | Medium | Each blob's radius: small is 9%, medium 14% and large 20% of the stage height |
| Color | Blue | The color of the liquid |
| Glow | on | Adds a soft halo that fades out around the liquid |
| One blob follows the pointer | on | One blob leaves its path and sits under the pointer or a finger |

## Production notes
- **Real fluid simulation**: Navier-Stokes-based fluid (velocity fields, pressure, diffusion) requires full-screen texture updates per frame. Pavel DoGreat's WebGL Fluid Simulation (open source) is the go-to — it renders truly interactive fluid at 60fps using a series of physics passes.
- **SDF metaballs are an approximation**: they look fluid but don't conserve volume, don't flow around obstacles, and don't respond to physical forces. For true fluid behavior, use a full simulation library.
- **Performance**: each additional metaball adds a distance evaluation per pixel. On a 1920×1080 canvas with 8 balls, that's ~16 million SDF evaluations per frame. This is why mobile frame rates drop — use a lower canvas resolution on mobile. The demo caps the backing store at 2× device pixel ratio on desktop and 1.5× under 600px, which is the whole of its quality/cost dial.
- **Silent shader failure**: a shader that fails to compile throws nothing and logs nothing — you get a black canvas. Always check `COMPILE_STATUS` and `LINK_STATUS` and surface a message, as this demo does.
- **Context loss**: `webglcontextlost` fires on a GPU reset, a driver update, or a backgrounded tab being restored. Without a listener the canvas stays black permanently. Call `preventDefault()` on the loss event, stop the loop, and rebuild the program on `webglcontextrestored`.
- **Shadertoy**: the metaball pattern is one of the classic Shadertoy exercises. [shadertoy.com](https://www.shadertoy.com) has hundreds of metaball variants.
- **`prefers-reduced-motion`**: pause the animation. The blobs should remain visible in their default positions.

## See also
- [WebGL Shader Animation](../webgl-shader-animation/) — the same one-surface shader setup, painting patterns
- [Morphing Blob](../morphing-blob/) — the same melting look from blurred circles, without WebGL
- [Noise-Based Motion](../noise-based-motion/) — smooth noise moves dots and a blob instead
