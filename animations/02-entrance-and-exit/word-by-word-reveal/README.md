# Word-by-Word Reveal

## What it is
A word-by-word reveal animates each word of a passage in sequence rather than all together or letter-by-letter. Words are the natural unit of reading, so a stagger of roughly 80–120ms per word tracks how the eye moves through a sentence — slow enough to feel intentional, fast enough not to make the reader wait.

## When to use it
- Multi-line body copy, quotes, and paragraph intros where per-letter would be too busy
- Sequential storytelling where you want each phrase to land before the next
- Subtitle or caption reveals timed to a voiceover
- Sectioned reveals where sentence pauses separate distinct thoughts

## How it works
The text is split on whitespace into `<span class="word">` elements, each carrying an `--i` index. The CSS derives a `transition-delay` from `--i × --stagger`, and adding the `.in` class on the container drops every word to its resting state at once — the delays fan the motion out:

```js
words.forEach((w,wi)=>{
  const s=document.createElement('span');s.className='word';
  const delay=punctTog.checked?idx*stagger+si*200:idx*stagger;
  s.style.setProperty('--i',delay/stagger);
  s.textContent=w;target.appendChild(s);
  if(wi<words.length-1)target.appendChild(document.createTextNode(' '));
  idx++;
});
```

```css
.word{display:inline-block;margin-right:0.28em;opacity:0;
  transition:opacity var(--dur) var(--ease) calc(var(--i)*var(--stagger)),
             transform var(--dur) var(--ease) calc(var(--i)*var(--stagger))}
[data-anim="fade-up"] .word{transform:translateY(0.4em)}
.splitting.in .word{opacity:1;transform:none;filter:none}
```

The "sentence pauses" option adds `si × 200ms` to the delay for each sentence, inserting a beat between lines. Because the index is stored as `delay/stagger`, the CSS math stays a single `calc()` regardless of whether pauses are on.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Per-word delay (`--stagger`) | 80ms | The reading-speed knob; below ~40ms the stagger blurs into one reveal |
| Duration per word (`--dur`) | 450ms | Settle time for each individual word |
| Easing (`--ease`) | Smooth `cubic-bezier(.2,.7,.3,1)` | Springy overshoot adds bounce; linear feels mechanical |
| Sentence pause | off (+200ms) | Extra delay injected between sentences for paragraph reveals |

## Production notes
- **Whitespace preservation**: keeping a real text node (a literal space) between word spans lets the browser wrap and justify normally, which pure `margin-right` spacing cannot do reliably across fonts.
- **Runtime scales with length**: total time is `wordCount × stagger + dur`. A long paragraph at 120ms/word can run for many seconds — cap the word count or the stagger for anything past a sentence or two.
- **Reduced motion**: the demo collapses to a single 300ms linear fade with no transform when `prefers-reduced-motion` is set, so the content still appears without the sequential motion.
- **GSAP**: `SplitText({type:"words"})` plus `stagger` on a tween is the direct equivalent.
- **Framer Motion**: a container variant with `staggerChildren:0.08` and a per-word child variant reproduces this without manual index math.
- **Motion One**: `stagger(0.08)` passed as the `delay` option to `animate()`.

## See also
- [Letter-by-Letter Stagger](../letter-by-letter-stagger/) — the finer-grained sibling, for short headlines
- [Split-Text Reveal](../split-text-reveal/) — general text-splitting entrance techniques
- [Fade In / Out](../fade-in-out/) — the base opacity transition each word uses
