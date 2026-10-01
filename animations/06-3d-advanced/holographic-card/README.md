# Holographic Card

## What it is
A holographic card copies the rainbow foil of a rare trading card. As the card tilts toward the pointer, a sheet of rainbow colors slides across it and lights up the picture beneath, the way real foil catches the light, and a spot of glare follows the pointer. It is a stack of flat layers moved by the browser's own 3D transforms, with no image files and no 3D library.

## When to use it
- Trading card games and collectible pages, where the foil marks a rare card
- Membership, loyalty and gift cards that should feel premium
- Badges and rewards the visitor has earned, shown off in a profile
- Product launch, ticket or pass cards that invite a closer look

## How it works
The card is four layers stacked in one box, each clipped to the card's rounded corners: the picture, the foil, the glare and the text panels. The demo draws its picture as an inline SVG; on a real site it is an image.

```html
<div class="card">
  <div class="ly art">…the picture…</div>
  <div class="ly foil"><div class="sheen"></div></div>
  <div class="ly gl"><div class="spot"></div></div>
  <div class="ly txt">…the text panels…</div>
</div>
```

The foil is a sheet of rainbow streaks with clear gaps, twice the card's size so it has room to slide. `mix-blend-mode: color-dodge` makes it brighten whatever lies under each streak, so dark parts of the picture glint only a little and light parts flare into color, which is what makes it read as foil rather than a colored film. The glare is a white spot the size of the card with a bright middle; `mix-blend-mode: plus-lighter` adds its light to the picture, so it reads as a highlight under the pointer rather than a haze. The text panels come next and are solid, so neither the foil nor the full glare ever sits under the text. A faint copy of the glare, the gloss, lies over the panels at a quarter of the glare's strength at most, which lights them too and keeps their dimmest text above 5:1:

```css
.stage { perspective: 1000px; }                     /* depth for the tilt, on the parent */
.card  { position: relative; aspect-ratio: 5 / 7; border-radius: 12px; will-change: transform; }
.ly    { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; }
.foil  { mix-blend-mode: color-dodge; }
.sheen { position: absolute; inset: -50%; will-change: transform;
  background: repeating-linear-gradient(118deg, transparent 0%, #f0648c 3%, #f4c35e 6%, #71e2a2 9%,
    #5ac2f4 12%, #a888f6 15%, transparent 18%, transparent 21%); }
.gl    { mix-blend-mode: plus-lighter; }
.spot  { position: absolute; inset: 0; will-change: transform; opacity: 0;   /* the glare, and the gloss in the text layer */
  background: radial-gradient(circle closest-side, #fff, rgba(255,255,255,.55) 22%,
    rgba(255,255,255,.18) 58%, transparent); }
.np, .ip { background: #110e27; }                   /* the solid text panels */
```

Each pointer move turns into three numbers: `x` and `y`, where the pointer is across the card from -0.5 to 0.5, and `h`, 1 while the pointer is on the card and 0 when it leaves. One function draws them, and it changes only transforms and opacities, so the browser moves layers it has already painted instead of painting anything again:

```js
// T: the lean at the card's edges in degrees (How far it tilts). G: the glare's strength (Glare).
// f0, f1: the foil's strength at rest and what lighting it adds.
card.style.transform  = `rotateX(${-2 * T * y}deg) rotateY(${2 * T * x}deg) scale(${1 + 0.04 * h})`;
sheen.style.transform = `translate(${-40 * x}%, ${-40 * y}%)`;   // the foil slides against the tilt
foil.style.opacity    = f0 + f1 * h;                              // and brightens while the card is lit
spot.style.transform  = gloss.style.transform = `translate(${100 * x}%, ${100 * y}%)`;  // the glare's middle under the pointer
spot.style.opacity    = G * h;
gloss.style.opacity   = 0.25 * G * h;                             // a quarter at most, over the text panels
```

The shown numbers glide toward the pointer's instead of jumping to them. Each frame closes 14% of the gap for every 60th of a second that passed, so the glide takes the same time on a 60, 120 or 30 Hz screen, and the loop stops once the numbers arrive:

```js
const k = 1 - Math.pow(1 - 0.14, dt / (1000 / 60));   // dt: the milliseconds since the last frame
sx += (ax - sx) * k;  sy += (ay - sy) * k;  sh += (ah - sh) * k;
```

The pointer is measured against the card's own place, its untransformed box, not the tilted outline the visitor sees, which moves under a resting pointer and would make the card twitch at its edges. The foil patterns are masks on the foil layer: the same sliding rainbow, seen only through scattered dots (six dot tilings of different sizes, so no grid shows) or through fine diagonal lines. The masks stay put while the sheet slides beneath them, so each dot or line flares as a streak passes under it:

```css
.card[data-foil=glitter] .foil { mask: radial-gradient(circle at 30% 40%, #000 0 1px, transparent 1.7px) 0 0 / 17px 23px,
                                       radial-gradient(circle at 75% 15%, #000 0 1px, transparent 1.7px) 0 0 / 23px 19px /* … */; }
.card[data-foil=lines]   .foil { mask: repeating-linear-gradient(60deg, #000 0 1.4px, transparent 1.4px 4.2px); }
```

**Shows the layers** turns the card to one side, gives it `transform-style: preserve-3d` and brings each layer forward by its place in the stack, 30px apart: while a number `sp` glides from 0 to 1, the script writes `translateZ(${30 * i * sp}px)` on layer `i`. It writes those only while the layers move apart or together; a custom property on the card could carry `sp` instead, but the card gets a new style every frame and would pass it down to every layer each time. The foil and the glare are drawn with no blend mode there, so each sheet shows as it is; the glare stays lit at rest, up and to the right where its sheet reaches past the picture, and the gloss is left out. Each layer clips itself, which is why the card can hold them in 3D: `overflow: hidden` on the card itself would flatten them back into one plane.

**Show me** moves the same numbers along a figure of eight for 3.2 seconds (`x = 0.42 sin 2πe`, `y = 0.34 sin 4πe`, with `e` the eased progress), lit as it goes, and ends with the card flat. A press, key or wheel turn in the stage, or the visitor's own pointer moving over it, stops the run, and the card follows the visitor from where it was.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Foil pattern | Smooth | Smooth shows the rainbow as soft bands; Glitter lets it through scattered dots and Lines through fine diagonal lines, like the sparkle and etched foils of real cards |
| How far it tilts | Medium | How far the card leans at its edges: gentle is 6°, medium 12° and strong 20°; much more and the text on the card gets hard to read mid-tilt |
| Glare | Soft | The spot of light under the pointer: off, soft (a little over half strength) or bright; a copy at a quarter of that strength lights the text panels |
| Shows the layers | off | Turns the card to one side and spreads its four layers apart, so the picture, the foil, the glare and the text panels show one above the other |

## Production notes
- **Performance**: only transforms and opacities change, so following the pointer does not repaint the card from frame to frame. Many holographic card demos move their gradients with `background-position` driven by CSS variables, which repaints the whole card, every layer, on every pointer move: it shows on phones and adds up across a grid. A blend mode on a moving layer still costs the graphics chip a little every frame, so animate only the card under the pointer and leave the rest of a grid flat.
- **Blending stays on the card**: `mix-blend-mode` mixes a layer with everything painted under it in its stacking context. The card's transform makes it a stacking context of its own, so the foil mixes only with the card's picture; a card that has no transform at rest needs `isolation: isolate`, or the foil also lights up the page behind it.
- **Text contrast**: keep text on solid panels above the foil and the glare. Color dodge lightens a dark background a long way under a bright streak, and an added glare whitens it, so text laid straight on the foil can lose its contrast at some angles. A light over the panels themselves has to stay faint: white at a quarter strength over the demo's dimmest text (#bdb7e6 on #110e27) still leaves 5.4:1.
- **Touch**: Pointer Events cover mouse, pen and touch. `touch-action: none` on the card lets a finger drag tilt it instead of scrolling the page; under reduced motion the demo sets it back to `auto`, since the card no longer tilts. A finger that slides off the card keeps it leaning toward that edge until it lifts.
- **Masks and blending**: Chrome and Edge before 120 and Safari before 15.4 need the `-webkit-mask` prefix; the demo writes both. `plus-lighter` is the newest of these blend modes (Chrome and Firefox added it in 2022); a browser without it draws the glare with plain blending, fainter but in the same place.
- **Libraries**: VanillaTilt.js does the tilt and a glare (`glare: true`, `"max-glare"`), and Atropos adds layers at different depths; both leave the foil to your CSS. In React, Framer Motion's `useMotionValue` and `useSpring` drive the same transforms, and GSAP's `quickTo` gives the same eased follow.
- **Reduced motion**: the card stays flat and nothing slides. Pointing at it, or Show me, fades the foil and the glare brighter where they are, and they fade back afterwards.

## See also
- [Parallax 3D Tilt](../parallax-3d-tilt/) — the same tilt toward the pointer, with a plain light instead of foil
- [3D Flip Card](../flip-card-3d/) — a card turns over in 3D to show its back
- [Spotlight Hover Glow](../../04-micro-interactions/spotlight-hover/) — a soft glow follows the pointer across a grid of cards
- [Animated Gradient Border](../../04-micro-interactions/gradient-border/) — a band of colors runs around the edge of a card
