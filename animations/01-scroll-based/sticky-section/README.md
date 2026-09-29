# Sticky Section

## What it is
A sticky section holds a whole section still while you scroll, and uses that scrolling to step its content through a sequence instead of moving the page. The section sits inside a tall wrapper, and how far you have scrolled through the wrapper decides which step shows, so scrolling back steps backwards. In the demo, a text column and a picture change together through four steps, then the section scrolls away.

## When to use it
- Multi-step explanations where one frame should stay put while its content advances
- Feature tours that swap illustration and copy without the viewport moving
- Product pages that "hold" a hero while walking through its states
- Any sequence where pinning the frame keeps the reader oriented better than scrolling new sections in

## How it works
The wrapper is four stage-heights tall; the inner section is `position: sticky; top: 0`, so it stays fixed while the wrapper scrolls past. Progress is `(scrollTop − pinStart) / (pinHeight − stageHeight)`, clamped to 0–1. Multiplying by the state count gives the active state index:

```js
const pinStart = wrap.offsetTop, pinH = wrap.offsetHeight;
const p = clamp((st - pinStart) / (pinH - stageH), 0, 1);      // 0..1 while pinned
const si = Math.min(Math.floor(p * 4), 3);                  // state index

states.forEach((s, i) => s.classList.toggle('visible', i === si));
illus.forEach((il, i) => il.classList.toggle('visible', i === si));
```

States crossfade via a CSS `opacity` transition on `.visible`, so the section reads as pinned frames advancing rather than a continuous scrub.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Number of steps | 4 | Each step owns an equal share of the scrolling while the section holds still |
| Wrapper height | Four box heights | The section holds still for three of them; a taller wrapper makes each step last longer |
| Fade between steps | 0.5 s | How long the text takes to fade to the next step; the picture takes 0.6 s |

## Production notes
- **Pins the section, not one element**: this is the key distinction from pin-animation. Here the whole section sticks and its *contents* change; a pin-animation pins one element while siblings scroll past it.
- **Height defines the budget**: the amount of scroll the pin lasts is set entirely by the wrapper's height. Want a longer sequence? Make the wrapper taller — no JS change needed.
- **Sticky beats JS pinning**: `position: sticky` is handled by the browser's compositor and won't jitter the way `position: fixed` toggling in a scroll handler can. Reserve JS for reading progress, not for holding the element.
- **State boundaries are thresholds, not events**: because the state index comes from `floor(p × count)`, crossing a boundary is just the fraction rolling over — no discrete event to miss if a scroll frame is dropped.
- **Reduced motion**: state and illustration transitions are disabled under `prefers-reduced-motion`; the content still switches, it just cuts instead of fades.
- **Library equivalents**: GSAP ScrollTrigger with `pin: true` and a `scrub` timeline is the production-grade version and adds easing across states; Framer Motion pairs a sticky wrapper with `useScroll({ offset })` to derive the same progress value.

## See also
- [Pin Animation](../pin-animation/) — one element holds still while the rest scrolls past
- [Scrub Animation](../scrub-animation/) — scrolling moves a plane along its path, both ways
- [Scrollytelling](../scrollytelling/) — a picture beside the text changes as a story scrolls by
- [Section Wipe](../section-wipe/) — each section slides up over the one before
