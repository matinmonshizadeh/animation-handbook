# Scroll Image Sequence

## What it is
A scroll image sequence plays a series of still pictures as you scroll, like flipping through a flip-book: each scroll position shows one picture, so scrolling down plays the animation and scrolling up plays it backwards. Product pages use it to turn a pre-rendered animation, such as a phone turning around, into something the reader controls. The demo draws its pictures as it goes, a turning wireframe cube, so it needs no image files.

## When to use it
- Product reveals where a physical object rotates or disassembles as the user scrolls
- Turning a short pre-rendered 3D animation into an interactive, scroll-scrubbed hero
- Onboarding or explainer sections where scroll pace equals playback pace
- Any "cinematic" scroll moment where you want frame-accurate control instead of CSS transitions

## How it works
A tall track element provides the scroll budget; a child pins itself with `position: sticky`. On every scroll event you convert the track's position into a `0 → 1` progress value and multiply it by the frame count; a frame loop draws that frame. This demo has no image assets, so each frame is generated procedurally — but the scrubbing logic is identical to the production version.

```js
function updateTarget(){
  const span = track.offsetHeight - stage.clientHeight;      // the stage is the scroll box
  const p = span > 0 ? Math.min(Math.max((stage.scrollTop - track.offsetTop) / span, 0), 1) : 0;
  targetFrame = p * (TOTAL - 1);
}
stage.addEventListener('scroll', updateTarget, {passive:true}); // fires for wheel AND touch
```

The render loop either snaps to the target frame or eases toward it (the Glides between frames setting):

```js
if (smoothing) shownFrame += (targetFrame - shownFrame) * 0.18; // lerp
else           shownFrame  = targetFrame;                        // snap
const index = Math.round(shownFrame);
if (index !== drawn) { drawFrame(index); drawn = index; }         // skip a picture that is already on the canvas
```

`drawFrame(index)` is a pure function of the index — same index, same picture — which is exactly why reverse scrubbing rewinds cleanly. It is also why the loop can skip a picture that is already on the canvas, which keeps the page cheap on phones. Back to top, and Play starting again from the top, move the box in one jump; a click on either button sets the shown frame to the target at once, so the picture does not play backwards.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Number of frames | Normal | How many pictures the sequence has: few is 24, normal 120 and many 240; more frames scrub more smoothly but are more images to load in production |
| Glides between frames | on | The picture eases toward the frame the scroll points at instead of jumping to it |

## Production notes
- **Preload every frame.** The real technique loads an array of `Image` objects (a video exported to a numbered JPG/WebP sequence). Never fetch frames on demand — decode stalls cause visible gaps. Kick off preloading before the section scrolls into view and show a loader until it's ready.
- **Frame count vs. weight.** 120–300 frames at full width is a lot of bytes. Use WebP/AVIF, cap the longest edge to the display size, and consider a lower frame count on mobile.
- **Draw the nearest frame, don't animate the canvas.** You are replacing the whole canvas each scroll tick; there is no CSS transition involved. Smoothing is done by easing the *frame index*, not by transitioning pixels.
- **`will-change` / decode.** Call `img.decode()` after load so the first paint of each frame isn't a jank spike. Keep the canvas sized to device pixels via `devicePixelRatio` (clamped) to avoid over-drawing on high-DPI phones.
- **Touch scroll works for free** because the effect is driven by the `scroll` event, not `wheel`. Avoid `preventDefault` scroll-hijacking libraries unless you need them.
- **Library equivalents:** GSAP **ScrollTrigger** with a `scrub` tween over a frame-index object is the canonical implementation; pair it with **Lenis** (or GSAP ScrollSmoother) for inertial smoothing. `<canvas>` + a preloaded frame array is the same idea without dependencies.

## See also
- [Scrub Animation](../scrub-animation/) — scroll position moves a plane along its path
- [Pin Animation](../pin-animation/) — the pinning this effect relies on
- [Sticky Section](../sticky-section/) — a whole section holds still while its content changes
- [Zoom Into Image](../zoom-into-image/) — a picture opens up as you scroll
