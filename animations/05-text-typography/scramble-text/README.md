# Scramble / Glitch Text

## What it is
Scramble text (also called glitch text or decode text) cycles each character through random symbols before "locking" to its true value. Characters settle sequentially from left to right, so the word is progressively decoded — the first character locks first, making the reveal directional and readable. The effect evokes decryption, hacking, and sci-fi terminal aesthetics.

## When to use it
- Tech products, cybersecurity tools, and developer-facing sites
- Dramatic hero headline reveals where text "decodes" on page load
- Hover effects on navigation items or interactive cards
- Loading screens that need a purposeful aesthetic while content loads

## How it works
Each character of the target string gets its own `<span>`. A `setInterval` loop replaces unlocked spans with random characters. Each character has a staggered `setTimeout` that locks it to the correct value after a delay:

```js
function scramble(el, targetText) {
  const chars = '!@#$%^&*<>{}[]|/\\?=+-_~`';
  const locked = new Array(targetText.length).fill(false);
  let lockedCount = 0;

  // Build one span per character
  const spans = [...targetText].map((c, i) => {
    if (c === ' ') { el.appendChild(document.createTextNode(' ')); return null; }
    const s = document.createElement('span');
    s.textContent = chars[Math.floor(Math.random() * chars.length)];
    el.appendChild(s);
    return s;
  });

  // Settle each character after a staggered delay
  spans.forEach((s, i) => {
    if (!s) return;
    setTimeout(() => {
      s.textContent = targetText[i];
      locked[i] = true;
      if (++lockedCount === spans.filter(Boolean).length) onDone();
    }, settleDelay * i + settleDelay);
  });

  // Cycle random chars on unlocked positions
  const interval = setInterval(() => {
    spans.forEach((s, i) => {
      if (s && !locked[i]) s.textContent = chars[Math.floor(Math.random() * chars.length)];
    });
  }, cycleMs);

  // Clear interval once all locked
  function onDone() { clearInterval(interval); }
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Cycle speed | 40ms | How fast random chars swap — faster = more chaotic; slower = more legible |
| Settle delay per char | 70ms | Gap between each character locking — controls how "fast" the decode reads left-to-right |
| Character set | Symbols | Symbols feel hacker; katakana (Matrix-style) feels cinematic; alphabetic feels more like autocorrect |
| Total duration | auto | `settleDelay × charCount` — adjust settle delay to control total animation length |

## Production notes
- **Left-to-right settle order**: characters settle in reading order so the word becomes readable progressively, not all at once. Random or simultaneous settling is harder to read and loses the "decoding" narrative.
- **Character set choice matters**: symbols (`!@#$%`) evoke hacking; katakana evokes The Matrix; mixed uppercase/numeric evokes cryptography. Match the set to the aesthetic of your product.
- **Don't overuse**: every headline scrambling on every page transition becomes visual noise. Reserve for hero moments — one word or phrase that deserves a dramatic entrance.
- **Uppercase works better**: lowercase letters with descenders (g, j, p, q, y) look awkward scrambling through uppercase symbols. UPPERCASE text is cleaner.
- **GSAP TextPlugin**: handles scramble-style effects with configurable `chars` parameter. Simpler API for production use. `gsap.to(el, { duration: 1, scrambleText: { text: "HELLO", chars: "lowerCase" } })`.
- **`aria-label` pattern**: set `aria-label` to the final decoded text at the start so screen readers announce the correct content, not the scrambled intermediate state.

## See also
- [Typewriter Effect](../typewriter-effect/) — character-by-character reveal with natural typing rhythm
- [Kinetic Typography](../kinetic-typography/) — phrase-level motion that could use scramble as one of its enter techniques
- [Text Morphing](../text-morphing/) — word-to-word character transition, a smoother alternative
