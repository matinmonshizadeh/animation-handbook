# Notification Badge Pulse

## What it is
A notification badge is a small indicator — a numbered chip or colored dot — overlaid on an icon to signal unread items. The pulse animation (a subtle scale loop) draws peripheral attention without demanding focus. It is one of the most restrained attention-capture patterns in UI: it works in the user's periphery without interrupting their current task.

## When to use it
- Notification bells with unread message counts
- Inbox or chat icons indicating new messages
- Avatar status dots indicating online presence
- Any persistent indicator that must remain visible but not disruptive

## How it works
The badge pulses via a looping `scale` keyframe animation:

```css
:root {
  --pulse-dur: 1500ms;
  --pulse-scale: 1.3;
  --badge-color: #f85149;
}

.badge {
  position: absolute;
  top: -8px; right: -8px;
  min-width: 22px; height: 22px;
  border-radius: 11px;
  background: var(--badge-color);
  border: 2px solid var(--page-bg);
  animation: badge-scale var(--pulse-dur) ease-in-out infinite;
}

@keyframes badge-scale {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(var(--pulse-scale)); }
}
```

The halo variant adds a radiating ring that expands and fades:

```css
.badge::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: var(--badge-color);
  opacity: 0.4;
  animation: halo-grow var(--pulse-dur) ease-out infinite;
}

@keyframes halo-grow {
  0%   { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(2.2); opacity: 0; }
}
```

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Duration | 1500ms | 800ms feels urgent; 3000ms is almost imperceptible; 1500ms is the peripheral-vision sweet spot |
| Scale | 1.3 | 1.1–1.5 range; beyond 1.5 the badge grows large enough to feel alarming |
| Halo style | Scale + halo | Halo alone is subtler; scale alone is more contained |
| Border offset | `border: 2px solid bg` | The badge border must match the icon background to appear floating |

## Production notes
- **Peripheral vision threshold**: 1.15× scale at 1.5s is the minimum perceptible in peripheral vision for most users. Below that, the badge reads as static.
- **Dismiss on interaction**: always remove the pulse (and the badge itself) when the user views the notifications. A persistent pulse on already-seen content is confusing.
- **Fade-after-attention**: pulse strongly for the first 5 seconds, then reduce scale or stop entirely. This mirrors real notification system behavior (the alert has been "seen" peripherally).
- **`border: 2px solid` background color trick**: this makes the badge appear to float above the icon surface with a gap. Update the border color if the icon sits on a non-uniform background.
- **`prefers-reduced-motion`**: disable the pulse animation entirely. The badge remains visible — users who need reduced motion still see the indicator, just without motion.
- **React**: `react-hot-toast` and Sonner implement badge-style indicators for toast notifications. For nav badges, most component libraries include a `Badge` with optional `animate` prop.

## See also
- [Tooltip Reveal](../tooltip-reveal/) — hover-triggered information on the same icons
- [Loading Spinner](../loading-spinner/) — another attention indicator for active states
- [Hover State Animation](../hover-state/) — hover feedback on the icon behind the badge
