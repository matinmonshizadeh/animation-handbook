# Text Fill on Scroll

[Live demo](index.html)

## What it is

A pinned paragraph whose words fill from dim to full color one at a time as the reader scrolls — the reading-highlight effect used on Apple- and Linear-style marketing pages. Scroll progress sweeps an index through the words: everything behind it is lit, everything ahead waits dim. Because the fill is computed from scroll position rather than played, pausing holds the sentence mid-read and scrolling back up un-reads it in perfect reverse.

## When to use it

- Manifesto or mission statements that should be *read at scroll pace*, not skimmed
- Landing-page passages where each claim should land before the next appears
- Long-form intros that need a moment of focus before the content starts
- Anywhere a block of copy is the hero and deserves the reader's cadence

## How it works

The paragraph is split into one `<span>` per word at build time. Each frame maps scroll progress to a word index; a word is lit when its index is behind that point:

```js
const p      = clamp(stage.scrollTop / maxScroll, 0, 1);
const filled = Math.floor((p / COMPLETE_AT) * wordCount);
```

The important part is what *doesn't* happen: the frame handler never rewrites every span. It remembers the last filled count and touches only the words between the old and new positions:

```js
const lo = Math.min(filled, lastFilled), hi = Math.max(filled, lastFilled);
for (let i = lo; i < hi; i++) words[i].classList.toggle('on', i < filled);
lastFilled = filled;
```

On a normal scroll step that is one or two class toggles instead of eighty, and an idle frame costs nothing. A short CSS `color` transition on each word softens the flip without fighting the per-frame logic, since the class — not the color — is what changes per frame.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Fill completes at | 90% | Portion of the scroll budget the fill is spread across; finishing early leaves a beat of read-through before the section ends |
| Dim color | `rgba(244,244,242,.16)` | The unread state. Too faint and the text is invisible before reveal; too strong and the fill has no drama |
| Highlight | accent | Color of the currently-active word — the "cursor" that shows where the reader is |
| Word transition | 180ms | The soften on each word's flip; the sweep itself has no duration |

## Production notes

- **Guard the writes.** The naive version loops all spans every scroll event and re-sets each one's class. With guarded writes only the delta is touched, which is what keeps this cheap at any paragraph length.
- **`background-clip: text` is the one-element alternative.** A gradient background with `background-clip:text` and a scroll-driven `background-position` fills text with zero spans and sub-word smoothness. The tradeoffs: no per-word hooks (no cursor highlight, no word callbacks), and gradient positioning across wrapped lines is fiddly. Choose spans when you need word-level control, clip when you need silk.
- **Keep the dim state readable.** The unread text still has to be perceivable — a dim value near-invisible against the background means the reader faces a blank panel and no cue that content exists. Keep some contrast in the unread state; the demo's default is deliberately legible.
- **Text stays real.** Splitting into spans keeps the copy selectable, findable, and visible to assistive tech — never rasterize or duplicate the text for this effect. Screen readers ignore the color sweep entirely, which is the correct behavior.
- **Granularity.** Per-letter splitting looks smoother but multiplies DOM nodes and write counts by ~6; per-word is the sweet spot for paragraphs. GSAP's SplitText and the `Intl.Segmenter` API both handle locale-correct splitting in production.
- **Cache layout reads.** `scrollHeight`/`clientHeight` are measured once and on resize — never inside the scroll handler, where they force a reflow per event.

## See also

- [Reveal on Scroll](../reveal-on-scroll/) — discrete enter/leave reveals; this entry is the continuous version for a single passage.
- [Scrub Animation](../scrub-animation/) — the same position-not-playback model driving a drawn path.
- [Kinetic Typography](../../05-text-typography/kinetic-typography/) — time-based type motion, for contrast with scroll-driven.
