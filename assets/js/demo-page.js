/* Animation Handbook — shared behaviour for the guided-steps demo pages.
 * The pure helpers are exported for tests/demo-page.test.js. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) { module.exports = api; return; }
  root.DemoPage = api;
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
  // protocol-relative "//host" links, is rendered as plain text instead.
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

  return {
    escapeHtml: escapeHtml, plain: plain, isSafeHref: isSafeHref, inline: inline, sections: sections,
    paragraphs: paragraphs, seeAlso: seeAlso, settingsLine: settingsLine, markFill: markFill
  };
});
