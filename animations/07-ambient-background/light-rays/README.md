# Light Rays

## What it is
Light rays (also called god rays or sunbeams) are soft shafts of light that fan out from a bright point just out of view, as when sun falls through a window or between trees. Each beam is soft at its edges, brightest near where the light comes in and fading farther away. The beams sway a little and brighten and dim on their own slow cycles, so the light seems to sweep across the scene, and specks of dust glint only where a beam catches them.

## When to use it
- Hero sections and page intros that should feel calm, warm or a little cinematic
- Wellness, nature, travel, church and event sites, where light carries the mood
- Product launches and reveals, with the product or headline sitting in the light
- Dark sections that need depth without a busy pattern

## How it works
Each beam is a soft wedge drawn on a canvas with a conic gradient centered on the light's source: clear at both edges and brightest in the middle. The wedges are drawn with the `lighter` blend, so where two beams overlap their light adds up, over a faint haze that covers the whole fan. Then one radial gradient, drawn with `destination-in`, fades everything with distance from the source.

```js
ctx.globalCompositeOperation = 'lighter';
for (const r of rays) {
  r.now = base + r.c + r.s * Math.sin(r.f * t + r.p) + sweep;   // the beam sways on its own cycle
  r.al = r.a * (0.6 + 0.4 * Math.sin(r.g * t + r.q));          // and brightens and dims on another
  const g = ctx.createConicGradient(r.now - r.w / 2, sx, sy), k = r.w / (2 * Math.PI);
  g.addColorStop(0, `rgba(${rgb},0)`);
  g.addColorStop(k * 0.2, `rgba(${rgb},${r.al * 0.3})`);
  g.addColorStop(k * 0.5, `rgba(${rgb},${r.al})`);             // brightest along its middle line
  g.addColorStop(k * 0.8, `rgba(${rgb},${r.al * 0.3})`);
  g.addColorStop(k, `rgba(${rgb},0)`);
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(sx, sy);                          // a triangle a little wider than the wedge
  ctx.lineTo(sx + Math.cos(r.now - r.w) * R, sy + Math.sin(r.now - r.w) * R);
  ctx.lineTo(sx + Math.cos(r.now + r.w) * R, sy + Math.sin(r.now + r.w) * R);
  ctx.fill();
}
ctx.globalCompositeOperation = 'destination-in';                // fade with distance from the source
ctx.fillStyle = fade; ctx.fillRect(0, 0, W, H);
```

Each speck of dust drifts up and sideways with a gentle wobble. Its brightness is the light at its spot: every beam that covers it adds its strength, most along the beam's middle line, times the same fade with distance, so a speck glints as a beam passes over it and is barely there in the dark. The light has its own clock, which grows by the time since the last frame times the speed (a third of it in slow motion), never more than 50 ms at once, so the beams sway at the same pace on every screen; every frame clears the canvas and draws the whole picture again.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Light color | Warm | Warm late sunshine over a brown-black room, or cool moonlight over a blue-black one |
| Speed | Normal | How fast the beams sway and the dust drifts: slow is half the normal pace and fast twice it; at normal a beam sways back and forth every 12 to 22 seconds |
| Floating dust | on | Specks of dust drift slowly upward and glint where a beam crosses them; phones show 40, other screens 80 |
| Number of rays | Some | Few is 5 beams, some 8 and many 12; more beams overlap into a fuller, brighter light |
| Light comes from | Top left | Where the beams start: just above the top left corner, the middle of the top edge or the top right corner |

## Production notes
- **Cheap to draw**: a frame is one haze fill, one gradient wedge per beam, one fade, one glow and a few dozen dots, a fraction of a millisecond on a laptop. Nothing is blurred: the soft edges come from the gradient itself, which is far cheaper than a blur filter.
- **Phones**: phone-sized screens (up to 600px wide, or up to 500px tall for a phone held sideways) float half as much dust.
- **Browser support**: `createConicGradient` on a canvas is in every current browser (Chrome 99, Safari 16.1, Firefox 112). The demo checks for it first; where it is missing, each beam is a narrower wedge of one flat, faint color and the haze is left out, so the page still shows light instead of failing.
- **CSS alternative**: beams can also be long, narrow elements with a soft gradient across them, turned around the source with `transform: rotate()` and faded with a mask. Keep them few and narrow, since every one is a large layer in memory, especially on high-density phone screens.
- **WebGL**: games and 3D scenes make god rays with a radial blur of the bright parts of the image (volumetric light scattering); three.js has a `GodRaysEffect` in the postprocessing library.
- **Reduced motion**: the demo starts paused with the rays drawn still, until the visitor presses Play.
- **Keep text readable**: the beams fade out toward the bottom, where the headline sits, and a soft dark shade (a radial gradient behind the text) keeps it readable where several beams cross under it; keep small text away from the brightest part of the light.

## See also
- [Light Leak](../light-leak/) — warm light washes in from a corner at random times
- [Aurora / Northern Lights](../aurora/) — bands of colored light sway across a night sky
- [Breathing / Pulsing Glow](../breathing-glow/) — one soft glow slowly grows and shrinks
