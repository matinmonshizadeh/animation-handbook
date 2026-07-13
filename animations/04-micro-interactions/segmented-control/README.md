# Segmented Control

## What it is

A segmented control is a row of two or more mutually exclusive options with a
single highlighted "pill" indicating the current choice. When the selection
changes, that indicator slides from the old option to the new one and the
label colors crossfade, so the change reads as one object moving rather than
two states blinking. It is the desktop and mobile pattern behind iOS view
switchers, filter bars, and time-range pickers.

## When to use it

- Switching between a small, fixed set of views (Day / Week / Month).
- Filtering a list by one exclusive facet where all options fit on one line.
- Replacing a dropdown when there are 2–5 short options and you want them all
  visible at once.
- Any place a radio group would work but you want the options laid out
  horizontally with a clear moving selection.

Avoid it when options are numerous, have long labels, or wrap to multiple
lines — a dropdown or tab list scales better there.

## How it works

The indicator is a single absolutely-positioned element. It never animates
`left` or `width`; instead JavaScript measures the target segment's geometry
and drives the motion entirely with `transform`, which the compositor can
animate without layout work. `translateX` moves the pill to the segment's
offset; `scaleX` stretches a fixed reference width to match segments of
different widths. The label color transition runs on the same duration so the
crossfade lands as the pill arrives.

```js
function move(i, animate) {
  const target = opts[i].getBoundingClientRect();
  const base   = opts[0].getBoundingClientRect();   // reference width
  const x  = opts[i].offsetLeft;                     // absolute offset in track
  const sx = target.width / base.width;              // scaleX to fit this segment
  if (!animate) ind.style.transition = 'none';       // no slide on first paint
  ind.style.width = base.width + 'px';
  ind.style.setProperty('--x', x + 'px');
  ind.style.setProperty('--sx', sx);
  if (!animate) requestAnimationFrame(() => ind.style.transition = '');
}
```

```css
.seg-ind {
  transform-origin: left center;
  transform: translateX(var(--x)) scaleX(var(--sx));
  transition: transform var(--dur) var(--ease);
}
```

Because `transform-origin` is the left edge, `scaleX` grows the pill to the
right from the segment's left boundary, keeping it aligned as widths change.

## Key parameters

| Parameter | What it controls | Typical value |
| --- | --- | --- |
| `duration` | How long the pill takes to travel | 250–400ms |
| `easing` | The travel curve | spring `cubic-bezier(.5,1.6,.4,1)` or `cubic-bezier(.4,0,.2,1)` |
| `translateX` | Horizontal position of the pill | measured `offsetLeft` of target |
| `scaleX` | Width match for uneven segments | `targetWidth / referenceWidth` |
| indicator style | Filled pill vs. thin underline | `filled` / `underline` |
| segment count | Number of exclusive options | 2–5 |

A spring curve with slight overshoot (control-point y > 1) gives the pill a
sense of momentum; a standard ease reads as more restrained. Keep the label
color transition on the same `duration` so the two never desync.

## Production notes

- **Semantics and keyboard.** Expose the group as `role="radiogroup"` with
  `role="radio"` children (or a `tablist` if each option swaps a panel). Use a
  roving `tabindex` — only the selected option is tab-stoppable — and handle
  Arrow keys, Home, and End to move selection. This demo does exactly that.
- **Recompute geometry.** Widths depend on rendered text, so the pill can be
  misplaced before a web font swaps in. Re-run the measure step on `resize`
  and inside `document.fonts.ready`, and whenever you rebuild the segments.
- **RTL.** In right-to-left layouts `offsetLeft` still measures from the left,
  but reading order flips; verify the arrow-key direction and pill origin, and
  test with `dir="rtl"` rather than assuming.
- **Reduced motion.** Under `prefers-reduced-motion: reduce` the transition is
  removed so selection snaps instantly — the state change is still clear
  without travel.
- **Libraries.** Frameworks wrap this in components (Radix / React Aria
  `ToggleGroup`, Material's segmented button, SwiftUI `Picker(.segmented)`),
  and GSAP or Framer Motion can drive the `transform` with a spring; the
  underlying measure-then-translate mechanic is identical.

## See also

- [Toggle / Switch Slide](../toggle-switch/)
- [Tab Bar / Underline](../hover-state/)
- [Accordion Open/Close](../accordion/)
