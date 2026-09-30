# ScrollTrigger Animation

[Live demo](index.html)

## What it is

Scroll triggers start, follow or hold animations at chosen points as you scroll. Each zone of a page is either still ahead, on screen or already passed, and moving between those states starts or reverses its animation. The demo shows four common uses: fading content in as it arrives, tying an animation to the scroll, pinning a card while it changes, and lighting up steps. In production the GSAP ScrollTrigger plugin handles all of this; the demo does it by hand.

## When to use it

- Any element that should animate exactly once as it enters the viewport
- Product reveals, feature lists, and section transitions requiring scroll-coordinated timing
- Marketing pages that must remain accessible without JavaScript by having logical resting states
- Any scenario requiring precise callbacks at scroll boundaries, not just "is it visible?"

## How it works

Everything derives from one number: where the scroll container currently sits. Each zone reduces to three states, and the four callbacks are simply the transitions between them.

```js
// zone tops measured against the stage, cached — NOT offsetTop, see production notes
const state = i => {
  const vt = stage.scrollTop;
  if (vt + viewport <= top[i]) return 'idle';   // not reached yet
  if (vt >= top[i] + height[i]) return 'past';  // scrolled beyond
  return 'active';
};
```

A change of state is a callback. Which one depends on the direction the state moved (the demo shows them through the text in zone 1, which fades in on enter and hides on leave):

```js
if (s !== prev[i]) {
  const ev = s === 'active' ? (prev[i] === 'idle' ? 'onEnter' : 'onEnterBack')
                            : (s === 'past'       ? 'onLeave' : 'onLeaveBack');
  prev[i] = s;   // run the zone's enter or leave animation for ev
}
```

Scrubbing uses the same scroll position, normalised to `0–1` and clamped, then applied directly to transforms. Because it is clamped rather than gated on the active state, it resolves to 0 before its window and 1 after it — so a zone you skipped past still ends up in its finished state. The window belongs to the piece that animates (the square, the row of dots), not to the zone around it: here a zone is nearly a box tall and centres its content, so a window keyed to the zone's top would run before the piece could be seen:

```js
// follow window: 0 as the piece's centre passes 80% down the box, 1 at 25%
// (centre: the middle of its layout box, measured against the stage and cached like the zone tops)
const p = clamp((stage.scrollTop - (centre - 0.8 * viewport)) / (0.55 * viewport), 0, 1);
swatch.style.transform = `rotate(${p * 180}deg) scale(${lerp(1, 1.3, p)})`;
swatch.style.filter    = `hue-rotate(${p * 120}deg)`;
```

A pinned zone is the exception. It scrubs over the distance it is *held*, not
over the window in which it enters, so its progress is measured against the
overflow between the zone and the viewport:

```js
// pin span: 0 as the zone top meets the container top, 1 as its bottom meets the bottom
const p = clamp((stage.scrollTop - top[i]) / (height[i] - viewport), 0, 1);
```

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Zone height | 90% of the box (zone 3: twice the box) | How much scrolling each zone takes |
| Follow window | From 80% to 25% down the box | The square in zone 2 and the row of dots in zone 4 play while their own centre rises between these two lines, so each plays in full view |
| Pinned span | Zone 3's height less one box | How long the card holds still; its three stages share it equally |
| Run-out | One box height | Space after the last zone, so it can finish and leave |

## Production notes

- **GSAP ScrollTrigger** is the production standard. It handles scroll direction, pinning, scrubbing, snapping, and lifecycle callbacks with a clean declarative API. The vanilla JS approach here is educational — it replicates the underlying mechanics without GSAP's optimizations.
- **`IntersectionObserver` vs. scroll events.** IO is the right tool for lifecycle callbacks (enter/leave); scroll-position arithmetic is right for scrubbing. This demo derives both from scroll position so the two stay in lockstep — with IO the callback and the scrub can disagree by a frame.
- **Anchor the scrub to where the section *enters*, not to where it reaches the top.** Measuring progress as `scrollTop − zoneTop` keeps it at zero until the section's top has climbed all the way to the top of the viewport — by which point the reader has watched a full screen of it sit motionless, and the animation only plays as it leaves. That reads as a broken or badly late trigger. A common GSAP setting, `start: "top 80%"` / `end: "top 20%"`, begins just after the section appears and finishes as it settles; here that moved each trigger roughly 0.8 of a viewport earlier. Anchor it to the piece that animates, too: a zone that is nearly a box tall and centres its content puts the piece half a box below the zone's top, so the demo uses `start: "center 80%"` / `end: "center 25%"` on the square and on the row of dots, and the animation plays where it can be seen.
- **`offsetTop` is not in the scroll container's coordinate space.** It is measured from the nearest *positioned* ancestor, which for a plain `overflow: scroll` panel is usually `body` — so it includes every pixel of page chrome above the container, while `scrollTop` starts at zero inside it. Comparing them directly put every trigger here 109px late. Measure the zone against the container's own box instead.
- **Prime the state before firing callbacks.** Comparing the first frame's state against a `null` starting value manufactures events that never happened: zone 1 would fire `onEnterBack` and zones 2–4 `onLeaveBack` before any scrolling. Record the initial state on the first pass and only emit transitions after that.
- **Evaluate every trigger each frame, not just the active ones.** Updating a zone only while it is active leaves whatever value it happened to stop on — jump past a zone and its scrub never runs at all, and scrolling back to the top left the pinned card still reading "Step 3 of 3". Clamped progress resolves to 0 before a zone and 1 after it, so both ends settle correctly on their own.
- **Leave a run-out after the last trigger.** A final zone with nothing beneath it can never scroll past the top, so it can neither finish its scrub nor fire `onLeave` — without it, the dots in zone 4 could never all light up. One viewport of trailing space is enough.
- **A pinned zone needs somewhere to be pinned.** `position: sticky` does nothing when the element's containing block is shorter than the scroll container — there is no overflow to hold it across. Zone 3 is deliberately two viewports tall so the card has one viewport of travel to stay fixed through; without that it scrolled straight past like any other card, and its three steps had all fired before it was on screen. Sticky also fails silently if any ancestor between it and the scroller has `overflow: hidden`.
- **Scrub and `will-change`.** For elements that update on every scroll frame, declare `will-change: transform` before the first frame to avoid promotion jank.
- **Snap-to-point** requires detecting scroll silence. A debounce timer (100–200ms) after the last scroll event is the reliable pattern; there is no native "scroll ended" event in most browser contexts.
- **Accessibility.** `onEnter` animations should respect `prefers-reduced-motion`. In reduced-motion mode, jump elements directly to their final state at page load.

## See also

- [Scrub Animation](../scrub-animation/) — scroll plays an animation forward and back
- [Pin Animation](../pin-animation/) — one part holds still while its text changes
- [Reveal on Scroll](../reveal-on-scroll/) — cards appear as they cross a line
