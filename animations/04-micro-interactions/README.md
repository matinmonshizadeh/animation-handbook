# 04 — Micro-Interactions & UI Animation

Short, user-triggered animations that provide feedback, confirm actions, and communicate state. Duration is typically ≤300ms — they must feel instant, not decorative.

## Animations

| Demo | Description |
|------|-------------|
| [Hover State Animation](hover-state/) | Color, scale, lift, underline, icon nudge, and background sweep on cursor entry |
| [Click / Tap Ripple](click-ripple/) | Ripple from exact click point — Material Design's tactile confirmation |
| [Focus Ring Animation](focus-ring/) | Animated outline on keyboard Tab — :focus-visible for keyboard users only |
| [Button Press Scale](button-press-scale/) | Scales down on press, springs back on release — asymmetric timing |
| [Magnetic Button](magnetic-button/) | Button leans toward the cursor within a radius, label lagging for parallax |
| [Toggle / Switch Slide](toggle-switch/) | Pill slides between on/off — smooth cubic-bezier for weighted feel |
| [Heart / Like Burst](heart-burst/) | Heart pops and fills while small hearts burst outward on canvas |
| [Success Confetti](success-confetti/) | Canvas confetti burst on completion — rotating rectangles with gravity |
| [Skeleton Loader](skeleton-loader/) | Pulsing placeholder blocks while real content loads |
| [Shimmer Effect](shimmer-effect/) | Gradient sweep across skeleton placeholders |
| [Loading Spinner](loading-spinner/) | Six spinner variants — ring, orbit, arc, bounce, pulse, square |
| [Progress Animation](progress-animation/) | Linear bar, circular ring, and stepped segments |
| [Checkmark Draw](checkmark-draw/) | SVG stroke-dashoffset draws a checkmark or X on success/failure |
| [Form Field Morph](form-field-morph/) | Floating label rises on focus, persists when filled |
| [Notification Badge Pulse](badge-pulse/) | Dot pulses to draw peripheral attention without interrupting |
| [Tooltip Reveal](tooltip-reveal/) | Info box after 300ms hover delay — focus-visible for keyboard |
| [Drawer / Panel Slide](drawer-slide/) | Off-canvas panel — ease-out open, ease-in close |
| [Modal Expand](modal-expand/) | Modal scales from trigger button position — spatial continuity |
| [Accordion Open/Close](accordion/) | Height 0 → auto: JS measured vs CSS grid-template-rows |
| [Cursor Follower](cursor-follower/) | Lerp-lagged cursor + mix-blend-mode: difference inversion |
| [Error Shake](error-shake/) | Invalid field shakes with a decaying wobble and flashes red — the universal "no" |
| [Swipe to Dismiss](swipe-to-dismiss/) | Drag past a threshold to fling a card away as its row collapses — pointer-driven, touch-ready |
| [Hamburger Menu Toggle](hamburger-menu-toggle/) | The bars icon morphs to an X — top and bottom bars rotate to cross while the middle fades |
| [Theme Toggle Morph](theme-toggle-morph/) | A sun morphs into a crescent moon as the interface flips between light and dark |
| [Copy to Clipboard](copy-to-clipboard/) | Copy button swaps to a checkmark and a Copied confirmation, then reverts |
| [Star Rating](star-rating/) | Stars fill toward the pointer and pop on commit — an accessible five-star control |
| [Toast Notification](toast-notification/) | Notification cards slide in, stack, and auto-dismiss with a progress bar |
| [Segmented Control](segmented-control/) | A highlighted pill slides under the selected segment — iOS-style |
| [Pull to Refresh](pull-to-refresh/) | Drag past the top to reveal a spinner; release past a threshold to refresh |

## Key concepts

**Duration discipline**: micro-interactions must complete in ≤200ms for hover states, ≤300ms for click responses, ≤400ms for loading indicators appearing. Longer durations shift perception from "feedback" to "animation."

**Asymmetric timing**: press events animate faster than release events (80ms press / 180ms release for button scale). Opening events are slightly slower than closing (280ms open / 220ms close for drawers). The asymmetry matches physical intuition.

**Touch parity**: every hover-triggered effect needs an `:active` or `pointerdown` equivalent on touch. Use `@media (hover: hover)` to gate hover-only styles.

**Reduced motion**: all demos respect `prefers-reduced-motion: reduce`. Disable motion, preserve state changes.

## See also
- [02 — Entrance & Exit](../02-entrance-and-exit/) — longer element-level transitions
- [03 — Page Transitions](../03-page-transitions/) — full-page transition patterns
