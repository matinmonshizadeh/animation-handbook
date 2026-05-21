# Outline to Fill

## What it is
Outline-to-fill starts text as hollow letterforms — a visible stroke with a transparent interior — then fills the characters with color. The transition reads as text being "inked in," giving it a sculptural, hand-crafted quality. Two implementation approaches exist: a clip-path reveal (directional, like paint being applied from one side) and an opacity crossfade (simultaneous, like ink bleeding in uniformly).

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
| Fill duration | 900ms | 400ms = snappy; 1500ms = slow and dramatic |
| Stroke width | 2px | Thinner reads as precise/elegant; thicker reads as bold/graphic |
| Direction | Bottom-up | Bottom-up reads as being filled like a container; left-right reads like writing |
| Easing | ease-in-out | Symmetrical ease gives a smooth start and end |

## Production notes
- **`-webkit-text-stroke` is non-standard**: it is supported in all modern browsers (Chrome, Firefox, Safari, Edge) but is not in the CSS specification. The standard alternative is `text-shadow` with a spread — less crisp but more compatible. For production, test the stroke rendering in your target browsers and font size.
- **Stroke applies outside the fill**: `-webkit-text-stroke` distributes the stroke both inside and outside the character path. At thick values, it can eat into the letterform's counter (interior space). Use thin strokes (1–3px) for body sizes; thicker only for very large display type.
- **Two-element overhead**: the technique requires two DOM elements per animated word. For many words or dynamic content, consider generating these programmatically or using a single-element approach (CSS mask with SVG text, or Canvas).
- **GSAP**: animate `clipPath` on the fill layer element directly. `gsap.to(fillLayer, { clipPath: 'inset(0%)', duration: 0.9, ease: 'power2.inOut' })`.

## See also
- [Text Gradient Animation](../text-gradient-animation/) — fills text with a moving gradient instead of a solid color
- [Text Clip-Path Reveal](../text-clip-path-reveal/) — the same clip-path reveal technique applied to full lines of text
- [Clip-Path Reveal](../../02-entrance-and-exit/clip-path-reveal/) — the general-purpose element clip-path reveal
