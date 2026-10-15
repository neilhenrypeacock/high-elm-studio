/* ==========================================================================
   High Elm Studio — /candide-ai
   The pinned stage: one requestAnimationFrame loop drives a 180-particle
   field that re-forms into a different diagram per scene, plus the DOM text,
   note labels and progress rail.

   Ported from the Claude Design reference "Babylonstoren Proposal v4".
   The shapes, easings and timings are final — see the handoff notes before
   changing any constant in here.

   Scroll model: y is the scroll position inside the track, in vh units.
   Each scene has a cumulative start (c0) and a length (len); the current
   scene is the last one whose c0 has been passed, and p is its 0..1
   progress. There is no IntersectionObserver — everything reads y.
   ========================================================================== */
(function () {
  'use strict';

  var IMG = '/assets/images/candide-ai/';

  /* ---- Scenes ------------------------------------------------------------
     Order, lengths and note anchors. The copy itself lives in the markup;
     notes here only carry what the animation needs: which side of the shape
     the label sits on, when it appears (o), and whether it has a photo. */
  var D = [
    { id: 'hero', len: 100, notes: [] },
    { id: 'who', len: 180, notes: [] },
    { id: 'estate', len: 200, notes: [] },
    { id: 'two', len: 200, notes: [{ side: 'b', o: 0.2 }, { side: 'b', o: 0.55 }] },
    { id: 'doors', len: 200, notes: [{ side: 'r', o: 0.05 }, { side: 'r', o: 0.1 }, { side: 'r', o: 0.15 }, { side: 'l', o: 0.2 }, { side: 'l', o: 0.25 }, { side: 'l', o: 0.3 }] },
    { id: 'centre', len: 200, notes: [{ side: 't', o: 0.15 }, { side: 't', o: 0.3 }, { side: 'b', o: 0.75 }, { side: 'r', o: 0.5 }, { side: 'r', o: 0.6 }] },
    { id: 'arrival', len: 220, notes: [{ side: 'b', o: 0.02 }, { side: 't', o: 0.24 }, { side: 'b', o: 0.42 }, { side: 't', o: 0.62 }, { side: 'b', o: 0.84 }, { side: 't', o: 1 }] },
    { id: 'cycle', len: 220, notes: [{ side: 'b', o: 0 }, { side: 'b', o: 0.55, img: 1 }, { side: 'b', o: 0.61, img: 1 }, { side: 'b', o: 0.67, img: 1 }, { side: 'b', o: 0.73, img: 1 }] },
    { id: 'season', len: 240, notes: [] },
    { id: 'people', len: 200, notes: [] },
    { id: 'table', len: 200, notes: [] },
    { id: 'network', len: 200, notes: [{ side: 'b', o: 0 }, { side: 't', o: 0.22 }, { side: 'b', o: 0.48 }, { side: 't', o: 0.78 }] },
    { id: 'tiles', len: 240, notes: [] },
    { id: 'bars', len: 200, notes: [{ side: 'r', o: 0 }, { side: 'r', o: 0.18 }, { side: 'r', o: 0.36 }, { side: 'r', o: 0.54 }, { side: 'r', o: 0.72 }] },
    { id: 'loop', len: 200, notes: [{ side: 't', o: 0.05 }, { side: 'r', o: 0.15 }, { side: 'b', o: 0.25 }, { side: 't', o: 0.35 }] },
    { id: 'path', len: 200, notes: [{ side: 'l', o: 0 }, { side: 'r', o: 0.18 }, { side: 'l', o: 0.36 }, { side: 'r', o: 0.54 }, { side: 'l', o: 0.72 }] },
    { id: 'leaf', len: 140, notes: [] }
  ];
  (function () { var c = 0; for (var i = 0; i < D.length; i++) { D[i].c0 = c; c += D[i].len; } })();
  var TOTAL = D[D.length - 1].c0 + D[D.length - 1].len;

  function Stage() {
    this.N = 180;
    this.SAGE = '101,117,110';
    /* Neighbour-line weight per scene (0 = no lines). */
    this.LK = { people: 0, estate: 0.08, two: 0.2, doors: 0, centre: 0.3, arrival: 0.25, cycle: 0.2, season: 0, table: 0.2, network: 0.12, tiles: 0, bars: 0, loop: 0.25, path: 0.3, leaf: 0.25 };
    /* Which rail part (1-9) and act (0-2) each scene reports. */
    this.PARTS = { people: 5, two: 1, doors: 2, centre: 3, arrival: 3, cycle: 4, season: 5, table: 6, network: 7, tiles: 8, bars: 9 };
    this.ACTS = { people: 1, two: 0, doors: 0, centre: 0, arrival: 0, cycle: 0, season: 1, table: 1, network: 2, tiles: 2, bars: 2 };
    this.ACTN = ['The journey', 'The fuel', 'The engine'];
    this.RAILN = ['01 Two guests', '02 Discover', '03 Booking', '04 After the stay', '05 The season', '06 The feast', '07 How I build it', '08 What it produces', '09 Measure'];
    this.IDEAS = [
      ['Summer fruit ripens in the orchards', IMG + 'garden-harvest.jpg', 'January'],
      ['The grape harvest begins', IMG + 'rooms-cottages-vineyard.jpg', 'February'],
      ['Harvest comes into the cellar', IMG + 'guest-wine.jpg', 'March'],
      ['Olives are picked and pressed', IMG + 'garden-hero.jpg', 'April'],
      ['Autumn colour across the vines', IMG + 'valley-dusk.jpg', 'May'],
      ['Winter citrus in the garden', IMG + 'dine-greenhouse.jpg', 'June'],
      ['Pruning the vines by hand', IMG + 'day3-cattle-windmill.jpg', 'July'],
      ['Soup and bread from the bakery', IMG + 'story-chefs.jpg', 'August'],
      ['Blossom across the orchards', IMG + 'cover-garden-aerial.jpg', 'September'],
      ['Planting the spring beds', IMG + 'contents-koppie.jpg', 'October'],
      ['Farm-to-fork in November', IMG + 'dine-babel.jpg', 'November'],
      ['Long summer lunches outside', IMG + 'press-table.jpg', 'December']
    ];
    this.netE = [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 6], [2, 7], [3, 8], [3, 9]];
    this.P = null;
    this.LR = [];
  }

  var S = Stage.prototype;

  /* ---- Helpers ---------------------------------------------------------- */

  S.cl = function (v) { return Math.max(0, Math.min(1, v)); };
  S.E = function (v) { v = this.cl(v); return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2; };
  /* Hero cream to Babylonstoren sage. */
  S.mix = function (w) {
    return [[245, 101], [240, 117], [232, 110]].map(function (c) {
      return Math.round(c[1] + (c[0] - c[1]) * w);
    }).join(',');
  };
  /* Stable per-particle pseudo-random pair. */
  S.rnd = function (i) {
    var a = Math.sin(i * 12.9898) * 43758.5453, b = Math.sin(i * 78.233) * 12345.678;
    return [a - Math.floor(a), b - Math.floor(b)];
  };

  /* ---- Mount ----------------------------------------------------------- */

  S.mount = function () {
    this.track = document.querySelector('[data-track]');
    this.cv = document.querySelector('[data-field]');
    if (!this.track || !this.cv) return;

    this.track.style.height = (TOTAL + 100) + 'vh';

    this.scs = [].slice.call(document.querySelectorAll('[data-sc]'));
    this.blks = [].slice.call(document.querySelectorAll('[data-blk]'));
    this.heroEls = [].slice.call(document.querySelectorAll('[data-hero]'));
    this.heroTx = [].slice.call(document.querySelectorAll('[data-herotx]'));
    this.menu = document.querySelector('hes-menu');
    this.railwrap = document.querySelector('[data-railwrap]');
    this.railcap = document.querySelector('[data-railcap]');
    this.actname = document.querySelector('[data-actname]');
    this.partname = document.querySelector('[data-partname]');
    this.railf = []; this.railt = []; this.raili = [];
    for (var j = 0; j < 9; j++) {
      this.railf.push(document.querySelector('[data-railf="' + j + '"]'));
      this.railt.push(document.querySelector('[data-railt="' + j + '"]'));
      this.raili.push(document.querySelector('[data-rail="' + j + '"]'));
    }
    /* Note elements, indexed the same way as the scene list. */
    this.noteEls = D.map(function (sc, k) {
      return sc.notes.map(function (n, i) { return document.querySelector('[data-note="' + k + '-' + i + '"]'); });
    });
    /* The who-scene portrait anchors that scene's particle cloud. */
    this.phEl = document.querySelector('[data-blk="' + this.sceneIndex('who') + '"] img');

    /* Month photos are drawn into the canvas, so start them loading now. */
    var self = this;
    this.IM = this.IDEAS.map(function (d) { var im = new Image(); im.src = d[1]; return im; });

    var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.RM = mq.matches;
    var onMQ = function () { self.RM = mq.matches; self.P = null; };
    if (mq.addEventListener) mq.addEventListener('change', onMQ); else mq.addListener(onMQ);

    this.loop = this.loop.bind(this);
    this.af = requestAnimationFrame(this.loop);
  };

  S.sceneIndex = function (id) {
    for (var i = 0; i < D.length; i++) if (D[i].id === id) return i;
    return -1;
  };

  /* ---- The frame ------------------------------------------------------- */

  S.loop = function (now) {
    this.af = requestAnimationFrame(this.loop);

    var cl = this.cl.bind(this), E = this.E.bind(this);
    var vh = window.innerHeight, W = window.innerWidth, H = vh;
    var t = this.RM ? 0 : now / 1000 * 0.55;
    var last = D.length - 1;

    var y = Math.max(0, -this.track.getBoundingClientRect().top) / vh * 100;
    var k = 0; while (k < last && y >= D[k + 1].c0) k++;
    var p = cl((y - D[k].c0) / D[k].len);

    /* --- Scene text: fade, lift and unblur at each element's threshold. */
    for (var si = 0; si < this.scs.length; si++) {
      var el = this.scs[si], s = +el.dataset.sc, th = +el.dataset.th;
      var ls = (y - D[s].c0) / D[s].len;
      var inA = cl((ls - th) / 0.07), out = s === last ? 0 : cl((ls - 0.86) / 0.07), v = inA * (1 - out);
      if (el._v === v) continue;
      el._v = v;
      el.style.opacity = v.toFixed(3);
      el.style.transform = 'translateY(' + ((1 - inA) * 22 - out * 22).toFixed(1) + 'px)';
      el.style.filter = v > 0.98 ? 'none' : 'blur(' + ((1 - v) * 6).toFixed(1) + 'px)';
    }
    /* Only the live block takes clicks, so links never sit under a dead layer. */
    for (var bi = 0; bi < this.blks.length; bi++) {
      var bel = this.blks[bi], on = +bel.dataset.blk === k && (k === last || p < 0.88);
      var pe = on ? 'auto' : 'none';
      if (bel.style.pointerEvents !== pe) bel.style.pointerEvents = pe;
    }

    /* --- Hero photo and wordmark. */
    var hf = cl((y - 8) / 70);
    for (var hi = 0; hi < this.heroEls.length; hi++) {
      this.heroEls[hi].style.opacity = (1 - hf).toFixed(3);
      this.heroEls[hi].style.transform = 'scale(' + (1 + hf * 0.06).toFixed(4) + ')';
    }
    for (var ti = 0; ti < this.heroTx.length; ti++) {
      var hel = this.heroTx[ti], hv = 1 - cl((y - 4) / 30);
      hel.style.opacity = hv.toFixed(3);
      hel.style.filter = hv > 0.98 ? 'none' : 'blur(' + ((1 - hv) * 6).toFixed(1) + 'px)';
      hel.style.transform = hel.dataset.herotx === 'center'
        ? 'translateY(calc(-50% - ' + ((1 - hv) * 20).toFixed(1) + 'px))'
        : 'translateY(' + (-(1 - hv) * 20).toFixed(1) + 'px)';
    }

    /* --- Site chrome: hidden at the top and on downward scroll, back on up. */
    if (this.menu) {
      var sy = window.scrollY, ly = this.lastSY == null ? sy : this.lastSY;
      if (sy > ly + 2) this.chromeHide = true; else if (sy < ly - 2) this.chromeHide = false;
      this.lastSY = sy;
      var pre = sy < 40 || !!this.chromeHide;
      if (this.menu.hasAttribute('pre') !== pre) this.menu.toggleAttribute('pre', pre);
    }

    /* --- Progress rail: nine parts, in from Part 01, out at the loop scene. */
    var i2 = this.sceneIndex('two'), iL = this.sceneIndex('loop');
    var railOp = (cl((y - D[i2].c0 + 60) / 60) * (1 - cl((y - D[iL].c0 + 10) / 50))).toFixed(3);
    if (this.railwrap) this.railwrap.style.opacity = railOp;
    for (var j = 1; j <= 9; j++) {
      var ss = D.filter(function (sc) { return this.PARTS[sc.id] === j; }, this);
      var c0 = ss[0].c0, c1 = ss[ss.length - 1].c0 + ss[ss.length - 1].len;
      var f = cl((y - c0) / (c1 - c0)), cur = y >= c0 && y < c1;
      var fe = this.railf[j - 1], tk = this.railt[j - 1], le = this.raili[j - 1];
      if (fe) fe.style.width = (f * 100).toFixed(1) + '%';
      if (tk) tk.style.width = cur ? '28px' : '12px';
      if (cur && this.partname) this.partname.textContent = this.RAILN[j - 1];
      if (le) le.style.opacity = cur ? '1' : f >= 1 ? '0.8' : '0.45';
    }
    var ca = this.ACTS[D[k].id];
    if (this.actname) this.actname.textContent = ca === undefined ? '' : this.ACTN[ca] + ' ·';
    if (this.railcap) this.railcap.style.opacity = ca === undefined ? '0' : railOp;

    /* --- The field. */
    var cv = this.cv, iw = this.sceneIndex('who');
    cv.style.opacity = cl((y - D[iw].c0 - 25) / 40).toFixed(3);

    var dpr = Math.min(2, window.devicePixelRatio || 1);
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
    }
    var g = cv.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);

    /* Field geometry. Wide screens push the shapes right of the text column
       so the two never overlap; narrow screens centre them near the top. */
    var nar = W < 980;
    var M = nar ? Math.min(W * 0.82, H * 0.4) : Math.min(W * 0.34, H * 0.68);
    var textLeft = Math.max(40, (W - 1280) / 2 + 40);
    var cx = nar ? W / 2 : Math.max(W * 0.68, textLeft + 440 + M * 0.64);
    var cy0 = nar ? H * 0.28 : H * 0.48, Dy = H * 0.07;

    var nk = Math.min(k + 1, last), A = D[k].id, B = D[nk].id;
    var b = (k === last || this.RM) ? 0 : E((p - 0.6) / 0.4);
    var CA = { cx: cx, cy: cy0 + (0.5 - p) * Dy, M: M, W: W, H: H, t: t, p: p, nar: nar };
    var CB = { cx: cx, cy: cy0 + 0.5 * Dy, M: M, W: W, H: H, t: t, p: 0, nar: nar };
    if (this.phEl) {
      var pr = this.phEl.getBoundingClientRect();
      if (pr.width) { var ph = { x: pr.left + pr.width / 2, y: pr.bottom }; CA.ph = ph; CB.ph = ph; }
    }

    this.ink = k === 0 ? this.mix(1 - cl(b * 1.6)) : this.SAGE;
    this.LR = [];
    this.draw(g, W, H, A, B, b, CA, CB, k === nk);

    /* --- Note labels: pinned to the shape, kept clear of the text column,
           of each other, and of every canvas label drawn this frame. */
    var placed = this.LR.map(function (r) { return { left: r.left, right: r.right, top: r.top, bottom: r.bottom }; });
    for (var sN = 0; sN < D.length; sN++) {
      var sc = D[sN];
      for (var nj = 0; nj < sc.notes.length; nj++) {
        var n = sc.notes[nj], nel = this.noteEls[sN][nj];
        if (!nel) continue;
        var nv = 0;
        if (sN === k && !nar) nv = cl((p - (n.o * 0.55 + 0.1)) / 0.1) * (1 - cl((p - 0.82) / 0.08));
        /* On the loop scene the labels pulse in time with the travelling head. */
        if (sc.id === 'loop' && nv > 0) {
          var hd = (t * 0.22) % 4, dd = (nj - hd + 4) % 4;
          var lit = dd < 0.8 ? 1 - dd / 0.8 : (dd > 3.6 ? (dd - 3.6) / 0.4 : 0);
          nv *= 0.45 + 0.55 * lit;
        }
        if (nv <= 0) {
          if (nel._v !== 0) { nel._v = 0; nel.style.opacity = '0'; }
          continue;
        }
        nel._v = nv;
        nel.style.opacity = nv.toFixed(3);

        var an = this.anch(sc.id, CA)[nj];
        if (!an) continue;
        /* Part 04 compact mode: too little room for photos, so drop them and
           tighten the tracking so all four sister estates fit one row. */
        if (n.img) {
          var cmp = sc.id === 'cycle' && CA.M * 0.31 < 150;
          var phd = nel.firstElementChild;
          if (phd && phd.style) { var dv = cmp ? 'none' : ''; if (phd.style.display !== dv) phd.style.display = dv; }
          var tt = nel.querySelector('span');
          if (tt) { var lsp = cmp ? '0.08em' : '0.2em'; if (tt.style.letterSpacing !== lsp) tt.style.letterSpacing = lsp; }
        }

        var o = 18, nw = nel.offsetWidth || 200, tR = textLeft + 424;
        var side = n.side, x = an[0];
        if (side === 'l' && x - o - nw < tR) {
          /* The six doorways keep their sides, so the ellipse stays readable. */
          if (sc.id === 'doors') x = tR + o + nw; else side = 'r';
        }
        if ((side === 't' || side === 'b') && x - nw / 2 < tR) x = tR + nw / 2;
        x = Math.min(x, W - 64 - (side === 'r' ? nw + o : side === 't' || side === 'b' ? nw / 2 : 0));
        if (side === 'r' && x + o < tR) x = tR - o;
        var tf = { l: 'translate(calc(-100% - ' + o + 'px),-50%)', r: 'translate(' + o + 'px,-50%)', t: 'translate(-50%,calc(-100% - ' + o + 'px))', b: 'translate(-50%,' + o + 'px)' }[side];

        nel.style.left = x.toFixed(1) + 'px';
        nel.style.top = an[1].toFixed(1) + 'px';
        nel.style.transform = tf + ' translateY(' + ((1 - nv) * 8).toFixed(1) + 'px)';

        var r = nel.getBoundingClientRect(), top = an[1];
        for (var pass = 0; pass < 4; pass++) {
          var hit = null;
          for (var q = 0; q < placed.length; q++) {
            var pq = placed[q];
            if (r.left < pq.right + 4 && r.right > pq.left - 4 && r.top < pq.bottom + 6 && r.bottom > pq.top - 6) { hit = pq; break; }
          }
          if (!hit) break;
          top += hit.bottom + 10 - r.top;
          nel.style.top = top.toFixed(1) + 'px';
          r = nel.getBoundingClientRect();
        }
        placed.push(r);
      }
    }
  };

  /* ---- Drawing --------------------------------------------------------- */

  S.draw = function (g, W, H, A, B, b, CA, CB, same) {
    var cl = this.cl.bind(this), E = this.E.bind(this), ink = this.ink || this.SAGE, N = this.N;
    g.clearRect(0, 0, W, H);
    if (!this.P) this.P = [];
    var ga = CA.nar ? 0.3 : 1, pts = [];

    if (!CA.nar && (A === 'season' || B === 'season')) {
      this.camPhoto(g, A === 'season' ? CA : CB, (A === 'season' ? (1 - b) * cl(CA.p * 2.5) : b * 0.4) * ga);
    }

    for (var i = 0; i < N; i++) {
      var ta = this.tgt(A, i, CA), tb = same ? ta : this.tgt(B, i, CB);
      var bi = E(b * 1.4 - this.rnd(i + 77)[0] * 0.4);
      /* Particles sway sideways as they hand over between scenes. */
      var dn = Math.sin(Math.PI * bi) * CA.M;
      var tx = ta[0] + (tb[0] - ta[0]) * bi + Math.sin(i * 1.7 + CA.t * 1.3) * dn * 0.16;
      var ty = ta[1] + (tb[1] - ta[1]) * bi + Math.cos(i * 2.3 + CA.t) * dn * 0.06;
      var tA = ta[2] + (tb[2] - ta[2]) * bi;

      var q = this.P[i];
      if (!q) q = this.P[i] = [tx, ty, tA];
      /* The slow approach to target is what makes the motion glide. */
      if (this.RM) { q[0] = tx; q[1] = ty; q[2] = tA; }
      else {
        var sp = 0.022 + this.rnd(i + 9)[0] * 0.022;
        q[0] += (tx - q[0]) * sp; q[1] += (ty - q[1]) * sp; q[2] += (tA - q[2]) * 0.05;
      }

      var a = Math.max(0, q[2] * ga);
      pts.push([q[0], q[1], a]);
      g.fillStyle = 'rgba(' + ink + ',' + a.toFixed(3) + ')';
      g.beginPath(); g.arc(q[0], q[1], 1.5, 0, 7); g.fill();
    }

    var lk = ((this.LK[A] || 0) * (1 - b) * cl(CA.p * 3) + (same ? 0 : (this.LK[B] || 0) * b * 0.3)) * ga;
    if (lk > 0.02) {
      g.lineWidth = 0.6;
      var maxD = 52;
      for (var m = 0; m < N; m++) {
        for (var c = m + 1; c < N; c++) {
          var dx = pts[m][0] - pts[c][0], dy = pts[m][1] - pts[c][1], d2 = dx * dx + dy * dy;
          if (d2 >= maxD * maxD) continue;
          var al = (1 - Math.sqrt(d2) / maxD) * Math.min(pts[m][2], pts[c][2]) * 0.5 * lk;
          if (al <= 0.02) continue;
          g.strokeStyle = 'rgba(' + ink + ',' + al.toFixed(3) + ')';
          g.beginPath(); g.moveTo(pts[m][0], pts[m][1]); g.lineTo(pts[c][0], pts[c][1]); g.stroke();
        }
      }
    }
    this.fx(g, A, CA, (1 - b) * cl(CA.p * 2.5) * ga);
  };

  /* Loosen into a soft cloud, then draw into the formation. The hero and who
     scenes are already clouds, so they skip it. */
  S.tgt = function (n, i, C) {
    var f = this.form(n, i, C);
    if (n === 'hero' || n === 'who') return f;
    var r = this.rnd(i), t = C.t;
    var rx = C.cx + (r[0] - 0.5) * C.M * 1.5 + Math.sin(t * 0.35 + i) * 16;
    var ry = C.cy + (r[1] - 0.5) * C.M * 1.15 + Math.cos(t * 0.3 + i * 1.3) * 16;
    var fo = this.RM ? 1 : this.E((C.p - f[3] * 0.55) / 0.15);
    return [rx + (f[0] - rx) * fo, ry + (f[1] - ry) * fo, 0.16 + (f[2] - 0.16) * fo];
  };

  /* ---- Shape geometry -------------------------------------------------- */

  S.cycG = function (C) {
    var cx = C.cx, M = C.M, x0 = cx - M * 0.6, xs = cx - M * 0.46, x1 = cx + M * 0.68;
    return { x0: x0, xs: xs, x1: x1, dy: M * 0.2, X: [0, 1, 2, 3].map(function (k) { return cx - M * 0.28 + k * M * 0.31; }) };
  };
  S.camV = function (C) { var w = C.M * 0.72, h = w * 0.5625; return { x0: C.cx - w / 2, y0: C.cy - h / 2 - C.M * 0.08, w: w, h: h }; };
  S.loop4 = function (C) { var RR = C.M * 0.34; return [[C.cx, C.cy - RR], [C.cx + RR * 1.15, C.cy], [C.cx, C.cy + RR], [C.cx - RR * 1.15, C.cy]]; };
  S.arrG = function (C) {
    var xa = C.cx - C.M * 0.58, xb = C.cx + C.M * 0.58;
    return { xa: xa, xb: xb, y: C.cy + C.M * 0.02, U: [0.04, 0.24, 0.42, 0.8, 0.97], sx: xa + 0.6 * (xb - xa), ar: C.M * 0.08 };
  };
  S.arc6 = function (C) {
    return [-60, 0, 60, 120, 180, 240].map(function (d) {
      var a = d * Math.PI / 180;
      return [C.cx + Math.cos(a) * C.M * 0.36 * 1.1, C.cy + Math.sin(a) * C.M * 0.36];
    });
  };
  S.feastT = function (C) {
    var w = C.M * 0.36, h = C.M * 0.05;
    return [[-0.21, -0.15], [0.21, -0.15], [-0.21, 0.17], [0.21, 0.17]].map(function (v) {
      return { x: C.cx + v[0] * C.M, y: C.cy + v[1] * C.M, w: w, h: h };
    });
  };
  S.netG = function (C) {
    var cx = C.cx, cy = C.cy, M = C.M;
    return {
      D: [cx - M * 0.48, cy],
      I: [-0.08, 0, 0.08].map(function (v) { return [cx - M * 0.16, cy + v * M]; }),
      AB: [[cx + M * 0.15, cy - M * 0.11], [cx + M * 0.15, cy + M * 0.11]],
      R: [cx + M * 0.46, cy + M * 0.11]
    };
  };
  S.netA = function (C) {
    var G = this.netG(C), M = C.M;
    return [[G.D[0], G.D[1] + M * 0.13], [G.I[0][0], G.I[0][1] - M * 0.03], [G.AB[1][0], G.AB[1][1] + M * 0.04], [G.R[0], G.R[1] - M * 0.07]];
  };
  /* The calendar block, kept between the text column and the labels. */
  S.tg = function (C) {
    var M = C.M, W = C.W, tR = Math.max(40, (W - 1280) / 2 + 40) + 424, right = W - 64 - 290;
    var x0 = C.cx - M * 0.45, w = Math.min(M * 0.8, right - 16 - x0);
    if (w < M * 0.55) { x0 = Math.max(tR + 10, right - 16 - M * 0.55); w = right - 16 - x0; }
    return [x0, Math.max(120, w)];
  };
  S.rect = function (p, x0, y0, w, h) {
    p = ((p % 1) + 1) % 1 * (2 * w + 2 * h);
    if (p < w) return [x0 + p, y0];
    p -= w; if (p < h) return [x0 + w, y0 + p];
    p -= h; if (p < w) return [x0 + w - p, y0 + h];
    p -= w; return [x0, y0 + h - p];
  };
  S.safariN = function (C) {
    return [0, 1, 2, 3, 4].map(function (k) {
      return [C.cx + (k % 2 ? C.M * 0.16 : -C.M * 0.16), C.cy - C.M * 0.4 + k * C.M * 0.2];
    });
  };

  /* ---- Per-scene particle targets -------------------------------------- */
  /* form() returns [x, y, alpha, order] for particle i. order (0..1)
     staggers when that particle joins the formation. */

  S.form = function (n, i, C) {
    var cx = C.cx, cy = C.cy, M = C.M, W = C.W, H = C.H, t = C.t, p = C.p;
    var N = this.N, u = i / N, r = this.rnd(i), r1 = r[0], r2 = r[1], P = Math.PI * 2;
    var E = this.E.bind(this), cl = this.cl.bind(this);
    var L = function (A, B, m) { return [A[0] + (B[0] - A[0]) * m, A[1] + (B[1] - A[1]) * m]; };

    /* who — a soft cloud orbiting just under the portrait. */
    if (n === 'who' && C.ph) {
      var aw = r1 * P + t * (0.12 + r2 * 0.1), rad = 0.25 + 0.75 * Math.sqrt(r2);
      return [C.ph.x + Math.cos(aw) * rad * 62 + Math.sin(t * 0.4 + i) * 3,
        C.ph.y + 34 + Math.sin(aw) * rad * 12 + Math.cos(t * 0.35 + i) * 2,
        0.18 + 0.4 * (1 - rad * 0.6), 0];
    }
    if (n === 'hero' || n === 'who') {
      return [r1 * W + Math.sin(t * 0.25 + i) * 22, r2 * H + Math.cos(t * 0.22 + i * 1.3) * 22, 0.3, 0];
    }

    /* estate — pollen drifting in an ellipse. */
    if (n === 'estate') {
      var ae = r1 * P + t * 0.04 * (i % 2 ? 1 : -1), re = M * 0.56 * Math.sqrt(r2);
      return [cx + Math.cos(ae) * re * 1.1 + Math.sin(t * 0.3 + i) * 6,
        cy + Math.sin(ae) * re * 0.9 + Math.cos(t * 0.27 + i) * 6,
        0.22 + 0.18 * Math.sin(t * 0.6 + i), r2 * 0.3];
    }

    /* two — a larger, looser cluster and a smaller, denser one. */
    if (n === 'two') {
      if (i < 110) {
        var a2 = r1 * P + t * 0.1, rr2 = M * 0.21 * Math.sqrt(r2);
        return [cx - M * 0.2 + Math.cos(a2) * rr2, cy + Math.sin(a2) * rr2, 0.7, i / 110 * 0.5];
      }
      var a2b = r1 * P - t * 0.15, rr2b = M * 0.1 * Math.sqrt(r2);
      return [cx + M * 0.26 + Math.cos(a2b) * rr2b, cy + Math.sin(a2b) * rr2b, 0.9, 0.5 + (i - 110) / 70 * 0.3];
    }

    /* doors — six channel nodes streaming into a central hub. */
    if (n === 'doors') {
      var nd = this.arc6(C), ctr = [cx, cy];
      if (i < 36) {
        var kd = i % 6, ad = r1 * P + t * 0.4, rd = M * 0.026 * Math.sqrt(r2);
        return [nd[kd][0] + Math.cos(ad) * rd, nd[kd][1] + Math.sin(ad) * rd, 0.95, kd * 0.08];
      }
      if (i < 54) {
        var ar = ((i - 36) / 18) * P + t * 0.02;
        return [cx + Math.cos(ar) * M * 0.36 * 1.1, cy + Math.sin(ar) * M * 0.36, 0.18, 0.2];
      }
      if (i < 132) {
        var ks = i % 6, fs = (r1 + t * 0.085) % 1, qs = L(nd[ks], ctr, E(fs));
        var ds = Math.hypot(qs[0] - cx, qs[1] - cy), fade = cl((ds - M * 0.12) / (M * 0.06));
        var wv = (r2 - 0.5) * M * 0.035 * Math.sin(fs * Math.PI);
        return [qs[0] + wv, qs[1] - wv * 0.6, (0.35 + 0.55 * Math.sin(fs * Math.PI)) * fade, 0.35 + ks * 0.04];
      }
      if (i < 156) {
        /* Cross-channel arcs: social to YouTube, press and paid, word of
           mouth to search. */
        var CH = [[0, 4], [1, 2], [2, 1], [5, 3]], ch = CH[i % 4], fc = (r1 + t * 0.05) % 1;
        var A0 = nd[ch[0]], A1 = nd[ch[1]], qc = L(A0, A1, E(fc));
        var mx = (A0[0] + A1[0]) / 2 - cx, my = (A0[1] + A1[1]) / 2 - cy, ml = Math.hypot(mx, my) || 1;
        var bl = Math.sin(Math.PI * fc) * M * 0.12;
        return [qc[0] + mx / ml * bl, qc[1] + my / ml * bl, 0.2 + 0.45 * Math.sin(fc * Math.PI), 0.5];
      }
      var ah = r1 * P + t * 0.5, rh = M * 0.035 * Math.sqrt(r2);
      return [cx + Math.cos(ah) * rh, cy + Math.sin(ah) * rh, 1, 0.6];
    }

    /* centre — two landing-page frames, their retargeting loops and outcomes. */
    if (n === 'centre') {
      var wC = M * 0.3, hC = M * 0.26, x0C = cx - M * 0.05, up = i % 2 === 0;
      var y0C = up ? cy - M * 0.34 : cy + M * 0.08, mC = (i >> 1) % 4, s4 = (i >> 3) / 22;
      if (mC === 0) { var qf = this.rect(s4 + t * 0.01, x0C, y0C, wC, hC); return [qf[0], qf[1], 0.85, 0.15 + s4 * 0.2 + (up ? 0 : 0.15)]; }
      if (mC === 1) { var rw = (i >> 3) % 2; return [x0C + wC * 0.12 + r1 * wC * 0.76, y0C + hC * (0.38 + 0.26 * rw), 0.5, 0.35 + (up ? 0 : 0.15)]; }
      if (mC === 2) {
        var kc = (i >> 3) % 5, fin = (r1 + t * 0.07) % 1;
        var src = [cx - M * 0.62, cy + (kc - 2) * M * 0.14], dst = [x0C, y0C + hC * (0.25 + r2 * 0.5)];
        var qi = L(src, dst, E(fin));
        return [qi[0], qi[1], 0.25 + 0.5 * Math.sin(fin * Math.PI), 0.05];
      }
      var st = [x0C + wC, y0C + hC / 2];
      if ((i >> 3) % 2 === 1) {
        var fo2 = (r1 + t * 0.08) % 1, O = [x0C + wC + M * 0.34, y0C + hC / 2], qo = L(st, O, E(fo2));
        return [qo[0], qo[1] + (r2 - 0.5) * 4, 0.35 + 0.55 * fo2, 0.55];
      }
      var fr = (r1 + t * 0.09) % 1, en = [x0C + wC / 2, up ? y0C : y0C + hC], qr = L(st, en, fr);
      var bx = Math.sin(Math.PI * fr) * M * 0.12, by = Math.sin(Math.PI * fr) * M * 0.1 * (up ? -1 : 1);
      return [qr[0] + bx, qr[1] + by, 0.35, 0.75];
    }

    /* arrival — a timeline with a travelling glow and five blooms. */
    if (n === 'arrival') {
      var Aa = this.arrG(C), tv = cl((p - 0.08) / 0.6);
      var X = function (v) { return Aa.xa + v * (Aa.xb - Aa.xa); };
      if (i < 50) { var ua = i / 49; return [X(ua), Aa.y, ua <= tv ? 0.45 : 0.18, ua * 0.3]; }
      if (i < 80) {
        var ja = i - 50, aa = Math.PI + (ja / 29) * Math.PI, bla = E((tv - 0.52) / 0.08);
        return [Aa.sx + Math.cos(aa) * Aa.ar, Aa.y + Math.sin(aa) * Aa.ar, 0.3 + 0.55 * bla, 0.5];
      }
      if (i < 160) {
        var jb = i - 80, kb = jb >> 4, qb = jb % 16, uk = Aa.U[kb];
        var blb = E((tv - uk + 0.02) / 0.06), fx2 = X(uk);
        if (qb === 15) return [fx2, Aa.y, 0.5 + 0.5 * blb, uk * 0.9];
        var pe2 = qb % 5, ring = Math.floor(qb / 5);
        var ab = pe2 / 5 * P - Math.PI / 2 + t * 0.08, rr = M * (0.012 + ring * 0.011) * (0.25 + 0.75 * blb);
        return [fx2 + Math.cos(ab) * rr, Aa.y + Math.sin(ab) * rr, 0.12 + 0.75 * blb, uk * 0.9];
      }
      var ag = r1 * P + t * 0.8, rg = M * 0.012 * Math.sqrt(r2);
      return [X(tv) + Math.cos(ag) * rg, Aa.y + Math.sin(ag) * rg, 0.95, 0.05];
    }

    /* cycle — two lanes from checkout across four season columns. */
    if (n === 'cycle') {
      var G = this.cycG(C);
      var lane = function (isUp) { return cy + (isUp ? -1 : 1) * G.dy; };
      if (i < 20) { var a3 = r1 * P + t * 0.4, r3 = M * 0.04 * Math.sqrt(r2); return [G.x0 + Math.cos(a3) * r3, cy + Math.sin(a3) * r3, 0.9, 0]; }
      if (i < 80) { var j3 = i - 20, up3 = j3 < 30, f3 = (j3 % 30) / 29; return [G.xs + f3 * (G.x1 - G.xs), lane(up3), 0.3, 0.1 + f3 * 0.2]; }
      if (i < 112) { var j4 = i - 80, k4 = j4 >> 3, a4 = r1 * P + t * 0.4, r4 = M * 0.022 * Math.sqrt(r2); return [G.X[k4] + Math.cos(a4) * r4, lane(true) + Math.sin(a4) * r4, 0.75, 0.35 + k4 * 0.05]; }
      if (i < 144) { var j5 = i - 112, k5 = j5 >> 3, a5 = r1 * P + t * 0.4, r5 = M * 0.03 * Math.sqrt(r2); return [G.X[k5] + Math.cos(a5) * r5, lane(false) + Math.sin(a5) * r5, 0.95, 0.55 + k5 * 0.06]; }
      var up6 = i % 2 === 0, f6 = (r1 + t * 0.05) % 1, x6 = G.x0 + f6 * (G.x1 - G.x0);
      var y6 = cy + (lane(up6) - cy) * E(Math.min(1, (x6 - G.x0) / (G.xs - G.x0)));
      return [x6, y6, 0.25 + 0.5 * Math.sin(f6 * Math.PI), 0.3];
    }

    /* season — a viewfinder: corner brackets, REC dot, crosshair, progress,
       thirds grid. */
    if (n === 'season') {
      var V = this.camV(C), x0s = V.x0, y0s = V.y0, ws = V.w, hs2 = V.h, fs2 = cl((p - 0.08) / 0.74);
      if (i < 80) {
        var cc = i / 20 | 0, js = i % 20, ls = ((js % 10) / 9) * M * 0.12;
        var sx = cc % 2 ? -1 : 1, sy = cc < 2 ? 1 : -1;
        var ox = cc % 2 ? x0s + ws : x0s, oy = cc < 2 ? y0s : y0s + hs2;
        return js < 10 ? [ox + sx * ls, oy, 0.9, cc * 0.05] : [ox, oy + sy * ls, 0.9, cc * 0.05];
      }
      if (i < 90) {
        var aR = r1 * P + t, rR = M * 0.012 * Math.sqrt(r2);
        return [x0s + M * 0.05 + Math.cos(aR) * rR, y0s + M * 0.05 + Math.sin(aR) * rR, 0.5 + 0.45 * (Math.sin(t * 4) > 0 ? 1 : 0), 0.25];
      }
      if (i < 110) {
        var jx = i - 90, lx = ((jx % 10) / 9 - 0.5) * M * 0.08;
        return jx < 10 ? [x0s + ws / 2 + lx, y0s + hs2 / 2, 0.55, 0.3] : [x0s + ws / 2, y0s + hs2 / 2 + lx, 0.55, 0.3];
      }
      if (i < 140) { var jp = i - 110, fp = jp / 29; return [x0s + fp * ws, y0s + hs2 + 14, fp <= fs2 ? 0.9 : 0.2, 0.35]; }
      var jg = i - 140, ln = jg / 10 | 0, qg = (jg % 10) / 9;
      return ln < 2 ? [x0s + ws * (ln + 1) / 3, y0s + qg * hs2, 0.16, 0.4] : [x0s + qg * ws, y0s + hs2 * (ln - 1) / 3, 0.16, 0.4];
    }

    /* people — five threads that weave, then straighten into rows. */
    if (n === 'people') {
      var tgp = this.tg(C), x0p = tgp[0], wp = tgp[1], T = 5;
      var ry = function (rr2) { return cy - M * 0.3 + rr2 * M * 0.15; };
      var wy = function (rr2, uu) { return ry(rr2) + Math.sin(uu * P * 1.3 + rr2 * 1.7 + t * 0.15) * M * 0.07 * (1 - uu * uu * uu); };
      if (i < 140) { var rp = i % T, jp2 = Math.floor(i / T), up2 = jp2 / 27; return [x0p + up2 * wp, wy(rp, up2), 0.32, rp * 0.1 + up2 * 0.15]; }
      var jq = i - 140, rq = jq % T, ep = Math.floor(jq / T), uq = (ep + 0.5 + (rq % 2) * 0.35) / 8;
      var aq = r1 * P + t * 0.5, rrq = M * 0.014 * Math.sqrt(r2);
      return [x0p + uq * wp + Math.cos(aq) * rrq, wy(rq, uq) + Math.sin(aq) * rrq, 0.95, 0.4 + ep * 0.05];
    }

    /* table — four feast tables, the active season lit. */
    if (n === 'table') {
      var TT = this.feastT(C), kt = i % 4, jt = Math.floor(i / 4), tb = TT[kt];
      var qa = Math.min(3, Math.floor(cl((p - 0.08) / 0.7) * 4)), al2 = kt === qa ? 1 : 0.32, ot = kt * 0.15;
      if (jt < 15) { var qt = this.rect(jt / 15, tb.x - tb.w / 2, tb.y - tb.h / 2, tb.w, tb.h); return [qt[0], qt[1], 0.85 * al2, ot]; }
      if (jt < 39) {
        var jj = jt - 15, sIdx = jj >> 1, topS = sIdx < 6;
        var sxt = tb.x - tb.w / 2 + ((sIdx % 6) + 0.5) * tb.w / 6, at = r1 * P + t * 0.6, rt = 3 * r2;
        return [sxt + Math.cos(at) * rt, (topS ? tb.y - tb.h / 2 - M * 0.035 : tb.y + tb.h / 2 + M * 0.035) + Math.sin(at) * rt, 0.9 * al2, ot + 0.05];
      }
      var qd = jt - 39;
      return [tb.x - tb.w / 2 + (qd + 0.5) * tb.w / 6, tb.y, (0.3 + 0.5 * Math.pow(Math.sin(t * 1.2 + qd + kt), 2)) * al2, ot + 0.1];
    }

    /* network — data, infrastructure, the A/B test, then revenue. */
    if (n === 'network') {
      var GN = this.netG(C), sp2 = cl((p - 0.06) / 0.6) * 3, win = E((sp2 - 1.6) / 0.6);
      if (i < 40) { var an2 = r1 * P + t * 0.2, rn = M * 0.11 * Math.sqrt(r2); return [GN.D[0] + Math.cos(an2) * rn * 0.8, GN.D[1] + Math.sin(an2) * rn, 0.3 + 0.3 * Math.sin(t + i), 0]; }
      if (i < 64) { var ki = i % 3, ai2 = r1 * P + t * 0.5, ri = M * 0.018 * Math.sqrt(r2); return [GN.I[ki][0] + Math.cos(ai2) * ri, GN.I[ki][1] + Math.sin(ai2) * ri, 0.35 + 0.6 * cl(sp2 - 0.6), 0.2]; }
      if (i < 84) {
        var ab2 = i % 2, aa2 = r1 * P + t * 0.5, ra2 = M * 0.024 * Math.sqrt(r2), lit2 = cl(sp2 - 1.4);
        var alb = ab2 ? (0.3 + 0.65 * lit2) : (0.3 + 0.55 * lit2) * (1 - 0.55 * win);
        return [GN.AB[ab2][0] + Math.cos(aa2) * ra2, GN.AB[ab2][1] + Math.sin(aa2) * ra2, alb, 0.4];
      }
      if (i < 100) { var ar2 = r1 * P + t * 0.6, rr3 = M * (0.012 + 0.045 * cl(sp2 - 2.4)) * Math.sqrt(r2); return [GN.R[0] + Math.cos(ar2) * rr3, GN.R[1] + Math.sin(ar2) * rr3, 0.3 + 0.7 * cl(sp2 - 2.3), 0.55]; }
      var abs2 = i % 2, s0 = ((r1 + t * 0.045) % 1) * Math.min(3, sp2 + 0.05), jit = (r2 - 0.5) * M * 0.03;
      var qn, aln = 0.6;
      if (s0 < 1) { var k1 = i % 3; qn = L([GN.D[0] + M * 0.06, GN.D[1] + jit], GN.I[k1], E(s0)); }
      else if (s0 < 2) { var k2 = i % 3; qn = L(GN.I[k2], GN.AB[abs2], E(s0 - 1)); }
      else { if (!abs2) { qn = [GN.AB[0][0], GN.AB[0][1]]; aln = 0; } else qn = L(GN.AB[1], GN.R, E(s0 - 2)); }
      return [qn[0], qn[1] + (s0 >= 1 ? jit * 0.3 : 0), aln, 0.1];
    }

    /* tiles — nine series rows across twelve months, into five outputs. */
    if (n === 'tiles') {
      var tgt2 = this.tg(C), x0t = tgt2[0], wt = tgt2[1];
      var ryt = function (rr2) { return cy - M * 0.38 + rr2 * M * 0.075; };
      var Xt = function (m2) { return x0t + m2 / 11 * wt; };
      var RW = [[18, 'dots', 0.7], [18, 'off', 0.6], [24, 'month', 0.95], [16, 'line', 0.65], [20, 'line', 0.9], [20, 'seasons', 0.85], [14, 'line', 0.8], [12, 'line', 0.75], [10, 'nov', 0.95]];
      var stt = 0;
      for (var rr4 = 0; rr4 < RW.length; rr4++) {
        var cnt = RW[rr4][0], ty = RW[rr4][1], alr = RW[rr4][2];
        if (i < stt + cnt) {
          var jr = i - stt, orr = rr4 * 0.055, yr = ryt(rr4);
          if (ty === 'dots') return [Xt(jr / (cnt - 1) * 11), yr, alr, orr];
          if (ty === 'off') return [Xt((jr + 0.5) / cnt * 11), yr + (jr % 2 ? 2 : -2), alr, orr];
          if (ty === 'month') { var mm = jr >> 1; return [Xt(mm) + (jr % 2 ? 3 : -3), yr, alr, orr + mm * 0.004]; }
          if (ty === 'line') return [Xt(jr / (cnt - 1) * 11), yr + Math.sin(jr * 0.6 + t + rr4) * 1.5, alr, orr];
          if (ty === 'seasons') { var sq = jr / 5 | 0, ksq = jr % 5; return [Xt(sq * 3 + 1) + (ksq - 2) * M * 0.03, yr, sq === 0 ? 1 : alr * 0.8, orr]; }
          var anv = jr / cnt * P + t * 0.3;
          return [Xt(10) + Math.cos(anv) * M * 0.022, yr + Math.sin(anv) * M * 0.016, alr, orr];
        }
        stt += cnt;
      }
      var jo = i - stt, ko = jo % 5, ao = r1 * P + t * 0.4, ro = M * 0.03 * Math.sqrt(r2);
      return [x0t + wt * (0.06 + ko * 0.22) + Math.cos(ao) * ro, cy + M * 0.36 + Math.sin(ao) * ro, 0.9, 0.62 + ko * 0.06];
    }

    /* bars — five rising columns. */
    if (n === 'bars') {
      var kb2 = i % 5, jb2 = Math.floor(i / 5);
      var hb = M * [0.2, 0.3, 0.4, 0.5, 0.62][kb2] * E(p * 1.4 + 0.1);
      return [cx - M * 0.42 + kb2 * M * 0.12 + (r2 - 0.5) * 5, cy + M * 0.3 - jb2 / 35 * hb, 0.4 + 0.5 * (jb2 / 35), kb2 * 0.1 + jb2 / 35 * 0.1];
    }

    /* loop — a four-stage ellipse with a travelling pulse and referrals in. */
    if (n === 'loop') {
      var ndl = this.loop4(C), RR = M * 0.34, head = (t * 0.22) % 4;
      if (i % 4 === 0) {
        var kl = (i / 4 | 0) % 4, al3 = r1 * P + t * 0.4, rl = M * 0.035 * Math.sqrt(r2);
        var dl = (kl - head + 4) % 4, litl = dl < 0.8 ? 1 - dl / 0.8 : 0;
        return [ndl[kl][0] + Math.cos(al3) * rl, ndl[kl][1] + Math.sin(al3) * rl, 0.55 + 0.4 * litl, kl * 0.2];
      }
      if (i % 11 === 1) {
        var fl2 = (r1 + t * 0.06) % 1;
        var srcl = [ndl[3][0] - M * 0.3, ndl[3][1] + (r2 - 0.5) * M * 0.4], ql = L(srcl, ndl[3], E(fl2));
        return [ql[0], ql[1], 0.15 + 0.6 * fl2, 0.7];
      }
      var fe2 = (r1 + t * 0.035) % 1, ae2 = -Math.PI / 2 + fe2 * P, wob = (r2 - 0.5) * M * 0.03;
      return [cx + Math.cos(ae2) * (RR + wob) * 1.15, cy + Math.sin(ae2) * (RR + wob), 0.4, 0.1 + fe2 * 0.6];
    }

    /* path — five joined nodes, the safari proof. */
    if (n === 'path') {
      var nodes = this.safariN(C);
      if (i % 2 === 0) {
        var kp = (i >> 1) % 5, ndp = nodes[kp], ap = r1 * P + t * 0.4, rp2 = M * 0.035 * (0.5 + 0.5 * r2);
        return [ndp[0] + Math.cos(ap) * rp2, ndp[1] + Math.sin(ap) * rp2, kp === 4 ? 1 : 0.8, kp * 0.18];
      }
      var fp2 = (r1 + t * 0.06) % 1, sg = Math.min(3, Math.floor(fp2 * 4)), qp = L(nodes[sg], nodes[sg + 1], E(fp2 * 4 - sg));
      return [qp[0] + (r2 - 0.5) * 8, qp[1], 0.5, sg * 0.18 + 0.09];
    }

    /* leaf — the High Elm mark: outline, midrib, then veins. */
    if (n === 'leaf') {
      var LG = this.makeLogo(N), sc2 = M * 0.72 / 89;
      var Xl = function (x) { return cx + (x - 30) * sc2; };
      var Yl = function (yy) { return cy + (yy - 48.5) * sc2; };
      var nO = Math.round(N * 0.36), wobl = Math.sin(t * 0.8 + i) * 0.6;
      if (i < nO) return [Xl(LG[i][0]) + wobl, Yl(LG[i][1]), 0.95, u * 0.6];
      var jl = i - nO;
      var VN = [[30, 5, 30, 92], [30, 25, 44, 32], [30, 40, 49, 48], [30, 55, 50, 62], [30, 70, 46, 76], [30, 25, 16, 32], [30, 40, 11, 48], [30, 55, 10, 62], [30, 70, 14, 76]];
      if (jl < 36) { var fm = jl / 35; return [Xl(30), Yl(5 + fm * 87), 0.8, 0.3 + fm * 0.3]; }
      var kv = 1 + (jl - 36) % 8, fv = (Math.floor((jl - 36) / 8) + 1) / 12, vv = VN[kv];
      return [Xl(vv[0] + (vv[2] - vv[0]) * fv), Yl(vv[1] + (vv[3] - vv[1]) * fv), 0.65, 0.5 + kv * 0.04];
    }

    return [cx, cy, 0, 0];
  };

  /* ---- Note anchors: where each label points, per scene ---------------- */

  S.anch = function (n, C) {
    var cx = C.cx, cy = C.cy, M = C.M;
    if (n === 'estate') {
      var w = M * 0.8, h = M * 0.7;
      var q = [[cx - w * 0.25, cy - h * 0.25], [cx + w * 0.25, cy - h * 0.25], [cx - w * 0.25, cy + h * 0.25], [cx + w * 0.25, cy + h * 0.25]];
      return [q[0], q[1], q[3], [cx - w / 2 - 6, cy + h * 0.35], [cx, cy]];
    }
    if (n === 'two') return [[cx - M * 0.2, cy + M * 0.25], [cx + M * 0.26, cy + M * 0.15]];
    if (n === 'doors') return this.arc6(C).map(function (c, k) { return [c[0] + (k < 3 ? 1 : -1) * M * 0.035, c[1]]; });
    if (n === 'centre') {
      var wc = M * 0.3, hc = M * 0.26, x0 = cx - M * 0.05, yU = cy - M * 0.34, yD = cy + M * 0.08;
      return [[x0 + wc / 2, yU], [x0 + wc / 2, yD], [x0 + wc / 2, yD + hc], [x0 + wc + M * 0.34 + 4, yU + hc / 2], [x0 + wc + M * 0.34 + 4, yD + hc / 2]];
    }
    if (n === 'arrival') {
      var A = this.arrG(C), X = function (u) { return A.xa + u * (A.xb - A.xa); };
      return A.U.slice(0, 3).map(function (u) { return [X(u), A.y]; })
        .concat([[A.sx, A.y - A.ar], [X(A.U[3]), A.y], [X(A.U[4]), A.y]]);
    }
    if (n === 'cycle') {
      var G = this.cycG(C);
      return [[G.x0, cy + M * 0.03]].concat(G.X.map(function (x) { return [x, cy + G.dy + M * 0.02]; }));
    }
    if (n === 'table') return [[cx, cy - M * 0.36], [cx, cy + M * 0.32], [cx + M * 0.5, cy]];
    if (n === 'network') return this.netA(C);
    if (n === 'tiles') {
      var tg = this.tg(C), x0t = tg[0], wt = tg[1];
      var ryt = function (r) { return cy - M * 0.38 + r * M * 0.075; };
      return [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (r) { return [x0t + wt + 6, ryt(r)]; })
        .concat([0, 1, 2, 3].map(function (k) { return [x0t + wt * (0.08 + k * 0.28), cy + M * 0.38]; }));
    }
    if (n === 'bars') return [0, 1, 2, 3, 4].map(function (k) { return [cx + M * 0.12, cy - M * 0.3 + k * M * 0.15]; });
    if (n === 'loop') {
      var nd = this.loop4(C), d = M * 0.07;
      var mx = (nd[0][0] + nd[1][0]) / 2 - cx, my = (nd[0][1] + nd[1][1]) / 2 - cy, ml = Math.hypot(mx, my) || 1;
      return [[nd[0][0], nd[0][1] - d * 0.4], [nd[1][0] + d * 0.6, nd[1][1]], [nd[2][0], nd[2][1] + d * 0.4], [nd[3][0], nd[3][1] - d * 1.4],
        [(nd[0][0] + nd[1][0]) / 2 + mx / ml * M * 0.21, (nd[0][1] + nd[1][1]) / 2 + my / ml * M * 0.21]];
    }
    if (n === 'path') return this.safariN(C).map(function (c, k) { return [c[0] + (k % 2 ? 1 : -1) * M * 0.04, c[1]]; });
    return [];
  };

  /* ---- Canvas text ------------------------------------------------------
     Measures the label, nudges it below anything it would overlap, and
     registers its rectangle so later labels and the DOM notes avoid it. */

  S.ctext = function (g, txt, x, y, al, font, align, avoid) {
    if (!(al > 0.01)) return;
    g.save();
    g.font = font; g.textAlign = 'left'; g.textBaseline = 'middle';
    var tw = g.measureText(txt).width, mm = font.match(/(\d+(\.\d+)?)px/);
    var h = (mm ? parseFloat(mm[1]) : 10) * 1.35, LR = this.LR;
    var l = align === 'center' ? x - tw / 2 : align === 'right' ? x - tw : x;
    var top = y - h / 2;
    if (avoid !== false) {
      for (var k = 0; k < 6; k++) {
        var hit = null;
        for (var q = 0; q < LR.length; q++) {
          var r = LR[q];
          if (l < r.right + 6 && l + tw > r.left - 6 && top < r.bottom + 3 && top + h > r.top - 3) { hit = r; break; }
        }
        if (!hit) break;
        top = hit.bottom + 4;
      }
    }
    LR.push({ left: l, right: l + tw, top: top, bottom: top + h });
    g.globalAlpha = al;
    g.fillStyle = '#424C47';
    g.fillText(txt, l, top + h / 2);
    g.restore();
  };

  /* The month photo, drawn inside the viewfinder with a slow 4% zoom. */
  S.camPhoto = function (g, C, w) {
    if (w < 0.02) return;
    var V = this.camV(C);
    var f = this.cl((C.p - 0.08) / 0.74) * (this.IDEAS.length - 1);
    var k0 = Math.floor(f), k1 = Math.min(this.IDEAS.length - 1, k0 + 1), fr = this.E((f - k0 - 0.6) / 0.4);
    var dr = function (im, al) {
      if (!im || !im.complete || !im.naturalWidth || al <= 0.01) return;
      var r = Math.max(V.w / im.naturalWidth, V.h / im.naturalHeight);
      var sw = V.w / r, sh = V.h / r, zoom = 1 + 0.04 * Math.sin(C.t * 0.3);
      g.save();
      g.globalAlpha = al;
      g.beginPath(); g.rect(V.x0, V.y0, V.w, V.h); g.clip();
      g.drawImage(im, (im.naturalWidth - sw / zoom) / 2, (im.naturalHeight - sh / zoom) / 2, sw / zoom, sh / zoom, V.x0, V.y0, V.w, V.h);
      g.restore();
    };
    dr(this.IM[k0], 0.85 * w * (1 - fr));
    dr(this.IM[k1], 0.85 * w * fr);
  };

  /* ---- Per-scene extras: rings, gates, glows and canvas labels --------- */

  S.fx = function (g, n, C, w) {
    if (w < 0.03) return;
    var cx = C.cx, cy = C.cy, M = C.M, t = C.t, p = C.p;
    var ink = this.SAGE, cl = this.cl.bind(this), E = this.E.bind(this), self = this;
    /* Hair space, so tracked-out canvas capitals read like the DOM ones. */
    var hs = function (x) { return x.split('').join(String.fromCharCode(8202)); };
    var F9 = '500 9px "Plus Jakarta Sans", sans-serif';
    var F10 = '500 10px "Plus Jakarta Sans", sans-serif';
    var ring = function (x, y, r, a) {
      if (a <= 0.003) return;
      g.strokeStyle = 'rgba(' + ink + ',' + a.toFixed(3) + ')';
      g.lineWidth = 1;
      g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke();
    };

    if (n === 'doors') {
      var ra = cl((p - 0.35) / 0.1) * w;
      for (var k2 = 0; k2 < 2; k2++) { var phd = (t / 3.5 + k2 / 2) % 1; ring(cx, cy, 8 + phd * M * 0.14, (1 - phd) * 0.35 * ra); }
      if (!C.nar) this.ctext(g, hs('PROSPECT'), cx, cy + M * 0.075, w * cl((p - 0.38) / 0.1), F10, 'center');
    }

    if (n === 'estate') {
      /* The ring opens a gap near the end of the scene. */
      var gap = cl((p - 0.7) / 0.25) * 0.9;
      g.strokeStyle = 'rgba(' + ink + ',' + (0.22 * w).toFixed(3) + ')';
      g.lineWidth = 1;
      g.beginPath(); g.arc(cx, cy, M * 0.62, gap / 2, Math.PI * 2 - gap / 2); g.stroke();

      if (!C.nar) {
        var WD = [[-0.36, -0.34, 'The garden', 30], [0.12, -0.38, 'Slowing down', 18], [0.3, -0.22, 'The estate’s own wines', 21], [-0.1, -0.16, 'Babel', 26], [-0.44, -0.18, 'Fewer than thirty rooms', 16], [0.1, -0.06, 'Time to wander', 17], [-0.4, 0.02, 'Soetmelksvlei', 19], [0.34, 0.06, 'Switching off', 18], [-0.14, 0.16, 'Picked this morning', 17], [0.2, 0.22, 'Reconnecting', 22], [-0.34, 0.32, 'Long lunches, no rush', 16], [0.05, 0.36, 'The quiet of the vines', 17], [0.4, 0.46, 'Feeling at home', 16]];
        WD.forEach(function (d, k) {
          var v = cl((p - (k * 0.045 + 0.06)) / 0.12) * (1 - cl((p - 0.86) / 0.08)) * w;
          self.ctext(g, d[2],
            cx + d[0] * M + Math.sin(t * 0.3 + k) * 6,
            cy + d[1] * M + Math.cos(t * 0.25 + k * 1.7) * 4 + (1 - v) * 10,
            v * (d[3] >= 20 ? 0.95 : 0.7), '400 ' + d[3] + 'px "Tenor Sans", serif', 'center');
        });
      }
    }

    if (n === 'arrival') {
      var A = this.arrG(C), tv = cl((p - 0.08) / 0.6), x = A.xa + tv * (A.xb - A.xa);
      var gr = g.createRadialGradient(x, A.y, 1, x, A.y, M * 0.07);
      gr.addColorStop(0, 'rgba(' + ink + ',' + (0.3 * w).toFixed(3) + ')');
      gr.addColorStop(1, 'rgba(' + ink + ',0)');
      g.fillStyle = gr;
      g.fillRect(x - M * 0.07, A.y - M * 0.07, M * 0.14, M * 0.14);
    }

    if (n === 'centre') {
      var h2 = M * 0.26, ox = cx - M * 0.05 + M * 0.3 + M * 0.34;
      ring(ox, cy - M * 0.34 + h2 / 2, 7, 0.6 * w * cl((p - 0.35) / 0.15));
      ring(ox, cy + M * 0.08 + h2 / 2, 7, 0.6 * w * cl((p - 0.4) / 0.15));
    }

    if (n === 'cycle') {
      var G = this.cycG(C);
      if (!C.nar) {
        ['SUMMER', 'AUTUMN', 'WINTER', 'SPRING'].forEach(function (tx, k) {
          self.ctext(g, hs(tx), G.X[k], cy - G.dy - M * 0.14, 0.75 * w, F9, 'center');
        });
        this.ctext(g, hs('RETURN TO BABYLONSTOREN'), G.xs, cy - G.dy - 26, w * cl((p - 0.2) / 0.1), F10, 'left');
        this.ctext(g, hs('DISCOVER A SISTER ESTATE'), G.xs, cy + G.dy - 26, w * cl((p - 0.4) / 0.1), F10, 'left');
      }
      g.save();
      g.strokeStyle = 'rgba(' + ink + ',' + (0.08 * w).toFixed(3) + ')';
      G.X.forEach(function (x) { g.beginPath(); g.moveTo(x, cy - G.dy - M * 0.1); g.lineTo(x, cy + G.dy + 6); g.stroke(); });
      /* The booking-window band sweeps across the four seasons and back. */
      var phc = (t * 0.12) % 4;
      var bx = G.X[0] + phc / 3 * (G.X[3] - G.X[0]) * (phc <= 3 ? 1 : 0) + (phc > 3 ? (4 - phc) * (G.X[3] - G.X[0]) : 0);
      var ba = w * cl((p - 0.35) / 0.1);
      var grc = g.createLinearGradient(bx - M * 0.06, 0, bx + M * 0.06, 0);
      grc.addColorStop(0, 'rgba(' + ink + ',0)');
      grc.addColorStop(0.5, 'rgba(' + ink + ',' + (0.12 * ba).toFixed(3) + ')');
      grc.addColorStop(1, 'rgba(' + ink + ',0)');
      g.fillStyle = grc;
      g.fillRect(bx - M * 0.06, cy - G.dy - M * 0.08, M * 0.12, G.dy * 2 + M * 0.12);
      g.restore();
      if (!C.nar) this.ctext(g, hs('NEXT BOOKING WINDOW'), bx, cy, 0.8 * ba, F9, 'center');
    }

    if (n === 'season' && !C.nar) {
      var V = this.camV(C), x0 = V.x0, y0 = V.y0, vw = V.w, vh2 = V.h;
      var f = cl((p - 0.08) / 0.74) * (this.IDEAS.length - 1);
      this.ctext(g, hs('REC'), x0 + M * 0.075, y0 + M * 0.05, 0.75 * w, F9, 'left');
      var sec = Math.floor(t * 4) % 60, mn = Math.floor(t * 4 / 60) % 60;
      this.ctext(g, 'THIS MONTH AT BABYLONSTOREN  ·  00:' + String(mn).padStart(2, '0') + ':' + String(sec).padStart(2, '0'),
        x0 + vw - M * 0.03, y0 + M * 0.05, 0.75 * w, F9, 'right');
      /* The twelve months rotate under the frame. */
      this.IDEAS.forEach(function (idea, k) {
        var d = k - f, ad = Math.abs(d);
        if (d < -0.6 || d > 1.4) return;
        var al = (d < 0 ? Math.max(0, 1 + d / 0.6) : Math.max(0, 1 - ad * 0.85)) * w;
        var sz = 21 - Math.min(1, ad) * 7, yy = y0 + vh2 + 84 + d * 42;
        self.ctext(g, hs(idea[2].toUpperCase()), x0 + vw / 2, yy - 17, al * 0.8, F9, 'center', false);
        self.ctext(g, idea[0], x0 + vw / 2, yy, al, '400 ' + sz.toFixed(1) + 'px "Tenor Sans", serif', 'center', false);
      });
    }

    if (n === 'people' && !C.nar) {
      var tgp = this.tg(C), x0p = tgp[0], ww = tgp[1];
      var ryp = function (r) { return cy - M * 0.3 + r * M * 0.15; };
      ['Constance, the gardener', 'The chefs', 'The winemaker', 'The farm team', 'The hotel staff'].forEach(function (tx, r) {
        self.ctext(g, hs(tx.toUpperCase()), x0p + ww + 16, ryp(r),
          w * cl((p - (r * 0.1 * 0.55 + 0.12)) / 0.1) * (1 - cl((p - 0.84) / 0.08)), F10, 'left');
      });
      g.save();
      g.globalAlpha = 0.7 * w;
      g.fillStyle = '#424C47';
      g.font = F9;
      g.textAlign = 'center';
      for (var e = 0; e < 8; e++) g.fillText(hs('EP ' + (e + 1)), x0p + (e + 0.5) / 8 * ww, cy - M * 0.3 - M * 0.12);
      g.restore();
    }

    if (n === 'table') {
      var T = this.feastT(C), qa = Math.min(3, Math.floor(cl((p - 0.08) / 0.7) * 4)), tb = T[qa];
      g.save();
      g.translate(tb.x, tb.y);
      g.scale(3, 1);
      var grt = g.createRadialGradient(0, 0, 2, 0, 0, M * 0.09);
      grt.addColorStop(0, 'rgba(' + ink + ',' + (0.18 * w).toFixed(3) + ')');
      grt.addColorStop(1, 'rgba(' + ink + ',0)');
      g.fillStyle = grt;
      g.fillRect(-M * 0.12, -M * 0.1, M * 0.24, M * 0.2);
      g.restore();
      if (!C.nar) {
        [['SUMMER', 'The harvest table'], ['AUTUMN', 'Olives and new wine'], ['WINTER', 'Around the fire'], ['SPRING', 'First of the garden']].forEach(function (d, k) {
          var al = w * (k === qa ? 1 : 0.45);
          self.ctext(g, hs(d[0]), T[k].x, T[k].y - T[k].h / 2 - M * 0.075, al, F10, 'center');
          self.ctext(g, d[1], T[k].x, T[k].y + T[k].h / 2 + M * 0.075, al * 0.85, '300 11px "Plus Jakarta Sans", sans-serif', 'center');
        });
      }
    }

    if (n === 'network') {
      var GN = this.netG(C), sp2 = cl((p - 0.06) / 0.6) * 3, win = E((sp2 - 1.6) / 0.6), ran = cl(sp2 - 2.4) * w;
      for (var k3 = 0; k3 < 3; k3++) { var phn = (t / 3 + k3 / 3) % 1; ring(GN.R[0], GN.R[1], 8 + phn * M * 0.22, (1 - phn) * 0.3 * ran); }
      if (!C.nar) {
        var F = '400 16px "Tenor Sans", serif', la = w * cl(sp2 - 1.2);
        this.ctext(g, 'A', GN.AB[0][0] + M * 0.055, GN.AB[0][1], la * (1 - 0.55 * win), F, 'left');
        this.ctext(g, 'B', GN.AB[1][0] + M * 0.055, GN.AB[1][1], la, F, 'left');
      }
    }

    if (n === 'tiles') {
      var tgt3 = this.tg(C), x0t = tgt3[0], wwt = tgt3[1];
      g.save();
      g.globalAlpha = 0.7 * w;
      g.fillStyle = '#424C47';
      g.font = F9;
      g.textAlign = 'center';
      'JFMAMJJASOND'.split('').forEach(function (c2, m) { g.fillText(c2, x0t + m / 11 * wwt, cy - M * 0.38 - 16); });
      g.restore();

      if (!C.nar) {
        var lab = function (txt, x, y, al, align) { self.ctext(g, hs(txt.toUpperCase()), x, y, al, F10, align); };
        var rows = ['Instagram reel · weekly', 'YouTube Shorts', 'This month at…', 'Life on the farm', 'The restaurant · garden to plate', 'Spring on the farm, every season', 'A year of wine', 'A year of olive oil', 'Farm-to-fork in November'];
        rows.forEach(function (txt, r) {
          lab(txt, x0t + wwt + 16, cy - M * 0.38 + r * M * 0.075,
            w * cl((p - (r * 0.055 * 0.55 + 0.12)) / 0.1) * (1 - cl((p - 0.84) / 0.08)), 'left');
        });
        [['Long form', 0], ['Shorts', 1], ['SEO', 2], ['Email', 3], ['Seasonal paid', 4]].forEach(function (d) {
          lab(d[0], x0t + wwt * (0.06 + d[1] * 0.22), cy + M * 0.36 + M * 0.06,
            w * cl((p - ((0.62 + d[1] * 0.06) * 0.55 + 0.12)) / 0.1) * (1 - cl((p - 0.84) / 0.08)), 'center');
        });
      }

      /* Series rows flowing down into the five outputs. */
      var flt = cl((p - 0.5) / 0.15) * w;
      if (flt > 0.02) {
        for (var k4 = 0; k4 < 5; k4++) {
          for (var j4 = 0; j4 < 6; j4++) {
            var ft = (t * 0.22 + j4 / 6 + k4 * 0.13) % 1;
            var sxt = x0t + wwt * (0.1 + ((j4 * 7 + k4 * 3) % 11) / 11 * 0.8);
            var ext = x0t + wwt * (0.06 + k4 * 0.22);
            var y1 = cy - M * 0.38 + 8.4 * M * 0.075, y2 = cy + M * 0.33;
            g.fillStyle = 'rgba(' + ink + ',' + ((1 - Math.abs(ft - 0.5) * 2) * 0.5 * flt).toFixed(3) + ')';
            g.beginPath(); g.arc(sxt + (ext - sxt) * ft, y1 + (y2 - y1) * ft, 1.6, 0, 7); g.fill();
          }
        }
      }
    }

    if (n === 'bars') {
      g.strokeStyle = 'rgba(' + ink + ',' + (0.25 * w).toFixed(3) + ')';
      g.lineWidth = 1;
      g.beginPath(); g.moveTo(cx - M * 0.47, cy + M * 0.31); g.lineTo(cx + M * 0.06, cy + M * 0.31); g.stroke();
    }

    if (n === 'loop') {
      var headl = (t * 0.22) % 4, al4 = -Math.PI / 2 + headl * Math.PI / 2;
      g.strokeStyle = 'rgba(' + ink + ',' + (0.35 * w).toFixed(3) + ')';
      g.lineWidth = 2;
      g.beginPath(); g.ellipse(cx, cy, M * 0.34 * 1.15, M * 0.34, 0, al4 - 0.5, al4 + 0.05); g.stroke();
      g.lineWidth = 1;
      g.strokeStyle = 'rgba(' + ink + ',' + (0.08 * w).toFixed(3) + ')';
      g.beginPath(); g.ellipse(cx, cy, M * 0.34 * 1.15, M * 0.34, 0, 0, 7); g.stroke();
    }

    if (n === 'leaf') {
      for (var k5 = 0; k5 < 2; k5++) { var phl = (t / 4 + k5 / 2) % 1; ring(cx, cy, M * 0.3 + phl * M * 0.3, (1 - phl) * 0.1 * w); }
    }
  };

  /* ---- The leaf, sampled from the same path as the hero mark ----------- */

  S.makeLogo = function (N) {
    this.logo = this.logo || {};
    if (this.logo[N]) return this.logo[N];

    var segs = [[30, 4, 42, 9, 50, 20], [50, 20, 58, 32, 59, 47], [59, 47, 60, 62, 55, 74], [55, 74, 48, 86, 30, 93], [30, 93, 12, 86, 5, 74], [5, 74, 0, 62, 1, 47], [1, 47, 2, 32, 10, 20], [10, 20, 18, 9, 30, 4]];
    var nOut = Math.round(N * 0.36), out = [];
    for (var k = 0; k < nOut; k++) {
      var f = k / nOut * segs.length, si = Math.floor(f), r = f - si, s = segs[si];
      out.push([
        (1 - r) * (1 - r) * s[0] + 2 * (1 - r) * r * s[2] + r * r * s[4],
        (1 - r) * (1 - r) * s[1] + 2 * (1 - r) * r * s[3] + r * r * s[5]
      ]);
    }

    /* Fill the blade with a hex-ish grid, skipping the midrib, then settle on
       a spacing that yields roughly the number of points we need. */
    var c = document.createElement('canvas').getContext('2d');
    var pp = new Path2D('M30,4 Q42,9 50,20 Q58,32 59,47 Q60,62 55,74 Q48,86 30,93 Q12,86 5,74 Q0,62 1,47 Q2,32 10,20 Q18,9 30,4Z');
    var need = N - nOut, sp = Math.sqrt(3600 / need), pts = [];
    for (var tries = 0; tries < 14; tries++) {
      pts = [];
      var row = 0;
      for (var y = 4 + sp * 0.6; y < 93; y += sp * 0.87, row++) {
        for (var x = (row % 2 ? sp / 2 : 0) + 1; x < 60; x += sp) {
          if (Math.abs(x - 30) < 2.6) continue;
          var inside = [[x, y], [x + 2.4, y], [x - 2.4, y], [x, y + 2.4], [x, y - 2.4]].every(function (q) {
            return c.isPointInPath(pp, q[0], q[1]);
          });
          if (inside) pts.push([x, y]);
        }
      }
      if (pts.length >= need && pts.length <= need * 1.08) break;
      sp *= pts.length > need ? 1.04 : 0.96;
    }
    var inner = [];
    for (var m = 0; m < need; m++) inner.push(pts.length ? pts[Math.floor(m * pts.length / need)] : [30, 50]);
    return (this.logo[N] = out.concat(inner));
  };

  /* ---- Go -------------------------------------------------------------- */

  if (document.querySelector('[data-track]')) new Stage().mount();
})();
