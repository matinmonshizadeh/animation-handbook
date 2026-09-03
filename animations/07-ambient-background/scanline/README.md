# Scanline Effect

## What it is
Scanlines are the horizontal dark lines produced by CRT (cathode-ray tube) monitors, where the electron beam sweeps left-to-right line by line, leaving a visible gap between each row of phosphor. In digital design, scanlines are added intentionally as a CSS repeating gradient pattern to evoke retrowave, '80s synthwave, or '90s sci-fi UI aesthetics. A moving sweep beam that brightens as it passes adds a dynamic cinematic quality.

## When to use it
- Retrowave, cyberpunk, or synthwave themed UIs
- Gaming HUD overlays and retro arcade aesthetics
- "Terminal" or "command line" styled interfaces
- Music visualizers and media player interfaces with an analog vintage feel

## How it works
**Static scanlines** — a CSS `repeating-linear-gradient` creates the line pattern without any JavaScript:

```css
.scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    transparent       0px,
    transparent       3px,           /* visible row height */
    rgba(0,0,0,0.15)  3px,           /* dark line */
    rgba(0,0,0,0.15)  4px            /* line-gap = 4px total */
  );
}
```

The `line-gap` CSS custom property in the demo allows the density to be adjusted: `4px` is standard CRT density; `8px` is coarser and more stylized.

**Moving sweep beam** — a tall gradient strip animated with `translateY`:

```css
.beam {
  position: absolute;
  left: 0; right: 0;
  top: -120px;                  /* starts above the visible area */
  height: calc(100% + 120px);   /* 120px taller than the stage */
  background: linear-gradient(
    to bottom,
    transparent                      0%,
    rgba(255, 255, 255, 0.08)       50%,
    transparent                     100%
  );
  background-size: 100% 120px;  /* the band sits at the element's top edge */
  background-repeat: no-repeat;
  animation: sweep 4s linear infinite;
}

@keyframes sweep {
  from { transform: translateY(0); }
  to   { transform: translateY(100%); }   /* 100% = stage height + 120px */
}
```

Animating `transform` rather than `top` keeps the sweep on the compositor —
the oversized element exists purely so a percentage translate covers the full
travel without JavaScript measuring the stage.

**CRT curvature** — a radial vignette overlay darkens the corners, simulating the slight convex curvature of a CRT screen:

```css
.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%);
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Line gap | 4px | 2px = dense vintage CRT; 4px = standard; 8px = stylized/coarse |
| Line darkness | 0.15 | 0.05 = barely visible; 0.25 = strong retro; 0.5 = overpowering |
| Beam speed | 4s | Faster = action/alert; slower = cinematic sci-fi |
| Beam brightness | 0.08–0.12 | Keep it subtle — the beam should be felt, not seen clearly |

## Production notes
- **Purely CSS**: no JavaScript required for the scanline or beam effects. Only the panel controls use JS.
- **`pointer-events: none`**: the scanline overlay must not intercept mouse events. Always add `pointer-events: none` to overlay elements.
- **Performance**: `repeating-linear-gradient` is composited as a texture on first render and cached. It does not repaint on each frame — it's essentially free. The `translateY` beam animation runs on the compositor thread.
- **Phosphor glow**: real CRT phosphors emit light that spreads slightly, creating a soft "halo" around bright text. CSS `text-shadow: 0 0 8px currentColor` approximates this. Keep it subtle — heavy glow degrades legibility.
- **Accessibility**: scanlines reduce contrast. Ensure all text meets WCAG contrast ratios *with* the scanline overlay applied. Test with the overlay at your intended darkness value.
- **Retrowave aesthetic**: combines well with [Grain Overlay](../grain-overlay/) (for texture), [Chromatic Aberration](../../06-3d-advanced/chromatic-aberration/) (for color fringing), and dark neon color palettes.

## See also
- [Grain Overlay](../grain-overlay/) — texture overlay for analog warmth
- [Light Leak](../light-leak/) — warm analog overlay for a film camera aesthetic
- [Chromatic Aberration](../../06-3d-advanced/chromatic-aberration/) — RGB channel split for glitch/retro look
