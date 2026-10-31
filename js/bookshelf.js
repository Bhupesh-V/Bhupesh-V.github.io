// Powers the /bookshelf/ page (shelf + wishlist). Expects window.BOOKSHELF_DATA
// and window.WISHLIST_DATA to already be set by a small inline bootstrap
// script in bookshelf.html.
(function () {
  var SHELF = window.BOOKSHELF_DATA;
  var WISHLIST = window.WISHLIST_DATA;

  var STATUS_META = {
    reading: { label: "Reading", emoji: "📖" },
    on_shelf: { label: "On Shelf", emoji: "📚" },
    read: { label: "Read", emoji: "✅" }
  };
  var STATUS_ORDER = ["reading", "on_shelf", "read"];

  // Orders genres by how many books carry them (most first), not alphabetically.
  // Based on total counts across the whole list, so the chip order stays put
  // as filters are toggled instead of jumping around.
  function genresByCount(items) {
    var counts = {};
    items.forEach(function (item) { counts[item.genre] = (counts[item.genre] || 0) + 1; });
    return Object.keys(counts).sort(function (a, b) {
      return counts[b] - counts[a] || a.localeCompare(b);
    });
  }

  var shelfGenres = genresByCount(SHELF);
  var wishlistGenres = genresByCount(WISHLIST);

  var urlParams = new URLSearchParams(window.location.search);
  function paramList(name) {
    var raw = urlParams.get(name);
    return raw ? raw.split(",").map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean) : [];
  }

  // Genres are stored/displayed with their original casing (e.g. "Fiction"),
  // but URL params are lowercase — match case-insensitively to restore them.
  function restoreGenre(raw, genres) {
    if (!raw) return "all";
    var match = genres.find(function (g) { return g.toLowerCase() === raw; });
    return match || "all";
  }

  var selectedStatuses = new Set(paramList("status").filter(function (s) { return STATUS_META[s]; }));
  var selectedShelfGenre = restoreGenre(urlParams.get("genre"), shelfGenres);
  var selectedWishlistGenre = restoreGenre(urlParams.get("wgenre"), wishlistGenres);
  var activeTab = urlParams.get("tab") === "wishlist" ? "wishlist" : "shelf";

  function toggle(set, value) {
    if (set.has(value)) set.delete(value); else set.add(value);
  }

  function updateUrl() {
    var params = new URLSearchParams();
    if (activeTab !== "shelf") params.set("tab", activeTab);
    if (selectedStatuses.size) params.set("status", Array.from(selectedStatuses).join(","));
    if (selectedShelfGenre !== "all") {
      params.set("genre", selectedShelfGenre.toLowerCase());
    }
    if (selectedWishlistGenre !== "all") {
      params.set("wgenre", selectedWishlistGenre.toLowerCase());
    }
    var qs = params.toString();
    window.history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : ""));
  }

  function makeChip(label, count, active, onClick) {
    var chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip" + (active ? " active" : "");
    chip.textContent = label;
    if (count !== undefined) {
      var span = document.createElement("span");
      span.className = "count";
      span.textContent = " " + count;
      chip.appendChild(span);
    }
    chip.addEventListener("click", onClick);
    return chip;
  }

  function renderChipRow(containerId, labelText, chips) {
    var wrap = document.getElementById(containerId);
    wrap.innerHTML = "";
    if (!chips.length) return;
    var label = document.createElement("span");
    label.className = "filter-label";
    label.textContent = labelText;
    wrap.appendChild(label);
    var scroller = document.createElement("div");
    scroller.className = "chip-scroll";
    chips.forEach(function (chip) { scroller.appendChild(chip); });
    wrap.appendChild(scroller);
  }

  // --- Shelf ---

  function statusOk(book) {
    return selectedStatuses.size === 0 || selectedStatuses.has(book.status);
  }

  function shelfGenreOk(book) {
    return selectedShelfGenre === "all" || book.genre === selectedShelfGenre;
  }

  function shelfMatches(book) {
    return statusOk(book) && shelfGenreOk(book);
  }

  function setShelfGenre(genre) {
    selectedShelfGenre = genre;
    renderShelf();
  }

  var shelfGenreSelect = document.getElementById("shelf-genre-select");

  function populateShelfGenreSelect() {
    shelfGenreSelect.innerHTML = "";

    var allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All Genres (" + SHELF.filter(statusOk).length + ")";
    shelfGenreSelect.appendChild(allOption);

    shelfGenres.forEach(function (genre) {
      var count = SHELF.filter(function (b) { return b.genre === genre && statusOk(b); }).length;
      var option = document.createElement("option");
      option.value = genre;
      option.textContent = genre + " (" + count + ")";
      shelfGenreSelect.appendChild(option);
    });

    shelfGenreSelect.value = selectedShelfGenre;
  }

  function renderShelfFilters() {
    renderChipRow("status-filters", "Status", STATUS_ORDER.map(function (status) {
      var count = SHELF.filter(function (b) { return b.status === status && shelfGenreOk(b); }).length;
      var meta = STATUS_META[status];
      return makeChip(meta.emoji + " " + meta.label, count, selectedStatuses.has(status), function () {
        toggle(selectedStatuses, status);
        renderShelf();
      });
    }));

    populateShelfGenreSelect();
  }

  function sortShelf(items) {
    return items.slice().sort(function (a, b) {
      return STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
    });
  }

  function bookCard(book) {
    var card = document.createElement("article");
    card.className = "book-card" + (book.recommended ? " featured" : "");

    var head = document.createElement("div");
    head.className = "book-head";

    var title = document.createElement("span");
    title.className = "book-title";
    if (book.recommended) title.appendChild(document.createTextNode("⭐ "));
    title.appendChild(document.createTextNode(book.title));
    head.appendChild(title);

    var meta = STATUS_META[book.status];
    var badge = document.createElement("span");
    badge.className = "book-status-badge";
    badge.textContent = meta.emoji + " " + meta.label;
    head.appendChild(badge);

    card.appendChild(head);

    var author = document.createElement("div");
    author.className = "book-author";
    author.appendChild(document.createTextNode("By "));
    var authorName = document.createElement("i");
    authorName.textContent = book.author;
    author.appendChild(authorName);

    // Genre sits right after the author on desktop; on narrow screens it
    // drops to its own line instead (see .book-genre-tag in CSS).
    var genreTag = makeChip(book.genre, undefined, selectedShelfGenre === book.genre, function () {
      setShelfGenre(book.genre);
    });
    genreTag.classList.add("chip-sm", "book-genre-tag");
    author.appendChild(genreTag);

    // Duplicate badge for mobile — status moves from the title row onto its
    // own line below the author on narrow screens (see .book-status-badge-meta in CSS).
    var metaBadge = document.createElement("span");
    metaBadge.className = "book-status-badge book-status-badge-meta";
    metaBadge.textContent = meta.emoji + " " + meta.label;
    author.appendChild(metaBadge);

    card.appendChild(author);

    if (book.thoughts) {
      var thoughts = document.createElement("p");
      thoughts.className = "book-thoughts";
      thoughts.textContent = book.thoughts;
      card.appendChild(thoughts);
    }

    return card;
  }

  function renderShelf() {
    renderShelfFilters();
    updateUrl();

    document.querySelector("#shelf-app .filter-actions").style.display =
      (selectedStatuses.size > 0 || selectedShelfGenre !== "all") ? "inline-flex" : "none";

    var results = document.getElementById("shelf-results");
    results.innerHTML = "";

    var filtered = sortShelf(SHELF.filter(shelfMatches));
    document.getElementById("shelf-results-count-text").textContent =
      filtered.length + (filtered.length === 1 ? " book" : " books");

    if (!filtered.length) {
      var empty = document.createElement("p");
      empty.className = "artifacts-empty";
      empty.textContent = "No books match these filters.";
      results.appendChild(empty);
      return;
    }

    filtered.forEach(function (book) { results.appendChild(bookCard(book)); });
  }

  // --- Wishlist ---

  var wishlistGenreCounts = {};
  wishlistGenres.forEach(function (genre) {
    wishlistGenreCounts[genre] = WISHLIST.filter(function (b) { return b.genre === genre; }).length;
  });

  function wishlistGenreOk(book) {
    return selectedWishlistGenre === "all" || book.genre === selectedWishlistGenre;
  }

  function setWishlistGenre(genre) {
    selectedWishlistGenre = genre;
    renderWishlist();
  }

  var wishlistGenreSelect = document.getElementById("wishlist-genre-select");

  function populateWishlistGenreSelect() {
    wishlistGenreSelect.innerHTML = "";

    var allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All Genres (" + WISHLIST.length + ")";
    wishlistGenreSelect.appendChild(allOption);

    wishlistGenres.forEach(function (genre) {
      var option = document.createElement("option");
      option.value = genre;
      option.textContent = genre + " (" + wishlistGenreCounts[genre] + ")";
      wishlistGenreSelect.appendChild(option);
    });

    wishlistGenreSelect.value = selectedWishlistGenre;
  }

  function wishlistCard(book) {
    var card = document.createElement("article");
    card.className = "wishlist-card";

    var title = document.createElement("h3");
    title.className = "wishlist-title";
    title.textContent = book.title;
    card.appendChild(title);

    var author = document.createElement("p");
    author.className = "wishlist-author";
    author.textContent = "By " + book.author;
    card.appendChild(author);

    card.appendChild(makeChip(book.genre, undefined, false, function () {
      setWishlistGenre(book.genre);
    }));
    card.lastChild.classList.add("chip-sm");

    return card;
  }

  function renderWishlist() {
    populateWishlistGenreSelect();
    updateUrl();

    document.querySelector("#wishlist-app .filter-actions").style.display =
      selectedWishlistGenre !== "all" ? "inline-flex" : "none";

    var results = document.getElementById("wishlist-results");
    results.innerHTML = "";

    var filtered = WISHLIST.filter(wishlistGenreOk);
    document.getElementById("wishlist-results-count-text").textContent =
      filtered.length + (filtered.length === 1 ? " book" : " books") + " on the wishlist";

    if (!filtered.length) {
      var empty = document.createElement("p");
      empty.className = "artifacts-empty";
      empty.textContent = "No books match this genre.";
      results.appendChild(empty);
      return;
    }

    filtered.forEach(function (book) { results.appendChild(wishlistCard(book)); });
  }

  document.getElementById("shelf-clear-filters").addEventListener("click", function () {
    selectedStatuses.clear();
    selectedShelfGenre = "all";
    renderShelf();
  });

  document.getElementById("wishlist-clear-filters").addEventListener("click", function () {
    setWishlistGenre("all");
  });

  shelfGenreSelect.addEventListener("change", function (e) {
    setShelfGenre(e.target.value);
  });

  wishlistGenreSelect.addEventListener("change", function (e) {
    setWishlistGenre(e.target.value);
  });

  // --- Tabs ---

  var shelfBtn = document.getElementById("tab-shelf-btn");
  var wishlistBtn = document.getElementById("tab-wishlist-btn");
  var shelfApp = document.getElementById("shelf-app");
  var wishlistApp = document.getElementById("wishlist-app");

  function setActiveTab(tab) {
    activeTab = tab;
    var showShelf = tab === "shelf";

    shelfBtn.classList.toggle("active", showShelf);
    shelfBtn.setAttribute("aria-selected", showShelf);
    shelfApp.hidden = !showShelf;

    wishlistBtn.classList.toggle("active", !showShelf);
    wishlistBtn.setAttribute("aria-selected", !showShelf);
    wishlistApp.hidden = showShelf;

    updateUrl();
  }

  shelfBtn.addEventListener("click", function () { setActiveTab("shelf"); });
  wishlistBtn.addEventListener("click", function () { setActiveTab("wishlist"); });

  renderShelf();
  renderWishlist();
  setActiveTab(activeTab);
})();
