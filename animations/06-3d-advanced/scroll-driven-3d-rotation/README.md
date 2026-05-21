# Scroll-Driven 3D Rotation

## What it is
Scroll-driven 3D rotation choreographs a 3D object's transforms — rotation, scale, position — against scroll progress through a pinned section. As the user scrolls, the object moves through a sequence of predetermined states. This is the pattern behind Apple's product reveal pages, where a product rotates, expands, and repositions as you scroll through marketing copy.

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

**Smooth scrub** adds a lerp each frame to ease between the raw scroll value and the applied rotation — this gives a cinematic feel:

```js
function animate() {
  currentRx += (targetRx - currentRx) * 0.1;
  currentRy += (targetRy - currentRy) * 0.1;
  obj.style.transform = `rotateX(${currentRx}deg) rotateY(${currentRy}deg)`;
  requestAnimationFrame(animate);
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Section height | 400vh | Total scroll budget — taller = slower reveal, more reading time |
| Keyframe count | 4 | Number of distinct rotation stages in the sequence |
| Lerp factor | 0.1 | Smoothing per frame — 0.1 is cinematic, 1.0 is instant |
| CSS perspective | 600px | Lower = more dramatic 3D distortion |

## Production notes
- **CSS Scroll-Driven Animations API** (Chrome 115+): `animation-timeline: scroll()` and `animation-range` can drive CSS transforms directly without JavaScript. The spec covers this natively, but browser support is still catching up for complex choreography.
- **GSAP ScrollTrigger**: in production, `gsap.timeline().to(obj, { rotateY: 360 }).scrollTrigger({ trigger, scrub: 1 })` is the idiomatic implementation. `scrub: 1` adds a 1-second smoothing lag.
- **Performance**: CSS `transform` on a 3D element with `will-change: transform` runs on the compositor thread — scroll-driven rotation does not trigger layout or paint.
- **Mobile scroll budget**: 400vh of scroll on mobile means the user must scroll a lot. Consider reducing section height for mobile, or switching to a swipe-driven (touch-drag) interaction.

## See also
- [3D Model Orbit](../3d-model-orbit/) — WebGL-rendered version of the same concept
- [Scrub Animation](../../01-scroll-based/scrub-animation/) — general scroll-scrub pattern without 3D
- [Sticky Section](../../01-scroll-based/sticky-section/) — the pinning pattern that enables scroll-driven reveals
