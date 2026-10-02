# Infinite Zoom

## What it is
An infinite zoom keeps moving into a picture whose middle holds a smaller picture, which holds a smaller one again, so the view seems to dive forever. It is a short loop in disguise: every picture is drawn again at a smaller size inside the frame of the one around it, and the view zooms in by exactly the step between two of them. When the inner picture fills the view it simply takes the outer one's place, so nothing ever jumps.

## When to use it
- Page intros and hero sections that pull the visitor into the site
- Stories that go from the big picture to a detail and on into the next chapter
- Portfolios and galleries where one piece of work opens into the next
- Music, art and game pages that want an endless, hypnotic background

## How it works
**Pictures with a window.** Each picture is drawn over the whole box around a window in its middle: 40% of the box's width and height (`R = 0.4`), so the window has the box's own shape. The next picture is the same full drawing scaled down by `R` about the center of the box, which lands it exactly in that window. In the demo the window is a painting's canvas, a drive-in movie screen, a television's screen, a laptop's screen and a photo; each frame is drawn outside the window, never over it.

**One number for the whole zoom.** `p`, from 0 to 1, says how far the view has zoomed from picture `at` toward the next one. Picture `j`, counted from the outside, is drawn at scale `R^(j - p)`: the outer one a little larger than the box (up to 2.5 times), the next one up to the box's size, the one after that 40% of it, and so on, until a picture would be smaller than 3 pixels. They are drawn from the outside in, over a dark fill, and each is clipped to its own rectangle less its window, so no picture paints over another and nothing of a picture spills over the frame around it. The edges between two pictures are soft, half in one and half in the other, so without the fill they would keep a little of the frame before:

```js
const R = 0.4;   // each window holds the next picture at 40% of its size
function render() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);           // the dark fill, over the whole canvas
  ctx.fillStyle = '#0c0c10'; ctx.fillRect(0, 0, cvs.width, cvs.height);
  const seen = [];
  for (let j = 0; j < 9; j++) {                 // picture j, from the outside in
    const s = Math.pow(R, j - p);
    if (s * Math.max(W, H) < 3) break;          // too small to see
    seen.push([s, (at + j) % COUNT]);
  }
  seen.forEach(([s, n], j) => {
    // scaled by s about the center of the box (kx, ky: canvas pixels per box pixel)
    ctx.setTransform(kx * s, 0, 0, ky * s, kx * W / 2 * (1 - s), ky * H / 2 * (1 - s));
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, W, H);      // its own rectangle,
    if (j < seen.length - 1) ctx.rect(X, Y, w, h); // less the window the next picture fills
    ctx.clip('evenodd');
    if (phone.matches) box(0, 0, W, H, FLAT[n]); // phones: the wall in one flat color
    else ctx.drawImage(SOFT[n], 0, 0, W, H);    // the soft light, drawn once per resize (below)
    SCENES[n]();                                // the rest, drawn in box pixels around the window
    ctx.restore();
  });
}
```

**The swap nobody sees.** At `p = 1` the next picture is drawn at scale `R^0 = 1`: it fills the box at exactly its own size, which is how it is drawn as picture `at` at `p = 0`. So when `p` passes 1, the loop takes 1 off `p` and moves `at` on by one, and the frame before and the frame after are the same picture. Zooming out runs `p` backward, and below 0 the picture around the outer one takes over:

```js
const dt = lastT === null ? 0 : Math.min(ts - lastT, 50) * (slow ? 1 / 3 : 1);
p += DIR * dt / 1000 / SECS;                          // DIR: 1 zooms in, -1 zooms out
while (p >= 1) { p--; at = (at + 1) % COUNT; }        // the next picture fills the box: it is the outer one now
while (p < 0) { p++; at = (at + COUNT - 1) % COUNT; } // zooming out, the picture around it is
```

**An even speed.** Because the scale is `R` to the power of `p`, and `p` grows with the time, every picture grows by the same factor each second, so the zoom feels steady. Growing the scale by the same amount each second instead would seem to slow down as the picture got bigger.

**Time, not frames.** The loop draws at most once per 16 ms and moves `p` by the time since the last drawn frame (at most 50 ms, and a third of it in slow motion), so the zoom has the same speed on a 30, 60 or 120 Hz screen. The first frame after a start, Play or a return to a hidden tab moves nothing. Pause cancels the frame, so the picture stops at once. The stars in the drive-in scene twinkle on the same clock.

**Soft light, drawn once.** The shading of each wall, sky or table and the glow of its lamps change slowly across the picture, so they are drawn once per resize into a small canvas a quarter of the box's size, and each frame stretches that canvas over the picture. Copying a picture costs far less than drawing the same gradients every frame.

**Number of scenes.** The chain takes the first one, three or five pictures in turn, `(at + j) % COUNT`. With one, the painting in the gallery holds the gallery itself: a picture that contains itself, known as the Droste effect.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | Normal | How long each picture takes to grow from its window to the whole box, 2.5 times its size: slow is 7.5 seconds, normal 4.5 and fast 2.5 |
| Number of scenes | 5 | How many different pictures take turns: one picture holds a copy of itself; three are the gallery, the drive-in and the living room; five add the desk and the photo on a table |
| Direction | In | In dives into each picture's window; out pulls back, so each picture shrinks into the window of the one around it |
| Shows the scene edges | off | Outlines the edge of every picture with a dashed line and numbers the ones big enough to read by their place in the chain, so you can see each one grow to the edges of the box and take over |

## Production notes
- **Your own pictures**: each picture needs its window in the same place, the box's own shape, in its exact middle, or the next picture will not fit it. Artists who make these zooms by hand draw every picture around a copy of the next one, then cut that copy out.
- **Sharp at full size**: every picture is shown from a speck up to the full box, and the outer one up to 2.5 times larger. Drawn shapes, as in the demo, or SVG stay sharp at every size; photos must be big enough for the full box at the screen's pixel ratio, and should be loaded before the zoom starts.
- **No frame over the window**: a frame that overlapped the next picture would vanish in one jump at the swap. Keep every frame outside its window.
- **CSS only**: layers scaled with `transform: scale()` work too (the card for this page on the home page has five, each with its window cut out and growing 2.5 times per step, with an easing that bends each step into the same steady speed), but the browser may draw a layer once at its starting size and enlarge that copy, so it blurs as it grows.
- **Libraries**: GSAP can tween the zoom value and you draw from it; Three.js does the same with textured planes and a camera that moves toward them. Neither is needed: the whole effect is one number and a loop.
- **Phones** draw at most 1.5 canvas pixels for every screen pixel and paint each wall in one flat color, without the soft light, which takes about 40% off the work of each frame.
- **Reduced motion**: show one still frame, the first picture with the pictures inside it, as the demo does; Play still starts the zoom. A steady zoom toward the middle can make some people dizzy, so keep it slow, give it a pause button and do not put long text over it.

## See also
- [Zoom Into Image](../../01-scroll-based/zoom-into-image/) — scrolling opens a small window until the picture fills the box
- [Portal / Tunnel Zoom](../../03-page-transitions/portal-zoom/) — the next page opens out of a circle you click
- [Starfield / Space Particles](../../07-ambient-background/starfield/) — stars stream toward you, another endless dive
- [2.5D / Pseudo-3D](../2-5d-pseudo-3d/) — flat layers that slide by different amounts to fake depth
