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
})();
