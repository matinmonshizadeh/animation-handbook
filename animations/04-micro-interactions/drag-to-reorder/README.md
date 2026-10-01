# Drag to Reorder

## What it is
Drag to reorder lets people change the order of a list by picking an item up and moving it. The item lifts above the others and follows the pointer, and each item it passes slides aside to open a gap where it will land; letting go settles it into that gap. The same move works from the keyboard: pick the item up, move it with the arrow keys and put it down.

## When to use it
- To-do lists, playlists and priority rankings, where the order itself means something
- Editors for menus, navigation links, form fields or dashboard widgets
- Short lists, up to a screen or so, where dragging is quicker than pressing "Move up" again and again
- Touch-first lists, as long as a grip or a short press starts the drag so the page can still scroll

## How it works
Every row is placed at the top of the list and moved to its slot with a transform: `--i` holds the slot, and the stylesheet turns it into a `translateY` with a transition, so a new order never changes the layout. The held row follows the pointer with an inline transform and no transition, and the rows it passes get a new `--i`, so they slide:

```js
// The rows between where the held one started and slot `to` slide one slot toward the gap it left.
function makeRoom(to){
  const {row,from}=drag;drag.to=to;
  order.forEach((r,j)=>{if(r!==row)place(r,from<to&&j>from&&j<=to?j-1:to<from&&j>=to&&j<from?j+1:j)});
}
// Pointer and Show me: the held row is drawn at y, exactly under the pointer, and the others make room around the slot it is over.
function follow(y){
  const s=slotPx(),n=order.length,r=drag.row;
  drag.y=Math.max(-.4*s,Math.min((n-.6)*s,y));
  r.style.transition='none';r.style.transform=`translateY(${drag.y}px)`;
  const to=Math.max(0,Math.min(n-1,Math.round(drag.y/s)));
  if(to!==drag.to)makeRoom(to);
}
```

On release, `drop()` clears the inline transform, so the row slides from under the pointer into its slot, and the list's real order follows: the rows it passed are moved to its other side with `insertBefore`, so the held row never leaves the document and keeps its keyboard focus. Moving an element in the document ends any transition it is in the middle of, so a row still sliding aside would jump to its slot. `keepSlides()` uses the FLIP idea against that: it reads where each row is drawn before the move, gives it that place back as a still transform after the move, then lets go, so the slide carries on from there. Reset puts the whole list back in order through it too, so the rows slide home:

```js
function keepSlides(rows,move){
  const at=rows.map(drawnY);move();
  rows.forEach((r,i)=>{r.style.transition='none';r.style.transform=`translateY(${at[i]}px)`});
  void list.offsetWidth;rows.forEach(r=>{r.style.transition=r.style.transform=''});
}
```

The lift is a `scale` on the row's inner card plus a shadow on a pseudo-element whose opacity fades in, so no shadow is ever animated.

Pointer Events cover mouse, pen and touch with one code path, and `setPointerCapture` keeps the row following even when the pointer leaves it. A mouse lifts the row at once. A finger lifts it at once from the grip, which has `touch-action: none`, but from the rest of the row only after a 300ms press, so a quick swipe over the list still scrolls the page (the row has `touch-action: pan-y`); once a row is held, a `touchmove` listener that is not passive calls `preventDefault`, so the browser does not scroll under it. On the keyboard each grip is a button: Space or Enter picks the task up and puts it down, the arrow keys move it one slot, Escape puts it back, and a polite live region reads each step aloud.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| Slide speed | Normal | How fast the passed items slide aside and the dropped one settles: slow is 420ms, normal 220ms and fast 120ms |
| How much it lifts | Subtle | Subtle grows the held item by 2% with a soft shadow; strong grows it by 6%, tilts it a little and deepens the shadow |
| Drags by the handle only | off | Only the grip starts a drag; when off, the whole row does, after a short press on touch screens |

## Production notes
- **Save the order once, on drop.** Move the items with transforms while the drag lasts and rewrite the list (and send it to the server) only when the item is dropped; rebuilding the list on every pointer move makes it flicker and loses the pointer capture.
- **Rows of different heights**: the demo's rows share one height, so a slot is a fixed distance. With mixed heights, measure each row and add up the heights before the target slot, or move the element in the DOM at each slot change and animate the jump with FLIP.
- **Long lists**: scroll the container when the held item nears its top or bottom edge, and offer "Move to top" or a position field when the list is longer than a screen, since a long drag is tiring and easy to drop early.
- **Accessibility**: give every item a keyboard way to move, announce pick up, each move, drop and cancel in a live region, and keep focus on the moved item. Never rely on the drag alone.
- **Reduced motion**: keep the reorder and drop the slides; with `prefers-reduced-motion: reduce` the items jump straight to their places, and the keyboard way already moves one slot per key press.
- **Library equivalents**: SortableJS for plain JavaScript (its `handle` and `delay` options match the switch and the touch press here), dnd-kit's sortable preset and @hello-pangea/dnd for React (both announce moves for screen readers), Framer Motion's `Reorder.Group` and `Reorder.Item`, and GSAP's Draggable when you want your own physics.

## See also
- [Swipe to Dismiss](../swipe-to-dismiss/) — the sideways drag that removes an item
- [Pull to Refresh](../pull-to-refresh/) — a drag down that reloads a list
- [FLIP Technique](../../03-page-transitions/flip-technique/) — cards that glide to their new places when the order changes
