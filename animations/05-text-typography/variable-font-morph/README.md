# Variable Font Morph

## What it is
A variable font holds a whole range of styles, such as thin to black, in one file, and each style is just a number. Because of that, the browser can move smoothly from one style to another, so a word can grow heavier or lighter as you watch. In the demo, the word moves between the site font's regular and black weights and leans over by being tilted, since this font has no slanted style of its own.

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
  font-weight: 400;
  font-variation-settings: 'wght' 400;
  transition: font-weight 600ms cubic-bezier(.4, 0, .2, 1),
              font-variation-settings 600ms cubic-bezier(.4, 0, .2, 1);
}

.headline:hover {
  font-weight: 800;
  font-variation-settings: 'wght' 800;
}
```

For JavaScript-driven morphing, update a CSS custom property:

```js
function apply(wght, slnt) {
  const el = document.documentElement;
  el.style.setProperty('--wght', wght);   // 400–900 for the site font
  el.style.setProperty('--slnt', slnt);   // 0 to –15, drawn as a tilt
}
```

```css
.headline {
  font-weight: var(--wght);
  font-variation-settings: 'wght' var(--wght);
  transform: skewX(calc(var(--slnt) * 1deg));   /* the site font has no slant axis */
}
```

For a looping morph between presets, use `setInterval`:

```js
const PRESETS = [
  { wght: 400, slnt:   0 },
  { wght: 900, slnt:   0 },
  { wght: 700, slnt: -15 },
];
let i = 0;
setInterval(() => { apply(...Object.values(PRESETS[i++ % PRESETS.length])); }, 1400);   // Speed + an 800ms rest
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | Normal | How long each change takes: slow is 1000ms, normal 600ms and fast 350ms; the word then rests for 800ms before the next |
| Leans as it changes | on | Some changes also tilt the word by up to 15 degrees; off, only the weight changes |
| Your text | Type | The word that changes |

## Production notes
- **Axis ranges are font-specific**: `wght` 100–900 is standard, but Recursive goes to 1000, and some fonts start at 200. Always check the font's documentation or use a variable font inspector (e.g., Wakamai Fondue, wakamaifondue.com).
- **`font-variation-settings` is all-or-nothing**: if you set `font-variation-settings: 'wght' 700`, all other axes reset to their defaults. Always specify all axes you care about, even if unchanged.
- **CSS `font-weight` is preferred for weight**: `font-weight: 700` works with variable fonts and is more readable than `font-variation-settings: 'wght' 700`. Use `font-variation-settings` only for non-standard axes (`CASL`, `MONO`, etc.).
- **Transition performance**: variable font interpolation is handled by the GPU text rendering pipeline in modern browsers. It is not as fast as `transform`/`opacity` animations, but it is generally smooth on mid-range devices for single display elements.
- **Font loading**: the demo uses the site's own font, Schibsted Grotesk, which every page already loads and which is variable in weight from 400 to 900, so the weight morphs smoothly offline. It has no slant axis, so the lean is a `skewX()` tilt. A font with more axes gives you more to morph: Recursive, for example, adds Casual and slant axes. Self-host it with `@font-face` and `font-display: swap`.
- **Recommended variable fonts**: Recursive (CASL, MONO, slnt, wght), Inter (wght), Fraunces (opsz, SOFT, WONK, wght), Bricolage Grotesque (opsz, wdth, wght).

## See also
- [Text Gradient Animation](../text-gradient-animation/) — colors flow through the letters instead
- [Kinetic Typography](../kinetic-typography/) — words that each move in their own way
- [Outline to Fill](../outline-to-fill/) — hollow letters fill with color
