# Text on a Path

## What it is
Text on a path lets a line of type follow a curve instead of a straight line. The curve is defined once and the text is attached to it, so every letter sits on the line. Moving the point where the text starts along the curve makes the letters travel along it, like a ticker bent into a shape.

## When to use it
- Circular badges, seals, and stamps where text wraps a ring
- Decorative headlines that arc, wave, or spiral across a hero
- Diagrams and infographics where a label should hug a route or connector
- Looping marquees that follow a shape rather than a flat line

## How it works
The path is declared once inside `<defs>` with an `id`. A `<textPath href="#curve">` references it, and the glyphs lay themselves along the curve automatically:

```html
<defs><path id="curve" d="M20,180 C120,60 240,300 340,180 S560,60 620,180"/></defs>
<text class="flow-text">
  <textPath href="#curve" id="tp" startOffset="0%">FOLLOW THE CURVE · </textPath>
</text>
```

Glyphs that run past the end of the path are not drawn, so a single copy of the phrase would leave the end of the curve empty as it slides along. Instead the phrase is repeated until it covers the whole path plus one extra copy. The length of one copy, as a percentage of the path, is measured as two copies minus one (with `getSubStringLength()`), so spaces that collapse at the ends cancel out. The start point then only ever moves within one copy's length, from one copy before the path up to the path's start. When it wraps, an identical copy is already in place, so the jump cannot be seen:

```js
// unit: the length of one copy of the phrase, as a percentage of the path
tp.textContent = phrase.repeat(Math.ceil(100 / unit) + 1);    // the whole path plus one extra copy

function loop(now) {
  const dt = last === null ? 0 : Math.min(now - last, 50);    // milliseconds since the last frame
  last = now;
  offset = (offset + speed * dt / (1000 / 60)) % unit;        // speed: % of the path per 1/60 s; wraps after one copy
  tp.setAttribute('startOffset', (offset - unit) + '%');      // always between -unit and 0
  requestAnimationFrame(loop);
}
```

The movement follows the clock, not the frame count, so a 120 Hz screen is no faster than a 60 Hz one. The first frame after a start only records the time, and a long gap between frames counts for at most 50 ms, so starting again after a pause does not leap.

Switching path shape swaps the `d` attribute on the same `<path>`, and typing a new phrase replaces the text. Either way, one copy is now a different share of the curve, so the phrase is measured and repeated again, and the start point is written straight away, kept within the new copy length. That keeps the whole curve covered even while the animation is paused. The dashed guide is a `<use href="#curve">` of the identical path, toggled by opacity.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Path shape | Wave | The curve the text follows: a wave, an arc or a full circle |
| Speed | Normal | How far the text moves every sixtieth of a second: slow is 0.25%, normal 0.4% and fast 0.65% of the path (15%, 24% and 39% a second) |
| Shows the path | on | Draws the curve as a dashed line under the text |
| Your text | FOLLOW THE CURVE · | The phrase that travels; end it with a separator so the repeats read on |

## Production notes
- **Accessibility**: SVG text stays real, selectable text and is read in DOM order — add `aria-label` on the `<svg>` describing the phrase, since the animated offset can split a word visually at the wrap point.
- **Legibility on tight curves**: sharp turns crowd or fan the glyphs. Reduce `letter-spacing`, shorten the string, or ease the curvature. `textPath` has no automatic kerning correction around corners.
- **Reduced motion**: gate the `requestAnimationFrame` loop behind a `prefers-reduced-motion` check and render the text at a fixed `startOffset` so it stays legible without scrolling.
- **Library equivalents**: GSAP's MotionPathPlugin animates elements (not just text) along a path with autorotation; D3 exposes `path` generators handy for data-driven curves. For circular type specifically, CSS `writing-mode` tricks exist but `<textPath>` remains the most flexible.

## See also
- [Marquee / Ticker](../marquee-ticker/) — text scrolls along a straight line
- [Kinetic Typography](../kinetic-typography/) — words that each move in their own way
- [Text Morphing](../text-morphing/) — one word changes into the next, letter by letter
