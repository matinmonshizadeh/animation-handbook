# Notification Badge Pulse

## What it is
A notification badge is a small colored dot or number on an icon that marks something new, such as unread messages. A gentle pulse, growing a little and settling back or sending out a soft ring, catches the eye at the edge of your vision without interrupting what you are doing.

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

The halo variant adds a radiating ring that expands and fades. The ring is drawn under the badge's number, not over it: the badge is its own stacking context (`isolation: isolate`) and the ring has a negative `z-index`, so it covers the badge's color but never the number, which keeps its contrast through every pulse:

```css
.badge {
  isolation: isolate;
}

.badge::after {
  content: '';
  position: absolute;
  inset: -4px;
  z-index: -1;
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

Stopping after three pulses takes two more declarations on the animated parts, `animation-iteration-count: 3` and `animation-fill-mode: forwards`. Without the fill mode the badge would fall back to the halo's resting style, a faint ring, when the last pulse ends; with it the run stays on its last keyframes, the badge at scale 1 and the halo invisible.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Pulse style | Grow | Grow scales the badge up and back; Ring sends a soft halo outward; Both does the two together |
| Speed | Normal | How long one pulse takes: slow is 2.4s, normal 1.5s and fast 0.9s; fast feels urgent, slow is easy to miss |
| How much it grows | Medium | How big the badge gets at the top of each pulse: slightly is 115%, medium 130% and a lot 150% of its size |
| Stops after three pulses | off | The badges pulse three times and then rest; the online dot keeps going |
| Badge color | Red | The badge's color; red reads as new and urgent |

## Production notes
- **Peripheral vision threshold**: 1.15× scale at 1.5s is the minimum perceptible in peripheral vision for most users. Below that, the badge reads as static.
- **Dismiss on interaction**: always remove the pulse (and the badge itself) when the user views the notifications. A persistent pulse on already-seen content is confusing.
- **Fade-after-attention**: pulse strongly for the first 5 seconds, then reduce scale or stop entirely. This mirrors real notification system behavior (the alert has been "seen" peripherally).
- **`border: 2px solid` background color trick**: this makes the badge appear to float above the icon surface with a gap. Update the border color if the icon sits on a non-uniform background.
- **`prefers-reduced-motion`**: under reduced motion the demo starts paused, so the badges stay still until the visitor presses Play. In production, turn the pulse off: the badge stays visible, just without motion.
- **React**: `react-hot-toast` and Sonner implement badge-style indicators for toast notifications. For nav badges, most component libraries include a `Badge` with optional `animate` prop.

## See also
- [Tooltip Reveal](../tooltip-reveal/) — pointing at an icon shows a short note
- [Loading Spinner](../loading-spinner/) — another sign that something is going on
- [Hover State Animation](../hover-state/) — items react when the pointer is over them
