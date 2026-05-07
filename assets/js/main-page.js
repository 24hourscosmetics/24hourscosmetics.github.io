(function () {
  const hero = document.querySelector(".main-hero");
  const listSection = document.getElementById("main-list");
  if (!hero || !listSection) return;

  let snapCooldown = false;
  const COOLDOWN_MS = 900;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function snapToList() {
    if (snapCooldown) return;
    snapCooldown = true;
    listSection.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
    window.setTimeout(function () {
      snapCooldown = false;
    }, COOLDOWN_MS);
  }

  function atTop() {
    return window.scrollY < 8;
  }

  window.addEventListener(
    "wheel",
    function (e) {
      if (!atTop() || e.deltaY <= 0) return;
      e.preventDefault();
      snapToList();
    },
    { passive: false }
  );

  let touchStartY = 0;
  window.addEventListener(
    "touchstart",
    function (e) {
      touchStartY = e.changedTouches[0].clientY;
    },
    { passive: true }
  );
  window.addEventListener(
    "touchend",
    function (e) {
      const touchEndY = e.changedTouches[0].clientY;
      if (!atTop()) return;
      if (touchStartY - touchEndY > 48) {
        snapToList();
      }
    },
    { passive: true }
  );
})();
