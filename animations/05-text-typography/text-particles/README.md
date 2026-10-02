# Text Particles

## What it is
Text particles draw a word as many small dots instead of solid letters. Each dot remembers its place in the word: the pointer pushes the nearby dots away and a spring pulls each one back, so the letters open up wherever you point and close again behind you.

## When to use it
- Hero titles and landing page headlines that reward the first hover
- Page intros and splash screens, where a visitor can play with a name before reading on
- Studio, portfolio and product names on a dark background
- Event and launch pages where one short word carries the page

## How it works
The word is drawn once, in white, on a hidden canvas the size of the stage, in the site font and as large as fits. `getImageData` reads the pixels back, and a dot is kept wherever a letter covers a point of a grid whose rows are offset by half a step, so the dots pack like a honeycomb. The grid is walked in half-step columns, so the dots come out in order from left to right:

```js
g.font = '900 ' + fs + 'px "Schibsted Grotesk"';
g.fillText(text, left, baseline);
const data = g.getImageData(bx, by, bw, bh).data, dy = gap * .866;
for (let c = 0, x = bx + gap / 2; x < bx + bw; c++, x += gap / 2)
  for (let y = by + gap / 2 + (c & 1) * dy; y < by + bh; y += 2 * dy)
    if (data[(((y | 0) - by) * bw + (x | 0) - bx) * 4 + 3] > 128) homes.push(x, y);
```

Every dot then has a home, a position and a speed. One step of 1/60 s pushes the dots inside the pointer's reach `R` away from it, harder the closer they are, while a spring pulls each dot home and it keeps only part of its speed:

```js
const P = 2.4 * K * R;                       // the push grows with the spring and the reach
let ax = (hx - x) * K, ay = (hy - y) * K;    // the spring toward home
const dx = x - p.x, dy = y - p.y, d = Math.hypot(dx, dy);
if (d < R) { const f = (1 - d / R) * P / d; ax += dx * f; ay += dy * f; }
vx = (vx + ax) * D; vy = (vy + ay) * D;      // D: the share of its speed a dot keeps
x += vx; y += vy;
```

Because the push grows with the spring `K`, a pointer that holds still opens a gap of the same size at every return speed, its radius about 0.7 of the reach; `K` and `D` only set how quickly the dots come back. A spring changes with the length of its step, so the frame loop adds up the time that has passed (a third of it in slow motion), takes one fixed step per 60th of a second and draws each dot between its last two steps. The motion is then the same on a 60 Hz and a 120 Hz screen, and slow motion stays smooth. A dot that is out of reach, nearly still and within a third of a pixel of home is put there, and a dot at home and out of reach is skipped, so the work follows the dots that move. Once every dot is home the loop stops, so a word at rest costs nothing. Under a pointer that holds still, the spring alone settles slowly: a dot whose home sits near the pointer can land on the far side of the gap and creep around its rim for many seconds. So half a second after the pointer stops, each dot whose home lies inside the reach, and that is itself within 1.3 times the reach of the pointer, moves to its resting place on the line from the pointer through its home, where push and spring balance (at (2.4R + h) / 3.4 from the pointer, for a home h from it). Each step it slides around the pointer by 12% of the angle left, at most 3 px sideways, and closes 12% of the distance left toward or away from the pointer; measured at the far reach, that came to at most about 6 px a step toward or away and about 7 px in all. A dot that has arrived is skipped until the pointer moves again, and the other dots finish springing home. The gap then holds its shape, every other dot is exactly home and the loop stops, within about 3 seconds of the pointer stopping. Show me, a setting and a new word start that half second over, so the dots still spring back first.

The palette is spread across the word as 32 colors, and each dot takes the color at its home, so it keeps its color as it flies. Each dot is filled as a circle of its own (`beginPath`, `arc`, `fill`): Chrome draws a lone circle with a fast special case on the graphics chip, while one path holding thousands of circles has to be cut into triangles again on every frame. Measured in Chrome, one path per color ran Show me at 43 to 60 frames a second on 2× screens, depending on the run; one circle at a time holds 60. Other browsers take their own fast and slow paths, so measure both ways in the browsers you target. The fast circle has a softer edge, which on a 1× screen fills the gaps between small dots with a haze, so each circle is drawn 0.12 device pixels smaller. A dot that is away from home is drawn brighter and a little larger, in three steps the further it was pushed, so it glows in its own color. On a phone, a dot whose radius is under 1.25 CSS pixels (2.5 pixels of a phone's canvas, which holds two to one; usually the small size, with the phone held upright) is drawn as a square with `fillRect`, which costs even less to paint and still reads as a dot at that size: in Chrome, with the processor slowed four times, circles there ran Show me at about 52 frames a second and squares at 60. Larger dots stay round, as squares that big look like bricks. A new word or dot size samples the word again, and each new dot starts where an old one stands (both taken from left to right), so the dots flow into the new letters. Show me moves a pretend pointer through the word along a wavy path, drawn as a small light with a ring for its reach.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Dot size | Medium | How far apart the dots sit: small is 3 px, medium 4.2 and large 6, scaled with the word between 0.75 and 1.25 times; each dot is narrower than that step, so neighbors never touch. The dots are counted at the small size: past 2,000 on a phone or 6,000 on a larger screen, every size is spread out by the same factor, so the three stay apart |
| How far they scatter | Medium | The pointer's reach: short is 0.28 of the font size, medium 0.42 and far 0.65, counting the font as at least 120 px; a still pointer opens a gap whose radius is about 0.7 of the reach |
| Colors | Sunset | The colors across the word, in 32 steps: Sunset runs from pink to gold, Cool from teal to purple, Rainbow through seven colors and White from white to pale gray; the glow behind the word matches |
| How fast they come back | Normal | The spring and the share of its speed a dot keeps each step: slow is 0.022 and 0.87, normal 0.045 and 0.82, fast 0.09 and 0.76. A dot pushed 100 px away is home in about 1.4, 1 or 0.8 seconds, after swinging about a sixth of the way past it |
| Your text | HELLO | The word, up to 10 letters, drawn as large as fits 86% of the stage's width and 42% of its height; an emptied field goes back to HELLO |

## Production notes
- **Wait for the font**: canvas text is drawn in whatever font is ready, so sampling before a web font loads gives the fallback letters. Call `document.fonts.load()` for the weight and the text first; the demo waits up to 1.5 seconds, and if the font arrives later the dots flow into it.
- **The dot count is the cost**: every frame moves and paints the dots, so keep them to a few thousand, skip the ones at rest and stop the loop when all are home. In Chrome, fill each circle on its own: a path that holds thousands of circles looks like one call but is the slow part, because it is cut into triangles again on every frame. Other browsers draw paths and circles their own way, so measure both in the browsers you target. On phones, tiny squares cost less still, which is why the demo draws its smallest dots as squares there. For tens of thousands of dots, move them on the graphics chip with WebGL points instead (see GPGPU Particle System).
- **Fixed steps**: scaling one spring step by the frame time makes the spring stiffer or looser on faster screens. Take fixed steps from an accumulator and interpolate the drawing, as the demo does.
- **Sharp dots**: size the canvas backing store by `devicePixelRatio` (the demo caps it at 2) and keep the positions in CSS pixels with `setTransform`.
- **Touch**: `touch-action: none` on the canvas lets a finger drag through the word without scrolling the page. Keep the canvas from filling a phone screen, so the page can still be scrolled past it.
- **Accessibility**: a canvas is not text. Give it `role="img"` and an `aria-label` that holds the word, and keep a real heading in the page for screen readers and search engines.
- **Reduced motion**: the demo leaves every dot at home and only brightens the dots near the pointer. Switched on while the dots move, it puts every dot home at once. Check the setting in the frame loop: in Chrome, reading `matchMedia(...).matches` every frame can swallow its change event.
- **Libraries**: tsParticles has a canvas mask plugin that places its particles inside text; PixiJS (a ParticleContainer) and three.js (Points) draw many thousands of dots with WebGL. GSAP can tween the dots to new homes when the word changes, while the push and the spring are simplest in your own frame loop.

## See also
- [Canvas Particle Effect](../../06-3d-advanced/canvas-particle-effect/) — dots drift, link up and dodge your pointer
- [Image Distortion on Hover](../../06-3d-advanced/image-distortion-hover/) — a picture bends and ripples around your pointer
- [Scramble / Glitch Text](../scramble-text/) — random symbols lock into the real text
- [GPGPU Particle System](../../06-3d-advanced/gpgpu-particle-system/) — tens of thousands of particles on the graphics chip
