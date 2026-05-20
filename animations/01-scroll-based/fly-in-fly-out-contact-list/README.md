# Fly-in Fly-out Contact List

[Live demo](index.html)

## What it is

Each row in a scrollable contact list animates through three viewport zones:
an entry zone at the bottom (row fades and translates in from below), an
active zone in the middle (row is fully visible and stable), and an exit zone
at the top (row fades and translates out upward). The effect is continuous and
bidirectional — scrubbed to scroll position rather than triggered once. A row
that scrolls back into the active zone after exiting reappears smoothly.

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
  scale   = lerp(SCALE_MIN, 1, t);
} else if (pos > 1 - Z) { // entry zone (bottom)
  const t = (1 - pos) / Z; // 0 = fully below, 1 = entering active
  opacity = lerp(0, 1, t);
  ty      = lerp(DIST, 0, t);
  scale   = lerp(SCALE_MIN, 1, t);
} // else: active zone — opacity=1, ty=0, scale=1
```

An `IntersectionObserver` with `rootMargin: '25% 0px'` maintains a Set of
rows currently in or near the viewport. The rAF callback iterates only that
Set — never all 15 rows unconditionally.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| `DIST` | 40px | Translation distance at zone edges |
| `SCALE_MIN` | 0.94 | Scale at zone edges (1 = no shrink) |
| `Z` | 0.25 | Fraction of viewport height for each zone |
| Effect mode | all combined | opacity + translateY + scale together |

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

- [Cover Card to Fixed Header](../cover-card-to-fixed-header/) — the same
  single-progress piecewise lerp model applied to a morphing header.
- [Parallax Scrolling](../parallax-scrolling/) — scroll-position driving
  layer transforms; the architectural pattern this builds on.
