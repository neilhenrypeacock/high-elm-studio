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
     [title, note, poster, instagramReelId?]
     Without a reel id a piece is a still only.
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
        ['A Portrait of Spain', 'Destination film', 'spain.jpg']
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
        ['Reel 01', 'Instagram reel', 'athena-c2p.jpg', 'C2PHGqrrEIo'],
        ['Reel 02', 'Instagram reel', 'athena-c0g.jpg', 'C0g6U3wKjuv'],
        ['Reel 03', 'Instagram reel', 'athena-c0r.jpg', 'C0RRQFTqHke'],
        ['Reel 04', 'Instagram reel', 'athena-czg.jpg', 'CzG13Xnq8lu'],
        ['Reel 05', 'Instagram reel', 'athena-cvh.jpg', 'CvhsfUKq5OZ'],
        ['Feature 01', 'Instagram reel', 'athena-c0t.jpg', 'C0T-NvdqhiY'],
        ['Feature 02', 'Instagram reel', 'athena-cyq.jpg', 'CyQlAxAKwzK']
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

    gp.items.forEach(([title, note, poster, reel]) => {
      const el = document.createElement(reel ? 'button' : 'div');
      el.className = 'piece';
      if (reel) { el.type = 'button'; el.setAttribute('aria-label', 'Play ' + title); }

      el.innerHTML =
        '<div class="piece__frame" style="--ratio:' + gp.ratio + '">' +
          '<div class="poster">' +
            '<div class="poster__ph">Drop still:<br>' + esc(title) + '</div>' +
            '<img src="/assets/posters/' + esc(poster) + '" alt="" loading="lazy">' +
          '</div>' +
          (reel ? '<span class="piece__play" aria-hidden="true">&#9654;</span>' : '') +
        '</div>' +
        '<div class="piece__meta"><b>' + esc(title) + '</b><span>' + esc(note) + '</span></div>';

      const img = $('img', el);
      img.addEventListener('load', () => img.classList.add('is-loaded'));
      if (reel) el.addEventListener('click', () => openReel(reel, title));

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

  function openReel(id, title) {
    lastFocus = document.activeElement;
    reelFrame.innerHTML = '<iframe src="https://www.instagram.com/reel/' + esc(id) + '/embed/" title="' + esc(title) + '" allow="autoplay; encrypted-media"></iframe>';
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
