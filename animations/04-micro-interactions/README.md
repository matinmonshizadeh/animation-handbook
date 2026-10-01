# 04 — Micro-Interactions & UI Animation

Short, user-triggered animations that provide feedback, confirm actions, and communicate state. They start the moment the visitor acts and stay short (see Duration discipline below), so they feel instant, not decorative.

## Animations

| Demo | Description |
|------|-------------|
| [Hover State Animation](hover-state/) | Six ways a card can react when you point at it. Best for buttons and cards. |
| [Click / Tap Ripple](click-ripple/) | A ripple spreads out from the spot you press. Best for buttons and list items. |
| [Focus Ring Animation](focus-ring/) | A ring closes in around the item the Tab key reaches. Best for forms and menus. |
| [Button Press Scale](button-press-scale/) | Shrinks as you press it and springs back as you let go. Best for main buttons. |
| [Magnetic Button](magnetic-button/) | Leans toward the pointer, then springs home. Best for one main button. |
| [Toggle / Switch Slide](toggle-switch/) | The knob slides across as the switch turns on or off. Best for settings. |
| [Heart / Like Burst](heart-burst/) | The heart pops and fills as small hearts burst out. Best for like buttons. |
| [Success Confetti](success-confetti/) | Confetti bursts from the button when a task is done. Best for big moments. |
| [Skeleton Loader](skeleton-loader/) | Gray shapes hold the place of content while it loads. Best for feeds and cards. |
| [Shimmer Effect](shimmer-effect/) | A band of light sweeps over gray placeholders. Best for loading screens. |
| [Loading Spinner](loading-spinner/) | Six small shapes loop to show that something is loading. Best for short waits. |
| [Progress Animation](progress-animation/) | A bar, a ring and steps fill up to show progress. Best for uploads. |
| [Checkmark Draw](checkmark-draw/) | A tick draws itself in a circle once a task succeeds. Best for forms. |
| [Form Field Morph](form-field-morph/) | The label moves up out of the way as you type. Best for sign-up forms. |
| [Notification Badge Pulse](badge-pulse/) | A badge on an icon pulses to catch the eye. Best for unread messages. |
| [Tooltip Reveal](tooltip-reveal/) | A small label fades in after a short pause. Best for icon buttons. |
| [Drawer / Panel Slide](drawer-slide/) | A side panel slides in over a dimmed page. Best for mobile menus. |
| [Modal Expand](modal-expand/) | A window grows out of the button you pressed. Best for detail views. |
| [Accordion Open/Close](accordion/) | Each question opens smoothly to show its answer. Best for FAQ pages. |
| [Cursor Follower](cursor-follower/) | A dot trails your pointer and flips the colors under it. Best for portfolios. |
| [Error Shake](error-shake/) | A field shakes side to side when the input is wrong. Best for sign-in forms. |
| [Swipe to Dismiss](swipe-to-dismiss/) | A card dragged sideways flies off and the list closes up. Best for inboxes. |
| [Hamburger Menu Toggle](hamburger-menu-toggle/) | Three lines turn into an X as the menu opens. Best for mobile menus. |
| [Theme Toggle Morph](theme-toggle-morph/) | A sun turns into a moon as the colors switch to dark. Best for theme buttons. |
| [Copy to Clipboard](copy-to-clipboard/) | Copy turns into a tick and Copied, then changes back. Best for codes and links. |
| [Star Rating](star-rating/) | Stars fill up to your pointer and pop when you choose. Best for reviews. |
| [Toast Notification](toast-notification/) | Short messages slide into a corner, then leave on their own. Best for updates. |
| [Segmented Control](segmented-control/) | A highlight slides to the option you pick. Best for switching views. |
| [Pull to Refresh](pull-to-refresh/) | Pulling a list down shows a spinner, then new items. Best for feeds. |
| [Hold to Confirm](hold-to-confirm/) | Fills up while you hold it and acts only once it is full. Best for delete buttons. |

## Key concepts

**Duration discipline**: Feedback should begin the moment the visitor acts and stay short: about 200ms or less for a hover change and under about 100ms for a press to show. A change that shows a new state, such as a ripple, a morph or a panel opening, usually takes 300–600ms; much longer and feedback starts to feel like decoration.

**Asymmetric timing**: press events animate faster than release events (80ms press / 180ms release for button scale). Opening events are slightly slower than closing (280ms open / 220ms close for drawers). The asymmetry matches physical intuition.

**Touch parity**: every hover-triggered effect needs an `:active` or `pointerdown` equivalent on touch. Use `@media (hover: hover)` to gate hover-only styles.

**Reduced motion**: all demos respect `prefers-reduced-motion: reduce`. Disable motion, preserve state changes.

## See also
- [02 — Entrance & Exit](../02-entrance-and-exit/) — longer element-level transitions
- [03 — Page Transitions](../03-page-transitions/) — full-page transition patterns
