# Star Rating

## What it is
A star rating lets someone give a score by choosing a star. As the pointer moves along the row, the stars fill up to the one under it, so the choice shows before it is made; clicking or tapping a star chooses it and makes it pop. The arrow keys change the rating too, and a setting lets each star count in halves.

## When to use it
- Product, review, and feedback forms where a coarse 1–5 score is enough
- Post-purchase or post-support surveys ("How did we do?")
- Content or media ratings shown inline in a card or detail view
- Any place a numeric input would feel heavier than a quick tap
- Not for precise measurements — five (or ten) buckets is the whole point; use a slider or number field when finer values matter

## How it works
Each star is one star shape drawn in `currentColor`, with a second copy in the accent color stacked on top of it and clipped to the left 50%. A full star is just a color swap on the shape, from muted to accent; a half star reveals the clipped accent copy. Because the swap is a `transition` on `color`, sweeping the pointer across the row makes the stars fill one after another — the animation is the cascade, not a per-star width tween. Committing retriggers a `transform: scale` pop on the chosen star:

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
| Pop size | Medium | How big the chosen star grows as it pops: 1.15, 1.35 or 1.6 times its size; above about 1.6 it looks rubbery |
| Speed | Normal | How long each star takes to fill with color: slow is 300ms, normal 180ms and fast 110ms; it sets how smoothly the fill follows the pointer |
| Allows half stars | off | Pointing at the left half of a star gives half a point, and the arrow keys move in halves |
| Number of stars | Five | Three, five or ten stars; five is the usual scale |

## Production notes
- **Accessibility**: this demo exposes the row as a single `role="slider"` with `aria-valuemin/max/now` and an `aria-valuetext` ("3 out of 5"), which handles half-steps cleanly from the keyboard. A `role="radiogroup"` of `radio` stars is the other idiomatic choice and maps better to discrete whole-star ratings; pick the model that matches whether half values exist.
- **Keyboard**: arrow keys step by the current increment, Home clears to 0, End jumps to max. The control must be focusable (`tabindex="0"`) and show a visible focus ring — rating with the mouse only is not enough.
- **Don't rely on color alone**: fill is reinforced by the numeric readout below the row so the value survives for colorblind users and greyscale. Never encode the score in hue by itself.
- **Half-star handling**: resolve the half from the pointer's horizontal position inside the hovered star, and keep the committed value and the hover preview separate so leaving the row restores the committed rating rather than a stray hover state.
- **Touch targets**: each star box is at least 44×44px and the control uses Pointer Events, so hover-preview and tap-to-commit both work on touch. There is no CSS `:hover` style, so nothing stays painted after a tap; the preview comes from `pointermove`, and a finger's drag asks `document.elementFromPoint` which star is under it.
- **Library equivalents**: Framer Motion can drive the pop with a `whileTap`/`animate` scale spring; many form kits (e.g. rating inputs in headless UI libraries) ship the radiogroup semantics so you only style the stars.

## See also
- [Heart / Like Burst](../heart-burst/) — a like button that bursts into small hearts
- [Button Press Scale](../button-press-scale/) — a button that shrinks as you press it
- [Toggle / Switch Slide](../toggle-switch/) — another small control that animates its state
