# Chromatic Aberration

## What it is
Chromatic aberration is a lens defect where different wavelengths of light refract at slightly different angles, causing color fringing at high-contrast edges — red fringing on one side, blue on the other. In digital design it is used deliberately as an aesthetic, evoking analog imperfection, glitch aesthetics, or a stylized photographic look. The CSS implementation stacks three mix-blend-mode: screen layers tinted red, green, and blue, offset in opposite directions.

## When to use it
- Glitch-aesthetic branding for music, gaming, and tech-edge products
- Distressed print or retro-VHS visual styles
- Error or warning states that should feel physically "wrong"
- Hover effects that signal interactivity through optical distortion

## How it works
Three identical text or image elements are layered. Each is tinted to a single color channel using `filter` or explicit color, and blended with `mix-blend-mode: screen` so only that channel's color contributes to the composite result. The red and blue layers are offset in opposite directions from the green (center) layer:

```css
.ca-wrap { position: relative; display: inline-block; }

.ca-layer      { position: absolute; inset: 0; mix-blend-mode: screen; }
.ca-layer.base { position: relative; mix-blend-mode: normal; }  /* sizing */

.ca-r .text { color: #ff2020; }   /* red channel  */
.ca-g .text { color: #20ff20; }   /* green channel (center, no offset) */
.ca-b .text { color: #2060ff; }   /* blue channel  */
```

```js
function applyOffset(amount, angleDeg) {
  const rad = angleDeg * Math.PI / 180;
  const dx = (Math.cos(rad) * amount).toFixed(1);
  const dy = (Math.sin(rad) * amount).toFixed(1);
  rLayer.style.transform = `translate(${dx}px, ${dy}px)`;
  bLayer.style.transform = `translate(${-dx}px, ${-dy}px)`;  // opposite
}
```

**Animated glitch** — periodic jumps to large random offsets, then back:

```css
@keyframes ca-glitch-r {
  0%, 80%, 100% { transform: translate(4px, 0); }
  82%           { transform: translate(12px, -4px); }
  84%           { transform: translate(4px, 0); }
  86%           { transform: translate(-8px, 4px); }
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Intensity | 4px | 1–3px = subtle fringing; 6–12px = obvious glitch; above 15px = illegible |
| Angle | 30° | 0° = pure horizontal split; 90° = vertical; 45° = diagonal (most "lens-like") |
| Animation mode | Static | Static = editorial print; Pulse = organic breathing; Glitch = digital artifact |
| Channel blur | 0px | Soft blur on R/B channels adds lens chromatic fringing rather than digital pixel offset |

## Production notes
- **`mix-blend-mode: screen`** requires a dark background — screen blending adds RGB values, so on white backgrounds all three channels sum to white and the offset is invisible. This effect works exclusively on dark backgrounds.
- **WebGL shader approach**: for radial chromatic aberration (stronger at edges, matching real lens behavior), a fragment shader samples the texture at three different UV offsets per pixel. The CSS approach only supports uniform directional offset.
- **Text legibility**: at intensities above ~6px, text becomes hard to read. Use at high intensities only for short headlines or decorative elements, never for body copy.
- **Performance**: CSS stacked elements with `mix-blend-mode` trigger compositing on the GPU. Three `screen`-blended layers is inexpensive. Avoid applying it to large image areas on mobile.

## See also
- [WebGL Shader Animation](../webgl-shader-animation/) — GPU shader approach to the same effect with radial falloff
- [Scramble / Glitch Text](../../05-text-typography/scramble-text/) — companion glitch effect for text characters
- [Kinetic Typography](../../05-text-typography/kinetic-typography/) — broader context for distressed visual aesthetics
