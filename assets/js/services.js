/* High Elm Studio — services.
   One 920vh pinned canvas carries the whole journey: the crowd orbits the
   brand, a followed guest passes through the gate into the booked rows,
   returning guests refer new ones, and the dots settle into the leaf.

   Scroll drives everything. `s` runs 0 → 3.6 across the track:
     0–1  Engage    1–2  Convert    2–3  Return    3–3.6  the leaf. */
(function () {
  'use strict';

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const cl = (v) => Math.max(0, Math.min(1, v));
  const E = (v) => { v = cl(v); return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2; };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const track = $('#journey');
  if (!track) return;

  const canvas = $('#journey-canvas');
  const capEl = $('#journey-cap');
  const bar = $('#journey-bar');
  const figs = $$('.journey__fig');
  const revs = $$('[data-rv]');

  // The running tally. Illustrative, but the rates behind it are not:
  // 2.5% of those reached enquire, 25% of enquiries book, 22% come back.
  const TALLY = [12400, 310, 78, 17];

  // Scratch state the draw reads.
  let capRect = null;
  let loopPts = [];
  let logoCache = {};
  let trailCanvas = null, trailFresh = false, lastS = null;

  /* --- Deterministic pseudo-random, so dots keep their identity ---------- */
  function rnd(i) {
    const a = Math.sin(i * 12.9898) * 43758.5453;
    const b = Math.sin(i * 78.233) * 12345.678;
    return [a - Math.floor(a), b - Math.floor(b)];
  }

  function label(g, txt, x, y, al, col) {
    if (al <= 0.01) return;
    g.globalAlpha = al;
    g.fillStyle = col;
    g.font = '500 10px "Plus Jakarta Sans", sans-serif';
    g.textAlign = 'center';
    g.fillText(txt.split('').join(String.fromCharCode(8202)), x, y);
    g.globalAlpha = 1;
  }

  /* --- The leaf, as N points: outline first, then a packed interior ------ */
  function makeLogo(N) {
    if (logoCache[N]) return logoCache[N];
    const segs = [[30,4,42,9,50,20],[50,20,58,32,59,47],[59,47,60,62,55,74],[55,74,48,86,30,93],[30,93,12,86,5,74],[5,74,0,62,1,47],[1,47,2,32,10,20],[10,20,18,9,30,4]];
    const nOut = Math.round(N * 0.36), out = [];
    for (let k = 0; k < nOut; k++) {
      const f = k / nOut * segs.length, si = Math.floor(f), r = f - si;
      const [x0, y0, qx, qy, x1, y1] = segs[si];
      out.push([
        (1 - r) * (1 - r) * x0 + 2 * (1 - r) * r * qx + r * r * x1,
        (1 - r) * (1 - r) * y0 + 2 * (1 - r) * r * qy + r * r * y1
      ]);
    }
    const c = document.createElement('canvas').getContext('2d');
    const p = new Path2D('M30,4 Q42,9 50,20 Q58,32 59,47 Q60,62 55,74 Q48,86 30,93 Q12,86 5,74 Q0,62 1,47 Q2,32 10,20 Q18,9 30,4Z');
    const need = N - nOut;
    let sp = Math.sqrt(3600 / need), pts = [];
    for (let tries = 0; tries < 14; tries++) {
      pts = []; let row = 0;
      for (let y = 4 + sp * 0.6; y < 93; y += sp * 0.87, row++) {
        for (let x = (row % 2 ? sp / 2 : 0) + 1; x < 60; x += sp) {
          if (Math.abs(x - 30) < 2.6) continue; // keep the midrib clear
          if ([[x, y], [x + 2.4, y], [x - 2.4, y], [x, y + 2.4], [x, y - 2.4]].every((q) => c.isPointInPath(p, q[0], q[1]))) pts.push([x, y]);
        }
      }
      if (pts.length >= need && pts.length <= need * 1.08) break;
      sp *= pts.length > need ? 1.04 : 0.96;
    }
    const inner = [];
    for (let k = 0; k < need; k++) inner.push(pts.length ? pts[Math.floor(k * pts.length / need)] : [30, 50]);
    return (logoCache[N] = out.concat(inner));
  }

  /* --- The journey ------------------------------------------------------- */
  function journey(g, W, H, t, s, P) {
    const l0 = cl(s), l1 = cl(s - 1), l2 = cl(s - 2), l3 = cl((s - 3) / 0.6);
    const m1 = E(s / 0.6), m2 = E((s - 1) / 0.6), m3 = E((s - 2) / 0.6), m4 = E(l3);

    g.fillStyle = P.bg;
    g.fillRect(0, 0, W, H);

    let tg = null;
    if (P.trails) {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (!trailCanvas || trailCanvas.width !== Math.round(W * dpr) || trailCanvas.height !== Math.round(H * dpr)) {
        trailCanvas = document.createElement('canvas');
        trailCanvas.width = Math.round(W * dpr);
        trailCanvas.height = Math.round(H * dpr);
        trailFresh = true;
      }
      tg = trailCanvas.getContext('2d');
      tg.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (trailFresh || Math.abs(s - (lastS == null ? s : lastS)) > 0.15) { tg.fillStyle = P.bg; tg.fillRect(0, 0, W, H); trailFresh = false; }
      lastS = s;
      tg.fillStyle = 'rgba(250,248,244,0.04)';
      tg.fillRect(0, 0, W, H);
      g.drawImage(trailCanvas, 0, 0, W, H);
    }

    const nar = W < 728;
    const cx = nar ? W / 2 : W * 0.62;
    const cy = nar ? H * 0.34 : H * 0.46;
    const M = nar ? Math.min(W * 0.9, H * 0.5) : Math.min(W * 0.62, H * 0.86);
    const L = (A, B2, m) => [A[0] + (B2[0] - A[0]) * m, A[1] + (B2[1] - A[1]) * m];

    const gx = cx - M * 0.18;                    // the gate
    const gw = M * 0.34 * (1 - l1 * 0.75);       // which narrows as we convert
    const conv = 0.3 + 0.55 * l1;                // share of the crowd that passes
    const RR = M * 0.38;                         // the return ring

    const B = L(L(L([cx, cy], [gx, cy], m2), [cx, cy - RR], m3), [cx, cy - M * 0.36], m4);

    const ring = (x, y, r, a) => {
      if (a <= 0.003) return;
      g.strokeStyle = 'rgba(' + P.ink + ',' + a.toFixed(3) + ')';
      g.lineWidth = 1;
      g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke();
    };

    if (P.glow) {
      const gr = g.createRadialGradient(B[0], B[1], 2, B[0], B[1], M * 0.5);
      gr.addColorStop(0, 'rgba(250,248,244,' + (0.09 * (0.3 + l0)).toFixed(3) + ')');
      gr.addColorStop(1, 'rgba(250,248,244,0)');
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
    }

    const amp = (0.25 + l0 * 0.75) * (1 - m2 * 0.7) * (1 - m4);
    if (!P.trails) for (let k = 0; k < 3; k++) { const ph = (t / 2.6 + k / 3) % 1; ring(B[0], B[1], 6 + ph * M * 0.5, (1 - ph) * 0.2 * amp); }

    // The gate posts
    if (m2 > 0.05 && m3 < 0.95) {
      g.strokeStyle = 'rgba(' + P.ink + ',' + (m2 * (1 - m3) * 0.5).toFixed(3) + ')';
      g.beginPath();
      g.moveTo(gx, cy - gw / 2 - 34); g.lineTo(gx, cy - gw / 2);
      g.moveTo(gx, cy + gw / 2); g.lineTo(gx, cy + gw / 2 + 34);
      g.stroke();
    }

    if (!P.trails) ring(cx, cy, RR, 0.07 * m3 * (1 - m4));

    const N = P.links ? 160 : 260, pts = [];
    loopPts = [];
    const LG = makeLogo(N), lsc = M * 0.74 / 89;
    const logoAt = (i) => [cx + (LG[i][0] - 30) * lsc, cy - M * 0.04 + (LG[i][1] - 48.5) * lsc];

    let hero = null;
    for (let i = 0; i < N; i++) {
      const isH = i === 7, u = i / N;
      const [axr, ayr] = rnd(i);
      const rx = isH ? 0.18 : axr, ry = isH ? 0.12 : ayr, z = rnd(i + 999)[0];

      const wan = [rx * W + Math.sin(t * 0.45 + i) * 18, ry * H + Math.cos(t * 0.38 + i * 1.3) * 18];
      const pull = E((l0 * 1.25 - ry) / 0.3);
      const oa = u * Math.PI * 14 + t * (0.18 + ry * 0.2), orad = M * (0.08 + ry * 0.22);
      const F1 = L(wan, [cx + Math.cos(oa) * orad * 1.25, cy + Math.sin(oa) * orad], pull);

      const f = isH
        ? (l1 < 0.62 ? 0.47 * E(cl((l1 - 0.22) / 0.4))
          : l1 < 0.8 ? 0.47 + 0.08 * cl((l1 - 0.62) / 0.18)
          : 0.55 + 0.445 * E(cl((l1 - 0.8) / 0.18)))
        : (u + t * 0.045) % 1;
      const passes = isH || ry < conv;

      const ff = f * 2, sx0 = isH ? 70 : -24;
      const src = [sx0 + ff * (gx - sx0), cy - 70 * (1 - ff) + (rx - 0.5) * H * 0.42 * (1 - ff) + (rx - 0.5) * gw * ff];
      const sp = Math.min(14, M * 0.035);
      const slot = [cx + M * 0.22 + (i % 8) * sp, cy - sp * 4 + (Math.floor(i / 8) % 9) * sp];

      let F2, al2;
      if (f < 0.5) { F2 = src; al2 = 0.12 + f * 1.5; }
      else if (passes) { F2 = L([gx, cy + (rx - 0.5) * gw], slot, E((f - 0.5) / 0.28)); al2 = 0.9; }
      else { const d = (f - 0.5) * 2; F2 = [gx + d * M * 0.2, cy + (rx - 0.5) * gw + d * d * M * 0.6]; al2 = 0.5 * (1 - d); }

      const cover = 0.3 + 0.7 * E(l2), inner = (i % 3 === 0) ? E((l2 - 0.4) / 0.5) : 0;
      const la = -Math.PI / 2 + u * Math.PI * 2 * cover + (isH ? t * 0.07 : t * (0.16 + m4 * 0.5));
      const rr = RR * (1 - 0.32 * inner);
      const F3 = [cx + Math.cos(la) * rr * 1.2, cy + Math.sin(la) * rr];
      const sw = E((l3 - rnd(i + 77)[0] * 0.35) / 0.6);
      const m3x = isH ? E((s - 2) / 0.95) : m3;

      let q = L(wan, F1, m1); q = L(q, F2, m2); q = L(q, F3, m3x); q = L(q, logoAt(i), sw);

      let al = 0.18 + 0.7 * pull;
      al = al + (al2 - al) * m2;
      al = al + (0.75 - al) * m3;
      al = al + (0.95 - al) * sw;

      // Dots behind the caption fade back, so the copy stays readable.
      if (capRect && q[0] > capRect.left - 24 && q[0] < capRect.right + 24 && q[1] > capRect.top - 24 && q[1] < capRect.bottom + 24) al *= 0.12 + 0.88 * sw;

      if (isH) { hero = q; continue; }

      let r = 1.5 * (m2 > 0 && m3 < 1 && f < 0.5 ? 1 - m2 * (1 - m3) * (0.5 - f) : 1);
      if (P.depth) {
        const dz = (1 - pull * 0.6) * (1 - m2);
        r = 0.8 + z * 3.2 * dz + 1.2 * (1 - dz);
        al *= 0.35 + 0.65 * (1 - Math.abs(z - 0.5) * 1.4 * dz);
      }
      if (P.links) { pts.push([q[0], q[1], al]); if (passes && m3 > 0.3) loopPts.push(q); }

      g.fillStyle = 'rgba(' + P.ink + ',' + Math.max(0, al).toFixed(2) + ')';
      g.beginPath(); g.arc(q[0], q[1], r, 0, 7); g.fill();
      if (tg) { tg.fillStyle = 'rgba(' + P.ink + ',' + (Math.max(0, al) * 0.5).toFixed(3) + ')'; tg.beginPath(); tg.arc(q[0], q[1], r * 0.9, 0, 7); tg.fill(); }
    }

    // Threads between near neighbours
    if (P.links) {
      g.lineWidth = 0.6;
      const maxD = 48 + 20 * m3;
      for (let a = 0; a < pts.length; a++) for (let b = a + 1; b < pts.length; b++) {
        const dx = pts[a][0] - pts[b][0], dy = pts[a][1] - pts[b][1], d2 = dx * dx + dy * dy;
        if (d2 < maxD * maxD) {
          const al = (1 - Math.sqrt(d2) / maxD) * Math.min(pts[a][2], pts[b][2]) * 0.5 * (1 - 0.75 * m4);
          if (al > 0.02) {
            g.strokeStyle = 'rgba(' + P.ink + ',' + al.toFixed(3) + ')';
            g.beginPath(); g.moveTo(pts[a][0], pts[a][1]); g.lineTo(pts[b][0], pts[b][1]); g.stroke();
          }
        }
      }
    }

    // Referrals: a thread draws out, an enquiry follows it in, the referrer shows +1
    if (P.links && loopPts.length && m3 > 0.3) {
      const ra = E((l2 - 0.15) / 0.3) * (1 - m4), lp = loopPts, NR = 5;
      for (let j = 0; j < NR; j++) {
        const par = lp[(j * 23 + 5) % lp.length], ph = (t / 6.5 + j / NR) % 1;
        const dir = Math.atan2(par[1] - cy, par[0] - cx) + (rnd(j + 500)[0] - 0.5) * 0.5, far = M * 0.34;
        const st = [par[0] + Math.cos(dir) * far, par[1] + Math.sin(dir) * far];
        const pulse = cl(ph / 0.15), out = E(cl((ph - 0.12) / 0.25)), travel = E(cl((ph - 0.5) / 0.38)), arrive = cl((ph - 0.88) / 0.12);

        if (ph < 0.2) ring(par[0], par[1], 4 + pulse * 18, ra * (1 - pulse) * 0.8);
        const tip = L(par, st, out), nd = L(st, par, travel);
        if (out > 0 && arrive < 1) {
          g.strokeStyle = 'rgba(' + P.ink + ',' + (0.55 * ra * (1 - arrive)).toFixed(3) + ')';
          g.lineWidth = 1;
          g.beginPath(); g.moveTo(par[0], par[1]); g.lineTo(travel > 0 ? nd[0] : tip[0], travel > 0 ? nd[1] : tip[1]); g.stroke();
        }
        const appear = cl((ph - 0.32) / 0.1);
        if (appear > 0 && arrive < 1) {
          const fillA = travel;
          g.strokeStyle = 'rgba(' + P.ink + ',' + (0.9 * ra * appear).toFixed(3) + ')';
          g.lineWidth = 1.2;
          g.beginPath(); g.arc(nd[0], nd[1], 5, 0, 7); g.stroke();
          g.fillStyle = 'rgba(' + P.ink + ',' + (0.9 * ra * appear * fillA).toFixed(3) + ')';
          g.beginPath(); g.arc(nd[0], nd[1], 2.4 + fillA, 0, 7); g.fill();
          if (j === 0 && ph < 0.82) label(g, 'REFERRAL ENQUIRY', nd[0], nd[1] - 14, ra * appear * (1 - cl((ph - 0.72) / 0.1)), P.lab);
        }
        if (arrive > 0) {
          ring(par[0], par[1], 4 + arrive * 16, ra * (1 - arrive) * 0.8);
          label(g, '+1', par[0], par[1] - 14 - arrive * 8, ra * Math.sin(arrive * Math.PI), P.lab);
        }
      }
      label(g, 'RETURNING GUESTS REFER NEW ONES', cx, cy + RR + 34, ra, P.lab);
    }

    // The brand itself
    const beat = m3 > 0.3 && m4 < 0.5 ? 1 + 0.5 * Math.pow(Math.max(0, Math.sin(t * 2.4)), 6) : 1;
    g.fillStyle = 'rgba(' + P.ink + ',1)';
    g.globalAlpha = Math.min(1, 0.4 + l0) * (1 - m4);
    g.beginPath(); g.arc(B[0], B[1], 4 * beat, 0, 7); g.fill();
    g.globalAlpha = 1;

    const lab = (txt, x, y, a) => label(g, txt, x, y, a, P.lab);

    // The one guest we follow all the way through
    if (hero && m4 < 0.98) {
      const ha = 1 - m4;
      g.globalAlpha = ha;
      g.fillStyle = 'rgba(' + P.ink + ',1)';
      g.beginPath(); g.arc(hero[0], hero[1], 3.6, 0, 7); g.fill();
      g.globalAlpha = 1;
      ring(hero[0], hero[1], 9 + Math.sin(t * 2) * 1.5, 0.45 * ha);
      lab(s < 0.6 ? 'ONE GUEST' : s < 1.05 ? 'NOTICED' : s < 1.88 ? 'ENQUIRING' : s < 2.3 ? 'BOOKED' : 'COMING BACK', hero[0], hero[1] - 18, 0.9 * ha * cl(s / 0.15));
    }

    lab('YOUR BRAND', cx, cy + M * 0.34, E((l0 - 0.2) / 0.2) * (1 - m2));
    lab('ENQUIRY', gx, cy + gw / 2 + 52, m2 * (1 - m3));
    lab('THEY COME BACK', cx, cy + 4, m3 * (1 - m4) * E((l2 - 0.3) / 0.3));
  }

  /* --- Frame ------------------------------------------------------------- */
  function frame(now) {
    requestAnimationFrame(frame);

    // Under reduced motion the journey still answers the scroll, but nothing
    // moves on its own: the clock stays at zero.
    const t = reduced ? 0 : now / 1000;
    const vh = innerHeight;
    const TR = track.getBoundingClientRect();
    const P = cl(-TR.top / Math.max(1, TR.height - vh));
    const s = P * 3.6;

    if (bar) bar.style.width = (P * 100).toFixed(2) + '%';

    revs.forEach((el) => {
      const i = +el.dataset.rv, th = +el.dataset.th, l = s - i;
      const inA = cl((l - th) / 0.1), out = i < 3 ? cl((l - 0.88) / 0.1) : 0, v = inA * (1 - out);
      el.style.opacity = v.toFixed(3);
      el.style.transform = 'translateY(' + ((1 - inA) * 18 - out * 18).toFixed(1) + 'px)';
      el.style.filter = v > 0.98 ? 'none' : 'blur(' + ((1 - v) * 5).toFixed(1) + 'px)';
    });

    const l0 = cl(s), l1 = cl(s - 1), l2 = cl(s - 2);
    const tv = [
      TALLY[0] * E(l0),
      TALLY[1] * E(l1 / 0.5),
      TALLY[2] * E((l1 - 0.35) / 0.6),
      TALLY[3] * E(l2 / 0.8)
    ];
    tv.forEach((v, i) => {
      const fig = figs[i];
      if (!fig) return;
      fig.querySelector('b').textContent = Math.round(v).toLocaleString('en-GB');
      fig.classList.toggle('is-on', v > 0.5);
    });

    if (!canvas || TR.bottom < 0 || TR.top > vh) return;

    const r = canvas.getBoundingClientRect(), W = r.width, H = r.height;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    }
    const g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cb = capEl ? capEl.getBoundingClientRect() : null;
    capRect = cb ? { left: cb.left - r.left, right: cb.right - r.left, top: cb.top - r.top, bottom: cb.bottom - r.top } : null;

    journey(g, W, H, t, s, { bg: '#FAF8F4', ink: '12,21,32', lab: '#5E6670', links: true });
  }

  requestAnimationFrame(frame);
})();
