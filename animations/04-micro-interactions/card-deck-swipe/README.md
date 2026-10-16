# Card Deck Swipe

[Live demo](https://matinmonshizadeh.github.io/animation-handbook/animations/04-micro-interactions/card-deck-swipe/)

## What it is
A card deck swipe shows a pile of cards, such as profiles or products, one at a time. The top card follows a drag, turns a little as if held at its bottom edge, and flies off to the left or the right when let go far enough, while the next card grows into its place. The two sides are two answers, such as no and yes, so people decide quickly, one card at a time.

## When to use it
- Matching and dating apps
- Product pickers and "this or that" shopping
- Flashcards: known, or not yet
- Quick polls and preference quizzes

## How it works
The cards are stacked in one box. Each card knows its depth (0 on top), and the waiting cards are moved down and made a little smaller from that number, so the pile peeks out behind the top card:

```css
.card { transform-origin: 50% 130%;  /* a point below the bottom edge */
        transform: translateY(calc(var(--i) * 12px)) scale(calc(1 - var(--i) * .05)); }
```

While it is dragged, the top card's transform follows the pointer and turns in proportion to the distance. Because it turns around a point below its bottom edge, its top swings further than its bottom, as a card held at the bottom would. The stamps grow stronger with the distance:

```js
card.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx / cardWidth * turn}deg)`;
like.style.opacity = Math.min(1, Math.max(0, dx / (threshold * cardWidth)));
```

On release, a card whose middle went past the swipe distance, or that was flicked away from the middle faster than half a pixel per millisecond, gets a transition and is moved off that side; otherwise it springs back with an overshooting curve. The next card's depth becomes 0, so its own transition grows it into place, and the card that left is removed once its transition ends. Undo puts the last card back on top where it left and lets the transition bring it in. Nope, Like and Undo are real buttons, the Left and Right keys work on the focused top card, and each choice is also written into a polite status line for screen readers. Under reduced motion, cards fade instead of flying.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| How far to swipe | Medium | How far the card's middle must go before letting go sends it: short is a quarter of the card's width, medium 40% and long 60%; a quick flick sends it from anywhere |
| How much it turns | A little | How far the card turns for each card width of drag, around a point below its bottom edge: none does not turn, a little turns 14 degrees and a lot 30 degrees |
| Shows stamps | on | Like in green and Nope in red fade in on the card as it is dragged, fully shown at the swipe distance |
| Cards behind | Peeking | How the waiting cards show: peeking sets each one a little lower and 5% smaller, fanned turns them left and right in turn, 5 degrees more and 3% smaller for each card further back, around the same low point, hidden shows only the top card until the next one grows in |

## Production notes
- **Transforms only.** Move, turn and grow the cards with transform and fade them with opacity; never change their left, top or size.
- **Pointer events.** One set of pointerdown, pointermove and pointerup handlers, with pointer capture, serves mouse, pen and touch; `touch-action: pan-y` keeps vertical scrolling on phones. A finger that starts moving up and down is a scroll, so let go of the card at once, and a `pointercancel` springs it back.
- **Keep a few cards in the page.** Render the top three to five cards, add more as cards leave, and remove a card once its fly-off ends.
- **Buttons and keys.** Swiping alone shuts out keyboards and some assistive tools: add Nope, Like and Undo buttons and arrow keys, and announce each choice in a polite live region.
- **Libraries.** react-tinder-card and Swiper's cards effect package the idea; in an app, Framer Motion's `drag` with a velocity check in `onDragEnd`, or GSAP's Draggable, builds it.
- **Reduced motion.** Fade the card out instead of throwing it, and let the next one appear without growing.

## See also
- [Swipe to Dismiss](../swipe-to-dismiss/) — one list row slides off with a drag or a flick
- [3D Carousel](../../06-3d-advanced/carousel-3d/) — cards on a ring that turn with a drag and glide on
