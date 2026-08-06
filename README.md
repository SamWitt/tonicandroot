# Tonic & Root

Where Wellness Takes Root.

Tonic & Root is a wellness-focused botanical pop-up founded and owned by naturopathic physician **Amelia Love, ND**. It's a branch of [Cadence Holistic](https://www.cadenceholistic.org), a 501(c)(3) nonprofit — the pop-up serves as a warm, no-pressure front door to Amelia's naturopathic practice, where visitors can book a consultation.

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

`images/tr-*.svg` are branded placeholder illustrations built in the Tonic & Root palette. Two of the original slots now have real photography (see below); the rest are still placeholders. **Replace the remaining ones with real photos before launch**, keeping the same filenames and aspect ratios (noted in each SVG's label) so nothing needs to change in the HTML/CSS.

- `tr-hero.svg` → the full-bleed hero background (1920×1080) — **still a placeholder**
- ~~`tr-founder.svg`~~ → replaced by `images/amy.jpg` (Amelia's real photo)
- ~~`tr-storefront.svg`~~ → replaced by `images/storefront.jpg` (a real photo of the team at a pop-up)
- `tr-offering-1/2/3.svg` → the three "What You'll Find Here" cards (900×900 each) — currently unused as `<img>` sources (the cards use icons instead) but generated in case you want to add photography there — **still placeholders**
- `tr-og.svg` → **must become a real 1200×630 JPG/PNG** before launch; most social platforms don't render SVG Open Graph images — **still a placeholder**
- `tr-favicon.svg` → works in modern browsers; add PNG/ICO fallbacks for full legacy support

## Content notes — what's real vs. placeholder

- **Cadence Holistic link** (`https://www.cadenceholistic.org`) is real, used for "Learn More" and the footer's nonprofit mention. **Booking CTAs** ("Book a Consultation") link to the real Calendly instead: `https://calendly.com/cadenceholistic`. All external links open in a new tab with `rel="noopener noreferrer"`.
- **No physical address, phone number, or hours are shown**, by design — the page intentionally routes all contact and booking through Cadence Holistic/Calendly rather than guessing at real-world details.
- **Social links**: Instagram is real (`https://www.instagram.com/tonicandrootwellness/`). Facebook was removed by request — add it back with a real URL whenever there is one.
- Copy throughout (bio details, offerings, etc.) is a reasonable first draft — review it against how Amelia and Cadence Holistic actually want the story told before publishing.
- **Amelia's photo is in place**: `images/Amy.png` is the original upload (3.2MB, kept as the source file); `images/amy.jpg` is a web-optimized derivative (resized to a 1400px long edge, JPEG quality 85, ~124KB) that `index.html` actually references.
- **The pop-up photo is in place** (filenames kept as `storefront.*`, matching what was uploaded — the site copy itself no longer says "storefront"): `images/storefront.jpeg` is the original upload (807KB, kept as the source file); `images/storefront.jpg` is the web-optimized derivative (1050×1400, JPEG quality 85, ~344KB) that `index.html` references.
- If either photo is ever replaced, regenerate its optimized derivative the same way (resize to a ~1400px long edge, re-encode as progressive JPEG quality 85) — full-resolution originals shouldn't be served directly on a page people are meant to load quickly.
- **Both photo frames keep the organic blob-morph hover effect** (`.blob-media`, no `.alt` modifier — see "The Meet Amelia scroll effect" below and `css/tonic-root.css`). Don't add the `.alt` class to either frame's wrapper `<div>`, or the resting shape and the `:hover` shape will resolve to the same value and the hover animation will silently do nothing (this happened once already — see git history).

## The "Meet Amelia" scroll effect

Amy's photo (`.amy-portrait` in `index.html`, styled in `css/tonic-root.css`, driven by `js/tonic-root.js`) fades in and out based on a scroll-progress value: how close that block is to the vertical center of the viewport (1 = dead center, 0 = far away in either direction).

- **Respects `prefers-reduced-motion`**: the scroll-linked fade is skipped entirely and the photo simply renders fully visible, static.
- **No-JS fallback**: same static, fully-visible state, since the CSS default (`opacity: 1`) is the baseline and JS only overrides it when it runs.
- Tune the feel by editing `range` in `js/tonic-root.js` (how much scroll distance the fade spans).

(An earlier version of this also grew a hand-drawn SVG tree behind the photo in sync with the same scroll value — removed by request, but the scroll-progress engine above is general enough to drive something like that again if wanted.)

## SEO & structured data

- Single-page metadata: unique title, description, canonical (`https://www.tonicandroot.org/`), Open Graph/Twitter tags.
- `schema.org` `Organization` JSON-LD includes `founder` (Amelia Love) and `parentOrganization` (Cadence Holistic, linked via `sameAs`) — deliberately omits `address`/`telephone` since none is published on the page.
- `sitemap.xml` lists only the homepage. `robots.txt` explicitly disallows the legacy pages (see below) so they don't get indexed even though the files still exist.
- Update the domain (currently `https://www.tonicandroot.org/`) if it changes.

## Newsletter signup

The "Stay Rooted" section on the homepage (`#newsletter`) collects emails with no backend of its own — like the rest of the site, it's static. It submits to a Google Sheet through a free Google Apps Script Web App, and screens out bots client-side before anything is sent:

- **Honeypot** — a `company` field hidden off-canvas (`.hp-field` in `css/tonic-root.css`). Real visitors never see or focus it (it's also `aria-hidden`/`tabindex="-1"`, so screen readers and keyboard nav skip it too); bots that blindly fill every field trip it and the submit is silently dropped.
- **Time-trap** — a submit within 1.5s of the form rendering is treated as a bot, not a fast typist.

Both cases return the same success message as a real signup, so scripted bots don't get a signal to adapt to.

**Setup (one-time):**
1. Create a Google Sheet (or reuse one) with a tab named `Signups`, columns `Timestamp` and `Email`.
2. In that sheet, open **Extensions → Apps Script**, delete the boilerplate, and paste in `google-apps-script/newsletter-signup.gs` from this repo.
3. **Deploy → New deployment** → type **Web app** → Execute as **Me**, Who has access **Anyone**. Deploy and copy the `/exec` URL.
4. In `js/tonic-root.js`, replace `NEWSLETTER_SHEET_ENDPOINT`'s placeholder value with that URL.
5. Submit the form once yourself to confirm a row lands in the sheet, then check spam-filtering by leaving the honeypot alone (normal use already skips it — the field's just there for bots).

Until step 4 is done, the form shows "Signup isn't connected yet" instead of failing silently.

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
