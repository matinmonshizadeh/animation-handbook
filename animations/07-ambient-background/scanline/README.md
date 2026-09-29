# Scanline Effect

## What it is
Scanlines are the thin dark lines between the rows of light on an old tube television or computer monitor. Laying them over a design as a repeating stripe pattern gives it the look of a retro screen from the 80s or 90s. A soft band of light sweeping slowly down the screen adds movement, and darkened corners suggest the curved glass.

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

The demo's Line spacing setting changes this gap (`--line-gap`): `2px` is dense, `4px` is standard CRT density and `8px` is coarser and more stylized.

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
| Line spacing | Medium | The distance between lines: tight is 2px, medium 4px and wide 8px; 4px looks like a standard old screen |
| Line darkness | Medium | How dark the lines are: light is 8%, medium 15% and dark 30%; darker looks more retro but lowers contrast |
| Moving beam | on | A soft band of light sweeps down the screen, again and again |
| Beam speed | Normal | How long the beam takes to cross the screen: slow is 6.4s, normal 4s and fast 2.4s |
| Beam brightness | Medium | How bright the beam is: faint is 6%, medium 12% and bright 24%; it should be felt more than seen |
| Dark corners | off | A soft vignette darkens the corners, like the curved glass of an old screen |
| Glowing text | off | A soft glow around the letters, like light spreading on an old screen |

## Production notes
- **Purely CSS**: no JavaScript required for the scanline or beam effects. Only the demo's settings use JavaScript.
- **`pointer-events: none`**: the scanline overlay must not intercept mouse events. Always add `pointer-events: none` to overlay elements.
- **Performance**: `repeating-linear-gradient` is composited as a texture on first render and cached. It does not repaint on each frame — it's essentially free. The `translateY` beam animation runs on the compositor thread.
- **Phosphor glow**: real CRT phosphors emit light that spreads slightly, creating a soft "halo" around bright text. CSS `text-shadow: 0 0 8px currentColor` approximates this. Keep it subtle — heavy glow degrades legibility.
- **Accessibility**: scanlines reduce contrast. Ensure all text meets WCAG contrast ratios *with* the scanline overlay applied. Test with the overlay at your intended darkness value.
- **Retrowave aesthetic**: combines well with [Grain Overlay](../grain-overlay/) (for texture), [Chromatic Aberration](../../06-3d-advanced/chromatic-aberration/) (for color fringing), and dark neon color palettes.

## See also
- [Grain / Film Noise Overlay](../grain-overlay/) — a flickering texture of fine grain
- [Light Leak](../light-leak/) — warm light washes in, like a film camera flaw
- [Chromatic Aberration](../../06-3d-advanced/chromatic-aberration/) — colors split at the edges, like a broken signal
