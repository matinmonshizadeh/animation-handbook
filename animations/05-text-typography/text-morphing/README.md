# Text Morphing

## What it is
Text morphing changes one word into the next, letter by letter. The letters of the current word slide out of sight, then the letters of the next word slide in from the opposite side; a small delay between letters can send each change across the word like a wave. Each word stays still long enough to read before the next change.

## When to use it
- A single changing word in a static phrase: "We make [websites / apps / brands]"
- Animated state transitions where a label changes meaning: "Loading → Ready → Error"
- Thematic cycling between related concepts: OCEAN → RIVER → STREAM
- Any UI element where a text value changes and the change should feel connected rather than abrupt

## How it works
Each character occupies its own `<span>`. When transitioning from word A to word B, the outgoing spans receive an exit class, and after a delay equal to the exit duration, the incoming spans are built and their enter class is removed to trigger the CSS transition:

```js
function morphTo(container, toWord, dir = 'up') {
  const duration = 400;
  const fromChars = [...container.querySelectorAll('.char')];

  // Exit current characters
  fromChars.forEach((c, i) => {
    c.style.transitionDelay = i * 30 + 'ms';   // stagger
    c.classList.add('out-' + dir);
  });

  setTimeout(() => {
    container.innerHTML = '';

    // Build incoming characters in off-screen position
    const enterClass = { up:'enter-below', down:'enter-above',
                         left:'enter-right', right:'enter-left' }[dir];
    const spans = [...toWord].map(c => {
      const s = document.createElement('span');
      s.className = 'char ' + enterClass;
      s.textContent = c;
      container.appendChild(s);
      return s;
    });

    // Double rAF ensures browser painted the off-screen position before transitioning
    requestAnimationFrame(() => requestAnimationFrame(() => {
      spans.forEach((s, i) => {
        s.style.transitionDelay = i * 30 + 'ms';
        s.classList.remove(enterClass);   // transition to normal position
      });
    }));
  }, duration + fromChars.length * 30 + 60);
}
```

```css
.char {
  display: inline-block;
  transition: transform 400ms cubic-bezier(.4,0,.2,1), opacity 400ms ease;
}

.out-up   { transform: translateY(-110%); opacity: 0; }
.out-down { transform: translateY( 110%); opacity: 0; }

.enter-below { transform: translateY( 110%); opacity: 0; }
.enter-above { transform: translateY(-110%); opacity: 0; }
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Slide direction | Up | Up and down look like a slot machine; left and right slide sideways |
| Delay between letters | None | The gap between one letter moving and the next: none, short (30ms) or long (60ms); none moves every letter together, a delay makes a wave |
| Speed | Normal | How long each letter takes to slide: slow is 650ms, normal 400ms and fast 250ms |
| Time on each word | Medium | How long each word stays: short is 900ms, medium 1500ms and long 2400ms; it must be long enough to read |
| Your words, one per line | OCEAN, RIVER, STORM, LIGHT, SOUND | The words that take turns, shown in capitals |

## Production notes
- **Length mismatch**: this demo sidesteps it — the whole old word leaves before the new one arrives, so words of any length work. A morph that swaps letters in place has to fade the extra letters in or out with opacity only, so the letters around them do not jump.
- **Fixed-width container**: to prevent layout shift as word length changes, give the rotating word container a fixed or `min-width` based on the longest word. Otherwise sibling elements jump as words swap.
- **`will-change: transform`**: only add this during active morphing — set it at the start of a transition and remove it after. Persistent `will-change` on many small spans wastes GPU memory.
- **GSAP**: `gsap.to(chars, { y: -50, opacity: 0, stagger: 0.03, duration: 0.4 })` for exits, then rebuild and animate in. GSAP's stagger model is cleaner than per-element `transitionDelay` in JavaScript.
- **SplitType**: a lightweight library that splits text into `<div>` wrappers per word/char without the overhead of GSAP. Pairs well with this pattern.

## See also
- [Rotate Word Carousel](../rotate-word-carousel/) — the whole word slides, with no letters split
- [Scramble / Glitch Text](../scramble-text/) — random symbols lock into the real text
- [Typewriter Effect](../typewriter-effect/) — text typed one character at a time
