# Rotate Word Carousel

## What it is
A rotate word carousel keeps a sentence almost entirely static while cycling one keyword through a list of alternatives. The pattern reads as: "We build [Websites / Apps / Brands / Systems]." Only the bracketed word animates — sliding out as the current word and sliding in as the next. This is the dominant hero headline pattern on agency, freelance, and SaaS landing pages.

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
| Hold duration | 2000ms | How long each word stays visible — 1.5–3s is the readable range |
| Transition duration | 400ms | 200ms = snappy; 600ms = deliberate |
| Direction | Up/down | Up = word scrolls up like a slot machine; Left/right = word slides horizontally |
| Color per word | Per-word accent | Unique color per word draws more attention to the change; uniform is calmer |

## Production notes
- **Only one word should rotate**: multiple cycling sections in a single headline create chaos. The static context is what makes the rotating word legible — "We build for [X]" works because "We build for" never changes.
- **Word length variance causes layout shift**: if words have different lengths, the headline reflows on each transition. Solutions: (1) set a fixed `min-width` on the container based on the longest word, (2) use `position: absolute` on the word and manually set container width to the longest word, or (3) choose words of similar length.
- **`aria-live="polite"`**: screen readers will announce each word change after the current utterance completes. Set on the rotating word container, not the entire headline.
- **Keep the word list short**: 4–6 words maximum. Beyond that, users rarely see the full cycle and the repetition becomes numbing. Randomizing the order slightly reduces predictability.
- **GSAP**: `gsap.to(word, { yPercent: -110, opacity: 0, duration: 0.4 })` for exit, then set new text and `gsap.fromTo(word, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 })` for entry.
- **Typed.js, Motion One**: both have built-in word cycling APIs. Typed.js (`strings: [...]` with `backSpeed`) is the most widely used.

## See also
- [Text Morphing](../text-morphing/) — character-level transitions between words rather than whole-word slides
- [Enter/Exit Typography](../enter-exit-typography/) — full-phrase cycling with enter and exit on the entire headline
- [Typewriter Effect](../typewriter-effect/) — an alternative word-reveal pattern that types characters one by one
