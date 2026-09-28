# Wavy Text

## What it is
Wavy text sends a wave rolling across a word. Every letter bobs up and down with the same motion, but each one starts a moment after the letter before it, so the highest point travels from the first letter to the last, like a flag rippling or a row of buoys lifted by a passing swell.

## When to use it
- Playful headlines and logotypes for games, kids' products, or casual brands
- Loading and idle states that want gentle life without demanding attention
- Hover accents where a word "comes alive" on interaction
- Music, party, or beach-themed sites where a liquid feel fits the tone

## How it works
JavaScript splits the string into one `<span>` per character and stamps each with an index custom property `--i`. Every span shares a single `bob` keyframe that translates it on the Y axis; the per-letter `animation-delay` of `--i × stagger` phases each letter behind its neighbour, producing the travelling wave:

```js
[...str].forEach((ch,i)=>{
  const s=document.createElement('span');
  s.textContent=ch;
  s.style.setProperty('--i',i);
  wave.appendChild(s);
});
```

```css
.wave-text span{
  display:inline-block;
  animation:bob var(--dur) ease-in-out infinite;
  animation-delay:calc(var(--i) * var(--stagger));
}
@keyframes bob{
  0%,100%{transform:translateY(calc(var(--amp) * .6))}
  50%{transform:translateY(calc(var(--amp) * -1))}
}
```

Only `transform` animates, so the effect stays on the compositor and runs at 60fps. Wave height, Speed and Delay between letters set these three CSS variables.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Wave height | Medium | How far each letter travels: low is 8px, medium 16px and high 28px; larger makes a taller wave |
| Speed | Normal | How long one rise and fall takes: slow is 2.6s, normal 1.6s and fast 1s |
| Delay between letters | Medium | The gap between neighbouring letters: short is 30ms, medium 60ms and long 120ms; longer delays stretch the wave |
| Your text | Wavy | The word that waves, up to 14 letters |

## Production notes
- **Accessibility**: splitting text into spans destroys the readable word for assistive tech. The demo sets `aria-label` on the container and `aria-hidden="true"` on each fragment, so screen readers announce the whole word once instead of spelling it out letter by letter.
- **Reduced motion**: under reduced motion the demo starts paused, so the letters stay still until the visitor presses Play. In production, keep the letters still for these visitors.
- **Layout**: use `display:inline-block` on the spans (bare inline elements ignore `transform`) and `white-space:pre` on the container so spaces don't collapse. Emoji and combining characters can break naive `[...str]` splitting — segment with `Intl.Segmenter` if the text is user-supplied.
- **Library equivalents**: GSAP SplitText handles the character splitting and offers a `stagger` option on its tweens; Splitting.js emits `--char-index` custom properties equivalent to the `--i` here, letting you drive the same effect in pure CSS.

## See also
- [Kinetic Typography](../kinetic-typography/) — words that each move in their own way
- [Typewriter Effect](../typewriter-effect/) — text typed one character at a time
- [Text Morphing](../text-morphing/) — one word changes into the next, letter by letter
- [Variable Font Morph](../variable-font-morph/) — the letters change weight and lean
