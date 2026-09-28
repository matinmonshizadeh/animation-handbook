# Split Text Reveal

## What it is

A split-text reveal breaks text into pieces (characters, words or lines) and animates them one after another with a short delay between each. That delay turns a flat fade into a cascade that flows across the text. It is the basis of most animated headline entrances.

## When to use it
- Headline and hero entrances where letters or words ripple into place
- Word-by-word reveals timed to feel like the phrase is being spoken
- Line-by-line reveals for longer copy blocks
- Any type entrance where a single fade feels too uniform and you want directional flow

## How it works
JavaScript splits the text and gives each unit an `--i` index custom property. CSS then multiplies that index by a `--stagger` variable inside `transition-delay`, so unit 0 starts immediately, unit 1 a beat later, and so on — no per-element timers:

```css
.unit {
  display: inline-block;
  opacity: 0;
  transition: opacity var(--dur) var(--ease) calc(var(--i) * var(--stagger)),
              transform var(--dur) var(--ease) calc(var(--i) * var(--stagger));
}
[data-anim="fade-up"] .unit { transform: translateY(0.5em); }
.splitting.in .unit { opacity: 1; transform: none; }
```

The split assigns the index as it builds the spans:

```js
[...text].forEach(c => {
  if (c === ' ') { target.appendChild(document.createTextNode(' ')); return; }
  const s = document.createElement('span');
  s.className = 'unit';
  s.style.setProperty('--i', unitIdx++);   // drives its transition-delay
  s.textContent = c;
  target.appendChild(s);
});
```

Per-unit animation is swappable via `data-anim` (fade-up, fade, scale, rotate); `lines` mode additionally clips each line and slides an inner span up, combining stagger with the slide-up reveal technique.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Split into | Words | Letters give the finest cascade, words a readable rhythm, lines a block reveal |
| How each piece appears | Fade up | The small entrance each piece plays: fade up, fade, grow or flip |
| Delay between pieces | Medium | The wait between pieces: short is 10ms, medium 30ms and long 100ms; small values ripple, large values feel deliberate |
| Speed | Normal | How long each piece takes: slow is 800ms, normal 500ms and fast 300ms |
| Feel | Smooth | The curve each piece uses; Springy adds a small settle, Even keeps one steady pace |
| Your text | Design beyond the obvious | The text that is split and revealed |

## Production notes
- **Total time = units × stagger + duration.** Character mode on a long string multiplies fast — 40 chars × 30ms + 500ms is nearly 1.7s. Cap the stagger or switch to words/lines for longer copy so the tail does not drag.
- **Splitting breaks the text for accessibility.** A screen reader may read char-split text letter by letter, and the split destroys native word wrapping. Add `aria-label` with the full string on the container (and `aria-hidden` on the pieces), and re-run the split on resize since wrapping changes.
- **Preserve spaces deliberately.** The demo inserts real text nodes for spaces in char mode and adds trailing spaces between word spans — without that, `inline-block` units collapse the whitespace and words run together.
- **Reduced motion:** the demo collapses every per-unit transform under `prefers-reduced-motion` to a plain 300ms opacity fade, so the whole phrase appears without the cascade.
- **Library equivalents:** Splitting.js and GSAP's SplitText both do the DOM splitting for you (SplitText also handles the ARIA and re-split-on-resize); Framer Motion uses `staggerChildren` on a parent variant with child `motion.span`s; Motion One's `stagger()` helper generates the per-element delay.

## See also
- [Slide Up Reveal](../slide-up-reveal/) — whole lines rise from behind an invisible edge
- [Letter-by-Letter Stagger](../letter-by-letter-stagger/) — one letter at a time, or typed out
- [Word-by-Word Reveal](../word-by-word-reveal/) — one word at a time, at a reading pace
- [Fade In / Fade Out](../fade-in-out/) — the whole text fades in at once
