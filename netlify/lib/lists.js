// Shared helpers for the two mailing lists the site collects:
//   updates  — app updates and the Android release   (Supabase: beta_testers,      Resend: "Amplifly updates")
//   wearable — the BioProxal wearable waitlist         (Supabase: wearable_waitlist, Resend: "BioProxal wearable waitlist")
// The lists are independent: joining one never adds you to the other unless you ask for both.

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://subymyoazfdkroxoaahs.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const AUDIENCES = {
  updates: { name: 'Amplifly updates', env: 'RESEND_AUDIENCE_UPDATES' },
  wearable: { name: 'BioProxal wearable waitlist', env: 'RESEND_AUDIENCE_WEARABLE' },
};

function parseSignup(event) {
  const params = new URLSearchParams(event.body || '');
  return {
    params,
    email: (params.get('email') || '').trim().toLowerCase(),
    firstName: (params.get('first_name') || '').trim() || null,
    ndProfile: params.get('nd_profile') || null,
    meta: {
      ip: (event.headers['x-forwarded-for'] || '').split(',')[0].trim() || null,
      user_agent: event.headers['user-agent'] || null,
      referrer: event.headers['referer'] || null,
    },
  };
}

// Insert a row through PostgREST. A duplicate email (409) means they're already on the list.
async function supabaseInsert(table, row) {
  if (!SUPABASE_ANON_KEY) { console.error('SUPABASE_ANON_KEY not set'); return false; }
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    });
    if (res.ok || res.status === 409) return true;
    console.error(`Supabase ${table} error:`, res.status, await res.text());
  } catch (err) {
    console.error(`Supabase ${table} error:`, err);
  }
  return false;
}

// Find a Resend audience by env ID or by name; create the named audience if it doesn't exist yet.
let audienceCache = null;
async function audienceId(list) {
  const { name, env } = AUDIENCES[list];
  if (process.env[env]) return process.env[env];
  const headers = { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' };
  if (!audienceCache) {
    const res = await fetch('https://api.resend.com/audiences', { headers });
    audienceCache = (await res.json()).data || [];
  }
  let found = audienceCache.find(a => a.name === name);
  // Before the lists were split, every signup went into the account's first audience.
  // Treat that one as the updates list unless it is the wearable waitlist.
  if (!found && list === 'updates') found = audienceCache.find(a => a.name !== AUDIENCES.wearable.name);
  if (found) return found.id;
  const created = await fetch('https://api.resend.com/audiences', { method: 'POST', headers, body: JSON.stringify({ name }) });
  const data = await created.json();
  if (data.id) audienceCache.push({ id: data.id, name });
  else console.error(`Resend could not create audience "${name}":`, JSON.stringify(data));
  return data.id || null;
}

async function resendAddContact(list, email, firstName) {
  if (!RESEND_API_KEY) { console.error('RESEND_API_KEY not set'); return; }
  try {
    const id = await audienceId(list);
    if (!id) return;
    const res = await fetch(`https://api.resend.com/audiences/${id}/contacts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, first_name: firstName || undefined, unsubscribed: false }),
    });
    if (!res.ok) console.error(`Resend ${list} contact error:`, res.status, await res.text());
  } catch (err) {
    console.error(`Resend ${list} contact error:`, err);
  }
}

async function resendSend(to, subject, html) {
  if (!RESEND_API_KEY) return;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'Amplifly <hello@amplifly.me>', to: [to], subject, html }),
    });
    if (!res.ok) console.error('Resend email error:', res.status, await res.text());
  } catch (err) {
    console.error('Resend email error:', err);
  }
}

const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Shared email shell, in the site's colours.
function emailShell({ eyebrow, title, intro, body, next }) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#15273F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:48px 20px;">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#1E3859;border-radius:20px;overflow:hidden;max-width:100%;">
          <tr>
            <td style="padding:48px 40px 32px;text-align:center;">
              <p style="color:#6093D4;font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 16px;">${eyebrow}</p>
              <h1 style="color:#ffffff;font-size:32px;font-weight:700;margin:0 0 8px;line-height:1.2;">${title}</h1>
              <p style="color:#ADC9E9;font-size:16px;margin:0;">${intro}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 8px;">${body}</td>
          </tr>
          <tr>
            <td style="padding:16px 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#15273F;border-radius:14px;padding:24px 28px;">
                    <p style="color:#6093D4;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 16px;">What happens next</p>
                    ${next.map((line, i) => `<p style="color:#ADC9E9;font-size:15px;line-height:1.6;margin:0${i < next.length - 1 ? ' 0 12px' : ''};">✦ &nbsp;${line}</p>`).join('\n                    ')}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 48px;text-align:center;border-top:1px solid rgba(255,255,255,0.08);">
              <p style="color:#ADC9E9;font-size:14px;margin:24px 0 8px;">Questions? We'd love to hear from you.</p>
              <a href="mailto:hello@amplifly.me" style="color:#6093D4;font-size:14px;text-decoration:none;">hello@amplifly.me</a>
              <p style="color:#ADC9E9;font-size:12px;opacity:0.4;margin:24px 0 0;">
                You received this because you signed up at amplifly.me.<br>We'll never share your email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const p = text => `<p style="color:#DFE9F6;font-size:16px;line-height:1.7;margin:0 0 16px;">${text}</p>`;

function updatesEmail(firstName, alsoWearable) {
  return emailShell({
    eyebrow: 'Amplifly updates',
    title: "You're on the list.",
    intro: 'Thanks for following along with Amplifly.',
    body: p(firstName ? `Hey ${escapeHtml(firstName)}!` : 'Hey there!')
      + p('Amplifly is already live on iOS as <strong style="color:#ffffff;">Amplifly Lite</strong>, the software-only release — five brain states, conditions that learn, a flow forecast, and an operating manual built from your own data. No hardware required.')
      + `<p style="color:#DFE9F6;font-size:16px;line-height:1.7;margin:0;"><a href="https://apps.apple.com/us/app/amplifly-lite/id6775978052" style="color:#6093D4;text-decoration:none;font-weight:600;">Get it on the App Store &rarr;</a></p>`,
    next: [
      "We'll email you about app updates and the Android release.",
      alsoWearable
        ? "You're also on the BioProxal wearable waitlist — that's a separate list, and we'll write when there's wearable news."
        : 'A BioProxal wearable integration is in development. It has its own waitlist on amplifly.me if you want to hear when it ships.',
      'Your feedback shapes what we build — just reply to this email.',
    ],
  });
}

function wearableEmail(firstName) {
  return emailShell({
    eyebrow: 'BioProxal wearable waitlist',
    title: "You're on the waitlist.",
    intro: "We'll tell you when the wearable ships.",
    body: p(firstName ? `Hey ${escapeHtml(firstName)}!` : 'Hey there!')
      + p("Thanks for joining the waitlist for the BioProxal wearable: an optional wrist-worn sensor, built by BioProxal specifically for Amplifly, that computes its readings on the device and sends only finished numbers to the app.")
      + p("It's still in development, and there's no release date yet. In the meantime, <strong style=\"color:#ffffff;\">Amplifly Lite</strong> is live on iOS and works without any hardware.")
      + `<p style="color:#DFE9F6;font-size:16px;line-height:1.7;margin:0;"><a href="https://apps.apple.com/us/app/amplifly-lite/id6775978052" style="color:#6093D4;text-decoration:none;font-weight:600;">Get Amplifly Lite on the App Store &rarr;</a></p>`,
    next: [
      "We'll only email this list about the wearable: progress worth sharing, and the moment it ships.",
      "Joining this list doesn't sign you up for general app updates. That's a separate list on amplifly.me.",
      'Questions about the wearable? Just reply to this email.',
    ],
  });
}

module.exports = { parseSignup, supabaseInsert, resendAddContact, resendSend, updatesEmail, wearableEmail };
