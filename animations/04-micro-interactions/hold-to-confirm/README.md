# Hold to Confirm

## What it is
Hold to confirm is a button that acts only after it has been held down for a moment. While it is held, a fill grows across it or around it; when the fill is full, the action runs and a tick shows. Letting go early drains the fill and nothing happens, so a stray tap or click can never delete anything.

## When to use it
- Deleting files, projects or messages that cannot be restored
- Closing an account or canceling a plan
- Sending money or confirming a payment on a phone
- Emergency and alert buttons that must not go off by accident
- Places where a confirm dialog would interrupt too much, but a single tap is too easy

## How it works
One number, `p`, says how full the button is, from 0 to 1. A frame loop moves it by the time that has passed: up while the button is held, down while it is not. The same number drives both looks, so the Fill style setting only changes which one is shown:

```js
let p = 0, holding = false, last = null;
function frame(ts) {
  const dt = last === null ? 0 : Math.min(ts - last, 50); // elapsed time: 60 Hz and 120 Hz screens fill alike
  last = ts;
  p = holding ? Math.min(1, p + dt / holdMs) : Math.max(0, p - dt / drainMs);
  fill.style.transform = `scaleX(${p})`;   // Bar: grows from the left edge
  ring.style.strokeDashoffset = 1 - p;     // Ring: a <circle pathLength="1">, turned -90deg to start at the top
  if (p >= 1) return confirm();            // the press is used up; letting go now changes nothing
  if (holding || p > 0) requestAnimationFrame(frame);
}
```

```css
.hold { position: relative; overflow: hidden; touch-action: none; user-select: none; -webkit-touch-callout: none; }
.fill { position: absolute; inset: 0; transform: scaleX(0); transform-origin: left center; }
.ring .rf { stroke-dasharray: 1; stroke-dashoffset: 1; }
```

Pressing and letting go come from the pointer and from the keyboard. The pointer is captured on `pointerdown`, so the press continues if the finger slides off the button, and `pointerup`, `pointercancel` and `lostpointercapture` all count as letting go. Space and Enter start a hold on `keydown` (ignoring the repeats a held key sends) and end it on `keyup` or `blur`. Letting go before the fill is full restarts a short shake animation on the button's wrapper (so it never fights the press scale on the button itself) and fades in a hint to keep holding. When the fill is full the trash icon and label crossfade to a tick and Drafts deleted, and a `role="status"` region says so; in the demo everything drains back a second later so it can be tried again. Under reduced motion the fill is drawn in quarters (`Math.floor(p * 4) / 4`), so it steps instead of sliding, and the shake is skipped.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| How long to hold | Medium | How long the button must be held before it acts: short is 0.8 seconds, medium 1.5 and long 2.5; under about half a second it no longer guards against a stray tap, over three seconds it feels stuck |
| Fill style | Bar | Bar fills the whole button from left to right; Ring fills a ring around a round button, clockwise from the top |
| Shakes if let go early | On | A short side-to-side shake when the button is let go before it is full; the hint to keep holding shows either way |
| How fast it drains | Quickly | How long a full fill takes to run back out when it is let go: quickly is 0.4 seconds, slowly 1.5 |

## Production notes
- **Offer a second way**: some people cannot hold a press steadily, and some assistive technology sends a click with no press at all. Keep another path to the same action, such as a confirm dialog or an undo, and say in the button's label or description that it needs a press and hold.
- **Keyboard**: a held key repeats `keydown`, so ignore events with `e.repeat`, and treat `keyup` and `blur` as letting go, or Tab pressed during a hold leaves the button filling with nothing held.
- **Touch**: `touch-action: none` stops the browser from turning a finger that drifts a little into a scroll, which would cancel the pointer. `-webkit-touch-callout: none`, `user-select: none` and a `contextmenu` handler that calls `preventDefault()` keep a long press from opening the callout, selecting text or showing the menu. Always listen for `pointercancel`.
- **Time, not frames**: move the fill by elapsed time. A loop that adds a fixed amount each frame fills twice as fast on a 120 Hz screen and half as fast on a phone that drops to 30 Hz.
- **Say what happened**: announce the result in a `role="status"` live region ("Old drafts deleted"), and the early let-go too, since the hint and the shake are visual.
- **GSAP**: `const t = gsap.to(fill, { scaleX: 1, duration: 1.5, ease: "none", paused: true, onComplete: confirm })`, then `t.timeScale(1).play()` on press and `t.timeScale(4).reverse()` on release.
- **Framer Motion**: with `useAnimate()`, call `animate(fill, { scaleX: 1 }, { duration: 1.5, ease: "linear" })` on press and keep its controls; on release stop them and animate `scaleX` back to 0, and run the action in the first animation's `.then()` only if it was not stopped.

## See also
- [Button Press Scale](../button-press-scale/) — the button shrinks while it is pressed
- [Progress Animation](../progress-animation/) — bars and rings that fill to show progress
- [Error Shake](../error-shake/) — a shake that says the input was wrong
- [Checkmark Draw](../checkmark-draw/) — a tick that draws itself once a task is done
