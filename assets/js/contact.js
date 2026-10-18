/* High Elm Studio — contact.
   Two modes. The fields, the button and the thank-you all follow the choice.
   #audit (or ?audit) opens straight into the audit request. */
(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  const form = $('#cform');
  const sent = $('#sent');
  const errorEl = $('#cform-error');
  const sendBtn = $('#cform-send');
  const modeBtns = $$('.mode');
  if (!form || !sent || !errorEl || !sendBtn) return;

  // lead.js is a separate file. If it did not load, the form falls back to
  // a pre-filled email rather than throwing on submit.
  const INBOX = (window.HES && window.HES.leadInbox) || 'neil@highelmstudio.com';
  const submitLead = (kind, data, subject) => (window.HES && window.HES.submitLead)
    ? window.HES.submitLead(kind, data, subject)
    : Promise.reject(new Error('lead.js did not load'));

  const COPY = {
    talk: {
      cta: 'Send message',
      msgLabel: 'Message',
      msgPh: 'Tell us what you have in mind',
      thanks: 'Thank you. Your message is with Neil.',
      line: 'You’ll hear back personally, usually within one working day.',
      subject: 'Message from highelmstudio.com'
    },
    audit: {
      cta: 'Request my free audit',
      msgLabel: 'Anything we should know',
      msgPh: 'Optional: your goals, or what isn’t working',
      thanks: 'Your audit is on its way.',
      line: 'We’ll review your site the way your guests see it, and send clear, prioritised notes within five working days.',
      subject: 'Free audit request from highelmstudio.com'
    }
  };

  let mode = (location.hash === '#audit' || /audit/.test(location.search)) ? 'audit' : 'talk';

  function render() {
    const c = COPY[mode];
    modeBtns.forEach((b) => {
      const on = b.dataset.mode === mode;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    $$('[data-only]').forEach((el) => { el.hidden = el.dataset.only !== mode; });
    $('#msg-label').textContent = c.msgLabel;
    form.message.placeholder = c.msgPh;
    $('#cform-cta').textContent = c.cta;
  }

  function setMode(next, focusIt) {
    mode = next;
    sent.hidden = true;
    form.hidden = false;
    errorEl.hidden = true;
    render();
    if (focusIt) modeBtns.find((b) => b.dataset.mode === mode).focus();
  }

  modeBtns.forEach((b) => {
    b.addEventListener('click', () => setMode(b.dataset.mode));
    b.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      e.preventDefault();
      setMode(mode === 'talk' ? 'audit' : 'talk', true);
    });
  });

  addEventListener('hashchange', () => { if (location.hash === '#audit') setMode('audit'); });

  // Focus chips
  $$('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      chip.setAttribute('aria-pressed', String(chip.getAttribute('aria-pressed') !== 'true'));
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorEl.hidden = true;

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      errorEl.textContent = 'Please add your name and a valid email address so we can reply.';
      errorEl.hidden = false;
      (!name ? form.name : form.email).focus();
      return;
    }

    const c = COPY[mode];
    const data = { name, email, message: form.message.value.trim() };
    if (mode === 'audit') {
      data.site = form.site.value.trim();
      data.focus = $$('.chip').filter((x) => x.getAttribute('aria-pressed') === 'true').map((x) => x.textContent.trim());
    } else {
      data.company = form.company.value.trim();
    }

    sendBtn.disabled = true;
    submitLead(mode, data, c.subject)
      .then((how) => {
        form.hidden = true;
        sent.hidden = false;
        $('#sent-h').textContent = c.thanks;
        $('#sent-line').textContent = how === 'mailto'
          ? 'Your email app should have opened with this message ready to send. If it didn’t, write to ' + INBOX + '.'
          : c.line;
        $('#sent-again').focus();
      })
      .catch(() => {
        errorEl.innerHTML = 'Something went wrong sending that. Please email <a href="mailto:' +
          INBOX + '">' + INBOX + '</a> and we’ll pick it up.';
        errorEl.hidden = false;
      })
      .finally(() => { sendBtn.disabled = false; });
  });

  $('#sent-again').addEventListener('click', () => {
    form.reset();
    $$('.chip').forEach((x) => x.setAttribute('aria-pressed', 'false'));
    sent.hidden = true;
    form.hidden = false;
    render();
    form.name.focus();
  });

  render();
})();
