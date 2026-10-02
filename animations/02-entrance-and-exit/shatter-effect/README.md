# Shatter Effect

## What it is

A shatter effect breaks an element into sharp pieces that fly apart and fade, as if it were a pane of glass hit at one point. Each piece is a copy of the whole card trimmed to its own shape, so together the pieces look exactly like the card until they move. Here the next card fades in behind them, so the break doubles as the change from one card to the next.

## When to use it
- Photo galleries and slideshows, where breaking the current picture brings in the next one
- Dismissing a card with some drama: a deleted item, a closed offer, a finished task
- Game moments and quizzes: a wrong answer, a broken block, a cleared level
- A bold intro, where a cover breaks away to show the page behind it
- Moments that happen once per visit or per action, not things people see over and over

## How it works
The card is cut like glass hit at one point. Rays run from the point of impact to the card's edge, always through the four corners (so the outer pieces end exactly on the edge) and spread evenly in between; rings cross the rays at growing fractions of the distance to the edge, and every crack from one ring to the next bends once, part way along, by at most a third of its room to the nearest ray or ring line, so no piece folds over itself. A piece is the area between two neighboring rays and two neighboring rings. Neighbors share their corners and bends, so the pieces tile the card with no gaps (each piece also notes whether one of its sides is the card's own border):

```js
const grid=[rays.map(()=>p),...f.map((k,i)=>rays.map(a=>{
  const r=edge(a)*(i<f.length-1?k*rnd(.88,1.12):1);
  return [p[0]+Math.cos(a)*r,p[1]+Math.sin(a)*r]}))];
for(let i=0;i<f.length;i++)rays.forEach((_,k)=>{const n=(k+1)%rays.length,
  q=[grid[i][k],bends[i][k],grid[i+1][k],grid[i+1][n],bends[i][n]].concat(i?[grid[i][n]]:[]);
  q.edge=i===f.length-1;polys.push(q)});
```

Every piece is a box around its polygon that holds a copy of the whole card (`cloneNode(true)`), shifted so the copy lines up with the original and clipped to the polygon with `clip-path`. The card's box is measured once with `getBoundingClientRect()` relative to the deck, keeping the fractions of a pixel, so the copies sit exactly where the card is (rounded `offsetTop` and friends put them up to a pixel off). Each polygon is grown by 0.7px so neighbors overlap and no seam shows, and each copy draws only its own cracks (its outline, less any side on the card's border). The pieces are built when the play starts, before anything moves, because that is the costly part; they wait under the card, which is hidden at the break by a zero-length animation, so it keeps time with the pieces' own animations however long that first frame takes:

```js
const el=Object.assign(document.createElement('div'),{className:'shard'}),copy=card.cloneNode(true),o=q.edge?[...q.slice(3),...q.slice(0,3)]:q;
el.style.cssText='left:'+(X+bx)+'px;top:'+(Y+by)+'px;width:'+(Math.ceil(Math.max(...xs))-bx)+'px;height:'+(Math.ceil(Math.max(...ys))-by)+'px;'+
  'transform-origin:'+(c[0]-bx)+'px '+(c[1]-by)+'px;clip-path:polygon('+pts.map(([x,y])=>(x-bx).toFixed(1)+'px '+(y-by).toFixed(1)+'px')+')';
copy.style.cssText='left:'+(-bx)+'px;top:'+(-by)+'px;width:'+W+'px;height:'+H+'px';
if(start)copy.querySelector('.cracks').innerHTML=['dk','lt'].map(cls=>'<path class="'+cls+'" d="M'+o.map(P).join('L')+(q.edge?'':'Z')+'"/>').join('');
```

Each flight is worked out once and sampled into 13 keyframes for the Web Animations API, so the browser plays it by elapsed time and only moves, turns and fades the pieces. Over the flight time `u` (0 to 1) the burst away from the impact slows down (`e` is an ease-out), the upward throw is part of the starting speed, and gravity adds `g·u²/2`; the piece turns all the way and fades over the second half:

```js
for(let k=0;k<=12;k++){
  const u=k/12,e=1-Math.pow(1-u,1.7),x=vx*e,y=vy*e+g*u*u/2;
  frames.push({opacity:u<.5?1:1-Math.pow((u-.5)*2,1.5),transform:tumble
    ?'translate3d('+x+'px,'+y+'px,'+vz*e+'px) rotateX('+spin[0]*u+'deg) rotateY('+spin[1]*u+'deg) rotate('+spin[2]*u+'deg)'
    :'translate('+x+'px,'+y+'px) rotate('+spin[2]*u+'deg)'});
}
el.animate(frames,{duration:T,delay:start+wave*d/far,fill:'both'});
```

Each piece waits until the break (`start`, the time the cracks take), then a little longer the farther it is from the impact, so the break spreads outward; a short flash marks the impact. With the cracks shown, the crack lines are first drawn in an SVG over the card, ring by ring, while the card gives a small jolt. They are a soft dark line under a light one, so they show on both the picture and the caption, and every copy carries the same lines along its own edges: nothing changes at the break, and each piece keeps a light edge where it broke (lines this soft and wide stay clean when a piece tilts; a thin, sharp pair breaks up into a sawtooth). The next card fades in from 45% of the flight. When the last piece has faded, the pieces are removed; Replay or a setting change cancels everything still running (`getAnimations({subtree:true})`) and starts the same break over. Under reduced motion the next card simply fades in over the old one, with no pieces. Slow motion makes the play three times longer; the hold between plays while Loop is on stays the same. If the stage changes size during a play (a resized window, a phone turned sideways), the play ends at once on the next card, because its pieces were placed for the old size; reduced motion switched on during a play ends it the same way. While Loop is on and the stage is scrolled out of view, the next play waits until the stage is back in view (an `IntersectionObserver`), so the Loop builds no copies while nobody can see them.

## Key parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| Number of pieces | Medium | How finely the card breaks: few is about 15 pieces in two rings, medium about 30 in three and many 60 in four (about 46 on phones) |
| Breaks from | Center | Where the impact is: near the middle (moved a little at random each time) or near the top-left corner; the pieces there are the smallest and fly first |
| Gravity | Normal | None lets the pieces drift straight outward; normal throws them up a little before they fall; heavy drops them out of view |
| Speed | Normal | How long each piece's flight takes: slow is 1700ms, normal 1100ms and fast 700ms; the cracks take about a third of that before the break |
| Shows the cracks | on | Draws the cracks across the card, ring by ring from the impact, before it breaks; off, it breaks at once |
| Tumbles in 3D | on | The pieces flip over and fly toward the viewer; off, they spin flat |

## Production notes
- **Copies are the cost.** Each piece holds a full copy of the card, so sixty pieces mean sixty copies of its markup. Keep the card light (one picture and a short caption), make the copies only for the card that is about to break, give each copy only its own crack lines (a full crack pattern in every copy is stroked again for every piece) and remove the copies once they have faded. The demo cuts Many a little coarser on phones (a screen up to 600px wide or 500px tall) and skips slivers under 4px² there.
- **Composited, not repainted.** The pieces animate only `transform` and `opacity`; each `clip-path` is set once and never animated. `contain: layout paint` on each piece keeps its layer to its own small box instead of the whole card.
- **Build nothing out of view.** Building the copies takes one long frame on a slow phone, so the demo's Loop holds its next play while the stage is off screen; otherwise that frame would land every few seconds while the visitor reads or taps elsewhere on the page.
- **Build early, swap on the same clock.** Making the copies and starting their animations takes the most time, so do it before anything moves (here while the card is still whole) and keep the pieces under the card. Hide the card with an animation too, not a timer: animations made together start together, while a timer keeps running during a slow first frame and would hide the card too early.
- **Pictures and video.** A copied `img` shows the same cached picture, but a copied `video` or `canvas` does not carry its current frame: draw that frame to an image first. For any element, html2canvas can turn it into one bitmap that the pieces share as a background, which is also lighter than copying markup.
- **Accessibility.** The pieces are decoration: keep them hidden from assistive technology (here they sit inside the stage's `role="img"`) and move focus to whatever comes next yourself.
- **Library equivalents.** GSAP throws the pieces with `gsap.to(pieces, { x, y, rotation, opacity, stagger: { each, from: 'center' } })`, and its Physics2DPlugin adds gravity and velocity; Framer Motion animates each piece's `x`, `y` and `rotate` with a per-piece delay. For hundreds of pieces, or glass that bends the light, a WebGL library such as Three.js draws the card as a texture on triangles.

## See also
- [Dissolve Transition](../../03-page-transitions/dissolve/) — a page breaks into tiles that give way to the next one
- [Split Text Reveal](../split-text-reveal/) — text broken into pieces that arrive one after another
- [Fade In / Fade Out](../fade-in-out/) — the plain fade this effect becomes under reduced motion
- [2D Physics](../../06-3d-advanced/physics-2d/) — balls that fall, bounce and pile up under gravity
