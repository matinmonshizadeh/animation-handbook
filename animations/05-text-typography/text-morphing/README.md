# Text Morphing

[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/05-text-typography/text-morphing/)

## What it is
Text morphing changes one word into the next, letter by letter. The letters of the current word slide out of sight, then the letters of the next word slide in from the opposite side; a small delay between letters can send each change across the word like a wave. Each word stays still long enough to read before the next change.

## When to use it
- A single changing word in a static phrase: "We make [websites / apps / brands]"
- Animated state transitions where a label changes meaning: "Loading → Ready → Error"
- Thematic cycling between related concepts: OCEAN → RIVER → STREAM
- Any UI element where a text value changes and the change should feel connected rather than abrupt

## How it works
Each character occupies its own `<span>`. When transitioning from word A to word B, the outgoing spans receive an exit class; once the last one has left, the incoming spans are built with an enter class that places them on the opposite side, and removing it starts the CSS transition to their resting place.

`stepDur` (the Speed setting) and `stepStag` (the Delay between letters) are read once at the start of each change, both three times longer in Slow motion. The delay is 0 by default, so every letter moves together; 30 or 60ms sends the change across the word like a wave. `wait` is `setTimeout` that Pause can hold:

```js
// in startMorph(): the current letters leave
fromChars.forEach((c, i) => {
  c.style.transitionDelay = (stepStag * i) + 'ms';
  c.classList.add('out-' + curDir);
});
wait(afterExit, stepDur + stepStag * (fromChars.length - 1) + 60);

function afterExit() {
  wordEl.innerHTML = '';
  const enterDir = { up: 'enter-from-below', down: 'enter-from-above',
                     left: 'enter-from-right', right: 'enter-from-left' }[curDir];
  const toChars = [];
  nextWordVal.split('').forEach((c, i) => {
    const span = document.createElement('span');
    span.className = 'morph-char ' + enterDir;
    if (stepStag > 0) span.style.transitionDelay = (stepStag * i) + 'ms';
    span.textContent = c;
    wordEl.appendChild(span);
    toChars.push(span);
  });
  void wordEl.offsetWidth;   // reading the layout makes the browser apply the start position first
  toChars.forEach(c => c.classList.remove(enterDir));
  wait(afterEnter, stepDur + stepStag * (toChars.length - 1) + 50);
}
```

```css
.morph-char {
  display: inline-block;
  transition: transform var(--morph-dur) cubic-bezier(.4,0,.2,1), opacity var(--morph-dur) ease;
}

.morph-char.out-up    { transform: translateY(-100%); opacity: 0; }
.morph-char.out-down  { transform: translateY(100%);  opacity: 0; }
.morph-char.out-left  { transform: translateX(-80%);  opacity: 0; }
.morph-char.out-right { transform: translateX(80%);   opacity: 0; }

.morph-char.enter-from-below { transform: translateY(100%);  opacity: 0; }
.morph-char.enter-from-above { transform: translateY(-100%); opacity: 0; }
.morph-char.enter-from-left  { transform: translateX(-80%);  opacity: 0; }
.morph-char.enter-from-right { transform: translateX(80%);   opacity: 0; }
```

`--morph-dur` is set from `stepDur` at the start of each change (400ms at Normal).

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Slide direction | Up | Up and down look like a slot machine, each letter sliding its own height; left and right slide sideways, 80% of a letter's width; the letters fade out and in as they slide |
| Delay between letters | None | The gap between one letter moving and the next: none, short (30ms) or long (60ms); none moves every letter together, a delay makes a wave |
| Speed | Normal | How long each letter takes to slide: slow is 650ms, normal 400ms and fast 250ms |
| Time on each word | Medium | How long each word stays: short is 900ms, medium 1500ms and long 2400ms; it must be long enough to read |
| Your words, one per line | OCEAN, RIVER, STORM, LIGHT, SOUND | The words that take turns, shown in capitals |

## Production notes
- **Length mismatch**: this demo sidesteps it — the whole old word leaves before the new one arrives, so words of any length work. A morph that swaps letters in place has to fade the extra letters in or out with opacity only, so the letters around them do not jump.
- **Fixed-width container**: to prevent layout shift as word length changes, give the rotating word container a fixed or `min-width` based on the longest word. Otherwise sibling elements jump as words swap.
- **`will-change`**: the demo sets `will-change: transform, opacity` on its letters in the stylesheet, which costs little for one short word whose spans are rebuilt at every change. With many letters on screen, add it just before a change and remove it after, because each promoted span keeps its own layer in GPU memory.
- **GSAP**: `gsap.to(chars, { y: -50, opacity: 0, stagger: 0.03, duration: 0.4 })` for exits, then rebuild and animate in. GSAP's stagger model is cleaner than per-element `transitionDelay` in JavaScript.
- **SplitType**: a lightweight library that splits text into `<div>` wrappers per word/char without the overhead of GSAP. Pairs well with this pattern.

## See also
- [Rotate Word Carousel](../rotate-word-carousel/) — the whole word slides, with no letters split
- [Scramble / Glitch Text](../scramble-text/) — random symbols lock into the real text
- [Typewriter Effect](../typewriter-effect/) — text typed one character at a time
