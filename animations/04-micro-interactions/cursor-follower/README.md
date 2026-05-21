# Cursor Follower

## What it is
A cursor follower is a custom DOM element that tracks the mouse position with a lag, creating a smooth trailing effect. Combined with `mix-blend-mode: difference`, it inverts the color of whatever is beneath it — making the follower automatically visible against any background: white on dark areas, black on light areas, without any color calculation.

## When to use it
- Portfolio and agency sites where the cursor itself becomes part of the brand experience
- Interactive storytelling experiences where cursor reactivity reinforces immersion
- Landing pages where hover targets expand the follower for tactile feedback
- Any site where the default OS cursor is too subtle for the intended aesthetic

## How it works
Track `mousemove` to record target coordinates (`mx`, `my`). Each animation frame, interpolate the follower's position toward the target using a lerp (linear interpolation):

```js
let mx = 0, my = 0; // mouse position
let fx = 0, fy = 0; // follower position
const ease = 0.15;  // fraction to close each frame

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function loop() {
  fx += (mx - fx) * ease;
  fy += (my - fy) * ease;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(loop);
}
loop();
```

Each frame closes 15% of the remaining gap between follower and cursor. At 60fps, the follower reaches ~95% of the way in about 15 frames (~250ms), producing a smooth lag without ever quite reaching the cursor.

The `mix-blend-mode: difference` CSS property makes the follower invert whatever background color is beneath it:

```css
#follower {
  position: fixed;
  width: 32px; height: 32px;
  border-radius: 50%;
  background: #fff;
  mix-blend-mode: difference;
  pointer-events: none;
  transform: translate(-50%, -50%);
  will-change: transform;
  z-index: 9999;
}
```

For hover reactivity, scale the follower up when over interactive targets:

```js
document.querySelectorAll('a, button, [data-hover]').forEach(el => {
  el.addEventListener('mouseenter', () => follower.classList.add('expanded'));
  el.addEventListener('mouseleave', () => follower.classList.remove('expanded'));
});
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Easing factor | 0.15 | 0.05 = heavy lag (slow follower); 0.5 = almost no lag; 0.1–0.2 is the readable range |
| Size | 32px | 16–24px for subtle; 40–60px for dramatic; scales with hover expansion |
| Mix-blend-mode | difference | `normal` falls back to a colored dot; `difference` works universally |
| Hover expansion | 2.5× | Enlarges on hover targets for "magnetic" cursor feel |

## Production notes
- **Touch devices**: cursor effects don't apply to touch. Detect `(pointer: coarse)` and hide the follower entirely — never simulate a cursor on touch.
- **Performance**: `position: fixed` + `will-change: transform` promotes the follower to its own GPU layer. Updating `left`/`top` (rather than `transform`) on every frame is less optimal — in production, update `transform: translate(x, y)` instead.
- **Lag calibration**: at 60fps with `ease = 0.15`, the follower lags ~250ms. At 120fps (high refresh displays), the same `ease` value produces ~125ms lag — the follower will appear snappier. Account for frame rate differences in high-performance contexts.
- **Cursor hide**: add `cursor: none` to the `body` to hide the OS cursor when the follower is active. Re-enable on touch or when the cursor leaves the window.
- **GSAP QuickTo**: `const xTo = gsap.quickTo(follower, 'x', { duration: 0.3 })` is GSAP's optimized cursor follower pattern — more precise than rAF lerp at variable frame rates.
- **`@motionone/animate`**: lightweight alternative to GSAP for cursor followers; no tree-shaking overhead.

## See also
- [Hover State Animation](../hover-state/) — cursor-triggered changes on interactive elements
- [Tooltip Reveal](../tooltip-reveal/) — cursor-proximity information reveal
- [Click / Tap Ripple](../click-ripple/) — click-point feedback complementing the cursor follower
