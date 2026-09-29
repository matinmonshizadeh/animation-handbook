# Aurora / Northern Lights

## What it is
An aurora background imitates the northern lights with a few tall bands of color that sway slowly across a night sky. Each band fades away at the top and bottom and is softly blurred, and each one drifts sideways and leans a little on its own cycle, so the curtains of light never move together. The browser draws it all with no script.

## When to use it
- Hero sections on apps with a Nordic, atmospheric, or space theme
- Nature and travel brand backgrounds
- Dark-theme product pages where the header needs a distinctive ambient identity
- Music apps, ambient sound apps, or meditation tools where the visual atmosphere is part of the product

## How it works
Each aurora band is an element spanning the full stage width, positioned near the top half of the screen, with a tall linear gradient that fades from transparent at top and bottom through a peak opacity in the middle. A `filter: blur()` softens the hard gradient edges. CSS keyframes animate each band on a unique combination of `translateX`, `skewY`, and `scaleX`:

```css
.band {
  position: absolute;
  left: -30%; right: -30%;  /* wider than stage for drift headroom */
  filter: blur(35px);
  opacity: 0.75;
}

.band-green {
  top: 5%; height: 45%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 220, 100, 0.5) 35%,
    rgba(0, 180, 80,  0.6) 55%,
    rgba(0, 100, 50,  0.2) 80%,
    transparent 100%
  );
  animation: aurora-drift 30s ease-in-out infinite;
}

@keyframes aurora-drift {
  0%   { transform: translateX(-8%) skewY(-1deg) scaleX(1);    }
  33%  { transform: translateX( 5%) skewY( 1.5deg) scaleX(1.1); }
  66%  { transform: translateX(-3%) skewY(-0.5deg) scaleX(0.95);}
  100% { transform: translateX(-8%) skewY(-1deg) scaleX(1);    }
}
```

On phones the demo halves the blur, `@media (max-width: 600px) { .band { filter: blur(18px); } }`, which keeps the bands as soft on the smaller stage.

**Real aurora color chemistry**:
- Green — oxygen atoms at ~100km altitude (most common)
- Blue/purple — nitrogen molecules at lower altitudes
- Red — oxygen atoms above 200km (rare, only in powerful solar storms)
- Pink — a mix of red oxygen at top and green oxygen below

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Number of bands | 2 | How many bands of light: two look clear, five make a richer, layered sky |
| Speed | Normal | How long each band takes to sway through its cycle: slow is 48s, normal 30s and fast 18s |
| Colors | Green | Which colors come first: green and blue (the most common aurora), purple and pink, or red and pink (rare); more bands add the other colors |
| Brightness | Medium | How strongly the bands glow: dim is 50%, medium 75% and bright 100% |
| Stars in the sky | off | Adds 120 twinkling stars behind the bands |

## Production notes
- **No WebGL needed**: CSS keyframes are sufficient for this effect at desktop resolutions. For smooth animation on mobile, reduce blur and band count.
- **`overflow: hidden` is mandatory**: bands extend 30% beyond each edge (for drift headroom). Without overflow clipping, they're visible outside the stage.
- **`animation-delay` offsets**: give each band a unique negative delay so they start at different phases. Without this, all bands drift together, which looks mechanical.
- **Star layer pairing**: adding a star background behind the aurora dramatically increases realism — the aurora appears to float in front of the night sky. See the demo's Stars in the sky switch.
- **Performance**: each blurred element creates a GPU compositing layer. 5 blurred bands + a star canvas is the practical limit on mid-range mobile.
- **Three.js approach**: for fully custom aurora with 3D depth and noise-driven shapes, render a plane mesh with a custom GLSL shader that samples 3D noise for the waveform and color distribution.

## See also
- [Mesh Gradient Animation](../mesh-gradient/) — round blobs of color instead of tall bands
- [Starfield / Space Particles](../starfield/) — stars stream toward you out of the dark
- [Animated Gradient Background](../animated-gradient-background/) — one gradient that slowly shifts
