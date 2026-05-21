# Text Gradient Animation

## What it is
Text gradient animation flows color through the characters of a text element. The two required CSS properties are `background-clip: text` and `color: transparent` — these expose the element's background image through the character shapes. Animating `background-position` then moves the gradient behind the stationary text, creating the appearance of color flowing through the letters. The text itself never moves.

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

For a conic gradient (rotating color wheel):

```css
.conic-text {
  background-image: conic-gradient(from 0deg, #58a6ff, #56d364, #d2a8ff, #ffa657, #58a6ff);
  background-size: 200% 200%;
  background-position: 50% 50%;
  animation: spin 4s linear infinite;
}

@keyframes spin {
  from { background-position: 0% 0%; }
  to   { background-position: 100% 100%; }
}
```

For live JavaScript control (e.g., mouse position driving gradient angle):

```js
el.style.backgroundImage = `linear-gradient(${angle}deg, ${c1}, ${c2})`;
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Animation duration | 4s | Slower = more subtle and ambient; faster = more energetic |
| `background-size` | 300% | Larger = wider gradient, softer transitions; smaller = more color change per pixel |
| Color stops | 4–5 | More stops = richer; repeat first stop at end to loop seamlessly |
| Gradient type | Linear | Conic creates a rotation effect; radial creates a pulsing center |

## Production notes
- **`-webkit-background-clip: text`**: the non-prefixed `background-clip: text` is now widely supported (Chrome 119+, Firefox 122+, Safari 14+), but the `-webkit-` prefix is still required for Safari compatibility across all versions. Include both.
- **`color: transparent` is required**: `background-clip: text` clips the background to the text shape, but the text color still renders on top. Without `color: transparent`, the gradient is hidden beneath solid text color.
- **Performance**: `background-position` animation does not use the CSS compositor and triggers paint on each frame. For long-running animations on large text, test performance on mid-range devices. `@keyframes` (vs. JS `requestAnimationFrame`) avoids the main thread.
- **Fallback**: set a solid `color` on the element before the gradient properties. Browsers that don't support `background-clip: text` will show solid-color text rather than invisible text.
- **Selection color**: selected text with `color: transparent` may render without a visible selection highlight in some browsers. Test selection behavior and add `::selection { color: white; background: blue; }` if needed.

## See also
- [Variable Font Morph](../variable-font-morph/) — another CSS-only text animation, morphing font axes rather than color
- [Outline to Fill](../outline-to-fill/) — color appearing inside text characters via a different mechanism (clip-path reveal)
- [Kinetic Typography](../kinetic-typography/) — gradient text as one technique within a broader motion sequence
