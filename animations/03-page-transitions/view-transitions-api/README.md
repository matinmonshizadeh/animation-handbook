# View Transitions API

## What it is
The View Transitions API is a browser feature that animates a change of page for you. You tell the browser when the page is about to change; it takes a picture of the page before and after, then animates from one picture to the other. CSS decides how the pictures move, so the same click can fade, slide, zoom or tilt.

## When to use it
- Same-document navigation in SPAs where you swap page content in place
- Multi-page navigation where you want a native-feeling transition between full documents (with the cross-document variant)
- Cases where the before/after DOM is complex and hand-animating each element would be error-prone
- When you want the transition style to be a CSS concern, decoupled from the navigation logic

## How it works
Wrap the DOM mutation in `startViewTransition()`. The browser captures the current frame, runs the callback, captures the new frame, and animates between them. A named region — set with `view-transition-name` — is tracked as its own snapshot pair, and CSS pseudo-elements animate the old and new captures independently:

```js
async function navigate(next){
  if(next===current||animating)return;
  animating=true;current=next;
  document.documentElement.dataset.vt = style==='crossfade' ? '' : style;
  document.documentElement.style.setProperty('--vt-dur', dur+'ms');
  if(supportsVT){
    const t = document.startViewTransition(()=>showPage(current));
    await t.finished;
  }else{
    /* manual opacity fallback */
  }
  animating=false;
}
```

```css
.page-area{ view-transition-name: page-content; }
/* Suppress the default root cross-fade; only page-content animates */
::view-transition-old(root),::view-transition-new(root){ animation:none }
::view-transition-old(page-content){ animation:vt-out var(--vt-dur) var(--vt-ease) both }
::view-transition-new(page-content){ animation:vt-in  var(--vt-dur) var(--vt-ease) both }
@keyframes vt-out{ from{opacity:1} to{opacity:0} }
@keyframes vt-in { from{opacity:0} to{opacity:1} }
```

Switching the `data-vt` attribute swaps in a different keyframe set (slide, zoom, or a slight tilt), so one code path produces four distinct transitions, and Speed and Feel set the `--vt-dur` and `--vt-ease` custom properties the keyframes read. `t.finished` resolves when the animation completes, which the demo awaits to gate re-entry. The update callback shows the resting state for the current page as it is when the callback runs, so a transition that is skipped (by Reset, or by pressing Show me again) cannot bring back an older page.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Transition style | Fade | Fade blends the two pictures; Slide pushes the old one out to the left as the new one comes in from the right; Zoom shrinks the old one away as the new one settles from slightly larger; Tilt turns both slightly as they fade |
| Speed | Normal | How long the change takes: slow is 800ms, normal 500ms and fast 300ms; under about 150ms it reads as an instant swap |
| Feel | Gentle | Gentle eases in and out; Smooth slows to a stop; Even keeps one steady pace |

## Production notes
- **Feature-detect** with `'startViewTransition' in document` and fall back to a manual opacity cross-fade — the demo does exactly this, so browsers without the API still get a simple 300ms fade, whatever the Transition style and Speed.
- **Suppress the root animation** (`::view-transition-old(root)`) when you only want a sub-region to animate; otherwise the whole page cross-fades underneath your named region.
- **Every `view-transition-name` must be unique** on the page at capture time. Two elements sharing a name in the same snapshot throws and aborts the transition.
- **Honor reduced motion** — the demo drops straight to `showPage()` with no animation when `prefers-reduced-motion: reduce` is set.
- **Library equivalents**: Astro's `<ViewTransitions />` and Next.js's experimental view-transition support wrap this API for cross-document navigation. Barba.js and Swup predate it and polyfill the same idea with manual snapshotting; on supported browsers you often no longer need them.

## See also
- [Crossfade Transition](../crossfade/) — the same fade, built by hand
- [Slide Transition](../slide-transition/) — pages slide, with a sense of direction
- [Zoom Transition](../zoom-transition/) — three ways to zoom between pages
- [Shared Element Transition](../shared-element-transition/) — one picture grows into the next page
