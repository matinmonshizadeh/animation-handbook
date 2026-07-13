# View Transitions API

## What it is
The View Transitions API is a browser feature that animates between two DOM states without you having to coordinate the old and new elements by hand. You call `document.startViewTransition()` and pass a callback that mutates the DOM; the browser snapshots the page before and after, then cross-fades or otherwise animates between the two snapshots. The choreography is customized entirely through CSS pseudo-elements, so the same JavaScript can drive a fade, a slide, or a zoom.

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
  const prev=current;current=next;
  document.documentElement.dataset.vt = style==='crossfade' ? '' : style;
  if(supportsVT){
    const t = document.startViewTransition(()=>switchPage(prev,next));
    await t.finished;
  }else{
    /* manual opacity fallback */
  }
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

Switching the `data-vt` attribute swaps in a different keyframe set (slide, zoom, or a rotate-based custom style), so one code path produces four distinct transitions. `t.finished` resolves when the animation completes, which the demo awaits to gate re-entry.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| `--vt-dur` | 500ms | Snapshot animation length; under ~150ms reads as an instant swap |
| `--vt-ease` | ease-in-out | Timing curve applied to both old and new pseudo-elements |
| `view-transition-name` | `page-content` | Names the tracked region; each name animates as its own snapshot pair |
| Transition style | crossfade | Selects the keyframe set (crossfade / slide / zoom / custom rotate) |

## Production notes
- **Feature-detect** with `'startViewTransition' in document` and fall back to a manual opacity cross-fade — the demo does exactly this so unsupported browsers still transition.
- **Suppress the root animation** (`::view-transition-old(root)`) when you only want a sub-region to animate; otherwise the whole page cross-fades underneath your named region.
- **Every `view-transition-name` must be unique** on the page at capture time. Two elements sharing a name in the same snapshot throws and aborts the transition.
- **Honor reduced motion** — the demo drops straight to `switchPage()` with no animation when `prefers-reduced-motion: reduce` is set.
- **Library equivalents**: Astro's `<ViewTransitions />` and Next.js's experimental view-transition support wrap this API for cross-document navigation. Barba.js and Swup predate it and polyfill the same idea with manual snapshotting; on supported browsers you often no longer need them.

## See also
- [Crossfade](../crossfade/) — the default View Transitions style, built manually for comparison
- [Slide Transition](../slide-transition/) — the slide keyframe set as a standalone technique
- [Zoom Transition](../zoom-transition/) — the zoom keyframe set as a standalone technique
- [Shared Element Transition](../shared-element-transition/) — continuity for a single element rather than the whole page
