# Scroll-Driven 3D Rotation

## What it is
Scroll-driven 3D rotation ties an object's turn to the scroll position. The object stays pinned in view while the visitor scrolls through a tall section, and each stretch of scrolling moves it on to the next pose: turned, tilted, grown, then showing its back. Scrolling back runs it in reverse, the way many product pages show off a new device.

## When to use it
- Product reveal pages where each scroll stage highlights a different feature or angle
- Hardware or device landing pages that need an interactive feel without video
- Storytelling sections where a 3D object serves as the visual anchor for sequential text
- Onboarding flows with a step-by-step 3D walkthrough

## How it works
Combine two techniques: **pin** (sticky positioning keeps the 3D stage visible while content scrolls) and **scrub** (scroll progress maps to a transform timeline).

**HTML structure:**
```html
<div class="scroll-container" style="height: 400vh">
  <div class="sticky-stage">  <!-- position: sticky; top: 0 -->
    <div class="object-3d" id="obj"></div>
  </div>
</div>
```

In this demo the scrolling box is the stage itself: its content is four stage heights tall (400%) and the pinned frame is one stage height, a quarter of the content. On a whole page the same structure is a section of 400vh.

**Scroll progress → transform:**
```js
container.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = container;
  const progress = scrollTop / (scrollHeight - clientHeight); // 0..1

  // Map progress to keyframes
  const rx = lerp(keyframes[floor].rx, keyframes[ceil].rx, fraction);
  const ry = lerp(keyframes[floor].ry, keyframes[ceil].ry, fraction);
  const sc = lerp(keyframes[floor].scale, keyframes[ceil].scale, fraction);

  obj.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(${sc})`;
});

function lerp(a, b, t) { return a + (b - a) * t; }
```

The demo's keyframes are four poses, one for each quarter of the scroll: a quarter turn to the side, a forward tilt, a larger size (1.4 times), then turning round to show the back.

**Smooth follow** adds a lerp each frame to ease between the raw scroll value and the applied rotation — this gives a cinematic feel:

```js
const FRAME = 1000 / 60;                   // one frame on a 60 Hz screen, in milliseconds
function animate(now) {
  const ease = 1 - Math.pow(0.9, Math.min(now - last, 50) / FRAME);  // 0.1 at 60 Hz, 0.19 at 30 Hz
  last = now;
  currentRx += (targetRx - currentRx) * ease;
  currentRy += (targetRy - currentRy) * ease;
  obj.style.transform = `rotateX(${currentRx}deg) rotateY(${currentRy}deg)`;
  requestAnimationFrame(animate);
}
```

The cube closes a tenth of the gap in every 1/60 s, so the share to close in one frame depends on how long the frame took. The cube then catches up in the same time on a 30, 60 or 144 Hz screen; a fixed 0.1 a frame would take twice as long on a 30 Hz phone and half as long at 120 Hz.

The demo asks for another frame only while the cube is still catching up, and stops once it has settled. The first frame after it starts again has no earlier frame to measure from, so it counts as one 1/60 s. The Turn amount setting multiplies the angles of every pose by 0.6, 1 or 1.6, and with reduced motion turned on the demo skips the gliding and sets each pose at once.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Turn amount | Normal | How far every pose turns the cube: less is 0.6, normal 1 and more 1.6 times the planned angles; at normal the last pose shows the cube's back |
| Smooth follow | on | The cube closes a tenth of the gap to its pose for every sixtieth of a second, so it glides after the scroll and catches up in the same time on every screen; off, it follows the scroll exactly |

## Production notes
- **CSS Scroll-Driven Animations API** (Chrome 115+): `animation-timeline: scroll()` and `animation-range` can drive CSS transforms directly without JavaScript. The spec covers this natively, but browser support is still catching up for complex choreography.
- **GSAP ScrollTrigger**: in production, `gsap.to(obj, { rotateY: 360, scrollTrigger: { trigger, scrub: 1 } })` is the idiomatic implementation. `scrub: 1` adds a 1-second smoothing lag.
- **Time, not frames**: easing that closes a fixed share of the gap on every frame follows the screen's refresh rate. Scale the share by the time since the last frame, as above, and cap that time (this demo uses 50 ms).
- **Performance**: CSS `transform` on a 3D element with `will-change: transform` runs on the compositor thread — scroll-driven rotation does not trigger layout or paint.
- **Mobile scroll budget**: 400vh of scroll on mobile means the user must scroll a lot. Consider reducing section height for mobile, or switching to a swipe-driven (touch-drag) interaction.

## See also
- [3D Model Orbit](../3d-model-orbit/) — time turns the object instead of scrolling
- [Scrub Animation](../../01-scroll-based/scrub-animation/) — scroll position drives any animation, without 3D
- [Sticky Section](../../01-scroll-based/sticky-section/) — the pinning that keeps the object in view
