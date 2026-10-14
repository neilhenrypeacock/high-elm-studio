/* High Elm Studio — story.
   The horizon draws in and the sun rises as Norfolk arrives. Down the road,
   the route line fills and each stop lights as you pass it. */
(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const cl = (v) => Math.max(0, Math.min(1, v));
  const ez = (t) => 1 - Math.pow(1 - t, 3);

  const stops = $$('.road__stop');
  const horizon = $('#horizon');
  const sun = $('#sun');
  const route = $('#route');

  /* --- Stops rise in as they arrive ------------------------------------- */
  const show = (el) => el.classList.add('is-in');

  if (!('IntersectionObserver' in window)) {
    stops.forEach(show);
  } else {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } }),
      { rootMargin: '0px 0px -12% 0px' }
    );
    const watch = () => stops.forEach((el) => io.observe(el));
    watch();
    setTimeout(watch, 400);
  }

  /* --- Horizon, sun and route ------------------------------------------- */
  let raf = null;

  function tick() {
    raf = null;
    const vh = innerHeight;

    if (horizon) {
      const r = horizon.getBoundingClientRect();
      const p = cl((vh - r.top) / (vh * 0.6));
      horizon.style.transform = 'scaleX(' + ez(p).toFixed(3) + ')';
      if (sun) {
        const s = cl((p - 0.55) / 0.45);
        sun.style.opacity = s.toFixed(3);
        sun.style.transform = 'translateY(' + ((1 - ez(s)) * 36).toFixed(1) + 'px)';
      }
    }

    if (route) {
      const box = route.parentElement.getBoundingClientRect();
      const mid = vh * 0.6;
      const p = cl((mid - box.top) / box.height);
      route.style.height = (p * 100).toFixed(2) + '%';
      $$('.road__dot').forEach((d) => {
        d.classList.toggle('is-passed', d.getBoundingClientRect().top < mid);
      });
    }
  }

  const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  tick();
  setTimeout(tick, 400);
})();
