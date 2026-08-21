# Scroll Velocity Skew

## What it is

A distortion effect where content shears in proportion to how *fast* the user is scrolling, not where they are on the page. Scroll quickly and rows of content skew a few degrees in the direction of travel; stop scrolling and the smoothed velocity decays to zero, so the shear relaxes back to straight on its own. It is the signature move of Locomotive Scroll-era portfolio sites, and it is this handbook's only entry driven by scroll velocity rather than scroll position.

## When to use it

- Portfolio and agency sites that want scrolling itself to feel like a physical gesture
- Image or project grids where a subtle shear adds motion without any choreographed timeline
- Alongside a smooth-scroll implementation, which already tracks velocity for free
- Anywhere you want feedback tied to the *energy* of the scroll rather than its location

## How it works

Every technique elsewhere in this section maps scroll **position** to animation progress. This one maps scroll **velocity**: the per-frame difference in `scrollTop`. The raw delta is noisy and spiky, so it is smoothed with a lerp before being scaled and clamped into a skew angle:

```js
function tick() {
  const raw = el.scrollTop - lastTop;   // px moved since last frame
  lastTop = el.scrollTop;
  vel += (raw - vel) * SMOOTH;          // low-pass filter the spikes
  const skew = clamp(vel * INTENSITY, -MAX, MAX);
  rows.forEach(r => r.style.transform = `skewY(${skew}deg)`);
  requestAnimationFrame(tick);
}
```

The smoothing is what makes the effect feel physical. Raw deltas would snap the skew on and off with every wheel notch; the lerp turns them into a value with inertia, so the shear ramps up as you accelerate and eases back down after you stop — a spring-back you get for free, without writing any spring code. The loop only runs while there is motion: when the smoothed velocity falls below a threshold and no new scroll event has arrived, it writes an identity transform and parks itself until the next scroll.

## Key parameters

| Parameter | Default | What it does |
|-----------|---------|--------------|
| `INTENSITY` | 0.35 | Degrees of skew per px/frame of smoothed velocity — the overall strength |
| `MAX` | 12° | Clamp on the skew angle; keeps a fast flick from folding the layout in half |
| `SMOOTH` | 0.12 | Lerp factor for the velocity filter; lower = heavier, longer settle, higher = twitchier |
| Axis | `skewY` | `skewY` shears rows vertically (the classic look); `skewX` slants them sideways |

## Production notes

- **Velocity vs position mapping is the core distinction.** Position-mapped effects (scrub, parallax, progress bars) are deterministic and reversible: the same scroll offset always produces the same frame, and scrolling back replays it in reverse. Velocity mapping is transient and additive: the same offset can look different depending on how you arrived, and the effect always decays to nothing at rest. Position tells a story; velocity adds feel.
- Idle the `requestAnimationFrame` loop once velocity settles. A velocity effect spends most of its life at zero, and a loop that runs forever burns battery to write the same transform.
- Skewing each row individually (with `will-change: transform`) reads as material shearing under momentum; skewing one giant wrapper reads as the whole page tilting, which is usually less convincing and produces larger paint areas.
- This effect is a genuine vestibular trigger — whole-viewport shearing tied to user input is exactly what `prefers-reduced-motion` exists for. Under `reduce`, hold the skew at 0 permanently while leaving scrolling itself untouched.
- In production this usually rides on a smooth-scroll library rather than raw `scrollTop` deltas: Locomotive Scroll exposes `speed` on its scroll event, and GSAP's ScrollTrigger provides `self.getVelocity()`, both already smoothed. The mapping from velocity to transform is the same either way.

## See also

- [Smooth (Inertia) Scroll](../smooth-scroll/) — the lerp-toward-target loop this effect usually rides on
- [Scrub Animation](../scrub-animation/) — the position-mapped counterpart: deterministic, reversible progress
- [Marquee Ticker](../../05-text-typography/marquee-ticker/) — often paired with velocity skew, with scroll speed modulating ticker speed
