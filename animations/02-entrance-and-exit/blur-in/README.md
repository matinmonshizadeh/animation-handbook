# Blur In

## What it is

Blur In fades an element into view while it sharpens from a heavy blur to crisp focus, like a camera pulling focus onto a subject. The rising opacity and falling blur feel cinematic because they echo how a real lens resolves an image, unlike the flat look of a plain fade.

## When to use it
- Hero cards, modals, and single focal elements entering a view
- Photography, film, and portfolio sites where the camera metaphor fits the brand
- Drawing attention to one arriving element, not a grid or list of them
- Paired with a small upward translate for a subtle "settling into place" feel

## How it works
Three properties transition together on the same duration and easing: `opacity` from 0 to 1, `filter: blur()` from a large radius to zero, and an optional `translateY`. The blurred start state lives on the base `.card` rule; adding `.in` resolves all three at once:

```css
.card{
  opacity:0;filter:blur(var(--blur-start));transform:translateY(var(--ty));
  transition:opacity var(--dur) var(--ease),
             filter var(--dur) var(--ease),
             transform var(--dur) var(--ease);
  will-change:opacity,filter,transform}
.card.in{opacity:1;filter:blur(0);transform:translateY(0)}
```

Toggling in JS is just a class flip after forcing a reflow so the transition restarts cleanly:

```js
card.classList.remove('in');void card.offsetWidth;
card.classList.add('in');
```

The blur-only and fade-only modes exist to show that the two channels are separable — blur alone feels like focus without arrival, fade alone is the ordinary transition. Combined, they read as a lens finding its subject.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Mode | Blur + Fade | The full effect; Blur only and Fade only show each half on its own |
| Starting blur | 20px | Higher is a more dramatic focus pull; past about 30px it looks like frosted glass |
| Duration | 700ms | Blur needs a little longer than a plain fade for the lens feel to land |
| Easing | Ease out | Slowing down mimics a lens settling; Linear feels robotic |
| Slight upward drift | on | A small rise while it sharpens, as if it is settling into place |

## Production notes
- **GPU cost**: `filter: blur()` is one of the more expensive properties to animate. It forces the element onto its own compositor layer and re-rasterizes each frame. Limit blur-in to a single hero element or a small group — never a long list, and be cautious on low-end mobile.
- **`will-change`**: declaring `will-change:filter` promotes the layer ahead of time and smooths the first frame, but leaving it on permanently wastes memory. Add it before the animation, remove it after if the element is long-lived.
- **Reduced motion**: the demo drops to a plain 300ms linear opacity fade with no blur or transform when `prefers-reduced-motion` is set — blur can be nauseating for motion-sensitive users.
- **Text blur pitfall**: blurring live text triggers subpixel re-rendering each frame and can look muddy mid-transition. Keep the end state at exactly `blur(0)` so the final frame is crisp.
- **Framer Motion**: animate `filter` between `"blur(20px)"` and `"blur(0px)"` alongside `opacity` in a variant.
- **Motion One / GSAP**: both animate the `filter` string directly; GSAP needs no plugin for CSS filters.

## See also
- [Fade In / Out](../fade-in-out/) — the opacity channel on its own
- [Scale In](../scale-in/) — another single-element focal entrance
- [Flip In](../flip-in/) — a more three-dimensional arrival for the same hero slot
