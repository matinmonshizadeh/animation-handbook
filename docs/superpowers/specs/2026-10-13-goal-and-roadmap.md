# Goal and roadmap

2026-10-13, from a talk with the owner and three research reports (people's real problems, what other sites miss, how
free resources that lasted kept going).

## Goal

Help anyone **understand** web animation by **seeing** it: what each animation is, how it works inside and when to use
it, and then get it built with a plain-words prompt for their AI assistant. Free, with no code on the site and no
sign-up.

## Why this goal

- AI now writes animation code well. In the skill test of 2026-10-13, Opus and Sonnet built as well without the skill
  as with it. What stays hard is the human part: knowing what exists, what it is called, which one fits and whether the
  result is good. A model cannot want something for you.
- Learning web motion **visually, for free, without code** is a gap. The good teaching is code-first (Josh Comeau, MDN,
  YouTube) or paid and closed (animations.dev, closed until 2027). Material 3 and Fluent 2 teach motion visually, but
  only for app screens.
- Other gaps that fit the handbook: no good "what is this animation called?" finder; no free do/don't guide to choosing
  motion by UI moment for the web; nothing that switches one demo between a good and a bad version.
- Not our race: component libraries (21st.dev has 12,000+ React items, Uiverse 7,400+) and code tutorials.
- A warning for the learning goal: learners now ask AI. Stack Overflow questions tagged css-animations fell from 412
  (2023, January to mid-October) to 7 (2026), and Josh Comeau's 2026 animation course sells about a third of a usual
  launch. Learning on the handbook must be quick and visual, not a long course; the pilot tests whether it lands.
- Visitors' side: motion fatigue ("Death to Scroll Fade", 412 points on Hacker News) and motion sickness come up
  steadily, so every lesson keeps restraint and reduced motion in view.

## Who it serves

People who want to understand animation: beginners, designers, developers who are learning, and people who build with AI
and want to know what to ask for. The owner's first priority (2026-10-13): **learning**.

## Principles

- Show, do not code: the site never shows code; each technique's README on GitHub keeps the technical detail.
- Finish every part before it goes live. Half-done sections are what people remember (The Book of Shaders' empty
  chapters, Animista's nine years in Beta).
- Keep it short and guided, so it never overwhelms (the top complaint about roadmap.sh).
- Free forever: no sign-up, no paywall.
- Stable names and addresses, so people and tools can rely on them.

## Roadmap

0. **Launch** (the owner's posts: Reddit on Oct 17, Show HN on Oct 25) with the site as it is today.
1. **Learn pilot** (now): See inside, Compare, the Learning path and Motion basics on Parallax Scrolling, plus the Learn
   page. The owner approves from the real pages. Spec: `2026-10-13-learn-pilot-design.md`.
2. **Learn rollout** (after approval): See inside and Compare on all 166 pages, all eight idea lessons, the full path, a
   way in from the home page, and the docs. It goes live as one finished piece.
3. **Next jobs** (their order is decided after step 2 and the launch's feedback; Name it is the recommended first):
   - **Name it:** a "what did you see?" finder: describe what moved and what started it, and get the technique's name.
     It is the most frequent request found: about 110 "what is this animation called / how do I make the one on site X"
     threads since 2025 in r/css, r/Frontend and r/web_design alone, most of them unanswered or removed.
   - **Choose it:** do/don't pages by UI moment (opening a menu, showing a message, changing pages, loading).
   - **Judge it:** good and bad versions of one demo side by side (too slow, too much, jumpy), so people learn to see the
     difference in what their AI built.

## Next projects (status 2026-10-13)

The pilot is built on `feat/see-inside-compare` (not live). Having seen it, the owner narrowed step 2 to See inside and
Compare, paused the learning path and Motion basics (kept on `feat/learn-pilot`) and moved Name it forward. The order,
branches, shared files and releases are in `2026-10-13-next-projects-coordination.md`.

1. **See inside and Compare on all 166 pages** (`2026-10-13-see-inside-compare-rollout-design.md`): one page per category
   first for the owner's approval, then the rest; live in one piece on the owner's word.
2. **Beside it:** the **Animation finder** (Name it; `2026-10-13-animation-finder-design.md`) and **Famous effects**
   (`2026-10-13-famous-effects-design.md`). Each goes live as soon as it is ready and the owner approves it, reached from
   the home page.
3. **Ten new animations** with both views from the start (`2026-10-13-ten-new-animations-design.md`).
4. **Finder and Famous effects tabs** in every page's top bar: a short spec written after step 3.

Launch posts stay as planned (Reddit on 2026-10-17, Show HN on 2026-10-25); the finder and Famous effects may be live by
then, on the owner's word, and nothing merges into main from 2026-10-23 to 2026-10-26 without the owner's explicit word.
Choose it and Judge it wait; Compare's common-mistake halves (about 35 pages) are a first step toward Judge it.

## Ideas to discuss later (not decided)

- GitHub Sponsors and, at most, one or two sponsors that make animation tools; never a paywall.
- Volunteer translations, a second maintainer, a feed or newsletter of new animations.
- Measure value by feedback and skill installs rather than page views: AI answers now take page views from reference
  sites (Tailwind's docs traffic fell by about 40%).
