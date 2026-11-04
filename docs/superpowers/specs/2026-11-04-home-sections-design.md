# Home page sections — design

The owner's choice of 2026-11-04, after the study of ten home page designs (`.superpowers/home-designs/`, not in the
repository): keep the first part of the home page as it is, and take the next sections from two of the designs, Spotlight
and Moments. Where this spec and `2026-09-30-home-page-redesign-design.md` differ, this one wins.

## The page, top to bottom

1. **As before:** the top bar, the hero (pill, heading, line, search, Popular, "Don't know the name? Find it") and the nine
   place tiles. Nothing here changes.
2. **Good places to start (from Spotlight).** The heading, the line "Eight favorites from different places. Type above, or
   pick a place.", then a row of place chips, then the cards and Browse all as before.
3. **Famous effects (from Moments).** A dark band: "Seen on well-known websites", the heading "Famous effects", the line
   "Effects people admire on well-known websites, the handbook animations that make something similar, and a prompt to
   build your own." and a white button "See famous effects" to `famous/`; beside them, three of our own previews fanned like
   cards on a table (Mesh Gradient, Page Curl, Stacking Cards).
4. **How it works (from Moments).** "Three steps, and no code to read.": 1 Pick an animation ("Start from a few words, a
   part of your page, or three short questions."), 2 See it move ("Every animation plays live. Open its page to watch it big
   and try a few simple settings."), 3 Copy the prompt ("Paste it into your AI assistant. It describes the animation in
   plain words."), then "Free and open source (MIT). No sign-up." and the footer as before.

## The place chips

- `div.spots` (a group named Places) holds All and the nine places, each a `button.spot` with `data-place` and
  `aria-pressed`; a place chip has a dot in its tile's color. All has `data-place=""` and stands for Start.
- They work as the place tiles do (the same click handler): a place chip shows that place, the pressed one pressed again
  goes back to Start, All goes back to Start. Exactly one chip is pressed.
- They show at Start and on a place. A search, the finder and All animations hide them (a search and a place are never
  shown together).
- Desktop: one line at 1280px (40px tall); narrower windows wrap them. Phones: one row that scrolls sideways, every chip at
  least 44 × 44px, and hidden while the slim bar at the top (with its own place chips) is there.

## The Famous effects band

- One column from 900px down (the previews under the words, at most 440px wide); on phones the button fills the width.
- Dark mode: the band takes the page's surface color with a thin line around it.
- The previews are the cards' own (`pvMarkup()`), inside `div.fam-card` (the group color class, `data-pv`); they play only
  while on screen (the cards' observer and the `.playing` class, with the band's own pause rule) and hold their still frame
  under reduced motion (`hold()`). The fanned previews are decoration, hidden from screen readers.

## Checks

The place test in `tests/pages.test.js` counts one chip per place under the results heading and allows one button with an
empty place (All). The page check (`tools/check-pages.mjs`) counts the chips and the band's button among the phone touch
targets.
