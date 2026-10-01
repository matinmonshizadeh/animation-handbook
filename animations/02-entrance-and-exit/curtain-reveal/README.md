# Curtain Reveal

## What it is

A curtain reveal happens in three steps: a solid panel slides across the content to cover it, pauses, then slides off the far side to show it. Unlike a clip-path reveal, the content really is hidden behind the moving panel and then uncovered, so the eye notices a clear before and after. It is theatrical on purpose and suits content that deserves the drama.

## When to use it
- Page and section transitions where a colored panel wipes across between views
- Hero intros that dramatize the first appearance of a headline or logo
- "Split" curtain effects where two halves part to reveal what is behind them
- Portfolio and editorial sites where the transition itself is part of the brand

## How it works
The curtain is an absolutely-positioned bar sitting above the content on `z-index: 2`, moved entirely with `transform: translateX/Y`. It starts off-screen, slides to `translateX(0)` to cover, then to `translateX(101%)` to leave. The three positions are driven by classes:

```css
.curtain[data-axis=h] { inset: 0 auto 0 0; width: 100%; transform: translateX(-101%); }
.curtain[data-axis=h].c-in  { transform: translateX(0); }   /* covers content */
.curtain[data-axis=h].c-out { transform: translateX(101%); } /* exits far side */
```

JavaScript sequences the stages with nested timers — enter, hold for `pause`, then exit — so the reveal happens *while the bar is on screen*:

```js
curtain.classList.add('c-in');                 // stage A: cover
setTimeout(() => {                             // stage B: pause
  setTimeout(() => {                           // stage C: uncover
    curtain.classList.remove('c-in');
    curtain.classList.add('c-out');
  }, pause);
}, dur);
```

Both sides uses two half-width panels that start off opposite edges, meet in the middle and go back. The `101%` (rather than `100%`) guarantees the bar clears the edge completely with no sub-pixel seam.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Comes in from | Left | Which way the panel travels; Both sides sends two panels that meet in the middle, then part |
| Speed | Normal | Time for one pass: slow is 800ms, normal 500ms and fast 300ms; the whole reveal takes about two passes plus the pause |
| Pause while covered | Short | How long the panel covers everything: none, short (300ms) or long (800ms); the pause is what makes the change register |
| Curtain color | Dark | The panel's color; strong contrast with the content makes the reveal more dramatic |

## Production notes
- **Overshoot the edge with `101%`.** Ending an exit exactly at `100%` can leave a 1px sliver on fractional-DPI displays; the extra percent is the standard fix.
- **The content behind is never hidden from the DOM** — only visually covered. If the reveal gates *loading*, swap the underlying content during the `pause` stage while the bar hides the switch, so users never see the change happen.
- **Guard against re-entry.** Each play clears the timers of the one before, so a second trigger can't start a new sequence mid-animation and desync the stages — important for any multi-stage, timer-driven effect.
- **Reduced motion:** a play skips the cover-and-uncover pass entirely under `prefers-reduced-motion` — the content simply stays visible the whole time, so the panel never flashes across it.
- **Library equivalents:** GSAP timelines are the natural fit — `.to(curtain, { x: 0 }).to(curtain, { x: '101%' }, '+=0.3')` chains the stages with a built-in pause; Framer Motion sequences variants via `AnimatePresence`; Motion One's `animate` accepts a keyframe array with `offset` and `delay` to script the three beats.

## See also
- [Clip-Path Reveal](../clip-path-reveal/) — a shape uncovers it, with no panel
- [Slide Up Reveal](../slide-up-reveal/) — text rises from behind an invisible edge
- [Slide In](../slide-in/) — travels into place from one edge
- [Split Text Reveal](../split-text-reveal/) — text appears piece by piece
- [Overlay Wipe](../../03-page-transitions/overlay-wipe/) — a colored panel that hides a whole page change
