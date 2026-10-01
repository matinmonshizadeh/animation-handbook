# Button Loading States

## What it is
Button loading states show, inside the button itself, that a press is being worked on. The label gives way to a spinner, the button cannot be pressed twice, and when the answer comes a tick or a cross says how it went before the label comes back. The button can also shrink into a circle around the spinner, drawn with a clip so that nothing around it moves.

## When to use it
- Save, Send and Submit buttons that wait for a server
- Contact, feedback and sign-up forms
- Checkout and payment buttons, where a second press would order twice
- Any action that takes from about half a second to a few seconds

## How it works
The button keeps its full size in the layout the whole time. What the visitor sees as its shape is a color layer inside it, and the states are classes on the button: `busy`, then `ok` or `err`, and `round` while it is shrunk.

```css
.bg { position: absolute; inset: 0; border-radius: 26px; background-color: #ff9d5c;
      clip-path: inset(0 0 round 26px);
      transition: clip-path 300ms cubic-bezier(.22, 1, .36, 1), background-color 300ms; }
.round .bg { clip-path: inset(0 calc(50% - 26px) round 26px); }   /* a 52px circle in the middle */
.ok .bg  { background-color: #3fb950; }
.err .bg { background-color: #f85149; }
.busy .spin { opacity: 1; animation: spin .7s linear infinite; }  /* turns only while busy */
.ok .tick path, .err .cross path { stroke-dashoffset: 0; }        /* paths with pathLength="1", dasharray 1 */
```

```js
function submit() {
  if (state !== 'rest') return;                     // a second press does nothing
  state = 'busy';
  btn.setAttribute('aria-disabled', 'true');        // not disabled: the keyboard focus stays on the button
  btn.classList.add('busy');
  btn.classList.toggle('round', shrinks && !reducedMotion);
  status.textContent = 'Sending…';
  send().then(ok => {                               // the demo waits How long it loads instead
    btn.classList.replace('busy', ok ? 'ok' : 'err');
    status.textContent = ok ? 'Feedback sent.' : 'Not sent. Please try again.';
    setTimeout(() => btn.classList.remove('ok', 'err', 'round'), 1300); // the change (300ms), then a second to read it
  });
}
```

The label and the spinner crossfade in place, the tick and the cross draw themselves along their length, and an error restarts a short shake on the button's wrapper. Removing the classes plays everything back to Submit; the button only takes presses again once that is done. The focus ring sits outside the button while it is wide and moves to a circle around it while it is round. Under reduced motion the button keeps its shape, nothing turns or shakes, and the label's words change instead: Sending…, ✓ Sent or ✕ Not sent.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Result | Success | Success shows a tick on green; Error shows a cross on red and gives the button a small shake |
| Speed | Normal | How long the shape, the color and the icon take to change: slow is 500ms, normal 300ms and fast 180ms |
| Shrinks to a circle | On | On clips the button's color into a circle around the spinner; off keeps its full shape and changes only what is inside |
| How long it loads | Medium | How long the spinner turns before the answer: short is 0.7 seconds, medium 1.2 and long 2.2; in a real form this is the server's time |

## Production notes
- **`aria-disabled`, not `disabled`**: a button that becomes `disabled` while it has the focus drops the focus to the page, and keyboard users lose their place. Keep it focusable, mark it `aria-disabled="true"` and ignore presses in your handler.
- **Announce it**: the spinner and the icons are visual only. A `role="status"` region that says "Sending…" and then the result tells screen reader users what happened.
- **Do not flash it**: if most answers come back in under about 300ms, start the loading look only after that delay, or it flickers on every fast press.
- **Say what failed**: a cross says that it failed, not why. Keep a message near the form for errors the visitor can fix, and leave what they typed in place.
- **Long waits**: past a few seconds a spinner in a button feels stuck. Use a progress bar for uploads and other long tasks.
- **Never animate the width**: the button's place in the layout keeps its size, so the form does not jump while it shrinks; only the clip and the color layer change.
- **GSAP**: `gsap.to(bg, { clipPath: "inset(0% 41% 0% 41% round 26px)", duration: 0.3, ease: "power3.out" })`, with the starting clip written in the same percentages.
- **Framer Motion**: `<motion.span animate={{ clipPath: busy ? "inset(0% 41% 0% 41% round 26px)" : "inset(0% 0% 0% 0% round 26px)" }} />` on the color layer, and `AnimatePresence` to swap the label, the spinner and the icons.

## See also
- [Checkmark Draw](../checkmark-draw/) — a tick that draws itself once a task succeeds
- [Loading Spinner](../loading-spinner/) — six small shapes that show something is loading
- [Error Shake](../error-shake/) — a shake that says the input was wrong
- [Button Press Scale](../button-press-scale/) — the button shrinks while it is pressed
- [Hold to Confirm](../hold-to-confirm/) — a button that fills while you hold it and acts only when full
