# Aurora / Northern Lights

## What it is
Aurora borealis is rendered in the browser as a set of tall, vertically-oriented color bands that drift horizontally and deform slightly as they move, simulating the curtain-like waviness of real auroras. The effect uses overlapping, heavily-blurred gradient divs whose positions are animated with CSS keyframes that include translation, skewing, and scaling — the combination produces the characteristic shimmer. No WebGL is required; pure CSS creates a convincing atmospheric illusion.

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

**Real aurora color chemistry**:
- Green — oxygen atoms at ~100km altitude (most common)
- Blue/purple — nitrogen molecules at lower altitudes
- Red — oxygen atoms above 200km (rare, only in powerful solar storms)
- Pink — a mix of red oxygen at top and green oxygen below

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Band count | 2–3 | 2 creates clarity; 5 creates a richer, more layered sky |
| Blur amount | 35px | Lower = crisper band edges; higher = more diffuse wash |
| Cycle duration | 30s | The ambient mindset: long cycle, imperceptible reset |
| `skewY` range | ±1.5° | The subtle skew is what gives the "waving curtain" character |

## Production notes
- **No WebGL needed**: CSS keyframes are sufficient for this effect at desktop resolutions. For smooth animation on mobile, reduce blur and band count.
- **`overflow: hidden` is mandatory**: bands extend 30% beyond each edge (for drift headroom). Without overflow clipping, they're visible outside the stage.
- **`animation-delay` offsets**: give each band a unique negative delay so they start at different phases. Without this, all bands drift together, which looks mechanical.
- **Star layer pairing**: adding a star background behind the aurora dramatically increases realism — the aurora appears to float in front of the night sky. See the demo's star toggle.
- **Performance**: each blurred element creates a GPU compositing layer. 5 blurred bands + a star canvas is the practical limit on mid-range mobile.
- **Three.js approach**: for fully custom aurora with 3D depth and noise-driven shapes, render a plane mesh with a custom GLSL shader that samples 3D noise for the waveform and color distribution.

## See also
- [Mesh Gradient](../mesh-gradient/) — similar blurred-layer approach, radial rather than vertical
- [Starfield](../starfield/) — the star background that pairs naturally with aurora
- [Animated Gradient Background](../animated-gradient-background/) — simpler single-gradient approach
