# Scrub Animation

[Live demo](index.html)

## What it is

A multi-stage product disassembly animation where every transform is welded directly to scroll position. There is no autoplay, no duration, no easing that runs independently — scroll IS the seek bar. Scrubbing backward reassembles the product perfectly because animation state is computed entirely from a single `0–1` progress value derived from `scrollTop`. This demo shows a camera lens disassembling in five stages across ~800px of scroll distance.

## When to use it

- Product reveal pages where the user controls the pace of the reveal
- Technical explainer sequences — processors, architecture, mechanical parts — that benefit from user-controlled inspection
- Apple-style feature walkthroughs where each scroll increment advances the story
- Any animation that must be perfectly reversible and inspectable at any intermediate state

## How it works

The entire animation runs from one number:

```js
const progress = stage.scrollTop / (stage.scrollHeight - stage.clientHeight); // 0→1
```

Each stage occupies an 18% slice of the progress range. A `clamp` function extracts a local `t` for each stage:

```js
const t1 = clamp(progress / 0.18, 0, 1);              // Stage 1: 0–18%
const t2 = clamp((progress - 0.18) / 0.18, 0, 1);     // Stage 2: 18–36%
// …and so on
```

Each SVG element's transform is applied in the rAF callback:

```js
lensHood.style.transform  = `translateY(${lerp(0, -70, t1)}px)`;
lensGlass.style.transform = `translateY(${lerp(0, -45, t2)}px) scale(${lerp(1, 1.15, t2)})`;
iris.style.transform      = `rotate(${lerp(0, 90, t3)}deg)`;
lensBody.style.transform  = `translateX(${lerp(0, -65, t4)}px)`;
lensCore.style.transform  = `scale(${lerp(1, 2, t5)})`;
```

Reversing is automatic — `progress` decreases when scrolling up, so all `lerp` calls return earlier values.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Stage count | 5 | Number of distinct disassembly phases |
| Stage width | 18% | Fraction of total progress range per stage |
| Scroll travel | ~800px | Total scroll distance for the full animation |
| `lerp(a, b, t)` | — | Linear interpolation between start and end transform values |

## Production notes

- **No `setInterval`, no animation loops.** The only "loop" is the rAF-throttled scroll listener. Scrub animations have no concept of time, only position.
- **GSAP ScrollTrigger with `scrub: true`** is the production equivalent. A GSAP timeline is linked to scroll with `scrub: 1` (smoothing lag). The timeline treats `progress` as its playhead. Framer Motion's `useScroll` + `useTransform` achieves the same in React.
- **SVG transforms.** Set `transform-box: fill-box; transform-origin: center` in CSS so rotation and scale behave relative to each SVG element's own center rather than the SVG viewport origin.
- **Easing within stages.** This demo uses linear interpolation. In production, apply a per-stage easing function to `t` before passing to `lerp` — this lets parts accelerate into or decelerate out of each stage.
- **Accessibility.** Continuous scroll-driven motion is a vestibular concern. Under `prefers-reduced-motion: reduce`, skip all transforms and show the fully assembled state statically.

## See also

- [ScrollTrigger Animation](../scroll-trigger/) — the broader scroll trigger concept this pattern uses.
- [Pin Animation](../pin-animation/) — a complementary pattern where content pins and advances in steps rather than scrubbing continuously.
