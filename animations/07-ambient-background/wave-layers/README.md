# Wave Layers

## What it is
Wave layers stack a few strips of water, one in front of the other, each with a wavy top edge. Every strip slides sideways on its own endless loop, and the near strips sit lower, move faster and have bigger waves than the far ones, so a handful of flat shapes reads as deep water. The browser moves it all with no script.

## When to use it
- The bottom edge of a hero section, where the waves lead into the page below
- Footers and section dividers on travel, beach, sailing and outdoor sites
- Calm intros for wellness, meditation or holiday pages
- Empty or waiting states that need a quiet sign of life

## How it works
Each layer holds a track twice as wide as the stage. The top of the track is an SVG wave and a plain block of the same color fills the rest. One path serves every layer: it draws ten whole waves, and each layer's `viewBox` shows only the first ten, eight, six or four of them, stretched across its track by `preserveAspectRatio="none"`. Far layers therefore get small, close waves and near layers long ones.

```html
<svg class="defs"><defs><path id="wv" d="M0 0C18 0 32 40 50 40S82 0 100 0 … S982 0 1000 0V40H0Z"/></defs></svg>

<div class="wave w1"><div class="track">
  <svg viewBox="0 0 1000 40" preserveAspectRatio="none"><use href="#wv"/></svg><i></i>
</div></div>
<!-- w2, w3 and w4 show 800, 600 and 400 units of the same path -->
```

Every track holds an even number of waves, so after sliding left by half its width it looks exactly as it did at the start, and the jump back to the start cannot be seen. The stage is a size container (`container-type: size`), so heights are written in `cqh`, hundredths of the stage's height. Each layer has its own height on the stage (`--y`), wave size (`--k`), cycle (`--s`) and head start (`--o`); the cycles and head starts are shares of one `--dur`:

```css
.track { width: 200%; animation: drift calc(var(--dur) * var(--s)) linear calc(var(--dur) * var(--s) * var(--o)) infinite; }
.track svg { width: 100%; height: calc(var(--amp) * var(--k)); fill: var(--fill); }
.wave { top: calc(var(--y) - var(--amp) * var(--k) / 2); bottom: -12cqh;
        animation: bob calc(var(--dur) * var(--s) / 4) ease-in-out calc(var(--dur) * var(--s) * var(--o)) infinite alternate; }
.w1 { --y: 42%; --k: .5; --s: 1.7; --o: -.15; }   /* far: high, small waves, slow */
.w4 { --y: 80%; --k: 1;  --s: .9;  --o: -.8;  }   /* near: low, big waves, fast */
@keyframes drift { to { transform: translateX(-50%); } }
@keyframes bob { from { transform: translateY(-1.2cqh); } to { transform: translateY(1.2cqh); } }
```

A new speed changes `--dur`, which would make every layer jump to another point of its cycle. Scaling each animation's time by the same factor first keeps every wave where it is, moving or paused:

```js
stage.getAnimations({ subtree: true }).forEach(a => { if (a.currentTime != null) a.currentTime = a.currentTime * next / secs; });
stage.style.setProperty('--dur', next + 's');
```

The palettes keep one rule: the sky glows lightest at the horizon and every layer is darker than that glow, the near ones darkest, so each layer stands out against the one behind it and against the sky, however many are shown.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | Normal | The base cycle: slow is 40 seconds, normal 24 and fast 14; the layers take 1.7, 1.35, 1.1 and 0.9 times that, far to near, to slide one stage width |
| Colors | Ocean | Ocean blues, Sunset pinks and purples under an orange glow, or Night indigo; far layers are the palest, near ones the darkest |
| Wave height | Medium | How tall the nearest waves are: low is 6%, medium 11% and high 17% of the stage's height; the farther layers get a half to four fifths of that |
| Number of layers | 4 | Two, three or four layers; with fewer, the far layers go first and the near waves always stay |

## Production notes
- **Only transforms move**: the tracks slide with `translateX` and the layers bob with `translateY`, which the browser hands to the compositor, so nothing is repainted while it runs, even on phones. Animating the path's shape or a `background-position` would repaint every frame.
- **Seams**: the block under each wave starts one pixel higher (`margin-top: -1px`), so no hairline shows between it and the SVG at any zoom level.
- **Mask variant**: the same strips can be single elements with a solid background and a repeated wave `mask-image`; the mask then sets the wave length (`mask-size`) without any SVG markup.
- **Reduced motion**: the demo holds the waves still where they are. In your own page, a `prefers-reduced-motion: reduce` rule that sets `animation: none` on the tracks does the same.
- **Libraries**: GSAP can loop each track with `gsap.to(track, { xPercent: -50, duration, ease: 'none', repeat: -1 })`, and Framer Motion with `animate={{ x: '-50%' }}` and `transition={{ repeat: Infinity, ease: 'linear', duration }}`; both only replace the keyframes.

## See also
- [Aurora / Northern Lights](../aurora/) — soft bands of light that sway instead of slide
- [Parallax Scrolling](../../01-scroll-based/parallax-scrolling/) — the same near-fast, far-slow rule, driven by scroll
- [Marquee / Ticker](../../05-text-typography/marquee-ticker/) — the same seamless half-width loop, with text
