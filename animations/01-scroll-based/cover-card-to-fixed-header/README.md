# Cover Card to Fixed Header

[Live demo](index.html)

## What it is

A large hero cover card that smoothly morphs into a compact fixed header as
the user scrolls. Height, font size, background opacity, blur, and element
visibility are all tied to a single progress value `p ∈ [0, 1]` derived from
scroll position. At `p = 0` the full cover is visible; at `p = 1` a minimal
header is pinned to the top. Every value between those extremes is a
deliberate, intentional intermediate state — not an accidental artifact of
a CSS transition.

## When to use it

- Article pages where a rich hero section should give way to a persistent
  navigation header without jarring the reader
- Product detail pages (e.g. Apple, Stripe) where the hero image collapses
  into a sticky toolbar
- Editorial sites and blogs that need to retain identity (title, author)
  without the full cover consuming scroll real estate

## How it works

One scroll listener reads `stage.scrollTop` and computes:

```js
const p = Math.min(1, Math.max(0, scrollTop / RANGE));
const e = easeOutCubic(p);
```

Eight properties are then interpolated against `e` in a single
`requestAnimationFrame` callback:

```js
cover.style.height        = lerp(530, 56, e) + 'px';
coverTitle.style.fontSize = lerp(26, 13, e)  + 'px';
coverBg.style.opacity     = lerp(1, 0.12, e);
coverBg.style.filter      = `blur(${lerp(0, 6, e)}px)`;
coverMeta.style.opacity   = 1 - clamp(e * 3, 0, 1);
coverSub.style.opacity    = 1 - clamp(e * 3, 0, 1);
coverAuthor.style.opacity = 1 - clamp(e * 2, 0, 1);
headerChip.style.opacity  = clamp((e - 0.5) * 2, 0, 1);
```

A `flex: 1` spacer inside the cover pushes content to the bottom at full
height and compresses as height shrinks, making the title rise to header
position without any JS transform on the title element itself.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| `RANGE` | 320px | Scroll distance over which the morph completes |
| Cover full height | 530px (desktop) / 480px (mobile) | Starting cover height |
| Cover min height | 56px (desktop) / 64px (mobile) | Collapsed header height |
| Easing | easeOutCubic | Brisk start, settled finish |

## Production notes

- **Scrubbing beats binary toggles.** A hard class-swap at a scroll threshold
  creates an awkward snap — if the user pauses exactly at the threshold,
  the header flickers. Scrubbing to a 0→1 value means every scroll position
  has a well-defined, intentional appearance. Medium, Substack, and the NYT
  app all use variants of this pattern.
- **The height animation triggers layout.** Animating `height` forces the
  browser to recalculate layout on every frame. The production alternative:
  keep the outer container at a fixed height, set `overflow: hidden`, and
  animate `clip-path` (layout-free) or `transform: scaleY()` on the inner
  element with `transform-origin: top`. This demo prioritises readability
  over raw performance.
- **Real-world examples.** Medium's article header, Apple's product detail
  pages, and Stripe's blog all implement variants of this morph. The
  distinguishing quality is always whether intermediate scroll states look
  intentional or accidental.
- **Library equivalents.** GSAP ScrollTrigger with `scrub: true` and a
  timeline that sets each property handles this pattern with easing per
  property. Framer Motion's `useScroll` + `useTransform` is the React
  equivalent. Both let you define keyframes along a scroll timeline rather
  than writing the interpolation arithmetic by hand.
- **Accessibility.** Under `prefers-reduced-motion: reduce`, skip the scrubbed
  morph entirely — snap instantly to the collapsed header when scroll exceeds
  `RANGE / 2`. Opposing or complex motion can be disorienting for users with
  vestibular disorders; this pattern specifically triggers that concern because
  properties change continuously during scroll.

## See also

- [Parallax Scrolling](../parallax-scrolling/) — single progress value driving
  speed-ratio depth; the same interpolation model applied to layer motion.
- [Reverse-Scrolling Columns](../reverse-scrolling-columns/) — another
  scroll-progress pattern, this time driving directional column motion.
