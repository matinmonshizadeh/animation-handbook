# Matrix Rain

## What it is
Matrix rain, also called digital rain, is a background of columns of characters falling down a dark screen. The leading character in each column is bright and the ones behind it fade toward black, so each column looks like a glowing head with a fading tail. It became shorthand for "computers at work" after the film The Matrix (1999).

## When to use it
- Terminal, hacker, or "system online" themed landing pages and hero sections
- Loading and boot screens for retro-futuristic or cyberpunk interfaces
- Decorative backdrops behind login panels, 404 pages, or event countdowns
- Music visualizers and demo-scene style ambient loops

## How it works
Each column tracks a single vertical position (its "drop"). Every step, the column draws a fresh bright character at its head, then advances one row. The trail is not stored — it is produced by painting a translucent black rectangle over the entire canvas each step, which darkens every previously drawn glyph a little more until it disappears:

```js
// Fade the whole canvas slightly instead of clearing it.
ctx.fillStyle = 'rgba(0,0,0,' + FADE + ')';   // FADE ~0.07
ctx.fillRect(0, 0, W, H);

const pitch = W / cols;
for (let i = 0; i < cols; i++) {
  const x = i * pitch, y = drops[i] * fontSize;
  ctx.fillStyle = '#d8ffe6';                    // bright leader
  ctx.fillText(pick(), x, y);
  if (y > H && Math.random() > 0.975) drops[i] = Math.floor(Math.random() * -20);  // back above the top, at random
  drops[i]++;                                   // fall one row
}
```

Because the canvas is never fully cleared, the length of the tail is entirely controlled by the fade opacity: a smaller value leaves glyphs on screen longer (a long tail), a larger value wipes them quickly (a short tail). Columns reset to the top at random once they pass the bottom, so the rain never falls in lockstep.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | Normal | How often the rain moves down a row: slow is about 18 times a second, normal 28 and fast about 46 |
| Characters | Japanese | Japanese katakana (the film's look), binary 0 and 1, or hexadecimal 0 to F |
| Trail length | Medium | How long characters linger: short fades 12% a step, medium 7% and long 4% |
| Character size | Medium | Small is 12px, medium 16px and large 22px; larger characters make fewer columns |
| Glowing leaders | on | A soft glow around each column's leading character |

## Production notes
- **`fillRect` fade vs `clearRect`**: clearing the canvas each frame gives no trail — you would have to store and redraw every past glyph yourself. Painting a translucent `fillRect` is both the trail mechanism and cheaper, since it is one composited rectangle instead of hundreds of retained cells.
- **Cap density on mobile**: column count is derived from a minimum pixel pitch, not an unbounded `width / fontSize`. Combined with clamping `devicePixelRatio` to 2, this keeps the per-frame `fillText` count bounded so the effect holds 60fps on mid-range phones. Heavy `shadowBlur` is the most expensive part — it is applied only to the single leader glyph, never the trail.
- **Pause on hidden tab**: the `requestAnimationFrame` loop is cancelled on `visibilitychange` when `document.hidden` is true and restarted when the tab returns, so a background tab burns no CPU or battery.
- **Reduced motion**: the demo starts paused, showing a screen of rain drawn at once, until the visitor presses Play. In production, show these visitors a still frame.
- **It is decorative**: real usage should sit behind content with `aria-hidden="true"`, `pointer-events: none`, and enough contrast on the foreground text that the rain does not reduce readability. Treat it as texture, not information.

## See also
- [Starfield / Space Particles](../starfield/) — another canvas background of moving points
- [Scanline Effect](../scanline/) — dark lines for the same old-terminal mood
- [Synthwave Grid](../synthwave-grid/) — a neon grid for a retro-future backdrop
- [ASCII / Halftone](../../06-3d-advanced/ascii-halftone/) — a moving picture redrawn with characters, for the same retro look
- [Game of Life](../game-of-life/) — a grid of cells that live and die by simple rules
