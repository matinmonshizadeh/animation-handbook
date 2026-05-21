# Enter/Exit Typography

## What it is
Enter/exit typography treats each phrase as a three-act sequence: it enters the frame, holds long enough to be read, then exits to make way for the next. This is the full lifecycle of on-screen text in broadcast, presentation, and storytelling contexts. The key insight is that the exit is as important as the entry — the direction and character of each phrase's departure creates continuity with the next phrase's arrival.

## When to use it
- Sequential brand statements and manifesto sections
- Automated slideshow-style content that cycles without user interaction
- App onboarding flows that walk through a narrative step by step
- Ambient display screens and digital signage
- Hero sections with a rotating message queue

## How it works
Each phrase has a three-timer chain: enter animation fires, then after the enter duration a hold timer starts, then after the hold duration the exit animation fires, and finally after the exit duration `done()` is called to advance to the next phrase:

```js
function show(phrase, done) {
  el.textContent = phrase.text;
  el.classList.remove(...allClasses, 'hidden');
  el.classList.add(phrase.enter);           // triggers CSS @keyframes

  setTimeout(() => {                         // after enter completes
    el.classList.remove(phrase.enter);
    el.classList.add(phrase.exit);          // triggers exit @keyframes

    setTimeout(() => {                       // after exit completes
      el.classList.add('hidden');
      done();                               // advance to next phrase
    }, EXIT_DURATION + 50);
  }, ENTER_DURATION + HOLD_DURATION);
}
```

Each enter/exit pair is a `@keyframes` rule:

```css
.enter-slide-right { animation: eSR 500ms ease-out forwards; }
.exit-slide-left   { animation: xSL 400ms ease-in  forwards; }

@keyframes eSR { from { opacity:0; transform:translateX(-50px) } to { opacity:1; transform:translateX(0) } }
@keyframes xSL { from { opacity:1; transform:translateX(0) }    to { opacity:0; transform:translateX(60px) } }
```

The sequences loop by resetting `idx` to 0 after the last phrase:

```js
function cycle(idx = 0) {
  show(PHRASES[idx], () => {
    cycle((idx + 1) % PHRASES.length);
  });
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Enter duration | 500ms | Fast entry (300ms) = energetic; slow entry (800ms) = deliberate |
| Hold duration | 2000ms | Must exceed reading time: ~200ms per word minimum |
| Exit duration | 400ms | Usually shorter than enter — departure is punctuation, not the main event |
| Enter/exit pairing | Thematic | Matching directions (exit left → enter from left) implies continuation; mismatched implies contrast |

## Production notes
- **Hold duration is the most important parameter**: the animation is wasted if phrases don't have enough time to be read. A 5-word phrase needs at least 1000ms hold, preferably 1500–2000ms. Test by reading the phrase aloud at a comfortable pace — if you can't finish before the exit starts, extend the hold.
- **Directional continuity**: if a phrase exits upward, the next phrase entering from below creates a sense of being on the same vertical track. If a phrase exits left and the next enters from the right, it implies the user is moving "forward" through a sequence. These are conventions from film editing.
- **Auto-pause on tab blur**: use `document.addEventListener('visibilitychange', ...)` to pause the sequence when the tab loses focus. Phrases that advance while the user is away result in missed messages.
- **`prefers-reduced-motion`**: replace all motion with instant swaps — `display: none` → `display: block`. The text sequence still cycles, just without animation.
- **Framer Motion**: `<AnimatePresence>` handles enter/exit lifecycles for React components elegantly. Each phrase is conditionally rendered and gets `initial`, `animate`, and `exit` props.

## See also
- [Kinetic Typography](../kinetic-typography/) — the same pattern with per-phrase choreography choices driven by the copy's meaning
- [Rotate Word Carousel](../rotate-word-carousel/) — a single word within a static sentence cycling through a list
- [Text Morphing](../text-morphing/) — character-level transitions rather than full-phrase enter/exit
