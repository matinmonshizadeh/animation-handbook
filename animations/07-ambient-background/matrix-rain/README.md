# Matrix Rain

## What it is
Matrix rain — also called "digital rain" — is an ambient background of vertical columns of characters falling down a dark surface. The leading glyph in each column is bright, and the characters behind it fade toward black, giving the impression of a glowing head trailing a tail. It became a cultural shorthand for "computers doing something" after appearing in *The Matrix* (1999), and is drawn on a `<canvas>` because the per-frame character churn is too heavy for the DOM.

## When to use it
- Terminal, hacker, or "system online" themed landing pages and hero sections
- Loading and boot screens for retro-futuristic or cyberpunk interfaces
- Decorative backdrops behind login panels, 404 pages, or event countdowns
- Music visualizers and demo-scene style ambient loops

## How it works
Each column tracks a single vertical position (its "drop"). Every step, the column draws a fresh bright character at its head, then advances one row. The trail is not stored — it is produced by painting a translucent black rectangle over the entire canvas each frame, which darkens every previously drawn glyph a little more until it disappears:

```js
// Fade the whole canvas slightly instead of clearing it.
ctx.fillStyle = 'rgba(0,0,0,' + FADE + ')';   // FADE ~0.07
ctx.fillRect(0, 0, W, H);

const pitch = W / cols;
for (let i = 0; i < cols; i++) {
  const x = i * pitch, y = drops[i] * fontSize;
  ctx.fillStyle = '#d8ffe6';                    // bright leader
  ctx.fillText(pick(), x, y);
  if (y > H && Math.random() > 0.975) drops[i] = 0;  // recycle randomly
  drops[i]++;                                   // fall one row
}
```

Because the canvas is never fully cleared, the length of the tail is entirely controlled by the fade opacity: a smaller value leaves glyphs on screen longer (a long tail), a larger value wipes them quickly (a short tail). Columns reset to the top at random once they pass the bottom, so the rain never falls in lockstep.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | 8 | Steps per second scalar. Low = slow drizzle; high = dense downpour |
| Font size | 16px | Glyph size; also sets column width, so larger = fewer columns |
| Trail fade | 0.07 | Per-frame black opacity. 0.02 = long ghostly tails; 0.20 = short crisp heads |
| Character set | Katakana | Katakana (classic), Binary (0/1), or Hex (0–F) |
| Leader glow | on | `shadowBlur` halo on the head glyph for a phosphor bloom |

## Production notes
- **`fillRect` fade vs `clearRect`**: clearing the canvas each frame gives no trail — you would have to store and redraw every past glyph yourself. Painting a translucent `fillRect` is both the trail mechanism and cheaper, since it is one composited rectangle instead of hundreds of retained cells.
- **Cap density on mobile**: column count is derived from a minimum pixel pitch, not an unbounded `width / fontSize`. Combined with clamping `devicePixelRatio` to 2, this keeps the per-frame `fillText` count bounded so the effect holds 60fps on mid-range phones. Heavy `shadowBlur` is the most expensive part — it is applied only to the single leader glyph, never the trail.
- **Pause on hidden tab**: the `requestAnimationFrame` loop is cancelled on `visibilitychange` when `document.hidden` is true and restarted when the tab returns, so a background tab burns no CPU or battery.
- **Reduced motion**: under `prefers-reduced-motion: reduce` the animation loop never starts — a single static frame is rendered once so the effect is still legible without any movement.
- **It is decorative**: real usage should sit behind content with `aria-hidden="true"`, `pointer-events: none`, and enough contrast on the foreground text that the rain does not reduce readability. Treat it as texture, not information.

## See also
- [Starfield](../starfield/) — canvas particle field with parallax depth
- [Scanline](../scanline/) — CRT line overlay for the same retro-terminal mood
- [Synthwave Grid](../synthwave-grid/) — perspective neon grid for cyberpunk backdrops
