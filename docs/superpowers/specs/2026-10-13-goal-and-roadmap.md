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
3. **Next jobs** (their order is decided after step 2 and the launch's feedback):
   - **Name it:** a "what did you see?" finder: describe what moved and what started it, and get the technique's name.
   - **Choose it:** do/don't pages by UI moment (opening a menu, showing a message, changing pages, loading).
   - **Judge it:** good and bad versions of one demo side by side (too slow, too much, jumpy), so people learn to see the
     difference in what their AI built.

## Ideas to discuss later (not decided)

- GitHub Sponsors and, at most, one or two sponsors that make animation tools; never a paywall.
- Volunteer translations, a second maintainer, a feed or newsletter of new animations.
- Measure value by feedback and skill installs rather than page views: AI answers now take page views from reference
  sites (Tailwind's docs traffic fell by about 40%).
