# Letter-by-Letter Stagger

## What it is
A letter-by-letter stagger splits a string into individual characters and animates each one on a slightly later schedule, so the phrase assembles as a cascade rather than appearing all at once. The demo offers two implementations of the same idea: a CSS *cascade* driven by per-letter `transition-delay`, and a JS *typewriter* that reveals characters one at a time behind a blinking cursor.

## When to use it
- Hero headlines and landing-page titles where the text is the focal point
- Short phrases under ~30 characters — the effect is dramatic and gets tedious on long copy
- Loading or "assembling" states that want to feel deliberate
- Typewriter mode specifically for terminal UIs, chat interfaces, and code demos

## How it works
Each character is wrapped in its own `<span class="char">` and given a custom property `--i` equal to its index. The CSS multiplies that index by a `--stagger` value to compute a per-letter `transition-delay`, so letter *n* starts `n × stagger` milliseconds after the animation is triggered:

```js
[...text].forEach((c,i)=>{
  const s=document.createElement('span');
  s.className='char';s.style.setProperty('--i',i);
  s.textContent=c===' '?' ':c;
  target.appendChild(s);
});
```

```css
[data-mode="cascade"] .char{
  opacity:0;
  transition:opacity var(--dur) var(--ease) calc(var(--i)*var(--stagger)),
             transform var(--dur) var(--ease) calc(var(--i)*var(--stagger));
}
[data-mode="cascade"][data-anim="fade-up"] .char{transform:translateY(0.4em)}
[data-mode="cascade"].done .char{opacity:1;transform:none}
```

Adding the `.done` class flips every letter to its resting state simultaneously; the staggered `transition-delay` is what spreads the visible motion out over time. The typewriter mode skips transitions entirely and instead uses a chain of `setTimeout` calls to toggle a `.visible` class on each character in sequence.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Per-letter delay (`--stagger`) | 35ms | Gap between successive letters; higher = slower, more theatrical cascade |
| Duration per letter (`--dur`) | 400ms | How long each individual letter takes to settle |
| Per-letter animation | Fade up | The transform each letter animates from: fade, scale, or `rotateY` |
| Total time | `n × stagger + dur` | Full runtime grows linearly with character count |

## Production notes
- **Accessibility**: split text still reads as separate spans to most screen readers, but wrapping the whole phrase in an `aria-label` on the container and hiding the spans with `aria-hidden` guarantees the label is announced as one string. The demo honors `prefers-reduced-motion` by forcing all letters visible with no transition.
- **Layout cost**: `display:inline-block` on each span is required for `transform` to apply, but it disables normal line-breaking within words. For wrapping headlines, split on words first, then letters inside each word.
- **Don't overuse**: per-letter is the most granular split and the most quickly grating. Reserve it for one headline per page.
- **GSAP**: `SplitText` plus a `stagger` value on a timeline is the canonical implementation and handles the wrapping-span bookkeeping for you.
- **Framer Motion**: use a parent `variants` object with `staggerChildren`, mapping each letter to a child `motion.span`.
- **Motion One**: pass an array of elements to `animate()` with a `delay: stagger(0.035)` helper.

## See also
- [Word-by-Word Reveal](../word-by-word-reveal/) — the same stagger at word granularity, better for longer text
- [Split-Text Reveal](../split-text-reveal/) — related text-splitting entrance patterns
- [Blur In](../blur-in/) — a per-letter blur makes an effective cascade transform
