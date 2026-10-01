# Neon Flicker

## What it is
Neon flicker makes a word look like a glowing neon sign whose light sometimes stutters. The letters shine steadily most of the time, then drop out and come back in short, uneven bursts, the way a worn tube or a loose wire behaves, and one letter can buzz on its own like a tube that is about to fail.

## When to use it
- Signs and logos for bars, diners, clubs and late-night shops
- Night, city and retro themes where a sign on a dark wall sets the mood
- Music, gaming and event pages that want a little life in a title
- A "we're open" or "live now" badge that should catch the eye now and then

## How it works
The sign is two copies of the same letters stacked in one grid cell. The bottom copy is the unlit glass, in a dull tint of the color. The top copy is the light: a pale core with a glow made of a few `text-shadow` layers, and a wash of color on the wall drawn by its `::before`. The glow is drawn once and never changes; the flicker animates only the top copy's `opacity`, so the browser can blend the finished layer instead of painting the glow again on every frame:

```html
<div class="sign" role="img" aria-label="OPEN">
  <div class="layer glass" aria-hidden="true"><span class="word">…</span></div>
  <div class="layer lit" aria-hidden="true"><span class="word">…</span></div>
</div>
```

```css
.layer{grid-area:1/1}
.lit{
  color:color-mix(in srgb,var(--neon) 30%,#fff);
  text-shadow:0 0 .02em #fff,0 0 .08em var(--neon),0 0 .2em var(--neon),0 0 .42em var(--neon);
  will-change:opacity;
  animation:flick-normal 7s step-end infinite;
}
@keyframes flick-normal{
  0%{opacity:1} 1%{opacity:.25} 2%{opacity:1} 3%{opacity:.08} 4.5%{opacity:1}
  33%{opacity:.3} 34%{opacity:1}
  57%{opacity:.1} 58.5%{opacity:.85} 59.5%{opacity:.15} 61%{opacity:1}
  80%{opacity:.4} 81%{opacity:1}
}
```

`step-end` holds each value until the next keyframe, so the light snaps off and on instead of fading, and the bursts sit at uneven points of the cycle so the rhythm does not feel regular. Each letter is its own span in both copies; the broken letter runs a second keyframe set, `buzz`, on a 4.3 second cycle. Because 4.3 and 7 seconds do not divide into each other, the letter and the sign drift against each other and the pattern takes a long time to repeat. How often it flickers swaps in another keyframe set, which starts with a short flicker, so the change shows at once.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Color | Pink | The color of the tubes, their glow and the wash on the wall |
| How often it flickers | Normal | Calm: two short bursts in a 9 second cycle. Normal: four bursts in 7 seconds. Busy: seven bursts in 6 seconds, one of them a longer drop out |
| Broken letter | on | One letter a little past the middle of the word buzzes and drops out on its own cycle |
| Glow size | Medium | How far the light spreads: small, medium or large sets of glow layers |
| Frame around the word | on | Adds a rounded tube border that glows and flickers with the letters |
| Your text | OPEN | The word on the sign, up to 10 letters, with spaces at its ends dropped; it shrinks to fit the stage, and an emptied field goes back to OPEN |

## Production notes
- **Flash safety**: flicker is flashing. Keep the whole sign below three flashes in any second (the demo's busiest setting stays there) and keep large bright areas out of it; a single buzzing letter is small enough to flicker faster. Never flicker a full-screen background.
- **Never animate the shadow**: a large `text-shadow` or `box-shadow` is expensive to paint, and animating its blur or color repaints it on every frame. Draw the glow once and flicker the layer's `opacity`, with `will-change: opacity` so it gets its own layer.
- **Reduced motion**: the demo starts paused on a steady glow, and pressing Play only dims the sign softly, with no flashes. In production, show these visitors the steady glow.
- **Accessibility**: the sign is one image to screen readers (`role="img"` with an `aria-label` of the word), and both letter copies are `aria-hidden`, so the word is read once. The lit letters are near white, so they stay readable on the dark wall.
- **Library equivalents**: with GSAP, a timeline of short `opacity` tweens with `repeatRefresh: true` and `gsap.utils.random()` delays makes every burst different. The Web Animations API can do the same with `element.animate()` and a random `delay` for each burst; Framer Motion's `animate` with a `times` array matches the keyframe approach here.

## See also
- [Glitch Text](../glitch-text/) — text tears into red and cyan strips like a broken signal
- [Text Gradient Animation](../text-gradient-animation/) — colors flow through still letters
- [Breathing / Pulsing Glow](../../07-ambient-background/breathing-glow/) — a soft glow that slowly grows and shrinks
- [Light Leak](../../07-ambient-background/light-leak/) — warm light that washes in at random times
