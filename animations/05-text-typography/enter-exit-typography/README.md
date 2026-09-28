# Enter/Exit Typography

## What it is
Enter/exit typography shows short phrases one at a time in the same place. Each phrase comes in, holds still long enough to be read, then leaves before the next one arrives. Every phrase has its own way in and out, such as sliding, growing, blurring or wiping, and the last one stays on screen when the sequence ends.

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

One play shows the phrases in order and leaves the last one on screen. While Loop is on, the last phrase exits too and the play starts again from the first.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Entrance speed | Normal | How long each phrase takes to arrive: slow is 800ms, normal 500ms and fast 300ms; fast feels energetic, slow feels deliberate |
| Time on each phrase | Medium | How long each phrase holds still: short is 1200ms, medium 2000ms and long 3200ms; it must be longer than it takes to read the phrase |
| Exit speed | Normal | How long each phrase takes to leave: slow is 650ms, normal 400ms and fast 250ms; exits are usually shorter than entrances |

## Production notes
- **Hold duration is the most important parameter**: the animation is wasted if phrases don't have enough time to be read. A 5-word phrase needs at least 1000ms hold, preferably 1500–2000ms. Test by reading the phrase aloud at a comfortable pace — if you can't finish before the exit starts, extend the hold.
- **Directional continuity**: if a phrase exits upward, the next phrase entering from below creates a sense of being on the same vertical track. If a phrase exits left and the next enters from the right, it implies the user is moving "forward" through a sequence. These are conventions from film editing.
- **Auto-pause on tab blur**: use `document.addEventListener('visibilitychange', ...)` to pause the sequence when the tab loses focus. Phrases that advance while the user is away result in missed messages.
- **`prefers-reduced-motion`**: replace all motion with instant swaps — `display: none` → `display: block`. The text sequence still cycles, just without animation.
- **Framer Motion**: `<AnimatePresence>` handles enter/exit lifecycles for React components elegantly. Each phrase is conditionally rendered and gets `initial`, `animate`, and `exit` props.

## See also
- [Kinetic Typography](../kinetic-typography/) — words that each move in their own way
- [Rotate Word Carousel](../rotate-word-carousel/) — one word in a sentence keeps changing
- [Text Morphing](../text-morphing/) — one word changes into the next, letter by letter
