# Cursor Follower

## What it is
A cursor follower is a small shape that trails the mouse pointer with a slight delay, so it glides after it and eases in as it catches up instead of sticking to it. When it flips the colors of whatever is under it, it stays visible on any background, light over dark areas and dark over light ones, without choosing a color for each.

## When to use it
- Portfolio and agency sites where the cursor itself becomes part of the brand experience
- Interactive storytelling experiences where cursor reactivity reinforces immersion
- Landing pages where hover targets expand the follower for tactile feedback
- Any site where the default OS cursor is too subtle for the intended aesthetic

## How it works
Track `pointermove` to record target coordinates (`mx`, `my`). Each animation frame, interpolate the follower's position toward the target using a lerp (linear interpolation). The share of the gap to close is scaled by the time since the last frame, so the follower keeps the same pace on a 30, 60 or 120 Hz screen:

```js
let mx = 0, my = 0;       // pointer position
let fx = 0, fy = 0;       // follower position
let last = null;          // time of the previous frame
const FRAME = 1000 / 60;  // one frame of a 60 Hz screen, in ms
const ease = 0.15;        // fraction of the gap to close in one 60 Hz frame

document.addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; });

function loop(ts) {
  const dt = last === null ? FRAME : Math.min(ts - last, 50);   // ms since the last frame, at most 50
  last = ts;
  const a = 1 - Math.pow(1 - ease, dt / FRAME);                  // equals ease at 60 Hz
  fx += (mx - fx) * a;
  fy += (my - fy) * a;
  follower.style.transform = `translate(${fx}px, ${fy}px)`;   // transform only: nothing is laid out again
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
```

Each 60 Hz frame closes 15% of the remaining gap between follower and cursor. A frame twice as long closes 28% of it and one half as long about 8%, so the follower reaches ~95% of the way in about 18 frames' worth of time (~300ms) on any screen, producing a smooth lag without ever quite reaching the cursor. The first frame counts as one 60 Hz frame, and a gap longer than 50ms (a tab coming back from the background) counts as 50ms.

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
| Lag | Medium | How closely the dot follows: on a 60 Hz screen each frame closes 35% (short), 15% (medium) or 6% (long) of the gap to the pointer, and other screens close the share that fits their frame time, so the dot gets 95% of the way in about 0.1, 0.3 or 0.8 seconds everywhere; a longer lag feels heavier |
| Size | Medium | The dot is 20px, 32px or 48px across |
| Flips the colors under it | on | The dot inverts the colors beneath it, so it stays visible on light and dark areas; off, it is a see-through orange dot |
| Shape | Circle | A filled circle, a ring or a small square |
| Grows over buttons | on | The dot grows to two and a half times its size while the pointer is on a button |

## Production notes
- **Touch devices**: cursor effects don't apply to touch. Detect `(pointer: coarse)` and hide the follower entirely — never simulate a cursor on touch. The demo sends the dot to each tap only so the effect can be seen on a phone.
- **Performance**: `position: fixed` + `will-change: transform` promotes the follower to its own GPU layer. The demo moves it with `transform: translate(x, y)` and grows it with `scale()`, so nothing is laid out again while it moves.
- **Lag calibration**: `ease` is the share for a 60 Hz frame and the demo scales it by the frame time, so `ease = 0.15` gives the same ~300ms lag on a 30, 60 or 120 Hz screen. A plain per-frame lerp gives about 150ms on a 120 Hz display and 600ms on a 30 Hz phone, so the follower feels snappier or heavier from one device to the next.
- **Cursor hide**: add `cursor: none` to the `body` to hide the OS cursor when the follower is active. Re-enable on touch or when the cursor leaves the window.
- **GSAP QuickTo**: `const xTo = gsap.quickTo(follower, 'x', { duration: 0.3 })` is GSAP's optimized cursor follower pattern; it works from a duration in seconds, so it is time-based without the `dt` arithmetic.
- **`@motionone/animate`**: lightweight alternative to GSAP for cursor followers; no tree-shaking overhead.

## See also
- [Hover State Animation](../hover-state/) — items that react when the pointer is on them
- [Tooltip Reveal](../tooltip-reveal/) — a label that appears where the pointer rests
- [Click / Tap Ripple](../click-ripple/) — a ripple from the exact point you click
- [Image Trail](../image-trail/) — pictures that pop up along the pointer's path and fade
