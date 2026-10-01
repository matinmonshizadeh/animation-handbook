# Copy to Clipboard

## What it is
Copy feedback is the short confirmation a Copy button gives after it copies something. The clipboard icon turns into a tick, the label changes from Copy to Copied! and a brief flash of color marks the moment. After a second or two the button changes back, ready to use again.

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

The two labels are stacked in the same grid cell so they crossfade in place without shifting layout, and the two icons are absolutely positioned on top of each other so the clipboard scales out as the checkmark scales in. The icons and labels animate `opacity` and `transform`, the checkmark path adds a short `stroke-dashoffset` draw for a hand-drawn finish, the button's border and text fade to green with a color transition, and the pulse ring is a one-shot animation of `opacity` and `transform`. If the browser refuses the copy, the button stays as it is and a short message says so.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | Normal | How long the icon and label take to change: slow is 450ms, normal 280ms and fast 170ms |
| Time before it changes back | Medium | How long Copied! stays: short is 1 second, medium 1.5 and long 2.5; under a second feels rushed, and over about three seconds it lingers |
| Feel | Springy | Springy gives the tick a small bounce; Smooth slows to a stop; Even keeps one steady speed |

## Production notes
- **Clipboard API support and fallback**: `navigator.clipboard.writeText` requires a secure context (HTTPS or `localhost`) and a user gesture. Feature-detect it and fall back to a hidden `<textarea>` plus `document.execCommand('copy')` for older or insecure-context browsers, as the demo does.
- **Do not rely on color alone**: the green tint and pulse are reinforcement, not the message. The icon change and the "Copied!" text carry the meaning so colorblind users still get clear feedback.
- **Announce for screen readers**: sighted users see the label change, but assistive tech needs an `aria-live="polite"` (or `role="status"`) region that receives the "Copied to clipboard" string on success. Clear it on revert so it does not re-announce stale state.
- **Revert timing and rapid clicks**: clear any pending timer before starting a new one, otherwise a second copy can revert early. Keep the button interactive during the confirmation so repeated copies work.
- **Reduced motion**: under `prefers-reduced-motion: reduce`, drop the morph, pulse, and stroke draw — swap the icon and label instantly. The confirmation still lands, just without movement.

## See also
- [Checkmark Draw](../checkmark-draw/) — a tick that draws itself
- [Button Press Scale](../button-press-scale/) — a button that shrinks as you press it
- [Success Confetti](../success-confetti/) — a bigger celebration for a bigger moment
- [Button Loading States](../button-loading-states/) — a button that shows a spinner, then a tick or a cross
