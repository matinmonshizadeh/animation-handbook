# Scramble / Glitch Text

## What it is
Scramble text shows every letter as a random character that keeps changing, then locks each one into the real letter. The letters lock one after another from left to right, so the text becomes readable bit by bit, as if a hidden message is being decoded. The random characters can be symbols, letters of the alphabet, numbers, Japanese characters or a mix.

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
  let lockedCount = 0;

  // One span per letter; each word's letters sit in one span.unit-word, which keeps the word on one line
  const spans = [];
  targetText.split(' ').filter(Boolean).forEach((word, wi, words) => {
    const w = document.createElement('span');
    w.className = 'unit-word';
    [...word].forEach(c => {
      const s = document.createElement('span');
      s.dataset.char = c;                                  // the letter it locks to
      s.textContent = chars[Math.floor(Math.random() * chars.length)];
      w.appendChild(s);
      spans.push(s);
    });
    el.appendChild(w);
    if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
  });
  const locked = new Array(spans.length).fill(false);

  // Settle each character after a staggered delay
  spans.forEach((s, i) => {
    setTimeout(() => {
      s.textContent = s.dataset.char;
      locked[i] = true;
      if (++lockedCount === spans.length) onDone();
    }, settleDelay * i + settleDelay);
  });

  // Cycle random chars on unlocked positions
  const interval = setInterval(() => {
    spans.forEach((s, i) => {
      if (!locked[i]) s.textContent = chars[Math.floor(Math.random() * chars.length)];
    });
  }, cycleMs);

  // Clear interval once all locked
  function onDone() { clearInterval(interval); }
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Random characters | Symbols | What the letters flicker through: symbols look like hacking, Japanese characters look like the falling code in science-fiction films, and the alphabet or numbers look like a password being cracked |
| Delay between letters | Medium | The wait between one letter locking and the next: short is 40ms, medium 70ms and long 120ms; it sets how fast the decoding travels |
| Flicker speed | Normal | How often the random characters change: slow every 65ms, normal every 40ms and fast every 25ms; faster looks more chaotic |
| Your text | DECODE THE MESSAGE | The text that is decoded, shown in capitals |

## Production notes
- **Left-to-right settle order**: characters settle in reading order so the word becomes readable progressively, not all at once. Random or simultaneous settling is harder to read and loses the "decoding" narrative.
- **Character set choice matters**: symbols (`!@#$%`) evoke hacking; katakana evokes The Matrix; mixed uppercase/numeric evokes cryptography. Match the set to the aesthetic of your product.
- **Don't overuse**: every headline scrambling on every page transition becomes visual noise. Reserve for hero moments — one word or phrase that deserves a dramatic entrance.
- **Uppercase works better**: lowercase letters with descenders (g, j, p, q, y) look awkward scrambling through uppercase symbols. UPPERCASE text is cleaner.
- **GSAP TextPlugin**: handles scramble-style effects with configurable `chars` parameter. Simpler API for production use. `gsap.to(el, { duration: 1, scrambleText: { text: "HELLO", chars: "lowerCase" } })`.
- **`aria-label` pattern**: set `aria-label` to the final decoded text at the start so screen readers announce the correct content, not the scrambled intermediate state.

## See also
- [Typewriter Effect](../typewriter-effect/) — text typed one character at a time
- [Kinetic Typography](../kinetic-typography/) — words that each move in their own way
- [Text Morphing](../text-morphing/) — one word changes into the next, letter by letter
