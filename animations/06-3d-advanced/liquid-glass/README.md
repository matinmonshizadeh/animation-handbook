# Liquid Glass

## What it is
Liquid glass makes a panel look like a slab of thick, clear glass lying on the page. Near its rounded edges the picture behind it is bent and magnified, the way the curved rim of a lens bends light, while the middle stays almost clear, and a thin highlight runs along the rim. In Chromium browsers the bend is a displacement filter applied to whatever is behind the panel; other browsers show the same panel as frosted glass.

## When to use it
- Floating menus and tab bars that sit over photos or scrolling content
- Media controls and small cards laid over a hero image or a video
- A lens you can drag over a map, a chart or a product photo
- One tactile, eye-catching control on a product page or a portfolio

## How it works
**The filter.** An SVG filter moves every pixel by an amount it reads from a second picture, the displacement map: the map's red channel is the sideways shift and its green channel the shift up or down, with 128 meaning no shift. Referenced from `backdrop-filter`, the filter bends what lies behind the panel instead of the panel's own content:

```html
<svg width="0" height="0" style="position:absolute">
  <filter id="lg-filter" filterUnits="userSpaceOnUse" x="0" y="0" width="280" height="174" color-interpolation-filters="sRGB">
    <feImage href="data:image/png;base64,…" x="0" y="0" width="280" height="174" preserveAspectRatio="none" result="map"/>
    <feDisplacementMap in="SourceGraphic" in2="map" scale="59" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
</svg>
```

```css
.lg-refract .lg-glass { backdrop-filter: url(#lg-filter) blur(var(--lg-blur)) saturate(1.3); }
```

The filter region and the map are the panel's own size in pixels, so the map lines up with the panel, and the script sets both whenever the panel changes size. `color-interpolation-filters="sRGB"` keeps 128 in the middle: in the default linear color space the filter reads that gray as about 0.22 and shifts everything.

**The map.** The demo draws the map on a canvas, one pixel for each CSS pixel of the panel. For every pixel it finds `e`, the distance in from the rounded edge, and `(nx, ny)`, the direction out of it. Inside the rim, which is 70% of the panel's half height, the pixel is told to read the picture from further in, most at the very edge, so the rim magnifies what is behind it; a small pull toward the middle everywhere magnifies the whole panel a little. Outside the rounded corners the map stays at 128:

```js
const m = e < 0 ? 0 : (1 - Math.min(1, e / B)) ** 2, z = e < 0 ? 0 : MAG;   // B: the rim's width, MAG = 0.15
d[k]     = 128 - 127 * (nx * m + z * X / hw) / (1 + MAG);                  // red: sideways
d[k + 1] = 128 - 127 * (ny * m + z * Y / hh) / (1 + MAG);                  // green: up and down
```

The filter shifts a pixel by up to half its `scale`, so How much it bends only changes `scale` (twice the bend times the rim's width, times 1.15 for the pull toward the middle); the map is drawn again only when the panel changes size or shape.

**Which browsers bend.** Chromium-based browsers, such as Chrome, Edge and Opera, draw an SVG filter in `backdrop-filter` (the demo was checked in Chrome and Edge). Safari and Firefox do not draw it, and a feature test cannot tell: `CSS.supports()` checks only that the rule is valid, not that the bend appears. The demo gives the bend to browsers that list Chromium among their brands in `navigator.userAgentData`, which only Chromium-based browsers have, and shows everyone else frosted glass: a blur of the backdrop with the same tint, rim and shadow, and a glow inside the rim that grows with How much it bends. There the help line above the stage adds "Frosted here: the bend shows in Chrome or Edge on a computer or Android." On iPhone and iPad every browser, Chrome and Edge too, is built on Safari's engine and shows the frosted glass. `navigator.userAgentData` exists only on secure pages (https, or localhost), so Chrome opening the page over plain http at a network address gets the frosted glass too.

```js
const REFRACT = !!(navigator.userAgentData && navigator.userAgentData.brands.some(b => b.brand === 'Chromium'))
  && CSS.supports('backdrop-filter', 'url(#lg-filter)');
stage.classList.toggle('lg-refract', REFRACT);
```

**The liquid stretch.** The panel moves by `transform` only. Its speed, measured from one drawn frame to the next and smoothed over a few frames, sets how far it should stretch along the motion: about 6% for every width of the panel it covers in a second, at most 12%. A spring that takes fixed steps of 1/60 s follows that target, so the stretch lags a little, and when the panel stops it overshoots into a short wobble. The stretch keeps the area: longer along the motion, shorter across it, as one matrix around the panel's center:

```js
const ta = e * (ux * ux - uy * uy), tb = e * 2 * ux * uy;          // the target for the motion's direction (ux, uy)
for (acc += dt * f; acc >= FRAME; acc -= FRAME) {                     // f is 1/3 in slow motion
  va += -.08 * (a - ta) - .1 * va; vb += -.08 * (b - tb) - .1 * vb; a += va; b += vb;
}
glass.style.transform = `translate(${x - gw / 2}px, ${y - gh / 2}px) matrix(${1 + a}, ${b}, ${b}, ${1 - a}, 0, 0)`;
```

Show me glides along three legs (to the left end, across to the right end and back where it started), each eased in and out and timed by its length, 3.6 s in all. When the stage changes size (a resize, or a phone turned sideways), the glass, the end of a glide, every point of a run and the place a held Show me returns to keep their shares of the stage; one that was at the rest place goes to the new rest place. The arrow keys move a target a step at a time (8% of the stage's shorter side, three steps with Shift), and the panel glides toward it by a share of the gap per 1/60 s, the same on any screen.

**Reduced motion.** The panel still follows the pointer or finger while it is dragged, but it never stretches, wobbles or glides: the arrow keys, a tap and Reset move it at once, and Show me puts it at the right end for 1.2 s and back. Every frame under reduced motion sets the stretch and its speed to zero, and turning reduced motion on while the glass moves stops a run where it is and ends a glide at its target, so nothing is left stretched or moving.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| How much it bends | Medium | The deepest shift, at the very edge, as a share of the rim's width: subtle 25%, medium 42% and strong 60%. Past half the rim folds into a thin mirrored band, as the edge of thick glass does |
| Frost | Clear | How much the backdrop is blurred: clear none, light 1.5 and frosted 4 pixels where the glass bends; 3, 8 and 16 pixels for the frosted glass of other browsers |
| Tint | White | The color the glass adds, mixed in at 9% for white and 20% for the other colors |
| Shape | Card | Card: 1.6 times as wide as tall, corners a third of its height; pill: 2.7 times as wide as tall with round ends; circle: a round lens. The card is 30% of the stage's width, from 150 to 280 pixels |
| Shows the bend map | off | Lays the displacement map over the glass: red is the sideways shift, green the shift up or down, gray none |

## Production notes
- **Chromium only, for now**: `backdrop-filter: url()` bends the backdrop in Chromium; Safari and Firefox need the fallback, so check the page in both. A way that reaches more browsers is to put a copy of the background inside the panel and apply the same filter to that copy with `filter: url()`, which also works on ordinary elements; it only works where you control what is behind the panel.
- **Detection**: `CSS.supports()` only checks the syntax, so pair it with a check for Chromium, as the demo does, and keep the fallback good enough to be the whole effect.
- **Cost**: the browser filters the backdrop again on every frame the panel moves, and the work grows with the panel's area. Keep glass to menus, controls and small cards, not full-screen sheets. The displacement is one texture lookup per pixel; the blur is the expensive part, so keep frost light. The demo's panel is a share of the stage, so it is smaller on phones.
- **Keep the map in step with the panel**: a map drawn for another size moves the bend away from the rim. Redraw it on resize and when the shape changes; changing only `scale` is cheap.
- **Text on glass**: text over refracted, moving color can drop below 4.5:1. Give it a dark see-through layer or a solid backing, as Glassmorphism Animated does.
- **Libraries**: no library is needed for the filter. The drag and the wobble can come from GSAP's Draggable with an elastic ease or Framer Motion's drag with a spring; several open-source React and Vue components wrap the same SVG displacement technique. In native apps, Apple's Liquid Glass (iOS and macOS 26) is a system material.

## See also
- [Glassmorphism Animated](../glassmorphism-animated/) — frosted glass that blurs what is behind it instead of bending it
- [Image Distortion on Hover](../image-distortion-hover/) — a picture bent around the pointer, drawn with a shader
- [Parallax 3D Tilt](../parallax-3d-tilt/) — a card tilts toward the pointer while a light slides over it
