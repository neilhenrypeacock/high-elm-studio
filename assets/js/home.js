/* High Elm Studio — home.
   Scroll-linked canvas field, pinned sections, work grid, brand cards,
   lightbox and the two Start here forms.

   Content lives in the DATA block below. It is meant to be edited by hand. */
(function () {
  'use strict';

  /* ======================================================================
     DATA
     ====================================================================== */

  // Selected work. `poster` is a filename in /assets/posters/.
  // Add `id` for Vimeo, `yt` for YouTube, `ig` for an Instagram reel.
  const videos = [
    { title: 'Get Lost', client: 'Black Tomato. Award-winning campaign', platform: 'vimeo', shape: 'landscape', poster: 'get-lost.jpg' },
    { title: 'Norway: Life at the edge of the world', client: 'Black Tomato. Destination film', platform: 'vimeo', shape: 'landscape', poster: 'norway.jpg' },
    { title: 'Gabor Maté on trauma', client: 'Harvest Series. 18K likes', platform: 'instagram', shape: 'vertical', poster: 'gabor-mate.jpg' },
    { title: 'Convento de Cristo', client: 'Harvest Series. Autumn Equinox gathering', platform: 'instagram', shape: 'vertical', poster: 'convento-de-cristo.jpg' },
    { title: 'Bazaruto Archipelago', client: 'The Safari Edit', platform: 'instagram', shape: 'vertical', poster: 'bazaruto.jpg' },
    { title: 'Okavango Delta', client: 'The Safari Edit', platform: 'instagram', shape: 'vertical', poster: 'okavango.jpg' },
    { title: 'Athena Advisers', client: 'Athena Advisers. Premium real estate', platform: 'instagram', shape: 'vertical', poster: 'athena-c0t.jpg', ig: 'C0T-NvdqhiY' },
    { title: 'Athena Advisers', client: 'Athena Advisers. Premium real estate', platform: 'instagram', shape: 'vertical', poster: 'athena-cyq.jpg', ig: 'CyQlAxAKwzK' }
  ];

  const hero = { title: 'A Portrait of Spain', client: 'Black Tomato', platform: 'vimeo', id: '302174238', shape: 'landscape' };
  // The handoff supplied yt:'zLjtLMoCB4A' for this, but that ID belongs to
  // "He talked to camera everyday for 30 Days" by AlexanderTheCreate — a
  // different person entirely. Rather than play a stranger's video under
  // "Watch Neil present", the card shows the pending state until the real
  // showreel ID lands here.
  const present = { title: 'Presented by Neil Peacock', client: 'On camera', platform: 'youtube', shape: 'landscape' };

  // [file, name, aspect ratio, description, quote, source]
  const logoData = [
    ['black-tomato', 'Black Tomato', 1.34, 'Masterminds of bespoke adventure, crafting once-in-a-lifetime journeys for the world’s boldest travellers.', 'The coolest thing alive.', 'GQ'],
    ['harvest-series', 'Harvest Series', 11.42, 'Where global thinkers, artists and changemakers gather, with speakers including Gabor Maté and Esther Perel.', 'A meeting of Burning Man and the World Economic Forum.', 'Financial Times'],
    ['the-safari-edit', 'The Safari Edit', 4.74, 'A curated guide to the finest safari lodges and journeys across Africa.'],
    ['athena-advisers', 'Athena Advisers', 7.19, 'Dream property investments, from chalets in the French Alps to surf villas in Portugal, with a reputation for insight and discretion.'],
    ['wavelength', 'Wavelength', 7.47, 'Since 1981, the beating heart of European surf culture, now a thriving lifestyle brand.'],
    ['wavelength-drive-in', 'Wavelength Drive-In Cinema', 2.14, 'A drive-in cinema under the sky at Watergate Bay, Cornwall.'],
    ['satopia', 'Satopia Travel', 4.0, 'Intimate journeys with culinary giants, from Francis Mallmann’s private island in Patagonia to tables with Massimo Bottura.'],
    ['dreamscape', 'Dreamscape', 4.41, 'Indonesia’s leading luxury travel agency, curating journeys from Antarctica to the landscapes of Europe and Africa.'],
    ['blue-earth-summit', 'Blue Earth Summit', 3.97, 'The UK’s most dynamic sustainability gathering, with brands like Patagonia, Breitling and Vivobarefoot.'],
    ['ticket-to-ride', 'Ticket to Ride', 4.6, 'The UK’s pioneer of adventure-led sport: ski seasons in the Alps and surf odysseys from Sri Lanka to South Africa.'],
    ['indonesia-luxury-travel', 'Discover Luxury Indonesia', 4.76, 'Extraordinary journeys through the world’s largest archipelago, blending barefoot island magic with world-class service.'],
    ['pearson-1860', 'Pearson', 4.33, 'Founded in 1860, Britain’s oldest cycling company, reimagining performance and adventure bikes rooted in heritage.'],
    ['nemo', 'Nemo', 4.98, 'A fresh, tech-forward spin on luxury travel, with interactive, personalised itineraries that adapt to each traveller.'],
    ['jia', 'JIA', 1.98, 'A community and platform for professional nomads.'],
    ['odisi', 'Odisi', 3.78, 'A new player in luxury seaplane travel, set to redefine how Indonesia’s most extraordinary destinations are connected.'],
    ['wm', 'Wavelength Media', 3.12, 'The media company behind Wavelength, creating content, film and events.']
  ];

  const logoResults = {
    'harvest-series': ['£3.5m', 'Generated in four months, selling out a 350-person festival'],
    'black-tomato': ['£5m+', 'Enquiry value from Get Lost, Travel Campaign of the Year 2019'],
    'the-safari-edit': ['75x', 'ROAS and £50k+ revenue from a six-week paid campaign'],
    'wavelength-drive-in': ['£280k', 'Revenue for the drive-in, £200k of it from email'],
    'wm': ['+180%', 'Email revenue in six months, from one automated system'],
    'indonesia-luxury-travel': ['$400k', 'In sales from the first private Garuda Indonesia charter'],
    'ticket-to-ride': ['£70k', 'From email, fully booking surf instructor courses post-Covid']
  };

  // [website, instagram]. Still missing: wavelength-drive-in, odisi, jia.
  const logoLinks = {
    'the-safari-edit': ['https://thesafariedit.com/', 'https://www.instagram.com/thesafariedit'],
    'black-tomato': ['https://www.blacktomato.com', 'https://www.instagram.com/blacktomatotravel/'],
    'harvest-series': ['https://www.harvestseries.com/', 'https://www.instagram.com/harvestseries/'],
    'athena-advisers': ['https://www.athenaadvisers.com/', 'https://www.instagram.com/athenaadvisers/'],
    'satopia': ['https://satopiatravel.com', 'https://www.instagram.com/satopiatravel/'],
    'dreamscape': ['https://discoverluxuryindonesia.com', 'https://www.instagram.com/discoverluxindonesia/'],
    'indonesia-luxury-travel': ['https://discoverluxuryindonesia.com/', 'https://www.instagram.com/discoverluxindonesia/'],
    'blue-earth-summit': ['https://blueearthsummit.com', 'https://www.instagram.com/blueearthsummit/'],
    'ticket-to-ride': ['https://www.tickettoridegroup.com', 'https://www.instagram.com/tickettoridegroup/'],
    'wavelength': ['https://wavelengthmag.com', 'https://www.instagram.com/wavelengthsurfmag/'],
    'wm': ['https://wavelengthmag.com', null],
    'nemo': ['https://www.nemo-travel.com', 'https://www.instagram.com/wearenemotravel/'],
    'pearson-1860': ['https://www.pearson1860.com', 'https://www.instagram.com/pearson_1860/']
  };

  const JARGON = ['Funnels', 'Conversion rates', 'Omnichannel', 'Retargeting', 'ROAS', 'Brand equity', 'KPIs', 'Engagement', 'SEO', 'Attribution', 'Personas', 'Lead magnets', 'CTR', 'Growth hacking', 'Thought leadership', 'Customer acquisition', 'Touchpoints', 'Synergy', 'A/B tests', 'The algorithm', 'Content pillars', 'Impressions', 'Lifetime value', 'Share of voice'];

  /* ======================================================================
     SETUP
     ====================================================================== */

  const MOBILE = 820;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const cl = (v) => Math.max(0, Math.min(1, v));
  const isMobile = () => innerWidth < MOBILE;

  // Scroll-linked state the canvas field reads.
  const state = { stage: 0, stage2: 0, apP: 0, aiQ: 0, closeP: 0, energy: 0 };

  /* ======================================================================
     HERO
     ====================================================================== */

  const heroEl = $('.hero');
  const poster = $('#hero-poster');
  const scrim = $('#hero-scrim');
  let film = null;

  function sizeHero() {
    const w = Math.ceil(Math.max(innerWidth, Math.max(560, innerHeight) * 2.4) * 1.02);
    const h = w * 9 / 16;
    [poster, film].forEach((el) => { if (el) { el.style.width = w + 'px'; el.style.height = h + 'px'; } });
  }

  const VIMEO_ORIGIN = 'https://player.vimeo.com';

  function mountHeroFilm() {
    if (film || isMobile() || reduced) return;
    film = document.createElement('iframe');
    film.className = 'hero__film';
    film.src = VIMEO_ORIGIN + '/video/302174238?background=1&dnt=1#t=26s';
    film.title = 'A Portrait of Spain (silent preview)';
    film.allow = 'autoplay; fullscreen';
    film.tabIndex = -1;
    film.setAttribute('aria-hidden', 'true');

    // The iframe fires `load` even when Vimeo serves its own error page, so
    // trusting it means fading "Sorry, we're having a little trouble" over
    // the hero. Wait for the player itself to say it is ready; if it never
    // does, drop the iframe and keep the still, which already looks right.
    let settled = false;
    const onMessage = (e) => {
      if (e.origin !== VIMEO_ORIGIN || !film) return;
      let d = e.data;
      if (typeof d === 'string') { try { d = JSON.parse(d); } catch (err) { return; } }
      if (!d || d.event !== 'ready') return;
      settled = true;
      removeEventListener('message', onMessage);
      setTimeout(() => film && film.classList.add('is-loaded'), 600);
    };
    addEventListener('message', onMessage);

    setTimeout(() => {
      if (settled) return;
      removeEventListener('message', onMessage);
      if (film) { film.remove(); film = null; }
    }, 8000);

    heroEl.insertBefore(film, scrim);
    sizeHero();
  }

  sizeHero();
  mountHeroFilm();
  setTimeout(() => heroEl.classList.add('is-in'), 80);
  setTimeout(() => scrim.classList.add('is-lifted'), 3600);

  /* ======================================================================
     LIGHTBOX
     ====================================================================== */

  const lb = $('#lightbox');
  const lbFrame = $('#lightbox-frame');
  const lbTitle = $('#lightbox-title');
  const lbClient = $('#lightbox-client');
  let lastFocus = null;

  function playerFor(v) {
    const common = 'title="' + esc(v.title) + '" allowfullscreen';
    if (v.yt) return '<iframe src="https://www.youtube-nocookie.com/embed/' + v.yt + '?autoplay=1&rel=0&modestbranding=1" ' + common + ' allow="autoplay; encrypted-media; fullscreen"></iframe>';
    if (v.ig) return '<iframe src="https://www.instagram.com/reel/' + v.ig + '/embed/" ' + common + ' allow="autoplay; encrypted-media" style="background:#fff"></iframe>';
    if (v.id) return '<iframe src="https://player.vimeo.com/video/' + v.id + '?autoplay=1&dnt=1&title=0&byline=0&portrait=0" ' + common + ' allow="autoplay; fullscreen; picture-in-picture"></iframe>';
    // Placeholder: this film has no ID yet.
    const name = { vimeo: 'Vimeo', youtube: 'YouTube', instagram: 'Instagram' }[v.platform] || v.platform;
    return '<p class="lightbox__pending">The ' + esc(name) + ' embed loads here<br>once this film’s ID is added.</p>';
  }

  function openLightbox(v) {
    lastFocus = document.activeElement;
    const ratio = v.shape === 'vertical' ? 9 / 16 : 16 / 9;
    lbFrame.style.aspectRatio = String(ratio);
    lbFrame.style.width = 'min(' + (ratio < 1 ? 420 : 1200) + 'px, 100%, calc((100vh - 200px) * ' + ratio + '))';
    lbFrame.innerHTML = playerFor(v);
    lbTitle.textContent = v.title;
    lbClient.textContent = v.client;
    lb.setAttribute('aria-label', v.title);
    lb.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    $('#lightbox-close').focus();
  }

  function closeLightbox() {
    if (lb.hidden) return;
    lb.hidden = true;
    lbFrame.innerHTML = '';
    document.documentElement.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  lb.addEventListener('click', (e) => { if (!e.target.closest('.lightbox__frame, .lightbox__meta')) closeLightbox(); });
  $('#lightbox-close').addEventListener('click', closeLightbox);
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  $('#hero-sound').addEventListener('click', () => openLightbox(hero));
  $('#feature').addEventListener('click', () => openLightbox(present));

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ======================================================================
     SELECTED WORK
     ====================================================================== */

  function workCard(v, i, kind) {
    const el = document.createElement('div');
    el.className = 'card card--' + kind;
    el.dataset.reveal = kind === 'wide' ? 'up' : 'pop';
    el.dataset.delay = String(i * 90);
    el.innerHTML =
      '<div class="card__frame">' +
        '<div class="poster">' +
          '<div class="poster__ph">' + window.HES.posterCover(v.poster) + '</div>' +
          '<img src="/assets/posters/' + esc(v.poster) + '" alt="" loading="lazy">' +
        '</div>' +
        '<button class="card__play" type="button" aria-label="Play ' + esc(v.title) + '">' +
          '<svg width="8" height="10" viewBox="0 0 10 12" aria-hidden="true"><path d="M0 0L10 6L0 12Z" fill="#FAF8F4"></path></svg>Play' +
        '</button>' +
      '</div>' +
      '<div class="card__meta"><b>' + esc(v.title) + '</b><span>' + esc(v.client) + '</span></div>';

    const img = $('img', el);
    img.addEventListener('load', () => img.classList.add('is-loaded'));
    $('.card__play', el).addEventListener('click', () => openLightbox(v));
    return el;
  }

  const wide = $('#work-wide'), tall = $('#work-tall');
  videos.slice(0, 2).forEach((v, i) => wide.appendChild(workCard(v, i, 'wide')));
  videos.slice(2).forEach((v, i) => tall.appendChild(workCard(v, i, 'tall')));

  /* ======================================================================
     BRANDS
     ====================================================================== */

  const grid = $('#brands-grid');

  // Logo height by aspect ratio, so wide and tall marks read at one weight.
  const hFor = (r) => (r > 9 ? 18 : r > 6 ? 22 : r > 4.2 ? 30 : r > 3 ? 34 : r > 1.6 ? 40 : 52);

  logoData.forEach(([file, name, ratio, desc, quote, src]) => {
    const res = logoResults[file];
    const lk = logoLinks[file] || [];
    const el = document.createElement('div');
    el.className = 'brand';
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-expanded', 'false');
    el.innerHTML =
      '<span class="brand__mark" role="img" aria-label="' + esc(name) + '" style="height:' + hFor(ratio) + 'px;aspect-ratio:' + ratio + ';background-image:url(/assets/logos/clean/' + file + '.png)"></span>' +
      '<span class="brand__line" aria-hidden="true"></span>' +
      '<div class="brand__card">' +
        '<span class="brand__name">' + esc(name) + '</span>' +
        '<span class="brand__desc">' + esc(desc) + '</span>' +
        (res ? '<span class="brand__result"><b>' + esc(res[0]) + '</b><span>' + esc(res[1]) + '</span></span>' : '') +
        (quote ? '<span class="brand__quote">“' + esc(quote) + '” <span>— ' + esc(src) + '</span></span>' : '') +
        (lk[0] || lk[1] ?
          '<span class="brand__links">' +
            (lk[0] ? '<a href="' + esc(lk[0]) + '" target="_blank" rel="noopener">Website</a>' : '') +
            (lk[1] ? '<a href="' + esc(lk[1]) + '" target="_blank" rel="noopener">Instagram</a>' : '') +
          '</span>' : '') +
      '</div>';
    grid.appendChild(el);
  });

  const brandEls = $$('.brand', grid);
  let brandTimer = null;

  // Cards in the right half of the grid open leftward. Read the column count
  // off the grid rather than guessing it from a min-width: the two drifted
  // apart at phone widths and the cards ran off the side of the screen.
  function placeCards() {
    const tracks = getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length;
    const cols = Math.max(1, tracks);
    brandEls.forEach((el, i) => el.classList.toggle('brand--right', (i % cols) >= cols / 2));
  }
  placeCards();

  function brandOn(el) {
    clearTimeout(brandTimer);
    if (el.classList.contains('is-on')) return;
    brandEls.forEach((b) => b.classList.remove('is-on'));
    el.classList.add('is-on');
    grid.classList.add('is-hovering');
    brandEls.forEach((b) => b.setAttribute('aria-expanded', String(b === el)));
    // Closed cards are inert, so their links stay out of the tab order.
    $$('.brand__card', grid).forEach((c) => { c.inert = true; c.setAttribute('aria-hidden', 'true'); });
    const card = $('.brand__card', el);
    card.inert = false;
    card.setAttribute('aria-hidden', 'false');
  }

  function brandOff() {
    brandEls.forEach((b) => { b.classList.remove('is-on'); b.setAttribute('aria-expanded', 'false'); });
    grid.classList.remove('is-hovering');
    $$('.brand__card', grid).forEach((c) => { c.inert = true; c.setAttribute('aria-hidden', 'true'); });
  }

  brandEls.forEach((el) => {
    el.addEventListener('mouseenter', () => brandOn(el));
    el.addEventListener('focus', () => brandOn(el));
    el.addEventListener('click', () => brandOn(el));
    el.addEventListener('keydown', (e) => {
      if (e.target !== el) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); brandOn(el); }
      if (e.key === 'Escape') brandOff();
    });
  });
  brandOff();
  grid.addEventListener('mouseleave', () => { clearTimeout(brandTimer); brandTimer = setTimeout(brandOff, 120); });
  grid.addEventListener('focusout', (e) => { if (!grid.contains(e.relatedTarget)) brandOff(); });

  /* ======================================================================
     HOTEL CONTENT RADAR
     ====================================================================== */

  const radarToggle = $('#radar-toggle'), radarDetail = $('#radar-detail');
  radarToggle.addEventListener('click', () => {
    const open = radarDetail.hidden;
    radarDetail.hidden = !open;
    radarToggle.setAttribute('aria-expanded', String(open));
    radarToggle.textContent = open ? 'Close ↑' : 'See it in action ↓';
    if (open) prime();
  });

  /* ======================================================================
     CLOSING — jargon words
     ====================================================================== */

  const jargonHost = $('#closing-jargon');
  JARGON.forEach((t, i) => {
    const a = i * 2.39996, r = 0.62 + ((i * 37) % 11) / 11 * 0.38;
    const x = 50 + Math.cos(a) * r * 44;
    let y = 50 + Math.sin(a) * r * 40;
    if (Math.abs(y - 50) < 18) y = 50 + (y >= 50 ? 1 : -1) * (18 + ((i * 13) % 7) * 2.2);
    const d = 0.35 + ((i * 7) % 10) / 10 * 1.1;
    const el = document.createElement('span');
    el.className = 'closing__jw';
    el.dataset.d = d.toFixed(2);
    el.dataset.x = x.toFixed(1);
    el.dataset.y = y.toFixed(1);
    el.style.left = x.toFixed(1) + '%';
    el.style.top = y.toFixed(1) + '%';
    el.style.fontSize = Math.round(12 + d * 9) + 'px';
    el.textContent = t;
    el.appendChild(Object.assign(document.createElement('i'), {}));
    jargonHost.appendChild(el);
  });

  /* ======================================================================
     FEATURED PIECE — blinking REC dot
     ====================================================================== */

  if (!reduced) {
    const dot = $('#rec-dot');
    let n = 75;
    setInterval(() => { n += 1; if (dot) dot.style.opacity = (Math.floor(n / 18) % 2) ? '0.25' : '1'; }, 40);
  }

  /* ======================================================================
     REVEALS
     ====================================================================== */

  function show(el) { el.dataset.shown = '1'; el.style.opacity = '1'; el.style.transform = 'none'; }

  function prime() {
    if (reduced) { $$('[data-reveal]:not([data-shown])').forEach(show); return; }
    const ease = 'cubic-bezier(0.16,1,0.3,1)';
    $$('[data-reveal]:not([data-primed])').forEach((el) => {
      el.dataset.primed = '1';
      const t = el.dataset.reveal, d = (+el.dataset.delay || 0) + 'ms';
      el.style.opacity = t === 'rise' ? '1' : '0';
      el.style.transform = t === 'rise' ? 'translateY(105%)' : t === 'pop' ? 'translateY(20px)' : 'translateY(24px)';
      el.style.transition = t === 'pop'
        ? 'opacity 500ms ' + ease + ' ' + d + ', transform 900ms ' + ease + ' ' + d
        : 'opacity 700ms ' + ease + ' ' + d + ', transform ' + (t === 'rise' ? 1000 : 700) + 'ms ' + ease + ' ' + d;
    });
    schedule();
  }

  function releaseReveals(vh) {
    $$('[data-reveal][data-primed]:not([data-shown])').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 1.02 && r.bottom > -50) show(el);
    });
  }

  /* ======================================================================
     SCROLL
     ====================================================================== */

  let raf = null;
  function schedule() { if (!raf) raf = requestAnimationFrame(tick); }

  function tick() {
    raf = null;
    const vh = innerHeight, sy = scrollY;
    if (!reduced) releaseReveals(vh);
    try { body(vh, sy); } catch (err) { console.warn('tick', err); }
  }

  function body(vh, sy) {
    whoTrack(vh);
    closingTrack(vh);
    stepsTrack($('#ai-track'), vh, 'stage2', 'aiQ', 'ai', $('#ai-prog'));
    stepsTrack($('#approach-track'), vh, 'stage', 'apP', 'approach', $('#approach-prog'));
    if (reduced) return;
    parallax(vh, sy);
  }

  /* --- Who we work with: pinned horizontal scroll --- */
  function whoTrack(vh) {
    const ht = $('#who-track');
    if (!ht || isMobile()) return;
    const r = ht.getBoundingClientRect(), vw = innerWidth;
    const p = cl((76 - r.top) / Math.max(1, r.height - (vh - 76)));
    const row = $('#who-row'), cards = $$('.who__card', ht), panel = $('#who-panel');

    if (panel) {
      const e = cl((vh - r.top) / Math.max(1, vh - 76)), m = 1 - e;
      panel.style.clipPath = 'inset(' + m * 10 + 'vh ' + m * Math.max(40, (vw - 1200) / 2) + 'px round ' + m * 6 + 'px)';
    }

    const c0 = cards[0], last = cards[cards.length - 1];
    const startX = vw / 2 - (c0.offsetLeft + c0.offsetWidth / 2) + vw * 0.3;
    const endX = vw / 2 - (last.offsetLeft + last.offsetWidth / 2);
    const pp = cl((p - 0.08) / 0.82);
    const rowIn = cl((p - 0.1) / 0.08);
    row.style.opacity = String(rowIn);
    row.style.transform = 'translateX(' + (startX + (endX - startX) * pp + (1 - rowIn) * vw * 0.25) + 'px)';

    let best = 0, bd = 1e9;
    cards.forEach((c, i) => {
      const cr = c.getBoundingClientRect(), d = (cr.left + cr.width / 2 - vw * 0.5) / vw;
      c.style.opacity = String(Math.max(0.15, Math.min(1, 1 - Math.abs(d) * 1.1)));
      const im = $('.who__img', c);
      if (im) im.style.transform = 'scale(' + (1.08 - Math.max(0, 1 - Math.abs(d) * 2) * 0.08) + ') translateX(' + (d * -24) + 'px)';
      if (Math.abs(d) < bd) { bd = Math.abs(d); best = i; }
    });

    const cnt = $('#who-count'); if (cnt) cnt.textContent = '0' + (best + 1) + ' / 0' + cards.length;
    const bar = $('#who-bar'); if (bar) bar.style.width = (p * 100) + '%';

    const hh = $('#who-headline');
    if (hh) {
      const f = cl((p - 0.06) / 0.08), ef = f * f * (3 - 2 * f);
      hh.style.opacity = String(1 - ef);
      hh.style.transform = 'translateY(calc(-50% - ' + ef * 60 + 'px)) scale(' + (1 - ef * 0.08) + ')';
      hh.style.filter = 'blur(' + ef * 4 + 'px)';
      const tt = r.top;
      [...hh.firstElementChild.children].forEach((k, j) => {
        const g = cl((vh * (0.5 - j * 0.1) - tt) / (vh * 0.5)), eg = 1 - Math.pow(1 - g, 3);
        k.style.opacity = String(eg);
        k.style.transform = j === 2 ? 'scaleY(' + eg + ')' : 'translateY(' + (1 - eg) * 40 + 'px)';
        k.style.transformOrigin = 'top';
        k.style.filter = j === 1 ? 'blur(' + (1 - eg) * 8 + 'px)' : 'none';
      });
    }
  }

  /* --- Approach and AI systems: pinned three-step morphs --- */
  function stepsTrack(tr, vh, stageKey, progKey, panelKey, progEl) {
    if (!tr || isMobile()) return;
    const r = tr.getBoundingClientRect();
    const q = cl((76 - r.top) / Math.max(1, r.height - (vh - 76)));
    state[progKey] = q;

    const sf = q * 3, j = Math.min(2, Math.floor(sf));
    const s = (sf - j) > 0.7 && j < 2 ? j + 1 : j;
    // The first pass must paint step 01, even though the stage has not moved.
    if (s !== state[stageKey] || !tr.dataset.init) {
      tr.dataset.init = '1';
      state[stageKey] = s;
      $$('[data-panels="' + panelKey + '"] .steps__panel').forEach((p, k) => {
        p.classList.toggle('is-current', k === s);
        p.classList.toggle('is-past', k < s);
      });
      $$('[data-legend="' + panelKey + '"] [data-k]').forEach((el, k) => {
        el.style.color = k === s
          ? (panelKey === 'approach' ? '#FAF8F4' : '#0C1520')
          : (panelKey === 'approach' ? '#5E6670' : '#A3A7AC');
      });
    }
    if (progEl) progEl.style.width = (q * 100) + '%';
  }

  /* --- Closing: scroll-driven story --- */
  function closingTrack(vh) {
    const ct = $('#closing-track');
    if (!ct) return;
    const rc = ct.getBoundingClientRect(), mob = isMobile();
    state.closeP = mob
      ? cl((vh * 0.85 - rc.top) / (rc.height * 0.8))
      : cl((-rc.top) / Math.max(1, rc.height - vh));
    if (mob) return;

    const pc = state.closeP;
    const ez = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const sg = (x, y) => cl((pc - x) / (y - x));
    const vw = innerWidth, SP = 0.085, HOLD = 0.025;

    const fly = (el, t, keep, extra) => {
      if (!el) return 0;
      let z = pc - t;
      z = Math.abs(z) < HOLD ? 0 : z - Math.sign(z) * HOLD;
      z /= SP;
      if (keep && z > 0) z = 0;
      let sc, op, bl;
      if (z <= 0) { const k = ez(cl(1 + z)); sc = 0.5 + 0.5 * k; op = k; bl = (1 - k) * 10; }
      else { const k = cl(z); sc = 1 + k * k * 2.4; op = cl(1 - k * 1.7); bl = k * 14; }
      el.style.opacity = op.toFixed(3);
      el.style.transform = 'translateY(calc(-50% + ' + ((z < 0 ? -z * 36 : -z * 18) + (extra || 0)).toFixed(1) + 'px)) scale(' + sc.toFixed(3) + ')';
      el.style.filter = bl > 0.1 ? 'blur(' + bl.toFixed(1) + 'px)' : 'none';
      return z;
    };

    const C = (k) => $('[data-c="' + k + '"]', ct);

    $$('.closing__jw', ct).forEach((el, i) => {
      const d = +el.dataset.d, x = +el.dataset.x, y = +el.dataset.y;
      const tj = 0.05 + (1.5 - d) * 0.09 + (i % 5) * 0.008, z = (pc - tj) / 0.16;
      const s = z < 0 ? 0.35 + 0.65 * ez(cl(1 + z)) : 1 + z * z * 3.2;
      const op = z < 0 ? ez(cl(1 + z * 1.2)) : cl(1 - z * 1.4);
      const dx = (x - 50) / 50 * vw * 0.42 * s, dy = (y - 50) / 50 * vh * 0.42 * s;
      el.style.left = '50%'; el.style.top = '50%';
      el.style.opacity = (op * (0.35 + d * 0.45)).toFixed(3);
      el.style.transform = 'translate(-50%,-50%) translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px) scale(' + s.toFixed(3) + ')';
      const bl = Math.abs(z) * 5 + (d < 0.6 ? 1 : 0);
      el.style.filter = bl > 0.2 ? 'blur(' + bl.toFixed(1) + 'px)' : 'none';
      const st = $('i', el); if (st) st.style.transform = 'scaleX(' + ez(sg(tj - 0.06, tj - 0.01)).toFixed(3) + ')';
    });

    fly(C(1), 0.13);
    fly(C(2), 0.31);
    { const el = C(3), z = fly(el, 0.47); const k = z < 0 ? ez(cl(1 + z)) : 1; el.style.letterSpacing = k < 1 ? (0.5 * (1 - k)).toFixed(3) + 'em' : ''; }
    const whys = C(4);
    whys.style.opacity = '1'; whys.style.transform = 'none'; whys.style.filter = 'none';
    $$('[data-why]', whys).forEach((w, i) => fly(w, 0.62 + i * 0.1));
    fly(C(5), 0.93, true);
    const sig = $('#sig-rule'); if (sig) sig.style.transform = 'scaleX(' + ez(sg(0.92, 0.99)).toFixed(3) + ')';
  }

  /* --- Parallax, drift, scale --- */
  function parallax(vh, sy) {
    $$('[data-parallax]').forEach((el) => { el.style.transform = 'translateY(' + sy * (+el.dataset.parallax) + 'px)'; });
    $$('[data-parallax-inner]').forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / vh));
      el.style.transform = 'translateY(' + p * (+el.dataset.parallaxInner) * 100 + '%)';
    });
    $$('[data-drift]').forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      const p = cl((vh - r.top) / (vh + r.height));
      el.style.transform = 'translateX(' + (p - 0.5) * +el.dataset.drift * 0.32 * innerWidth + 'px)';
    });
    $$('[data-scale]').forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      const p = cl((vh - r.top) / (vh * 0.8));
      el.style.transform = 'scale(' + (0.9 + 0.1 * p) + ')';
    });
  }

  /* ======================================================================
     DOT FIELD
     ====================================================================== */

  function startField() {
    const canvas = $('#field');
    if (!canvas) return;
    const wide = matchMedia('(min-width: ' + MOBILE + 'px)');
    const N = 90, P = [];
    for (let i = 0; i < N; i++) {
      P.push({ i, a: Math.random() * Math.PI * 2, ir: 0.12 + Math.random() * 0.62, v: 0.025 + Math.random() * 0.04, x: innerWidth / 2, y: innerHeight, sx: 0, sy: 0, rx: Math.random(), ry: Math.random(), ph: Math.random() * 6.28 });
    }
    let last = performance.now(), t = 0, key = null, t0 = -99, alpha = 0, fE = 0;
    const DUR = 2.8, ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const ALPHA = { closing: 0.45, ai: 0.9, hidden: 0, horizon: 0.6, approach: 0.9, wave: 0.7, frame: 0.7, constellation: 0.6, orbit: 0.7, point: 0.8 };
    const bursts = [];
    let nextB = 0;

    // Where each dot wants to be, for the given form and step.
    const target = (p, f, R, st) => {
      const cx = R.left + R.width / 2, cy = R.top + R.height / 2, S = Math.min(R.width, R.height), i = p.i;

      if (f === 'hidden') return [innerWidth / 2 + (p.rx - 0.5) * 300, innerHeight + 40];

      if (f === 'horizon') { const x = i / (N - 1); return [R.left + x * R.width, cy + Math.sin(x * 7 - t * 0.9) * R.height * 0.32]; }

      if (f === 'frame') {
        const per = 2 * (R.width + R.height), u = ((i / N) + t * 0.012) % 1 * per;
        let x, y;
        if (u < R.width) { x = u; y = 0; }
        else if (u < R.width + R.height) { x = R.width; y = u - R.width; }
        else if (u < 2 * R.width + R.height) { x = R.width - (u - R.width - R.height); y = R.height; }
        else { x = 0; y = R.height - (u - 2 * R.width - R.height); }
        return [R.left + x, R.top + y];
      }

      if (f === 'approach') {
        if (st === 0) return [cx + Math.cos(p.a) * p.ir * S, cy + Math.sin(p.a) * p.ir * S];
        if (st === 1) { const an = (i / N) * 6.283 + t * 0.06, rr = 0.3 + Math.sin(t * 0.8 + i) * 0.006; return [cx + Math.cos(an) * rr * S, cy + Math.sin(an) * rr * S]; }
        const th = t * 0.1 + (i / N) * 6.283, rr = 0.34 * Math.cos(3 * th);
        return [cx + Math.cos(th) * rr * S, cy + Math.sin(th) * rr * S];
      }

      if (f === 'closing') {
        const Pc = state.closeP || 0;
        const E = (v) => { v = cl(v); return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2; };
        const S2 = (x, y) => E((Pc - x) / (y - x));
        const W = R.width, H = R.height, u = p.rx, k = p.i % 3;
        const L = (A, B, m) => [A[0] + (B[0] - A[0]) * m, A[1] + (B[1] - A[1]) * m];
        const f0 = [R.left + p.rx * W + Math.sin(t * 1.7 + p.ph * 9) * 34, R.top + p.ry * H + Math.cos(t * 1.3 + p.ph * 7) * 34];
        const f1 = [R.left + W * (0.08 + 0.84 * u), cy + Math.max(56, H * 0.2) + Math.sin(u * 14 + t * 0.5) * 5];
        const ck = S2(0.585 + k * 0.1, 0.635 + k * 0.1);
        const rr = S * 0.3 + (S * (0.13 + 0.11 * k) - S * 0.3) * ck + Math.sin(p.ph * 6 + t) * 3;
        const ang = u * Math.PI * 2 + t * (0.06 + ck * 0.05) * (k % 2 ? 1 : -1);
        const rx = Math.max(rr * 1.25, W * 0.42 - (W * 0.42 - rr * 1.25) * ck);
        const ry = Math.max(rr, H * 0.36 - (H * 0.36 - rr) * ck);
        let f2 = [cx + Math.cos(ang) * rx, cy + Math.sin(ang) * ry];
        const band = Math.max(34, H * 0.07);
        if (Math.abs(f2[1] - cy) < band && Math.abs(f2[0] - cx) < W * 0.34) f2 = [f2[0], cy + Math.sign(f2[1] - cy || 1) * band];
        const pa = u * Math.PI * 2 + t * 0.35, pr = S * 0.035 * Math.sqrt(p.ry) * (1 + Math.sin(t * 1.4) * 0.12);
        const f3 = [cx + Math.cos(pa) * pr, cy + S * 0.24 + Math.sin(pa) * pr];
        let q = L(f0, f1, S2(0.2, 0.33));
        q = L(q, f2, S2(0.39, 0.5));
        q = L(q, f3, S2(0.85, 0.95));
        return q;
      }

      if (f === 'ai') {
        const s2 = fieldStage2;
        if (s2 === 1) {
          const cols = Math.ceil(N / 3), c = i % cols, rw = Math.floor(i / cols), x = c / (cols - 1);
          let env = 0; for (const bb of bursts) env += bb.a * Math.exp(-Math.pow((x - bb.x) / bb.w, 2));
          env = Math.min(1, env);
          return [cx - S * 0.5 + x * S, cy + (rw - 1) * 10 * (1 - env * 0.6) + Math.sin(x * 22 - t * 3 + rw * 0.7) * env * S * 0.22 * (rw === 1 ? 1 : 0.6)];
        }
        if (s2 === 2) {
          // Hub and spokes: a central "YOUR AI" ring joined to six clusters.
          const K = 6, rad = S * 0.36, hubR = S * 0.075, nodeR = S * 0.03;
          const nA = (k) => k * 6.283 / K - 1.5708;
          const NP = (k) => [cx + Math.cos(nA(k)) * rad, cy + Math.sin(nA(k)) * rad];
          const nH = Math.floor(N * 0.14), nN = Math.floor(N * 0.3);
          if (i < nH) { const an = (i / nH) * 6.283 + t * 0.15; return [cx + Math.cos(an) * hubR, cy + Math.sin(an) * hubR]; }
          if (i < nH + nN) {
            const j = i - nH, k = j % K, m = Math.floor(j / K), per = Math.ceil(nN / K), c = NP(k);
            const pr = nodeR * (1 + Math.max(0, Math.sin(t * 2.4 - k * 1.05)) * 0.35), an = (m / per) * 6.283 - t * 0.25;
            return [c[0] + Math.cos(an) * pr, c[1] + Math.sin(an) * pr];
          }
          const j = i - nH - nN, rest = N - nH - nN, RT = K * 2, rt = j % RT, idx = Math.floor(j / RT), cnt = Math.max(1, Math.ceil(rest / RT));
          let s = ((idx / cnt) + t * 0.07) % 1;
          let A, B;
          if (rt < K) {
            const c = NP(rt), dx = c[0] - cx, dy = c[1] - cy, d = Math.hypot(dx, dy);
            A = [cx + dx / d * hubR * 1.25, cy + dy / d * hubR * 1.25];
            B = [c[0] - dx / d * nodeR * 1.6, c[1] - dy / d * nodeR * 1.6];
            if (rt % 2) s = 1 - s;
          } else {
            const k = rt - K, a = NP(k), b = NP((k + 1) % K), dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy);
            A = [a[0] + dx / d * nodeR * 1.6, a[1] + dy / d * nodeR * 1.6];
            B = [b[0] - dx / d * nodeR * 1.6, b[1] - dy / d * nodeR * 1.6];
          }
          return [A[0] + (B[0] - A[0]) * s, A[1] + (B[1] - A[1]) * s];
        }
        const ring = i % 3, idx = Math.floor(i / 3), cnt = Math.ceil(N / 3);
        const an = (idx / cnt) * 6.283 + t * (ring % 2 ? -0.08 : 0.06);
        const rr = S * (0.14 + ring * 0.14 + Math.sin(t * 0.6 + ring) * 0.01);
        return [cx + Math.cos(an) * rr, cy + Math.sin(an) * rr];
      }

      if (f === 'wave') {
        const cols = Math.ceil(N / 3), c = i % cols, rw = Math.floor(i / cols), x = c / (cols - 1);
        let env = 0; for (const bb of bursts) env += bb.a * Math.exp(-Math.pow((x - bb.x) / bb.w, 2));
        env = Math.min(1, env);
        return [R.left + x * R.width, cy + (rw - 1) * 7 * (1 - env * 0.6) + Math.sin(x * 22 - t * 3 + rw * 0.7) * env * R.height * 0.42 * (rw === 1 ? 1 : 0.6)];
      }

      if (f === 'constellation') return [R.left + (0.06 + p.rx * 0.88) * R.width, R.top + (0.08 + p.ry * 0.84) * R.height + Math.sin(t * 0.5 + p.ph) * 3];
      if (f === 'orbit') { const an = (i / N) * 6.283 + t * 0.12, rr = 0.42 + Math.sin(i * 1.7 + t) * 0.03; return [cx + Math.cos(an) * rr * S, cy + Math.sin(an) * rr * S]; }

      const an = p.ph + t * 0.3, rr = S * (0.06 + p.rx * 0.34) + Math.sin(t * 0.9 + p.ph) * 2;
      return [cx + Math.cos(an) * rr, cy + Math.sin(an) * rr];
    };

    // The AI form reads this rather than the page's own stage, so the field
    // can interpolate between two steps while the copy holds on one.
    let fieldStage2 = 0;

    const loop = (now) => {
      requestAnimationFrame(loop);
      if (!wide.matches) return;

      const dpr = Math.min(2, devicePixelRatio || 1), W = Math.round(innerWidth * dpr), H = Math.round(innerHeight * dpr);
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }

      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const en = state.energy; state.energy = en * 0.94;
      t += dt * (1 + en * 0.04);

      if (t > nextB) { bursts.push({ x: -0.15, a: 0.45 + Math.random() * 0.55, w: 0.05 + Math.random() * 0.06 }); nextB = t + 1.1 + Math.random() * 1.4; }
      for (const bb of bursts) bb.x += dt * 0.11;
      while (bursts.length && bursts[0].x > 1.2) bursts.shift();

      // The nearest field holder to the middle of the screen wins.
      const mid = innerHeight / 2;
      let f = 'hidden', R = null, best = 1e9;
      $$('[data-field]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.height === 0) return;
        const sec = el.closest('section') || el, sr = sec.getBoundingClientRect();
        const d = sr.top <= mid && sr.bottom >= mid ? 0 : Math.min(Math.abs(sr.top - mid), Math.abs(sr.bottom - mid));
        if (d < best) { best = d; f = el.dataset.field; R = r; }
      });
      if (!R) return;
      if (best > 0) f = 'hidden';

      if (f !== key) { key = f; t0 = t; fE = 0; P.forEach((p) => { p.sx = p.x; p.sy = p.y; }); }

      const tE = Math.min(1, (t - t0) / DUR);
      fE += (tE - fE) * 0.08;
      const bl = fE > 0.997 ? 1 : fE, e = ease(Math.min(1, bl));
      alpha += ((ALPHA[f] != null ? ALPHA[f] : 0.5) - alpha) * 0.03;

      const ctx = canvas.getContext('2d');
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';

      for (const p of P) {
        p.ir -= p.v * dt;
        p.a += (0.12 / Math.max(0.08, p.ir)) * dt;
        if (p.ir < 0.06) { p.ir = 0.62 + Math.random() * 0.12; p.a = Math.random() * 6.283; }
      }

      ctx.fillStyle = 'rgba(250,248,244,' + alpha.toFixed(3) + ')';
      for (const p of P) {
        let gx, gy;
        if (f === 'approach' || f === 'ai') {
          const pr = f === 'approach' ? state.apP : state.aiQ;
          const sfx = pr * 3, j0 = Math.min(2, Math.floor(sfx));
          const fr = j0 >= 2 ? 0 : cl((sfx - j0 - 0.35) / 0.6);
          const ee = fr < 0.5 ? 4 * fr * fr * fr : 1 - Math.pow(-2 * fr + 2, 3) / 2;
          let A, Bt;
          if (f === 'approach') { A = target(p, f, R, j0); Bt = j0 < 2 ? target(p, f, R, j0 + 1) : A; }
          else {
            fieldStage2 = j0; A = target(p, f, R, j0);
            fieldStage2 = Math.min(2, j0 + 1); Bt = target(p, f, R, fieldStage2);
          }
          gx = A[0] + (Bt[0] - A[0]) * ee;
          gy = A[1] + (Bt[1] - A[1]) * ee;
        } else {
          const g = target(p, f, R, state.stage);
          gx = g[0]; gy = g[1];
        }
        if (en > 0.5) { const ax = R.left + R.width / 2, ay = R.top + R.height / 2, k2 = en * 0.0025; gx += (gx - ax) * k2; gy += (gy - ay) * k2; }
        if (bl < 1) { p.x = p.sx + (gx - p.sx) * e; p.y = p.sy + (gy - p.sy) * e; }
        else { p.x = gx; p.y = gy; }
        ctx.beginPath();
        ctx.arc(p.x * dpr, p.y * dpr, 1.2 * dpr, 0, 6.283);
        ctx.fill();
      }

      // Neighbour threads, bucketed so this stays cheap.
      {
        const CS = 52, grid2 = new Map(), md2 = CS * CS;
        for (const p of P) {
          const k = Math.floor(p.x / CS) + ',' + Math.floor(p.y / CS);
          let c = grid2.get(k); if (!c) grid2.set(k, c = []); c.push(p);
        }
        ctx.lineWidth = 0.6 * dpr;
        ctx.beginPath();
        let n = 0;
        for (const p of P) {
          const gx0 = Math.floor(p.x / CS), gy0 = Math.floor(p.y / CS);
          for (let dx = 0; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy < 0) continue;
            const c = grid2.get((gx0 + dx) + ',' + (gy0 + dy));
            if (!c) continue;
            for (const q of c) {
              if (q === p || (dx === 0 && dy === 0 && q.x <= p.x)) continue;
              const ddx = p.x - q.x, ddy = p.y - q.y;
              if (ddx * ddx + ddy * ddy < md2 * 0.55) {
                ctx.moveTo(p.x * dpr, p.y * dpr);
                ctx.lineTo(q.x * dpr, q.y * dpr);
                if (++n > 1400) break;
              }
            }
          }
        }
        ctx.strokeStyle = 'rgba(250,248,244,' + (alpha * 0.22).toFixed(3) + ')';
        ctx.stroke();
      }

      // Step 03 of AI systems labels its clusters.
      if (f === 'ai') {
        const w = cl((state.aiQ * 3 - 1.75) / 0.45);
        if (w > 0.01) {
          const cx = R.left + R.width / 2, cy = R.top + R.height / 2, S = Math.min(R.width, R.height), rad = S * 0.36;
          const L = ['Website', 'Bookings', 'Email', 'Guests', 'Social', 'Finance'];
          const hair = String.fromCharCode(8202);
          ctx.font = '500 ' + Math.round(9.5 * dpr) + "px 'Plus Jakarta Sans', sans-serif";
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = 'rgba(250,248,244,' + (alpha * w * 0.85).toFixed(3) + ')';
          L.forEach((label, k) => {
            const an = k * 6.283 / 6 - 1.5708, lr = rad + S * 0.085;
            ctx.fillText(label.toUpperCase().split('').join(hair), (cx + Math.cos(an) * lr) * dpr, (cy + Math.sin(an) * lr) * dpr);
          });
          ctx.fillText('YOUR' + hair + ' AI', cx * dpr, cy * dpr);
        }
      }
    };

    requestAnimationFrame(loop);
  }

  /* ======================================================================
     START HERE — the two forms
     ====================================================================== */

  // Leads go through /assets/js/lead.js, which is also used by Contact.
  // Set ENDPOINT there once and both pages send for real.
  const submitLead = (kind, payload, subject) =>
    (window.HES && window.HES.submitLead)
      ? window.HES.submitLead(kind, payload, subject)
      : Promise.resolve('mailto');

  const inbox = () => (window.HES && window.HES.leadInbox) || 'neil@highelmstudio.com';

  const paths = $('#paths');
  const formAudit = $('#form-audit');
  const formBrand = $('#form-brand');
  let chosen = null;

  $$('.path', paths).forEach((btn) => {
    btn.addEventListener('click', () => {
      const k = btn.dataset.path;
      chosen = chosen === k ? null : k;
      $$('.path', paths).forEach((b) => {
        const on = b.dataset.path === chosen;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', String(on));
        $('.path__mark', b).textContent = on ? '✓' : '→';
      });
      paths.classList.toggle('has-choice', !!chosen);
      formAudit.hidden = chosen !== 'A';
      formBrand.hidden = chosen !== 'B';
      if (chosen) prime();
    });
  });

  /* --- Free website audit --- */
  {
    const steps = $$('[data-step]', formAudit);
    const site = $('#audit-site'), email = $('#audit-email');
    const label = $('#audit-step-label');
    let step = 1, goal = null;

    const ok1 = () => /\.[a-z]{2,}/i.test(site.value.trim());
    const ok2 = () => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim());
    const ok3 = () => goal != null;

    function render() {
      steps.forEach((s) => { s.hidden = +s.dataset.step !== step; });
      label.textContent = step < 4 ? step + ' of 3' : 'Sent';
      $$('.form__bars i', formAudit).forEach((b) => b.classList.toggle('is-on', +b.dataset.bar <= step));
      $('[data-step="1"] [data-act="next"]', formAudit).disabled = !ok1();
      $('[data-step="2"] [data-act="next"]', formAudit).disabled = !ok2();
      $('[data-act="send"]', formAudit).disabled = !ok3();
    }

    function next() {
      if ((step === 1 && ok1()) || (step === 2 && ok2())) { step += 1; render(); }
    }

    site.addEventListener('input', render);
    email.addEventListener('input', render);
    [site, email].forEach((el) => el.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); next(); } }));

    $$('[data-act="next"]', formAudit).forEach((b) => b.addEventListener('click', next));
    $$('[data-act="back"]', formAudit).forEach((b) => b.addEventListener('click', () => { step = Math.max(1, step - 1); render(); }));

    $$('.goal', formAudit).forEach((b) => b.addEventListener('click', () => {
      goal = +b.dataset.goal;
      $$('.goal', formAudit).forEach((g) => {
        const on = +g.dataset.goal === goal;
        g.classList.toggle('is-on', on);
        g.setAttribute('aria-pressed', String(on));
      });
      render();
    }));

    const GOALS = ['More enquiries', 'Higher-value bookings', 'Guests coming back', 'Not sure yet'];

    $('[data-act="send"]', formAudit).addEventListener('click', () => {
      if (!ok3()) return;
      const payload = { site: site.value.trim(), email: email.value.trim(), goal: GOALS[goal] };
      submitLead('audit', payload, 'Free audit request from highelmstudio.com').then((how) => {
        $('[data-echo="site"]', formAudit).textContent = payload.site;
        $('[data-echo="email"]', formAudit).textContent = payload.email;
        if (how === 'mailto') {
          $('[data-done-line]', formAudit).textContent =
            'Your email app should have opened with this ready to send. If it didn\u2019t, write to ' + inbox() + '.';
        }
        step = 4;
        render();
      });
    });

    formAudit.addEventListener('submit', (e) => e.preventDefault());
    render();
  }

  /* --- Talk about your brand --- */
  {
    const msg = $('#brand-msg'), email = $('#brand-email'), send = $('[data-act="send"]', formBrand);
    const ok = () => msg.value.trim().length > 3 && /.+@.+\..+/.test(email.value.trim());
    const render = () => { send.disabled = !ok(); };

    [msg, email].forEach((el) => el.addEventListener('input', render));

    send.addEventListener('click', () => {
      if (!ok()) return;
      const payload = { message: msg.value.trim(), email: email.value.trim() };
      submitLead('conversation', payload, 'Message from highelmstudio.com').then((how) => {
        $('[data-echo="brandEmail"]', formBrand).textContent = payload.email;
        if (how === 'mailto') {
          $('[data-done-line]', formBrand).textContent =
            'Your email app should have opened with this ready to send. If it didn\u2019t, write to ' + inbox() + '.';
        }
        $('[data-step="1"]', formBrand).hidden = true;
        $('[data-step="2"]', formBrand).hidden = false;
      });
    });

    formBrand.addEventListener('submit', (e) => e.preventDefault());
    render();
  }

  /* ======================================================================
     WIRING
     ====================================================================== */

  const bump = (e) => {
    const amt = e.type === 'wheel' ? Math.min(60, Math.abs(e.deltaY || 0)) : e.type === 'touchmove' ? 18 : 40;
    state.energy = Math.min(100, state.energy + amt * 0.5);
  };
  addEventListener('wheel', bump, { passive: true });
  addEventListener('touchmove', bump, { passive: true });
  addEventListener('keydown', (e) => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '].includes(e.key)) bump(e); }, { passive: true });

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('load', schedule);
  addEventListener('resize', () => { sizeHero(); mountHeroFilm(); placeCards(); schedule(); });

  if (!reduced) setTimeout(prime, 30); else prime();
  schedule();
  setTimeout(schedule, 400);

  // Safety net: catch anything the scroll handler missed.
  setInterval(() => {
    try { tick(); } catch (err) { console.warn('tick', err); }
    if (!reduced) releaseReveals(innerHeight);
  }, 1500);

  if (!reduced) startField();
})();
