# Marquee / Ticker

## What it is
A marquee scrolls a line of text sideways without end, like a news ticker. The text is repeated, and the row moves by exactly the width of one copy before starting over, so an identical copy is always in place and the restart cannot be seen. In the demo, three rows scroll at the same pace, the middle one the other way, and pointing at a row or tapping it stops just that row.

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
| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | Normal | How fast the text travels: slow is 50px, normal 80px and fast 130px per second; news tickers run slower, brand strips faster |
| Text size | Medium | Small is 32px, medium 48px and large 64px; large type is the usual choice for brand strips |
| Space between items | Medium | The space around each repeat of the text and its separator: tight is 24px, medium 48px and wide 80px |
| Separator | Sparkle ✦ | The mark between repeats: a dot, a star, a dash or a sparkle |
| Your text | Animation Handbook | The text that scrolls |

## Production notes
- **Duplicate once, not more**: duplicating twice is enough for any viewport width as long as one copy is wider than the viewport. More duplicates waste DOM. If your text is very short, add more repetitions within each copy rather than more copies.
- **`width: max-content`** on the track prevents line wrapping. Without it, text wraps at the container width, breaking the layout.
- **`will-change: transform`** on the track element promotes it to a GPU compositing layer. Measure performance before adding — it reserves GPU memory and can cause issues on low-end mobile.
- **Pause on hover is UX-critical**: users who want to read specific content need to be able to pause. The `:hover` CSS approach is zero JavaScript.
- **Accessibility**: add `aria-live="off"` to the marquee container — screen readers should not continuously announce scrolling content. If the content contains links, ensure they are reachable by keyboard (focus state visible, tabIndex correct).
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` → `animation-play-state: paused`. The content is still visible, just static.
- **Swiper.js** has an `autoplay` + `loop` mode that handles marquee behavior with touch support and accessibility built in.

## See also
- [Rotate Word Carousel](../rotate-word-carousel/) — one word in a sentence keeps changing
- [Kinetic Typography](../kinetic-typography/) — words that each move in their own way
- [Text on a Path](../text-on-path/) — text scrolls along a curve instead
