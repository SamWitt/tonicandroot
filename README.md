# Vine & Sunset

Akron's community gathering place for botanical beverages, live music, books, wellness, and meaningful connection.

This repository contains the complete, production-ready marketing website for Vine & Sunset — a nonprofit that operates a botanical elixir bar, non-alcoholic bottle shop, community event space, live music venue, artisan marketplace, book & gift shop, wellness programs, and an onsite naturopathic physician practice.

## Tech approach

This is a static HTML/CSS/JS site — no build step, no framework, no dependencies. It runs anywhere you can serve static files (Netlify, Vercel, GitHub Pages, S3 + CloudFront, a plain Nginx box). Every page shares one design system (`css/style.css`) and one behavior file (`js/main.js`), with semantic HTML5 and progressive enhancement throughout: navigation, forms, and content all work with JavaScript disabled, and JS layers on interactivity (mobile nav, accordions, testimonial carousel, filters, scroll reveals, mock form submissions).

## Getting started

No install required. From the project root, serve the folder with any static file server, for example:

```bash
python3 -m http.server 8000
# or
npx serve .
```

Then open `http://localhost:8000`.

## Project structure

```
/
├── index.html              Homepage
├── about.html               Our story, values, nonprofit status
├── menu.html                 Botanical elixir bar menu
├── events.html                Events calendar + RSVP
├── book-shop.html             Book & gift shop, artisan marketplace
├── bottle-shop.html           Non-alcoholic bottle shop
├── meet-the-doctor.html        Naturopathic physician bio
├── wellness.html               Wellness programs + appointment booking (#book-visit)
├── donate.html                 Donations (Stripe-ready placeholder)
├── volunteer.html              Volunteer roles + application
├── contact.html                Contact form, hours, map placeholder
├── blog.html                    Journal listing
├── blog/                         Individual journal articles
├── faq.html                      Accordion FAQ
├── 404.html                      Custom not-found page
├── css/style.css                 Design system (tokens, components, layout)
├── js/main.js                    Shared behavior (nav, forms, accordion, carousel, reveal)
├── images/                       Photography (see "About the imagery" below)
├── robots.txt
├── sitemap.xml
└── site.webmanifest
```

## About the imagery

No photography assets were provided for this build, so `/images/` is filled with **branded placeholder photography** — SVG illustrations generated in the Vine & Sunset palette (dark teal, terracotta, cream, oak, olive, gold), each labeled with what real photo belongs there and at what pixel dimensions.

**Before launch, replace these with real photography.** Keep the same filenames and aspect ratios (listed in each SVG's label) and everything will drop in cleanly — no HTML/CSS changes needed. A few notes:

- `images/og-default.svg` needs to become a real **1200×630 JPG or PNG**. Most social platforms (Facebook, LinkedIn, Slack) do not render SVG Open Graph images.
- `images/favicon.svg` works in modern browsers, but add `favicon-32.png`, `favicon-16.png`, and `apple-touch-icon.png` for full legacy/device support, and link them in each page's `<head>`.
- Every `<img>` already has descriptive `alt` text and `width`/`height` attributes — keep those in sync with the real photos to avoid layout shift.

## Design system

All design tokens live at the top of `css/style.css` as CSS custom properties:

- **Palette:** dark teal `#0F4C4C`, terracotta `#C96A3D`, warm cream `#F8F3EC`, oak `#A67C52`, olive `#6B7C4B`, muted gold `#C9A24B`
- **Type:** Fraunces (display/headings) + Work Sans (body), loaded via Google Fonts with `font-display: swap`
- **Spacing/radius/shadow scales** are all tokenized — change a value once, it updates everywhere

Reusable components (buttons, cards, hero, forms, accordion, testimonial carousel, filter tabs, banners, footer) are documented inline in `css/style.css` with section comments. Don't invent new one-off classes when adding content — the vocabulary already covers cards, split layouts, stat blocks, badges, and grids.

## Integrations that need wiring before launch

Several features are built as clearly-labeled **placeholders** — the markup, validation, and success-state UI are all in place, they just need a real backend:

| Feature | Where | What to do |
|---|---|---|
| Email signup | `index.html#join` | Point the form at your Mailchimp/ConvertKit endpoint (or swap for their embed) |
| Donations | `donate.html` | Wire the form to a Stripe Checkout Session or Payment Element. **No card fields exist in the placeholder on purpose** — don't add raw card inputs, use Stripe's hosted/Elements flow |
| Appointment scheduling | `wellness.html#book-visit` | Replace with an embed or API integration for Acuity, SimplePractice, or Calendly |
| Event registration | `events.html` | Connect the RSVP form to your registration/ticketing backend |
| Contact form | `contact.html` | Point at your form backend (Formspree, a serverless function, etc.) |
| Volunteer application | `volunteer.html` | Point at your form backend or ATS |
| Google Maps | `contact.html` | Replace the `.map-embed` placeholder `<div>` with a real `<iframe>` from Google Maps → Share → Embed a map |
| Instagram feed | `index.html` (Follow Along section) | Wire up Instagram Basic Display API or an embed tool (SnapWidget, Elfsight, etc.) |
| Social links | footer + `contact.html` | Replace the `href="#"` placeholders with real profile URLs |

All placeholder forms use a shared JS hook — any `<form data-mock-submit data-success-message="...">` is automatically validated and shows a success message via `js/main.js`, with no backend required for local preview.

## SEO & structured data

- Every page has a unique `<title>`, meta description, canonical URL, and Open Graph/Twitter Card tags.
- `schema.org` JSON-LD is included where it matters: `LocalBusiness` (homepage, contact), `Menu`/`MenuItem` (menu), `Event` (events), `Physician` (meet the doctor), `Product`/`ItemList` (bottle shop), `FAQPage` (FAQ), `BlogPosting` (journal articles).
- `robots.txt` and `sitemap.xml` are in the project root — **update the domain** (currently `https://www.vineandsunset.org/`) once a real domain is live.
- `site.webmanifest` covers PWA/home-screen metadata.

## Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `footer`) and exactly one `<h1>` per page.
- Skip-to-content link on every page.
- Full keyboard support: mobile nav, accordion, carousel, and filter tabs are all operable without a mouse, with visible focus states (`:focus-visible`).
- Color choices target WCAG AA contrast; verify final contrast again once real photography is dropped in behind any text overlays.
- `prefers-reduced-motion` is respected — animations and smooth scrolling shut off automatically.
- All form inputs have associated `<label>` elements; decorative icons/images use `aria-hidden` or empty `alt`.

## Performance

- No build tooling, no JS framework, no external runtime dependencies beyond Google Fonts.
- Images use `loading="lazy"` everywhere except the homepage hero (`loading="eager"`) and declare `width`/`height` to prevent layout shift.
- `js/main.js` is a single small vanilla-JS file loaded with `defer`.

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). Uses `IntersectionObserver` (with a graceful fallback that just shows content immediately if unsupported) and standard CSS Grid/Flexbox/custom properties.
