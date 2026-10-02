# Image Trail

## What it is
An image trail leaves a stream of pictures behind the pointer as it moves over a hero or a gallery. Each time the pointer has traveled a set distance, a new picture pops up on top of the others where the pointer is, stays for a moment, then leaves and fades away. A quick sweep leaves a long ribbon of pictures, and a pointer that holds still leaves none.

## When to use it
- Portfolio and photography heroes, where the trail gives a taste of the work before the visitor scrolls
- Agency and studio landing pages that want a playful first screen
- Lookbooks, collections and event pages with many pictures to hint at
- 404 and "coming soon" pages, where a little play is welcome

## How it works
The pictures are drawn once in the page: eight small SVG scenes in a hidden `<defs>`, each sky a CSS gradient. A fixed pool of 32 frames shows them in turn, each frame an `<i>` holding an `<svg>` whose `<use>` points at one scene. The frames are reused round-robin, so nothing is created while the pointer moves, and phones cycle through only 20 of them. A frame is reused only once its last picture has left: while the next frame in turn is still busy, no picture drops, so a fast pointer (or long stays) thins the trail out instead of cutting pictures short.

A picture drops each time the pointer has gone the gap (a share of the hero's shorter side) from the last drop. The first point of a stroke only marks where it starts, so a still pointer leaves nothing. Here is the demo's `track()` without its reduced-motion case (below):

```js
function track(x, y) {
  if (last && Math.hypot(x - last.x, y - last.y) < gapK * Math.min(W, H)) return;
  if (last && !drop(x, y, last)) return;   // every frame is busy: try again on the next move
  last = { x, y };
}
```

A picture's whole life is one Web Animations call on `transform` and `opacity`. It glides in from the last drop at half size with a small overshoot, stays, then leaves; when the animation ends the frame is back at its resting `opacity: 0`, so nothing has to clean up after it. The newest frame gets the highest `z-index`, so it always lies on top:

```js
el.style.zIndex = ++z;
el.animate([
  { transform: at(from.x, from.y, .5, r * 2), opacity: 0, easing: 'cubic-bezier(.22,1.3,.36,1)' },
  { transform: at(x, y, 1, r), opacity: 1, offset: POP / life },               // POP = 400ms
  { transform: at(x, y, 1, r), opacity: 1, offset: stay / life, easing: 'ease-in' },
  { transform: end, opacity: 0 }                                              // shrink, fade or fall
], { duration: life });                                                       // life = stay + 500ms
```

`at(x, y, s, r)` writes `translate(x, y) translate(-50%, -50%) rotate(r) scale(s)`: every keyframe has the same list of functions, so the browser interpolates each one, and the frame stays centered on its spot while it turns and scales. When the pictures fall, the last step eases in more steeply, like something dropping. The demo's Slow motion sets `playbackRate` to a third on every animation in the hero, which slows each picture's whole life.

On touch screens the hero has `touch-action: none` and takes pointer capture, so a finger drops a picture where it touches and leaves the trail as it drags, instead of scrolling the page. Under reduced motion there is no trail: one picture fades in where the pointer is, without moving or growing, and fades out when the next one appears or its time is up.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| How often a picture appears | Normal | How far the pointer goes between two pictures: often, normal and rarely are 0.12, 0.2 and 0.32 times the hero's shorter side, so the spacing looks the same on a phone and a laptop |
| How long they stay | Normal | How long a picture shows before it starts to leave: 0.4, 0.8 or 1.6 seconds from when it appears, then half a second to leave; longer stays make a longer trail |
| Picture size | Medium | Each picture is 0.26, 0.34 or 0.44 times the hero's shorter side across, in a 4:5 frame |
| How they leave | Shrink | Shrink scales the picture down to a quarter as it fades; Fade only fades it; Fall drops it by 30% of the hero's height as it fades, turning it a little further |
| Tilts the pictures | on | Each picture leans up to 8 degrees to one side, at random, and turns into place as it pops; off, they all stand straight |

## Production notes
- **Pool the frames**: creating and removing an element for every picture works, but it adds page work and garbage with every picture and can stutter on phones. A fixed pool reused in turn costs nothing while the pointer moves. Take a frame back only once its picture has left: when every frame is still out, let the trail wait, so it thins instead of pictures blinking away mid-stay.
- **Distance, not time**: dropping a picture every N milliseconds piles pictures up under a slow pointer and spreads them out under a fast one. Dropping one every N pixels keeps the spacing even at any speed and leaves nothing behind a pointer that holds still.
- **Real photos**: decode them before the first drop (`img.decode()`, or keep them in the pool from the start), or the first pass shows empty frames. Small, cropped files keep each frame's paint cheap.
- **Keep the headline readable**: pictures cover what lies under them for a moment, so put the key text where the trail passes least, or above the trail with enough contrast against any picture.
- **Touch**: phones cannot hover, so let a drag leave the trail (with `touch-action: none` on the hero only, so the page still scrolls around it) or drop a picture on each tap.
- **Reduced motion**: one picture that fades in where the pointer is keeps the idea without the movement; the demo also turns its Show me into three fades in place.
- **Libraries**: GSAP's `gsap.fromTo(el, { x: from.x, y: from.y, scale: .5, opacity: 0 }, { x, y, scale: 1, opacity: 1, ease: 'back.out' })` followed by a delayed `gsap.to(el, { scale: .25, opacity: 0 })` is the classic version of this effect; Framer Motion's `animate(el, keyframes, options)` takes keyframes like the demo's.

## See also
- [Cursor Follower](../cursor-follower/) — a shape that follows the pointer itself
- [Spotlight Hover Glow](../spotlight-hover/) — a soft light that follows the pointer over cards
- [Image Distortion on Hover](../../06-3d-advanced/image-distortion-hover/) — a picture that ripples and bends under the pointer
- [Heart / Like Burst](../heart-burst/) — small hearts that pop out and fade
