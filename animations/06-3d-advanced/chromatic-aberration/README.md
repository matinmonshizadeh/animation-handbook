# Chromatic Aberration

## What it is
Chromatic aberration copies a flaw of cheap lenses, where red, green and blue light land in slightly different places and leave colored fringes at the edges. The demo stacks a red, a green and a blue copy of a word, which add up to white where they overlap, and shifts the red and blue copies apart. The split can breathe in and out or glitch.

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
| Movement | Pulse | Pulse widens and narrows the split every 2 seconds; Glitch jumps it briefly every 4 seconds; None keeps it still |
| Color split | Medium | How far the red and blue copies sit from the word: small is 2px, medium 4px and large 8px; above about 6px the word gets hard to read |
| Direction | Slanted | Sideways splits the colors left and right; Slanted splits them at 30°; Up and down splits them vertically |
| Soft color edges | off | Blurs the red and blue copies by 2px, which looks more like a lens than a digital shift |
| Your text | PRISM | The word that splits |

## Production notes
- **`mix-blend-mode: screen`** requires a dark background — screen blending adds RGB values, so on white backgrounds all three channels sum to white and the offset is invisible. This effect works exclusively on dark backgrounds.
- **WebGL shader approach**: for radial chromatic aberration (stronger at edges, matching real lens behavior), a fragment shader samples the texture at three different UV offsets per pixel. The CSS approach only supports uniform directional offset.
- **Text legibility**: at intensities above ~6px, text becomes hard to read. Use at high intensities only for short headlines or decorative elements, never for body copy.
- **Performance**: CSS stacked elements with `mix-blend-mode` trigger compositing on the GPU. Three `screen`-blended layers is inexpensive. Avoid applying it to large image areas on mobile.

## See also
- [Glitch Text](../../05-text-typography/glitch-text/) — red and cyan strips tear across a word
- [WebGL Shader Animation](../webgl-shader-animation/) — shaders, which can split colors pixel by pixel
- [Scramble / Glitch Text](../../05-text-typography/scramble-text/) — random symbols lock into the real text
