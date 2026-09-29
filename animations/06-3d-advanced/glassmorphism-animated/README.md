# Glassmorphism Animated

## What it is
Glassmorphism styles a card as frosted glass: a see-through tint, a blur of whatever sits behind it, and a thin light edge. It only works when something colorful moves behind the glass, so the demo drifts soft color blobs behind three cards: one with a still frost, one whose blur breathes, and one whose tint slowly changes.

## When to use it
- SaaS dashboards and product landing pages where glass cards display metrics or features
- Modal dialogs that sit over a blurred version of the underlying content
- Navigation overlays and sidebars with blurred backdrop
- Any dark-themed UI where depth between layers must be communicated without heavy borders

## How it works
Three CSS properties create the glass effect:

```css
.glass-card {
  background: rgba(88, 166, 255, 0.12);   /* semi-transparent tint */
  backdrop-filter: blur(12px) saturate(1.8);
  -webkit-backdrop-filter: blur(12px) saturate(1.8);
  border: 1px solid rgba(255, 255, 255, 0.18);   /* light edge highlight */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.2); /* top edge catch-light */
}
```

**Animated blur** cycles the `backdrop-filter` value via `@keyframes`:

```css
@keyframes blur-breath {
  0%, 100% { backdrop-filter: blur(8px) saturate(1.8); }
  50%       { backdrop-filter: blur(20px) saturate(2); }
}
```

**Animated background blobs** — pure CSS keyframe motion that gives the glass something interesting to blur:

```css
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  animation: blob-move 8s ease-in-out infinite alternate;
}

@keyframes blob-move {
  0%   { transform: translate(0, 0)      scale(1); }
  33%  { transform: translate(40px,-30px) scale(1.1); }
  100% { transform: translate(30px, 10px) scale(1.05); }
}
```

**A pattern behind the glass** makes the frost visible. Colors that are already a soft blur leave the glass nothing to soften, so Light, Medium and Heavy frost would look alike. The demo puts a faint pattern of white dots between the colors and the cards. Each card blurs the dots behind it: Off leaves them sharp, Light softens them and Heavy smears them almost away. The pattern fades out toward the edges of the stage, so most of the stage still reads as soft color:

```css
.stage::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.16) 0 16px, transparent 18px) 0 0 / 56px 56px;
  mask-image: radial-gradient(ellipse closest-side, #000 68%, transparent);
}
```

**A dark layer under the text** keeps the words readable. Bright colors pass behind the glass, and white text over them can fall well under the 4.5:1 contrast that small text needs. Each card has a see-through dark layer that sits above the tint and the blurred backdrop and below the text (the card's `z-index` gives the layer's `z-index: -1` a place inside the card):

```css
.glass-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: rgba(6, 8, 14, 0.54);
  z-index: -1;
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Frost | Medium | How strongly the glass blurs what is behind it: light is 6px, medium 12px and heavy 20px; off shows the cards with no blur, to compare |
| Tint strength | Medium | How much color the glass adds: faint is 6%, medium 12% and strong 25% |
| Speed | Normal | How long the colors behind take to drift through one path: slow is 13s, normal 8s and fast 5s |
| Tint color | Blue | The color of the glass |
| Breathing frost | on | The middle card's blur grows from 8px to 20px and back every 4 seconds |
| Shifting tint | on | The right card's tint moves through blue, green, purple and orange every 8 seconds |

## Production notes
- **`backdrop-filter` is GPU-expensive**: the browser must capture a snapshot of everything behind the element and blur it every frame. On large glass surfaces or low-end hardware this causes frame drops. Keep glass cards small; avoid full-screen glass overlays.
- **`-webkit-` prefix still required**: Safari needs `-webkit-backdrop-filter` even in 2024. Include both the prefixed and unprefixed property.
- **The backdrop must have content**: `backdrop-filter` blurs what is behind the element. If the background is a solid color, the blur does nothing — the glass looks like dirty plastic. Colorful, high-contrast content behind the glass is required for the effect to be visible.
- **Frost needs detail behind it to show**: a blur of soft color changes little as the amount grows, so a Frost setting can look as if it does nothing. Put something with edges behind the glass, such as a pattern, shapes or an image, as the demo does with its dots.
- **Keep the text readable**: measure the contrast of the text against what is really behind it, at several moments of the animation, not against the tint. The demo darkens the glass under the text with a see-through layer, so every text stays at 4.5:1 or better, even over the brightest colors.
- **Dark mode**: glassmorphism requires a dark-enough background to read as glass rather than a white haze. The effect works better on dark themes.
- **Changing the length of a running animation**: a new `animation-duration` puts a running CSS animation at a different point of its cycle, so it jumps. The demo makes its negative delays fractions of the duration and multiplies each blob's `currentTime` by the new length divided by the old one, so a change of Speed keeps every blob where it is.
- **Compare with the blur off**: the demo's Frost setting has an Off choice. If the page is noticeably faster without the blur, reconsider the design.

## See also
- [Mesh Gradient Animation](../../07-ambient-background/mesh-gradient/) — soft color blobs drifting as a background
- [WebGL Shader Animation](../webgl-shader-animation/) — moving color drawn on the graphics chip
- [Modal Expand](../../04-micro-interactions/modal-expand/) — a dialog, where frosted glass often appears
