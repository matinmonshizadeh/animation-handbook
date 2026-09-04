# 3D Model Orbit

## What it is
3D model orbit renders a Phong-shaded 3D object in a WebGL canvas and continuously rotates it around one or more axes. It is the foundational WebGL demo: a vertex buffer, a shader program, a model-view-projection matrix, and a render loop. Everything in WebGL-based 3D descends from this pattern.

## When to use it
- Product configurators where a 3D object must rotate on hover or on scroll
- Hero sections that display an animated 3D logo or abstract shape
- Mouse-follow effects where an object tilts to track the cursor
- Educational contexts for showing the structure of 3D coordinate systems

## How it works
A WebGL program needs three components: geometry (vertex data), shaders (GPU programs), and a transformation matrix.

**Vertex shader** receives each vertex position and normal, and outputs the clipped position plus interpolated data for the fragment shader:

```glsl
attribute vec3 aPos, aNorm;
uniform mat4 uMVP, uM;        /* model-view-projection, model */
varying vec3 vN, vP;

void main() {
  gl_Position = uMVP * vec4(aPos, 1.0);
  vP = (uM * vec4(aPos, 1.0)).xyz;
  vN = normalize(mat3(uM) * aNorm);
}
```

**Fragment shader** applies Phong lighting — ambient + diffuse + specular:

```glsl
precision mediump float;
varying vec3 vN, vP;
uniform vec3 uCol, uLight;

void main() {
  vec3 L = normalize(uLight - vP);
  vec3 V = normalize(vec3(0., 0., 4.) - vP);
  float d = max(dot(vN, L), 0.0);
  float s = pow(max(dot(reflect(-L, vN), V), 0.0), 48.0);
  gl_FragColor = vec4(0.15 * uCol + d * uCol + 0.7 * s, 1.0);
}
```

**Transformation pipeline** — the MVP matrix chain:

```js
const P   = perspective(Math.PI/4, width/height, 0.1, 20);
const T   = translate(0, 0, -dist);
const M   = multiply(multiply(T, rotateY(ry)), rotateX(rx));
const MVP = multiply(P, M);
```

## Key parameters
| Parameter | Typical value | Effect |
|-----------|--------------|--------|
| Camera distance | 2.5–4 | Controls perceived object size without changing field of view |
| Field of view | 45° | Wider FOV = more distortion (fisheye); narrower = more orthographic |
| Specular exponent | 16–128 | Higher = tighter, shinier highlight; lower = broad matte glow |
| Rotation speed | 0.5–2 rad/s | Match to the energy of the surrounding content |

## Production notes
- **Three.js in production**: Three.js's `PerspectiveCamera`, `MeshPhongMaterial`, and `OrbitControls` replace everything in this demo in ~20 lines. Use Three.js for anything more complex than a single object — raw WebGL becomes unmanageable fast.
- **Normal matrix**: strictly, normals should be transformed by the inverse-transpose of the model matrix, not the model matrix itself. For uniform scaling (no non-uniform squash/stretch), the model matrix works fine. For non-uniform scale, use `mat3(transpose(inverse(uM)))`.
- **`prefers-reduced-motion`**: stop the animation loop and show the object in its default orientation. The object should remain visible and interactive for camera control.
- **Touch/pointer interaction**: use `pointerdown` / `pointermove` / `pointerup` for drag-to-rotate, not `mousedown` — this covers touch without separate event listeners.
- **Fail loudly**: a shader that does not compile produces a black canvas and no exception, because `COMPILE_STATUS` is only readable if you ask for it. Check it (and `LINK_STATUS`) and show a message; a silent black box is the hardest WebGL bug to diagnose.
- **Context loss**: the browser can drop a WebGL context on a GPU reset, driver update, or tab restore, and the canvas then stays blank forever. In production, listen for `webglcontextlost` (call `preventDefault()` on it) and rebuild buffers, textures, and programs in `webglcontextrestored`. This demo does not, to keep the render path readable.

## See also
- [Scroll-Driven 3D Rotation](../scroll-driven-3d-rotation/) — scroll position drives the rotation instead of time
- [Parallax 3D Tilt](../parallax-3d-tilt/) — CSS 3D equivalent for flat cards
- [WebGL Shader Animation](../webgl-shader-animation/) — same WebGL boilerplate, different fragment shader focus
