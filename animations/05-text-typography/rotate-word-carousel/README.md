# Rotate Word Carousel

## What it is
A rotating word keeps a sentence still while one word in it keeps changing: "We craft for Designers" becomes "We craft for Developers", then "We craft for Humans". The current word slides out of sight and the next one slides in from the other side, so each change is easy to notice while the rest of the line stays readable. It is a common headline on the home pages of studios and software products.

## When to use it
- Hero headlines that address multiple audiences: "Built for [Designers / Developers / Teams]"
- Value proposition cycling: "Faster / Simpler / Smarter"
- Service lists: "We build [Websites / Mobile Apps / Design Systems]"
- Any headline where a single dimension varies while the surrounding context is stable

## How it works
The rotating word lives in a container with `overflow: hidden`. The current word slides out in one direction while the next slides in from the opposite:

```html
<h1>
  <span class="static">We build for </span>
  <span class="rotating-container">
    <span class="rotating-word" aria-live="polite">Designers</span>
  </span>
</h1>
```

```css
.rotating-container {
  position: relative;
  display: inline-block;
  overflow: hidden;           /* clips words exiting above/below */
  vertical-align: middle;
}

.rotating-word {
  display: block;
  transition: transform 400ms cubic-bezier(.4,0,.2,1), opacity 400ms ease;
}

/* Exit state */
.rotating-word.out-up   { transform: translateY(-110%); opacity: 0; }

/* Enter state (transitioning TO default removes this class) */
.rotating-word.enter-below { transform: translateY(110%);  opacity: 0; }
```

```js
function transitionWord(container, nextWord) {
  const wordEl = container.querySelector('.rotating-word');
  const duration = 400;

  // Exit current
  wordEl.classList.add('out-up');

  setTimeout(() => {
    wordEl.textContent = nextWord;
    wordEl.classList.remove('out-up');
    wordEl.classList.add('enter-below');        // position below, invisible

    requestAnimationFrame(() => requestAnimationFrame(() => {
      wordEl.classList.remove('enter-below');   // animate to normal position
    }));
  }, duration + 30);
}
```

The auto-cycle:
```js
let i = 0;
const words = ['Designers', 'Developers', 'Humans', 'Teams'];
setInterval(() => {
  transitionWord(container, words[++i % words.length]);
}, holdDuration + transitionDuration * 2);
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Slide direction | Up | Up and down move the word like a slot machine; left and right slide it sideways |
| Speed | Normal | How long each slide takes: slow is 650ms, normal 400ms and fast 250ms |
| Time on each word | Medium | How long each word stays: short is 1200ms, medium 2000ms and long 3200ms; 1.5 to 3 seconds is the readable range |
| Different color per word | on | A new color for each word draws attention to the change; one color is calmer |
| Your sentence | We craft for | The part of the headline that stays still |
| Your words, one per line | Designers, Developers, Humans, Teams, Startups | The words that take turns |

## Production notes
- **Only one word should rotate**: multiple cycling sections in a single headline create chaos. The static context is what makes the rotating word legible — "We build for [X]" works because "We build for" never changes.
- **Word length variance causes layout shift**: if words have different lengths, the headline reflows on each transition. Solutions: (1) set a fixed `min-width` on the container based on the longest word, (2) use `position: absolute` on the word and manually set container width to the longest word, or (3) choose words of similar length.
- **`aria-live="polite"`**: screen readers will announce each word change after the current utterance completes. Set on the rotating word container, not the entire headline.
- **Keep the word list short**: 4–6 words maximum. Beyond that, users rarely see the full cycle and the repetition becomes numbing. Randomizing the order slightly reduces predictability.
- **GSAP**: `gsap.to(word, { yPercent: -110, opacity: 0, duration: 0.4 })` for exit, then set new text and `gsap.fromTo(word, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 })` for entry.
- **Typed.js, Motion One**: both have built-in word cycling APIs. Typed.js (`strings: [...]` with `backSpeed`) is the most widely used.

## See also
- [Text Morphing](../text-morphing/) — one word changes into the next, letter by letter
- [Enter/Exit Typography](../enter-exit-typography/) — whole phrases come in, hold and leave
- [Typewriter Effect](../typewriter-effect/) — text typed one character at a time
