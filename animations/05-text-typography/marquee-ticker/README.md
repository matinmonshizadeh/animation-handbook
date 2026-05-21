# Marquee / Ticker

## What it is
A marquee is text (or any content) that scrolls continuously in one direction without pausing. The seamless loop is achieved by duplicating the content so that when the first copy exits, the second copy has arrived at exactly the same position — making the reset invisible. Marquees are used for news tickers, brand statements, infinite scroll walls, and ambient content that doesn't demand focus.

## When to use it
- Scrolling news tickers and sports scores
- Branded content rails on agency/portfolio sites ("CLIENT LIST · WORK · PROCESS ·")
- Infinite logo strips (scrolling client logos)
- Ambient background text in hero sections
- Two-row opposite-direction marquees as a decorative pattern

## How it works
The track contains the content duplicated exactly twice. The CSS animation translates the track by `-50%` of its total width — which equals the width of one copy. At the loop point, the second copy is at the position the first copy started, making the transition invisible:

```html
<div class="overflow-container">
  <div class="track">
    <span>Content · Content · Content ·</span>
    <span>Content · Content · Content ·</span>  <!-- duplicate -->
  </div>
</div>
```

```css
.overflow-container { overflow: hidden; }

.track {
  display: flex;
  width: max-content;
  white-space: nowrap;
  animation: marquee 10s linear infinite;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

To calculate the correct duration for a target pixel-per-second speed:

```js
// The animation travels exactly one copy's width (50% of the full track)
const oneCopyWidth = trackEl.scrollWidth / 2;
const durationSeconds = oneCopyWidth / pixelsPerSecond;
trackEl.style.animationDuration = durationSeconds + 's';
```

Pause on hover:

```css
.overflow-container:hover .track {
  animation-play-state: paused;
}
```

Reverse direction by animating from `-50%` to `0`:

```css
@keyframes marquee-reverse {
  from { transform: translateX(-50%); }
  to   { transform: translateX(0); }
}
```

## Key parameters
| Parameter | Typical range | Effect |
|-----------|--------------|--------|
| Speed | 40–150px/sec | News tickers: 40–60; branded rails: 80–120; dramatic: 150+ |
| Font size | 24–96px | Large type (60–96px) is the dominant agency pattern; smaller for news tickers |
| Gap between items | 32–80px | Breathing room between repetitions — use a separator character (· ★ —) |
| Direction | LTR or RTL | Convention: left-to-right for Western text; RTL for Arabic/Hebrew |

## Production notes
- **Duplicate once, not more**: duplicating twice is enough for any viewport width as long as one copy is wider than the viewport. More duplicates waste DOM. If your text is very short, add more repetitions within each copy rather than more copies.
- **`width: max-content`** on the track prevents line wrapping. Without it, text wraps at the container width, breaking the layout.
- **`will-change: transform`** on the track element promotes it to a GPU compositing layer. Measure performance before adding — it reserves GPU memory and can cause issues on low-end mobile.
- **Pause on hover is UX-critical**: users who want to read specific content need to be able to pause. The `:hover` CSS approach is zero JavaScript.
- **Accessibility**: add `aria-live="off"` to the marquee container — screen readers should not continuously announce scrolling content. If the content contains links, ensure they are reachable by keyboard (focus state visible, tabIndex correct).
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` → `animation-play-state: paused`. The content is still visible, just static.
- **Swiper.js** has an `autoplay` + `loop` mode that handles marquee behavior with touch support and accessibility built in.

## See also
- [Rotate Word Carousel](../rotate-word-carousel/) — single cycling word rather than continuous horizontal scroll
- [Kinetic Typography](../kinetic-typography/) — text that moves with narrative intent rather than ambient looping
