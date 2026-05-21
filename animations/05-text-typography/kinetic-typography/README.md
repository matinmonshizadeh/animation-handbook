# Kinetic Typography

## What it is
Kinetic typography is the practice of animating text so that its motion reinforces its meaning. Rather than animating text as a generic UI element, each word or phrase is choreographed — scale, trajectory, timing, and rhythm are all chosen to serve the specific copy. It originates from motion graphics and broadcast design but has migrated to web via CSS animations and canvas-based tools.

## When to use it
- Opening sequences and splash screens where brand personality is established
- Video-style storytelling sections on marketing sites
- Presentation slides that need to feel like motion graphics
- App onboarding flows where each step has a narrative beat
- Anywhere the text itself is the content, not a label for something else

## How it works
Each phrase is a CSS element with an entry animation, a hold period, and an exit animation. A JavaScript timeline chains them with `setTimeout`:

```js
const PHRASES = [
  { text: 'EVERY',  enter: 'enter-scale', exit: 'exit-up',    hold: 1400 },
  { text: 'MOMENT', enter: 'enter-big',   exit: 'exit-shrink', hold: 1800 },
];

function showPhrase(i) {
  const p = PHRASES[i];
  el.textContent = p.text;
  el.className = p.enter; // triggers @keyframes
}

function run(idx = 0) {
  showPhrase(idx);
  setTimeout(() => {
    exitPhrase(idx, () => {
      if (idx + 1 < PHRASES.length) run(idx + 1);
    });
  }, ENTER_DUR + PHRASES[idx].hold);
}
```

Each enter and exit is a standalone `@keyframes` rule:

```css
.enter-scale { animation: kEnterScale 600ms ease-out forwards; }
.exit-up     { animation: kExitUp     400ms ease-in  forwards; }

@keyframes kEnterScale { from { opacity:0; transform:scale(.5) } to { opacity:1; transform:scale(1) } }
@keyframes kExitUp     { from { opacity:1; transform:translateY(0) } to { opacity:0; transform:translateY(-50px) } }
```

Playback speed is controlled via a CSS custom property used in every `calc()`:

```css
.enter-scale { animation-duration: calc(600ms / var(--spd)); }
```

## Key parameters
| Parameter | Typical range | Effect |
|-----------|--------------|--------|
| Enter duration | 400–800ms | Fast entries feel punchy; slow entries feel deliberate |
| Hold duration | 1000–2500ms | Must be long enough to read the phrase; subtitle reading speed is ~200ms/word |
| Exit duration | 300–500ms | Exits are usually shorter than entries — departure is less important than arrival |
| Playback speed | 0.5×–2× | Multiply all durations by inverse of speed factor |

## Production notes
- **Copy-first choreography**: the motion should be chosen for the words, not the other way around. Soft/gentle words dissolve; heavy words slam in; fragile words flutter. Generic enters and exits applied uniformly undermine the whole technique.
- **Hold duration is critical**: reading speed for subtitles is roughly 200ms per word minimum. A 3-word phrase needs at least 600ms of hold, ideally 1000ms+. The most common mistake is holding too briefly.
- **Audio sync**: kinetic typography originated in sound-synced broadcast. Even on web (without audio), timing phrases to a mental beat makes sequences feel more intentional. Think in measures, not just milliseconds.
- **CSS vs canvas**: CSS `@keyframes` is sufficient for most web uses. For audio-synced or highly complex sequences, GSAP's timeline API (`gsap.timeline()`) is the production-grade choice. Lottie (JSON-based After Effects export) handles pre-rendered kinetic sequences that are too complex for CSS.
- **`prefers-reduced-motion`**: show all phrases simultaneously or show only the final phrase — don't suppress the text itself.

## See also
- [Enter/Exit Typography](../enter-exit-typography/) — the same enter→hold→exit pattern focused on prose storytelling
- [Rotate Word Carousel](../rotate-word-carousel/) — a single cycling word rather than full phrase sequences
- [Text Clip-Path Reveal](../text-clip-path-reveal/) — one of the enter techniques used here as a standalone pattern
