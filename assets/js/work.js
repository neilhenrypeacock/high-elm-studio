/* High Elm Studio — work.
   Grouped by client. Each piece shows a still; the ones with a video ID are
   buttons that open the reel player. The rest are plain figures, so nothing
   announces itself as a control that does nothing.

   Posters live in /assets/posters/ and are shared with the homepage, so a
   film that appears on both pages needs only one still. */
(function () {
  'use strict';

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ======================================================================
     DATA
     [title, note, poster, player?]
     player is { ig: '<reel id>' } or { vimeo: '<id>' } or { yt: '<id>' }.
     Without one, a piece is a still only.
     ====================================================================== */

  /* Each piece: title, note, poster file, how it plays, and `about` — one
     line shown on hover saying what it is. The `about` lines are drawn from
     the films' own Vimeo descriptions and the reels' own Instagram captions,
     not written from scratch. Leave `about` out and the hover falls back to
     the note. */
  const GROUPS = [
    {
      name: 'Black Tomato',
      sector: 'Luxury travel · Film',
      min: '420px',
      ratio: '16 / 9',
      items: [
        { title: 'Get Lost', note: 'Award-winning campaign', poster: 'get-lost.jpg', play: { vimeo: '235008850' },
          about: 'The campaign that took Travel Campaign of the Year in 2019: travellers dropped somewhere unknown, with no itinerary and no map.' },
        { title: 'Norway: Life at the edge of the world', note: 'Destination film', poster: 'norway.jpg', play: { vimeo: '336603067' },
          about: 'The Lofoten Islands, a dog sled team, Senja, polar explorer Børge Ousland and a fishing vessel captain.' },
        { title: 'A Portrait of Spain', note: 'Destination film', poster: 'spain.jpg', play: { vimeo: '302174238' },
          about: 'A journey through Spain, and the film that still opens the homepage.' }
      ]
    },
    {
      name: 'Harvest Series',
      sector: 'Events · Social',
      min: '240px',
      ratio: '9 / 16',
      items: [
        { title: 'Gabor Maté on trauma', note: 'Harvest Series. 18K likes', poster: 'gabor-mate.jpg', play: { ig: 'CxliEDHLQLv' },
          about: 'Gabor Maté at Harvest London on trauma, and how perception and understanding help us heal and move forward.' },
        { title: 'Convento de Cristo', note: 'Autumn Equinox gathering', poster: 'convento-de-cristo.jpg', play: { ig: 'C_0GaD7AO69' },
          about: 'Equinox Nocturne: musicians take to the Templar convent above Tomar, Portugal, to celebrate the Autumn Equinox.' },
        { more: true, title: 'HUMANHOOD at Kaplankaya', note: 'Performance', poster: 'harvest-humanhood.jpg', play: { ig: 'C4-uIuJo54K' },
          about: 'Julia Robert and Rudi Cole of HUMANHOOD, performing and hosting at Harvest Kaplankaya.' },
        { more: true, title: 'Chapter 8: arrival day', note: 'Radical Connection', poster: 'harvest-arrival.jpg', play: { ig: 'C7Tzf_qIaWA' },
          about: 'Harvest 2024, Chapter 8. Radical Connection. Arrival day, and it has begun.' },
        { more: true, title: 'K.O.G.’s Sound & Movement Ceremony', note: 'Harvest Series', poster: 'harvest-kog.jpg', play: { ig: 'C7jhdkHoloP' },
          about: 'Shake it loose. A ceremony of sound and movement, and the highlight of the year’s gathering.' },
        { more: true, title: 'Esther Perel on artificial intimacy', note: 'Chapter 8, day 2', poster: 'harvest-perel-intimacy.jpg', play: { ig: 'C7mqi1IAV95' },
          about: 'While the world talks about artificial intelligence, Esther turns to something more enigmatic: artificial intimacy.' },
        { more: true, title: 'Esther Perel on relationships', note: 'Harvest Series', poster: 'harvest-perel-growth.jpg', play: { ig: 'C89swx-ILIS' },
          about: '“Understanding the dynamics of relationships is key to personal growth.”' },
        { more: true, title: 'Where the light enters', note: 'Laura Hof', poster: 'harvest-hof-light.jpg', play: { ig: 'DDKPiwTA_kR' },
          about: 'Laura describes losing a loved one as a black hole in the soul — and where the light enters.' }
      ]
    },
    {
      name: 'The Safari Edit',
      sector: 'Safari travel · Social',
      min: '240px',
      ratio: '9 / 16',
      items: [
        { title: 'Bazaruto Archipelago', note: 'Destination reel', poster: 'bazaruto.jpg', play: { ig: 'DcLaZYZMNL2' },
          about: 'A sandbank island off Mozambique, about as far east as southern Africa goes before it becomes ocean.' },
        { title: 'Okavango Delta', note: 'Destination reel', poster: 'okavango.jpg', play: { ig: 'Db75jfmR9Br' },
          about: 'By mokoro through the grass in Botswana, when the water is high.' },
        { more: true, title: 'South Africa into Mozambique', note: 'Four stops', poster: 'safari-mozambique.jpg', play: { ig: 'Dbp4COgRgoc' },
          about: 'Four stops, South Africa into Mozambique, beginning in the old grain silo on the Cape Town waterfront.' },
        { more: true, title: 'What a child understands', note: 'Destination reel', poster: 'safari-child.jpg', play: { ig: 'DachOjBRpWP' },
          about: 'Some things a child only understands once they have stood near them. A lion cub stops chewing its sibling’s ear and looks straight at you.' },
        { more: true, title: 'Beyond the pages', note: 'Destination reel', poster: 'safari-beyond-pages.jpg', play: { ig: 'DaNLZGlISvH' },
          about: 'You can read every guidebook and watch the documentaries twice. None of it prepares you for that first morning.' }
      ]
    },
    {
      name: 'Harvest Series Podcast',
      sector: 'Events · Film',
      min: '420px',
      ratio: '16 / 9',
      items: [
        { more: true, title: 'How losing our mother changed everything', note: 'With Laura & Isobelle Hof', poster: 'harvest-hof-grief.jpg', play: { yt: 'M4MizmKVxbI' },
          about: 'Wim Hof’s daughters open up about losing their mother, and turning grief into strength.' },
        { more: true, title: 'The gift of suffering', note: 'With Laura & Isobelle Hof', poster: 'harvest-hof-method.jpg', play: { yt: 'YAYicIoOO6I' },
          about: 'Inside the Wim Hof Method: cold therapy, and the life lessons that came with it.' },
        { more: true, title: 'How to never find love', note: 'With Esther Perel', poster: 'harvest-perel-love.jpg', play: { yt: 'AJOKrrDpZvA' },
          about: 'The intricacies of modern relationships, and the ways we get them wrong.' },
        { more: true, title: 'How to heal and reconnect with your family', note: 'With Esther Perel', poster: 'harvest-perel-family.jpg', play: { yt: 'NSQMFT3toJ0' },
          about: 'Esther Perel on love and family, and challenging the conventional ways we think about both.' },
        { more: true, title: 'The first lady of LSD', note: 'With Amanda Fielding', poster: 'harvest-fielding-lsd.jpg', play: { yt: 'VXLcHPSqKb4' },
          about: 'Science, taboos and the psychedelic renaissance, and why LSD could matter for depression and Alzheimer’s.' },
        { more: true, title: 'Surviving Everest & social death', note: 'With Sandy Hill', poster: 'harvest-hill-everest.jpg', play: { yt: 'GR0yuqYqG3o' },
          about: 'Surviving the mountain, and then surviving what was written about it.' },
        { more: true, title: 'From civil war to civil duty', note: 'With Dennis Okwera', poster: 'harvest-okwera.jpg', play: { yt: 'a-892HMUoK4' },
          about: 'Escaping the rebels in war-torn Uganda as a child, and what he chose to do with the rest of it.' }
      ]
    },
    {
      name: 'Athena Advisers',
      sector: 'Prime property · Social',
      min: '240px',
      ratio: '9 / 16',
      items: [
        { title: 'Reel 01', note: 'Instagram reel', poster: 'athena-c2p.jpg', play: { ig: 'C2PHGqrrEIo' },
          about: 'Alpine adviser Alex Montier on investing in the world’s largest ski domain.' },
        { title: 'Reel 02', note: 'Instagram reel', poster: 'athena-c0g.jpg', play: { ig: 'C0g6U3wKjuv' },
          about: 'Why Ericeira has been on the rise, and what surfing did to the Portuguese coast.' },
        { title: 'Reel 03', note: 'Instagram reel', poster: 'athena-c0r.jpg', play: { ig: 'C0RRQFTqHke' },
          about: 'Three of Portugal’s rising destinations for investors and second-home owners.' },
        { title: 'Reel 04', note: 'Instagram reel', poster: 'athena-czg.jpg', play: { ig: 'CzG13Xnq8lu' },
          about: 'The Investment Journey, episode two: how Portes du Soleil became a ski domain of its size.' },
        { title: 'Reel 05', note: 'Instagram reel', poster: 'athena-cvh.jpg', play: { ig: 'CvhsfUKq5OZ' },
          about: 'How the hills of Lisbon shaped neighbourhoods with their own distinct character.' },
        { title: 'Feature 01', note: 'Instagram reel', poster: 'athena-c0t.jpg', play: { ig: 'C0T-NvdqhiY' },
          about: 'Ericeira: Europe’s only World Surf Reserve, with seven breaks in four miles.' },
        { title: 'Feature 02', note: 'Instagram reel', poster: 'athena-cyq.jpg', play: { ig: 'CyQlAxAKwzK' },
          about: 'Launching The Investment Journey, a series of conversations hosted by Neil.' }
      ]
    }
  ];

  /* ======================================================================
     RENDER
     ====================================================================== */

  const library = $('#library');
  const foot = $('#library-foot');

  GROUPS.forEach((gp) => {
    const sec = document.createElement('section');
    sec.className = 'group';

    const head = document.createElement('div');
    head.className = 'group__head';
    head.innerHTML = '<h2>' + esc(gp.name) + '</h2><span class="group__sector">' + esc(gp.sector) + '</span>';
    sec.appendChild(head);

    // Two grids per group: what shows straight away, and what waits behind
    // "Show more". A group that is entirely extra hides its heading too.
    const grid = document.createElement('div');
    const more = document.createElement('div');
    [grid, more].forEach((g) => {
      g.className = 'group__grid';
      g.style.setProperty('--card-min', gp.min);
      g.dataset.shape = gp.ratio === '16 / 9' ? 'wide' : 'tall';
    });
    more.classList.add('group__grid--more');
    more.hidden = true;

    gp.items.forEach(({ more: isMore, title, note, poster, play: player, about }) => {
      const el = document.createElement(player ? 'button' : 'div');
      el.className = 'piece';
      if (player) { el.type = 'button'; el.setAttribute('aria-label', 'Play ' + title); }

      el.innerHTML =
        '<div class="piece__frame" style="--ratio:' + gp.ratio + '">' +
          '<div class="poster">' +
            '<div class="poster__ph">' + window.HES.posterCover(poster) + '</div>' +
            '<img src="/assets/posters/' + esc(poster) + '" alt="" loading="lazy">' +
          '</div>' +
          (player ? '<span class="piece__play" aria-hidden="true">&#9654;</span>' : '') +
          '<span class="poster-hover piece__about' + (player ? ' poster-hover--playable' : '') + '" aria-hidden="true"><span>' + esc(about || note) + '</span></span>' +
        '</div>' +
        '<div class="piece__meta"><b>' + esc(title) + '</b><span>' + esc(note) + '</span></div>';

      const img = $('img', el);
      img.addEventListener('load', () => img.classList.add('is-loaded'));
      if (player) el.addEventListener('click', () => openPlayer(player, title));

      (isMore ? more : grid).appendChild(el);
    });

    if (grid.children.length) sec.appendChild(grid);
    if (more.children.length) sec.appendChild(more);
    if (!grid.children.length) { sec.hidden = true; sec.classList.add('group--more'); }
    library.insertBefore(sec, foot);
  });

  /* --- Show more ---------------------------------------------------------
     Everything is in the page from the start; this only reveals it, so the
     extra pieces are still in the markup for anyone without JavaScript. */
  const hiddenGrids = $$('.group__grid--more');
  const hiddenGroups = $$('.group--more');
  const extraCount = hiddenGrids.reduce((n, g) => n + g.children.length, 0);

  if (extraCount) {
    const wrap = document.createElement('div');
    wrap.className = 'work__more';
    const btn = document.createElement('button');
    btn.className = 'btn-outline work__more-btn';
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = 'Show ' + extraCount + ' more';
    wrap.appendChild(btn);
    library.insertBefore(wrap, foot);

    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Show less' : 'Show ' + extraCount + ' more';
      hiddenGrids.forEach((g) => { g.hidden = !open; });
      hiddenGroups.forEach((g) => { g.hidden = !open; });
      if (!open) library.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ======================================================================
     REEL PLAYER
     ====================================================================== */

  const reel = $('#reel');
  const reelFrame = $('#reel-frame');
  const reelClose = $('#reel-close');
  let lastFocus = null;

  function frameFor(player, title) {
    if (player.ig) return ['9 / 16', '<iframe src="https://www.instagram.com/reel/' + esc(player.ig) + '/embed/" title="' + esc(title) + '" allow="autoplay; encrypted-media"></iframe>'];
    if (player.yt) return ['16 / 9', '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(player.yt) + '?autoplay=1&rel=0&modestbranding=1" title="' + esc(title) + '" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>'];
    return ['16 / 9', '<iframe src="https://player.vimeo.com/video/' + esc(player.vimeo) + '?autoplay=1&dnt=1&title=0&byline=0&portrait=0" title="' + esc(title) + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>'];
  }

  function openPlayer(player, title) {
    lastFocus = document.activeElement;
    const [ratio, html] = frameFor(player, title);
    const portrait = ratio === '9 / 16';
    // Portrait reels are sized off the viewport height, films off its width.
    reelFrame.style.aspectRatio = ratio;
    reelFrame.style.height = portrait ? 'min(86vh, 760px)' : 'auto';
    reelFrame.style.width = portrait ? 'auto' : 'min(1200px, 100%, calc((100vh - 160px) * 16 / 9))';
    reelFrame.innerHTML = html;
    reel.setAttribute('aria-label', title);
    reel.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    reelClose.focus();
  }

  function closeReel() {
    if (reel.hidden) return;
    reel.hidden = true;
    reelFrame.innerHTML = '';
    document.documentElement.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  reelClose.addEventListener('click', closeReel);
  reel.addEventListener('click', (e) => { if (!e.target.closest('.reel__frame')) closeReel(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeReel(); });
})();
