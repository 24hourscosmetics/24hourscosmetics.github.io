(function () {
  const sections = Array.from(document.querySelectorAll(".page-section"));
  if (sections.length < 2) return;

  let snapCooldown = false;
  const COOLDOWN_MS = 850;
  const WHEEL_THRESHOLD = 18;
  const TOUCH_THRESHOLD = 48;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function getStickyOffset() {
    const ticker = document.querySelector(".ticker");
    const header = document.querySelector(".site-header");

    return (
      (ticker ? ticker.getBoundingClientRect().height : 0) +
      (header ? header.getBoundingClientRect().height : 0)
    );
  }

  function getCurrentSectionIndex() {
    const stickyOffset = getStickyOffset();
    let currentIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    sections.forEach(function (section, index) {
      const distance = Math.abs(
        section.getBoundingClientRect().top - stickyOffset
      );
      if (distance < closestDistance) {
        closestDistance = distance;
        currentIndex = index;
      }
    });

    return currentIndex;
  }

  function snapToSection(index) {
    const target = sections[index];
    if (!target || snapCooldown) return;

    snapCooldown = true;
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });

    window.setTimeout(function () {
      snapCooldown = false;
    }, COOLDOWN_MS);
  }

  function moveSection(direction) {
    const currentIndex = getCurrentSectionIndex();
    const nextIndex = Math.max(
      0,
      Math.min(sections.length - 1, currentIndex + direction)
    );

    if (nextIndex !== currentIndex) {
      snapToSection(nextIndex);
    }
  }

  window.addEventListener(
    "wheel",
    function (event) {
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD || snapCooldown) return;

      event.preventDefault();
      moveSection(event.deltaY > 0 ? 1 : -1);
    },
    { passive: false }
  );

  let touchStartY = 0;

  window.addEventListener(
    "touchstart",
    function (event) {
      touchStartY = event.changedTouches[0].clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchend",
    function (event) {
      const touchEndY = event.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      if (Math.abs(deltaY) < TOUCH_THRESHOLD || snapCooldown) return;

      moveSection(deltaY > 0 ? 1 : -1);
    },
    { passive: true }
  );
})();
