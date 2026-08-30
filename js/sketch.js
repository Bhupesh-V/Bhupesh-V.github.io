// Powers the /sketches/ swipeable lightbox. The grid and lightbox slides themselves are
// rendered server-side (see sketch.html) — this only wires up the interactivity.
(function () {
  var grid = document.getElementById("sketch-grid");
  var lightbox = document.getElementById("sketch-lightbox");
  var track = document.getElementById("sketch-lightbox-track");
  var slides = track.querySelectorAll(".sketch-lightbox-slide");
  var counter = document.getElementById("sketch-lightbox-counter");
  var prevBtn = document.getElementById("sketch-lightbox-prev");
  var nextBtn = document.getElementById("sketch-lightbox-next");
  var closeBtn = document.getElementById("sketch-lightbox-close");

  function currentIndex() {
    return Math.round(track.scrollLeft / track.clientWidth);
  }

  function goTo(index, behavior) {
    index = Math.max(0, Math.min(slides.length - 1, index));
    slides[index].scrollIntoView({ inline: "center", block: "nearest", behavior: behavior || "smooth" });
  }

  function updateControls() {
    var index = currentIndex();
    counter.textContent = (index + 1) + " / " + slides.length;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === slides.length - 1;
  }

  function open(index) {
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    goTo(index, "auto");
    updateControls();
  }

  function close() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  grid.addEventListener("click", function (e) {
    var item = e.target.closest(".sketch-item");
    if (item) open(parseInt(item.dataset.index, 10));
  });

  prevBtn.addEventListener("click", function () { goTo(currentIndex() - 1); });
  nextBtn.addEventListener("click", function () { goTo(currentIndex() + 1); });
  closeBtn.addEventListener("click", close);

  // Clicking the dark padding around a slide closes the lightbox; clicking the image itself does not.
  track.addEventListener("click", function (e) {
    if (e.target.classList.contains("sketch-lightbox-slide")) close();
  });

  var scrollTicking = false;
  track.addEventListener("scroll", function () {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(function () {
      updateControls();
      scrollTicking = false;
    });
  });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") goTo(currentIndex() - 1);
    if (e.key === "ArrowRight") goTo(currentIndex() + 1);
  });
})();
