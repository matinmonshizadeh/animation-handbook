# Fade In / Fade Out

## What it is

A fade changes an element's opacity between invisible and fully visible: it fades in to appear and fades out to leave. It is the simplest entrance animation and one of the cheapest to run, because the browser only blends a layer it has already drawn. Since nothing moves or changes shape, a fade reads as a neutral appearance rather than a movement.

## When to use it
- Modal, tooltip, and popover appearance where a subtle presence change is enough
- Cross-fading between two states (loading skeleton → loaded content)
- Softening any harder motion — pair a fade with a slide or scale so the element resolves rather than snaps
- Route or view transitions where you want change without a spatial metaphor

## How it works
The card starts at `opacity: 0` and transitions to `1` when an `.in` class is added. The duration and easing are driven by CSS variables so the controls can rewrite them live:

```css
.card {
  opacity: 0;
  transition: opacity var(--dur) var(--ease);
  will-change: opacity;
}
.card.in { opacity: 1; }
```

Toggling the class is all the JS does. To replay cleanly, the demo removes `.in`, forces a reflow with `void card.offsetWidth`, then re-adds it — without that reflow the browser coalesces the remove/add into no change and the transition never fires:

```js
card.classList.remove('in');
void card.offsetWidth;   // flush styles so the next add restarts the transition
card.classList.add('in');
```

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Duration | 600ms | Under 150ms barely registers; over a second feels slow for interface elements |
| Easing | Ease out | Starts fast and settles gently, the natural feel for an entrance |
| Hold time | 0.8s | How long the element stays visible before Auto-loop fades it out again |
| Auto-loop | off | Repeats in, hold and out so you can watch it again |

## Production notes
- **Animate `opacity`, nothing else.** It is compositor-only, so a fade holds 60fps even on low-end mobile. Fading `visibility` or `display` instead does not animate at all — those are discrete properties.
- **`display: none` can't be transitioned.** If an element must leave the layout after fading, listen for `transitionend` (or use `transition-behavior: allow-discrete` with `@starting-style`) before removing it, otherwise it vanishes before the fade completes.
- **Reduced motion:** the demo shortens the fade to a 300ms linear cross-dissolve under `prefers-reduced-motion` rather than killing it — a fade is already gentle, so a faster version stays comfortable.
- **Library equivalents:** GSAP `gsap.to(el, { opacity: 1 })` or the `.fromTo()` form; Framer Motion `animate={{ opacity: 1 }}` with `AnimatePresence` for exit fades; Motion One `animate(el, { opacity: [0, 1] })`.

## See also
- [Slide In](../slide-in/) — add directional travel to the fade
- [Scale In / Zoom In](../scale-in/) — pair a fade with a scale for a physical arrival
- [Blur In](../blur-in/) — fade combined with a focus pull
- [Clip-Path Reveal](../clip-path-reveal/) — reveal without changing opacity at all
