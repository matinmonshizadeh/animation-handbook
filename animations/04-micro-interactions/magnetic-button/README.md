# Magnetic Button

## What it is
A magnetic button is a call-to-action that appears attracted to the cursor: as the pointer enters an invisible radius around the button, the button translates a fraction of the way toward the pointer, and its label drifts a little further for a parallax feel. When the pointer leaves, the button springs back to rest. The effect is entirely a transform driven by pointer distance — the button never actually leaves its layout position.

## When to use it
- Hero CTAs on portfolio and landing pages, where a single button carries most of the attention
- Primary actions you want to feel responsive and "alive" without being noisy
- Award-style / agency sites where tactile pointer play is part of the brand
- Sparingly — one or two magnetic elements per view, not every button

## How it works
On every `pointermove` over the stage, you measure the vector from the button's center to the pointer. If the distance is within the activation radius, you translate the button by that vector scaled by a strength factor, with a falloff so the pull eases to zero at the radius edge. The inner label uses a smaller multiplier, so it lags behind the button body:

```js
stage.addEventListener('pointermove', e => {
  const s = stage.getBoundingClientRect(), b = btn.getBoundingClientRect();
  const bx = b.left + b.width/2 - s.left, by = b.top + b.height/2 - s.top;
  const dx = (e.clientX - s.left) - bx, dy = (e.clientY - s.top) - by;
  const dist = Math.hypot(dx, dy);
  if (dist < radius) {
    const pull = 1 - dist / radius;              // 1 at center → 0 at edge
    const tx = dx * strength * pull, ty = dy * strength * pull;
    btn.style.transform = `translate(${tx}px, ${ty}px)`;
    lbl.style.transform = `translate(${tx*0.35}px, ${ty*0.35}px)`;
  } else { reset(); }
});
stage.addEventListener('pointerleave', reset);   // spring home
```

The spring-back is just a CSS `transition: transform .55s cubic-bezier(.22,1,.36,1)` on the button — when JS clears the inline transform, the button eases home on its own. On touch devices (no hover), the magnet is skipped entirely and the button only does a press-scale on tap.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Magnet strength | 0.35 | Fraction of the cursor-distance the button travels. Above ~0.5 it feels loose and unglued |
| Activation radius | 160px | How far out the pull begins. Too large and the button reacts to distant, unrelated movement |
| Label multiplier | 0.35 | Extra travel on the inner label for parallax. 0 = no parallax; too high = label detaches |
| Return easing | `cubic-bezier(.22,1,.36,1)` | Slight overshoot on release reads as spring, not slide |

## Production notes
- **Gate on hover capability**: check `window.matchMedia('(hover: hover)').matches` and only bind the magnet on pointer devices. On touch, `pointermove` fires only while dragging, so the effect would feel broken — fall back to a plain press-scale.
- **Transform only**: animate `translate`, never `top`/`left`. The button stays on the compositor and the layout never reflows, so it holds 60fps even during rapid pointer movement.
- **Debounce is unnecessary but rAF helps**: for heavier scenes, batch the transform write inside a `requestAnimationFrame` so multiple `pointermove` events in one frame collapse to a single style write.
- **Reduced motion**: shorten the transition to a near-instant linear move so the button still tracks but without the springy overshoot.
- **GSAP**: `gsap.quickTo(btn, "x", {duration:.5, ease:"power3"})` is the idiomatic way to do this — it interpolates toward the target every frame instead of snapping, giving smoother lag for free.
- **Framer Motion**: drive a `useSpring` off the pointer offset and feed it into a `motion.button`'s `x`/`y`; the spring config replaces the CSS easing.

## See also
- [Button Press Scale](../button-press-scale/) — the tap feedback used as the touch fallback here
- [Hover State Animation](../hover-state/) — simpler, non-positional cursor feedback
- [Cursor Follower](../cursor-follower/) — the inverse idea: an element that chases the cursor across the whole page
