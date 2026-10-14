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

  const GROUPS = [
    {
      name: 'Black Tomato',
      sector: 'Luxury travel · Film',
      min: '420px',
      ratio: '16 / 9',
      items: [
        ['Get Lost', 'Award-winning campaign', 'get-lost.jpg'],
        ['Norway: Life at the edge of the world', 'Destination film', 'norway.jpg'],
        ['A Portrait of Spain', 'Destination film', 'spain.jpg', { vimeo: '302174238' }]
      ]
    },
    {
      name: 'Harvest Series',
      sector: 'Events · Social',
      min: '240px',
      ratio: '9 / 16',
      items: [
        ['Gabor Maté on trauma', '18K likes', 'gabor-mate.jpg'],
        ['Convento de Cristo', 'Autumn Equinox gathering', 'convento-de-cristo.jpg']
      ]
    },
    {
      name: 'The Safari Edit',
      sector: 'Safari travel · Social',
      min: '240px',
      ratio: '9 / 16',
      items: [
        ['Bazaruto Archipelago', 'Destination reel', 'bazaruto.jpg'],
        ['Okavango Delta', 'Destination reel', 'okavango.jpg']
      ]
    },
    {
      name: 'Athena Advisers',
      sector: 'Prime property · Social',
      min: '240px',
      ratio: '9 / 16',
      items: [
        ['Reel 01', 'Instagram reel', 'athena-c2p.jpg', { ig: 'C2PHGqrrEIo' }],
        ['Reel 02', 'Instagram reel', 'athena-c0g.jpg', { ig: 'C0g6U3wKjuv' }],
        ['Reel 03', 'Instagram reel', 'athena-c0r.jpg', { ig: 'C0RRQFTqHke' }],
        ['Reel 04', 'Instagram reel', 'athena-czg.jpg', { ig: 'CzG13Xnq8lu' }],
        ['Reel 05', 'Instagram reel', 'athena-cvh.jpg', { ig: 'CvhsfUKq5OZ' }],
        ['Feature 01', 'Instagram reel', 'athena-c0t.jpg', { ig: 'C0T-NvdqhiY' }],
        ['Feature 02', 'Instagram reel', 'athena-cyq.jpg', { ig: 'CyQlAxAKwzK' }]
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

    gp.items.forEach(([title, note, poster, player]) => {
      const el = document.createElement(player ? 'button' : 'div');
      el.className = 'piece';
      if (player) { el.type = 'button'; el.setAttribute('aria-label', 'Play ' + title); }

      el.innerHTML =
        '<div class="piece__frame" style="--ratio:' + gp.ratio + '">' +
          '<div class="poster">' +
            '<div class="poster__ph"><svg viewBox="0 0 60 100" aria-hidden="true" fill="none"><path d="M30,4 Q42,9 50,20 Q58,32 59,47 Q60,62 55,74 Q48,86 30,93 Q12,86 5,74 Q0,62 1,47 Q2,32 10,20 Q18,9 30,4Z" stroke="currentColor" stroke-width="2.5"></path><g stroke="currentColor" stroke-linecap="round" stroke-width="1.8"><line x1="30" y1="8" x2="30" y2="89"></line><line x1="30" y1="28" x2="44" y2="35"></line><line x1="30" y1="45" x2="49" y2="53"></line><line x1="30" y1="62" x2="48" y2="69"></line><line x1="30" y1="28" x2="16" y2="35"></line><line x1="30" y1="45" x2="11" y2="53"></line><line x1="30" y1="62" x2="12" y2="69"></line></g></svg></div>' +
            '<img src="/assets/posters/' + esc(poster) + '" alt="" loading="lazy">' +
          '</div>' +
          (player ? '<span class="piece__play" aria-hidden="true">&#9654;</span>' : '') +
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
