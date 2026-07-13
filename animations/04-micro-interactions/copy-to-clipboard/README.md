# Copy to Clipboard

## What it is
Copy-to-clipboard feedback is the transient confirmation a button gives after copying text. The moment the copy succeeds, the icon morphs from a clipboard glyph to a checkmark, the label crossfades from "Copy" to "Copied!", and a brief color pulse acknowledges the event. After about 1.5 seconds the button reverts to its resting state, ready to use again. It is the canonical example of transient success feedback: confirm, then get out of the way.

## When to use it
- Code blocks and API keys in documentation
- Sharing links, invite codes, or coupon codes
- Copying a value from a table cell or field
- Any single-tap action where the result is invisible and the user needs reassurance it happened

## How it works
Two things run in parallel: the actual copy, and the visual state swap. The copy uses the asynchronous Clipboard API, which returns a promise. Only when it resolves do you flip a single `copied` class on the button — the CSS drives the icon morph, label crossfade, and pulse off that one class. A timer removes the class to revert.

```js
btn.addEventListener('click', () => {
  navigator.clipboard.writeText(snippet.innerText).then(() => {
    btn.classList.add('copied');          // icon + label + pulse
    live.textContent = 'Copied to clipboard'; // aria-live announcement
    setTimeout(() => {
      btn.classList.remove('copied');
      live.textContent = '';
    }, 1500);                              // revert delay
  });
});
```

```css
.l-copied            { opacity: 0; transform: translateY(4px); }
.copied .l-copy      { opacity: 0; transform: translateY(-4px); }
.copied .l-copied    { opacity: 1; transform: translateY(0); }
.copied .clip        { opacity: 0; transform: scale(.5); } /* clipboard out */
.copied .chk         { opacity: 1; transform: scale(1);  } /* checkmark in  */
```

The two labels are stacked in the same grid cell so they crossfade in place without shifting layout, and the two icons are absolutely positioned on top of each other so the clipboard scales out as the checkmark scales in. Only `opacity` and `transform` animate; the checkmark path adds a short `stroke-dashoffset` draw for a hand-drawn finish.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Revert delay | 1500ms | How long "Copied!" stays before reverting. Under ~1s feels rushed; over ~3s lingers |
| Animation duration | 280ms | Speed of the icon morph and label crossfade. 150–300ms reads as snappy |
| Easing | overshoot | A slight spring overshoot on the checkmark gives the confirmation a bit of pop |
| Pulse | ~520ms | One-shot color ring; runs once per copy, independent of the revert timer |

## Production notes
- **Clipboard API support and fallback**: `navigator.clipboard.writeText` requires a secure context (HTTPS or `localhost`) and a user gesture. Feature-detect it and fall back to a hidden `<textarea>` plus `document.execCommand('copy')` for older or insecure-context browsers, as the demo does.
- **Do not rely on color alone**: the green tint and pulse are reinforcement, not the message. The icon change and the "Copied!" text carry the meaning so colorblind users still get clear feedback.
- **Announce for screen readers**: sighted users see the label change, but assistive tech needs an `aria-live="polite"` (or `role="status"`) region that receives the "Copied to clipboard" string on success. Clear it on revert so it does not re-announce stale state.
- **Revert timing and rapid clicks**: clear any pending timer before starting a new one, otherwise a second copy can revert early. Keep the button interactive during the confirmation so repeated copies work.
- **Reduced motion**: under `prefers-reduced-motion: reduce`, drop the morph, pulse, and stroke draw — swap the icon and label instantly. The confirmation still lands, just without movement.

## See also
- [Checkmark Draw](../checkmark-draw/) — the stroke-dashoffset technique behind the success tick
- [Button Press Scale](../button-press-scale/) — the press feedback that precedes the copy
- [Success Confetti](../success-confetti/) — a louder success celebration for higher-stakes actions
