/* High Elm Studio — work.
   Grouped by client. Each piece shows a still; the ones with a video ID are
   buttons that open the reel player. The rest are plain figures, so nothing
   announces itself as a control that does nothing.

   Posters live in /assets/posters/ and are shared with the homepage, so a
   film that appears on both pages needs only one still. */
(function () {
  'use strict';

  const $ = (s, r) => (r || document).querySelector(s);
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
        { title: 'Gabor Maté on trauma', note: 'Harvest Series. 18K likes', poster: 'gabor-mate.jpg' },
        { title: 'Convento de Cristo', note: 'Autumn Equinox gathering', poster: 'convento-de-cristo.jpg' }
      ]
    },
    {
      name: 'The Safari Edit',
      sector: 'Safari travel · Social',
      min: '240px',
      ratio: '9 / 16',
      items: [
        { title: 'Bazaruto Archipelago', note: 'Destination reel', poster: 'bazaruto.jpg' },
        { title: 'Okavango Delta', note: 'Destination reel', poster: 'okavango.jpg' }
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

    const grid = document.createElement('div');
    grid.className = 'group__grid';
    grid.style.setProperty('--card-min', gp.min);
    grid.dataset.shape = gp.ratio === '16 / 9' ? 'wide' : 'tall';

    gp.items.forEach(({ title, note, poster, play: player, about }) => {
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

      grid.appendChild(el);
    });

    sec.appendChild(grid);
    library.insertBefore(sec, foot);
  });

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
