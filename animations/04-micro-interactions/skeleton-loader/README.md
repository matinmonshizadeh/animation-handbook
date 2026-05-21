# Skeleton Loader

## What it is
A skeleton loader is a set of placeholder shapes — gray blocks matching the layout of real content — displayed while data loads. The blocks pulse subtly to signal active loading. Unlike a spinner, a skeleton tells the user what shape of content is coming, which measurably reduces perceived wait time even when actual load time is identical.

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
| Pulse speed | 1.5s | 1–2s is the natural breathing range; faster feels anxious |
| Min opacity | 0.5 | Lower = more dramatic pulse; 0.4–0.6 is subtle |
| Shape fidelity | Medium | Match line heights, avatar sizes, image ratios exactly for best effect |
| Content fade | 400ms | Instant swap feels jarring; 300–500ms is smooth |

## Production notes
- **Shape matching matters**: a skeleton that doesn't match the incoming content causes layout shift and undermines the effect. Measure real content dimensions and match them.
- **Avoid animating too many skeletons simultaneously** on a single page — 3–4 independent pulsing elements is the limit before the screen starts to feel chaotic.
- **Real data approximation**: if you know the content length, dynamically size the skeleton lines to match (e.g., profile names are typically 1–2 lines; descriptions are 3–4).
- **`prefers-reduced-motion`**: disable the pulse animation entirely for users who request it. A static gray block is still a valid skeleton loader.
- **React**: `react-loading-skeleton` (by Dvtng) is the standard library. It auto-matches skeleton widths to inline text nodes.
- **Pairing**: skeleton + shimmer (see [Shimmer Effect](../shimmer-effect/)) is the most polished loading state — pulse for structure, shimmer for motion.

## See also
- [Shimmer Effect](../shimmer-effect/) — gradient sweep enhancement for skeleton loaders
- [Loading Spinner](../loading-spinner/) — alternative for unknown-duration loads
- [Progress Animation](../progress-animation/) — alternative when total progress is known
