# Curtain Reveal

## What it is
A curtain reveal is a three-stage transition: an opaque bar slides across content to cover it, pauses, then slides off the far side to expose it. Unlike a clip-path reveal, the content is genuinely hidden behind the moving panel and then uncovered, so the eye registers a distinct before/after moment. It is theatrical by design and suits content that warrants the drama.

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

The `101%` (rather than `100%`) guarantees the bar clears the edge completely with no sub-pixel seam.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Curtain speed | 500ms | Time for one pass (enter or exit); the whole reveal is ~2×speed + pause |
| Pause between | 300ms | The beat the bar covers everything — this is what makes the change register |
| Direction | L→R | Horizontal (`ltr`/`rtl`) or vertical (`ttb`/`btt`) travel |
| Two curtains | off | Split mode: two halves enter from opposite sides and part |
| Curtain color | dark | The panel color — high contrast with the content heightens the drama |

## Production notes
- **Overshoot the edge with `101%`.** Ending an exit exactly at `100%` can leave a 1px sliver on fractional-DPI displays; the extra percent is the standard fix.
- **The content behind is never hidden from the DOM** — only visually covered. If the reveal gates *loading*, swap the underlying content during the `pause` stage while the bar hides the switch, so users never see the change happen.
- **Guard against re-entry.** The demo uses a `busy` flag so a second trigger can't start a new sequence mid-animation and desync the timers — important for any multi-stage, timer-driven effect.
- **Reduced motion:** the demo disables the curtain transitions under `prefers-reduced-motion`; consider revealing the content immediately instead of playing the cover/uncover theatre for those users.
- **Library equivalents:** GSAP timelines are the natural fit — `.to(curtain, { x: 0 }).to(curtain, { x: '101%' }, '+=0.3')` chains the stages with a built-in pause; Framer Motion sequences variants via `AnimatePresence`; Motion One's `animate` accepts a keyframe array with `offset` and `delay` to script the three beats.

## See also
- [Clip-Path Reveal](../clip-path-reveal/) — uncover by masking, without an opaque moving bar
- [Slide Up Reveal](../slide-up-reveal/) — a single clipped line rising into view
- [Slide In](../slide-in/) — the plain translate this dramatizes
- [Split Text Reveal](../split-text-reveal/) — staggered per-unit reveals for text
