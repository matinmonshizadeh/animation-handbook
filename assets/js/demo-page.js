/* Animation Handbook — shared behaviour for the guided-steps demo pages.
 * Fills in "Your settings", Copy prompt, the README's "What it is" and "Similar
 * animations", plays the demo on arrival, replays it when a setting changes, runs
 * Pause and CSS slow motion on loop pages, and follows reduced motion (Loop and
 * Slow motion greyed out, loops start paused).
 * The pure helpers are exported for tests/demo-page.test.js. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) { module.exports = api; return; }
  root.DemoPage = api;
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

  // Only relative paths, "#" anchors and http(s) URLs are link targets. Anything else, including
  // protocol-relative "//host" links, is rendered as plain text instead. handbook.js has an older,
  // looser copy that lets "//host" through; this is the one to keep.
  function isSafeHref(href) {
    href = String(href);
    return /^(?:https?:|#|\.{0,2}\/|[\w.-]+(?:\/|$))/i.test(href) && !/^\/\//.test(href) &&
      !/^[a-z][a-z0-9+.-]*:/i.test(href.replace(/^https?:/i, ''));
  }

  // Inline Markdown from README prose. Inline code becomes plain text: the site shows no code.
  function inline(md) {
    return escapeHtml(md)
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, label, href) {
        return isSafeHref(href) ? '<a href="' + href + '">' + label + '</a>' : label;
      })
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

  // "- [Name](../slug/) — description" lines as [{ name, href, desc }].
  function seeAlso(text) {
    return String(text || '').split('\n').map(function (l) {
      var m = /^\s*[-*]\s+\[([^\]]+)\]\(([^)\s]+)\)\s*(?:[—–-]\s*(.*))?$/.exec(l);
      return m ? { name: plain(m[1]), href: m[2], desc: m[3] ? inline(m[3]) : '' } : null;
    }).filter(Boolean);
  }

  // [{ label: 'Speed', value: 'Normal' }, ...] as "Speed: Normal, ...", skipping incomplete pairs.
  function settingsLine(items) {
    return (items || [])
      .filter(function (i) { return i && i.label && i.value; })
      .map(function (i) { return i.label + ': ' + i.value; })
      .join(', ');
  }

  // The prompt as HTML with each [part to fill in] highlighted.
  function markFill(text) {
    return escapeHtml(text).replace(/\[[^\]\n]+\]/g, function (part) {
      return '<mark class="hb-fill">' + part + '</mark>';
    });
  }

  // Text squeezed onto one line and cut to max characters (ending with an ellipsis), for chips.
  function shorten(text, max) {
    var s = String(text).replace(/\s+/g, ' ').trim();
    return s.length > max ? s.slice(0, max - 1).trimEnd() + '…' : s;
  }

  // Typed text as a setting value: shortened as above, then wrapped in quotes ('' when there is no text).
  function quoteText(text, max) {
    var s = shorten(text, max);
    return s ? '"' + s + '"' : '';
  }

  // The reduced-motion note for the player bar, from what the bar holds ({ loop, slow, pause } as booleans);
  // '' when reduced motion changes nothing there.
  function motionNote(has) {
    var off = [has.loop && 'Loop', has.slow && 'Slow motion'].filter(Boolean);
    var parts = [];
    if (has.pause) parts.push('It starts paused');
    if (off.length) parts.push(off.join(' and ') + (off.length > 1 ? ' are' : ' is') + ' off');
    return parts.length ? parts.join(' and ') + ' because your device is set to reduce motion.' : '';
  }

  /* ---------- Page behaviour ---------- */

  var CONTROLS = 'input[type=range], input[type=checkbox], input[type=text], textarea, select, .seg, .swatches';

  function text(node) { return node ? node.textContent.replace(/\s+/g, ' ').trim() : ''; }

  function labelFor(doc, control) {
    var own = control.getAttribute('data-hb-label');
    if (own) return own;
    var by = control.getAttribute('aria-labelledby');
    if (by && doc.getElementById(by)) return text(doc.getElementById(by));
    var wrap = control.closest('label');
    if (wrap) return text(wrap);
    var byFor = control.id && doc.querySelector('label[for="' + control.id + '"]');
    if (byFor) return text(byFor);
    var setting = control.closest('.hb-setting');
    return setting ? text(setting.querySelector('.hb-setting-name')) : '';
  }

  function valueFor(control) {
    if (control.matches('input[type=range]')) {
      var setting = control.closest('.hb-setting');
      var shown = setting && setting.querySelector('.hb-value');
      return shown ? text(shown) : (control.getAttribute('aria-valuetext') || control.value);
    }
    if (control.matches('input[type=text], textarea')) return quoteText(control.value, 40);
    if (control.matches('input[type=checkbox]')) return control.checked ? 'on' : 'off';
    if (control.matches('select')) return control.selectedOptions[0] ? text(control.selectedOptions[0]) : control.value;
    var active = control.querySelector('.on, [aria-pressed="true"]');
    return active ? (active.getAttribute('aria-label') || text(active)) : '';
  }

  // A control counts unless it, or anything between it and the scope, is hidden, skipped or
  // display:none. Controls inside a closed More options still count: <details> hides them another way.
  function isShown(control, scope, win) {
    for (var node = control; node && node !== scope; node = node.parentElement) {
      if (node.hidden || node.hasAttribute('data-hb-skip')) return false;
      if (win.getComputedStyle(node).display === 'none') return false;
    }
    return true;
  }

  // The demo's current settings in page order, as [{ label, value }].
  function readSettings(doc, scope, win) {
    return Array.prototype.filter.call(scope.querySelectorAll(CONTROLS), function (control) {
      return isShown(control, scope, win);
    }).map(function (control) {
      return { label: labelFor(doc, control), value: valueFor(control), control: control };
    });
  }

  function boot(doc, win) {
    var page = doc.querySelector('.hb-page');
    var promptEl = page && page.querySelector('.hb-prompt');
    if (!promptEl) return;

    var tryStep = page.querySelector('.hb-try');
    var chipsBox = page.querySelector('.hb-chips-box');
    var chips = chipsBox && chipsBox.querySelector('.hb-chips');
    var copyBtn = page.querySelector('.hb-copy');
    var replayCtl = page.querySelector('[data-hb-replay]');
    var loopCtl = page.querySelector('[data-hb-loop]');
    var slowCtl = page.querySelector('[data-hb-slowmo]');
    var pauseCtl = page.querySelector('[data-hb-pause]');
    var stage = page.querySelector('.stage');
    var player = page.querySelector('.hb-player');
    var reduce = win.matchMedia ? win.matchMedia('(prefers-reduced-motion: reduce)') : null;
    var promptText = text(promptEl);

    function settings() {
      if (!tryStep) return [];
      return readSettings(doc, tryStep, win).filter(function (s) { return s.label && s.value; });
    }
    function copyText() {
      var line = settingsLine(settings());
      return promptText + (line ? '\n\nSettings from the demo: ' + line + '.' : '');
    }
    function replay() { if (replayCtl) replayCtl.click(); }

    // The prompt: highlight the part to fill in; on phones show five lines until "Show the full prompt".
    function setUpPrompt() {
      promptEl.innerHTML = markFill(promptText);
      promptEl.id = promptEl.id || 'hb-prompt';
      promptEl.classList.add('is-clamped');
      var toggle = doc.createElement('button');
      toggle.type = 'button';
      toggle.className = 'hb-prompt-more';
      toggle.setAttribute('aria-controls', promptEl.id);
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Show the full prompt';
      toggle.addEventListener('click', function () {
        var open = !promptEl.classList.toggle('is-clamped');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.textContent = open ? 'Show less' : 'Show the full prompt';
      });
      promptEl.insertAdjacentElement('afterend', toggle);
    }

    function refreshChips() {
      if (!chips) return;
      var items = settings();
      chips.innerHTML = items.map(function (s) {
        return '<li>' + escapeHtml(s.label) + ': ' + escapeHtml(s.value) + '</li>';
      }).join('');
      chipsBox.hidden = !items.length;
    }

    // For page authors: a control without a label or a value is left out of the chips and the copied prompt.
    function warnIncomplete() {
      if (!tryStep || !win.console) return;
      readSettings(doc, tryStep, win).forEach(function (s) {
        if (!s.label || !s.value) win.console.warn('Your settings: this control has no ' + (s.label ? 'value' : 'label') + ' and is left out', s.control);
      });
    }

    function setUpCopy() {
      var label = copyBtn.querySelector('.hb-copy-label') || copyBtn;
      var original = label.textContent;
      var timer = 0;
      function show(message, done) {
        label.textContent = message;
        copyBtn.classList.toggle('is-done', done);
        win.clearTimeout(timer);
        timer = win.setTimeout(function () {
          label.textContent = original;
          copyBtn.classList.remove('is-done');
        }, 1500);
      }
      // Where the clipboard API is blocked, copy through an off-screen text box so the settings line still comes along.
      function copyThroughTextBox(textToCopy) {
        var box = doc.createElement('textarea');
        box.value = textToCopy;
        box.setAttribute('readonly', '');
        box.style.position = 'fixed';
        box.style.top = '-1000px';
        box.style.opacity = '0';
        doc.body.appendChild(box);
        box.focus({ preventScroll: true });
        box.select();
        box.setSelectionRange(0, box.value.length);
        var copied = false;
        try { copied = doc.execCommand('copy'); } catch (e) { copied = false; }
        doc.body.removeChild(box);
        copyBtn.focus({ preventScroll: true });
        return copied;
      }
      // Last resort: select the prompt so the visitor can copy it with the keyboard.
      function selectInstead() {
        var range = doc.createRange();
        range.selectNodeContents(promptEl);
        var selection = win.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        show(/Mac|iPhone|iPad/.test(win.navigator.platform || win.navigator.userAgent) ? 'Press ⌘C to copy' : 'Press Ctrl+C to copy', false);
      }
      function fallback(textToCopy) {
        if (copyThroughTextBox(textToCopy)) show('Copied', true);
        else selectInstead();
      }
      copyBtn.addEventListener('click', function () {
        var textToCopy = copyText();
        var clip = win.navigator.clipboard;
        if (clip && clip.writeText) {
          clip.writeText(textToCopy).then(function () { show('Copied', true); }, function () { fallback(textToCopy); });
        } else {
          fallback(textToCopy);
        }
      });
    }

    // What it is and Similar animations from the README. Opened from disk, the README link stays.
    function loadReadme() {
      var what = page.querySelector('.hb-what-text');
      var related = page.querySelector('.hb-related');
      if (!what || win.location.protocol === 'file:' || !win.fetch) return;
      win.fetch('README.md').then(function (res) {
        if (!res.ok) throw new Error('README ' + res.status);
        return res.text();
      }).then(function (md) {
        var s = sections(md);
        if (s['What it is']) what.innerHTML = paragraphs(s['What it is']);
        var list = related && related.querySelector('.hb-rel-list');
        var cards = seeAlso(s['See also']).filter(function (r) { return isSafeHref(r.href); });
        if (!list || !cards.length) return;
        list.innerHTML = cards.map(function (r) {
          var desc = r.desc.replace(/^[a-z]/, function (c) { return c.toUpperCase(); });
          return '<a class="hb-rel" href="' + escapeHtml(r.href) + '"><b>' + r.name + '</b>' +
            (desc ? '<span>' + desc + '</span>' : '') + '</a>';
        }).join('');
        related.hidden = false;
      }).catch(function () {});
    }

    // Changing a setting updates the chips and replays the animation shortly after the last change.
    // Text fields already replay on every input, so the change event they fire when left is ignored.
    var replayTimer = 0;
    function onSettingsChange(e) {
      if (e.type === 'click' && !e.target.closest('.seg button, .swatches button')) return;
      if (e.type === 'change' && e.target.matches('input[type=text], textarea')) return;
      win.setTimeout(refreshChips, 0);
      win.clearTimeout(replayTimer);
      replayTimer = win.setTimeout(replay, 250);
    }

    // Loops: Pause stops the demo and Play starts it again. With data-hb-pause="css" a class on the stage holds its
    // CSS animations; the "hb:pause" event goes out either way, so a page that runs its own timers can stop them.
    var paused = false;
    function setPaused(next) {
      paused = next;
      pauseCtl.setAttribute('data-state', paused ? 'paused' : 'playing');
      var label = pauseCtl.querySelector('.hb-pause-label');
      if (label) label.textContent = paused ? 'Play' : 'Pause';
      if (stage && pauseCtl.getAttribute('data-hb-pause') === 'css') stage.classList.toggle('hb-paused', paused);
      doc.dispatchEvent(new win.CustomEvent('hb:pause', { detail: { paused: paused } }));
    }

    // Slow motion with data-hb-slowmo="css": while it is on, every CSS animation and transition on the stage runs at a
    // third of its speed, including ones that start later. Without the value, the page slows its own timings.
    var slowing = false;
    function slowStage() {
      var rate = slowCtl.checked ? 1 / 3 : 1;
      stage.getAnimations({ subtree: true }).forEach(function (a) { if (a.playbackRate !== rate) a.playbackRate = rate; });
      slowing = slowCtl.checked;
      if (slowing) win.requestAnimationFrame(slowStage);
    }

    // While the device asks for reduced motion, Loop and Slow motion are switched off and cannot be switched on, a
    // loop starts paused, and a note in the player bar says why. Replay and Play still work.
    var playerSwitches = [loopCtl, slowCtl].filter(Boolean);
    var noteEl = null;
    function followReducedMotion() {
      var reduced = !!(reduce && reduce.matches);
      playerSwitches.forEach(function (sw) {
        if (reduced) sw.checked = false;
        sw.disabled = reduced;
        var label = sw.closest('label.hb-toggle');
        if (label) label.classList.toggle('is-disabled', reduced);
      });
      if (reduced && pauseCtl && !paused) setPaused(true);
      var note = reduced ? motionNote({ loop: !!loopCtl, slow: !!slowCtl, pause: !!pauseCtl }) : '';
      if (note && !noteEl && player) {
        noteEl = doc.createElement('p');
        noteEl.className = 'hb-player-note';
        noteEl.textContent = note;
        player.appendChild(noteEl);
      } else if (!note && noteEl) {
        noteEl.parentNode.removeChild(noteEl);
        noteEl = null;
      }
    }

    setUpPrompt();
    if (copyBtn) setUpCopy();
    if (tryStep) ['input', 'change', 'click'].forEach(function (type) { tryStep.addEventListener(type, onSettingsChange); });
    if (slowCtl) slowCtl.addEventListener('change', replay);
    if (pauseCtl) pauseCtl.addEventListener('click', function () { setPaused(!paused); });
    if (slowCtl && stage && stage.getAnimations && slowCtl.getAttribute('data-hb-slowmo') === 'css') {
      slowCtl.addEventListener('change', function () { if (!slowing) slowStage(); });
      if (slowCtl.checked) slowStage();
    }
    followReducedMotion();
    if (reduce && reduce.addEventListener) reduce.addEventListener('change', followReducedMotion);
    else if (reduce && reduce.addListener) reduce.addListener(followReducedMotion);
    if (doc.body.hasAttribute('data-hb-autoplay')) {
      win.setTimeout(function () {
        if (loopCtl && !(reduce && reduce.matches)) {
          // After Back or a reload a browser can bring Loop back already on; press Replay so the demo still starts.
          if (loopCtl.checked) replay();
          else loopCtl.click();
        } else {
          replay();
        }
      }, 400);
    }
    refreshChips();
    warnIncomplete();
    loadReadme();
  }

  return {
    escapeHtml: escapeHtml, plain: plain, isSafeHref: isSafeHref, inline: inline, sections: sections,
    paragraphs: paragraphs, seeAlso: seeAlso, settingsLine: settingsLine, markFill: markFill, shorten: shorten,
    quoteText: quoteText, motionNote: motionNote, readSettings: readSettings, boot: boot
  };
});
