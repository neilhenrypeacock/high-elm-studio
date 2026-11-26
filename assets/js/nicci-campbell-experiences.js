/* Nicci Campbell Experiences landing page: splash, contact links, slideshow. */
const splash = document.getElementById('splash');
const enter = document.getElementById('splashEnter');
document.documentElement.classList.add('splash-open');
enter.focus({ preventScroll: true });
enter.addEventListener('click', () => {
  splash.classList.add('is-leaving');
  document.documentElement.classList.remove('splash-open');
  const done = () => splash.remove();
  splash.addEventListener('transitionend', e => { if (e.target === splash) done(); });
  setTimeout(done, 4000);
});

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
}, 4000);

const hint = document.querySelector('.scroll-hint');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    hint.style.transition = 'opacity 0.5s';
    hint.style.opacity = '0';
  }
}, { passive: true });
