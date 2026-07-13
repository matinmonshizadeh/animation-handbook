# Text on a Path

## What it is
Text on a path lets a string of type follow an arbitrary curve instead of a straight baseline. In SVG this is done with `<textPath>`, which binds a `<text>` element to a `<path>`. Animating the `startOffset` attribute slides the string along that path, so the letters appear to travel down the curve like a ticker bent into a shape.

## When to use it
- Circular badges, seals, and stamps where text wraps a ring
- Decorative headlines that arc, wave, or spiral across a hero
- Diagrams and infographics where a label should hug a route or connector
- Looping marquees that follow a shape rather than a flat line

## How it works
The path is declared once inside `<defs>` with an `id`. A `<textPath href="#curve">` references it, and the glyphs lay themselves along the curve automatically. Each animation frame advances `startOffset` by a small percentage, wrapping at 100%:

```html
<defs><path id="curve" d="M20,180 C120,60 240,300 340,180 S560,60 620,180"/></defs>
<text class="flow-text">
  <textPath href="#curve" id="tp" startOffset="0%">FOLLOW THE CURVE · </textPath>
</text>
```

```js
function loop(){
  offset=(offset+speed)%100;
  tp.setAttribute('startOffset',offset+'%');
  requestAnimationFrame(loop);
}
```

Switching path shape swaps the `d` attribute on the same `<path>` — the text re-flows onto the new geometry with no other changes. The dashed guide is a `<use href="#curve">` of the identical path, toggled by opacity.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | 0.4%/frame | How far `startOffset` advances each frame; higher = faster scroll |
| Path shape | wave | The `d` geometry: wave (cubic), arc (quadratic), or circle (elliptical arc) |
| Show guide | on | Renders the underlying path as a dashed stroke for reference |
| Text | user string | Append a separator (` · `) so the loop reads continuously when it wraps |

## Production notes
- **Accessibility**: SVG text stays real, selectable text and is read in DOM order — add `aria-label` on the `<svg>` describing the phrase, since the animated offset can split a word visually at the wrap point.
- **Legibility on tight curves**: sharp turns crowd or fan the glyphs. Reduce `letter-spacing`, shorten the string, or ease the curvature. `textPath` has no automatic kerning correction around corners.
- **Reduced motion**: gate the `requestAnimationFrame` loop behind a `prefers-reduced-motion` check and render the text at a fixed `startOffset` so it stays legible without scrolling.
- **Library equivalents**: GSAP's MotionPathPlugin animates elements (not just text) along a path with autorotation; D3 exposes `path` generators handy for data-driven curves. For circular type specifically, CSS `writing-mode` tricks exist but `<textPath>` remains the most flexible.

## See also
- [Marquee / Ticker](../marquee-ticker/) — the straight-line cousin of path-scrolled text
- [Kinetic Typography](../kinetic-typography/) — motion-driven type layouts
- [Text Morphing](../text-morphing/) — animating between letterforms rather than along a path
