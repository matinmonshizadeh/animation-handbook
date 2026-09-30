# Segmented Control

## What it is

A segmented control is a row of options where exactly one is chosen, marked by a highlight behind it. When you choose another option, the highlight slides over to it and stretches to its width while the labels change color, so the change reads as one thing moving. It is the switch behind view pickers such as Day, Week and Month.

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
  const base   = opts[0].getBoundingClientRect();    // reference width
  const x  = target.left - base.left + opts[0].offsetLeft;   // offset inside the track
  const sx = target.width / base.width;              // scaleX to fit this segment
  if (!animate) ind.style.transition = 'none';       // no slide on first paint
  ind.style.width = base.width + 'px';
  ind.style.setProperty('--x', x + 'px');
  ind.style.setProperty('--sx', sx);
  if (!animate) { void ind.offsetWidth; ind.style.transition = ''; }  // flush the jump, then allow sliding again
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
The choice is marked (`aria-checked`) before the option is measured, because
the chosen label is set a little heavier, which makes it a little wider.

A curve that runs a little past its end (Springy) gives the highlight a sense of momentum; Smooth reads as more restrained. The labels' color change uses the same duration as the slide, so the two never drift apart.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | Normal | How long the highlight takes to slide: slow is 550ms, normal 340ms and fast 200ms |
| Feel | Springy | Springy runs a little past the option, then settles; Smooth slows to a stop; Even keeps one steady speed |
| Highlight | Pill | A filled pill behind the chosen option, or a thin line under it |
| Number of options | Four | Two to five options; more, or long labels, do not fit on one line |

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

- [Toggle / Switch Slide](../toggle-switch/) — a switch that slides between two states
- [Hover State Animation](../hover-state/) — items that react when the pointer is on them
- [Accordion Open/Close](../accordion/) — sections that open and close in place
