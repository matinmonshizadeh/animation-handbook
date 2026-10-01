# Typing Indicator

## What it is
A typing indicator tells people in a conversation that the other person is writing a reply. It is a small chat bubble on their side of the conversation holding three dots that move one after another in a loop, by bouncing, brightening or rising and falling like a wave. When the reply arrives, the message takes the bubble's place.

## When to use it
- Chat and messaging apps, between two people or in a group
- Support chat, so customers know someone is answering
- AI assistants, between the question and the first words of the answer
- Comment threads and shared documents where someone is replying live

## How it works
The bubble is an ordinary message bubble holding three dots. All three run the same CSS animation, and each starts a little later than the one before it, so they move in turn; the delays are shares of the round's length, so the pattern keeps its shape at any speed:

```css
.dot{width:9px;height:9px;border-radius:50%;background:var(--dot);animation:ty-bounce var(--dur) ease-in-out infinite both}
.dot:nth-child(2){animation-delay:calc(var(--dur)*.15)}
.dot:nth-child(3){animation-delay:calc(var(--dur)*.3)}
@keyframes ty-bounce{0%,60%,100%{transform:translateY(0);opacity:.45}30%{transform:translateY(var(--hop));opacity:1}}
```

Bounce lifts each dot and lets it fall back, then all three rest for the last part of the round, which reads as bursts of typing. Fade brightens and grows each dot instead of moving it, and wave has no rest: the dots rise and fall without a pause. Only `transform` and `opacity` change, so the dots stay smooth on any device.

The distances are custom properties (`--hop`, `--lift` and `--small`); under `prefers-reduced-motion: reduce` they are set to no movement at all, so the same keyframes only brighten the dots in turn. Pause and Slow motion act on the CSS animations themselves: the page holds them with `animation-play-state` and slows them with each animation's `playbackRate`. A new speed scales each dot's current time by the same factor as its length, so the dots carry on from where they are instead of jumping.

## Key parameters
| Parameter | Default | Effect |
|-----------|---------|--------|
| How the dots move | Bounce | Bounce hops each dot 7px up and rests between rounds; fade brightens each dot and grows it from 70% to full size; wave raises and lowers the dots without a rest |
| Speed | Normal | How long one round of the three dots takes: slow is 1.8 seconds, normal 1.2 seconds and fast 0.8 seconds |
| Bubble color | Gray | The color of the other person's bubbles: gray, blue, green or purple; the dots turn light gray or white to stay clear on it |

## Production notes
- **Show it only while typing is real**: send a "typing" signal as the person types, hide the bubble a few seconds after the last key press, and replace it with the message when it arrives, so a bubble never hangs on screen for nothing.
- **Avoid flicker**: wait a moment before showing it and keep it up for at least a second once shown, so short bursts of typing do not make it blink on and off.
- **Keep the conversation still**: give the bubble the height of a one-line message, so the thread does not jump when it comes and goes.
- **Accessibility**: give the bubble a text alternative such as "Maya is typing", and if you announce it in a live region, announce it once, not on every key press.
- **Reduced motion**: keep the dots in place; a gentle change of brightness is enough to show that something is happening.
- **Library equivalents**: chat kits such as Stream Chat and Sendbird's UIKit come with a typing indicator, Lottie files are common for illustrated versions, and Framer Motion can stagger the three dots with a `delay` per dot.

## See also
- [Loading Spinner](../loading-spinner/) — six small shapes that loop while something loads
- [Skeleton Loader](../skeleton-loader/) — gray shapes that hold the place of content while it loads
- [Toast Notification](../toast-notification/) — short messages that slide into a corner
- [Wavy Text](../../05-text-typography/wavy-text/) — a wave that rolls through a word, letter by letter
