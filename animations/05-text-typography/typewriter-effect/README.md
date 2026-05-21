# Typewriter Effect

## What it is
The typewriter effect reveals text character by character, mimicking the cadence of someone typing. A blinking cursor at the insertion point reinforces the illusion. Adding subtle per-character timing variance — random ±20ms jitter — turns a mechanical loop into something that feels genuinely hand-typed, because human typing is never perfectly uniform.

## When to use it
- Hero headlines on developer tools, terminal-themed, or hacker-aesthetic sites
- Code samples that benefit from being "typed out" rather than appearing all at once
- Brief taglines and CTAs where the typing reveals the message progressively
- Chat interfaces, AI demos, and streaming text UI

## How it works
The core loop increments a counter and slices the full string to that length. A `<span>` cursor is appended after the text node:

```js
function type(text, speed = 50) {
  let i = 0;
  const el = document.querySelector('.output');
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  el.appendChild(cursor);

  function tick() {
    el.firstChild?.remove();                               // remove old text node
    el.insertBefore(document.createTextNode(text.slice(0, i)), null); // prepend new
    el.appendChild(cursor);                                // cursor stays last
    if (++i <= text.length) setTimeout(tick, jitter(speed));
  }
  tick();
}

// Natural variance: ±20ms random offset
function jitter(base) {
  return base + Math.round((Math.random() - 0.5) * 40);
}
```

The cursor blinks via a CSS animation:

```css
.cursor {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  background: var(--accent);
  animation: blink 1s step-end infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
```

For the backspace-and-retype variant, decrement the substring index instead of incrementing, then redirect to a new target string:

```js
function deleteBack(from, to, callback) {
  let i = from.length;
  function del() {
    el.firstChild.textContent = from.slice(0, --i);
    if (i > 0) setTimeout(del, 30);
    else callback(to);
  }
  del();
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed per char | 50ms | 20ms = fast/robotic; 80–120ms = natural pace; 200ms = slow/deliberate |
| Jitter range | ±20ms | 0 = robotic uniform; ±40ms = very human but erratic |
| Delete speed | ~30ms | Faster than type speed — deleting feels more decisive than typing |
| Cursor style | pipe | Block cursor reads as terminal; pipe reads as text editor; underscore reads as DOS |

## Production notes
- **Long text is exhausting**: the typewriter effect works on short hero copy (under ~15 words). A full paragraph typed character-by-character forces users to wait for content they could read instantly. Reserve it for dramatic reveals, not body text.
- **`aria-live="polite"`**: screen readers should not read each character as it types — add `aria-live="polite"` on the container so the screen reader waits for a pause before announcing, or use `aria-label` with the full final text.
- **Looping and rotation**: the "type, delete, retype" loop (cycling between multiple phrases) is the most common production pattern. Each phrase is typed, held briefly, then deleted before the next starts.
- **Performance**: `setTimeout` is accurate enough; `requestAnimationFrame` is overkill for typewriter timing and introduces unnecessary complexity.
- **Typed.js**: the canonical library for this effect. Handles multiple strings, backspace, loops, smart backspace (delete only the differing suffix), and HTML tags in strings. Worth using in production rather than rolling your own.

## See also
- [Scramble / Glitch Text](../scramble-text/) — a different character-reveal approach: random cycling before settling
- [Rotate Word Carousel](../rotate-word-carousel/) — cycling through words without character-by-character reveal
- [Enter/Exit Typography](../enter-exit-typography/) — phrase-level enter/exit without character-level timing
