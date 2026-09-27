# Slide In

## What it is

A slide-in moves an element from a short distance away into its final place. The motion has a direction (from the top, bottom, left or right), so the element seems to arrive from somewhere. Paired with a fade it feels like a natural entrance; on its own it can feel mechanical.

## When to use it
- Panels, drawers, and sheets that enter from a screen edge
- Toast and notification banners sliding in from a corner
- Staggered list or card entrances where each item slides up a short distance
- Any content where the direction of arrival carries meaning (a nav sliding down from the top)

## How it works
The card holds an offset transform and, optionally, `opacity: 0`. Both the offset and the fade are stored in CSS variables that the direction and distance controls rewrite. Adding `.in` snaps the transform back to `translate(0,0)` and opacity to 1, and the `transition` animates the change:

```css
.card {
  opacity: var(--fade);
  transform: translate(var(--tx), var(--ty));
  transition: transform var(--dur) var(--ease),
              opacity var(--dur) var(--ease);
  will-change: transform, opacity;
}
.card.in { opacity: 1 !important; transform: translate(0, 0) !important; }
```

JavaScript only computes the start offset from the chosen direction and distance:

```js
const tx = dir === 'left' ? -dist : dir === 'right' ? dist : 0;
const ty = dir === 'top'  ? -dist : dir === 'bottom' ? dist : 0;
root.style.setProperty('--tx', tx + 'px');
root.style.setProperty('--ty', ty + 'px');
root.style.setProperty('--fade', withFade ? '0' : '1');
```

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Comes in from | Top | Which edge it travels in from |
| How far it travels | Medium | How far away it starts: short is 50px, medium 200px and far 400px; short distances suit subtle interface motion, long ones feel dramatic |
| Speed | Normal | How long the slide takes: slow is 1000ms, normal 600ms and fast 350ms; longer distances need more time so the speed still feels believable |
| Feel | Smooth | Smooth slows down into place; Springy adds a small overshoot; Gentle eases in and out; Even keeps one steady pace |
| Fades in | on | A slide alone looks mechanical; the fade makes it read as an arrival |

## Production notes
- **Use `transform`, never `top`/`left`/`margin`.** Translating stays on the compositor; animating layout properties forces reflow every frame and drops frames on mobile.
- **Clip the container** with `overflow: hidden` when an element slides in from off-screen, or the pre-animation offset can create a horizontal scrollbar or spill outside the intended bounds.
- **Keep travel short for real UIs.** Marketing hero entrances can travel 100–200px, but interface elements feel snappier sliding only 8–24px — enough to imply direction without a long journey.
- **Reduced motion:** the demo drops the translate under `prefers-reduced-motion` and keeps only a short opacity fade, so the content still appears but does not fly across the screen.
- **Library equivalents:** GSAP `gsap.from(el, { x: 200, autoAlpha: 0 })`; Framer Motion `initial={{ x: 200, opacity: 0 }} animate={{ x: 0, opacity: 1 }}`; Motion One `animate(el, { transform: ['translateX(200px)', 'none'], opacity: [0, 1] })`.

## See also
- [Fade In / Fade Out](../fade-in-out/) — the plain fade, with no travel
- [Slide Up Reveal](../slide-up-reveal/) — text rises from behind an invisible edge
- [Scale In / Zoom In](../scale-in/) — grows into place instead of moving
- [Bounce In](../bounce-in/) — lands with a springy bounce
