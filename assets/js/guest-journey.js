/* High Elm Studio — the guest journey.

   One guest, Clara, walked along a single line in world units: ten units per
   chapter. The line waves, loops once round the island for the stay, waves
   again, then arcs back to the gate for the return. The camera follows her.

   Scroll drives everything. `p` runs roughly -0.7 to 11.45 across the track,
   and uC = p * 10 is Clara's position on the line.

   The touchpoints below are the content. They must stay in step with the
   master list in the handoff (Guest Journey Touchpoints), and the chapter
   copy in the markup. */
(function () {
  'use strict';

  const track = document.querySelector('#gj-track');
  const canvas = document.querySelector('#gj-canvas');
  if (!track || !canvas) return;

  const N = 12;                   // chapters
  const uA = 60;                  // where the island sits on the line
  const r = 10 / (2 * Math.PI);   // island radius: one chapter of travel

  // [u, icon, label, day, side]
  const markers = [
    [1.5, 'ad', 'Paid media advert · first view', 0, 1], [4, 'ad', 'Second view', 2, -1], [6.5, 'ad', 'Third view · she taps', 5, 1],
    [11, 'page', 'Landing page · family villas', 5, -1], [13.5, 'ad', 'Retargeting campaign · family villas', 6, 1], [16, 'reel', 'Organic reel · a day at Kanu', 8, -1], [18.5, 'press', 'Press feature', 9, 1],
    [22, 'search', 'Search · family villa', 11, -1], [25, 'page', 'Landing page · again', 11, 1], [28, 'mail', 'Family guide · email captured', 11, -1],
    [32, 'mail', 'Welcome 1 · your guide', 11, 1], [34.5, 'mail', 'Welcome 2 · meet Ari, your host', 14, -1], [37, 'page', 'Enquiry call · brand presentation', 18, 1], [39, 'mail', 'Welcome 3 · sequence runs for months', 21, -1],
    [44, 'book', 'Books direct · Beach Villa 4', 23, -1], [47, 'mail', 'Branded confirmation · every detail', 23, 1],
    [51.5, 'page', 'Check-in · what to know before you go', 30, 1], [54.5, 'form', 'Family preferences', 60, -1], [57.5, 'mail', 'Seaplane and transfers · one message', 83, 1],
    [61, 'person', 'Met by name', 90, 1], [62.6, 'phone', 'App · tonight’s plan, tomorrow’s weather', 90, 1], [64.2, 'wave', 'Sunrise swim · booked in the app', 92, 1], [65.8, 'plate', 'Anniversary dinner · arranged quietly', 93, 1], [67.4, 'phone', 'App · a message to Ari, answered in minutes', 95, 1], [69, 'note', 'Every preference noted', 96, 1],
    [72, 'photo', 'Photographs · before she lands', 97, 1], [75, 'star', 'A note from Ari · not a survey', 100, -1],
    [80, 'mail', 'Night sky over Kanu · for Sophie', 180, 1], [83, 'mail', 'Anniversary · somewhere new?', 210, -1], [86, 'mail', 'Dry season · Villa 4 is free', 270, 1], [89, 'mail', 'A quiet note each season · for years', 330, -1],
    [92, 'share', 'Invitation for her people', 280, -1], [95, 'mail', 'Three referral enquiries', 290, 1],
    [105, 'return', 'Year 2 · booked in one email', 365, 1]
  ];

  const phases = [[0, 29, 'Acquisition'], [30, 49, 'Conversion'], [50, 58, 'Pre-arrival'], [62, 79, 'Retention'], [80, 90, 'Advocacy']];

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const t0 = performance.now();

  const cl = (x) => Math.max(0, Math.min(1, x));
  const sm = (x) => { x = cl(x); return x * x * (3 - 2 * x); };
  const wave = (x) => Math.sin(x / 20 * 6.2832) * 0.6;
  const ringC = () => [uA, wave(uA) + r];

  // Where a position along the journey sits in world coordinates.
  function pos(u) {
    const w60 = wave(uA);
    if (u < uA) return [u, wave(u)];
    if (u < 70) { const th = 1.5 * Math.PI + (u - uA) / r; return [uA + Math.cos(th) * r, w60 + r + Math.sin(th) * r]; }
    if (u < 100) { const x = u - 10; return [x, w60 + (wave(x) - w60) * sm((u - 70) / 4)]; }
    if (u < 110) {
      const f = sm((u - 100) / 10), p0 = pos(99.999), p3 = [uA, w60];
      const p1 = [p0[0] - 6, p0[1] - 7.5], p2 = [uA + 6, w60 - 7.5], m = 1 - f;
      return [m * m * m * p0[0] + 3 * m * m * f * p1[0] + 3 * m * f * f * p2[0] + f * f * f * p3[0],
              m * m * m * p0[1] + 3 * m * m * f * p1[1] + 3 * m * f * f * p2[1] + f * f * f * p3[1]];
    }
    const th = 1.5 * Math.PI + (u - 110) / r;
    return [uA + Math.cos(th) * r, w60 + r + Math.sin(th) * r];
  }

  let W = 0, H = 0, dpr = 1;
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const b = canvas.getBoundingClientRect();
    canvas.width = Math.round(b.width * dpr);
    canvas.height = Math.round(b.height * dpr);
    W = b.width; H = b.height;
  }

  let chs = null, fill = null, dayEl = null, tpEl = null;
  function cache() {
    chs = [...track.querySelectorAll('[data-ch]')].map((el) => ({
      el, i: +el.dataset.ch, tx: el.querySelector('[data-layer="text"]'),
      ats: [...el.querySelectorAll('[data-at]')].map((e) => ({ e, at: +e.dataset.at }))
    }));
    fill = track.querySelector('[data-rail-fill]');
    dayEl = track.querySelector('[data-day]');
    tpEl = track.querySelector('[data-tp]');
  }

  function wrapText(ctx, s, maxW, fs) {
    ctx.font = '500 ' + fs + 'px "Plus Jakarta Sans", sans-serif';
    const out = [];
    let line = '';
    for (const w of s.split(' ')) {
      const t = line ? line + ' ' + w : w;
      if (ctx.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t;
    }
    if (line) out.push(line);
    return out;
  }

  // Scroll-linked state the draw reads.
  let pS, cam = null, sc = 0, fwV = 0, zoomV = 0, stayR = 100, textTop = 0;

  function frame() {
    if (!chs) cache();
    if (!W || canvas.width === 0) size();

    const vh = innerHeight, rect = track.getBoundingClientRect();
    const total = Math.max(1, track.offsetHeight - vh);
    const prog = cl(-rect.top / total);
    const target = -0.7 + prog * (N - 1 + 0.7 + 0.45);
    if (pS === undefined || reduce) pS = target; else pS += (target - pS) * 0.045;
    const p = pS, t = (performance.now() - t0) / 1000;

    for (const ch of chs) {
      const d = p - ch.i;
      const a = sm((d + 0.55) / 0.4) * (ch.i === N - 1 ? 1 : 1 - sm((d - 0.32) / 0.3));
      ch.el.style.opacity = a.toFixed(3);
      ch.el.style.visibility = a < 0.005 ? 'hidden' : 'visible';
      if (a < 0.005) continue;

      // During the stay the camera owns the middle, so the copy steps aside.
      const fwT = fwV * (1 - zoomV), vw = innerWidth;
      const wide = vw >= 1200, shift = wide ? (vw - vw * 0.12 - 420) * fwT : 0;
      if (!wide) {
        const k = sm(fwT);
        ch.tx.style.bottom = (16 - 12 * k).toFixed(2) + 'vh';
        ch.ats.forEach((x) => {
          if (x.at >= 0.3) {
            x.e.style.display = k > 0.98 ? 'none' : '';
            x.e.style.maxHeight = (120 * (1 - k)).toFixed(0) + 'px';
            x.e.style.overflow = 'hidden';
            x.e.style.opacity = String(Math.min(+x.e.style.opacity || 1, 1 - k));
          }
          if (x.at === 0.15) x.e.style.fontSize = k > 0 ? 'calc(clamp(28px,3vw,44px) * ' + (1 - 0.45 * k).toFixed(3) + ')' : '';
        });
      } else if (ch.tx.style.bottom) {
        ch.tx.style.bottom = '';
        ch.ats.forEach((x) => { x.e.style.display = ''; x.e.style.maxHeight = ''; x.e.style.fontSize = ''; });
      }

      ch.tx.style.transform = 'translate(' + shift.toFixed(1) + 'px, ' + (-d * 30).toFixed(1) + 'px)';
      for (const x of ch.ats) {
        const ea = sm((d + 0.55 - x.at * 0.45) / 0.3);
        x.e.style.opacity = ea.toFixed(3);
        x.e.style.transform = 'translateY(' + ((1 - ea) * 16).toFixed(1) + 'px)';
      }
    }

    if (fill) fill.style.width = (cl(p / (N - 1)) * 100) + '%';

    // The day counter interpolates between touchpoints.
    const uC = p * 10;
    let passed = 0, day = 0;
    for (let i = 0; i < markers.length; i++) if (uC >= markers[i][0]) passed = i + 1;
    if (passed === 0) day = 0;
    else if (passed >= markers.length) day = 365;
    else {
      const a = markers[passed - 1], b = markers[passed];
      day = a[3] + (b[3] - a[3]) * cl((uC - a[0]) / (b[0] - a[0]));
    }
    const dayTxt = uC >= 100 ? 'Year 2' : 'Day ' + Math.round(day);
    if (dayEl && dayEl.textContent !== dayTxt) dayEl.textContent = dayTxt;
    const tpTxt = 'Touchpoint ' + passed + ' / ' + markers.length;
    if (tpEl && tpEl.textContent !== tpTxt) tpEl.textContent = tpTxt;

    // Keep the camera clear of the copy.
    let tt = Infinity;
    for (const ch of chs) {
      if (ch.el.style.visibility !== 'hidden') {
        const b = ch.tx.getBoundingClientRect();
        if (b.top < tt) tt = b.top;
      }
    }
    textTop = isFinite(tt) ? tt : vh;

    if (rect.bottom > 0 && rect.top < vh) draw(p, t, uC);
  }

  function icon(ctx, k, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.lineWidth = 1.1; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const L = (a, b, cc, d) => { ctx.moveTo(a, b); ctx.lineTo(cc, d); };
    const box = (bx, by, bw, bh, rr) => {
      if (ctx.roundRect) ctx.roundRect(bx, by, bw, bh, rr); else ctx.rect(bx, by, bw, bh);
    };
    ctx.beginPath();
    switch (k) {
      case 'ad': box(-9, -6, 18, 12, 2); ctx.moveTo(-2, -3); ctx.lineTo(3, 0); ctx.lineTo(-2, 3); ctx.closePath(); break;
      case 'page': ctx.rect(-6, -8, 12, 16); L(-3, -3, 3, -3); L(-3, 0, 3, 0); L(-3, 3, 1, 3); break;
      case 'reel': ctx.rect(-5, -8, 10, 16); ctx.moveTo(-1.5, -3); ctx.lineTo(2.5, 0); ctx.lineTo(-1.5, 3); ctx.closePath(); break;
      case 'press': L(-8, -6, 8, -6); L(-8, -2, 8, -2); L(-8, 2, 5, 2); L(-8, 6, 7, 6); break;
      case 'search': ctx.arc(-2, -2, 6, 0, 6.283); L(2.5, 2.5, 8, 8); break;
      case 'mail': ctx.rect(-9, -6, 18, 12); ctx.moveTo(-9, -6); ctx.lineTo(0, 2); ctx.lineTo(9, -6); break;
      case 'book': ctx.arc(0, 0, 8, 0, 6.283); ctx.moveTo(-4, 0); ctx.lineTo(-1, 3); ctx.lineTo(5, -4); break;
      case 'form': ctx.rect(-7, -8, 14, 16); ctx.rect(-4, -4, 2.5, 2.5); ctx.rect(-4, 1.5, 2.5, 2.5); L(0, -2.7, 4, -2.7); L(0, 2.7, 4, 2.7); break;
      case 'voice': [[-6, 4], [-3, 8], [0, 12], [3, 7], [6, 5]].forEach(([bx, bh]) => L(bx, -bh / 2, bx, bh / 2)); break;
      case 'person': ctx.arc(0, -4, 3, 0, 6.283); ctx.moveTo(-6, 7); ctx.arc(0, 7, 6, Math.PI, 0); break;
      case 'wave':
        ctx.moveTo(-9, 0); for (let i = -9; i <= 9; i += 1) ctx.lineTo(i, Math.sin(i / 9 * Math.PI * 2) * 3);
        ctx.moveTo(-9, 5); for (let i = -9; i <= 9; i += 1) ctx.lineTo(i, 5 + Math.sin(i / 9 * Math.PI * 2) * 3);
        break;
      case 'plate': ctx.arc(0, 0, 8, 0, 6.283); ctx.moveTo(3, 0); ctx.arc(0, 0, 3, 0, 6.283); break;
      case 'note': ctx.rect(-6, -8, 12, 16); L(-3, 4, 3, -4); break;
      case 'phone': box(-5, -9, 10, 18, 2); L(-2, 6, 2, 6); break;
      case 'photo': ctx.rect(-9, -6, 18, 12); ctx.moveTo(3, 0); ctx.arc(0, 0, 3, 0, 6.283); break;
      case 'star':
        for (let i = 0; i < 10; i++) { const rr = i % 2 ? 3.5 : 8, an = -Math.PI / 2 + i * Math.PI / 5; ctx[i ? 'lineTo' : 'moveTo'](Math.cos(an) * rr, Math.sin(an) * rr); }
        ctx.closePath(); break;
      case 'share':
        ctx.moveTo(-4, 0); ctx.arc(-6, 0, 2, 0, 6.283);
        ctx.moveTo(7, -5); ctx.arc(5, -5, 2, 0, 6.283);
        ctx.moveTo(7, 5); ctx.arc(5, 5, 2, 0, 6.283);
        L(-4.5, -1, 3.5, -4); L(-4.5, 1, 3.5, 4); break;
      case 'return': ctx.arc(0, 0, 7, 0.3, 5.6); ctx.moveTo(4, -8.5); ctx.lineTo(6.6, -3.9); ctx.lineTo(1.6, -3.5); break;
    }
    ctx.stroke();
    ctx.restore();
  }

  function draw(p, t, uC) {
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const P = '250,248,244', S = '217,211,200';
    const mob = W < 760, mid = !mob && W < 1100;
    const zoom = sm((p - 10.85) / 0.55);
    const ring = ringC();
    zoomV = zoom;

    // --- camera -----------------------------------------------------------
    const clara = pos(uC);
    const fw = sm((uC - 57) / 3) * (1 - sm((uC - 70) / 3)) + sm((uC - 110) / 1);
    fwV = fw;
    let focus = [clara[0] + (ring[0] - clara[0]) * fw, clara[1] + (ring[1] - clara[1]) * fw];
    const tTop = textTop || H, lim = Math.max(110, tTop - 96);
    let ax = W * (mid || mob ? 0.5 : 0.42 + 0.08 * fw);
    let ay = Math.min(H * (mob ? 0.3 : 0.36), lim);
    let scale = W / (mob ? 9 : mid ? 12 : 14);

    // Easing in on the island for the stay.
    if (fw > 0 && zoom < 1) {
      const wide = W >= 1200, labW = wide ? 190 : 150, stemS = (H < 700 ? 8 : 22) + 36 + 20;
      let rPx, axS, ayS;
      if (wide) {
        const region = W - W * 0.06 - 420 - 24, cap = region / 2 - labW, floor = Math.min(W, H) * 0.22;
        rPx = Math.max(60, floor, Math.min(scale * r * 2.6, (H - 170) / 2 - 56, cap));
        axS = Math.max(region / 2, rPx + labW + 60);
        ayS = Math.max(120 + rPx, H * 0.5);
      } else {
        const top = 100, bottom = H - H * 0.04 - 70;
        const vcap = (bottom - top) / 2 - stemS - 30, hcap = W / 2 - labW - stemS - 10;
        rPx = Math.max(60, Math.min(Math.min(W, H) * 0.22, vcap, hcap));
        axS = W / 2; ayS = (top + bottom) / 2;
      }
      scale = scale + (rPx / r - scale) * fw;
      ay = ay + (ayS - ay) * fw;
      ax = ax + (axS - ax) * fw;
      stayR = rPx;
    }

    // Pulling out to show the whole line in the final chapter.
    if (zoom > 0) {
      let fs = (W * (mob ? 0.9 : 0.84)) / 92;
      fs = Math.min(fs, Math.max(60, lim - 30) / 10.5);
      scale = scale + (fs - scale) * zoom;
      focus = [focus[0] + (45 - focus[0]) * zoom, focus[1] + (-2.2 - focus[1]) * zoom];
      ax = ax + (W * 0.5 - ax) * zoom;
      ay = ay + (Math.min(H * (mob ? 0.3 : 0.42), lim - 10) - ay) * zoom;
    }

    const camT = [focus[0] - ax / scale, focus[1] - ay / scale];
    if (!cam || reduce) { cam = camT; sc = scale; }
    else { cam[0] += (camT[0] - cam[0]) * 0.07; cam[1] += (camT[1] - cam[1]) * 0.07; sc += (scale - sc) * 0.07; }

    const X = (v) => (v - cam[0]) * sc;
    const Y = (v) => (v - cam[1]) * sc;

    const label = (txt, x, y, a, align, base, fsz) => {
      if (a < 0.02) return;
      ctx.font = '500 ' + (fsz || 10) + 'px "Plus Jakarta Sans", sans-serif';
      try { ctx.letterSpacing = '1.6px'; } catch (e) { /* not everywhere yet */ }
      ctx.textAlign = align || 'center';
      ctx.textBaseline = base || 'alphabetic';
      ctx.fillStyle = 'rgba(' + P + ',' + a + ')';
      ctx.fillText(txt, x, y);
    };

    // --- day and night during the stay ------------------------------------
    const stayF = cl((uC - 60) / 10), stayOn = fw * (1 - zoom) * (uC < 100 ? 1 : 0);
    if (stayOn > 0.01) {
      const bright = 0.5 + 0.5 * Math.cos(stayF * Math.PI * 4);
      const rc = [(ring[0] - cam[0]) * sc, (ring[1] - cam[1]) * sc], rp = r * sc;
      const grd = ctx.createRadialGradient(rc[0], rc[1], rp * 0.2, rc[0], rc[1], rp * 2.4);
      grd.addColorStop(0, 'rgba(' + P + ',' + (0.1 * bright * stayOn).toFixed(3) + ')');
      grd.addColorStop(1, 'rgba(' + P + ',0)');
      ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);

      const an = -Math.PI / 2 + stayF * Math.PI * 4;
      const sx = rc[0] + Math.cos(an) * rp * 1.28, sy = rc[1] + Math.sin(an) * rp * 1.28;
      ctx.lineWidth = 1;
      if (bright > 0.5) {
        ctx.fillStyle = 'rgba(' + P + ',' + (stayOn * (0.3 + bright * 0.6)).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(sx, sy, 5, 0, 6.283); ctx.fill();
      } else {
        ctx.strokeStyle = 'rgba(' + P + ',' + (stayOn * 0.8).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(sx, sy, 5, 0, 6.283); ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(' + P + ',' + (stayOn * 0.12).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(rc[0], rc[1], rp * 1.28, 0, 6.283); ctx.stroke();
    }

    // --- the line ---------------------------------------------------------
    const seg = (u0, u1, a, lw) => {
      ctx.strokeStyle = 'rgba(' + P + ',' + a + ')';
      ctx.lineWidth = lw;
      ctx.beginPath();
      let first = true;
      for (let u = u0; u <= u1 + 1e-6; u += 0.2) {
        const q = pos(Math.min(u, u1)), x = X(q[0]), y = Y(q[1]);
        if (first) { ctx.moveTo(x, y); first = false; } else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };
    seg(-8, Math.min(uC, 100), 0.16, 1);
    if (uC < 100) seg(uC, 100, 0.16, 1);
    seg(-8, Math.min(uC, 110), 0.55, 1.2);
    if (uC > 110) seg(110, Math.min(uC, 120), 0.55, 1.2);

    // --- the island -------------------------------------------------------
    const ringA = sm((uC - 52) / 6);
    if (ringA > 0.01) {
      ctx.strokeStyle = 'rgba(' + P + ',' + (0.22 * ringA).toFixed(3) + ')';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(X(ring[0]), Y(ring[1]), r * sc, 0, 6.283); ctx.stroke();
      label('KANU ISLAND', X(ring[0]), Y(ring[1]) + 4 - 10 * stayOn, 0.5 * ringA * (1 - zoom * 0.4), 'center', 'middle', mob ? 9 : 10);
      if (stayOn > 0.01) {
        ctx.font = '400 ' + Math.max(14, Math.min(30, stayR * 0.3)) + 'px "Tenor Sans", serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(' + P + ',' + (stayOn * 0.9).toFixed(3) + ')';
        ctx.fillText('Day ' + Math.min(7, 1 + Math.floor(stayF * 7)) + ' of 7', X(ring[0]), Y(ring[1]) + Math.min(18, stayR * 0.18));
      }
      label('ARRIVAL · DEPARTURE', X(ring[0]) - 16, Y(ring[1] - r) - 10, 0.5 * ringA * (1 - zoom) * (1 - fw), 'right', 'alphabetic', 9);
    }

    // --- phase brackets ---------------------------------------------------
    const topY = mob ? 76 : 96;
    for (const [a, b, name] of phases) {
      const x0 = X(a), x1 = X(b);
      if (x1 < -40 || x0 > W + 40) continue;
      const on = clara[0] >= a - 0.5 && clara[0] <= b + 0.5 && uC < 100;
      const al = (on ? 0.9 : 0.35) * (1 - fw * 0.85);
      ctx.strokeStyle = 'rgba(' + P + ',' + al * 0.4 + ')';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x0, topY + 10); ctx.lineTo(x1, topY + 10);
      ctx.moveTo(x0, topY + 6); ctx.lineTo(x0, topY + 14);
      ctx.moveTo(x1, topY + 6); ctx.lineTo(x1, topY + 14);
      ctx.stroke();
      label(name.toUpperCase(), x0, topY, al, 'left');
    }
    const arcA = sm((uC - 100) / 2);
    if (arcA > 0.01) label('RETURN', X(75), Y(wave(75) - 6.2), arcA * (uC < 100 ? 0 : 1) * 0.8, 'center');

    // --- touchpoints ------------------------------------------------------
    const stem = (mob ? 26 : 36 - 16 * zoom) + (H < 700 ? 8 : 22) * fw, lab = stem + 20;
    for (const m of markers) {
      const u = m[0], k = m[1], txt = m[2], side0 = m[4];
      const b = pos(u), bx = X(b[0]), by = Y(b[1]);
      if (bx < -120 || bx > W + 120) continue;

      const q1 = pos(u - 0.05), q2 = pos(u + 0.05);
      let tx = q2[0] - q1[0], ty = q2[1] - q1[1];
      const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
      let nx = -ty, ny = tx;
      let side = side0;
      if (u >= uA && u < 70) { const ox = b[0] - ring[0], oy = b[1] - ring[1]; side = (nx * ox + ny * oy) > 0 ? 1 : -1; }
      nx *= side; ny *= side;

      const d = uC - u, la = sm(d / 0.4), onRing = u >= uA && u < 70;
      const al = (0.28 + 0.72 * la) * (onRing ? 1 : 1 - fw * 0.6), ia = onRing ? al : al * (1 - fw);
      const gx = bx + nx * stem, gy = by + ny * stem;

      ctx.strokeStyle = 'rgba(' + P + ',' + (al * 0.35).toFixed(3) + ')';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + nx * (stem - 14), by + ny * (stem - 14)); ctx.stroke();
      ctx.fillStyle = 'rgba(' + P + ',' + al + ')';
      ctx.beginPath(); ctx.arc(bx, by, 2.2 + la * 0.8, 0, 6.283); ctx.fill();

      // a pulse as Clara passes
      if (d > 0 && d < 1.2) {
        ctx.strokeStyle = 'rgba(' + S + ',' + ((1 - d / 1.2) * 0.5).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(bx, by, 4 + d * 22, 0, 6.283); ctx.stroke();
      }

      if (zoom < 0.95 && ia > 0.01) {
        const col = 'rgba(' + P + ',' + (ia * (1 - zoom)).toFixed(3) + ')';
        ctx.save();
        ctx.translate(gx, gy); ctx.scale(1 - zoom * 0.4, 1 - zoom * 0.4); ctx.translate(-gx, -gy);
        ctx.strokeStyle = col;
        icon(ctx, k, gx, gy);
        ctx.restore();

        const lx = bx + nx * lab, ly = by + ny * lab;
        const horiz = Math.abs(nx) > 0.3;
        const la2 = ia * (1 - zoom) * (mob ? 0.9 : 1);
        const fsz = mob || (onRing && W < 1200) ? 9 : 10;
        const al2 = horiz ? (nx > 0 ? 'left' : 'right') : 'center';
        const parts = (onRing && fw > 0.2) ? wrapText(ctx, txt.toUpperCase(), W >= 1200 ? 170 : 130, fsz) : [txt];
        if (parts.length > 1) {
          const lh = 13, y0 = ly - (horiz ? (parts.length - 1) * lh / 2 : (ny < 0 ? (parts.length - 1) * lh : 0));
          parts.forEach((pt, i) => label(pt.toUpperCase(), lx, y0 + i * lh, la2, al2, horiz ? 'middle' : (ny < 0 ? 'alphabetic' : 'hanging'), fsz));
        } else {
          label(txt.toUpperCase(), lx, ly, la2, al2, horiz ? 'middle' : (ny < 0 ? 'alphabetic' : 'hanging'), fsz);
        }
      }
    }

    // --- referrals --------------------------------------------------------
    for (let k = 0; k < 3; k++) {
      const la = sm((p - 9.25 - k * 0.12) / 0.2);
      if (la < 0.01) continue;
      const f = cl((p - 9.35 - k * 0.14) / 0.9), fs = sm(f);
      let q;
      if (f >= 1) { const an = t * 0.35 + k * 2.1; q = [ring[0] + Math.cos(an) * r * 0.5, ring[1] + Math.sin(an) * r * 0.5]; }
      else {
        const uu = 92 - fs * 22, b = pos(uu);
        q = [b[0], b[1] + (k - 1) * 0.35 * (1 - fs)];
        if (fs > 0.98) q = [ring[0], ring[1] - r];
      }
      const qx = X(q[0]), qy = Y(q[1]);
      if (f < 0.1) {
        ctx.strokeStyle = 'rgba(' + S + ',' + (la * (1 - f * 10) * 0.5).toFixed(3) + ')';
        ctx.beginPath(); ctx.moveTo(X(clara[0]), Y(clara[1])); ctx.lineTo(qx, qy); ctx.stroke();
      }
      ctx.fillStyle = 'rgba(' + S + ',' + (0.5 + 0.5 * la).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(qx, qy, 2.4, 0, 6.283); ctx.fill();
      ctx.strokeStyle = 'rgba(' + S + ',' + (la * 0.35 * (1 - fs)).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(qx, qy, 7, 0, 6.283); ctx.stroke();
      if (k === 0 && f < 1) label('REFERRAL ENQUIRY', qx, qy - 14, la * 0.85 * (1 - sm((f - 0.8) / 0.2)));
    }
    if (p > 10.3) label('THREE REFERRED FAMILIES', X(ring[0]), Y(ring[1] + r) + 18, sm((p - 10.3) / 0.4) * 0.6, 'center', 'hanging', 9);

    // --- Clara ------------------------------------------------------------
    const cx0 = X(clara[0]), cy0 = Y(clara[1]);
    for (let j = 1; j < 30; j++) {
      const q = pos(uC - j * 0.08);
      ctx.fillStyle = 'rgba(' + P + ',' + ((1 - j / 30) * 0.5).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(X(q[0]), Y(q[1]), 1.4 * (1 - j / 30) + 0.4, 0, 6.283); ctx.fill();
    }
    const ga = sm((uC + 7) / 4);
    ctx.strokeStyle = 'rgba(' + P + ',' + (0.4 * ga).toFixed(3) + ')';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx0, cy0, 9 + Math.sin(t * 1.6) * 1.2, 0, 6.283); ctx.stroke();
    ctx.fillStyle = 'rgba(' + P + ',' + ga + ')';
    ctx.beginPath(); ctx.arc(cx0, cy0, 3.4, 0, 6.283); ctx.fill();
    label('CLARA', cx0, cy0 + 24, 0.8 * ga * (1 - zoom) * (1 - fw), 'center', 'hanging');
  }

  let errored = false;
  function loop() {
    try { frame(); } catch (e) { if (!errored) { errored = true; console.warn('journey', e); } }
    requestAnimationFrame(loop);
  }

  size();
  addEventListener('resize', size);
  requestAnimationFrame(loop);
})();
