# Tonic & Root

Where Wellness Takes Root.

Tonic & Root is a wellness-focused botanical storefront founded and owned by naturopathic physician **Amelia Love, ND**. It's a branch of [Cadence Holistic](https://www.cadenceholistic.org), a 501(c)(3) nonprofit — the storefront serves as a warm, no-pressure front door to Amelia's naturopathic practice, where visitors can book a free 15-minute consultation.

This repository now ships a **single landing page** (`index.html`) as the live site. It previously held a full multi-page site for a different, earlier concept ("Vine & Sunset") — those pages are still in the repo for reference but are no longer linked from navigation or included in the sitemap. See "About the legacy pages" below.

## Tech approach

Static HTML/CSS/JS — no build step, no framework, no dependencies. Serve the folder with any static file host (Netlify, Vercel, GitHub Pages, S3 + CloudFront, Nginx).

```bash
python3 -m http.server 8000
# or
npx serve .
```

Then open `http://localhost:8000`.

## Design direction

The visual language comes straight from the brand's forest-river banner: **deep forest green, teal river water, warm stone, and cream**, expressed entirely in curves — "no straight lines in nature." That shows up as:

- Pill-shaped buttons everywhere (`--radius-pill`)
- Organic "blob" photo frames using an asymmetric `border-radius` trick (`.blob-media`, `--radius-organic`)
- Curvy wave-shaped SVG dividers between every section (`.wave-divider`) instead of hard section edges
- A brush-script wordmark (Kaushan Script) for the "Tonic & Root" logotype, paired with the rounded sans-serifs Quicksand (headings/UI) and Nunito (body copy)

Design tokens live at the top of `css/tonic-root.css`:

```
--forest-deep #122A22   --water        #2C8577
--forest      #1E4635   --water-deep   #164C44
--forest-mid  #2E5D45   --water-light  #6FBDAC
--moss        #4F7A54   --stone        #A79274
--moss-light  #79A06B   --gold         #D9B26B
--cream       #F6F1E4
```

## About the imagery

`images/tr-*.svg` are branded placeholder illustrations built in the Tonic & Root palette — including a hand-drawn curvy forest/river hero scene standing in for the real banner photography. **Replace these with real photos before launch**, keeping the same filenames and aspect ratios (noted in each SVG's label) so nothing needs to change in the HTML/CSS.

- `tr-hero.svg` → the full-bleed hero background (1920×1080)
- `tr-founder.svg` → Amelia Love's portrait (1000×1250)
- `tr-storefront.svg` → the storefront/space photo (1400×1000)
- `tr-offering-1/2/3.svg` → the three "What You'll Find Here" cards (900×900 each) — currently unused as `<img>` sources (the cards use icons instead) but generated in case you want to add photography there
- `tr-og.svg` → **must become a real 1200×630 JPG/PNG** before launch; most social platforms don't render SVG Open Graph images
- `tr-favicon.svg` → works in modern browsers; add PNG/ICO fallbacks for full legacy support

## Content notes — what's real vs. placeholder

- **Cadence Holistic link** (`https://www.cadenceholistic.org`) is real and used throughout as the booking/learn-more destination, opening in a new tab with `rel="noopener noreferrer"`.
- **No physical address, phone number, or hours are shown**, by design — the page intentionally routes all contact and booking through Cadence Holistic rather than guessing at real-world details.
- **Social links** in the footer are placeholder `href="#"` — replace with real profile URLs once they exist.
- Copy throughout (bio details, offerings, etc.) is a reasonable first draft — review it against how Amelia and Cadence Holistic actually want the story told before publishing.

## SEO & structured data

- Single-page metadata: unique title, description, canonical (`https://www.tonicandroot.org/`), Open Graph/Twitter tags.
- `schema.org` `Organization` JSON-LD includes `founder` (Amelia Love) and `parentOrganization` (Cadence Holistic, linked via `sameAs`) — deliberately omits `address`/`telephone` since none is published on the page.
- `sitemap.xml` lists only the homepage. `robots.txt` explicitly disallows the legacy pages (see below) so they don't get indexed even though the files still exist.
- Update the domain (currently `https://www.tonicandroot.org/`) if it changes.

## Accessibility

- Semantic landmarks, one `<h1>` (the "Tonic & Root" hero wordmark), skip-to-content link.
- Full keyboard support for the mobile nav; visible `:focus-visible` outlines.
- External links to Cadence Holistic include a visually-hidden "(opens in a new tab)" cue for screen reader users, plus an inline icon for sighted users.
- `prefers-reduced-motion` disables the wave/reveal animations and smooth scrolling.

## About the legacy pages

`about.html`, `menu.html`, `events.html`, `book-shop.html`, `bottle-shop.html`, `meet-the-doctor.html`, `wellness.html`, `donate.html`, `volunteer.html`, `contact.html`, `blog.html`, `blog/`, and `faq.html` are all left over from an earlier, different concept for this business (a full bar/event-venue/bookshop nonprofit called "Vine & Sunset"). They:

- Are **not linked** from the new landing page's navigation or footer
- Are **excluded** from `sitemap.xml` and disallowed in `robots.txt`
- Still reference the old design system (`css/style.css`, `js/main.js`) and old branding, which remain in the repo untouched so those pages don't break if opened directly
- Can be deleted whenever you're confident you won't need them for reference — full history is preserved in git regardless

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). Uses `IntersectionObserver` (with a graceful fallback) and standard CSS Grid/Flexbox/custom properties.
