# Smooth (Inertia) Scroll

[Live demo](index.html)

## What it is

Smooth scroll captures the user's wheel and touch input, converts it into a target scroll position, and then eases the content toward that target a little each frame instead of jumping to it. The result is a weighted, gliding motion with momentum — the feel popularized by libraries like Lenis and Locomotive Scroll — rather than the browser's instant, one-to-one native scroll.

## When to use it

- Marketing and portfolio sites where a deliberate, cinematic scroll pace reinforces the brand
- Scroll-driven storytelling where you want animations to feel synchronized with a smoothed scroll value
- Interfaces pairing smooth scroll with parallax or scrubbed timelines, so every scroll-linked effect shares one eased source of truth
- Cases where you control the whole page experience and can accept the accessibility trade-offs below

Avoid it for dense, utility-first content (dashboards, docs, long forms) where users expect scroll to track their input exactly.

## How it works

Two numbers are kept: `target` (where scroll wants to be) and `current` (where the content sits right now). Input events move only the target. A `requestAnimationFrame` loop moves `current` a fraction of the remaining distance toward `target` every frame — a linear interpolation, or lerp — and writes that value to the inner content as a `translate3d`, a compositor-only transform.

```js
// input only nudges the target
stage.addEventListener('wheel', e => {
  e.preventDefault();
  target = clamp(target + e.deltaY, 0, maxScroll);
}, { passive: false });

// each frame eases current toward target
function loop() {
  current += (target - current) * ease;          // ease ~0.09
  content.style.transform = `translate3d(0, ${-current}px, 0)`;
  requestAnimationFrame(loop);
}
```

Touch drag uses Pointer Events: on `pointerdown` the current target is captured, and `pointermove` offsets it by the drag distance, so the same target/current machinery serves both mouse wheel and finger drag. The gap between `target` and `current` is what produces momentum: a flick pushes `target` ahead, and `current` coasts after it until the two converge.

The demo keeps all of this inside a scoped stage element with `overflow: hidden` — it never touches `window` scroll — so it embeds without hijacking the page.

## Key parameters

| Parameter | Typical | Effect |
|-----------|---------|--------|
| Ease / lerp factor | `0.05`–`0.2` | Fraction of the remaining gap closed per frame. Lower = heavier, floatier glide; higher = tighter, closer to native. |
| `maxScroll` | `content.scrollHeight − stage.clientHeight` | Clamp bound for `target`; recomputed on resize. |
| `deltaY` multiplier | `1` | Scales wheel input into scroll distance; raise for faster travel per notch. |
| Convergence epsilon | `~0.1px` | Snap `current` to `target` below this gap to end the loop cleanly and avoid sub-pixel jitter. |

A fixed lerp factor is frame-rate dependent — the same value settles faster on a 120Hz display than on 60Hz. For rate-independent easing, scale the factor by delta time: `1 - Math.pow(1 - ease, dt * 60)`.

## Production notes

- **Use a real library in production.** [Lenis](https://github.com/darkroomengineering/lenis) is the current standard; [Locomotive Scroll](https://github.com/locomotivemtl/locomotive-scroll) predates it. They handle wheel normalization across browsers, touch and trackpad quirks, anchor links, and integration hooks (e.g. GSAP ScrollTrigger) that a hand-rolled loop will miss.
- **Do not break keyboard and anchor scrolling.** Native scroll responds to Page Up/Down, Space, arrow keys, Home/End, tab-to-focus, and `#anchor` jumps. A naive hijack silently disables all of these. Real libraries re-implement them; if you roll your own, you must too.
- **Respect `prefers-reduced-motion`.** Smoothed scroll is exactly the kind of motion some users find disorienting or nauseating. When the user requests reduced motion, fall back to native, instant scroll with no lerp — this demo locks itself into native mode in that case.
- **Watch scroll-position pitfalls.** Because the real scroll position is faked with a transform, `position: sticky`, `scrollIntoView`, `IntersectionObserver` thresholds, and browser scroll restoration can all read the wrong offset. Anything that depends on native scroll geometry needs to be fed the smoothed value instead.
- **Don't hijack global scroll casually.** Taking over `window` scroll affects find-in-page, the scrollbar's drag behavior, and assistive tech. Scoping the effect to a contained element (as here) is safer; page-wide smoothing should be a deliberate, tested decision.
- **SEO and reliability.** Content is present in the DOM, so it remains crawlable, but any JS failure can leave the page unscrollable. Ensure a graceful fallback to native scroll if the script errors or never runs.

## See also

- [Parallax Scrolling](../parallax-scrolling/) — layers moved at different rates; pairs naturally with a smoothed scroll source.
- [Scrub Animation](../scrub-animation/) — driving a timeline from scroll position, the effect smooth scroll makes feel fluid.
- [Horizontal Scroll](../horizontal-scroll/) — converting vertical scroll into lateral motion, another scroll-remapping technique.
