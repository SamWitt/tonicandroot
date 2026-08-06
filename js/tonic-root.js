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

  /* -----------------------------------------------------------------------
   * Newsletter signup: submits to a Google Sheet via a Google Apps Script
   * Web App. Two bot defenses run entirely client-side, before any network
   * request is made:
   *   - Honeypot: #newsletter-company is off-canvas CSS, invisible to real
   *     visitors. Bots that fill every field trip it.
   *   - Time-trap: no human reads the copy and fills an email field in
   *     under 1.5s of the form appearing.
   * Both cases fail "successfully" (no error shown) so bots don't learn
   * they were caught, and no request is sent for them.
   *
   * SETUP: replace NEWSLETTER_SHEET_ENDPOINT below with your deployed
   * Apps Script Web App URL. See README.md "Newsletter signup" for the
   * step-by-step (create the sheet, paste the Apps Script, deploy, copy
   * the /exec URL here). Until it's set, the form shows a friendly
   * "not connected yet" message instead of silently failing.
   * --------------------------------------------------------------------- */
  var NEWSLETTER_SHEET_ENDPOINT = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

  var newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    var formRenderedAt = Date.now();
    var newsletterEmail = document.getElementById("newsletter-email");
    var newsletterHoneypot = document.getElementById("newsletter-company");
    var newsletterSubmit = newsletterForm.querySelector("button[type=submit]");
    var newsletterStatus = document.getElementById("newsletter-status");
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var showNewsletterStatus = function (message, isError) {
      if (!newsletterStatus) return;
      newsletterStatus.textContent = message;
      newsletterStatus.classList.toggle("is-error", !!isError);
    };

    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot tripped — pretend success, send nothing.
      if (newsletterHoneypot && newsletterHoneypot.value) {
        showNewsletterStatus("You're on the list! 🌿", false);
        newsletterForm.reset();
        return;
      }

      // Submitted too fast to be human — pretend success, send nothing.
      if (Date.now() - formRenderedAt < 1500) {
        showNewsletterStatus("You're on the list! 🌿", false);
        newsletterForm.reset();
        return;
      }

      var email = newsletterEmail ? newsletterEmail.value.trim() : "";
      if (!email || !emailPattern.test(email)) {
        showNewsletterStatus("Please enter a valid email address.", true);
        return;
      }

      if (NEWSLETTER_SHEET_ENDPOINT.indexOf("PASTE_") === 0) {
        showNewsletterStatus("Signup isn't connected yet — check back soon.", true);
        return;
      }

      if (newsletterSubmit) newsletterSubmit.disabled = true;
      showNewsletterStatus("Signing you up…", false);

      fetch(NEWSLETTER_SHEET_ENDPOINT, {
        method: "POST",
        // text/plain avoids a CORS preflight (Apps Script Web Apps don't
        // handle OPTIONS); the Apps Script side does JSON.parse(e.postData.contents).
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ email: email })
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          if (data && data.ok) {
            showNewsletterStatus("You're on the list! 🌿", false);
            newsletterForm.reset();
          } else {
            showNewsletterStatus(
              data && data.error === "invalid_email"
                ? "Please enter a valid email address."
                : "Something went wrong. Please try again.",
              true
            );
          }
        })
        .catch(function () {
          // Apps Script's response can come back opaque to fetch() in some
          // browsers even when the row was written successfully, so we fail
          // optimistically rather than tell a signed-up visitor it broke.
          showNewsletterStatus("You're on the list! 🌿", false);
          newsletterForm.reset();
        })
        .then(function () {
          if (newsletterSubmit) newsletterSubmit.disabled = false;
        });
    });
  }
})();
