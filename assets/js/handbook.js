/* Animation Handbook — shared behaviour for the demo pages.
 * Builds the prompt box (settings line + Copy prompt), "Read more" with the
 * explanation from the demo's README.md, and the stage's Replay button.
 * The pure helpers are exported for tests/handbook.test.js. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) { module.exports = api; return; }
  root.Handbook = api;
  if (typeof document === 'undefined') return;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { api.boot(document, root); });
  } else {
    api.boot(document, root);
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------- Pure helpers ---------- */

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Text with Markdown code and bold markers removed, safe to insert as HTML.
  function plain(s) {
    return escapeHtml(String(s).replace(/`/g, '').replace(/\*\*/g, ''));
  }

  // Inline Markdown from README prose. Inline code becomes plain text: the site shows no code.
  function inline(md) {
    return escapeHtml(md)
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  }

  // A README split into { "What it is": "...", ... } by its "## " headings.
  function sections(md) {
    var out = {}, current = null, buf = [];
    String(md).replace(/\r\n?/g, '\n').split('\n').forEach(function (line) {
      var m = /^##\s+(.+?)\s*$/.exec(line);
      if (m) {
        if (current) out[current] = buf.join('\n').trim();
        current = m[1];
        buf = [];
      } else if (current) {
        buf.push(line);
      }
    });
    if (current) out[current] = buf.join('\n').trim();
    return out;
  }

  function paragraphs(text) {
    return String(text || '').split(/\n\s*\n/)
      .map(function (p) { return p.trim(); })
      .filter(Boolean)
      .map(function (p) { return '<p>' + inline(p.replace(/\s*\n\s*/g, ' ')) + '</p>'; })
      .join('');
  }

  function bullets(text) {
    return String(text || '').split('\n')
      .filter(function (l) { return /^\s*[-*]\s+/.test(l); })
      .map(function (l) { return inline(l.replace(/^\s*[-*]\s+/, '')); });
  }

  // "Duration (`--dur`)" becomes "Duration": parentheticals that hold code are dropped.
  function cleanName(s) {
    return plain(String(s).replace(/\s*\(`[^`]*`[^)]*\)/g, ''));
  }

  // The Key parameters table as [{ name, value, effect }], without its header and divider rows.
  function table(text) {
    var rows = String(text || '').split('\n')
      .filter(function (l) { return /^\s*\|/.test(l); })
      .map(function (l) {
        return l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(function (c) { return c.trim(); });
      });
    return rows.slice(1)
      .filter(function (r) { return !r.every(function (c) { return /^:?-{2,}:?$/.test(c); }); })
      .map(function (r) { return { name: cleanName(r[0] || ''), value: plain(r[1] || ''), effect: inline(r[2] || '') }; });
  }

  // "- [Name](../slug/) — description" lines as [{ name, href, desc }].
  function seeAlso(text) {
    return String(text || '').split('\n').map(function (l) {
      var m = /^\s*[-*]\s+\[([^\]]+)\]\(([^)\s]+)\)\s*(?:[—–-]\s*(.*))?$/.exec(l);
      return m ? { name: plain(m[1]), href: m[2], desc: m[3] ? inline(m[3]) : '' } : null;
    }).filter(Boolean);
  }

  function settingsLine(items) {
    return (items || [])
      .filter(function (i) { return i && i.label && i.value; })
      .map(function (i) { return i.label + ' ' + i.value; })
      .join(', ');
  }

  /* ---------- Page behaviour ---------- */

  var CONTROLS = 'input[type=range], input[type=checkbox], select, .seg, .swatches';

  function text(node) { return node ? node.textContent.replace(/\s+/g, ' ').trim() : ''; }

  function labelFor(doc, control) {
    var own = control.getAttribute('data-hb-label');
    if (own) return own;
    var by = control.getAttribute('aria-labelledby');
    if (by && doc.getElementById(by)) return text(doc.getElementById(by));
    var tog = control.closest('.tog');
    if (tog) return text(tog.querySelector('span') || tog);
    for (var p = control.previousElementSibling; p; p = p.previousElementSibling) {
      if (p.classList.contains('lbl')) return text(p);
    }
    return control.parentElement ? text(control.parentElement.querySelector(':scope > .lbl')) : '';
  }

  function valueFor(control) {
    if (control.matches('input[type=range]')) {
      var row = control.closest('.sr');
      var shown = row && row.querySelector('.sv');
      return shown ? text(shown) : control.value;
    }
    if (control.matches('input[type=checkbox]')) return control.checked ? 'on' : 'off';
    if (control.matches('select')) return control.selectedOptions[0] ? text(control.selectedOptions[0]) : control.value;
    var active = control.querySelector('.on');
    return active ? (active.getAttribute('aria-label') || text(active)) : '';
  }

  // The demo's current settings in page order, skipping playback controls and anything marked data-hb-skip.
  function readSettings(doc, scope) {
    return Array.prototype.filter.call(scope.querySelectorAll(CONTROLS), function (control) {
      return !control.closest('[data-hb-skip], [hidden], .btn-row');
    }).map(function (control) {
      return { label: labelFor(doc, control), value: valueFor(control) };
    });
  }

  function make(doc, tag, className, html) {
    var node = doc.createElement(tag);
    node.className = className;
    if (html) node.innerHTML = html;
    return node;
  }

  function renderAbout(md) {
    var s = sections(md), html = '';
    if (s['What it is']) html += '<section><h2>What it is</h2>' + paragraphs(s['What it is']) + '</section>';
    var uses = bullets(s['When to use it']);
    if (uses.length) {
      html += '<section><h2>When to use it</h2><ul>' +
        uses.map(function (u) { return '<li>' + u + '</li>'; }).join('') + '</ul></section>';
    }
    var params = table(s['Key parameters']);
    if (params.length) {
      html += '<section><h2>What the controls do</h2><dl>' + params.map(function (p) {
        return '<dt>' + p.name + (p.value ? '<small>default ' + p.value + '</small>' : '') + '</dt><dd>' + p.effect + '</dd>';
      }).join('') + '</dl></section>';
    }
    return { html: html, related: seeAlso(s['See also']) };
  }

  function loadReadme(doc, win, details) {
    var about = details.querySelector('.hb-about');
    var fallback = '<p class="hb-note">The full explanation is in <a href="README.md">README.md</a>.</p>';
    if (win.location.protocol === 'file:' || !win.fetch) { about.innerHTML = fallback; return; }
    win.fetch('README.md').then(function (res) {
      if (!res.ok) throw new Error('README ' + res.status);
      return res.text();
    }).then(function (md) {
      var out = renderAbout(md);
      about.innerHTML = out.html || fallback;
      if (!out.related.length) return;
      var box = details.querySelector('.hb-related');
      box.querySelector('.hb-rel-list').innerHTML = out.related.map(function (r) {
        return '<a class="hb-rel" href="' + escapeHtml(r.href) + '"><span><b>' + r.name + '</b>' +
          (r.desc ? '<small>' + r.desc + '</small>' : '') + '</span><i aria-hidden="true">→</i></a>';
      }).join('');
      box.hidden = false;
    }).catch(function () { about.innerHTML = fallback; });
  }

  function boot(doc, win) {
    var view = doc.querySelector('.hb-view');
    var side = view && view.querySelector('.hb-side');
    var promptEl = side && side.querySelector('.hb-prompt');
    if (!promptEl) return;

    var settings = side.querySelector('.hb-settings');
    var title = text(side.querySelector('h1'));
    var promptText = text(promptEl);
    var reduce = win.matchMedia ? win.matchMedia('(prefers-reduced-motion: reduce)') : null;
    var lines = [];

    function currentLine() { return settings ? settingsLine(readSettings(doc, settings)) : ''; }
    function copyText() {
      var line = currentLine();
      return promptText + (line ? '\n\nSettings from the demo: ' + line + '.' : '');
    }
    function refreshLines() {
      var line = currentLine();
      lines.forEach(function (node) { node.textContent = line ? 'Your settings: ' + line : ''; node.hidden = !line; });
    }
    function settingsNode() { var node = make(doc, 'p', 'hb-set'); lines.push(node); return node; }
    function copyButton() {
      var button = make(doc, 'button', 'hb-copy', 'Copy prompt');
      button.type = 'button';
      button.addEventListener('click', function () {
        function show(label) {
          button.textContent = label;
          win.setTimeout(function () { button.textContent = 'Copy prompt'; }, 1500);
        }
        function selectInstead() {
          var range = doc.createRange();
          range.selectNodeContents(promptEl);
          var selection = win.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          show(/Mac|iPhone|iPad/.test(win.navigator.platform || win.navigator.userAgent) ? 'Press ⌘C to copy' : 'Press Ctrl+C to copy');
        }
        var clip = win.navigator.clipboard;
        if (clip && clip.writeText) clip.writeText(copyText()).then(function () { show('Copied ✓'); }, selectInstead);
        else selectInstead();
      });
      return button;
    }
    function scrollBehavior() { return reduce && reduce.matches ? 'auto' : 'smooth'; }

    // Prompt box: three-line preview, the live settings line and Copy prompt.
    promptEl.classList.add('hb-clamp');
    var box = promptEl.closest('.hb-prompt-box') || promptEl.parentElement;
    box.appendChild(settingsNode());
    box.appendChild(copyButton());

    // Read more: the explanation, full prompt and related animations below the first screen.
    var details = make(doc, 'section', 'hb-details',
      '<div class="hb-details-in">' +
        '<a class="hb-back" href="#top">↑ Back to the demo</a>' +
        '<div class="hb-about"><p class="hb-note">Loading the explanation…</p></div>' +
        '<div class="hb-extra">' +
          '<section><h2>Full prompt</h2><div class="hb-full"><p class="hb-full-text"></p></div></section>' +
          '<section class="hb-related" hidden><h2>Related animations</h2><div class="hb-rel-list"></div></section>' +
        '</div>' +
      '</div>');
    details.id = 'details';
    details.hidden = true;
    details.setAttribute('aria-label', 'About ' + title);
    details.querySelector('.hb-full-text').textContent = promptText;
    var full = details.querySelector('.hb-full');
    full.appendChild(settingsNode());
    full.appendChild(copyButton());
    view.insertAdjacentElement('afterend', details);

    var more = make(doc, 'button', 'hb-more');
    more.type = 'button';
    more.setAttribute('aria-controls', 'details');
    (side.querySelector('.hb-take') || side).appendChild(more);
    function setOpen(open, scroll) {
      details.hidden = !open;
      more.setAttribute('aria-expanded', String(open));
      more.textContent = open ? 'Show less ↑' : 'Read more about ' + title + ' ↓';
      if (open && scroll) details.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    }
    setOpen(false, false);
    more.addEventListener('click', function () { setOpen(details.hidden, true); });
    details.querySelector('.hb-back').addEventListener('click', function (e) {
      e.preventDefault();
      win.scrollTo({ top: 0, behavior: scrollBehavior() });
    });
    if (win.location.hash === '#details') win.setTimeout(function () { setOpen(true, true); }, 300);
    loadReadme(doc, win, details);

    // Replay, auto-play and "changing a setting replays it" all press the demo's own buttons.
    var replayCtl = doc.querySelector('[data-hb-replay]');
    var resetCtl = doc.querySelector('[data-hb-reset]');
    var loopCtl = doc.querySelector('[data-hb-loop]');
    function replay() {
      if (resetCtl) resetCtl.click();
      win.requestAnimationFrame(function () {
        win.requestAnimationFrame(function () { replayCtl.click(); });
      });
    }
    if (replayCtl) {
      var replayButton = make(doc, 'button', 'hb-replay', '↻ Replay');
      replayButton.type = 'button';
      replayButton.setAttribute('aria-label', 'Replay the animation');
      replayButton.addEventListener('click', replay);
      view.appendChild(replayButton);
      if (doc.body.hasAttribute('data-hb-autoplay')) win.setTimeout(function () { replayCtl.click(); }, 400);
    }

    var timer = 0;
    function onSettingsChange(e) {
      var target = e.target;
      if (e.type === 'click' && !target.closest('.seg, .swatches')) return;
      if (target.closest('.btn-row, [data-hb-loop]')) return;
      win.setTimeout(refreshLines, 0);
      if (!replayCtl || (loopCtl && loopCtl.checked)) return;
      win.clearTimeout(timer);
      timer = win.setTimeout(replay, 250);
    }
    if (settings) {
      ['input', 'change', 'click'].forEach(function (type) { settings.addEventListener(type, onSettingsChange); });
    }
    refreshLines();
  }

  return {
    escapeHtml: escapeHtml, plain: plain, inline: inline, sections: sections, paragraphs: paragraphs,
    bullets: bullets, cleanName: cleanName, table: table, seeAlso: seeAlso, settingsLine: settingsLine,
    readSettings: readSettings, boot: boot
  };
});
