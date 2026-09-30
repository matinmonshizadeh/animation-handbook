# Counter Animation

[Live demo](index.html)

## What it is

A counter animation counts numbers up from zero to their totals when they scroll into view, so a row of statistics seems to arrive rather than just sit there. Each number keeps its commas, currency sign or unit the whole way up, and usually slows down as it reaches its total, so it settles into place.

## When to use it

- Stats and metrics sections where raw numbers need visual emphasis on first impression
- Annual reports, dashboards, and SaaS landing pages showing key figures
- Any context where "the number settling into place" communicates arrival rather than a static display
- Loading sequences where counters fill in as data resolves

## How it works

An IntersectionObserver watches the stats container and fires when it crosses a configurable threshold inside the internal scroll viewport:

```js
const margin = -(100 - threshold); // e.g. threshold 60 → margin -40
observer = new IntersectionObserver(entries => {
  if (entries[entries.length - 1].isIntersecting && !running) animateCounters();
}, { root: stage, rootMargin: `0px 0px ${margin}% 0px`, threshold: 0 });
observer.observe(document.getElementById('stats'));
```

`root: stage` is essential — the stage scrolls internally. Without it, the observer defaults to the document viewport and never fires because the stats element is always "visible" at the page level.

The rAF loop interpolates from 0 to target using elapsed time and an easing function:

```js
function frame(now) {
  const t = Math.min((now - begun) / duration, 1);   // begun: when this number's own count started
  const v = target * easeFn(t);
  el.textContent = format(v);          // formatted every frame
  if (t < 1) requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
```

Formatting happens on every frame — not just at the end. This ensures commas, currency symbols, and units appear throughout the animation, not suddenly at the final value.

Every count starts from zero. The observer decides when the numbers may start; each number then starts once the one before it has (plus the cascade gap) and once half of it is inside the box, so a number that is still below the box when the stats container passes the line is seen counting when it scrolls in. The speed, the curve and the cascade are read when a count starts, so a change shows from the next count. With reduced motion turned on, the numbers jump straight to their totals.

The revenue number changes format as it grows, from dollars to thousands to millions, so its widest string is never wider than the final "12,847" and always fits its tile on a phone.

A second observer, shrunk by 8px at the bottom, watches for the stats container leaving the box altogether; it stops any count in progress and puts the numbers back to zero, so after Back to top or Play at the end they scroll in at zero again instead of showing the old totals first. Its margin is smaller than any of the lines a count starts at, so the counting observer has always let go first and a count can start again on the way down.

The four Feel choices use these curves: Even is `linear`, Smooth is `outCubic`, Slow finish is `outExpo` and Springy is `outBack`:

```js
const EASE = {
  linear:   t => t,
  outCubic: t => 1 - (1 - t) ** 3,
  outExpo:  t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  outBack:  t => { const c = 1.70158; return 1 + (c+1)*Math.pow(t-1,3) + c*Math.pow(t-1,2) }
};
```

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Starts counting | Middle | The line the top of the tiles must pass before the numbers may count: early is a tenth of the way up the box, middle 40% of the way up and late 70%. Each number then waits until half of it is inside the box, so on a short box early and middle start at almost the same place |
| Speed | Normal | How long each count takes: slow is 2.9 s, normal 1.8 s and fast 1.1 s |
| Feel | Smooth | Smooth slows to a stop; Slow finish races to near the total, then creeps through the last digits; Springy goes a little past and settles back; Even counts at one steady pace, which feels mechanical |
| One after another | on | Each number starts 200ms after the one before, so the four count in a cascade |

## Production notes

- **`root` must point to the internal scroll container, not the document.** If the stats section lives inside a custom scroll container, `root: null` (the default) observes against the page viewport — the section appears "in view" immediately and the observer never fires on actual scroll. Always pass `root: stage` (or whichever element has `overflow-y: scroll`).
- **`rootMargin` percentages are relative to the root's bounding box.** With `root: stage`, `-40%` means 40% of the stage height, not the window. This keeps the threshold position consistent regardless of the window size.
- **Format every frame, not just at the end.** Formatting only on completion causes a jarring jump from raw decimal to formatted string. A counter running 0 → 12,847 should show commas from the first frame it crosses 1,000.
- **`easeOutBack` overshoots.** The value briefly exceeds the target before settling. For counters this means the display may show a number higher than the target for a frame or two. Use `outCubic` or `outExpo` when the target value must never be exceeded visually.
- **GSAP equivalent:** `gsap.to(obj, { val: target, duration: 1.8, ease: "power3.out", onUpdate: () => el.textContent = format(obj.val) })`. CountUp.js is a dedicated library for this pattern with locale-aware formatting built in.

## See also

- [Reveal on Scroll](../reveal-on-scroll/) — cards appear as they scroll into view
- [Stagger Reveal](../stagger-reveal/) — items appear one after another as their group scrolls in
