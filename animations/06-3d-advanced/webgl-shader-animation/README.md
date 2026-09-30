# WebGL Shader Animation

## What it is
A shader animation draws a moving picture entirely on the graphics chip. One small program runs for every pixel, every frame, and works out that pixel's color from its position and the time, so the whole pattern is made of math, with no images. Each of the four patterns in the demo is one such program.

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

let t = 0, last = 0;
function render(ts) {
  if (last) t += Math.min(ts - last, 100) / 1000 * speed;   // add up time, so a new speed never jumps
  last = ts;
  gl.uniform2f(uRes, W, H);
  gl.uniform1f(uT, t);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(render);
}
```

**Plasma** — the simplest pattern; nested sine functions over UV coordinates, and the sum picks a hue (`hsv()` turns a hue, a saturation and a brightness into a color):

```glsl
void main() {
  vec2 uv = gl_FragCoord.xy / uRes * 2.0 - 1.0;
  uv.x *= uRes.x / uRes.y;                       // keep the rings round on a wide stage
  float v  = sin(uv.x * 5.0 + uT)
           + sin(uv.y * 5.0 + uT * 0.7)
           + sin((uv.x + uv.y) * 5.0 + uT * 0.5)
           + sin(length(uv) * 6.0);              // rings around the middle
  float hue = fract(v * 0.25 + uT * 0.05);       // the sum picks the hue; time slides it round the rainbow
  gl_FragColor = vec4(hsv(hue, 0.9, 0.95), 1.0);
}
```

**Cells (Voronoi)** — cellular pattern using nearest-neighbor distance in a grid; the point in each cell drifts slowly as time runs on:

```glsl
float voronoi(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  float md = 8.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 n = vec2(x, y);
    vec2 pt = n + rand2(i + n + uT * 0.01);   // a random point in each cell, moving with time
    md = min(md, length(pt - f));
  }
  return md;
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Pattern | Plasma | Plasma adds up sine waves into flowing color; Waves bends striped color; Cells splits the plane into cells around moving points; Kaleidoscope mirrors one slice around the middle |
| Speed | Normal | How fast time runs in the pattern: slow is 0.6, normal 1 and fast 1.6 times |
| Reacts to the pointer | off | Each pattern bends around the pointer or a finger in its own way; in Kaleidoscope the pointer sets the number of slices |

## Production notes
- **Always check `COMPILE_STATUS` and `LINK_STATUS`.** A shader that fails to compile throws nothing and logs nothing — `gl.drawArrays` just quietly draws nothing and you get a black canvas. Read `getShaderInfoLog` / `getProgramInfoLog` and put the message somewhere a human will see it. This demo renders the compile log into the stage; break a shader on purpose and you get the GLSL error, not a black box.
- **Handle context loss.** `webglcontextlost` fires on a GPU reset, a driver update, or a backgrounded tab that the OS reclaims. Call `preventDefault()` on it — otherwise the context never comes back — then rebuild buffers, programs and uniform locations in `webglcontextrestored`. Every GL object from the old context is gone.
- **Size the backing store in device pixels**, not CSS pixels: `canvas.width = clientWidth * dpr`. Then update `gl.viewport(0, 0, canvas.width, canvas.height)` in the same place — forgetting the viewport is the classic resize bug, and it stretches or crops the scene instead of failing loudly.
- **Shadertoy**: all four patterns in this demo are canonical Shadertoy exercises. The site has a live GLSL editor, a large library of community shaders, and a standard uniform convention (`iTime`, `iResolution`, `iMouse`).
- **Canvas resolution**: shader cost scales with pixel count. At 4K, a complex shader runs 4× slower than at 1080p. Use `devicePixelRatio` carefully — rendering at 0.5× device pixels and upscaling often looks fine for background shaders.
- **`mediump` vs `highp`**: `precision mediump float` is required on mobile. Some shaders produce visible banding at `mediump` — switch to `precision highp float` for patterns with fine detail.
- **Mouse uniform**: add `uniform vec2 uMouse` and pass `e.clientX / W, e.clientY / H` to make any shader interactive without rewriting the core algorithm.

## See also
- [Fluid / Liquid Simulation](../fluid-simulation/) — blobs drawn by the same one-surface shader setup
- [Ray Marching / SDF Scene](../ray-marching-sdf/) — a whole 3D scene drawn by one shader
- [Noise-Based Motion](../noise-based-motion/) — moving patterns drawn on a 2D canvas instead
