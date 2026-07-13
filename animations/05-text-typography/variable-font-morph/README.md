# Variable Font Morph

## What it is
Variable fonts pack an entire type family — thin through black, condensed through extended, roman through italic — into a single font file. CSS `font-variation-settings` exposes these axes as numeric values. Animating the values with CSS `transition` or `@keyframes` interpolates smoothly between any two points in the design space, enabling effects impossible with static fonts: weight pulsing, live slant, and fluid width changes.

## When to use it
- Hero headlines that breathe or pulse on a loop
- Hover effects where weight increases to signal interactivity
- Loading states where a spinner is replaced by weight-cycling text
- Brand expressions where the variable axis is part of the visual identity
- Interactive sliders that let users configure the weight/width/style live

## How it works
Set `font-variation-settings` on the element and apply a CSS transition. The browser interpolates all axes simultaneously:

```css
.headline {
  font-family: 'Recursive', sans-serif;
  font-variation-settings: 'wght' 400, 'CASL' 0, 'slnt' 0;
  transition: font-variation-settings 600ms cubic-bezier(.4, 0, .2, 1);
}

.headline:hover {
  font-variation-settings: 'wght' 800, 'CASL' 1, 'slnt' -15;
}
```

For JavaScript-driven morphing, update a CSS custom property:

```js
function apply(wght, casl, slnt) {
  const el = document.documentElement;
  el.style.setProperty('--wght', wght);
  el.style.setProperty('--CASL', casl);   // 0–1 range for Recursive
  el.style.setProperty('--slnt', slnt);   // –15 to 0 for Recursive
}
```

```css
.headline {
  font-variation-settings: 'wght' var(--wght), 'CASL' var(--CASL), 'slnt' var(--slnt);
}
```

For a looping morph between presets, use `setInterval`:

```js
const PRESETS = [
  { wght: 300, CASL: 0,   slnt:   0 },
  { wght: 900, CASL: 0,   slnt:   0 },
  { wght: 700, CASL: 1,   slnt: -15 },
];
let i = 0;
setInterval(() => { apply(...Object.values(PRESETS[i++ % PRESETS.length])); }, 1400);
```

## Key parameters
| Axis | ID | Typical range | Effect |
|------|----|--------------|--------|
| Weight | `wght` | 100–900 (or 300–1000 for Recursive) | Thickness — most fonts have this axis |
| Slant | `slnt` | –15° to 0° | Oblique angle without a separate italic font |
| Casual | `CASL` | 0–1 (Recursive-specific) | Transitions between strict monospace and flowing casual style |
| Width | `wdth` | 75–125% | Horizontal compression/expansion (Fraunces, some others) |
| Optical size | `opsz` | 8–144pt | Stroke weight adjustments for different display sizes |

## Production notes
- **Axis ranges are font-specific**: `wght` 100–900 is standard, but Recursive goes to 1000, and some fonts start at 200. Always check the font's documentation or use a variable font inspector (e.g., Wakamai Fondue, wakamaifondue.com).
- **`font-variation-settings` is all-or-nothing**: if you set `font-variation-settings: 'wght' 700`, all other axes reset to their defaults. Always specify all axes you care about, even if unchanged.
- **CSS `font-weight` is preferred for weight**: `font-weight: 700` works with variable fonts and is more readable than `font-variation-settings: 'wght' 700`. Use `font-variation-settings` only for non-standard axes (`CASL`, `MONO`, etc.).
- **Transition performance**: variable font interpolation is handled by the GPU text rendering pipeline in modern browsers. It is not as fast as `transform`/`opacity` animations, but it is generally smooth on mid-range devices for single display elements.
- **Font loading**: this demo ships no font files — it targets `system-ui`, which resolves to a real variable font on modern OSes (Segoe UI Variable on Windows 11, San Francisco on macOS), so the `wght` axis morphs smoothly offline. `font-weight` and a `skewX()` transform are wired as universal fallbacks so weight and slant still animate where no variable font is present. In production, self-host a variable font (e.g. Recursive) via `@font-face` with `font-display: swap` to unlock font-specific axes like `CASL`.
- **Recommended variable fonts**: Recursive (CASL, MONO, slnt, wght), Inter (wght), Fraunces (opsz, SOFT, WONK, wght), Bricolage Grotesque (opsz, wdth, wght).

## See also
- [Text Gradient Animation](../text-gradient-animation/) — another CSS-only text effect that animates a background property rather than the font itself
- [Kinetic Typography](../kinetic-typography/) — uses weight and scale changes as part of a narrative sequence
- [Outline to Fill](../outline-to-fill/) — another typographic state transition using CSS properties
