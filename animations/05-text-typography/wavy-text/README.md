# Wavy Text

## What it is
Wavy text sends a vertical sine wave rolling across a word. Each character bobs up and down on the same keyframe, but neighbouring letters are offset in time, so the peak of the motion travels from the first letter to the last — like a flag ripple or a row of buoys lifted by a passing swell.

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
  s.textContent=ch===' '?' ':ch;
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

Only `transform` animates, so the effect stays on the compositor and runs at 60fps. Amplitude, duration, and stagger are all CSS variables the controls rewrite live.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Amplitude | 16px | Vertical travel of each letter; larger = taller wave |
| Wave speed | 1.6s | Duration of one bob cycle; shorter = faster ripple |
| Stagger | 60ms | Delay between adjacent letters; larger = longer, more visible wave |
| Text | user string | The word split into spans; spaces are preserved as gaps |

## Production notes
- **Accessibility**: splitting text into spans destroys the readable word for assistive tech. The demo sets `aria-label` on the container and `aria-hidden="true"` on each fragment, so screen readers announce the whole word once instead of spelling it out letter by letter.
- **Reduced motion**: under `@media (prefers-reduced-motion: reduce)` the span animation and transform are disabled, leaving flat, static text. Vestibular users get no bobbing.
- **Layout**: use `display:inline-block` on the spans (bare inline elements ignore `transform`) and `white-space:pre` on the container so spaces don't collapse. Emoji and combining characters can break naive `[...str]` splitting — segment with `Intl.Segmenter` if the text is user-supplied.
- **Library equivalents**: GSAP SplitText handles the character splitting and offers a `stagger` option on its tweens; Splitting.js emits `--char-index` custom properties equivalent to the `--i` here, letting you drive the same effect in pure CSS.

## See also
- [Kinetic Typography](../kinetic-typography/) — the broader family of per-letter motion
- [Typewriter Effect](../typewriter-effect/) — another per-character reveal technique
- [Text Morphing](../text-morphing/) — animating letterforms rather than their position
- [Variable Font Morph](../variable-font-morph/) — animating type via font axes
