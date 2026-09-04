# Reveal on Scroll

## What it is
A reveal-on-scroll animation holds an element in a hidden pre-state — faded, offset, scaled, blurred, or clipped — until it crosses a trigger line inside the viewport, then transitions it to its resting state. An `IntersectionObserver` watches each element and fires a single callback the moment it enters, so nothing runs on every scroll frame. This demo collects seven interchangeable reveal techniques behind one observer.

## When to use it
- Progressively disclosing content sections, cards, or media as a long page scrolls
- Drawing the eye to a specific block when it first appears
- Landing pages where each section should feel deliberate rather than pre-rendered
- Any list where a lightweight reveal is preferable to running scroll math in JavaScript

## How it works
Each card carries a `data-fx` attribute naming its technique. CSS defines the hidden state per technique and a shared `.revealed` state; the observer only toggles the class. The trigger position is turned into a negative `rootMargin` on the bottom edge, which pulls the observer's boundary up to match the dashed line:

```js
const margin = -(100 - threshold);          // threshold 70 → -30
observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    const fx = e.target.dataset.fx;
    if (e.isIntersecting) {
      reveal(e.target, fx, i);
      if (!repeatTog.checked) observer.unobserve(e.target);   // fire once
    } else if (repeatTog.checked) {
      hide(e.target, fx, i);                                   // re-arm on exit
    }
  });
}, { root: stage, rootMargin: `9999px 0px ${margin}% 0px`, threshold: 0 });
```

The pre-states live entirely in CSS — for example `[data-fx="blur"]{opacity:0;filter:blur(12px)}` becoming `.revealed[data-fx="blur"]{opacity:1;filter:blur(0)}`. The `stagger` technique is no exception: its child chips cascade on `transition-delay` rules scoped to `.revealed`, so the class alone drives the whole group.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Trigger position | 70% | Where the dashed line sits; higher = element must scroll further before firing |
| `rootMargin` | `9999px 0 -30% 0` | Bottom is derived from the trigger and shrinks the active area; the top is left unbounded so an element already scrolled past still counts |
| `threshold` | 0 | Fires as soon as any pixel crosses; raise to require a fraction of the element visible |
| Repeat on re-enter | off | When off, `unobserve` fires each reveal once; when on, elements re-hide on exit |
| Transition duration | 0.6s | Per-technique CSS timing; the stagger group adds 80ms between children |

## Production notes
- **One observer, many elements**: a single `IntersectionObserver` handling every card is far cheaper than a `scroll` listener recomputing positions. The observer runs off the main thread.
- **Fire-once vs. replay**: calling `unobserve` after the first intersection is the common production choice — it prevents re-animation on scroll-up and releases the element. Keep observing only if you genuinely want a repeating effect.
- **`rootMargin` units**: percentages are relative to the root's size. Negative bottom margin is the standard trick for "trigger when the element is N% up the viewport."
- **Leave the top edge unbounded.** With a `0px` top margin an element that has already scrolled above the trigger reports as *not* intersecting, so a fast flick or a jump to the end of the scroller steps straight over it: it is never reported as entering and stays hidden at `opacity: 0` for good. A large positive top margin makes "at or above the line" always count, and reduces the exit condition to the one you actually mean — dropping back below the line.
- **A trigger marker must not live inside the scroller.** An absolutely positioned child of a scroll container scrolls away with the content, while the observer's trigger stays fixed to the viewport. Put the marker in a non-scrolling wrapper around the container instead — otherwise the guide line drifts the moment you scroll, and the reveals appear to fire at arbitrary places.
- **Let the class drive the cascade, not timers.** Staggering children with `setTimeout` schedules work that can outlive the state that started it: scroll away mid-cascade and the queued callbacks still fire, re-showing children inside an element that has already been hidden. `transition-delay` on `:nth-child` is tied to the class, so leaving the viewport unwinds cleanly. Apply the delays only in the revealed state, or hiding staggers in reverse too.
- **Nothing about a static marker belongs in the scroll handler.** Its position depends on the threshold and the container's height, neither of which changes while scrolling — recompute it on threshold change and resize only.
- **Reduced motion**: the demo disables transitions under `prefers-reduced-motion`, so content still appears — it just skips the movement. Never gate visibility on the animation completing.
- **Library equivalents**: GSAP ScrollTrigger's `toggleActions` and AOS (Animate On Scroll) wrap this exact pattern; Framer Motion's `whileInView` prop is the React equivalent and uses `IntersectionObserver` underneath.

## See also
- [Stagger Reveal](../stagger-reveal/) — cascading the reveal across a group of siblings
- [Scroll Trigger](../scroll-trigger/) — firing discrete actions at scroll positions
- [Fly In / Fly Out Contact List](../fly-in-fly-out-contact-list/) — reveal paired with an exit animation
- [Scrollytelling](../scrollytelling/) — continuous scroll-driven narrative instead of discrete triggers
