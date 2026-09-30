# Smooth (Inertia) Scroll

[Live demo](index.html)

## What it is

Smooth scroll makes scrolling glide. Instead of moving the content exactly as far as each turn of the wheel or swipe, it treats each one as a place to go and moves the content a little closer on every frame, so it speeds off, then slows to a stop. The result feels weighted, with momentum, rather than like the browser's instant scroll.

## When to use it

- Marketing and portfolio sites where a deliberate, cinematic scroll pace reinforces the brand
- Scroll-driven storytelling where you want animations to feel synchronized with a smoothed scroll value
- Interfaces pairing smooth scroll with parallax or scrubbed timelines, so every scroll-linked effect shares one eased source of truth
- Cases where you control the whole page experience and can accept the accessibility trade-offs below

Avoid it for dense, utility-first content (dashboards, docs, long forms) where users expect scroll to track their input exactly.

## How it works

Two numbers are kept: `target` (where scroll wants to be) and `current` (where the content sits right now). Input events move only the target. A `requestAnimationFrame` loop moves `current` a fraction of the remaining distance toward `target` every frame — a linear interpolation, or lerp — and writes that value to the inner content as a `translate3d`, a compositor-only transform. The loop only runs while the two differ: input starts it, and it stops once `current` is within a tenth of a pixel of `target`, so an idle box costs nothing.

```js
// input only nudges the target
viewport.addEventListener('wheel', e => {
  e.preventDefault();
  target = clamp(target + e.deltaY, 0, maxScroll);
  kick();                                        // starts the loop if it is idle
}, { passive: false });

// each frame eases current toward target, by a share that depends on how long the frame took
const FRAME = 1000 / 60;                         // ease is counted per 1/60 s
function loop(now) {
  const dt = last ? Math.min(now - last, 50) : FRAME;   // time since the last frame; 1/60 s for the first
  last = now;
  current += (target - current) * (1 - Math.pow(1 - ease, dt / FRAME));   // ease ~0.09
  if (Math.abs(target - current) < 0.1) current = target;
  content.style.transform = `translate3d(0, ${-current}px, 0)`;
  if (current !== target) requestAnimationFrame(loop);
}
function kick() { if (!raf) { last = 0; raf = requestAnimationFrame(loop); } }
```

Touch drag uses Pointer Events: on `pointerdown` the current target is captured, and `pointermove` offsets it by the drag distance, so the same target/current machinery serves both mouse wheel and finger drag. The gap between `target` and `current` is what produces momentum: a flick pushes `target` ahead, and `current` coasts after it until the two converge.

The keyboard moves the same target: in the glide mode a `keydown` handler on the box moves it 40px for an arrow key, 90% of the box for Page Up, Page Down and Space, and to the top or the bottom for Home and End.

The demo keeps all of this inside a scoped box with `overflow: hidden` — it never touches `window` scroll — so it embeds without hijacking the page.

The share moved each frame depends on how long the frame took. A fixed lerp factor per frame is frame-rate dependent: the same value settles twice as fast on a 120Hz display as on 60Hz, and half as fast on a 30Hz phone. Here `ease` is the share covered in 1/60 s, and a frame that lasted `dt` covers `1 - Math.pow(1 - ease, dt / FRAME)` of the distance left, so the distance left shrinks exponentially with time and the glide takes the same time on every screen. `kick()` clears `last`, so the first frame after a start counts as 1/60 s rather than the time since some old frame, and `dt` is capped at 50ms, so a hidden tab does not make the content jump.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Glide | Medium | How much of the remaining distance the content covers in a sixtieth of a second: long is 5%, medium 9% and short 16%; a longer frame covers more, so the glide takes as long on every screen; long feels heavy and floaty, short is closer to normal scrolling |
| Normal scrolling | off | Turns the glide off so the box scrolls the browser's own way, to compare the two |

## Production notes

- **Use a real library in production.** [Lenis](https://github.com/darkroomengineering/lenis) is the current standard; [Locomotive Scroll](https://github.com/locomotivemtl/locomotive-scroll) predates it. They handle wheel normalization across browsers, touch and trackpad quirks, anchor links, and integration hooks (e.g. GSAP ScrollTrigger) that a hand-rolled loop will miss.
- **Do not break keyboard and anchor scrolling.** Native scroll responds to Page Up/Down, Space, arrow keys, Home/End, tab-to-focus, and `#anchor` jumps. A naive hijack silently disables all of these. Real libraries re-implement them; if you roll your own, you must too.
- **Respect `prefers-reduced-motion`.** Smoothed scroll is exactly the kind of motion some users find disorienting or nauseating. When the user requests reduced motion, fall back to native, instant scroll with no lerp — this demo locks itself into native mode in that case.
- **Watch scroll-position pitfalls.** Because the real scroll position is faked with a transform, `position: sticky`, `scrollIntoView`, `IntersectionObserver` thresholds, and browser scroll restoration can all read the wrong offset. Anything that depends on native scroll geometry needs to be fed the smoothed value instead.
- **Don't hijack global scroll casually.** Taking over `window` scroll affects find-in-page, the scrollbar's drag behavior, and assistive tech. Scoping the effect to a contained element (as here) is safer; page-wide smoothing should be a deliberate, tested decision.
- **SEO and reliability.** Content is present in the DOM, so it remains crawlable, but any JS failure can leave the page unscrollable. Ensure a graceful fallback to native scroll if the script errors or never runs.

## See also

- [Parallax Scrolling](../parallax-scrolling/) — layers move at different speeds; pairs well with a glide
- [Scrub Animation](../scrub-animation/) — scroll-driven movement, which a glide makes smoother
- [Horizontal Scroll](../horizontal-scroll/) — scrolling down moves a row of panels sideways
