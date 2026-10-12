#!/usr/bin/env node
// Writes the AI skill and llms.txt from the pages, their READMEs and the home page's cards: a development tool, not part
// of the site.
// Run it from the repo root after adding a page, and after changing any page's prompt, settings, description or Good for
// and Avoid on tags, or a README's Key parameters (tests/skill.test.js fails until then).
// Usage: node tools/make-skill.mjs
//   It reads CATS, PLACES and PLACE_LIST from the script of index.html (the categories and cards in the home page's order,
//   each card's places and the places' names) and every card's page, animations/<category>/<slug>/index.html: its <h1>, its
//   one-line description, its kind, its prompt (the words on the page, entities decoded and white space squeezed), its
//   Good for and Avoid on tags and its Try it settings. The settings are read by the page script's own readSettings
//   (assets/js/demo-page.js), run on a small stand-in for the browser's DOM built from the page's prompt and Try it step,
//   the way the home page reads a page for its cards' Copy prompt: the same controls in the same order, with the same
//   labels and values. A setting the page shows only for some choices of another one (marked hidden) is listed too, with
//   a note. From the page's README.md it reads the Key parameters table (name | default | effect): each setting's line
//   ends with the effect of the row named like the setting on the page, and a page without settings lists every row, the
//   demo's own values.
//   It writes skills/animation-handbook/SKILL.md, skills/animation-handbook/references/catalog.md, one
//   skills/animation-handbook/references/<category folder>.md per category, and llms.txt at the root. Each is written with
//   LF line endings, and only when its text changed; it prints every file with its size. Running it twice changes
//   nothing. buildSkill(root), exported for the test, returns the same files as { 'path from the root': 'text' } and
//   writes nothing.
// Exit code 1 when a card has no page, a page lacks a part the skill needs, a setting has no row in its README's Key
// parameters, or the skill folder holds a file this tool does not write.
import { existsSync, mkdirSync, readdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const SKILL = 'skills/animation-handbook';
const REPO = 'https://github.com/matinmonshizadeh/animation-handbook';
// How each kind of page runs, in plain words.
const KIND = { once: 'plays once', loop: 'moves by itself', do: 'reacts to the visitor', scroll: 'follows the scroll' };
// What the home page passes as the window when it reads a page it has fetched: styles are not computed, and with no
// matchMedia here the phone defaults do not count. PHONE answers the page script's phone question with yes.
const NO_STYLE = { getComputedStyle: () => ({ display: '' }) };
const PHONE = { getComputedStyle: () => ({ display: '' }), matchMedia: () => ({ matches: true }) };

const squeeze = s => s.replace(/\s+/g, ' ').trim();
// A Key parameters cell as a line ends it: its end punctuation dropped, so the line can end with exactly one period.
const clause = s => s.replace(/[\s.,;:]+$/, '');
const lineCount = text => text.split('\n').length - 1;
const wordCount = text => text.split(/\s+/).filter(Boolean).length;

// Where the bracket that opens at text[from] ('[' or '{') is closed, stepping over strings and // comments (as the tests
// read the home page).
function blockEnd(text, from) {
  const open = text[from], close = open === '[' ? ']' : '}';
  let depth = 0, i = from, quote = null;
  for (; i < text.length; i++) {
    const ch = text[i];
    if (quote) { if (ch === '\\') i++; else if (ch === quote) quote = null; continue; }
    if (ch === '/' && text[i + 1] === '/') { while (i < text.length && text[i] !== '\n') i++; continue; }
    if (ch === "'" || ch === '"' || ch === '`') quote = ch;
    else if (ch === open) depth++;
    else if (ch === close && --depth === 0) break;
  }
  return i;
}
// The value of `const NAME=` in the home page's script: an array or object literal of plain data, read with vm.
function homeConst(home, name) {
  const start = home.indexOf(`const ${name}=`);
  if (start < 0) throw new Error(`index.html has no const ${name}=`);
  const from = start + `const ${name}=`.length;
  return vm.runInNewContext('(' + home.slice(from, blockEnd(home, from) + 1) + ')');
}

// The entities the pages write; any other one stops the build, so a new one is added here rather than copied as it is.
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' };
function decode(s, where) {
  return s.replace(/&(?:#(\d+)|#[xX]([0-9a-fA-F]+)|([A-Za-z][A-Za-z0-9]*));/g, (all, dec, hex, name) => {
    if (dec || hex) return String.fromCodePoint(parseInt(dec || hex, dec ? 10 : 16));
    if (Object.hasOwn(ENTITIES, name)) return ENTITIES[name];
    throw new Error(`${where}: the entity ${all} is not one this tool reads (add it to ENTITIES in tools/make-skill.mjs)`);
  });
}

// A stand-in for the browser's DOM: just enough of Element and Document for the page script's readSettings and
// pageCopyText. Selectors are lists of compound selectors (a tag, .class, [attr], [attr=value] or [attr="value"]), the only
// kind that script uses.
const SELECTORS = new Map();
function compile(selector) {
  if (!SELECTORS.has(selector)) {
    SELECTORS.set(selector, selector.split(',').map(part => {
      const m = part.trim().match(/^([a-z][\w-]*)?((?:\.[\w-]+|\[[\w-]+(?:=(?:"[^"]*"|[^\]"]+))?\])*)$/i);
      if (!m || !part.trim()) throw new Error(`the stand-in DOM cannot read the selector "${selector}"`);
      const tests = m[1] ? [el => el.tagName === m[1].toLowerCase()] : [];
      for (const [, cls, attr, quoted, bare] of m[2].matchAll(/\.([\w-]+)|\[([\w-]+)(?:=(?:"([^"]*)"|([^\]"]+)))?\]/g)) {
        const value = quoted ?? bare;
        if (cls) tests.push(el => (el.attrs.class || '').split(/\s+/).includes(cls));
        else if (value === undefined) tests.push(el => Object.hasOwn(el.attrs, attr));
        else tests.push(el => el.attrs[attr] === value);
      }
      return el => tests.every(fn => fn(el));
    }));
  }
  return SELECTORS.get(selector);
}
class StandIn {
  constructor(tagName, attrs, parentElement) {
    Object.assign(this, { tagName, attrs, parentElement, childNodes: [], ownerDocument: parentElement ? parentElement.ownerDocument || parentElement : null });
  }
  getAttribute(name) { return Object.hasOwn(this.attrs, name) ? this.attrs[name] : null; }
  hasAttribute(name) { return Object.hasOwn(this.attrs, name); }
  get id() { return this.attrs.id || ''; }
  // With showHidden set on the document, an element marked hidden counts as shown (see readPage).
  get hidden() { return this.hasAttribute('hidden') && !(this.ownerDocument || this).showHidden; }
  get checked() { return this.hasAttribute('checked'); }
  get textContent() { return this.childNodes.map(n => (typeof n === 'string' ? n : n.textContent)).join(''); }
  // The value a field starts with: a text field's value attribute (without line breaks, as the browser keeps it), a
  // textarea's text, a menu's chosen option.
  get value() {
    if (this.tagName === 'textarea') return this.textContent;
    if (this.tagName === 'select') { const o = this.selectedOptions[0]; return o ? o.attrs.value ?? squeeze(o.textContent) : ''; }
    if (this.tagName !== 'input') return undefined;
    if (this.hasAttribute('value')) return this.attrs.value.replace(/[\r\n]/g, '');
    if ((this.attrs.type || '').toLowerCase() === 'range') throw new Error('a slider has no value attribute to start from');
    return '';
  }
  get selectedOptions() {
    const options = this.querySelectorAll('option'), chosen = options.filter(o => o.hasAttribute('selected'));
    if (this.hasAttribute('multiple')) return chosen;
    if (chosen.length) return [chosen[chosen.length - 1]];
    const first = options.find(o => !o.hasAttribute('disabled'));
    return first ? [first] : [];
  }
  *elements() { for (const n of this.childNodes) if (typeof n !== 'string') { yield n; yield* n.elements(); } }
  matches(selector) { return compile(selector).some(test => test(this)); }
  closest(selector) { for (let n = this; n; n = n.parentElement) if (n.matches(selector)) return n; return null; }
  querySelector(selector) { for (const el of this.elements()) if (el.matches(selector)) return el; return null; }
  querySelectorAll(selector) { return [...this.elements()].filter(el => el.matches(selector)); }
  getElementById(id) { for (const el of this.elements()) if (el.attrs.id === id) return el; return null; }
}
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
// The markup as a stand-in document, read as the browser reads this markup: entities decoded, a void element (input,
// br…) or one written <x/> without an end tag, a textarea's text taken as it is but for its first line break. Every
// other element must be closed in order; anything else stops the build rather than reading the page wrongly.
function standIn(html, where) {
  const doc = new StandIn('#document', {}, null);
  const TOKEN = /<!--[\s\S]*?-->|<\/([a-zA-Z][\w-]*)\s*>|<([a-zA-Z][\w-]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>|[^<]+|</g;
  let node = doc, m;
  while ((m = TOKEN.exec(html))) {
    if (m[1]) {
      if (node.tagName !== m[1].toLowerCase()) throw new Error(`${where}: </${m[1]}> where <${node.tagName}> is open`);
      node = node.parentElement;
    } else if (m[2]) {
      const attrs = {};
      for (const [, name, dq, sq, bare] of m[3].matchAll(/([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
        if (!Object.hasOwn(attrs, name.toLowerCase())) attrs[name.toLowerCase()] = decode(dq ?? sq ?? bare ?? '', where);
      }
      const el = new StandIn(m[2].toLowerCase(), attrs, node);
      node.childNodes.push(el);
      if (el.tagName === 'textarea') {
        const end = html.indexOf('</textarea>', TOKEN.lastIndex);
        if (end < 0) throw new Error(`${where}: a textarea is not closed`);
        el.childNodes.push(decode(html.slice(TOKEN.lastIndex, end), where).replace(/^\n/, ''));
        TOKEN.lastIndex = end + '</textarea>'.length;
      } else if (!VOID.has(el.tagName) && !m[4]) node = el;
    } else if (!m[0].startsWith('<!--')) node.childNodes.push(decode(m[0], where));
  }
  if (node !== doc) throw new Error(`${where}: <${node.tagName}> is not closed`);
  return doc;
}

// The anchor GitHub gives a heading: lowercased, every character but letters, digits, spaces, "-" and "_" dropped, each
// space made a "-", and -1, -2… added to an anchor already used in the same file (`seen` holds those).
function anchor(heading, seen) {
  const slug = heading.toLowerCase().replace(/[^\p{L}\p{M}\p{N}_ -]/gu, '').replace(/ /g, '-');
  const n = seen.get(slug) || 0;
  seen.set(slug, n + 1);
  return n ? `${slug}-${n}` : slug;
}

// The rows of the README's Key parameters table as { name, start, effect }: the rows after its header and divider (as
// tests/pages.test.js reads the names), each name | default | effect with its white space squeezed. The section is found
// by the page script's own sections, which the page uses to read the README too.
function keyParameters(root, folder, slug, DemoPage) {
  const where = `${folder}/${slug}`, file = join(root, folder, slug, 'README.md');
  if (!existsSync(file)) throw new Error(`${where}: the page has no README.md`);
  const table = DemoPage.sections(readFileSync(file, 'utf8'))['Key parameters'];
  if (!table) throw new Error(`${where}: README.md has no Key parameters`);
  const rows = table.split('\n').filter(line => /^\s*\|/.test(line)).slice(2).map(line => {
    const cells = line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(squeeze);
    if (cells.length !== 3 || !cells.every(Boolean)) throw new Error(`${where}: a row of README.md's Key parameters is not name | default | effect: ${line.trim()}`);
    return { name: cells[0], start: cells[1], effect: cells[2] };
  });
  if (!rows.length) throw new Error(`${where}: README.md's Key parameters has no rows`);
  return rows;
}

// A setting's name as the page shows it, which names its row in the README's Key parameters (tests/pages.test.js compares
// the two): the words beside a switch, or else the one .hb-setting-name of its setting ('' when there is none, or several).
// A data-hb-label changes only what the page copies, so it is not read here.
function shownName(control) {
  const row = control.closest('.hb-switch-row');
  if (row) {
    const words = row.childNodes.find(n => typeof n !== 'string' && n.tagName === 'span');
    return words ? squeeze(words.textContent) : '';
  }
  const setting = control.closest('.hb-setting');
  const names = setting ? setting.querySelectorAll('.hb-setting-name') : [];
  return names.length === 1 ? squeeze(names[0].textContent) : '';
}

// One page as the skill tells it: { title, lede, kind, prompt, good, avoid, settings, params } where settings holds one
// { label, text, effect } per setting in Try it (but one marked data-hb-skip, which the page never copies), effect being
// what its README's Key parameters says it does, and params holds every row of that table (see keyParameters).
function readPage(root, folder, slug, DemoPage) {
  const where = `${folder}/${slug}`, file = join(root, folder, slug, 'index.html');
  if (!existsSync(file)) throw new Error(`${where}: the card has no page (index.html)`);
  const html = readFileSync(file, 'utf8').replace(/\r\n?/g, '\n'); // as the browser reads it
  const one = (pattern, what) => {
    const m = html.match(pattern);
    if (!m) throw new Error(`${where}: no ${what}`);
    return m;
  };
  const words = (pattern, what) => squeeze(decode(one(pattern, what)[1], where));
  const tags = cls => {
    const list = one(new RegExp(`<ul class="hb-tags ${cls}">([\\s\\S]*?)</ul>`), `<ul class="hb-tags ${cls}">`)[1];
    return [...list.matchAll(/<li>([^<]*)<\/li>/g)].map(m => squeeze(decode(m[1], where)));
  };
  const promptHtml = one(/<p class="hb-prompt">[^<]*<\/p>/, 'prompt (<p class="hb-prompt"> with words only)')[0];
  const tryAt = html.indexOf('<section class="hb-step hb-try"');
  const tryEnd = tryAt < 0 ? -1 : html.indexOf('</section>', tryAt);
  if (tryAt >= 0 && tryEnd < 0) throw new Error(`${where}: the Try it step is not closed`);
  const tryHtml = tryAt < 0 ? '' : html.slice(tryAt, tryEnd + '</section>'.length);
  const doc = standIn(`<main class="hb-page">${promptHtml}${tryHtml}</main>`, where);
  const prompt = squeeze(doc.querySelector('.hb-prompt').textContent);
  // The settings, read with the ones marked hidden counted as shown: a page shows such a setting only for some choices of
  // another one (First color and Second color with Two colors, say), and copies it then. The entry lists it too, so that
  // the prompt's words about it have a setting to match.
  const tryStep = doc.querySelector('.hb-try');
  doc.showHidden = true;
  const items = tryStep ? DemoPage.readSettings(doc, tryStep, NO_STYLE) : [];
  const phoneItems = tryStep ? DemoPage.readSettings(doc, tryStep, PHONE) : [];
  doc.showHidden = false;
  const params = keyParameters(root, folder, slug, DemoPage);
  const settings = items.map(({ label, value, control }, i) => {
    if (!label) throw new Error(`${where}: a setting in Try it has no label (the page leaves it out of Copy prompt)`);
    let text = describe(control, value, phoneItems[i].value);
    if (!text) throw new Error(`${where}: the setting "${label}" has no choices`);
    for (let n = control; n !== tryStep; n = n.parentElement) {
      if (n.hasAttribute('hidden')) { text += ' (the page shows it only for some choices of another setting)'; break; }
    }
    const name = shownName(control);
    if (!name) throw new Error(`${where}: the setting "${label}" shows no name of its own (a .hb-setting-name in its .hb-setting, or the words beside a switch)`);
    const row = params.find(p => p.name === name);
    if (!row) throw new Error(`${where}: the setting "${name}" has no row in README.md's Key parameters`);
    return { label, text, effect: row.effect };
  });
  return {
    title: words(/<h1>([^<]*)<\/h1>/, '<h1>'),
    lede: words(/<p class="hb-lede">([^<]*)<\/p>/, 'one-line description (<p class="hb-lede">)'),
    kind: one(/<body class="hb" data-hb-kind="(once|loop|do|scroll)"/, 'page kind (data-hb-kind on the body)')[1],
    prompt, good: tags('hb-good'), avoid: tags('hb-avoid'), settings, params
  };
}

// A setting's choices in plain words: the default in bold, the phone default named where a page starts lower there.
function describe(control, value, phoneValue) {
  const phone = phoneValue !== value ? ` (phones start with ${phoneValue})` : '';
  // A name that holds the separator itself (the choice "Dot ·") is quoted, so the list stays readable.
  const named = name => (name.includes('·') ? `"${name}"` : name);
  const choice = el => named(el.getAttribute('aria-label') || squeeze(el.textContent)); // as the page script names a choice
  if (control.matches('.seg, .swatches')) {
    const pressed = control.querySelector('.on, [aria-pressed="true"]');
    return control.querySelectorAll('button').map(b => (b === pressed ? `**${choice(b)}**` : choice(b))).join(' · ') + phone;
  }
  if (control.matches('input[type=checkbox]')) return (value === 'on' ? '**on** · off' : 'on · **off**') + phone;
  if (control.matches('input[type=text]')) {
    const start = squeeze(control.value);
    return (start ? `text field, starts as "${start}"` : 'text field, starts empty') + phone;
  }
  if (control.matches('textarea')) { // its lines kept apart: the page copies them on one line, but they are lines
    const lines = control.value.split('\n').map(squeeze).filter(Boolean).map(line => `"${line}"`);
    if (lines.length < 2) return (lines.length ? `text box, starts as ${lines[0]}` : 'text box, starts empty') + phone;
    return `text box, starts with the lines ${lines.slice(0, -1).join(', ')} and ${lines[lines.length - 1]}` + phone;
  }
  if (control.matches('select')) {
    const chosen = control.selectedOptions[0];
    return control.querySelectorAll('option').map(o => (o === chosen ? `**${named(squeeze(o.textContent))}**` : named(squeeze(o.textContent)))).join(' · ') + phone;
  }
  return `slider, starts at ${value}` + phone;
}

function entry(page) {
  const lines = [`## ${page.title}`, '', page.lede, '',
    `- Live demo: ${page.address}`,
    `- How it runs: ${KIND[page.kind]}`,
    `- Good for: ${page.good.join(' · ')}`,
    `- Avoid on: ${page.avoid.join(' · ')}`,
    '', '**Prompt**', '', page.prompt, ''];
  // Without settings, the README's Key parameters gives the values the demo is built with.
  if (!page.settings.length) {
    lines.push("**Settings**: none, so the prompt is complete as it is. The demo's own values:", '',
      ...page.params.map(p => `- ${p.name}: ${clause(p.start)}. ${clause(p.effect)}.`), '');
  } else {
    lines.push("**Settings** (the choice in bold is where the demo starts; each line ends with what the setting does, with the demo's values):", '',
      ...page.settings.map(s => `- ${s.label}: ${s.text}. ${clause(s.effect)}.`), '');
  }
  return lines;
}

const SKILL_BODY = ({ total, base, cats }) => `# Animation Handbook

[Animation Handbook](${base}) is a free reference of ${total} web animation techniques. Each has a live demo, a few plain settings for most (speed, direction, color and the like) and a prompt that says in plain words how to build it. This skill holds every prompt and every setting with the demo's values.

## How to use it

1. **Find the technique.** Search [references/catalog.md](references/catalog.md) for the effect the user describes and a synonym or two; read the whole file only when you cannot search, the user wants ideas or nothing fits (its By place index is at the end). Each line ends with its places, the parts of a page it suits (${cats.places}): match both what the user describes and where it goes. When two fit equally well, build one and mention the other; when none fits, say so and build what the user asked for with the rules below.
2. **Read its entry.** It is in the category file named after the folder in its address (references/04-micro-interactions.md for an address under animations/04-micro-interactions/), from the heading with the technique's name to the next heading. If the user's place is on its Avoid on list, prefer a better fit; if they asked for this one by name, build it and say what may suit better.
3. **Choose the settings.** Each setting lists its choices and what they do, with the demo's values. The choice in bold is where the demo starts, set to show the effect off in a small box: a starting point, not advice for every page. Take what the user asked for first ("a panel that slides in slowly from the left" picks the slow speed and the left side), then choose the rest for their page: its size, how many things move and what the effect is for. A speed that suits a small demo can feel rushed across a full-width hero, and a delay that reads well between many small tiles can vanish between a few large cards. Ask only when a choice changes the result a lot and nothing points either way.
4. **Build what the user asked, no more and no less**, in their own stack, with their element in place of each [part in square brackets]. The prompt describes the whole technique as its demo shows it, with every option the demo offers. Take from it the look and the rules that make it look right, and build only the parts the request needs, each with one plain way to use it: a single confirmation needs one message with a close button, not a stack of messages that also close on a tap or a swipe. Every extra gesture and option is more code that can break. "Match the settings listed below" means your choices from step 3.
5. **Check it** against the rules below. Then tell the user, in a few lines, which technique you built, with its live demo address; the settings you chose, and why where they differ from the demo's; and the parts of the prompt you left out, which they can ask for.

When the user only asks which animation to use, answer for their page: suggest one or two for each place they ask about, and for each say in concrete terms what moves, for how long and after what delay, and what visitors who ask for reduced motion see, with its live demo address. Give real values, not the demo setting names, which mean nothing to someone who has not seen the demo, and build once they choose. To improve an animation the project already has, find its closest technique the same way and change only what falls short of that prompt and the rules below, adding no part they did not ask for.

## The rules for the user's page

Keep these even where a prompt does not say them, and follow them where a prompt differs: each prompt describes its technique as its demo shows it, in a box on a page about animation.

- **Keep the page whole without the animation.** Nothing in view waits for a scroll: whatever is on screen when the page loads, or after a jump to an anchor, plays its entrance right away, and anything the visitor can scroll to reaches its trigger, even at the very end of the page. An effect that moves only as far as the visitor scrolls, such as a scrub, simply starts from its first frame. Hide content for an entrance only from a script, early enough that nothing flickers, and create controls that work only with a script, such as an accordion's buttons, from that script, so the page still shows everything if the script fails. Where the browser cannot run an effect, such as one that needs WebGL, show a still version in its place rather than an error.
- **Give keyboard users what mouse users get on what they can reach.** On a link, button or form control, or a card that holds one, a hover state such as a color, a lift or a revealed label also shows on keyboard focus, and an effect that starts on a press also starts when the keyboard presses it, from the middle of the control. An effect that follows the pointer has nothing to follow from the keyboard: leave the element its normal focus style. Do not make other content focusable for a decorative effect, and leave the arrow keys alone unless the element is a control that uses them, such as a slider, a carousel or a list you reorder: extra tab stops and captured keys cost keyboard users more than the effect gives them.
- **Give touch what it needs.** When a hover reveals or does something people need, such as a menu, a tooltip, a hidden button or a pause to read moving text, a tap does it too, and a drag uses pointer events so that touch works. A purely decorative pointer effect, such as a tilt, a glow or a pull toward the pointer, stays still on touch screens, even where the prompt describes a touch version: a finger on a page is usually starting a scroll.
- **Follow reduced motion.** When the device asks for it, decorative movement stops: show the end state or a short fade instead, start loops paused and keep pointer effects still. Where the movement itself tells the visitor something, such as a spinner, a progress bar or an effect tied to the scroll position, keep the calm version the prompt describes.
- **Move with transform and fade with opacity.** Never animate width, height, top, left or box-shadow, which make the browser lay out or repaint the page on every frame; only a box that pushes the content below as it opens or closes, such as an accordion's answer, may animate its height. Where the effect is something else, such as a clip, a line that draws itself, a color change or a blur-in, the prompt says how to keep it smooth.
- **Make soft shapes from gradients.** A glow or a blob of color that only needs soft edges gets them from a gradient that fades to transparent, not from a large blur filter, which costs the browser a lot on every frame while the shape moves; a gradient is drawn once and then only moved. Keep the blur where it is the effect, as in a blur-in, depth of field, frosted glass, a gooey merge or the glow of a moving border.
- **Stop what nobody can see.** A loop that keeps running, such as an ambient background, a canvas or a frame loop, pauses while it is scrolled out of view; a frame loop or timer also stops while the tab is hidden. A small CSS loop, such as a spinner, needs neither.
- **Run pointer and frame-by-frame effects from one frame loop.** Pointer and scroll handlers only store the latest position; a frame callback reads sizes once, writes the styles and stops when nothing moves. Each frame moves by the time since the last one, capped at about 50 ms, never by a fixed amount per frame, so it runs at the same speed on 30, 60 and 120 Hz screens.
- **Lighten heavy effects on phones**, up to 600 px wide or 500 px tall when held sideways: less blur, fewer particles, a simpler shader.
- **Keep touch targets at least 44×44 px on phones**, buttons and handles drawn inside the animation included, and **text meant to be read at least 4.5:1 against its background.**
- **Add no library the project does not already use.** Every prompt works with plain code; use GSAP, Framer Motion, Three.js or the like only where the project has it or the user asks for it.

## Where to look

- [references/catalog.md](references/catalog.md): all ${total} in one list, grouped by category, with an index by place.
${cats.lines}

Each live demo address is also the technique's folder in ${REPO}; read its README (the address followed by README.md) only when the user asks how a technique works.
`;

export function buildSkill(root) {
  const DemoPage = createRequire(import.meta.url)(join(root, 'assets/js/demo-page.js'));
  const home = readFileSync(join(root, 'index.html'), 'utf8');
  const base = (home.match(/<link rel="canonical" href="([^"]+\/)">/) || [])[1];
  if (!base) throw new Error('index.html has no canonical address ending in /');
  const CATS = homeConst(home, 'CATS'), PLACES = homeConst(home, 'PLACES');
  const placeName = Object.fromEntries(homeConst(home, 'PLACE_LIST').map(p => [p.key, p.name]));
  const total = CATS.reduce((n, cat) => n + cat.entries.length, 0);

  // Every category with its pages, each page with its address, places and anchor in its category file.
  const cats = CATS.map(cat => {
    const folder = cat.folder.replace(/\/$/, ''), file = `${folder.split('/').pop()}.md`;
    // The anchors of the file's title and its Contents heading come before the entries'.
    const seen = new Map();
    for (const heading of [`${cat.n} · ${cat.name}`, 'Contents']) anchor(heading, seen);
    const pages = cat.entries.map(([slug]) => {
      const page = readPage(root, folder, slug, DemoPage);
      const places = (PLACES[slug] || []).map(key => placeName[key]);
      if (!places.length || places.includes(undefined)) throw new Error(`${folder}/${slug}: no known place in PLACES`);
      return { ...page, slug, address: `${base}${folder}/${slug}/`, places, anchor: anchor(page.title, seen) };
    });
    return { ...cat, file, pages };
  });

  const files = {};
  files[`${SKILL}/SKILL.md`] = [
    '---',
    'name: animation-handbook',
    `description: Builds web animations from Animation Handbook, a set of ${total} tested techniques with plain-words build prompts and settings (scroll effects, entrances and exits, page transitions, micro-interactions for buttons and forms, text effects, 3D and WebGL, ambient backgrounds). Use when the user asks to add, pick or improve an animation, transition, hover or click effect, loading state, scroll effect or background motion in a web page or web app, in any framework or plain HTML, CSS and JavaScript.`,
    'license: MIT',
    '---',
    '',
    SKILL_BODY({ total, base, cats: {
      places: Object.values(placeName).join(', '),
      lines: cats.map(cat => `- [references/${cat.file}](references/${cat.file}): ${cat.name}, ${cat.pages.length} animations. ${cat.desc}`).join('\n')
    } })
  ].join('\n');

  const seen = new Map();
  anchor('Catalog', seen); // the file's title
  const sections = [...cats.map(cat => `${cat.n} · ${cat.name}`), 'By place'].map(h => ({ heading: h, anchor: anchor(h, seen) }));
  const byPlace = Object.entries(placeName).map(([key, name]) => {
    const names = cats.flatMap(cat => cat.pages.filter(p => (PLACES[p.slug] || []).includes(key)).map(p => p.title));
    return `- **${name}** (${names.length}): ${names.join(', ')}`;
  });
  files[`${SKILL}/references/catalog.md`] = [
    '# Catalog', '',
    `All ${total} animations of Animation Handbook, in the home page's order and grouped by category. Each line gives the name linked to its live demo, what it does and what it is best for, and its places (the parts of a page it suits, the main one first). The category folder in the address names the file that holds its full entry, with the prompt and the settings.`, '',
    `Contents: ${sections.map(s => `[${s.heading}](#${s.anchor})`).join(' · ')}`, '',
    ...cats.flatMap(cat => [`## ${cat.n} · ${cat.name}`, '', `${cat.desc} ${cat.pages.length} animations, in [${cat.file}](${cat.file}).`, '',
      ...cat.pages.map(p => `- [${p.title}](${p.address}): ${p.lede} Places: ${p.places.join(', ')}.`), '']),
    '## By place', '', "The home page's places, each with the animations that suit it.", '', ...byPlace, ''
  ].join('\n');

  for (const cat of cats) {
    files[`${SKILL}/references/${cat.file}`] = [
      `# ${cat.n} · ${cat.name}`, '',
      `${cat.desc} ${cat.pages.length} animations from Animation Handbook, in the home page's order. Each entry gives the live demo, how it runs, what it is good for and what to avoid it on, the prompt from its page word for word, and its settings with what each does and the demo's values.`, '',
      '## Contents', '', ...cat.pages.map(p => `- [${p.title}](#${p.anchor})`), '',
      ...cat.pages.flatMap(entry)
    ].join('\n');
  }

  files['llms.txt'] = [
    '# Animation Handbook', '',
    `> A visual reference of ${total} web animation techniques, each with a live demo and a plain-words prompt for building it with an AI assistant.`, '',
    `Each page plays one technique live and gives a ready-made prompt that describes it in plain words, with no code. Most pages also have a few plain settings, such as speed or direction, and the prompt you copy lists your choices. Each technique's folder on GitHub has a README on how it works, the values that matter and production notes. To give an AI coding assistant all ${total} prompts and settings at once, install the Agent Skill: \`npx skills add matinmonshizadeh/animation-handbook\`.`, '',
    ...CATS.flatMap(cat => [`## ${cat.name}`, '',
      ...cat.entries.map(([slug, name, desc]) => `- [${name}](${base}${cat.folder.replace(/\/$/, '')}/${slug}/): ${desc}`), '']),
    // The skill's own files, which the site serves as they are: every prompt and setting, as Markdown.
    '## Skill files', '',
    `- [SKILL.md](${base}${SKILL}/SKILL.md): how to find a technique, choose its settings for the user's page and build it, with the rules for real pages`,
    `- [references/catalog.md](${base}${SKILL}/references/catalog.md): all ${total} in one list, with what each does and where it goes, and an index by place`,
    ...cats.map(cat => `- [references/${cat.file}](${base}${SKILL}/references/${cat.file}): the ${cat.pages.length} ${cat.name} entries, each with its prompt and its settings, with the demo's values`), '',
    '## Optional', '',
    `- [Source on GitHub](${REPO}): every demo's code, each technique's README and the Agent Skill`, ''
  ].join('\n');
  return files;
}

// Run as a command, not imported by the test: write the files that changed and print them all.
// The command's path is compared with its real path, so a run through a junction or a link counts too.
const self = (() => { try { return realpathSync(process.argv[1]); } catch { return ''; } })();
if (self.toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  const ROOT = fileURLToPath(new URL('..', import.meta.url));
  try {
    const files = buildSkill(ROOT);
    for (const [rel, text] of Object.entries(files)) {
      const file = join(ROOT, rel);
      const old = existsSync(file) ? readFileSync(file, 'utf8').replace(/\r\n/g, '\n') : null;
      if (old !== text) {
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, text);
      }
      console.log(`${rel}: ${lineCount(text)} lines, ${wordCount(text)} words${old === null ? ' (new)' : old === text ? '' : ' (written)'}`);
    }
    // The skill folder holds only what this tool writes: a stray file (a category that was renamed, say) is named here.
    const under = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e =>
      e.isDirectory() ? under(join(dir, e.name)) : [relative(ROOT, join(dir, e.name)).split(sep).join('/')]);
    const stray = under(join(ROOT, SKILL)).filter(rel => !Object.hasOwn(files, rel));
    for (const rel of stray) console.error(`${rel}: not written by this tool; remove it`);
    if (stray.length) process.exitCode = 1;
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  }
}
