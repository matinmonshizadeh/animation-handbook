// Static checks for the guided-steps demo pages, their READMEs, the home page and the shared stylesheet.
// Run from the repo root: node --test "tests/*.test.js"
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sections, table } = require('../assets/js/handbook.js');

const ROOT = path.resolve(__dirname, '..');
const ANIM = path.join(ROOT, 'animations');
const read = f => fs.readFileSync(f, 'utf8');
const count = (s, sub) => s.split(sub).length - 1;
const words = s => s.trim().split(/\s+/).length;
const isDemoDir = dir => fs.existsSync(path.join(dir, 'index.html'));
// The part of s from the first `from` up to the next `to` after it ('' when `from` is missing).
const between = (s, from, to) => {
  const start = s.indexOf(from);
  if (start < 0) return '';
  const end = s.indexOf(to, start + from.length);
  return s.slice(start, end < 0 ? undefined : end);
};
const decode = s => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
// The rules of a stylesheet as { selector, body }: comments removed, rules inside @media and @supports included.
const cssRules = css => [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  .map(m => ({ selector: m[1].trim(), body: m[2] }));
// [ids, classes + attributes + pseudo-classes, elements] of a selector that has no functional pseudo-class.
const specificity = selector => [
  (selector.match(/#[\w-]+/g) || []).length,
  (selector.match(/\.[\w-]+|\[[^\]]*\]|(?<!:):(?!:)[\w-]+/g) || []).length,
  (selector.replace(/\.[\w-]+|#[\w-]+|\[[^\]]*\]|::?[\w-]+/g, ' ').match(/[a-zA-Z][\w-]*/g) || []).length
];
const outranks = (a, b) => { for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i]; return false; };

const demos = fs.readdirSync(ANIM, { withFileTypes: true }).filter(c => c.isDirectory()).flatMap(c =>
  fs.readdirSync(path.join(ANIM, c.name), { withFileTypes: true }).filter(d => d.isDirectory())
    .map(d => ({ cat: c.name, slug: d.name, dir: path.join(ANIM, c.name, d.name) })));
const pageOf = d => read(path.join(d.dir, 'index.html'));
const steps = demos.filter(d => pageOf(d).includes('<main class="hb-page">'));
const HOME = read(path.join(ROOT, 'index.html'));
const tryItOf = html => between(html, '<section class="hb-step hb-try"', '<section class="hb-step hb-prompt-step"');
// The raw first column of the README's Key parameters table.
const keyParameters = d => sections(read(path.join(d.dir, 'README.md')))['Key parameters'].split('\n')
  .filter(l => /^\s*\|/.test(l)).slice(2).map(row => (row.split('|')[1] || '').trim()).filter(Boolean);

const ENTRANCE_EXIT = '02-entrance-and-exit';
// Categories whose demos have all moved to the guided-steps page. A demo here that lost <main class="hb-page">
// would otherwise drop out of every check below without any failure. Add a category when its last demo is converted.
const CONVERTED = [ENTRANCE_EXIT, '05-text-typography'];

// The Pause button of a loop page, exactly as in the template; {MODE} is '' (the page pauses itself) or '="css"'.
const PAUSE = '<button class="hb-play" type="button" id="btn-pause" data-hb-pause{MODE} data-state="playing"><svg class="hb-ic hb-i-pause" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg><svg class="hb-ic hb-i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3l14 9-14 9z"/></svg><span class="hb-pause-label">Pause</span></button>';

// The Show me and Reset buttons of a do-it page, exactly as in the template (Reset only where the demo has a state to reset).
const SHOW_ME = '<button class="hb-play" type="button" id="btn-demo" data-hb-demo><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"/></svg>Show me</button>';
const RESET = '<button class="hb-play" type="button" id="btn-reset" data-hb-reset><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>Reset</button>';

// The Play and Back to top buttons of a scroll page, exactly as in the template.
const PLAY = '<button class="hb-play" type="button" id="btn-scroll" data-hb-autoscroll><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>Play</button>';
const TOP = '<button class="hb-play" type="button" id="btn-top" data-hb-top><svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>Back to top</button>';

// Show me belongs to do-it pages and Reset to do-it and loop pages, each exactly as in the template: the shared script picks
// what to press on arrival by the button it finds, and Reset brings back what the visitor changed. `html` is the whole page
// and `player` its player bar.
function assertShowMeAndReset(kind, html, player) {
  const bar = player.replace(/>\s+</g, '><'); // the player bar without the white space between its elements
  if (kind === 'do') {
    assert.equal(count(html, 'data-hb-demo'), 1, 'one Show me control');
    assert.ok(bar.includes(SHOW_ME), 'the Show me button is in the player bar exactly as in the template');
  } else {
    assert.equal(count(html, 'data-hb-demo'), 0, 'only a do-it page has data-hb-demo');
  }
  if (!html.includes('data-hb-reset')) return;
  assert.ok(kind === 'do' || kind === 'loop', 'only a do-it or loop page has data-hb-reset');
  assert.equal(count(html, 'data-hb-reset'), 1, 'at most one Reset');
  assert.ok(bar.includes(RESET), 'the Reset button is in the player bar exactly as in the template');
  // On a do-it page Reset comes right after Show me: on phones two buttons that sit next to each other share one row.
  if (kind === 'do') assert.ok(bar.includes(SHOW_ME + RESET), 'on a do-it page the Reset button comes right after Show me');
}

// Play and Back to top, each exactly as in the template, and the scroller belong to scroll pages, and only to them: the shared
// script presses Play before anything else on arrival, so a stray one on another kind of page would quietly replace that page's
// own arrival. `html` is the whole page, `player` its player bar and `autoplay` whether the body asks for the run on arrival.
function assertScrollControls(kind, html, player, autoplay) {
  if (kind !== 'scroll') {
    for (const marker of ['data-hb-autoscroll', 'data-hb-top', 'data-hb-scroller']) {
      assert.equal(count(html, marker), 0, `only a scroll page has ${marker}`);
    }
    return;
  }
  // A scroll page shows itself once on arrival: the shared script presses Play when the body asks for autoplay.
  assert.ok(autoplay, 'a scroll page scrolls once on arrival (data-hb-autoplay on the body)');
  assert.equal(count(html, 'data-hb-autoscroll'), 1, 'one Play control');
  assert.equal(count(html, 'data-hb-top'), 1, 'one Back to top control');
  const bar = player.replace(/>\s+</g, '><'); // the player bar without the white space between its elements
  assert.ok(bar.includes(PLAY) && bar.includes(TOP), 'Play and Back to top are in the player bar exactly as in the template');
  // Back to top comes right after Play: on phones two buttons that sit next to each other share one row.
  assert.ok(bar.includes(PLAY + TOP), 'the Back to top button comes right after Play');
  assert.ok(count(html, 'data-hb-scroller') <= 1, 'at most one scroller');
  // A scroll page has none of the other player controls; Slow motion is one of them (Play's speed is fixed).
  for (const other of ['data-hb-replay', 'data-hb-loop', 'data-hb-pause', 'data-hb-demo', 'data-hb-slowmo']) {
    assert.equal(count(html, other), 0, `a scroll page has no ${other}`);
  }
}

for (const cat of CONVERTED) {
  test(`every ${cat} demo uses the guided-steps page`, () => {
    const inCategory = demos.filter(d => d.cat === cat);
    assert.ok(inCategory.length > 0, `${cat} has demos`);
    assert.deepEqual(inCategory.filter(d => !steps.includes(d)).map(d => d.slug), []);
  });
}

test('Rotate In uses the guided-steps page', () => {
  assert.ok(steps.some(d => d.cat === ENTRANCE_EXIT && d.slug === 'rotate-in'));
});

for (const d of steps) {
  test(`${d.cat}/${d.slug} uses the guided-steps page correctly`, () => {
    const html = pageOf(d);
    // The shared files carry a version so visitors do not get a cached older copy after publishing.
    assert.match(html, /<link rel="stylesheet" href="\.\.\/\.\.\/\.\.\/assets\/css\/demo-page\.css\?v=\d+">/, 'page stylesheet');
    assert.match(html, /<script src="\.\.\/\.\.\/\.\.\/assets\/js\/demo-page\.js\?v=\d+" defer><\/script>/, 'page script');
    const body = html.match(/<body class="hb" data-hb-kind="(once|loop|scroll|do)"( data-hb-autoplay)?>/);
    assert.ok(body, 'the body declares the page kind');
    const kind = body[1];
    for (const old of ['handbook.css', 'handbook.js', 'hb-view', 'hb-side', 'hb-take', 'ah-bar', 'Copy source', 'Read more',
      'class="note"', 'class="kv"', 'class="lbl"', 'class="btn-row"', 'Bricolage', 'PlexMono']) {
      assert.ok(!html.includes(old), `old markup left: ${old}`);
    }
    for (const part of ['<nav class="hb-bar"', '<main class="hb-page">', '<header class="hb-head">',
      '<section class="hb-step hb-watch"', '<div class="hb-player">',
      '<section class="hb-step hb-prompt-step"', '<p class="hb-prompt">', '<ul class="hb-chips">',
      '<button class="hb-copy" type="button">', '<section class="hb-about"', '<ul class="hb-tags hb-good">',
      '<ul class="hb-tags hb-avoid">', '<section class="hb-related"', '<footer class="hb-foot">']) {
      assert.equal(count(html, part), 1, `exactly one ${part}`);
    }
    // Try it is optional: a demo with no settings leaves the whole step out.
    assert.ok(count(html, '<section class="hb-step hb-try"') <= 1, 'at most one Try it step');
    const hasTry = html.includes('<section class="hb-step hb-try"');
    assert.match(html, /<p class="hb-cat">\d{2}\.\d{2} · [^<]+<\/p>/);
    const prompt = html.match(/<p class="hb-prompt">([^<]*)<\/p>/)[1];
    assert.ok(words(prompt) >= 60 && words(prompt) <= 130, `prompt has ${words(prompt)} words`);
    if (hasTry) assert.ok(prompt.trim().endsWith('Match the settings listed below.'), 'prompt ending');
    else assert.ok(!prompt.includes('Match the settings listed below.'), 'a page without settings does not point to them');
    if (!hasTry) {
      // Nothing of a Try it step is left behind (a mistyped Try it tag would otherwise skip every settings check).
      assert.ok(!/hb-try|hb-setting|hb-options/.test(html), 'a page without Try it has no settings markup');
      assert.ok(!html.includes('Your settings are added at the end.'), 'a page without settings does not promise them under Copy prompt');
    }
    const nums = [...html.matchAll(/<span class="hb-num" aria-hidden="true">(\d+)<\/span>/g)].map(m => Number(m[1]));
    assert.deepEqual(nums, hasTry ? [1, 2, 3] : [1, 2], 'steps are numbered in order');
    assert.ok(!prompt.includes('`'), 'prompt contains no code');
    const player = between(html, '<div class="hb-player">', '</div>');
    if (kind === 'once') {
      assert.equal(count(html, 'data-hb-replay'), 1, 'one Replay control');
      assert.ok(player.includes('data-hb-replay'), 'Replay is in the player bar');
      assert.ok(body[2], 'a plays-once page plays on arrival (data-hb-autoplay on the body)');
    }
    if (kind === 'loop') {
      assert.equal(count(html, 'data-hb-pause'), 1, 'one Pause control');
      assert.ok(['', '="css"'].some(mode => player.includes(PAUSE.replace('{MODE}', mode))),
        'the Pause button is in the player bar exactly as in the template, starting in the playing state');
      assert.equal(count(html, 'data-hb-replay') + count(html, 'data-hb-loop') + count(html, 'data-hb-autoplay'), 0,
        'a loop has no Replay, Loop or autoplay');
    }
    if (kind === 'do') {
      // A do-it page shows itself once on arrival: the shared script presses Show me when the body asks for autoplay.
      assert.ok(body[2], 'a do-it page runs Show me once on arrival (data-hb-autoplay on the body)');
      for (const other of ['data-hb-replay', 'data-hb-loop', 'data-hb-pause', 'data-hb-autoscroll', 'data-hb-top']) {
        assert.equal(count(html, other), 0, `a do-it page has no ${other}`);
      }
    }
    assertScrollControls(kind, html, player, !!body[2]);
    assertShowMeAndReset(kind, html, player);
    for (const marker of ['data-hb-loop', 'data-hb-slowmo', 'data-hb-pause', 'data-hb-demo', 'data-hb-reset', 'data-hb-autoscroll', 'data-hb-top']) {
      assert.ok(count(html, marker) <= 1, `at most one ${marker}`);
      assert.equal(count(player, marker), count(html, marker), `${marker} is in the player bar`);
      const input = (html.match(new RegExp(`<input[^>]*${marker}[^>]*>`)) || [''])[0];
      assert.ok(!/\schecked\b/.test(input), `${marker} switch starts unchecked`);
    }
    if (hasTry) {
      const tryIt = tryItOf(html);
      const main = between(tryIt, '<div class="hb-settings">', '<details class="hb-options">');
      const mainCount = count(main, 'class="hb-setting"');
      assert.ok(mainCount >= 1 && mainCount <= 3, `${mainCount} main settings`);
      assert.equal(count(tryIt, 'class="hb-hint"'), count(tryIt, 'class="hb-setting"'), 'every setting has one hint');
    }
    const good = count(between(html, '<ul class="hb-tags hb-good">', '</ul>'), '<li>');
    const avoid = count(between(html, '<ul class="hb-tags hb-avoid">', '</ul>'), '<li>');
    assert.ok(good >= 3 && good <= 5, `${good} Good for tags`);
    assert.ok(avoid >= 1 && avoid <= 3, `${avoid} Avoid on tags`);
    for (const [, href] of html.matchAll(/<a href="([^"]+)" rel="(?:prev|next)"/g)) {
      assert.ok(isDemoDir(path.resolve(d.dir, href)), `pager link ${href}`);
    }
  });

  test(`${d.slug}: every setting has a label and every choice group has one choice made`, () => {
    if (!pageOf(d).includes('<section class="hb-step hb-try"')) return; // no settings, no Try it step
    const tryIt = tryItOf(pageOf(d));
    // A choice group is a div whose class list includes seg or swatches, wherever the class attribute sits.
    const groups = [...tryIt.matchAll(/<div\b(?=[^>]*\sclass="(?:[^"]*\s)?(seg|swatches)(?:\s[^"]*)?")([^>]*)>([\s\S]*?)<\/div>/g)];
    assert.equal(groups.length, count(tryIt, 'role="group"'), 'every group in Try it is a choice group that is checked here');
    for (const [, cls, attrs, inner] of groups) {
      const labelledBy = (attrs.match(/aria-labelledby="([^"]+)"/) || [])[1];
      assert.ok(/role="group"/.test(attrs), `a ${cls} group has role="group"`);
      assert.ok(labelledBy && tryIt.includes(`id="${labelledBy}"`), `a ${cls} group is labelled`);
      assert.equal(count(inner, 'aria-pressed="true"'), 1, `${labelledBy} has exactly one choice made`);
    }
    for (const [, name, attrs] of tryIt.matchAll(/<(input|select|textarea)\b([^>]*)>/g)) {
      if (/type="checkbox"/.test(attrs)) continue;
      const id = (attrs.match(/\sid="([^"]+)"/) || [])[1];
      assert.ok(id && new RegExp(`<label[^>]*\\sfor="${id}"`).test(tryIt), `${name} ${id || '(no id)'} has a label`);
    }
    assert.equal(count(tryIt, 'type="checkbox"'), count(tryIt, 'class="hb-switch-row"'), 'every switch sits in a labelled switch row');
  });

  test(`${d.slug}: README is ready for the site`, () => {
    const s = sections(read(path.join(d.dir, 'README.md')));
    for (const h of ['What it is', 'When to use it', 'Key parameters', 'See also']) assert.ok(s[h], `section ${h}`);
    assert.ok(!s['What it is'].includes('`'), 'What it is has no code');
    assert.ok(!s['Key parameters'].includes('`'), 'Key parameters has no code');
    assert.ok(table(s['Key parameters']).length > 0, 'Key parameters has rows');
    const links = [...s['See also'].matchAll(/^\s*[-*]\s+\[[^\]]+\]\(([^)\s]+)\)(.*)$/gm)];
    assert.ok(links.length > 0, 'See also has links');
    for (const [, href, rest] of links) {
      assert.ok(isDemoDir(path.resolve(d.dir, href)), `See also link ${href}`);
      assert.match(rest, /^\s*[—–-]\s*\S/, `See also ${href} has a short description`);
    }
  });

  test(`${d.slug}: Try it and the README Key parameters name the same settings`, () => {
    if (!pageOf(d).includes('<section class="hb-step hb-try"')) return; // no settings, no Try it step
    const tryIt = tryItOf(pageOf(d));
    const names = [...tryIt.matchAll(/<(p|label) class="hb-setting-name"[^>]*>([^<]*)<\/\1>|<label class="hb-switch-row"><span>([^<]*)<\/span>/g)]
      .map(m => decode((m[2] ?? m[3]).trim()));
    const keys = keyParameters(d);
    assert.ok(names.length > 0, 'Try it has settings');
    for (const name of names) assert.ok(keys.includes(name), `Try it setting "${name}" is in Key parameters`);
    for (const key of keys) assert.ok(names.includes(key), `Key parameter "${key}" is a setting in Try it`);
  });

  test(`${d.slug}: See also links use the titles of the pages they open`, () => {
    const seeAlso = sections(read(path.join(d.dir, 'README.md')))['See also'];
    for (const [, name, href] of seeAlso.matchAll(/^\s*[-*]\s+\[([^\]]+)\]\(([^)\s]+)\)/gm)) {
      const h1 = read(path.join(path.resolve(d.dir, href), 'index.html')).match(/<h1>([^<]*)<\/h1>/);
      assert.ok(h1, `${href} has a title`);
      assert.equal(name, decode(h1[1]), `See also ${href}`);
    }
  });

  test(`${d.slug}: the meta, Open Graph, Twitter and JSON-LD descriptions match the lede`, () => {
    const html = pageOf(d);
    const lede = decode(html.match(/<p class="hb-lede">([^<]*)<\/p>/)[1]);
    for (const tag of ['name="description"', 'property="og:description"', 'name="twitter:description"']) {
      const meta = html.match(new RegExp(`<meta ${tag} content="([^"]*)">`));
      assert.ok(meta, `<meta ${tag}> is there`);
      assert.equal(decode(meta[1]), lede, tag);
    }
    const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(ld, 'JSON-LD is there');
    assert.equal(JSON.parse(ld[1]).description, lede, 'JSON-LD description');
  });

  test(`${d.slug}: the player switches and every Try it field have autocomplete="off"`, () => {
    const html = pageOf(d);
    const player = between(html, '<div class="hb-player">', '</div>');
    const fields = [...player.matchAll(/<input\b[^>]*>/g), ...tryItOf(html).matchAll(/<(?:input|select|textarea)\b[^>]*>/g)].map(m => m[0]);
    if (html.includes('<section class="hb-step hb-try"')) assert.ok(fields.length > 0, 'the page has fields');
    for (const field of fields) assert.match(field, /\sautocomplete="off"/, field);
  });

  test(`${d.slug}: the home page card uses the page's description`, () => {
    const lede = decode(pageOf(d).match(/<p class="hb-lede">([^<]*)<\/p>/)[1]);
    const entry = HOME.match(new RegExp(`\\['${d.slug}','(?:[^'\\\\]|\\\\.)*','((?:[^'\\\\]|\\\\.)*)'\\]`));
    assert.ok(entry, 'home page entry');
    assert.equal(entry[1].replace(/\\'/g, "'"), lede);
  });
}

// The Show me and Reset rules run on the player bar of every page above. These cases run them on made-up player bars, so
// each kind is covered before a page of that kind exists.
test('Show me belongs to do-it pages and Reset to do-it and loop pages, each exactly as in the template', () => {
  const PAUSE_BUTTON = PAUSE.replace('{MODE}', '');
  const REPLAY = '<button class="hb-play" type="button" id="btn-play" data-hb-replay>Replay</button>';
  const SLOW = '<label class="hb-toggle"><input class="hb-switch" type="checkbox" role="switch" id="slow-tog" data-hb-slowmo autocomplete="off"><span>Slow motion</span></label>';
  const barOf = (...items) => `<div class="hb-player">\n      ${items.join('\n      ')}\n    </div>`;
  const check = (kind, html) => assertShowMeAndReset(kind, html, between(html, '<div class="hb-player">', '</div>'));
  const ok = (kind, ...items) => assert.doesNotThrow(() => check(kind, barOf(...items)), `a ${kind} page with ${items.length} controls passes`);
  const notOk = (message, kind, html) => assert.throws(() => check(kind, html), err => err.message.startsWith(message), `${kind}: ${message}`);

  ok('do', SHOW_ME);
  ok('do', SHOW_ME, RESET);
  ok('do', SHOW_ME, RESET, SLOW);
  ok('loop', PAUSE_BUTTON, RESET, SLOW); // a loop may have a Reset too: Pause, Reset, Slow motion
  ok('loop', PAUSE_BUTTON, SLOW);
  ok('once', REPLAY, SLOW);
  ok('scroll', PLAY, TOP);

  for (const kind of ['once', 'loop', 'scroll']) notOk('only a do-it page has data-hb-demo', kind, barOf(SHOW_ME, REPLAY));
  for (const kind of ['once', 'scroll']) notOk('only a do-it or loop page has data-hb-reset', kind, barOf(REPLAY, RESET));

  notOk('one Show me control', 'do', barOf(RESET));
  notOk('one Show me control', 'do', barOf(SHOW_ME, SHOW_ME.replace('id="btn-demo"', 'id="btn-demo-2"')));
  notOk('the Show me button is in the player bar exactly as in the template', 'do', barOf(SHOW_ME.replace('Show me</button>', 'Play</button>')));
  notOk('on a do-it page the Reset button comes right after Show me', 'do', barOf(SHOW_ME, SLOW, RESET));
  notOk('on a do-it page the Reset button comes right after Show me', 'do', barOf(RESET, SHOW_ME));
  for (const [kind, first] of [['do', SHOW_ME], ['loop', PAUSE_BUTTON]]) {
    notOk('the Reset button is in the player bar exactly as in the template', kind, barOf(first, RESET.replace('class="hb-play"', 'class="hb-reset"')));
    notOk('the Reset button is in the player bar exactly as in the template', kind, barOf(first, RESET.replace('id="btn-reset"', 'id="reset"')));
    notOk('the Reset button is in the player bar exactly as in the template', kind, `<div class="stage">${RESET}</div>${barOf(first)}`);
    notOk('at most one Reset', kind, barOf(first, RESET, RESET.replace('id="btn-reset"', 'id="btn-reset-2"')));
  }
});

// The Play, Back to top and scroller rules run on every page above. These cases run them on made-up pages, so the scroll
// kind is covered before a scroll page exists.
test('Play, Back to top and the scroller belong to scroll pages, and a scroll page runs once on arrival with no other player control', () => {
  const noIcon = button => button.replace(/<svg[\s\S]*?<\/svg>/, '');
  const REPLAY = '<button class="hb-play" type="button" id="btn-play" data-hb-replay>Replay</button>';
  const LOOP = '<label class="hb-toggle"><input class="hb-switch" type="checkbox" role="switch" id="loop-tog" data-hb-loop autocomplete="off"><span>Loop</span></label>';
  const SLOW = '<label class="hb-toggle"><input class="hb-switch" type="checkbox" role="switch" id="slow-tog" data-hb-slowmo autocomplete="off"><span>Slow motion</span></label>';
  const pageOf = (bar, stage = '') => `<div class="stage">${stage}</div>\n    <div class="hb-player">\n      ${bar.join('\n      ')}\n    </div>`;
  const run = (kind, html, autoplay = true) => assertScrollControls(kind, html, between(html, '<div class="hb-player">', '</div>'), autoplay);
  const ok = (kind, html) => assert.doesNotThrow(() => run(kind, html), `a ${kind} page passes`);
  const notOk = (message, kind, html, autoplay) => assert.throws(() => run(kind, html, autoplay), err => err.message.startsWith(message), `${kind}: ${message}`);

  const scrollPage = pageOf([PLAY, TOP]);
  ok('scroll', scrollPage);
  ok('scroll', pageOf([PLAY, TOP], '<div data-hb-scroller></div>')); // the stage holds its own scroller

  notOk('a scroll page scrolls once on arrival (data-hb-autoplay on the body)', 'scroll', scrollPage, false);
  notOk('one Play control', 'scroll', pageOf([TOP]));
  notOk('one Play control', 'scroll', pageOf([PLAY, PLAY.replace('btn-scroll', 'btn-scroll-2'), TOP]));
  notOk('one Back to top control', 'scroll', pageOf([PLAY]));
  // Each button in the player bar exactly as in the template (one in the stage, relabelled, without its icon, with another id
  // or class fails), and Back to top right after Play.
  const EXACT = 'Play and Back to top are in the player bar exactly as in the template';
  notOk(EXACT, 'scroll', `<div class="stage">${PLAY}</div>\n<div class="hb-player">\n${TOP}\n</div>`);
  notOk(EXACT, 'scroll', pageOf([PLAY.replace('Play</button>', 'Scroll</button>'), TOP]));
  notOk(EXACT, 'scroll', pageOf([PLAY, TOP.replace('Back to top</button>', 'Top</button>')]));
  notOk(EXACT, 'scroll', pageOf([noIcon(PLAY), TOP]));
  notOk(EXACT, 'scroll', pageOf([PLAY, noIcon(TOP)]));
  notOk(EXACT, 'scroll', pageOf([PLAY.replace('id="btn-scroll"', 'id="btn-play"'), TOP]));
  notOk(EXACT, 'scroll', pageOf([PLAY, TOP.replace('id="btn-top"', 'id="top"')]));
  notOk(EXACT, 'scroll', pageOf([PLAY.replace('class="hb-play"', 'class="hb-scroll"'), TOP]));
  notOk('the Back to top button comes right after Play', 'scroll', pageOf([TOP, PLAY]));
  notOk('the Back to top button comes right after Play', 'scroll', pageOf([PLAY, '<span class="hb-hint">6 seconds</span>', TOP]));
  notOk('at most one scroller', 'scroll', pageOf([PLAY, TOP], '<div data-hb-scroller></div><div data-hb-scroller></div>'));
  // A scroll page has none of the other player controls; Slow motion is one of them (Play's speed is fixed).
  for (const [marker, control] of [['data-hb-replay', REPLAY], ['data-hb-loop', LOOP], ['data-hb-pause', PAUSE.replace('{MODE}', '')],
    ['data-hb-demo', SHOW_ME], ['data-hb-slowmo', SLOW]]) {
    notOk(`a scroll page has no ${marker}`, 'scroll', pageOf([PLAY, TOP, control]));
  }

  // Only scroll pages have these markers: the shared script presses Play before anything else on arrival, so a stray one on
  // another kind of page would quietly replace that page's own arrival.
  for (const kind of ['once', 'loop', 'do']) {
    ok(kind, pageOf([REPLAY]));
    notOk('only a scroll page has data-hb-autoscroll', kind, pageOf([REPLAY, PLAY]));
    notOk('only a scroll page has data-hb-top', kind, pageOf([REPLAY, TOP]));
    notOk('only a scroll page has data-hb-scroller', kind, pageOf([REPLAY], '<div data-hb-scroller></div>'));
  }
});

test('every guided-steps page links the same version of the shared files', () => {
  const versions = new Set(steps.flatMap(d => [...pageOf(d).matchAll(/demo-page\.(?:css|js)\?v=(\d+)/g)].map(m => m[1])));
  assert.equal(versions.size, 1, `versions in use: ${[...versions].join(', ')}`);
});

const sharedRules = cssRules(read(path.join(ROOT, 'assets/css/demo-page.css')));
const rulesFor = selector => sharedRules.filter(rule => rule.selector.split(',').some(part => part.trim() === selector));

test('the shared stylesheet draws the focus ring inward inside the stage, beating the site ring', () => {
  // The stage clips what sticks out of it, so the site ring (drawn 3px outside) is cut off on anything focusable inside it.
  const site = sharedRules.filter(rule => /^body\.hb[^,]*:focus-visible$/.test(rule.selector));
  assert.equal(site.length, 1, 'the site focus ring rule (body.hb :focus-visible) is in the stylesheet');
  const inward = '.hb-page .stage :focus-visible';
  assert.ok(rulesFor(inward).some(rule => /(^|;)\s*outline-offset:\s*-3px\s*(;|$)/.test(rule.body)), 'a focus ring inside the stage is drawn 3px inward');
  assert.ok(outranks(specificity(inward), specificity(site[0].selector)),
    `${inward} (${specificity(inward)}) must outrank ${site[0].selector} (${specificity(site[0].selector)})`);
});

test('the shared stylesheet turns CSS scroll snapping off on a box that Play is scrolling', () => {
  // While Play scrolls a box the shared script marks it data-hb-autoscrolling; with snapping on, every step would snap to the
  // nearest snap point and the box would jump from card to card. !important, so that a snap type the page sets on the box
  // itself (inline, or in its own style) does not win, and nothing has to be remembered and written back afterwards.
  assert.ok(rulesFor('[data-hb-autoscrolling]').some(rule => /(^|;)\s*scroll-snap-type:\s*none\s*!important\s*(;|$)/.test(rule.body)),
    'a box marked data-hb-autoscrolling has scroll-snap-type: none !important');
});

test('the shared stylesheet keeps choice buttons at least 44px wide', () => {
  assert.ok(rulesFor('.hb-page .seg button').some(rule => /(^|;)\s*min-width:\s*44px\s*(;|$)/.test(rule.body)), 'a choice button is at least 44px wide');
});

test('the home page uses Schibsted Grotesk and the new intro line', () => {
  assert.ok(HOME.includes("url('assets/fonts/schibsted-latin.woff2')"), 'Latin font file');
  assert.ok(HOME.includes("url('assets/fonts/schibsted-latin-ext.woff2')"), 'Latin Extended font file');
  for (const old of ['Bricolage', 'PlexMono', 'var(--mono)', '--mono:']) assert.ok(!HOME.includes(old), `still uses ${old}`);
  assert.ok(HOME.includes('See 129 web animations move, learn when to use each one, and copy a prompt to build it.'));
});
