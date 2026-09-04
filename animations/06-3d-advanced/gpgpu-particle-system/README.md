# GPGPU Particle System

## What it is
GPGPU (General-Purpose GPU) particle systems store particle state — position, velocity, age — in floating-point textures rather than JavaScript arrays, and update that state in fragment shaders rather than CPU loops. Each frame, a "physics pass" reads the position texture, computes new positions via a fragment shader, and writes to a second texture. The "render pass" reads the updated positions from a vertex shader and draws each particle as a point. This architecture enables 100,000+ particles at 60fps — impossible with CPU-computed JavaScript arrays.

## When to use it
- Large-scale particle effects: galaxy simulations, fluid flow, fire systems, crowd simulations
- Any particle system where JavaScript particle count is the performance bottleneck
- Creative coding contexts where particle count itself is the aesthetic (100k points forming a shape)
- Technical demonstrations of GPGPU principles in the browser

## How it works
**Data layout**: a 256×256 texture of RGBA32F pixels stores 65,536 particles. Each pixel = one particle's `(x, y, vx, vy)`.

**Physics shader** (WebGL2 fragment shader, renders to offscreen texture):

```glsl
#version 300 es
precision highp float;
uniform sampler2D uPos;   // read previous frame's positions
uniform float uTime, uSpeed;
uniform int uBehavior;
out vec4 outColor;        // write new positions

float hash(float n) { return fract(sin(n) * 43758.5); }

void main() {
  ivec2 coord = ivec2(gl_FragCoord.xy);
  vec4 p = texelFetch(uPos, coord, 0);
  float x = p.x, y = p.y, vx = p.z, vy = p.w;

  // Apply behavior (flow field, vortex, attractor, etc.)
  if (uBehavior == 1) {  // vortex
    float len = length(vec2(x, y)) + 0.01;
    vx += (-y / len) * uSpeed * 0.0004;
    vy += ( x / len) * uSpeed * 0.0004;
    vx -= x * 0.0005;  // inward pull to prevent escape
    vy -= y * 0.0005;
  }
  vx *= 0.985; vy *= 0.985;  // damping
  x += vx; y += vy;
  // Respawn anything that leaves clip space
  if (abs(x) > 1.0 || abs(y) > 1.0) {
    float n = float(coord.x) * 0.0713 + float(coord.y) * 0.1319 + uTime * 0.977;
    float a = hash(n) * 6.2832, r = hash(n + 3.71) * 0.9 + 0.05;
    x = cos(a) * r; y = sin(a) * r; vx = 0.0; vy = 0.0;
  }
  outColor = vec4(x, y, vx, vy);
}
```

**Texture ping-pong** — alternate which texture is the read source each frame:

```js
// Physics pass: read tex0, write to fbo1 (which wraps tex1)
gl.bindFramebuffer(gl.FRAMEBUFFER, fbo1);
gl.bindTexture(gl.TEXTURE_2D, tex0);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

// Swap
[tex0, tex1] = [tex1, tex0];
[fbo0, fbo1] = [fbo1, fbo0];
```

**Render pass** — vertex shader reads position texture to set `gl_Position`:

```glsl
#version 300 es
in float aIndex;
uniform sampler2D uPos;
uniform vec2 uTexSize;
uniform float uPointSize;   // 1.5 CSS px x devicePixelRatio

void main() {
  int idx = int(aIndex);
  ivec2 co = ivec2(int(mod(aIndex, uTexSize.x)), idx / int(uTexSize.x));
  vec4 p = texelFetch(uPos, co, 0);
  gl_Position = vec4(p.xy, 0.0, 1.0);
  gl_PointSize = uPointSize;
}
```

## Key parameters
| Parameter | Typical value | Effect |
|-----------|--------------|--------|
| Texture size | 256×256 | 65k particles. 320×320 = 102k — test FPS before shipping |
| Physics damping | 0.985 | Higher = more inertia, slower energy loss |
| Step scale | 0.0002–0.001 | Overall particle speed per frame |
| Boundary mode | Respawn at ±1.0 | Wrap keeps particle count constant but only survives a divergence-free field |
| Respawn radius | 0.05–0.95 | Where recycled particles re-enter; a disc keeps the centre fed |

## Production notes
- **WebGL2 required**: `RGBA32F` float framebuffer targets require WebGL2 (or the `WEBGL_color_buffer_float` extension in WebGL1, which is less reliably available). WebGL2 is supported in all modern browsers (Chrome 56+, Firefox 51+, Safari 15+).
- **Three.js `GPUComputationRenderer`**: Three.js includes `GPUComputationRenderer` (in the `three/examples/jsm` path) which encapsulates the entire ping-pong texture pattern. It's the idiomatic production approach.
- **WebGPU compute shaders**: WebGPU provides proper `@compute` shader stages for GPGPU, eliminating the "fragment shader as compute" workaround. As of 2024, WebGPU is available in Chrome 113+ but not yet in Firefox stable or Safari.
- **Wrap only survives a divergence-free field**: this demo's flow field pushes particles away from the x-axis, so it has a net outward drift. An earlier version wrapped at ±1.2 while only ±1.0 is visible; particles drifted into that invisible ring faster than they came back and the canvas faded to black after about ten seconds. Tightening the wrap to ±1.0 only moved the symptom — a divergent field teleports the escapee straight back to the edge it just left, so the particles crust along the top and bottom instead. Respawning escapees at a random point near the middle is the fix, and it is what keeps the population steady here. Nothing throws in either failure, and the first second looks correct in all three versions, so this class of bug is only visible if you leave the demo running.
- **Point size is in device pixels**: the canvas backing store is sized `clientWidth * devicePixelRatio` (capped at 2 here) and `gl.viewport` uses those same numbers. `gl_PointSize` is measured in device pixels too, so it has to be multiplied by the same ratio or the points shrink on a retina screen.
- **Context loss**: a GPU reset, a tab restore, or too many live WebGL contexts will fire `webglcontextlost`. Without a listener that calls `preventDefault()`, the context never comes back and the demo stays black forever. On `webglcontextrestored` every program, buffer, texture and framebuffer has to be recreated — GPU objects do not survive the loss.
- **Mobile budget**: 65k additively blended points cover a phone screen several times over and are both slow and visually mushy. This demo drops to a 128x128 texture (16k particles) under 600px; a production system should scale the texture size to the pixel count it actually has to fill.
- **Memory**: 256×256 × 4 channels × 4 bytes (float32) = 1MB per texture. Two textures = 2MB — trivial. At 512×512 (262k particles): 4MB × 2 = 8MB.

## See also
- [Canvas Particle Effect](../canvas-particle-effect/) — CPU-based, simpler setup for <500 particles
- [Fluid Simulation](../fluid-simulation/) — SDF-based shader effect with organic merging
- [WebGL Shader Animation](../webgl-shader-animation/) — same WebGL2 context, different shader focus
