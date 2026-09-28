# Text Gradient Animation

## What it is
Text gradient animation fills the letters with a gradient instead of a flat color, then moves the gradient behind them, so color seems to flow through the word while the letters stay still. The trick is to paint the gradient as the text's background, show that background only inside the letter shapes, and make the text color itself see-through.

## When to use it
- Display headlines on creative, tech, and brand sites
- Logo animations and wordmarks
- Status text that indicates an active or loading state via color cycling
- Decorative display type that needs visual richness without imagery

## How it works
Two CSS properties expose the background through text shapes, then a keyframe animation moves the background:

```css
.gradient-text {
  /* The trick: two properties working together */
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;

  /* The gradient to animate */
  background-image: linear-gradient(90deg, #58a6ff, #56d364, #d2a8ff, #ffa657, #58a6ff);
  background-size: 300% 100%;
  animation: flow 4s linear infinite;
}

@keyframes flow {
  from { background-position: 0% 50%; }
  to   { background-position: 300% 50%; }
}
```

The `background-size: 300%` makes the gradient wider than the element, so scrolling `background-position` shows different color sections. The last color stop matches the first, creating a seamless loop.

For a gradient that turns like a color wheel, register an angle property so the browser can animate the conic gradient's starting angle:

```css
@property --ang { syntax: '<angle>'; inherits: false; initial-value: 0deg; }

.conic-text {
  background-image: conic-gradient(from var(--ang), #58a6ff, #56d364, #d2a8ff, #ffa657, #58a6ff);
  animation: spin 4s linear infinite;
}

@keyframes spin { to { --ang: 360deg; } }
```

For live JavaScript control (e.g., mouse position driving gradient angle):

```js
el.style.backgroundImage = `linear-gradient(${angle}deg, ${c1}, ${c2})`;
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Gradient | Flowing | Flowing slides the colors sideways, Spinning turns them like a color wheel, Diagonal slides slanted bands, Two colors flows between two colors of your choice |
| Speed | Normal | How long one full pass takes: slow is 6.4s, normal 4s and fast 2.4s; slower feels calm, faster feels lively |
| First color | Blue | With Two colors, the color the gradient starts and ends with |
| Second color | Purple | With Two colors, the color in the middle |
| Your text | Flow | The text the colors flow through |

## Production notes
- **`-webkit-background-clip: text`**: the non-prefixed `background-clip: text` is now widely supported (Chrome 119+, Firefox 122+, Safari 14+), but the `-webkit-` prefix is still required for Safari compatibility across all versions. Include both.
- **`color: transparent` is required**: `background-clip: text` clips the background to the text shape, but the text color still renders on top. Without `color: transparent`, the gradient is hidden beneath solid text color.
- **Performance**: `background-position` animation does not use the CSS compositor and triggers paint on each frame. For long-running animations on large text, test performance on mid-range devices. `@keyframes` (vs. JS `requestAnimationFrame`) avoids the main thread.
- **Fallback**: set a solid `color` on the element before the gradient properties. Browsers that don't support `background-clip: text` will show solid-color text rather than invisible text.
- **Selection color**: selected text with `color: transparent` may render without a visible selection highlight in some browsers. Test selection behavior and add `::selection { color: white; background: blue; }` if needed.

## See also
- [Variable Font Morph](../variable-font-morph/) — the letters themselves change weight and lean
- [Outline to Fill](../outline-to-fill/) — hollow letters fill with color
- [Kinetic Typography](../kinetic-typography/) — words that each move in their own way
