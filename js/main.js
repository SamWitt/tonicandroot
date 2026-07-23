/**
 * Vine & Sunset — shared site behavior.
 * Progressive enhancement: every feature degrades gracefully without JS.
 */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
   * Mobile nav toggle
   * ------------------------------------------------------------------- */
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
      var isOpen = mainNav.classList.contains("is-open");
      isOpen ? closeNav() : openNav();
    });
    navBackdrop && navBackdrop.addEventListener("click", closeNav);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  /* ---------------------------------------------------------------------
   * Mark current nav link (aria-current) based on pathname
   * ------------------------------------------------------------------- */
  (function markCurrentNav() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(function (link) {
      var href = link.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        link.setAttribute("aria-current", "page");
      }
    });
  })();

  /* ---------------------------------------------------------------------
   * Accordion (FAQ page and elsewhere)
   * ------------------------------------------------------------------- */
  document.querySelectorAll(".accordion-trigger").forEach(function (btn) {
    var panelId = btn.getAttribute("aria-controls");
    var panel = document.getElementById(panelId);
    if (!panel) return;

    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      panel.style.maxHeight = expanded ? null : panel.scrollHeight + "px";
    });
  });

  /* ---------------------------------------------------------------------
   * Testimonial carousel
   * ------------------------------------------------------------------- */
  var track = document.querySelector(".testimonial-track");
  if (track) {
    var slides = Array.prototype.slice.call(track.querySelectorAll(".testimonial"));
    var dotsWrap = track.querySelector(".testimonial-dots");
    var current = 0;
    var timer;

    function renderDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Show testimonial " + (i + 1));
        dot.setAttribute("aria-current", i === current ? "true" : "false");
        dot.addEventListener("click", function () {
          goTo(i);
          resetTimer();
        });
        dotsWrap.appendChild(dot);
      });
    }

    function goTo(index) {
      slides[current].classList.remove("is-active");
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("is-active");
      if (dotsWrap) {
        Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
          dot.setAttribute("aria-current", i === current ? "true" : "false");
        });
      }
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(function () {
        goTo(current + 1);
      }, 7000);
    }

    if (slides.length) {
      slides[0].classList.add("is-active");
      renderDots();
      resetTimer();
    }
  }

  /* ---------------------------------------------------------------------
   * Reveal-on-scroll
   * ------------------------------------------------------------------- */
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

  /* ---------------------------------------------------------------------
   * Back to top
   * ------------------------------------------------------------------- */
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      function () {
        backToTop.classList.toggle("is-visible", window.scrollY > 800);
      },
      { passive: true }
    );
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------------------
   * Filter tabs (Events / Bottle Shop / Menu)
   * ------------------------------------------------------------------- */
  document.querySelectorAll(".filter-tabs").forEach(function (tabGroup) {
    var targetSelector = tabGroup.getAttribute("data-filter-target");
    if (!targetSelector) return;
    var items = document.querySelectorAll(targetSelector);

    tabGroup.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        tabGroup.querySelectorAll("button").forEach(function (b) {
          b.setAttribute("aria-pressed", "false");
        });
        btn.setAttribute("aria-pressed", "true");
        var filter = btn.getAttribute("data-filter");

        items.forEach(function (item) {
          var categories = (item.getAttribute("data-category") || "").split(" ");
          var show = filter === "all" || categories.indexOf(filter) !== -1;
          item.style.display = show ? "" : "none";
        });
      });
    });
  });

  /* ---------------------------------------------------------------------
   * Form handling (progressive-enhancement mock submissions)
   * All forms are wired for real endpoints later (Stripe, Mailchimp,
   * scheduling APIs). For now they validate and show a confirmation
   * message without a backend.
   * ------------------------------------------------------------------- */
  document.querySelectorAll("form[data-mock-submit]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var status = form.querySelector(".form-status");
      var successMsg = form.getAttribute("data-success-message") || "Thank you! We'll be in touch soon.";
      if (status) {
        status.textContent = successMsg;
        status.classList.remove("error");
        status.classList.add("success", "is-visible");
      }
      form.reset();
    });
  });

  /* ---------------------------------------------------------------------
   * Footer year
   * ------------------------------------------------------------------- */
  document.querySelectorAll("[data-current-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
