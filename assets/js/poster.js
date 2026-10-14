/* High Elm Studio — generated poster covers.

   A piece without a still gets a constellation drawn from its own name:
   the same dot-and-thread motif the canvases use, so an empty frame still
   looks like part of the site. Deliberately abstract — it is a title card,
   never a stand-in for a photograph of someone's hotel.

   The moment a real JPG lands in /assets/posters/ it covers this. */
(function () {
  'use strict';
  window.HES = window.HES || {};

  // Same seed in, same picture out, so a card never changes between loads.
  function rng(seed) {
    let s = 2166136261;
    for (let i = 0; i < seed.length; i++) { s ^= seed.charCodeAt(i); s = Math.imul(s, 16777619) >>> 0; }
    return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  }

  window.HES.posterCover = function posterCover(key) {
    const r = rng(key), S = 160, N = 42, LINK = 32;
    const p = [];
    for (let i = 0; i < N; i++) p.push([+(r() * S).toFixed(1), +(r() * S).toFixed(1)]);

    let lines = '';
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = p[i][0] - p[j][0], dy = p[i][1] - p[j][1];
        const d = Math.hypot(dx, dy);
        if (d < LINK) {
          const a = (0.26 * (1 - d / LINK)).toFixed(3);
          lines += '<line x1="' + p[i][0] + '" y1="' + p[i][1] + '" x2="' + p[j][0] + '" y2="' + p[j][1] + '" stroke="currentColor" stroke-width="0.5" opacity="' + a + '"/>';
        }
      }
    }
    const dots = p.map((q, i) => '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="' + (i % 5 === 0 ? 1.5 : 1) + '" fill="currentColor" opacity="' + (i % 5 === 0 ? 0.5 : 0.34) + '"/>').join('');

    return '<svg class="poster__gen" viewBox="0 0 ' + S + ' ' + S + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + lines + dots + '</svg>';
  };
})();
