# Scroll Image Sequence

## What it is
A scroll image sequence pins a `<canvas>` to the viewport and maps scroll progress to a frame index — as you scroll, the "playhead" advances through a series of frames and each one is drawn to the canvas. Popularised by Apple's product pages, it turns a scroll gesture into a scrubbable video. Because the mapping is deterministic (a given scroll position always resolves to the same frame), scrubbing backward reverses the animation exactly.

## When to use it
- Product reveals where a physical object rotates or disassembles as the user scrolls
- Turning a short pre-rendered 3D animation into an interactive, scroll-scrubbed hero
- Onboarding or explainer sections where scroll pace equals playback pace
- Any "cinematic" scroll moment where you want frame-accurate control instead of CSS transitions

## How it works
A tall track element provides the scroll budget; a child pins itself with `position: sticky`. On every scroll event you convert the track's position into a `0 → 1` progress value, multiply by the frame count, and draw that frame. This demo has no image assets, so each frame is generated procedurally — but the scrubbing logic is identical to the production version.

```js
function updateTarget(){
  const rect = track.getBoundingClientRect();
  const span = rect.height - innerHeight;
  const p = span > 0 ? Math.min(Math.max(-rect.top / span, 0), 1) : 0;
  targetFrame = p * (TOTAL - 1);
}
addEventListener('scroll', updateTarget, {passive:true}); // fires for wheel AND touch
```

The render loop either snaps to the target frame or eases toward it (the smoothing toggle):

```js
if (smoothing) shownFrame += (targetFrame - shownFrame) * 0.18; // lerp
else           shownFrame  = targetFrame;                        // snap
drawFrame(Math.round(shownFrame));
```

`drawFrame(index)` is a pure function of the index — same index, same picture — which is exactly why reverse scrubbing rewinds cleanly.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Total frames | 120 | More frames = smoother scrub but more images to preload in production |
| Smoothing (lerp) | on | Eases `shownFrame` toward the scroll target; off = hard snap per frame |
| Lerp factor | 0.18 | Higher catches up faster; lower adds more inertia/lag |
| Track height | 340vh | The scroll distance budget — longer track = slower, more deliberate scrub |
| Sticky pin | `top: 0` | Where the canvas locks in the viewport during the scrub |

## Production notes
- **Preload every frame.** The real technique loads an array of `Image` objects (a video exported to a numbered JPG/WebP sequence). Never fetch frames on demand — decode stalls cause visible gaps. Kick off preloading before the section scrolls into view and show a loader until it's ready.
- **Frame count vs. weight.** 120–300 frames at full width is a lot of bytes. Use WebP/AVIF, cap the longest edge to the display size, and consider a lower frame count on mobile.
- **Draw the nearest frame, don't animate the canvas.** You are replacing the whole canvas each scroll tick; there is no CSS transition involved. Smoothing is done by easing the *frame index*, not by transitioning pixels.
- **`will-change` / decode.** Call `img.decode()` after load so the first paint of each frame isn't a jank spike. Keep the canvas sized to device pixels via `devicePixelRatio` (clamped) to avoid over-drawing on high-DPI phones.
- **Touch scroll works for free** because the effect is driven by the `scroll` event, not `wheel`. Avoid `preventDefault` scroll-hijacking libraries unless you need them.
- **Library equivalents:** GSAP **ScrollTrigger** with a `scrub` tween over a frame-index object is the canonical implementation; pair it with **Lenis** (or GSAP ScrollSmoother) for inertial smoothing. `<canvas>` + a preloaded frame array is the same idea without dependencies.

## See also
- [Scrub Animation](../scrub-animation/) — welding transforms directly to scroll position
- [Pin Animation](../pin-animation/) — the `position: sticky` pinning this technique relies on
- [Sticky Section](../sticky-section/) — a full section pinned while its interior scrubs
- [Zoom Into Image](../zoom-into-image/) — another scroll-scrubbed reveal effect
