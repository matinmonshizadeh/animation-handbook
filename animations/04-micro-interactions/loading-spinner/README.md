# Loading Spinner

## What it is
A loading spinner is a looping animation indicating that the system is busy and the user should wait. Unlike a progress bar, it conveys no information about duration — only that work is happening. This makes it appropriate for unpredictably-timed operations like network requests, file processing, or authentication handshakes.

## When to use it
- Network requests where response time is unknown
- Authentication flows, payment processing, and other server-round-trip operations
- Background operations the user triggered but cannot cancel
- Inline loading states within buttons after click (replacing the label briefly)

## How it works
The classic ring spinner uses a `border` trick: a full circle with one quadrant colored differently, rotated continuously:

```css
:root { --spd: 800ms; --clr: #58a6ff; --sz: 40px; }

.sp-ring {
  width: var(--sz); height: var(--sz);
  border-radius: 50%;
  border: 3px solid rgba(255,255,255,.1);
  border-top-color: var(--clr);
  animation: spin var(--spd) linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
```

The SVG arc variant offers more control over arc length, which can also animate:

```css
.sp-arc circle {
  fill: none;
  stroke: var(--clr);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 60 100;
  animation: arc-pulse calc(var(--spd)*2) ease-in-out infinite;
}

@keyframes arc-pulse {
  0%,100% { stroke-dasharray: 15 100; }
  50%     { stroke-dasharray: 80 100; }
}
```

The bounce-dots variant uses staggered animation delays on three sibling elements:

```css
.dot { animation: bounce var(--spd) ease-in-out infinite; }
.dot:nth-child(2) { animation-delay: calc(var(--spd) * 0.15); }
.dot:nth-child(3) { animation-delay: calc(var(--spd) * 0.30); }

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-14px); }
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Speed | 800ms | 600–1000ms is the legible range; faster reads as anxious |
| Size | 40px | 20px inline, 40px full-screen, 60–80px for empty states |
| Color | accent | Should be distinct from the page background |
| Minimum display | 400ms | Flash a spinner for less than 400ms and hide it — the flash is worse than nothing |

## Production notes
- **Minimum display time**: if the operation completes in under ~400ms, either show no spinner at all or enforce a minimum display time. A spinner that flashes briefly causes more confusion than it resolves.
- **Inline button spinner**: replace the button label with a spinner on click, re-enable on response. This pattern prevents double-submission.
- **`role="status"` and `aria-label`**: screen readers need to announce the loading state. Add `role="status"` and `aria-label="Loading"` to the spinner container.
- **`prefers-reduced-motion`**: reduce to a simple opacity pulse or hide the spinner and rely on `aria-live` region announcements.
- **React ecosystem**: `react-spinners` (by David Hu) has 15+ variants. For Tailwind, use the `animate-spin` utility on a bordered circle div.
- **When not to use**: if you know total progress (file upload, multi-step process), use a progress bar instead — it conveys more information and reduces anxiety.

## See also
- [Progress Animation](../progress-animation/) — for known-duration or known-percentage loads
- [Skeleton Loader](../skeleton-loader/) — for content-shaped placeholders
- [Checkmark Draw](../checkmark-draw/) — the success state after a spinner resolves
