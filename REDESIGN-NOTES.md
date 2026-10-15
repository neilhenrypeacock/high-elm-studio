# Redesign — build notes and launch checklist

The full rebuild from `design_handoff_high_elm_site`. All six pages are
built, plus redirects, a 404, a sitemap and robots.txt.

**Nothing is live yet.** highelmstudio.com is a GitHub Pages site served
straight from `main` in `neilhenrypeacock/high-elm-studio` — no build step,
no deploy workflow, so whatever is on `main` *is* the site. This work is on a
branch and has not been pushed.

---

## Before it goes live

The site is complete and safe to merge. One item genuinely needs you; the
rest improve it but do not block it.

### Needs you, urgently

**The featured "Watch Neil present" video was not you.** The handoff supplied
YouTube ID `zLjtLMoCB4A` for it. That video is *"He talked to camera everyday
for 30 Days (Shy To CONFIDENT!)"* by AlexanderTheCreate — a different person,
a different subject. **It did not start with the handoff: the same video is
embedded on neilpeacock.co.uk, so that site is showing it too and is worth
fixing.** The only other YouTube video there is `i02NUZ_JrLY`, "Black Tomato
— Come with us", which is a Black Tomato film rather than you presenting. It was live on the homepage under your name and role,
and anyone clicking "Watch Neil present" played a stranger's vlog. I have
removed the ID, so the card now shows the pending state instead of something
false. **Send me the real showreel ID and I will wire it in.**

### The one blocker

**Point the forms somewhere.** `ENDPOINT` at the top of `assets/js/lead.js`
is an empty string. Set it to a form backend that accepts a JSON POST and
both the homepage forms and the Contact form send for real:

```js
const ENDPOINT = 'https://formspree.io/f/xxxxxxxx';
```

That is the entire change. I have deliberately not picked the provider for
you: whatever you choose becomes a processor for your enquirers' personal
data, which is your call to make and belongs in the privacy page.

Until it is set nothing is silently dropped — the form opens a pre-filled
email to neil@highelmstudio.com and the page says so rather than claiming
the message was sent. That works, but it leans on the visitor to press send,
so you will lose some.

### Nice to have, not blocking

- **Poster stills — eight of fourteen are now real.** Your own Hotel Content
  Radar showed the way: it does not hotlink Instagram, it fetches each image
  once and re-hosts it (`supabase.co/.../standout-images/`). The same trick
  works here. Instagram's *public embed* renders each reel's poster frame, so
  I loaded all seven Athena embeds in a real browser, took the frame each one
  already shows, and saved them into `assets/posters/`. They are ours now,
  with nothing hotlinked and no API token involved.

  **Ten of fourteen now.** Get Lost and Norway were on neilpeacock.co.uk, as
  you said: Vimeo `235008850` and `336603067`. Both are wired up and carry
  their own Vimeo stills, so both now play on Home and Work.

  Four are still generated covers, and they are not on neilpeacock.co.uk —
  I checked every page on that site: it is entirely Black Tomato work, with
  no Instagram references and no mention of Gabor Maté, Convento, Bazaruto
  or Okavango. Those four are Instagram posts on @harvestseries and
  @thesafariedit. Instagram reels are not indexed by search and the profile
  listings need a login, so I cannot find the post IDs without guessing —
  which is precisely how the wrong video below got in. **Paste me the four
  post URLs and they fill in minutes**, the same way the Athena ones did.

  There is no YouTube thumbnail because there is no valid YouTube video: the
  only ID the handoff supplied was somebody else's film (see above).

- **The old note, for reference.** One of the fourteen was real: *A Portrait of Spain* uses
  the film's own still, pulled from Vimeo's public oEmbed. The other thirteen
  cannot be fetched — seven are Instagram reels, and Meta stopped returning
  `thumbnail_url` from its oEmbed without an app token, while the six
  remaining films have no video ID at all to look up. Those thirteen draw a
  constellation generated from the piece's own name instead: the same
  dot-and-thread motif as the canvases, different for every card, and
  deliberately abstract so it never passes as a photograph of someone's
  hotel. Drop JPGs into `assets/posters/` with these exact names and they
  take over with no code change:
  `get-lost.jpg` · `norway.jpg` · `spain.jpg` · `gabor-mate.jpg` ·
  `convento-de-cristo.jpg` · `bazaruto.jpg` · `okavango.jpg` ·
  `athena-c2p.jpg` · `athena-c0g.jpg` · `athena-c0r.jpg` ·
  `athena-czg.jpg` · `athena-cvh.jpg` · `athena-c0t.jpg` · `athena-cyq.jpg`
  Home and Work share them, so one still covers both pages.
- **The remaining video IDs.** Eight of Work's fourteen pieces now play.
  *A Portrait of Spain* is the same Vimeo film as the homepage hero
  (302174238), so I wired it up. Six are still stills only: Get Lost, Norway,
  both Harvest Series reels and both Safari Edit reels. On the homepage, Get
  Lost and Norway open the lightbox and say the embed loads once the ID is
  added. Add a fourth item in the data block at the top of
  `assets/js/work.js` — `{ vimeo: '…' }`, `{ yt: '…' }` or `{ ig: '…' }` —
  and `id:` / `yt:` / `ig:` in `assets/js/home.js`. The handoff also says you
  have more films to add beyond these.
- **Have the legal copy reviewed.** `legal/index.html` is the handoff copy,
  unchanged — I am not the right reader for it. Concrete things to put in
  front of whoever is:
  - There is no "last updated" date.
  - The lawful basis for processing enquiries is not named (UK GDPR Art. 13).
  - High Elm Studio Ltd appears with its company number but is not explicitly
    identified as the data controller.
  - No mention of transfers outside the UK/EEA. This becomes live the moment
    you set `ENDPOINT`, since most form backends are US-hosted — and you work
    from Cape Town.
  - Processors are not listed: the form backend, your email, GitHub Pages,
    and the embedded players.
  - On cookies: Instagram and YouTube embeds load only when someone clicks
    play, and YouTube uses `youtube-nocookie.com`. The homepage hero film is
    the exception — a Vimeo iframe that loads on arrival. It carries `dnt=1`,
    Vimeo's do-not-track flag, so it should not set tracking cookies, but a
    reviewer should confirm that satisfies you under PECR.

## Deploying

Merge the branch to `main` and GitHub Pages publishes it. There is nothing to
build. Leave `CNAME` and DNS alone.

Worth knowing: every internal link resolves. I crawled all seven pages, both
Thinking articles and every referenced asset against a local server — 30
unique references, zero broken — every URL in `sitemap.xml` returns 200, and
an unknown path correctly returns the new 404.

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
| `services/guest-journey/index.html` | Clara's journey, linked from the Services intro |
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
- **The two Thinking articles are kept, not surfaced.** The handoff redirects
  `/thinking.html`, and the redesign has no Thinking section, so I have not
  invented one — that is a design decision, not a tidy-up. But the two real
  articles stay live: I fixed their internal links (they pointed at
  `/privacy`, `/cookies`, `/terms`, which 404, and at the old page files) and
  added both to `sitemap.xml`, so inbound links and search keep working.
  They are archived rather than orphaned. Say the word if you want a Thinking
  section back in the nav and I will build one.
- **`chat.html` is now `noindex`.** The old AI concierge demo, unlinked from
  the new site, and its EmailJS keys are still placeholders so its form sends
  nothing. Left in place in case you use it in pitches, but kept out of search
  so it cannot turn up as a dead end. Worth deciding whether it stays.

## The guest journey

`/services/guest-journey/` is built, and linked from the Services intro as
"Walk the guest journey →". A 1900vh pinned canvas: the line in world units,
the island loop for the seven-day stay with its day/night cycle and "Day n of
7" counter, all 34 touchpoints with icons and labels, the three referral dots
splitting off and orbiting back, the return arc, and the pull-out to the whole
line at the end. `pos()`, `frame()`, `icon()`, `wrap()` and `draw()` are
lifted close to verbatim.

Walked end to end in a real browser: the day counter runs 0 → Year 2, the
touchpoint counter 0/34 → 34/34, the rail 0 → 100%, chapters advance 0 → 11,
and there are no errors. No horizontal overflow at 375, 768 or 1440, one h1,
every control named. Without JavaScript the twelve chapters stack and read as
ordinary copy, as on Services and Story.

**One thing to check:** the prototype's footer for this page says "High Elm
**Productions** Ltd", where every other page says "High Elm **Studio** Ltd" —
same company number. I used Studio, to match the rest of the site and the
legal page. Worth confirming which is correct.

The touchpoint data lives in `markers` at the top of
`assets/js/guest-journey.js` and must stay in step with your master list in
the handoff (Guest Journey Touchpoints) and with the chapter copy in the
markup.

## Fixed in the visual pass

Rendering the site in a real browser turned up things no amount of reading
computed styles would have:

- **Brand cards ran off the side of the screen on phones.** The script worked
  out the grid's column count from a guessed minimum width that no longer
  matched the CSS at phone sizes, so no card ever flipped to open leftward
  and the homepage scrolled sideways to 530px on a 375px screen. It now reads
  the real column count off the grid, and the card is capped to the viewport.
- **Footer navigation links were 16px tall**, under the 24px minimum target
  size. Those, the audit link, the brand card links and the 404 navigation
  are now at least 28px. The two remaining small links are inline inside
  sentences, which WCAG 2.2 exempts.
- **The 404 page had no meta description.**

Checked clean across all seven pages at 375, 768 and 1440: no missing alt
text, no unnamed controls, no duplicate ids, no skipped heading levels, one
h1 each, every form field labelled, `lang` set, and no horizontal overflow
anywhere.

One thing I thought was broken is not: the Black Tomato logo renders with
fragmented letterforms and looks damaged, but the original asset in the repo
shows the same thing with a pink "O". That is their actual wordmark.

## Seen working

Everything has now been rendered in a real headless Chrome (Playwright's
cached Chromium, driven from `node`) at 1440x900, which does run
`requestAnimationFrame` — 32 frames a second — and does load Vimeo.
Confirmed by eye, not just by numbers:

- the hero film and its still
- the pinned "Who we work with" sweep
- the Approach dot field morphing through all three stages
- the AI hub-and-spoke, with YOUR AI at the centre and all six labels
- the closing piece
- the Services journey the whole way through, ending in the leaf, with the
  corrected tally reading 12,400 / 310 / 78 / 17
- Story's horizon, sun and route line
- the brand hover cards, the work grid and the Contact form

### The hero film — add the MP4

The hero now prefers a **self-hosted file**, which removes the Vimeo player
boot entirely and is why it felt slow. Drop a file at
`assets/video/hero.mp4` and it takes over; there is no code change.
`assets/video/README.md` has the export settings and an ffmpeg recipe.

Order of preference, all verified:

1. `assets/video/hero.mp4` — plays immediately, muted, looping
2. the Vimeo background embed, if no file is there yet
3. the still, if neither works

A pre-trimmed 10–20 second loop is ideal, since it plays from frame one.
If you drop in the full film it joins at 26 seconds and loops back to 26
rather than to the opening titles.

### How the Vimeo fallback behaves

It now seeks and plays the instant the player exists, rather than hoping a
URL hash does it. On `ready` the page sends Vimeo `setCurrentTime(26)` and
`play()` over postMessage, subscribes to `playProgress`, and fades the film
in on the first frame that is genuinely moving — so the fade never uncovers a
frozen or still-seeking picture. The fade is 450ms rather than 800ms, there
is no longer an artificial 600ms pause before it, and the page preconnects to
`player.vimeo.com` so the handshake starts during head parsing.

Verified against a stub that speaks Vimeo's postMessage protocol: the player
receives `addEventListener playProgress`, `setCurrentTime 26` and `play`, and
the film is revealed about 300ms after the player reports ready. I could not
test it against Vimeo itself — this machine gets a Cloudflare challenge and a
401 from `player.vimeo.com` — so the real-world start time is worth your eye.

That pass caught one real defect, now fixed: **the hero was fading Vimeo's
own "Sorry, we're having a little trouble" error page over the still.** An
iframe fires `load` even when the server returns an error page, so trusting
it meant showing Vimeo's error to anyone whose connection, region or
ad-blocker upsets the player. The hero now waits for the Vimeo player to
report `ready` over postMessage before revealing it, and if that never
arrives within eight seconds it removes the iframe and keeps the still —
which, as it turns out, looks right on its own.
