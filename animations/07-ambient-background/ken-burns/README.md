# Ken Burns Effect

[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/07-ambient-background/ken-burns/)

## What it is
The Ken Burns effect brings still photos to life by slowly zooming and panning across them, the way a documentary camera moves over a printed photograph. Each photo drifts toward something worth looking at, and the next one fades in before the move ends, so the picture never stops moving. It is named after the filmmaker who made the technique famous in his documentaries.

## When to use it
- Hero slideshows on travel, hotel and property sites
- Story and about pages that walk through a few photos
- Event and wedding pages with a handful of strong pictures
- Slow backgrounds behind a heading, where a still photo would feel flat

## How it works
Each photo is drawn larger than its frame (here one and a half times, the strongest zoom any setting uses) and is only ever scaled down from there, so it stays sharp. One CSS keyframe timeline per photo moves it from a start framing to an end framing with transforms only; the two framings are custom properties that the script works out from the settings:

```css
.slide { animation: kb-fade calc(var(--T) * 3) linear infinite; animation-delay: var(--d); }
.photo { width: calc(100% * var(--Z)); height: calc(100% * var(--Z)); transform-origin: 0 0;
  animation: kb-move calc(var(--T) * 3) linear infinite; animation-delay: var(--d); }
@keyframes kb-move { 0% { transform: var(--from); } 38.1%, 100% { transform: var(--to); } }
@keyframes kb-fade { 0% { opacity: 0; z-index: 2; } 4.76% { opacity: 1; } 33.33% { z-index: 2; } 33.34% { z-index: 1; }
  38.1% { opacity: 1; } 38.11%, 100% { opacity: 0; z-index: 1; } }
```

Three slides share one cycle three photos long, each starting a photo's time after the one before. A slide fades in on top of the previous one for a seventh of its time, shows, then stays underneath while the next one fades in over it, and is hidden until its turn comes again; its photo keeps moving the whole time it can be seen. A framing is a zoom and the point of the photo that sits in the middle of the frame. That point is kept far enough from the photo's edges that the photo always covers the frame, and because the transform moves in a straight line between two framings that both cover it, every moment in between covers it too:

```js
const fit = (z, [x, y]) => { const h = .5 / z; return { z, x: Math.min(1 - h, Math.max(h, x)), y: Math.min(1 - h, Math.max(h, y)) }; };
const photoT = f => `translate(${(.5 - f.x * f.z) / ZMAX * 100}%, ${(.5 - f.y * f.z) / ZMAX * 100}%) scale(${f.z / ZMAX})`;
```

Zooming in starts near the photo's middle and ends closer on its point of interest; zooming out does the reverse. Pause and Slow motion simply hold or slow every CSS animation in the box. Under reduced motion each photo holds the end of its move and the photos only fade from one to the next.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Which way it zooms | Both | In zooms every photo in, toward its point of interest; out starts close and pulls back; both zooms the first and third photos in and the second out |
| How much it moves | Medium | Subtle zooms from 1.04 to 1.16 times and drifts less than half of the way toward the point of interest; medium zooms from 1.06 to 1.3 times and drifts three quarters of the way; strong zooms from 1.08 to 1.5 times and drifts all the way |
| Time on each photo | Medium | Short is 5 seconds, medium 7 seconds and long 10 seconds; each fade takes a seventh of that, about a second at medium |
| Shows a caption | off | On, each photo's name sits in the lower left corner and stays still while the photo moves |

## Production notes
- **Draw big, scale down.** A browser draws a layer once and then scales it; scaling it up past the size it was drawn at makes it soft. Give the photo the size it reaches at the strongest zoom and scale it down from there, or use a picture with enough pixels for the closest framing.
- **Never let an edge show.** Keep the zoom above one and the framing's center at least half a frame away from the photo's edges, at both ends of the move.
- **Keep text still.** Put headings and captions in a layer of their own above the moving photo, never inside it, so they stay sharp and easy to read.
- **One timeline, many photos.** Driving every photo from the same cycle with its own delay keeps the fades and moves in step with no script running each frame; changing the time only changes one custom property.
- **Reduced motion.** Hold each photo still and change photos with a slow fade.
- **Library equivalents.** GSAP: `gsap.fromTo(photo, { scale: 1.06, xPercent: 0 }, { scale: 1.3, xPercent: -8, duration: 8, ease: "none" })` in a timeline that crossfades the slides. Framer Motion: animate `scale`, `x` and `y` on the photo with `transition={{ duration: 8, ease: "linear" }}` and wrap the slides in `AnimatePresence`.

## See also
- [Aurora / Northern Lights](../aurora/) — a calm loop made of CSS keyframes
- [Infinite Zoom](../../06-3d-advanced/infinite-zoom/) — an endless dive into pictures inside pictures
- [Zoom Into Image](../../01-scroll-based/zoom-into-image/) — a picture that opens up as you scroll
