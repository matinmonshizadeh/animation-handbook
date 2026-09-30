# Skeleton Loader

## What it is
A skeleton loader shows gray placeholder shapes in the layout of the content that is on its way. The blocks pulse gently to show that loading is going on, and the real content fades in over them when it arrives. Because people see the shape of what is coming, the wait feels shorter than it does with a blank area or a spinner.

## When to use it
- Social feeds, cards, and lists where content arrives from an API
- Dashboard widgets that load independently
- Image galleries where dimensions are known before the image loads
- Any interface where users would otherwise stare at a blank white area

## How it works
Skeleton blocks are plain `<div>` elements styled to match the shape of expected content. A CSS animation pulses their opacity:

```css
.skel {
  background: #1a1f28;
  border-radius: 4px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1;   }
}
```

When real content arrives, fade the skeleton out and the content in:

```js
async function load() {
  showSkeleton();
  const data = await fetchData();
  hideSkeleton();
  showContent(data);
}

function hideSkeleton() {
  skeletonEl.style.display = 'none';
  contentEl.style.opacity = '1'; // triggers CSS transition
}
```

The content element needs `opacity: 0; transition: opacity 400ms ease` to fade in smoothly.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Pulse speed | Normal | How long one pulse takes: slow is 2.4s, normal 1.5s and fast 0.9s; one to two seconds feels calm, faster feels anxious |
| Pulse strength | Medium | How far the blocks fade between pulses: soft, medium or strong; a soft pulse is enough |
| Loading time | Medium | How long the placeholders show before the content fades in: short is 1s, medium 2s and long 3.5s |

## Production notes
- **Shape matching matters**: a skeleton that doesn't match the incoming content causes layout shift and undermines the effect. Measure real content dimensions and match them.
- **Avoid animating too many skeletons simultaneously** on a single page — 3–4 independent pulsing elements is the limit before the screen starts to feel chaotic.
- **Real data approximation**: if you know the content length, dynamically size the skeleton lines to match (e.g., profile names are typically 1–2 lines; descriptions are 3–4).
- **`prefers-reduced-motion`**: disable the pulse animation entirely for users who request it. A static gray block is still a valid skeleton loader.
- **React**: `react-loading-skeleton` (by Dvtng) is the standard library. It auto-matches skeleton widths to inline text nodes.
- **Pulse or shimmer**: a skeleton shows loading either by pulsing, as here, or with a sweeping band of light ([Shimmer Effect](../shimmer-effect/)); pick one, since the two together are redundant and visually loud.

## See also
- [Shimmer Effect](../shimmer-effect/) — a band of light sweeps across the placeholders
- [Loading Spinner](../loading-spinner/) — a spinner for waits of unknown length
- [Progress Animation](../progress-animation/) — a bar that shows how much is done
