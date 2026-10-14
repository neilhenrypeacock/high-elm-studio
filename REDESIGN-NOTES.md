# Redesign — build notes and launch checklist

The full rebuild from `design_handoff_high_elm_site`. All six pages are
built, plus redirects, a 404, a sitemap and robots.txt.

**Nothing is live yet.** highelmstudio.com is a GitHub Pages site served
straight from `main` in `neilhenrypeacock/high-elm-studio` — no build step,
no deploy workflow, so whatever is on `main` *is* the site. This work is on a
branch and has not been pushed.

---

## Before it goes live

Four things, and three of them only you can do.

1. **Point the forms somewhere.** `ENDPOINT` at the top of
   `assets/js/lead.js` is empty. Set it to a form backend that accepts a JSON
   POST — Formspree (`https://formspree.io/f/xxxxxxxx`) is about five minutes
   — and both the homepage forms and the Contact form send for real.
   Until then nothing is silently dropped: the form opens a pre-filled email
   to neil@highelmstudio.com and the page says so, rather than claiming the
   message was sent. It works, but it leans on the visitor to press send.
2. **Add the poster stills.** Fourteen are referenced, none exist yet. Drop
   them in `assets/posters/` with these exact names and they appear with no
   code change. Until then each card shows a labelled "Drop still" panel.
   `get-lost.jpg` · `norway.jpg` · `spain.jpg` · `gabor-mate.jpg` ·
   `convento-de-cristo.jpg` · `bazaruto.jpg` · `okavango.jpg` ·
   `athena-c2p.jpg` · `athena-c0g.jpg` · `athena-c0r.jpg` ·
   `athena-czg.jpg` · `athena-cvh.jpg` · `athena-c0t.jpg` · `athena-cyq.jpg`
   (Home and Work share these, so one still covers both pages.)
3. **Add the missing video IDs, and the rest of the films.** Seven of the
   fourteen pieces on Work have no video and are stills only: all three Black
   Tomato films, both Harvest Series reels and both Safari Edit reels. On the
   homepage, Get Lost and Norway open the lightbox and say the embed loads
   once the ID is added. Add `id:` (Vimeo), `yt:` (YouTube) or a fourth array
   item (Instagram) in the data blocks at the top of `assets/js/home.js` and
   `assets/js/work.js`. The handoff also says you have more videos to add.
4. **Have the legal copy reviewed.** `legal/index.html` is the handoff copy,
   unchanged. I am not the right reader for it.

## Deploying

Merge the branch to `main` and GitHub Pages publishes it. There is nothing to
build. Leave `CNAME` and DNS alone.

Worth knowing: every internal link now resolves. I crawled every page and
every referenced asset against a local server — 30 unique references, zero
broken, and `/nope-does-not-exist` correctly returns the new 404.

---

## What is built

| File | What it is |
|---|---|
| `index.html` | Home |
| `work/index.html` | Work library |
| `services/index.html` | Services |
| `story/index.html` | Story |
| `contact/index.html` | Contact (`#audit` opens the audit request) |
| `legal/index.html` | Privacy, cookies and terms |
| `404.html` | Not found |
| `assets/css/site.css` | Tokens, type, buttons, reveals, poster slot, footer. Shared. |
| `assets/js/site-chrome.js` | `<hes-menu>` and `<hes-cursor>`. Shared. |
| `assets/js/lead.js` | Where enquiries go. Shared by Home and Contact. |
| `assets/css/*.css`, `assets/js/*.js` | One pair per page |
| `sitemap.xml`, `robots.txt` | Both list the six live URLs |

Redirect stubs (canonical + meta refresh + JS, since Pages cannot do a real
301): `privacy.html` → `/legal/#privacy`, `cookies.html` → `/legal/#cookies`,
`terms.html` → `/legal/#terms`, `services.html` and `how-it-works.html` →
`/services/`, `thinking.html` → `/`.

Breakpoint: **820px** splits the pinned, scroll-linked sections from the
stacked mobile versions. 600px is the phone step.

---

## Decisions worth a look

- **The hero intro is now the `<h1>`.** In the prototype the leaf, wordmark
  and "Stories and systems for luxury travel brands" sit in a splash layer
  that never leaves, while a separate `<h1>` ("Content and systems for luxury
  brands.") stays permanently invisible behind it. Rather than ship a hidden
  headline contradicting the visible one, the visible line is the `<h1>`.
  Nothing on screen changed.
- **Services tally figures corrected** (your note). They were 1,240 reached →
  186 enquired (15.0%) → 41 booked (22.0%) → 29 returned (70.7% of bookers).
  A 15% enquiry rate and a 71% return rate are not credible. Now
  **12,400 → 310 → 78 → 17**: 2.5% enquiring, 25% of those booking, 22%
  coming back. Enquiry-to-booking at 25% is the flattering number and the one
  that stands up. They live in `TALLY` at the top of `assets/js/services.js`
  and are still labelled "Illustrative".
- **Three sections degrade without JavaScript.** On Services every line of
  the journey was `opacity:0` in CSS and only revealed by the animation loop,
  so a JS failure left the section blank — and its four caption blocks are
  stacked in one 300px box, so simply showing them would overlap them. Story's
  six stops sat at 25% opacity for the same reason. Both now sit behind a `js`
  class on `<html>`: with JS the design is unchanged, without it the copy
  reads normally.
- **Three mobile fixes the prototype did not make.** Story's route line
  indented 96px, leaving 239px of text on a 375px phone (now 44px / 307px).
  Work's vertical reels fell to one per screen at 375px, a 327×581 card (now
  two-up at 152×269). Services used a fixed 40px side padding where the rest
  of the site uses 24px on phones. Desktop is unchanged in all three.
- **Work's non-playable pieces are not buttons.** Seven of the fourteen have
  no video. In the prototype every piece is a `<button>` with a no-op click,
  which announces a control that does nothing. Those are now plain figures;
  only the seven that play are buttons.
- **"Read the case study" points at `/work/hotel-content-radar/`**, the page
  already in this repo, rather than back out to hotelcontentradar.com.
- **Contact's mode switch is a radio group**, not the prototype's
  `role="tab"` without tab panels, which is not valid ARIA. Arrow keys move
  between the two options.
- **Some handoff copy is unused.** Each journey service on Services carries a
  one-line description in the prototype data (for example "AI concierge —
  Answers at any hour, in any language, and passes warm enquiries to your
  team"), but the design only ever shows the names joined by dots. I kept to
  what the design shows. The descriptions are good; say if you want them in.
- **The two Thinking articles are now orphaned.** The handoff says to redirect
  `/thinking.html`, which I have done, but `thinking/concierge-problem.html`
  and `thinking/luxury-websites-art-galleries.html` are real articles with no
  entry point in the new site. I have left them in place rather than bin them.
  They need a home, a redirect, or a decision.
- **`chat.html` is untouched.** The old AI concierge demo, not linked from the
  new site. Its EmailJS keys are still placeholders, so its form sends
  nothing. Worth deciding whether it stays.

## Not verified

The browser available to me runs hidden, so `requestAnimationFrame` never
fires and Vimeo is blocked. I verified layout, geometry and behaviour by
reading computed styles and driving the scroll logic directly — the numbers
all check out — but **I have never seen these move**: the homepage hero film
and dot-field canvas, the Services journey, and Story's stops rising in.
Please scroll through all six pages once before merging.
