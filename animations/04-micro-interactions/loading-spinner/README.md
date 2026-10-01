# Loading Spinner

## What it is
A loading spinner is a small shape that keeps moving in a loop to show that the system is busy. It says nothing about how long the wait will be, only that work is going on, so it suits waits of unknown length, such as a network request. The demo shows six common designs.

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
| Speed | Normal | How long one turn takes: slow is 1.3s, normal 0.8s and fast 0.5s; 0.6 to 1 second reads as calm, faster as anxious |
| Size | Medium | Small is 28px, medium 40px and large 52px; small fits inside a button, large fills an empty area |
| Color | Blue | The spinner's color; pick one that stands out from the page |

## Production notes
- **Minimum display time**: if the operation completes in under ~400ms, either show no spinner at all or enforce a minimum display time. A spinner that flashes briefly causes more confusion than it resolves.
- **Inline button spinner**: replace the button label with a spinner on click, re-enable on response. This pattern prevents double-submission.
- **`role="status"` and `aria-label`**: screen readers need to announce the loading state. Add `role="status"` and `aria-label="Loading"` to the spinner container.
- **`prefers-reduced-motion`**: under reduced motion the demo starts paused, so the spinners stay still until the visitor presses Play. In production, reduce the spinner to a simple opacity pulse, or hide it and rely on an `aria-live` announcement.
- **React ecosystem**: `react-spinners` (by David Hu) has 15+ variants. For Tailwind, use the `animate-spin` utility on a bordered circle div.
- **When not to use**: if you know total progress (file upload, multi-step process), use a progress bar instead — it conveys more information and reduces anxiety.

## See also
- [Progress Animation](../progress-animation/) — a bar that shows how much is done
- [Skeleton Loader](../skeleton-loader/) — gray shapes stand in for the content
- [Checkmark Draw](../checkmark-draw/) — the success sign once the wait is over
- [Typing Indicator](../typing-indicator/) — three dots in a chat bubble show that someone is typing
