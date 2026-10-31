// Shared renderer for free-form multi-line text fields (flicks' "learning",
// bookshelf's "thoughts"): a blank line starts a new paragraph, a block made
// up entirely of "- " lines becomes a bullet list, and markdown-style
// [text](url) links convert to real <a> tags. Not a full markdown parser —
// just enough structure for personal notes, with escaping so raw HTML typed
// into a data file can't sneak through.
window.renderTextBlocks = function (text) {
  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function linkify(str) {
    return escapeHtml(str).replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, function (_, label, url) {
      return '<a href="' + url + '" target="_blank" rel="noopener">' + label + "</a>";
    });
  }

  var blocks = (text || "").trim().split(/\n\s*\n/).filter(Boolean);
  return blocks.map(function (block) {
    var lines = block.split("\n").map(function (l) { return l.trim(); }).filter(Boolean);
    var isList = lines.length > 0 && lines.every(function (l) { return /^-\s+/.test(l); });

    if (isList) {
      var items = lines.map(function (l) { return "<li>" + linkify(l.replace(/^-\s+/, "")) + "</li>"; });
      return "<ul>" + items.join("") + "</ul>";
    }

    return "<p>" + linkify(lines.join(" ")) + "</p>";
  }).join("");
};
