/* High Elm Studio — shared chrome.
   <hes-menu>   floating logo, MENU pill and the full-screen Ink menu
   <hes-cursor> faint dots orbiting the cursor, with broken threads
   Both use mix-blend-mode:difference, so they read over any background. */
(function () {
  if (customElements.get('hes-menu')) return;

  const ITEMS = [
    ['01', 'Home',     '/',          'Who we work with, how we think, and the work.'],
    ['02', 'Work',     '/work/',     'Films, reels and stories for travel, hospitality and property.'],
    ['03', 'Services', '/services/', 'Film, presenting, podcasts, websites and AI systems.'],
    ['04', 'Story',    '/story/',    'From a farm in Norfolk to Cape Town, by way of the world.'],
    ['05', 'Contact',  '/contact/',  'Start a conversation, or request a free website audit.']
  ];

  // Normalise "/", "/index.html", "/work/", "/work/index.html" to one shape.
  const norm = (p) => {
    p = (p || '/').split(/[?#]/)[0].replace(/index\.html$/, '');
    if (!p.startsWith('/')) p = '/' + p;
    return p.length > 1 ? p.replace(/\/+$/, '/') : '/';
  };
  const here = norm(location.pathname);
  const isHome = here === '/';

  class HesMenu extends HTMLElement {
    connectedCallback() {
      if (this._built) return; this._built = true;
      const root = this.attachShadow({ mode: 'open' });
      const rows = ITEMS.map(([n, label, href, line], i) => {
        const cur = norm(href) === here;
        return `<a class="row" href="${href}" style="--d:${120 + i * 70}ms"${cur ? ' aria-current="page"' : ''}><span class="n">${n}</span><span class="l">${label}${cur ? '<i></i>' : ''}</span><span class="t">${line}</span></a>`;
      }).join('');

      root.innerHTML = `<style>
        :host{all:initial}
        a.lg{position:fixed;top:24px;left:32px;z-index:120;display:flex;align-items:center;gap:11px;color:#fff;text-decoration:none;mix-blend-mode:difference;font-family:'League Spartan','Helvetica Neue',sans-serif;font-weight:600;letter-spacing:-.05em;font-size:21px;line-height:1}
        a.lg svg{display:block}
        a.lg,button.b{transition:opacity .8s ease,transform .8s cubic-bezier(.16,1,.3,1),border-color .4s ease,padding .5s cubic-bezier(.16,1,.3,1)}
        :host([pre]:not([open])) a.lg,:host([pre]:not([open])) button.b{opacity:0;transform:translateY(-10px);pointer-events:none}
        @media (max-width:720px){a.lg{left:20px;top:22px;font-size:19px}}
        button.b{position:fixed;top:20px;right:28px;z-index:120;height:40px;padding:0 16px 0 18px;border-radius:20px;border:1px solid rgba(255,255,255,0.45);background:transparent;mix-blend-mode:difference;cursor:pointer;display:flex;align-items:center;gap:12px;color:#fff;font:500 11px/1 'Plus Jakarta Sans','Helvetica Neue',sans-serif;letter-spacing:.2em;text-transform:uppercase;transition:border-color .4s ease,padding .5s cubic-bezier(.16,1,.3,1)}
        button.b:hover{border-color:#fff;padding:0 18px 0 22px}
        button.b .lines{display:flex;flex-direction:column;align-items:flex-end;gap:4px;width:16px}
        button.b .lines span{display:block;height:1px;background:#fff;transition:transform .5s cubic-bezier(.16,1,.3,1),width .5s cubic-bezier(.16,1,.3,1)}
        button.b .lines span:first-child{width:16px}button.b .lines span:last-child{width:9px}
        button.b:hover .lines span:last-child{width:16px}
        :host([open]) button.b .lines span:first-child{width:14px;transform:translateY(2.5px) rotate(45deg)}
        :host([open]) button.b .lines span:last-child{width:14px;transform:translateY(-2.5px) rotate(-45deg)}
        .lbl{display:grid}.lbl b{grid-area:1/1;font-weight:500;transition:opacity .35s ease,transform .5s cubic-bezier(.16,1,.3,1)}
        .lbl b:last-child{opacity:0;transform:translateY(6px)}
        :host([open]) .lbl b:first-child{opacity:0;transform:translateY(-6px)}:host([open]) .lbl b:last-child{opacity:1;transform:none}
        .o{position:fixed;inset:0;z-index:110;background:#0C1520;color:#FAF8F4;font-family:'Plus Jakarta Sans','Helvetica Neue',sans-serif;font-weight:300;clip-path:circle(0 at calc(100% - 70px) 40px);transition:clip-path .8s cubic-bezier(.7,0,.2,1),visibility 0s linear .8s;overflow:hidden;-webkit-font-smoothing:antialiased;visibility:hidden}
        :host([open]) .o{clip-path:circle(150% at calc(100% - 70px) 40px);visibility:visible;transition:clip-path .8s cubic-bezier(.7,0,.2,1),visibility 0s linear 0s}
        .in{max-width:1280px;margin:0 auto;height:100%;padding:clamp(72px,11vh,104px) 40px clamp(20px,4vh,36px);display:flex;flex-direction:column;justify-content:space-between;gap:clamp(16px,3vh,32px);box-sizing:border-box}
        .row{display:grid;grid-template-columns:56px minmax(0,1fr) minmax(0,360px);gap:8px 32px;align-items:baseline;padding:clamp(8px,1.9vh,18px) 0;border-top:1px solid rgba(250,248,244,0.12);color:#FAF8F4;text-decoration:none;opacity:0;transform:translateY(24px);transition:opacity .6s ease,transform .8s cubic-bezier(.16,1,.3,1)}
        .row:last-of-type{border-bottom:1px solid rgba(250,248,244,0.12)}
        :host([open]) .row{opacity:1;transform:none;transition-delay:var(--d)}
        .row:focus-visible{outline:2px solid #FAF8F4;outline-offset:4px}
        .n{font-size:12px;letter-spacing:.14em;color:#A9B0B8}
        .l{font-family:'Tenor Sans','Helvetica Neue',sans-serif;font-size:clamp(24px,min(5.4vh,4.4vw),54px);line-height:1;letter-spacing:-.01em;display:flex;align-items:center;gap:16px;transition:transform .5s cubic-bezier(.16,1,.3,1)}
        .l i{width:7px;height:7px;border-radius:50%;background:#FAF8F4}
        .t{font-size:13px;line-height:1.5;color:#A9B0B8;transition:color .4s}
        .row:hover .l{transform:translateX(12px)}.row:hover .t{color:#FAF8F4}
        .f{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-size:13px;color:#A9B0B8;opacity:0;transition:opacity .6s ease .5s}
        :host([open]) .f{opacity:1}
        .f a{color:#FAF8F4;text-decoration:none;border-bottom:1px solid rgba(250,248,244,0.3)}
        @media (max-width:720px){.row{grid-template-columns:40px minmax(0,1fr)}.t{grid-column:2}.in{padding:clamp(72px,11vh,96px) 24px 24px}button.b{right:16px;top:18px}}
        @media (max-height:620px),(max-width:720px) and (max-height:760px){.t{display:none}}
        @media (prefers-reduced-motion:reduce){.o,.row,.f{transition:none}}
      </style>
      <a class="lg" href="/" aria-label="High Elm Studio, home"><svg width="16" height="27" viewBox="0 0 60 100" aria-hidden="true"><path d="M30,4 Q42,9 50,20 Q58,32 59,47 Q60,62 55,74 Q48,86 30,93 Q12,86 5,74 Q0,62 1,47 Q2,32 10,20 Q18,9 30,4Z" fill="#fff"></path><g stroke="#000" stroke-linecap="round"><line x1="30" y1="5" x2="30" y2="92" stroke-width="2.4"></line><g stroke-width="1.5"><line x1="30" y1="25" x2="44" y2="32"></line><line x1="30" y1="40" x2="49" y2="48"></line><line x1="30" y1="55" x2="50" y2="62"></line><line x1="30" y1="70" x2="46" y2="76"></line><line x1="30" y1="25" x2="16" y2="32"></line><line x1="30" y1="40" x2="11" y2="48"></line><line x1="30" y1="55" x2="10" y2="62"></line><line x1="30" y1="70" x2="14" y2="76"></line></g></g></svg><span>high elm studio.</span></a>
      <button class="b" aria-label="Open menu" aria-expanded="false"><span class="lbl"><b>Menu</b><b>Close</b></span><span class="lines"><span></span><span></span></span></button>
      <div class="o" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden="true"><div class="in">
        <span></span>
        <nav>${rows}</nav>
        <div class="f"><a href="mailto:neil@highelmstudio.com">neil@highelmstudio.com</a><span>Luxury travel, hospitality and property · Cape Town and the UK</span></div>
      </div></div>`;

      const btn = root.querySelector('button.b');
      const ov = root.querySelector('.o');
      const rowEls = [...root.querySelectorAll('.row')];

      const set = (v) => {
        this.toggleAttribute('open', v);
        btn.setAttribute('aria-expanded', String(v));
        btn.setAttribute('aria-label', v ? 'Close menu' : 'Open menu');
        ov.setAttribute('aria-hidden', String(!v));
        document.documentElement.style.overflow = v ? 'hidden' : '';
        if (v) { this._last = document.activeElement; setTimeout(() => rowEls[0] && rowEls[0].focus(), 120); }
        else if (this._last && this._last.focus) this._last.focus();
      };

      // On the homepage both stay hidden until the hero has scrolled away.
      if (isHome || this.hasAttribute('home')) {
        const chk = () => this.toggleAttribute('pre', window.scrollY < 40);
        chk();
        window.addEventListener('scroll', chk, { passive: true });
      }

      btn.addEventListener('click', () => set(!this.hasAttribute('open')));
      rowEls.forEach(a => a.addEventListener('click', () => set(false)));
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.hasAttribute('open')) set(false);
        if (e.key !== 'Tab' || !this.hasAttribute('open')) return;
        // Keep focus inside the open menu.
        const f = [...rowEls, root.querySelector('.f a'), btn];
        const i = f.indexOf(root.activeElement);
        if (i === -1) return;
        const n = e.shiftKey ? i - 1 : i + 1;
        if (n < 0 || n >= f.length) { e.preventDefault(); f[e.shiftKey ? f.length - 1 : 0].focus(); }
      });
    }
  }
  customElements.define('hes-menu', HesMenu);

  class HesCursor extends HTMLElement {
    connectedCallback() {
      if (this._built) return; this._built = true;
      if (!matchMedia('(pointer:fine)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return;

      const c = document.createElement('canvas');
      c.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:100;mix-blend-mode:difference';
      this.appendChild(c);

      const g = c.getContext('2d'), N = 10;
      const pts = Array.from({ length: N }, () => ({ x: -100, y: -100 }));
      let mx = -100, my = -100, idle = 0, last = performance.now();

      window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; idle = 0; }, { passive: true });

      const loop = (now) => {
        requestAnimationFrame(loop);
        const dt = Math.min(0.05, (now - last) / 1000); last = now; idle += dt;
        const dpr = Math.min(2, devicePixelRatio || 1), W = innerWidth, H = innerHeight;
        if (c.width !== Math.round(W * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
        g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
        const fade = Math.max(0, 1 - Math.max(0, idle - 1.2) / 1.2); if (fade <= 0) return;
        const t = now / 1000;
        pts.forEach((p, i) => {
          const ang = i / N * Math.PI * 2 + t * 0.3, rad = 26 + 14 * Math.sin(t * 0.6 + i * 1.7);
          const tx = mx + Math.cos(ang) * rad, ty = my + Math.sin(ang) * rad, k = 0.06 + (i % 4) * 0.025;
          p.x += (tx - p.x) * k; p.y += (ty - p.y) * k;
        });
        g.lineWidth = 0.5;
        for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
          const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y), on = Math.sin(t * 0.9 + i * 2.3 + j * 1.1);
          if (d < 40 && on > 0.1) {
            const al = 0.16 * fade * (1 - d / 40) * Math.min(1, (on - 0.1) / 0.3), r = 0.08 + 0.12 * ((i + j) % 3) / 2;
            g.strokeStyle = 'rgba(250,248,244,' + al.toFixed(3) + ')';
            g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(a.x + (b.x - a.x) * (1 - r), a.y + (b.y - a.y) * (1 - r)); g.stroke();
          }
        }
        pts.forEach((p, i) => {
          g.fillStyle = 'rgba(250,248,244,' + ((0.22 + 0.14 * (0.5 + 0.5 * Math.sin(t * 1.3 + i))) * fade).toFixed(3) + ')';
          g.beginPath(); g.arc(p.x, p.y, 1.1, 0, 7); g.fill();
        });
      };
      requestAnimationFrame(loop);
    }
  }
  customElements.define('hes-cursor', HesCursor);
})();
