# Famous effects: design

2026-10-13. People often see an effect on a famous website and ask how it is made: "Stripe's home page animation… how
is it made?" (r/web_design, March 2026) is one of about 110 such threads since 2025 (`2026-10-13-goal-and-roadmap.md`).
The owner approved a **Famous effects** page: each entry says in plain words what you see on a well-known site, shows the
handbook animations that make something similar (linked, with their moving previews) and gives one prompt to build it.
It serves the goal (understand by seeing) and answers by hand what the planned Animation finder will answer by search.
Branches, the shared-file map, generated files and releases: `2026-10-13-next-projects-coordination.md` (where the two
disagree, that file wins).

Rules this design follows (owner, 2026-10-13):

- A **Famous effects** tab in the top bar leads to the page; the tab comes to every page later, in one pass after the ten
  new animations are integrated (owner's order: the See inside and Compare rollout, the ten new animations, then the tab
  pass). Until then the page is reached from the home page's footer and the README.
- **Release (owner's answer, 2026-10-13):** the page goes live as soon as it is ready and the owner approves the real
  page, linked from the home page's footer and the README; the top-bar tab follows in the tab pass.
- The legal rules the owner was told bind every entry (checklist in section 5): our own words; the site named and
  linked; shown only with the handbook's demos and previews; never the site's code, pictures, videos or logos; a line
  saying the handbook is not connected to these companies; nothing that implies they approve.
- Stable effects first, and every entry reads "Seen on … in 2026", so it stays true if the site changes.
- No code on the site, plain words, American spelling; nothing goes live before the owner approves the real page.

## What the owner will see

1. A new page, **Famous effects** (`famous/`), in the home page's look (light or dark, the same top bar, cards and
   footer): the title, one line on what the page is, the line saying the handbook is not connected to these sites, and a
   row of links that jump to each effect.
2. Twelve entries, one under another. Each shows "Seen on stripe.com in 2026" (the site's name as plain text, linked), a
   plain title ("The twisting ribbon of light"), two or three sentences on what you see, the handbook animations that
   make it as cards with their moving previews (a small label on each says which part it makes), and the prompt with a
   **Copy prompt** button.
3. At the end, "Seen one we should add?", with a link to suggest it on GitHub.
4. The home page is unchanged apart from a Famous effects link in its footer; the README links the page too.

## 1 · The twelve entries

Checked on 2026-10-13 from the live page where it could be read (Stripe's page, Apple's stylesheets and scripts,
Wikipedia's code), otherwise from sources of 2025–2026, marked **confirm live**; every entry except 7 and 8 is watched on
its site, logged out, before it is written into the page (section 9, step 1). Entries 7 and 8 show only after a question is sent
(ChatGPT) or on a signed-in account (X), which agents do not do: the owner confirms them on their own accounts at the
review, or they are swapped for reserves. Headers give the home page's place and what starts the effect. The prompts already meet
the rules: 60 to 130 words, "Add a … to [what the reader fills in]", reduced motion and touch covered, no company named.
No famous site's page change could be confirmed (the famous ones are in apps), so Page changes has no entry yet.

### 1 · Stripe: The twisting ribbon of light (`#stripe-ribbon` · Backgrounds · loop)

- **Seen on** [stripe.com](https://stripe.com/), home page. Live page checked: its top holds the ribbon's stand-in
  picture. Sources: [r/webdesign, 2026-01-29](https://www.reddit.com/r/webdesign/comments/1qqe7ao/) (drawn with three.js);
  [YC Design Review, 2026-04-22](https://www.youtube.com/watch?v=ypzNhwpmOD4) (launched January 2026); the thread the
  owner found, [r/web_design, 2026-03-13](https://www.reddit.com/r/web_design/comments/1rsxb31/).
- **What you see:** Behind the headline, a thick ribbon of glowing color slowly twists in depth, sharp in places and
  blurred in others, as if filmed by a camera, under a fine grain. From 2020 to 2025 the same place held a flat band of
  blended colors that flowed like slow paint, the look Mesh Gradient Animation makes (linked in the text).
- **Made with:** Aurora / Northern Lights ("The soft light"), Grain / Film Noise Overlay ("The grain"), WebGL Shader
  Animation ("Drawn on the chip").
- **Prompt (124 words):** Add a slowly twisting ribbon of colored light behind [the heading at the top of your page]. Draw one thick, soft band in three or four of your own colors that drifts and turns in depth, so parts of it come into sharp focus while others blur, like a camera with a shallow focus, and lay a fine grain over it so the colors feel printed rather than flat. Keep the movement slow and the heading readable on every color it passes. Draw it on the graphics chip, show a still picture of it until it is ready, and pause it when it is off screen. On phones, draw a lighter version. If the visitor has reduced motion turned on, show the still picture.

### 2 · Apple: The headset that comes apart as you scroll (`#apple-scroll` · Scrolling, Text · scroll)

- **Seen on** [apple.com/apple-vision-pro](https://www.apple.com/apple-vision-pro/); the same build turns AirPods Pro and
  iPhone Air on their pages. Live stylesheets checked: a stage that stays put in a tall section, a video that follows the
  scroll, phrases that turn white in turn. Source: [CSS-Tricks, 2026-04-23](https://css-tricks.com/recreating-apples-vision-pro-animation-in-css/).
- **What you see:** The headset stays in the middle of the screen while you scroll: its parts rise out of it layer by
  layer, then it tips up to show its lenses, and scrolling back puts it together. Beside it, the phrase about the part on
  screen turns from gray to white.
- **Made with:** Scroll Image Sequence ("Scroll plays it"), Pin Animation ("It stays put"), Text Fill on Scroll ("Words
  light up").
- **Prompt (126 words):** Add a scroll-driven product reveal to [your product section]. Pin the product in the middle of the screen while the visitor scrolls through a section a few screens tall, and let the scroll play a short video or a series of pictures of it, so it turns or comes apart as they scroll down and goes back together as they scroll up. Beside it, keep a short paragraph in dim gray and light up the phrase about the part on screen. Show a still picture until the video or pictures are ready, and give the product a text description for screen readers. Touch scrolling drives it the same way. If the visitor has reduced motion turned on, show a few still pictures with their text instead.

### 3 · Lando Norris: The liquid reveal under the pointer (`#landonorris-reveal` · Images & cards · hover)

- **Seen on** [landonorris.com](https://landonorris.com/), home page; Awwwards Site of the Year 2025
  ([winners](https://www.awwwards.com/annual-awards/winners)). **Confirm live.** Sources: [three.js forum, 2025-11-01](https://discourse.threejs.org/t/how-to-recreate-this-liquid-blob-masking-cursor-effect-from-landonorris-com/87857);
  [Wes Bos, about November 2025](https://wesbos.com/tip/this-lando-norris-website-is-insane).
- **What you see:** A large portrait fills the screen. Wherever the pointer goes, a soft, liquid-looking blob shows a
  second picture through it, his racing helmet, as if the portrait were being wiped away.
- **Made with:** Cursor Follower ("Follows the pointer"), Morphing Blob ("The liquid shape"), Clip-Path Reveal ("The
  hidden picture").
- **Prompt (126 words):** Add a liquid reveal to [the picture at the top of your page, with a second picture hidden under it]. Stack the two pictures exactly. Wherever the pointer goes, a soft, round blob follows a little behind it, wobbling and stretching with its speed, and the hidden picture shows through the blob, as if the top picture were being wiped away. Let the blob shrink away when the pointer stops or leaves. Draw the mask on the graphics chip or with a clip, never by resizing the pictures, so it stays smooth. On touch screens, let a finger dragged across the picture do the same. If the visitor has reduced motion turned on, show a plain circle at the pointer, without the wobble or the lag.

### 4 · Linear: The headline that comes into focus (`#linear-intro` · Page intros, Text · load)

- **Seen on** [linear.app](https://linear.app/), home page. **Confirm live** (its headline has changed since). Sources:
  [r/howdidtheycodeit, 2025-07-28](https://www.reddit.com/r/howdidtheycodeit/comments/1mbox2f/); [a breakdown, 2026-09-11](https://kaushikmurali.com/playground/linear).
- **What you see:** As the page opens, the headline's words appear one after another, each rising a little out of a
  blur; the line under it and the buttons follow, then a large picture of the app, tilted slightly back, comes into
  focus the same way.
- **Made with:** Split Text Reveal ("Words in turn"), Blur In ("Out of the blur"), Stagger Reveal ("Part after part").
- **Prompt (113 words):** Add a focus-in opening to [the headline, the line under it and the main picture at the top of your page]. As the page opens, show the headline's words one after another, each fading in while it rises a little and sharpens out of a soft blur; then let the line under it, the buttons and the main picture follow the same way, in order. Keep each step short, so the whole opening is over in about a second and nobody waits to read. Animate only fading, blur and small moves, and use less blur on phones, where it costs more. If the visitor has reduced motion turned on, show everything at once.

### 5 · Apple: The menu that drops in, link by link (`#apple-menu` · Menus & forms · press)

- **Seen on** [apple.com](https://www.apple.com/), the menu at the top of every page (its hover panels date from
  February 2023). Live stylesheet and script checked: two lines that meet and cross into an X, links that fade in and
  drop a few pixels one after another, a blur over the page behind.
- **What you see:** On a phone, the two-line menu button folds into an X while the menu fills the screen and its links
  drop into place one after another. On a computer, pointing at a top item opens a panel that grows down from the bar,
  its links appearing in turn, while the page behind blurs.
- **Made with:** Hamburger Menu Toggle ("The button"), Stagger Reveal ("Links in turn"), Glassmorphism Animated ("The
  blurred page").
- **Prompt (129 words):** Add a menu that opens in steps to [the main menu in your site's header]. On phones, a tap on the menu button folds its lines into an X while the menu opens to fill the screen, and its links drop a few pixels into place one after another. On computers, pointing at a top item, or reaching it with the keyboard, opens a panel below it the same way while the page behind blurs. Keep the wait between links tiny, so the whole menu is there in about half a second, and close it faster than it opens. Make every opener a real button that tells screen readers whether its menu is open. If the visitor has reduced motion turned on, show and hide the menus at once.

### 6 · Wikipedia: Link previews (`#wikipedia-previews` · Menus & forms · hover)

- **Seen on** [wikipedia.org](https://www.wikipedia.org/), any article, on a computer, without an account. Code checked:
  [Page Previews](https://www.mediawiki.org/wiki/Page_Previews) (on by default since 2018; edited 2026-08-21) and the
  [Popups extension](https://github.com/wikimedia/mediawiki-extensions-Popups/blob/master/src/ui/renderer.js) (fade in rising, fade out).
- **What you see:** Rest the pointer on a link and, after a short pause, a small card with the linked article's first
  lines and picture fades in under the link, rising slightly into place; move away and it fades out.
- **Made with:** Tooltip Reveal ("The pause"), Fade In / Fade Out ("The fade").
- **Prompt (122 words):** Add link previews to [the links in your articles that point to other pages]. When the pointer rests on a link for a moment, a small card with the linked page's title, first sentences and picture fades in just below the link while rising a little into place; when the pointer leaves, it fades away. The wait keeps cards from flashing while the pointer only passes by, and a card that would fall off the screen opens above the link instead. Show the same card when keyboard focus reaches the link. On touch screens, where there is no hover, let a tap open the link as usual. If the visitor has reduced motion turned on, show and hide the card without movement.

### 7 · ChatGPT: The answer that writes itself (`#chatgpt-reply` · Loading & messages, Text · load)

- **Seen on** [chatgpt.com](https://chatgpt.com/). **Confirm live** (the owner, at the review). Sources: OpenAI's own design kit
  [apps-sdk-ui](https://github.com/openai/apps-sdk-ui) (a shimmering-text part, November 2025); [Layer3 Labs, 2026-09-29](https://layer3labs.io/guides/chatgpt-dot-meaning)
  (the pulsing dot); [phpied.com, 2024-11-27](https://www.phpied.com/?p=2146) (answers arrive in pieces).
- **What you see:** After you send a question, a small dot pulses until the reply starts; a model that works longer
  shows the word "Thinking" with a band of light sweeping across its letters. Then the answer arrives a few words at a
  time, as if typed live.
- **Made with:** Breathing / Pulsing Glow ("The waiting dot"), Text Gradient Animation ("The shimmer"), Word-by-Word
  Reveal ("Words arriving").
- **Prompt (128 words):** Add a live reply to [the answer area of your chat or assistant]. While the reply is being prepared, show a small dot that slowly pulses; when the work takes longer, show a short status word such as Thinking, with a soft band of light sweeping across its letters. When the answer starts, let it appear a few words at a time, each new group fading in at the end of the text, as if it were being written now. Keep finished lines where they are, and follow the newest words only while the reader has not scrolled away. Let screen readers hear the finished answer once. If the visitor has reduced motion turned on, keep the dot and the word still and show the words without fading.

### 8 · X: The heart that bursts (`#x-heart` · Buttons · press)

- **Seen on** [x.com](https://x.com/), the heart under any post. **Confirm live** (the owner, signed in, at the review). Sources: [CSS-Tricks, 2016-06-29](https://css-tricks.com/recreating-the-twitter-heart-animation/)
  (the burst taken apart); posts of February 2026 show special versions of the like animation still running.
- **What you see:** Press the heart and it shrinks for an instant, pops back a little too big and settles in pink-red,
  while a circle of color swells into a thin ring and small colored dots burst out and fade, all within about a second.
- **Made with:** Heart / Like Burst ("Pop and dots"), Click / Tap Ripple ("The ring").
- **Prompt (120 words):** Add a like button with a burst to [the heart button on your posts]. When it is pressed, the heart shrinks for an instant, then pops back a little too big and settles as it fills with color, while a circle of color swells into a thin ring and small dots burst out from its center and fade. Unliking takes the color away with no burst. Keep it all under a second and draw it over the button, so nothing around it moves. A tap on a touch screen and Enter or Space on the keyboard work the same, and screen readers hear whether the post is liked. If the visitor has reduced motion turned on, only change the color.

### 9 · Spotify: The play button that rises (`#spotify-cards` · Images & cards · hover)

- **Seen on** [open.spotify.com](https://open.spotify.com/), the cards on Home and Search. **Confirm live.** Sources:
  [Kombai's Spotify notes, 2026](https://kombai.com/gallery/inspirations/spotify/); a Spotify Community thread in which a
  listener complains about pressing the button that appears on hover.
- **What you see:** Point at an album or playlist card and the card lightens a shade while a round green play button
  fades in, rising a few pixels into the cover's bottom corner.
- **Made with:** Hover State Animation ("The card lightens"), Slide In ("The button rises").
- **Prompt (120 words):** Add a hover effect to [the album or playlist cards in your grid]. When the pointer rests on a card, its background lightens a little and a round play button rises a few pixels into place at the bottom corner of the picture while it fades in; when the pointer leaves, both go back. Use only fading and transforms, and keep it quick, so moving across the grid feels light. Show the play button when a card gets keyboard focus too, and on touch screens, where there is no hover, show it all the time. Give the button a name that says what it plays. If the visitor has reduced motion turned on, show and hide the button without movement.

### 10 · YouTube: Gray shapes while it loads (`#youtube-loading` · Loading & messages · load)

- **Seen on** [youtube.com](https://www.youtube.com/), home and video pages, while they load. **Confirm live** on a slowed
  network, including whether the shapes move (no source says). Sources: [HubSpot, 2024-01-05](https://blog.hubspot.com/website/skeleton-screens)
  (YouTube's placeholders); [Clay, 2026-03-06](https://clay.global/blog/skeleton-screen) (the same on LinkedIn).
- **What you see:** Before the videos appear, gray boxes and bars in the shapes of thumbnails, round channel pictures and
  titles fill the page; then the real content takes their places.
- **Made with:** Skeleton Loader ("Gray shapes"), Fade In / Fade Out ("Content arrives").
- **Prompt (112 words):** Add a loading state to [the grid or feed whose content loads]. While the content loads, show gray shapes in the sizes of what is coming, such as a picture box, a round avatar and two lines of text, and let them pulse gently between lighter and darker. When the content arrives, put it exactly where the shapes were and fade it in, so nothing on the page jumps. Show only as many shapes as fit the screen, fewer on phones, and stop the pulse as soon as the content is in. Tell screen readers that the content is loading. If the visitor has reduced motion turned on, keep the shapes still.

### 11 · The Pudding: The chart that changes as you read (`#pudding-chart` · Scrolling · scroll)

- **Seen on** [pudding.cool](https://pudding.cool/2025/11/democracy/), the story on democracy (November 2025). Its code
  checked: text steps that update a dot chart as they scroll in.
- **What you see:** A chart of dots stays on screen while short paragraphs scroll past. Each new paragraph changes it,
  lighting up the dots it talks about; scrolling back undoes each step.
- **Made with:** Scrollytelling ("The steps"), Sticky Section ("The chart stays").
- **Prompt (117 words):** Add a scrollytelling layout to [your story or data article]. Keep a chart or picture fixed on the screen while short blocks of text scroll past it, and change the chart each time a new block reaches the middle of the screen: light up the dots or bars the text talks about and fade the rest, so the words and the chart tell the story together. Change it smoothly, and let scrolling back undo each step. On phones, keep the chart at the top and let the text scroll over it on cards. Keep every step readable without the chart for screen readers. If the visitor has reduced motion turned on, switch between the steps without animating.

### 12 · Medium: The top bar that hides while you read (`#medium-top-bar` · Menus & forms, Scrolling · scroll)

- **Seen on** [medium.com](https://medium.com/), any article. **Confirm live.** Sources: [Wegic, 2026-07-21](https://wegic.ai/inspiration/website-header-examples);
  first described in [Usability Post, 2014](https://usabilitypost.com/2014/05/24/the-scroll-up-bar/).
- **What you see:** Scroll down into an article and the top bar slides up out of the way; scroll up even a little and it
  slides back.
- **Made with:** Hide-on-Scroll Header ("The whole effect"); one animation makes all of it.
- **Prompt (115 words):** Add a hide-on-scroll top bar to [the header of your article pages]. When the reader scrolls down into the text, slide the bar up out of view, so the words get the whole screen; the moment they scroll up, even a little, slide it back. Always show it near the top of the page. Tell the direction by comparing each scroll position with the last one, ignore tiny moves so the bar never flickers, and move it only with a transform. Touch scrolling works the same way, and keyboard focus moving into the bar brings it back. If the visitor has reduced motion turned on, fade the bar out and in instead of sliding it.

## 2 · Candidates left out

| Candidate | Why |
|---|---|
| GTA VI site (rockstargames.com/VI): the logo is a window that grows as you scroll | Seen in May 2025 ([Motion.dev](https://motion.dev/magazine/supercharging-the-gta-vi-website-with-motion)); the page changes with each trailer. **First reserve** if the live check finds it (Zoom Into Image, Pin Animation). |
| Glowing card edges that follow the pointer (Linear's or Cursor's home page) | Not confirmed today. **Second reserve** if the live check finds it on a home page, logged out (Spotlight Hover Glow). |
| Apple's headline that a color sweep crosses once (iPhone 18 Pro) | In the live stylesheet, but Apple has two entries; Text Gradient Animation is in entry 7. **Third reserve**, used only after the other two. |
| Google's Material ripple (Gmail, Drive) | Behind a sign-in, and the Material site could not be read; the ripple is in entry 8. Not a reserve: it shows only signed in. |
| Stripe Checkout's Pay button (spinner, then a check) | Not confirmed today (Checkout only in sources from 2014 and 2017). |
| Vercel's rainbow prism, GitHub's 3D globe, Tesla's snapping sections | Not found on today's home pages (the prism was mostly still; the globe dates from 2020; a 2026 description of Tesla's shows a carousel). |
| Airbnb's search bar that shrinks on scroll; its 2025 animated icons | The shrink is not confirmed after the May 2025 redesign; the icons are character animations (a gap). |
| Duolingo's chunky buttons that sink when pressed | Only third-party style notes; Button Press Scale shrinks rather than sinks. |
| Discord, Notion and Framer home pages; TikTok's snapping feed; X's rolling like count | Nothing could be confirmed. |
| Instagram's cube between stories; App Store cards that open into pages | Apps only; Instagram's web viewer has been a flat carousel since 2021. |
| Apple's Liquid Glass and Siri's glowing edge | Parts of iOS, not of a website (the handbook has Liquid Glass); apple.com's glow is still. |
| Bruno Simon's portfolio, Messenger (abeto), Igloo, Lusion | Whole 3D worlds; the handbook covers only parts. |

## 3 · Gaps: ideas for new animations

Found in the research; each could become its own page (the owner decides; none is part of this work):

- **Scroll-linked video:** a video the scroll plays forward and back (Apple's way; the handbook's flip-book draws pictures).
- **Ribbon in depth:** a shape drawn in 3D with camera-like focus blur (Stripe's 2026 ribbon, Lusion).
- **Interactive globe:** dots or arcs on a 3D globe that turns by itself and on drag (GitHub's home page from 2020).
- **Morphing dropdown:** one menu panel that slides and resizes from one menu to the next (Stripe's top menu since 2016).
- **Character animation:** icons or characters that act out a moment (Airbnb's 2025 icons, Duolingo; made in Rive or Lottie).
- **Two settings for existing pages:** a logo-shaped window for Zoom Into Image (GTA VI), a button that sinks onto its
  edge for Button Press Scale (Duolingo). Whole 3D worlds (Bruno Simon, Messenger) are too big for one demo.

## 4 · The page

### Where it lives: its own page, `famous/`, with its previews written in by a tool

| | Own page, previews written in by a tool (chosen) | Own page on new shared files | View of the home page (`?view=famous`) |
|---|---|---|---|
| Cards and previews | Copied from `index.html` by `tools/make-famous.mjs`; a test keeps them equal | The preview library moved out of `index.html` | Reused directly |
| Home page and home check | Untouched | A refactor of the home page, proved by the home check | A new view tested inside the busiest page |
| The projects editing `index.html` now (Animation finder, ten new animations) | No conflict: the tool only reads it | Conflicts with both; the finder spec puts this move after them | Edits the same script and views |
| Sharing, search and AI assistants | Plain HTML with its own title and social card; `famous/#stripe-ribbon` per entry; in the sitemap and `llms.txt` | The same | The home page's title and card; the text appears only after its script runs |
| Page size | About 70 KB (20 KB of it previews) | About 40 KB plus shared files | About 20 KB more on every home visit |

The finder is a tool, so it lives well as a view; this page is text people will link to and assistants will read, so it
needs its own address. When the preview library later moves into shared files (as the finder spec plans, after the
parallel projects), the page links them and the tool retires.

**`tools/make-famous.mjs`** reads `index.html` (`PV`, `pvMarkup()` through `vm` as the tests do, `STILL`, the base preview
rules and each preview's rules and keyframes) and the cards in `famous/index.html`, and rewrites two marked blocks: the CSS, and a
`PREVIEWS` object with each one's markup and still point (no card here needs a canvas engine). The page's short script
fills each card from it, plays it while on screen and holds its still frame under reduced motion, as the home page does.
The light and dark colors are the home page's, copied as in `404.html` (a test compares them). `famous/index.html` links
neither shared file (`demo-page.css`, `demo-page.js`): its own script copies, shows the toast, falls back to Ctrl+C (⌘C on
Apple devices) and clamps prompts on phones, and the tests pin the words.

### Layout

One centered column, at most 1040px wide, between the home page's top bar and footer:

1. **Top bar:** logo, Browse all (`../?view=all`), Famous effects (`aria-current="page"`), light/dark, the GitHub star
   (the tab pass adds Finder).
2. **Head:** a pill "12 effects from well-known websites", `h1` "Famous effects", the lede (also the page's description):
   "Effects people admire on well-known websites, the handbook animations that make something similar, and a prompt to
   build your own." Then, in muted text: "The Animation Handbook is not connected to any of these sites or their owners,
   and none of them has reviewed or approved this page. Each effect is described in our own words and shown only with
   the handbook's own demos."
3. **Jump row** (`nav` "Effects on this page"): one chip per entry ("Stripe · ribbon"), wrapping on wide screens and
   scrolling sideways on phones, like the home page's place chips. Then **the entries**, divided by thin lines.
4. **Suggest one:** "Seen an effect on a well-known site that you want explained? Suggest it on GitHub." (the new issue
   template), and "Each entry was checked by hand on the date shown; a site may have changed since." Then the home
   page's footer, without the count.

### An entry

```html
<section class="fx" id="stripe-ribbon" aria-labelledby="stripe-ribbon-t" data-fx-site="Stripe" data-fx-start="loop">
  <p class="fx-seen">Seen on <a href="https://stripe.com/" target="_blank" rel="noopener">stripe.com<span class="sr"> (opens in a new tab)</span></a> in <time datetime="2026-10-13">2026</time></p>
  <h2 id="stripe-ribbon-t" tabindex="-1">The twisting ribbon of light</h2>
  <p class="fx-what">…</p>
  <h3 class="fx-sub">Made with these animations</h3> <div class="fx-cards">…one to three cards…</div>
  <h3 class="fx-sub">A prompt to build something similar</h3>
  <p class="fx-prompt">Add a slowly twisting ribbon of colored light behind <mark>[the heading at the top of your page]</mark>. …</p>
  <button type="button" class="copy" aria-label="Copy the prompt for The twisting ribbon of light">Copy prompt</button>
</section>
```

- `data-fx-start` is `loop`, `load`, `scroll`, `hover` or `press`; the tests read it and `data-fx-site`.
- **Cards** look like the home page's, written as HTML (its `CATS` name and line, its page's link, `data-slug`); in
  place of the home page's place, the label on the preview says what the animation makes here (one to three words). No
  Copy prompt on these cards: the entry has one prompt. Three across from 761px, two below.
- **Copy prompt** copies the prompt as shown, brackets included, reads "Copied" for about two seconds and shows the home
  page's toast ("Prompt copied. Paste it into your AI assistant."). Where the clipboard is refused it selects the prompt
  and reads "Press Ctrl+C to copy" (⌘C on Apple devices), as on the demo pages. On phones a prompt shows five lines and
  "Show the full prompt", in the demo pages' words.

### Accessibility, phones and reduced motion

- Landmarks: the top bar's `nav`, `main`, the jump `nav`, the footer, a skip link to the first entry. Headings: `h1`,
  `h2` per entry (a jump moves focus to it), `h3` for its two parts, `h4` for card names. The site link's name ends
  "(opens in a new tab)"; previews are hidden from screen readers; each Copy names its entry, its label change announced.
- Text at least 4.5:1 in both themes, preview labels included; every link and button reachable by keyboard with a
  visible focus ring; hover effects only where hover exists.
- 375px and 320px: one column, 16px gutters, nothing wider than the screen, cards two across, Copy full width; every
  link, chip and button at least 44×44, the site link too. Previews play while in the middle of the screen.
- Reduced motion: every preview holds one still, clear frame (its `STILL` point), jumps do not glide, the toast does not
  slide; nothing moves by itself. From disk, every folder link names `index.html` (the top bar's `../` and `../?view=all`
  too), as on the home page. The only request that leaves the site is the GitHub star count the home page already makes.

## 5 · Legal rules: checklist for every entry

Given to the owner and binding here (rules to follow, not legal advice):

- [ ] The title, what you see and the prompt are in our own words: no sentence, feature name or slogan from the site.
- [ ] The site is named in plain text, in the page's own font and colors (no logo, icon, brand color or typeface), and
      linked to its public page.
- [ ] Shown only with the handbook's own demos and previews; nothing from the site in the repository or in posts about the
      page: no code, screenshots, videos, pictures, icons or logos.
- [ ] The not-connected line is on the page, above the first entry, on the first screen.
- [ ] Nothing implies approval or partnership: no "official", "approved", "partner", "as used by"; no company name in the
      page's title, description or social card; the prompt names no company and asks for the reader's own colors and
      content, never a copy of the site.
- [ ] "Seen on <site> in <year>", with the day checked in `datetime`; checked again before each release and at least once
      a year; an effect that has gone stays true as a past sighting or is replaced.
- [ ] A site owner who asks for an entry to be changed or removed gets it done promptly (the Suggest link is the contact).

## 6 · Tests (`tests/famous.test.js`, and changes to existing ones)

- **Frame:** `<title>` "Famous effects — Animation Handbook"; the description, Open Graph and Twitter descriptions equal
  the lede; canonical and `og:url` are the live address of `famous/`; Famous effects marked current in the top bar; the
  light and dark colors equal the home page's; the not-connected line exactly once, word for word, before the first entry.
- **Entries:** 10 to 12 `section.fx` with unique ids; one "Seen on" link (`https://`, `target="_blank" rel="noopener"`, its
  text the address without `https://` or `www.`) and a `<time>` whose year is the one shown; an `h2`; what you see in 25
  to 70 words; `data-fx-start` from the five kinds; `data-fx-site` set; the jump row links each entry, in order; the
  pill's number equals the number of `section.fx`.
- **Cards:** one to three per entry; each `data-slug` is a card in `CATS` whose page exists; the card's name and line are
  its `CATS` name and line, its link that page; a label of one to three words; two different animations on the page never
  share a preview (`PV`).
- **Prompts:** 60 to 130 words; start with "Add "; at least one [part to fill in]; no backtick, `<code>` or `<pre>`; no
  "Match the settings listed below."; say what happens under reduced motion; name touch, a tap or a finger when the entry
  starts on hover or press; never name any entry's site by name or address (X by address only: "an X" is a shape).
- **Previews:** the two marked blocks are exactly what `tools/make-famous.mjs` writes (as the skill test checks the
  skill), so a changed preview on the home page fails here until the tool runs.
- **Nothing from elsewhere:** no `<img>`, `<video>`, `<iframe>`, `<picture>`, `<object>`, `<embed>`, `@import` or
  `url(http`; every `src` and every stylesheet or icon `href` is a repository file; the only links that leave the site
  are the entries' sites, the GitHub repository and its issue template. No code on the page: no backtick, `<code>` or
  `<pre>` outside `<script>` and `<style>`.
- **Changed:** the sitemap test counts the home page, the Famous effects page and every animation (cards + 2); the skill
  test expects the new `llms.txt` line; a new check finds the link to `famous/` in the home page's footer.

## 7 · Page check (`node tools/check-pages.mjs famous`)

A new target at the six setups, passing with six `ok` lines; like `home`, it stores a star count first, so it never asks GitHub.

- No console errors or warnings, no sideways overflow; on phones every link, chip, card and button at least 44×44.
- 1280×800 and 375×812: the title, the lede and the not-connected line are on the first screen.
- Desktop: each jump link brings its entry into view with focus on its heading; each entry's previews move while on
  screen; each Copy prompt, pressed for real at its center, puts exactly that entry's prompt on the stubbed clipboard and
  shows "Copied" and the toast; with the clipboard refused, the prompt is selected and the label asks for Ctrl+C.
- Reduced motion: nothing runs, and every preview holds a still frame that shows something (the home check's pixel test,
  run on this page's cards).
- `home` still gives six `ok` lines with its new footer link.

## 8 · Docs and tools to update

- `CLAUDE.md`: a "Famous effects page" section (entry template, prompt rules, legal checklist, adding and re-checking an
  entry); the rule that changing a preview the page shows, or its cards, means running `node tools/make-famous.mjs`
  again (the famous test fails until then); and the `famous` target under "Tests and the page check".
- `CONTRIBUTING.md`: how to suggest an effect, through a new `.github/ISSUE_TEMPLATE/famous_effect.yml` (the site's
  address, what you see in your own words, no screenshots or code from the site).
- `README.md`: one line under "How to use it", after step 3, linking the page. `CHANGELOG.md`: a line under Unreleased.
- `tools/update-sitemap.mjs` writes `famous/` after the home page; `tools/make-skill.mjs` adds the page to `llms.txt`.
- The docs are written at this page's integration, each only its own lines (the coordination file's map).

## 9 · Build, order and time

On `feat/famous-effects`, cut from `main` (it needs nothing from the rollout), in separate worktrees
(`.claude/worktrees/fx-*`), each part built by one agent and reviewed by another; run folder
`.superpowers/sdd/<start date>-famous-effects/`, ports 8931 to 8939, page checks from the shared pool. It runs beside the
other projects; what it changes in shared files (`index.html`'s footer, `tools/check-pages.mjs`, `tests/pages.test.js`,
`tests/skill.test.js`, the sitemap and skill tools, the docs) is in the coordination file's map. It goes live as soon as the
owner approves it, by that file's release rule and launch-week window; nothing goes live before.

1. **Live check first (about 1 hour), before any entry is written:** an agent opens each site in the browser pane, only
   while the owner is not reviewing there, logged out, and records per entry what shows (YouTube on a slowed network, and
   whether its shapes move). No screenshot enters the repository. An entry that fails is swapped for the next reserve that
   passes (section 2), and each date becomes that day. Entries 7 and 8 wait for the owner (section 1).
2. **Two lanes (about 4 hours each):** (a), after step 1, the page, its entries as confirmed and its script; (b), from the
   start, the tool, the tests, the `famous` target, the sitemap and `llms.txt` tools, the issue template and the docs.
3. **Integration and review (about 2 hours):** the tests, `famous` and `home`, a final review against the legal
   checklist, then the owner's review of the real page at phone and desktop sizes, with entries 7 and 8 confirmed on the
   owner's own accounts or swapped for reserves.

About one day of agent work, then the owner's review. Generated files (the sitemap, `llms.txt`, the skill and this page's
two marked blocks) are never merged by hand: after any merge they are written again (the coordination file). The ten new
animations come after this page; if they change a preview it shows, `make-famous` runs again at their integration.

## Acceptance

- The tests pass; `famous` and `home` each give six `ok` lines.
- Every entry passes the legal checklist and was confirmed live on the date it shows (entries 7 and 8 by the owner).
- No code on the page; every sentence plain; American spelling.

No question is open: the release was answered on 2026-10-13 (Rules).
