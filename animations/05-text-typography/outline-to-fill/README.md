# Outline to Fill

## What it is
Outline to fill starts text as hollow letters, with only the outline of each letter showing, then fills them with color, so the text looks as if it is being inked in. There are two ways to do it, and the demo shows both: a wipe that fills the letters from one side, like paint, and a fade that fills them everywhere at once, like ink soaking in.

## When to use it
- Hero words on posters and editorial-style sites where the letterforms themselves are the visual
- Logo reveals and wordmark animations
- Section headings that activate on scroll entry
- Any headline where a simple fade-in would be too plain but full kinetic typography is too complex

## How it works
`-webkit-text-stroke` creates the hollow outline; a `color: transparent` makes the fill invisible. Two identical text elements are layered — the outline layer always visible, the fill layer revealed by a clip-path animation:

```html
<div class="text-wrap">
  <div class="outline-layer">OUTLINE</div>   <!-- always visible: stroke, no fill -->
  <div class="fill-layer">OUTLINE</div>      <!-- revealed: stroke + fill -->
</div>
```

```css
.text-wrap { position: relative; display: inline-block; }

.outline-layer {
  -webkit-text-stroke: 2px #58a6ff;
  color: transparent;
  position: relative;
  z-index: 2;
}

.fill-layer {
  position: absolute;
  inset: 0;
  -webkit-text-stroke: 2px #58a6ff;
  color: #58a6ff;
  clip-path: inset(100% 0 0 0);   /* fully hidden initially (bottom-up) */
  transition: clip-path 900ms ease-in-out;
  z-index: 1;
}

.fill-layer.filled {
  clip-path: inset(0%);           /* fully revealed */
}
```

Trigger the fill in JavaScript:
```js
document.querySelector('.fill-layer').classList.add('filled');
```

Direction variants change the starting `clip-path`:
```css
/* Bottom to top (default) */
clip-path: inset(100% 0 0 0);

/* Top to bottom */
clip-path: inset(0 0 100% 0);

/* Left to right */
clip-path: inset(0 100% 0 0);

/* Center outward */
clip-path: inset(50% 0);   /* top+bottom each at 50% = nothing visible */
```

For the opacity crossfade variant (no clip-path):
```css
.stroke-only { opacity: 1; transition: opacity 900ms ease; }
.fill-only   { opacity: 0; transition: opacity 900ms ease; }

.filled .stroke-only { opacity: 0; }
.filled .fill-only   { opacity: 1; }
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Fill direction | Bottom up | Where the wipe starts: the bottom, the top, the left, the right or the middle; bottom up reads like filling a container, left to right like writing. The fade has no direction |
| Speed | Normal | How long the fill takes: slow is 1500ms, normal 900ms and fast 550ms |
| Outline thickness | Medium | How wide the outline is: thin is 1px, medium 2px and thick 4px; thin looks precise, thick looks bold |
| Feel | Gentle | Gentle eases in and out; Smooth slows to a stop; Even keeps one steady pace |
| Outline color | Pink | The color of the letters' outline |
| Fill color | Pink | The color that fills the letters |
| Your text | OUTLINE | The word that fills, up to 10 letters, shown in capitals |

## Production notes
- **`-webkit-text-stroke` is non-standard**: it is supported in all modern browsers (Chrome, Firefox, Safari, Edge) but is not in the CSS specification. The standard alternative is `text-shadow` with a spread — less crisp but more compatible. For production, test the stroke rendering in your target browsers and font size.
- **Stroke applies outside the fill**: `-webkit-text-stroke` distributes the stroke both inside and outside the character path. At thick values, it can eat into the letterform's counter (interior space). Use thin strokes (1–3px) for body sizes; thicker only for very large display type.
- **Two-element overhead**: the technique requires two DOM elements per animated word. For many words or dynamic content, consider generating these programmatically or using a single-element approach (CSS mask with SVG text, or Canvas).
- **GSAP**: animate `clipPath` on the fill layer element directly. `gsap.to(fillLayer, { clipPath: 'inset(0%)', duration: 0.9, ease: 'power2.inOut' })`.

## See also
- [Text Gradient Animation](../text-gradient-animation/) — colors flow through the letters instead
- [Text Clip-Path Reveal](../text-clip-path-reveal/) — whole lines are uncovered the same way
- [Clip-Path Reveal](../../02-entrance-and-exit/clip-path-reveal/) — a shape uncovers any element
