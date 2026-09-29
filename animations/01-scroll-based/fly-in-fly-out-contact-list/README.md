# Fly-in Fly-out Contact List

[Live demo](index.html)

## What it is

A fly-in, fly-out list animates its rows as they pass near the edges of the
scrolling area. A row coming in at the bottom fades in, slides up and grows to
full size; a row leaving at the top does the reverse; rows in the middle stay
still. Because it follows the scroll position rather than playing once,
scrolling back brings rows back the same way.

## When to use it

- Contact lists, activity feeds, and inbox views where long lists need
  visual structure as the user scans
- Any vertically scrollable list where spatial cues help orient the user
  within the content
- Messaging app chat lists, notification trays, search results

## How it works

For each row currently near the viewport (tracked by `IntersectionObserver`),
a single `requestAnimationFrame` callback computes:

```js
const pos = (row.offsetTop - stage.scrollTop) / stage.clientHeight;
// pos ≈ 0: row top aligns with viewport top
// pos ≈ 1: row top aligns with viewport bottom
```

Three zones (Z = zone size, default 0.25):

```js
if (pos < Z) {             // exit zone (top)
  const t = pos / Z;       // 0 = fully exited, 1 = entering active
  opacity = lerp(0, 1, t);
  ty      = lerp(-DIST, 0, t);
  scale   = lerp(SCALE, 1, t);
} else if (pos > 1 - Z) { // entry zone (bottom)
  const t = (1 - pos) / Z; // 0 = fully below, 1 = entering active
  opacity = lerp(0, 1, t);
  ty      = lerp(DIST, 0, t);
  scale   = lerp(SCALE, 1, t);
} // else: active zone — opacity=1, ty=0, scale=1
```

An `IntersectionObserver` with `rootMargin: '50% 0px'` maintains a Set of
rows currently in or near the viewport. The rAF callback iterates only that
Set — never all 15 rows unconditionally. The one exception is a jump longer
than the observer's margin (Back to top, a dragged scrollbar): rows it has not
added yet still carry the style they were left with, so every row is styled once.
The first frame counts as such a jump, which gives the first picture its effect.

The list ends with 70px of padding, as much as the farthest a row can slide.
Without it, a row still arriving at the bottom would sit below the list and
stretch the scroll length, then give it back as it settles, and a script that
reads the length once (as the demo's Play button does) would aim at an end that
is not there.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Effect | All three | Which changes a row makes in the bands: all three (moving, fading and shrinking) together read as physical motion; moving only or fading only feels flatter |
| Edge zone size | Medium | How tall each band is: small is 15% of the box, medium 25% and large 35% |
| How far rows move | Medium | How far a row slides at the very edge: short is 20px, medium 40px and far 70px |
| How much rows shrink | Medium | The size of a row at the very edge: a little is 97%, medium 94% and a lot 88% |
| Shows the zones | off | Tints the two bands, red for leaving and green for arriving |

## Production notes

- **Continuous vs. one-time reveal.** A common pattern is to trigger a reveal
  animation once per element when it first enters the viewport and never
  reverse it. This demo is bidirectional — scrolling back up restores the
  fly-in state. The distinction matters for context: one-time reveals work
  for reading flows; continuous effects work for navigational lists where
  the user scans up and down repeatedly.
- **Performance pattern.** `IntersectionObserver` filters the work set to
  only rows near the viewport. The rAF callback then applies
  `transform + opacity` — compositor-only properties that never trigger
  layout or paint. Together these keep the per-frame cost proportional to
  the number of visible rows, not the total list length.
- **Real-world examples.** The iOS Contacts app, Telegram's chat list, and
  Notion's sidebar all use variants of this entering/exiting fade-translate.
  The scale component is what makes it feel physical rather than flat.
- **Library equivalents.** GSAP ScrollTrigger with `scrub: true` and a
  timeline per row achieves the same piecewise control. Framer Motion's
  `useScroll` with `useTransform` per item is the React equivalent; it
  handles the `IntersectionObserver` bookkeeping automatically.
- **Accessibility.** The combination of translate + scale is a known
  vestibular trigger. Under `prefers-reduced-motion: reduce`, disable
  translate and scale entirely; use only a subtle opacity fade
  (0.3 → 1) at the zone edges so the list remains spatially stable.

## See also

- [Reveal on Scroll](../reveal-on-scroll/) — cards appear once as they cross a line
- [Stagger Reveal](../stagger-reveal/) — items in a group appear one after another
- [Cover Card to Fixed Header](../cover-card-to-fixed-header/) — a tall cover shrinks into a slim header
