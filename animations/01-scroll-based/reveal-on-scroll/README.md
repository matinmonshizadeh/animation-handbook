# Reveal on Scroll

## What it is
A reveal on scroll keeps an element hidden, such as faded, shifted, shrunk, blurred or clipped, until it rises past a line in the view, then lets it settle into place. The browser reports when each element crosses the line, so nothing has to run on every scroll. The demo shows seven reveal styles behind one dashed line.

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
    const card = e.target.closest('.card');
    if (e.isIntersecting) {
      reveal(card);
      if (!repeatTog.checked) observer.unobserve(e.target);   // fire once
    } else if (repeatTog.checked) {
      hide(card);                                              // re-arm on exit
    }
  });
}, { root: scroller, rootMargin: `9999px 0px ${margin}% 0px`, threshold: 0 });
```

The pre-states live entirely in CSS — for example `[data-fx="blur"]{opacity:0;filter:blur(12px)}` becoming `.revealed[data-fx="blur"]{opacity:1;filter:blur(0)}`. The `stagger` technique is no exception: its child chips cascade on `transition-delay` rules scoped to `.revealed`, so the class alone drives the whole group. The observer watches each card itself, except the stagger group, which it watches at its row of chips: the chips sit lower in the card, so watching the card's top would start the cascade below the box on the lower lines.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Trigger line | Normal | Where the dashed line sits: higher is halfway down the box, normal 70% down and lower 90% down; the higher the line, the further a card must scroll before it appears |
| Plays every time | off | Off, each card appears once and stays; on, it hides again when it drops back below the line and replays the next time |

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
- [Stagger Reveal](../stagger-reveal/) — items in a group appear one after another
- [ScrollTrigger Animation](../scroll-trigger/) — animations start, follow and pin at set scroll points
- [Fly-in Fly-out Contact List](../fly-in-fly-out-contact-list/) — rows fade and slide as they near the edges
- [Scrollytelling](../scrollytelling/) — a picture beside the story changes as you read
