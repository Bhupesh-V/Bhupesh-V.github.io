// Powers the /flicks/ filter UI. Expects window.FLICKS_DATA to already be
// set by a small inline bootstrap script in flicks.html.
(function () {
  var FLICKS = window.FLICKS_DATA;

  var urlParams = new URLSearchParams(window.location.search);
  function paramList(name) {
    var raw = urlParams.get(name);
    return raw ? raw.split(",").map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean) : [];
  }

  var allTags = Array.from(new Set(FLICKS.reduce(function (acc, f) { return acc.concat(f.tags || []); }, []))).sort();
  var selectedTags = new Set(paramList("tags").filter(function (t) { return allTags.indexOf(t) !== -1; }));

  function matches(item) {
    return selectedTags.size === 0 || (item.tags || []).some(function (t) { return selectedTags.has(t); });
  }

  function hasAnyFilter() {
    return selectedTags.size > 0;
  }

  function toggle(set, value) {
    if (set.has(value)) set.delete(value); else set.add(value);
  }

  // Slug is derived from title + year so a share link keeps working even if
  // wording elsewhere on the card changes later. Not stored in the data file —
  // deterministic from title/year alone, so there's nothing to keep in sync.
  function slugify(flick) {
    var base = flick.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return flick.year ? base + "-" + flick.year : base;
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    var parts = dateStr.split("-");
    var year = parseInt(parts[0], 10);
    var month = parts[1] ? parseInt(parts[1], 10) - 1 : 0;
    var hasDay = parts.length > 2;
    var d = new Date(year, month, hasDay ? parseInt(parts[2], 10) : 1);
    var opts = hasDay
      ? { year: "numeric", month: "long", day: "numeric" }
      : { year: "numeric", month: "long" };
    return d.toLocaleDateString("en-US", opts);
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Converts markdown-style [text](url) links into safe <a> tags. Runs after
  // escaping so raw HTML typed into the data file can't sneak through.
  function linkify(text) {
    return escapeHtml(text).replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, function (_, label, url) {
      return '<a href="' + url + '" target="_blank" rel="noopener">' + label + "</a>";
    });
  }

  // A learning is plain text, not a markdown file, but still needs light
  // structure: a blank line starts a new paragraph, and a block made up
  // entirely of "- " lines renders as a bullet list. Lines within a
  // paragraph/item that aren't blank-separated are just soft-wraps, so
  // they're joined with a space (same as writing the yaml with `>`).
  function renderLearning(text) {
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
  }

  function updateUrl() {
    var params = new URLSearchParams();
    if (selectedTags.size) params.set("tags", Array.from(selectedTags).join(","));
    var qs = params.toString();
    window.history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : "") + window.location.hash);
  }

  function makeChip(html, active, extraClass, onClick) {
    var chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip" + (extraClass ? " " + extraClass : "") + (active ? " active" : "");
    chip.innerHTML = html;
    chip.addEventListener("click", onClick);
    return chip;
  }

  function tagChip(tag, count, small) {
    var html = tag + (count !== undefined ? " <span class=\"count\">" + count + "</span>" : "");
    return makeChip(html, selectedTags.has(tag), small ? "chip-sm" : "", function () {
      toggle(selectedTags, tag);
      render();
    });
  }

  function renderTagFilters() {
    var wrap = document.getElementById("tag-filters");
    wrap.innerHTML = "";
    if (!allTags.length) return;

    var label = document.createElement("span");
    label.className = "filter-label";
    label.textContent = "Tags";
    wrap.appendChild(label);

    var scroller = document.createElement("div");
    scroller.className = "chip-scroll";
    allTags.forEach(function (tag) {
      var count = FLICKS.filter(function (f) { return (f.tags || []).indexOf(tag) !== -1; }).length;
      scroller.appendChild(tagChip(tag, count));
    });
    wrap.appendChild(scroller);
  }

  function fallbackCopy(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
    document.body.removeChild(textarea);
    return ok;
  }

  function copyPermalink(anchorId, btn) {
    var url = window.location.origin + window.location.pathname + "#" + anchorId;
    window.history.replaceState(null, "", url.replace(window.location.origin, ""));
    var flash = function (label) {
      var original = "🔗";
      btn.textContent = label;
      setTimeout(function () { btn.textContent = original; }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(function () { flash("Copied"); })
        .catch(function () { flash(fallbackCopy(url) ? "Copied" : "Couldn't copy"); });
    } else {
      flash(fallbackCopy(url) ? "Copied" : "Couldn't copy");
    }
  }

  function flickCard(flick) {
    var anchorId = "flick-" + slugify(flick);

    var card = document.createElement("article");
    card.className = "flick-card";
    card.id = anchorId;

    var head = document.createElement("div");
    head.className = "flick-head";

    var title = document.createElement("span");
    title.className = "flick-title";
    title.textContent = flick.title + (flick.year ? " (" + flick.year + ")" : "");
    head.appendChild(title);

    var permalink = document.createElement("button");
    permalink.type = "button";
    permalink.className = "flick-permalink";
    permalink.title = "Copy link to this flick";
    permalink.textContent = "🔗";
    permalink.addEventListener("click", function () { copyPermalink(anchorId, permalink); });
    head.appendChild(permalink);

    card.appendChild(head);

    if (flick.watched) {
      var meta = document.createElement("div");
      meta.className = "flick-meta";
      meta.textContent = "📅 " + formatDate(flick.watched);
      card.appendChild(meta);
    }

    if (flick.tags && flick.tags.length) {
      var tagsWrap = document.createElement("div");
      tagsWrap.className = "flick-tags";
      flick.tags.forEach(function (tag) { tagsWrap.appendChild(tagChip(tag, undefined, true)); });
      card.appendChild(tagsWrap);
    }

    var learning = document.createElement("div");
    learning.className = "flick-learning";
    learning.innerHTML = renderLearning(flick.learning);
    card.appendChild(learning);

    return card;
  }

  function sortByWatched(items) {
    return items.slice().sort(function (a, b) { return (b.watched || "").localeCompare(a.watched || ""); });
  }

  function render() {
    renderTagFilters();
    updateUrl();

    document.querySelector(".filter-actions").style.display = hasAnyFilter() ? "inline-flex" : "none";

    var results = document.getElementById("flicks-results");
    results.innerHTML = "";

    var filtered = sortByWatched(FLICKS.filter(matches));
    document.getElementById("results-count-text").textContent =
      filtered.length + (filtered.length === 1 ? " flick" : " flicks");

    if (!filtered.length) {
      var empty = document.createElement("p");
      empty.className = "artifacts-empty";
      empty.textContent = "Nothing here yet — try clearing a filter.";
      results.appendChild(empty);
      return;
    }

    filtered.forEach(function (flick) { results.appendChild(flickCard(flick)); });
  }

  // Deep-links (e.g. shared via the 🔗 button) land here — scroll to the
  // target card and flash it so it's obvious which one was linked.
  function highlightFromHash() {
    var id = window.location.hash.replace("#", "");
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("flick-highlight");
    setTimeout(function () { el.classList.remove("flick-highlight"); }, 2000);
  }

  document.getElementById("clear-filters").addEventListener("click", function () {
    selectedTags.clear();
    render();
  });

  window.addEventListener("hashchange", highlightFromHash);

  render();
  highlightFromHash();
})();
