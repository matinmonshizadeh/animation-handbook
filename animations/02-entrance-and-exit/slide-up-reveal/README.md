# Slide Up Reveal

## What it is

A slide-up reveal makes a line of text rise into view from behind an invisible edge, as if it is coming up from underneath a surface. The text moves, but everything below the line stays hidden, so only its arrival is visible. It is the classic entrance for headlines and hero copy.

## When to use it
- Hero and headline copy on landing pages and case studies
- Line-by-line reveals where each line rises with a small stagger
- Section titles that animate in as they scroll into view
- Any place a plain fade feels too flat and you want the text to feel *lifted* into place

## How it works
There are two ways to achieve the identical visual, and the Reveal style setting switches between them (Slide is Method A, Wipe is Method B). **Method A** wraps each line in an `overflow: hidden` container and pushes the inner text down by `translateY(110%)`; adding `.in` returns it to `0`. **Method B** leaves the text in place and animates a `clip-path: inset()` from fully clipped at the bottom to fully open — no wrapper needed:

```css
/* Method A — translateY inside a clipping wrapper */
.line-wrap { overflow: hidden; }
[data-method="translatey"] .line { transform: translateY(110%); }
[data-method="translatey"] .line.in { transform: translateY(0); }

/* Method B — clip-path, no wrapper required */
[data-method="clippath"] .line { clip-path: inset(100% 0 0 0); }
[data-method="clippath"] .line.in { clip-path: inset(0% 0 0 0); }
```

Multiple lines stagger through a per-line `--d` index multiplied by a `--stagger` variable in `transition-delay`:

```css
.line { transition-delay: calc(var(--d, 0) * var(--stagger)); }
```

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | Normal | How long each line takes to rise: slow is 1100ms, normal 700ms and fast 400ms |
| Delay between lines | Medium | The wait before each next line starts: short is 30ms, medium 60ms and long 120ms; 40 to 80ms reads as a cascade |
| Reveal style | Slide | Two ways to build it that look almost the same: sliding the text up behind a hidden edge, or wiping it into view in place |
| Feel | Smooth | Smooth slows to a stop; Springy adds a slight settle; Even keeps one steady pace |

## Production notes
- **`translateY(110%)`, not `100%`.** The extra 10% covers descenders (g, y, p) and line-height slack so no sliver of the glyph peeks above the boundary before it moves.
- **Pick the method by tradeoff.** `translateY` inside a wrapper composites slightly cheaper and animates more smoothly, but needs the extra `.line-wrap` element. `clip-path` needs no wrapper and keeps the text as a single selectable block, at a marginally higher paint cost. To users, both look the same.
- **Reduced motion:** the demo strips the transform and clip entirely under `prefers-reduced-motion`, falling back to a plain opacity fade so nothing slides.
- **Library equivalents:** GSAP's SplitText plugin plus a `y: '110%'` tween is the classic production recipe; Framer Motion animates `y` inside a `overflow-hidden` wrapper with `staggerChildren`; Motion One `animate` with a `delay` derived from index.

## See also
- [Split Text Reveal](../split-text-reveal/) — text appears piece by piece, not line by line
- [Curtain Reveal](../curtain-reveal/) — a colored panel covers it, then slides away
- [Clip-Path Reveal](../clip-path-reveal/) — a shape uncovers any element
- [Slide In](../slide-in/) — travels in from any edge, with nothing hiding it
