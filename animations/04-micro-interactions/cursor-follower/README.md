# Cursor Follower

## What it is
A cursor follower is a small shape that trails the mouse pointer with a slight delay, so it glides after it and eases in as it catches up instead of sticking to it. When it flips the colors of whatever is under it, it stays visible on any background, light over dark areas and dark over light ones, without choosing a color for each.

## When to use it
- Portfolio and agency sites where the cursor itself becomes part of the brand experience
- Interactive storytelling experiences where cursor reactivity reinforces immersion
- Landing pages where hover targets expand the follower for tactile feedback
- Any site where the default OS cursor is too subtle for the intended aesthetic

## How it works
Track `pointermove` to record target coordinates (`mx`, `my`). Each animation frame, interpolate the follower's position toward the target using a lerp (linear interpolation):

```js
let mx = 0, my = 0; // pointer position
let fx = 0, fy = 0; // follower position
const ease = 0.15;  // fraction to close each frame

document.addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; });

function loop() {
  fx += (mx - fx) * ease;
  fy += (my - fy) * ease;
  follower.style.transform = `translate(${fx}px, ${fy}px)`;   // transform only: nothing is laid out again
  requestAnimationFrame(loop);
}
loop();
```

Each frame closes 15% of the remaining gap between follower and cursor. At 60fps, the follower reaches ~95% of the way in about 15 frames (~250ms), producing a smooth lag without ever quite reaching the cursor.

The `mix-blend-mode: difference` CSS property makes the follower invert whatever background color is beneath it:

```css
#follower {
  position: fixed;
  left: 0; top: 0;                 /* moved only by transform */
  mix-blend-mode: difference;
  pointer-events: none;
  will-change: transform;
  z-index: 9999;
}
#follower .shape {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: #fff;
  transform: translate(-50%, -50%);
  transition: transform .2s ease;
}
#follower.expanded .shape { transform: translate(-50%, -50%) scale(2.5); }
```

For hover reactivity, scale the follower up when over interactive targets:

```js
stage.addEventListener('pointermove', e => {
  follower.classList.toggle('expanded', !!e.target.closest('a, button, [data-hover]'));
});
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Lag | Medium | How closely the dot follows: each frame it closes 35% (short), 15% (medium) or 6% (long) of the gap to the pointer; a longer lag feels heavier |
| Size | Medium | The dot is 20px, 32px or 48px across |
| Flips the colors under it | on | The dot inverts the colors beneath it, so it stays visible on light and dark areas; off, it is a see-through orange dot |
| Shape | Circle | A filled circle, a ring or a small square |
| Grows over buttons | on | The dot grows to two and a half times its size while the pointer is on a button |

## Production notes
- **Touch devices**: cursor effects don't apply to touch. Detect `(pointer: coarse)` and hide the follower entirely — never simulate a cursor on touch. The demo sends the dot to each tap only so the effect can be seen on a phone.
- **Performance**: `position: fixed` + `will-change: transform` promotes the follower to its own GPU layer. The demo moves it with `transform: translate(x, y)` and grows it with `scale()`, so nothing is laid out again while it moves.
- **Lag calibration**: at 60fps with `ease = 0.15`, the follower lags ~250ms. At 120fps (high refresh displays), the same `ease` value produces ~125ms lag — the follower will appear snappier. Account for frame rate differences in high-performance contexts.
- **Cursor hide**: add `cursor: none` to the `body` to hide the OS cursor when the follower is active. Re-enable on touch or when the cursor leaves the window.
- **GSAP QuickTo**: `const xTo = gsap.quickTo(follower, 'x', { duration: 0.3 })` is GSAP's optimized cursor follower pattern — more precise than rAF lerp at variable frame rates.
- **`@motionone/animate`**: lightweight alternative to GSAP for cursor followers; no tree-shaking overhead.

## See also
- [Hover State Animation](../hover-state/) — items that react when the pointer is on them
- [Tooltip Reveal](../tooltip-reveal/) — a label that appears where the pointer rests
- [Click / Tap Ripple](../click-ripple/) — a ripple from the exact point you click
