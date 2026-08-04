/**
 * Tonic & Root — landing page behavior.
 * Progressive enhancement: nav, anchors, and content all work without JS.
 */
(function () {
  "use strict";

  /* Mobile nav toggle */
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.querySelector(".main-nav");
  var navBackdrop = document.querySelector(".nav-backdrop");

  function closeNav() {
    if (!mainNav) return;
    mainNav.classList.remove("is-open");
    navBackdrop && navBackdrop.classList.remove("is-open");
    navToggle && navToggle.setAttribute("aria-expanded", "false");
  }

  function openNav() {
    if (!mainNav) return;
    mainNav.classList.add("is-open");
    navBackdrop && navBackdrop.classList.add("is-open");
    navToggle && navToggle.setAttribute("aria-expanded", "true");
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      mainNav.classList.contains("is-open") ? closeNav() : openNav();
    });
    navBackdrop && navBackdrop.addEventListener("click", closeNav);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  /* Sticky header shadow once the page scrolls */
  var header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener(
      "scroll",
      function () {
        header.classList.toggle("is-scrolled", window.scrollY > 12);
      },
      { passive: true }
    );
  }

  /* Reveal-on-scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Footer year */
  document.querySelectorAll("[data-current-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* -----------------------------------------------------------------------
   * Amy portrait: scroll-scrubbed photo fade.
   * Progress (0 = far from viewport center, 1 = dead center) drives the
   * photo's opacity. Scrolling past center fades it back out automatically,
   * since it's the same value driving both directions.
   * --------------------------------------------------------------------- */
  var scrubEl = document.querySelector(".amy-portrait");
  if (scrubEl) {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var photoImg = scrubEl.querySelector(".amy-photo-frame img");

    var clamp01 = function (n) {
      return Math.max(0, Math.min(1, n));
    };

    // Ease the raw distance-based progress so the fade feels less linear/robotic.
    var smoothstep = function (t) {
      return t * t * (3 - 2 * t);
    };

    if (reduceMotion) {
      // Static, fully-visible end state — no scroll-linked motion.
      if (photoImg) photoImg.style.opacity = "1";
    } else {
      var ticking = false;

      var update = function () {
        ticking = false;
        var rect = scrubEl.getBoundingClientRect();
        var elCenter = rect.top + rect.height / 2;
        var viewCenter = window.innerHeight / 2;
        var range = window.innerHeight * 0.62;
        var raw = 1 - clamp01(Math.abs(elCenter - viewCenter) / range);
        var progress = smoothstep(raw);

        if (photoImg) photoImg.style.opacity = String(progress);
      };

      var onScroll = function () {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      update();
    }
  }
})();
