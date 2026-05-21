# Text Morphing

## What it is
Text morphing transitions one word into another by animating individual characters out and new characters in. Each character slides out in one direction while its replacement slides in from the opposite direction, with staggered delays creating a wave-like effect across the word. When words have different lengths, extra characters appear or disappear independently.

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
| Morph duration | 400ms | Per-character animation time — 200ms feels snappy, 600ms feels cinematic |
| Stagger per char | 0–80ms | 0 = all chars move simultaneously; 40–60ms creates a readable wave |
| Pause between words | 1500ms | How long each word holds before the next morph — must be long enough to read |
| Direction | Up | Up/down for carousel-style; left/right for slide-style; pick one and stay consistent |

## Production notes
- **Length mismatch**: when word A has 5 chars and word B has 8, the extra 3 chars need to fade in from nothing. When B is shorter, 3 chars of A must disappear. The simplest approach: extra chars exit/enter with a 0-width transition or opacity-only fade, so they don't affect the layout of surrounding characters.
- **Fixed-width container**: to prevent layout shift as word length changes, give the rotating word container a fixed or `min-width` based on the longest word. Otherwise sibling elements jump as words swap.
- **`will-change: transform`**: only add this during active morphing — set it at the start of a transition and remove it after. Persistent `will-change` on many small spans wastes GPU memory.
- **GSAP**: `gsap.to(chars, { y: -50, opacity: 0, stagger: 0.03, duration: 0.4 })` for exits, then rebuild and animate in. GSAP's stagger model is cleaner than per-element `transitionDelay` in JavaScript.
- **SplitType**: a lightweight library that splits text into `<div>` wrappers per word/char without the overhead of GSAP. Pairs well with this pattern.

## See also
- [Rotate Word Carousel](../rotate-word-carousel/) — the same concept with a simpler whole-word slide (no character splitting)
- [Scramble / Glitch Text](../scramble-text/) — random characters before settling, rather than a directional transition
- [Typewriter Effect](../typewriter-effect/) — character-by-character reveal in reading order
