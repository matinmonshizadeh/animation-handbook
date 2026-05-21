# WebGL Shader Animation

## What it is
WebGL shader animations run entirely on the GPU — a fragment shader executes once per pixel per frame, producing the full visual from mathematical functions alone. The vertex shader is trivial (a fullscreen quad); all the creative work happens in the fragment shader. This is the model behind Shadertoy: each demo is one fragment shader, no geometry.

## When to use it
- Full-canvas animated backgrounds that need GPU-level performance
- Generative art and creative coding where patterns emerge from math
- Loading screens and transitions with zero asset overhead
- Brand expressions using procedural color and motion

## How it works
The entire setup is a quad covering the screen. The fragment shader receives the pixel coordinate and global time as uniforms:

```js
// Minimal WebGL boilerplate for a shader demo
const prog = createProgram(gl,
  `attribute vec2 a; void main() { gl_Position = vec4(a, 0., 1.); }`,
  fragmentShaderSource
);
const buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
gl.enableVertexAttribArray(aPos);
gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

function render(ts) {
  gl.uniform2f(uRes, W, H);
  gl.uniform1f(uT, ts / 1000 * speed);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(render);
}
```

**Plasma** — the simplest pattern; nested sine functions over UV coordinates:

```glsl
void main() {
  vec2 uv = gl_FragCoord.xy / uRes * 2.0 - 1.0;
  float v  = sin(uv.x * 5.0 + uT)
           + sin(uv.y * 5.0 + uT * 0.7)
           + sin((uv.x + uv.y) * 5.0 + uT * 0.3)
           + sin(sqrt(uv.x*uv.x + uv.y*uv.y) * 6.0);
  vec3 col = 0.5 + 0.5 * cos(v * 3.14 + vec3(0, 2.09, 4.19));
  gl_FragColor = vec4(col, 1.0);
}
```

**Voronoi** — cellular pattern using nearest-neighbor distance in a grid:

```glsl
float voronoi(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  float md = 8.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 n = vec2(x, y);
    vec2 pt = n + rand2(i + n);          // random point in each cell
    md = min(md, length(pt - f));
  }
  return md;
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Time speed | 1.0× | Multiplier on `uT` uniform — faster = more energetic animation |
| Hue shift | 0° | Rotates the entire color palette without rewriting the shader |
| Max steps (where applicable) | — | Quality/performance tradeoff in iterative shaders |

## Production notes
- **Shadertoy**: all four patterns in this demo are canonical Shadertoy exercises. The site has a live GLSL editor, a large library of community shaders, and a standard uniform convention (`iTime`, `iResolution`, `iMouse`).
- **Canvas resolution**: shader cost scales with pixel count. At 4K, a complex shader runs 4× slower than at 1080p. Use `devicePixelRatio` carefully — rendering at 0.5× device pixels and upscaling often looks fine for background shaders.
- **`mediump` vs `highp`**: `precision mediump float` is required on mobile. Some shaders produce visible banding at `mediump` — switch to `precision highp float` for patterns with fine detail.
- **Mouse uniform**: add `uniform vec2 uMouse` and pass `e.clientX / W, e.clientY / H` to make any shader interactive without rewriting the core algorithm.

## See also
- [Fluid Simulation](../fluid-simulation/) — SDF-based shader, same fullscreen-quad approach
- [Ray Marching / SDF Scene](../ray-marching-sdf/) — most complex application of the same shader pattern
- [Noise-Based Motion](../noise-based-motion/) — canvas equivalent of procedural animated patterns
