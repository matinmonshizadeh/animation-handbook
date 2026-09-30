# Scroll Velocity Skew

## What it is

Scroll velocity skew leans content by how fast you scroll, not by where you are. Scroll quickly and the rows tilt in the direction of travel; stop and they spring back straight. It makes scrolling feel physical, as if the content bends under its own momentum.

## When to use it

- Portfolio and agency sites that want scrolling itself to feel like a physical gesture
- Image or project grids where a subtle shear adds motion without any choreographed timeline
- Alongside a smooth-scroll implementation, which already tracks velocity for free
- Anywhere you want feedback tied to the *energy* of the scroll rather than its location

## How it works

Every technique elsewhere in this section maps scroll **position** to animation progress. This one maps scroll **velocity**: the change in `scrollTop` from one frame to the next, counted per sixtieth of a second. The raw delta is noisy and spiky, so it is smoothed with a lerp before being scaled and clamped into a skew angle:

```js
function tick(now) {
  const dt = lastTime ? Math.max(now - lastTime, 1) : FRAME;   // ms since the last frame
  lastTime = now;
  const raw = (el.scrollTop - lastTop) * FRAME / dt;      // px moved per 1/60 s
  lastTop = el.scrollTop;
  vel += (raw - vel) * (1 - Math.pow(1 - SMOOTH, dt / FRAME));   // low-pass filter the spikes
  const skew = clamp(vel * INTENSITY, -MAX, MAX);
  rows.forEach(r => r.style.transform = `skewY(${skew}deg)`);
  requestAnimationFrame(tick);
}
```

The smoothing is what makes the effect feel physical. Raw deltas would snap the skew on and off with every wheel notch; the lerp turns them into a value with inertia, so the shear ramps up as you accelerate and eases back down after you stop — a spring-back you get for free, without writing any spring code. The loop only runs while there is motion: when the smoothed velocity falls below a threshold and no new scroll event has arrived, it writes an identity transform and parks itself until the next scroll. Speed is measured per sixtieth of a second (`FRAME` is 1000/60 ms), so a 120Hz screen leans as much as a 60Hz one. Back to top, and Play starting again from the top, move the box in a single frame, and so can a window resize (the browser keeps the list inside its new range); when either button is clicked or the window is resized, the demo takes the box's new position as its starting point, so that jump does not count as speed. A run of scrolling starts the same way, from where the box was before its first move, so even a single notch of the wheel leans the rows.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Strength | Normal | How far the rows lean for a given scroll speed: subtle is 0.2°, normal 0.35° and strong 0.6° for each pixel scrolled in a sixtieth of a second |
| Lean | Tilt | Tilt tips each row like a slope, the classic look; Slant leans it sideways like italic text |
| Spring back | Normal | How quickly the lean follows the scroll speed and fades after you stop; slow feels heavy, quick feels twitchy |
| Most it leans | Medium | The largest angle allowed: 6°, 12° or 20°, so a fast flick cannot fold the rows over |

## Production notes

- **Velocity vs position mapping is the core distinction.** Position-mapped effects (scrub, parallax, progress bars) are deterministic and reversible: the same scroll offset always produces the same frame, and scrolling back replays it in reverse. Velocity mapping is transient and additive: the same offset can look different depending on how you arrived, and the effect always decays to nothing at rest. Position tells a story; velocity adds feel.
- Idle the `requestAnimationFrame` loop once velocity settles. A velocity effect spends most of its life at zero, and a loop that runs forever burns battery to write the same transform.
- Skewing each row individually (with `will-change: transform`) reads as material shearing under momentum; skewing one giant wrapper reads as the whole page tilting, which is usually less convincing and produces larger paint areas.
- This effect is a genuine vestibular trigger — whole-viewport shearing tied to user input is exactly what `prefers-reduced-motion` exists for. Under `reduce`, hold the skew at 0 permanently while leaving scrolling itself untouched.
- In production this usually rides on a smooth-scroll library rather than raw `scrollTop` deltas: Locomotive Scroll exposes `speed` on its scroll event, and GSAP's ScrollTrigger provides `self.getVelocity()`, both already smoothed. The mapping from velocity to transform is the same either way.

## See also

- [Smooth (Inertia) Scroll](../smooth-scroll/) — scrolling that glides to a stop, often paired with this effect
- [Scrub Animation](../scrub-animation/) — movement tied to where you are, not how fast you go
- [Marquee / Ticker](../../05-text-typography/marquee-ticker/) — text that scrolls sideways forever, often sped up by scrolling
