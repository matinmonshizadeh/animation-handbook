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
- **Dark mode**: glassmorphism requires a dark-enough background to read as glass rather than a white haze. The effect works better on dark themes.
- **Compare with the blur off**: the demo's Frost setting has an Off choice. If the page is noticeably faster without the blur, reconsider the design.

## See also
- [Mesh Gradient Animation](../../07-ambient-background/mesh-gradient/) — soft color blobs drifting as a background
- [WebGL Shader Animation](../webgl-shader-animation/) — moving color drawn on the graphics chip
- [Modal Expand](../../04-micro-interactions/modal-expand/) — a dialog, where frosted glass often appears
