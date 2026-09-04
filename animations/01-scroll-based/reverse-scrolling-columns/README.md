# Reverse-Scrolling Columns

[Live demo](index.html)

## What it is

Reverse-scrolling columns place a normally-scrolling center column between
two flanking columns that scroll in the opposite direction. All three columns
loop infinitely using a two-set DOM structure and modulo offset math. The
opposing motion amplifies perceived depth: the brain interprets counter-motion
as evidence of different distances — the same cue used in parallax, but made
explicit and exaggerated.

## When to use it

- Hero layouts where bold visual contrast sets the editorial tone
- Portfolio or agency showcases that need motion without heavy assets
- Scroll-driven features where the page scroll remains native and a contained stage drives the effect
- Anywhere opposing motion is used intentionally to create visual tension

## How it works

Each column contains two identical card sets stacked vertically. A single
`scroll` event listener reads `stage.scrollTop` and feeds it into a
`requestAnimationFrame` callback that applies `translate3d` to each column:

```js
// Center column — travels up, the direction a normal scroll moves content
const cOff = -(scrollTop % singleSetH);
centerInner.style.transform = `translate3d(0, ${cOff}px, 0)`;

// Side columns — negative mult reverses direction; magnitude sets speed
// (margin-top pre-offsets them by -singleSetH so there is content above)
const sideOff = (scrollTop * Math.abs(mult)) % singleSetH;
const sideY   = mult >= 0 ? -sideOff : sideOff; // negative = up, positive = down
sideInner.style.transform = `translate3d(0, ${sideY}px, 0)`;
```

`singleSetH` is the height of one card set (12 cards + gaps), measured from
the DOM after card generation. Measure it again on `document.fonts.ready` —
a webfont that swaps in after the first measurement changes card height and
leaves the loop period a few pixels short, which shows up as a jump at every
wrap. The modulo keeps the offset in the range `[0, singleSetH)`, producing a
seamless wrap when the second set aligns exactly with where the first started.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| `mult` | −1.0 | Side-column direction and speed; negative = reverse |
| `singleSetH` | measured | Height of one card set; determines loop period |
| Card count | 12 | More cards = longer loop period |
| Scene height | 2000px | Total scroll travel (max scroll = scene − viewport height) |

## Production notes

- **Infinite loop requires modulo math.** Without wrapping, columns run out
  of content after one traversal. The two-set structure (one visible, one
  waiting) ensures there is always content at either end.
- **Vestibular risk at high speed.** Opposing motion is a known vestibular
  trigger. In production, keep `|mult|` between 0.3 and 1.0; avoid values
  above 1.5. Always respect `prefers-reduced-motion` by setting `mult = 0`
  (side columns freeze) — opposing motion is addressed in WCAG 2.1
  SC 2.3.3 (Animation from Interactions, Level AAA) as a vestibular hazard.
- **Library equivalents.** GSAP ScrollTrigger can drive column transforms
  with `scrub: true` and custom callbacks per column. Locomotive Scroll
  exposes per-element `data-scroll-speed` attributes that accept negative
  values for reverse motion. Lenis + a scroll subscriber achieves the same.
- **Performance.** `translate3d` promotes each column to its own compositor
  layer. Pair with `will-change: transform` declared in CSS before the first
  paint. Never animate `top`, `margin-top`, or `height` — those trigger layout.

## See also

- [Parallax Scrolling](../parallax-scrolling/) — speed-ratio depth without
  opposing direction; the foundation this technique builds on.
- [Parallax Depth-of-Field](../parallax-depth-of-field/) — depth via blur
  rather than directional contrast.
