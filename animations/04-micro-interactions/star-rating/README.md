# Star Rating

## What it is
An interactive five-star control for capturing a rating. Moving the pointer across the row fills the stars up to the pointer with an accent color; the fill cascades smoothly as you move. Clicking (or tapping) commits that value and plays a short scale pop on the selected star. Arrow keys drive the same control from the keyboard, and an option lets each star resolve to a half.

## When to use it
- Product, review, and feedback forms where a coarse 1–5 score is enough
- Post-purchase or post-support surveys ("How did we do?")
- Content or media ratings shown inline in a card or detail view
- Any place a numeric input would feel heavier than a quick tap
- Not for precise measurements — five (or ten) buckets is the whole point; use a slider or number field when finer values matter

## How it works
Each star is two stacked shapes in one box: a muted outline drawn with `currentColor`, and an accent-colored fill. A full star is just a color swap on the outline; a half star reveals an overlaid accent copy clipped to the left 50%. Because the swap is a `transition` on `color`, sweeping the pointer across the row makes the stars fill one after another — the animation is the cascade, not a per-star width tween. Committing retriggers a `transform: scale` pop on the chosen star:

```css
.star{ color: var(--ui-muted); transition: color var(--fill-dur) ease; }
.star.full{ color: var(--ui-accent); }
.star .half{ position:absolute; width:50%; overflow:hidden; color:var(--ui-accent); opacity:0; }
.star.half-on .half{ opacity:1; }

@keyframes pop{ 0%{transform:scale(1)} 35%{transform:scale(var(--pop))} 70%{transform:scale(.94)} 100%{transform:scale(1)} }
.star.pop{ animation:pop .42s cubic-bezier(.22,1,.36,1); }
```

The pointer position within a star decides the value — left half rounds to `.5`, right half to the whole — and `pointermove`/`pointerleave` preview it without committing. The pop is re-fired by removing and re-adding the `pop` class (`star.classList.remove('pop'); void star.offsetWidth; star.classList.add('pop')`) so repeated commits always animate.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Star count | 5 | How many buckets; the control rebuilds and `aria-valuemax` follows |
| Pop intensity | 1.35× | Peak scale of the commit pop. Above ~1.6 reads as rubbery |
| Fill duration | 180ms | Color-transition time per star — the perceived smoothness of the cascade |
| Allow half-stars | off | Switches the step and pointer rounding between 1 and 0.5 |

## Production notes
- **Accessibility**: this demo exposes the row as a single `role="slider"` with `aria-valuemin/max/now` and an `aria-valuetext` ("3 out of 5"), which handles half-steps cleanly from the keyboard. A `role="radiogroup"` of `radio` stars is the other idiomatic choice and maps better to discrete whole-star ratings; pick the model that matches whether half values exist.
- **Keyboard**: arrow keys step by the current increment, Home clears to 0, End jumps to max. The control must be focusable (`tabindex="0"`) and show a visible focus ring — rating with the mouse only is not enough.
- **Don't rely on color alone**: fill is reinforced by the numeric readout below the row so the value survives for colorblind users and greyscale. Never encode the score in hue by itself.
- **Half-star handling**: resolve the half from the pointer's horizontal position inside the hovered star, and keep the committed value and the hover preview separate so leaving the row restores the committed rating rather than a stray hover state.
- **Touch targets**: each star box is at least 44×44px and the control uses Pointer Events, so hover-preview and tap-to-commit both work on touch. Hover styling is gated behind `@media (hover: hover)`.
- **Library equivalents**: Framer Motion can drive the pop with a `whileTap`/`animate` scale spring; many form kits (e.g. rating inputs in headless UI libraries) ship the radiogroup semantics so you only style the stars.

## See also
- [Heart Burst](../heart-burst/) — a sibling reward interaction where the commit is a particle burst instead of a fill
- [Button Press Scale](../button-press-scale/) — the scale-overshoot mechanic behind the star pop
- [Toggle / Switch Slide](../toggle-switch/) — another small, committed form control with a state animation
