# Cover Card to Fixed Header

[Live demo](index.html)

## What it is

A cover card to fixed header starts a page with a tall cover that holds the
title, a subtitle, the date and the author, and shrinks it into a slim header as
you scroll. Every change, from the cover's height and the title's size to the
fading background and the small author badge, follows one number that runs from
0 to 1 with the scroll, so every moment in between looks planned.

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

The cover's visible height and seven other values are then worked out from `e`
in a single `requestAnimationFrame` callback:

```js
const h = lerp(FULL, 56, e), d = FULL - h;   // FULL: 85% of the box's height
cover.style.transform = `translateY(${-d}px)`;   // the cover keeps its full height and slides up
coverTitle.style.transform = `scale(${lerp(1, 13 / 26, e)})`;
coverBg.style.opacity      = lerp(1, 0.12, e);
coverBg.style.filter       = `blur(${lerp(0, 6, e)}px)`;
coverMeta.style.opacity    = 1 - clamp(e * 3, 0, 1);  // also coverSub
coverAuthor.style.opacity  = 1 - clamp(e * 2, 0, 1);
headerChip.style.opacity   = clamp((e - 0.5) * 2, 0, 1);
coverRule.style.opacity    = e;
```

The title shrinks by `transform: scale()` with `transform-origin: left top`
rather than by writing `font-size` — see the production note below. Nothing is
resized: the cover keeps its full height in the layout and slides up by what it
has shrunk, and the article slides with it; the badge and the backdrop are moved
back into the visible part, and once the cover is shorter than its text the text
starts at the top of the bar.

The scroll does not set `e` itself: it sets a target, and a loop moves the value
that is drawn toward it, so a wheel notch glides instead of jumping. Each frame
covers a share of the distance left that depends on how long the frame took, so
the header settles in the same time on a 30, 60 or 120Hz screen:

```js
const dt = last ? Math.min(now - last, 50) : FRAME;  // FRAME = 1000 / 60; the first frame after a restart counts as 1/60 s
last = now;
current += (target - current) * (1 - Math.pow(1 - EASE, dt / FRAME));  // EASE 0.16 is the share covered in 1/60 s
```

Back to top and Play from the end set the eased value at once.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Shrink distance | Medium | How far you scroll before the cover is fully small: short is 200px, medium 320px and long 440px |
| Snaps at halfway | off | Switches between the tall cover and the slim header at half the distance instead of shrinking with the scroll; reduced motion always does this |

## Production notes

- **Scrubbing beats binary toggles.** A hard class-swap at a scroll threshold
  creates an awkward snap — if the user pauses exactly at the threshold,
  the header flickers. Scrubbing to a 0→1 value means every scroll position
  has a well-defined, intentional appearance. Medium, Substack, and the NYT
  app all use variants of this pattern.
- **Move the cover; never animate its `height`.** Writing `height` lays the page
  out every frame. Keep the cover at full height, slide it and the content below
  with `translateY()`, and squeeze the backdrop with `scaleY()` from its top
  edge — as the demo does.
- **Turn off scroll anchoring.** This is the bug that bites everyone who builds a
  collapsing header. When the cover shrinks, content above the viewport loses
  height, so the browser "helpfully" adjusts `scrollTop` to keep what you are
  looking at in place. That lowers scroll progress, which grows the cover back,
  which moves the scroll again — the collapse stalls partway and the scroll feels
  like it is fighting you. `overflow-anchor: none` on the scroll container ends it.
  Any scroll-driven animation that changes the size of in-flow content needs this.
  This demo moves the cover with transforms, so scrolling never changes its
  height; the rule stays as a guard for when the box is measured again after a
  resize.
- **Ease the finished value, not the raw progress.** A mouse wheel arrives in
  ~100px jumps; with a 320px range that is a third of the animation per notch, and
  easeOutCubic — slope 3 near zero — turns the first notch into 68% of the collapse.
  Easing the *output* bounds how far the header can travel per frame no matter how
  steep the curve is; easing the input lets the curve re-amplify the step.
- **Never write `font-size` or `box-shadow` per frame.** `font-size` re-shapes the
  text run (measured here as the single most expensive write); `box-shadow` repaints.
  Use `transform: scale()` with a `transform-origin`, and fade a static hairline
  element's `opacity` instead.
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

- [Pin Animation](../pin-animation/) — one part holds still while the page scrolls past
- [Stacking Cards](../stacking-cards/) — cards pile into a deck as you scroll
- [Scrub Animation](../scrub-animation/) — scroll plays an animation forward and back
- [Hide-on-Scroll Header](../hide-on-scroll-header/) — the header slides away as you scroll down and back as you scroll up
