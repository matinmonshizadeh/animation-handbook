# Magnetic Button

## What it is
A magnetic button seems to be drawn to the pointer. When the pointer comes close, the button moves part of the way toward it and its label moves a little further, so the label seems to float above the button. When the pointer leaves, the button springs back; it never leaves its place in the layout.

## When to use it
- Hero CTAs on portfolio and landing pages, where a single button carries most of the attention
- Primary actions you want to feel responsive and "alive" without being noisy
- Award-style / agency sites where tactile pointer play is part of the brand
- Sparingly — one or two magnetic elements per view, not every button

## How it works
On every `pointermove` over the stage, you measure the vector from the button's center to the pointer. If the distance is within the activation radius, you translate the button by that vector scaled by a strength factor, with a falloff so the pull eases to zero at the radius edge. The inner label uses a smaller multiplier, so it lags behind the button body. The pull is one function that takes a point on the stage, so the mouse and a finger can both call it:

```js
function pull(px, py) {
  const s = stage.getBoundingClientRect(), b = btn.getBoundingClientRect();
  const bx = b.left + b.width/2 - s.left, by = b.top + b.height/2 - s.top;
  const dx = px - bx, dy = py - by;
  const dist = Math.hypot(dx, dy);
  if (dist < radius) {
    const f = 1 - dist / radius;                 // 1 at center → 0 at edge
    const tx = dx * strength * f, ty = dy * strength * f;
    btn.style.setProperty('--tx', tx + 'px');    // .mag { transform: translate(var(--tx), var(--ty)) }
    btn.style.setProperty('--ty', ty + 'px');
    label.style.transform = `translate(${tx*0.35}px, ${ty*0.35}px)`;
  } else { home(); }
}
function home() {
  btn.style.removeProperty('--tx'); btn.style.removeProperty('--ty');
  label.style.transform = '';
}
const pointAt = e => {
  const s = stage.getBoundingClientRect();
  pull(e.clientX - s.left, e.clientY - s.top);
};

// Mouse: pull while it moves over the stage, spring home when it leaves
stage.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') pointAt(e); });
stage.addEventListener('pointerleave', home);

// Finger or pen: pull while it touches the stage, spring home when it lifts
let touchId = null;
stage.addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse') return;
  touchId = e.pointerId; pointAt(e);
});
stage.addEventListener('pointermove', e => { if (e.pointerId === touchId) pointAt(e); });
['pointerup', 'pointercancel'].forEach(type => stage.addEventListener(type, e => {
  if (e.pointerId === touchId) { touchId = null; home(); }
}));
```

The spring-back is just a CSS `transition: transform .55s cubic-bezier(.22,1,.36,1)` on the button — when JS clears the offsets, the button eases home on its own. On touch screens, which cannot hover, the same pull follows a finger while it touches the stage, and the button springs home when the finger lifts.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Pull strength | Medium | How far the button moves toward the pointer: gentle is 20%, medium 35% and strong 50% of the distance; past about half it feels loose |
| Reach | Medium | How close the pointer must come before the pull starts: short is 100px, medium 160px and long 240px; too far and the button reacts to unrelated movement |

## Production notes
- **Gate on hover capability**: bind the hover magnet only where `window.matchMedia('(hover: hover)').matches`. On touch screens `pointermove` fires only while a finger is down, so pull toward the touch point while it is down and send the button home when it lifts, or fall back to a plain press-scale.
- **Transform only**: animate `translate`, never `top`/`left`. The button stays on the compositor and the layout never reflows, so it holds 60fps even during rapid pointer movement.
- **Debounce is unnecessary but rAF helps**: for heavier scenes, batch the transform write inside a `requestAnimationFrame` so multiple `pointermove` events in one frame collapse to a single style write.
- **Reduced motion**: shorten the transition to a quick, even move, so the button still follows the pointer without the slow glide.
- **GSAP**: `gsap.quickTo(btn, "x", {duration:.5, ease:"power3"})` is the idiomatic way to do this — it interpolates toward the target every frame instead of snapping, giving smoother lag for free.
- **Framer Motion**: drive a `useSpring` off the pointer offset and feed it into a `motion.button`'s `x`/`y`; the spring config replaces the CSS easing.

## See also
- [Button Press Scale](../button-press-scale/) — the small shrink it also does when pressed
- [Hover State Animation](../hover-state/) — simpler ways to react to the pointer
- [Cursor Follower](../cursor-follower/) — a shape that follows the pointer around
