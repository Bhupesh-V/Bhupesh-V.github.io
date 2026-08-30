// Site-wide chrome: dark mode toggle, back-to-top button, heading anchor links, Web Share.
// Loaded on every page via the default/plain layouts. The dark-mode class itself is set
// synchronously in an inline <head> script (before this file loads) to avoid a flash of
// the wrong theme; this file only wires up the toggle button afterwards.
(function () {
  function toggleTheme() {
    var isDark = document.documentElement.classList.toggle("dark-mode");
    localStorage.setItem("lightmode", isDark ? "disabled" : "enabled");
    var trayIcon = document.getElementById("tray-icon");
    if (trayIcon) trayIcon.textContent = isDark ? "🌗" : "🌓";
  }

  function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  function updateScrollButton() {
    var btn = document.getElementById("myBtn");
    if (!btn) return;
    var scrolled = document.body.scrollTop > 20 || document.documentElement.scrollTop > 20;
    btn.style.display = scrolled ? "block" : "none";
  }

  function share() {
    if (!navigator.share) return;
    navigator.share({ title: document.title, url: window.location.href })
      .catch(function (error) { console.log("Error sharing", error); });
  }

  // Appends a small link icon to every heading that has an id, so it can be deep-linked.
  function addHeadingLinks() {
    var headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    var svgNS = "http://www.w3.org/2000/svg";
    headings.forEach(function (heading) {
      if (!heading.id) return;

      var link = document.createElement("a");
      link.href = "#" + heading.id;
      link.classList.add("header-link");

      var icon = document.createElementNS(svgNS, "svg");
      icon.classList.add("icon");
      var use = document.createElementNS(svgNS, "use");
      use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#icon-link");
      use.setAttribute("href", "#icon-link");
      icon.appendChild(use);

      link.appendChild(icon);
      heading.appendChild(link);
    });
  }

  var trayIcon = document.getElementById("tray-icon");
  if (trayIcon) trayIcon.addEventListener("click", toggleTheme);

  var scrollBtn = document.getElementById("myBtn");
  if (scrollBtn) scrollBtn.addEventListener("click", scrollToTop);
  window.addEventListener("scroll", updateScrollButton);

  var shareIcon = document.querySelector("#shareIcon svg");
  if (shareIcon) shareIcon.addEventListener("click", share);

  addHeadingLinks();
})();
