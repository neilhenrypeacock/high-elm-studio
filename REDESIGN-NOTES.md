# Redesign build notes

Working notes for the site rebuild from `design_handoff_high_elm_site`.
Step 1 (shared CSS + chrome) and step 2 (Home) are done. Everything below is
either a decision that needs your eye, or a placeholder waiting on an asset.

## What is built

| File | What it is |
|---|---|
| `index.html` | Home |
| `assets/css/site.css` | Tokens, type, buttons, reveals, footer. Shared by every page. |
| `assets/css/home.css` | Home only |
| `assets/js/site-chrome.js` | `<hes-menu>` and `<hes-cursor>`. Shared by every page. |
| `assets/js/home.js` | Home only. Content data is at the top of the file. |

Breakpoint: **820px** splits the pinned, scroll-linked sections from the
stacked mobile versions. 600px is the phone step (padding and grid counts).

## Placeholders

1. **Poster stills.** The eight Selected work cards look for
   `/assets/posters/<name>.jpg` and show a labelled "Drop still" panel until
   the file exists. Drop the images in with these exact names and they appear,
   no code change: `get-lost.jpg`, `norway.jpg`, `gabor-mate.jpg`,
   `convento-de-cristo.jpg`, `bazaruto.jpg`, `okavango.jpg`, `athena-c0t.jpg`,
   `athena-cyq.jpg`.
2. **Two films have no video ID.** Get Lost and Norway open the lightbox and
   show "The Vimeo embed loads here once this film's ID is added." Add `id:`
   to those entries in `videos` in `assets/js/home.js`.
3. **Pages not built yet.** Home links to `/work/`, `/services/`, `/story/`,
   `/contact/` and `/legal/`. Those are the final URLs from the handoff and
   they 404 until each page is built. Nothing to fix now, but do not deploy
   Home on its own.
4. **Forms are not wired.** Both Start here forms validate and show the
   thank-you state, but send nothing. `submitLead()` in `assets/js/home.js` is
   the single place to add Formspree / Netlify Forms / Resend.
5. **Three brands have no links.** Wavelength Drive-In, Odisi and JIA have no
   website or Instagram in `logoLinks`, so their cards show no link row.

## Decisions worth a look

- **The hero intro is now the `<h1>`.** In the prototype the leaf, wordmark and
  "Stories and systems for luxury travel brands" sit in a splash layer that
  never leaves, while a separate `<h1>` ("Content and systems for luxury
  brands.") stays permanently invisible behind it. Rather than ship a hidden
  headline that contradicts the visible one, the visible line is the `<h1>`.
  Nothing on screen changed. Say the word if you want the other wording.
- **"Read the case study" now points at `/work/hotel-content-radar/`**, the
  page already in this repo, rather than back out to hotelcontentradar.com.
- **The menu's pre-scroll hide** keyed off the filename `Home v7.dc.html`. It
  now keys off the path, so it works at `/` and `/index.html`.
- **Brand tiles are real disclosure buttons** (`role="button"`,
  `aria-expanded`, Enter/Space/Escape), and closed cards are `inert` so their
  Website and Instagram links stay out of the tab order.
- **Services tally figures corrected** (your note). They were
  1,240 reached → 186 enquired (15.0%) → 41 booked (22.0%) → 29 returned
  (70.7% of bookers). An enquiry rate of 15% and a 71% return rate are not
  credible. Now **12,400 → 310 → 78 → 17**: a 2.5% enquiry rate, 25% of
  enquiries booking, and 22% of bookers returning. Enquiry-to-booking at 25%
  is the flattering number, and it is the one that stands up. The figures are
  hardcoded in `Services.dc.html:157` and still labelled "Illustrative";
  they carry over when Services is built. Tell me if you want them framed
  differently.

## Still to do, from the handoff

1. Have the legal copy reviewed.
2. Add the missing work videos and poster stills.
3. Connect the Contact and Free audit forms.
4. 301 redirects from `/privacy`, `/cookies`, `/terms` and `/thinking.html`.
5. The old pages (`services.html`, `how-it-works.html`, `thinking.html`,
   `chat.html`, `privacy.html`, `cookies.html`, `terms.html`) are still in the
   repo, untouched. They get replaced or redirected as each new page lands.
