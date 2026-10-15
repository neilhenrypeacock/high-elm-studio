/* High Elm Studio — where enquiries go.
   Both the homepage "Start here" forms and the Contact form call this.

   ─────────────────────────────────────────────────────────────────────────
   Enquiries go to your own Supabase project — no third-party form service,
   so nobody else holds your enquirers' details. The `website-lead` edge
   function validates the submission, stores it in the `website_leads` table
   on the service role, and emails you through Resend.

   Leave ENDPOINT empty and nothing is silently dropped: the form opens a
   pre-filled email to INBOX instead, and the page says so rather than
   claiming the message has been sent.
   ───────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  const ENDPOINT = 'https://dndefddhocxqczinfpfg.supabase.co/functions/v1/website-lead';
  const INBOX = 'neil@highelmstudio.com';

  const LABELS = {
    kind: 'Enquiry type',
    name: 'Name',
    email: 'Email',
    company: 'Company',
    site: 'Website',
    focus: 'Focus',
    goal: 'Priority',
    message: 'Message'
  };

  function asText(kind, data) {
    const lines = ['Enquiry from highelmstudio.com', ''];
    lines.push(LABELS.kind + ': ' + kind);
    Object.keys(data).forEach((k) => {
      const v = data[k];
      if (v == null || v === '' || (Array.isArray(v) && !v.length)) return;
      lines.push((LABELS[k] || k) + ': ' + (Array.isArray(v) ? v.join(', ') : v));
    });
    return lines.join('\n');
  }

  /* Returns a promise resolving to 'sent' or 'mailto'. Rejects if the
     endpoint is configured but refuses the request, so the page can say so. */
  window.HES = window.HES || {};
  window.HES.submitLead = function submitLead(kind, data, subject) {
    if (!ENDPOINT) {
      const href = 'mailto:' + INBOX +
        '?subject=' + encodeURIComponent(subject || 'Enquiry from highelmstudio.com') +
        '&body=' + encodeURIComponent(asText(kind, data));
      // A user gesture started this, so the mail client is allowed to open.
      window.location.href = href;
      return Promise.resolve('mailto');
    }

    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.assign({ kind, page: location.pathname }, data))
    }).then((r) => {
      if (!r.ok) throw new Error('Lead endpoint returned ' + r.status);
      return 'sent';
    });
  };

  window.HES.leadInbox = INBOX;
  window.HES.leadConfigured = !!ENDPOINT;
})();
