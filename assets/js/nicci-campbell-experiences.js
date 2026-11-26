/* Nicci Campbell Experiences landing page: splash, reveals, contact links, slideshow. */
const root = document.documentElement;
const splash = document.getElementById('splash');
const enter = document.getElementById('splashEnter');
const heroContent = document.querySelector('.hero-content');
root.classList.add('splash-open');
enter.focus({ preventScroll: true });

// Run from script rather than CSS transitions so phones with Reduce Motion still get the slow fade.
enter.addEventListener('click', () => {
  enter.disabled = true;
  splash.style.pointerEvents = 'none';
  const finish = () => { splash.remove(); root.classList.remove('splash-open'); };
  if (!splash.animate) { finish(); heroContent.classList.add('is-in'); return; }
  splash.querySelectorAll('.splash-inner, .splash-maker').forEach(el => el.animate(
    [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.985)' }],
    { duration: 2200, easing: 'ease-in-out', fill: 'forwards' }
  ));
  splash.animate(
    [{ opacity: 1 }, { opacity: 0 }],
    { duration: 5200, delay: 1200, easing: 'cubic-bezier(0.45, 0, 0.25, 1)', fill: 'forwards' }
  ).finished.then(finish, finish);
  setTimeout(() => heroContent.classList.add('is-in'), 3200);
});

// Gentle fade-up as each block scrolls into view, a beat apart.
const revealEls = document.querySelectorAll(
  '.letter > section:not(.contact) > :not(.help):not(.reviews), .help li, .review, .pair figure, .contact, .signoff, .footer'
);
revealEls.forEach(el => el.classList.add('reveal'));
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.filter(e => e.isIntersecting).forEach((e, i) => {
      io.unobserve(e.target);
      setTimeout(() => e.target.classList.add('is-in'), i * 280);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-in'));
}

// Placeholders: replace with Nicci's real WhatsApp number (international format, digits only) and email
const CONTACT = {
  whatsapp: "27000000000",
  email: "nicci@example.com",
  message: "Hi Nicci, I found you on Instagram and I'd love to chat about an event I'm planning."
};
document.querySelectorAll("[data-wa]").forEach(a => {
  a.href = "https://wa.me/" + CONTACT.whatsapp + "?text=" + encodeURIComponent(CONTACT.message);
});
document.querySelectorAll("[data-mail]").forEach(a => {
  a.href = "mailto:" + CONTACT.email + "?subject=" + encodeURIComponent("Event enquiry");
});
document.getElementById("contactEmail").textContent = CONTACT.email;

const slides = document.querySelectorAll('.hero-slide');
let hCur = 0;
setInterval(() => {
  slides[hCur].classList.remove('active');
  hCur = (hCur + 1) % slides.length;
  slides[hCur].classList.add('active');
}, 7000);

const hint = document.querySelector('.scroll-hint');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    hint.style.transition = 'opacity 0.5s';
    hint.style.opacity = '0';
  }
}, { passive: true });
