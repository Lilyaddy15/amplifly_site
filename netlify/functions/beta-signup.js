const RESEND_API_KEY = process.env.RESEND_API_KEY;

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if (!RESEND_API_KEY) {
    return { statusCode: 200, body: 'No email key configured' };
  }

  let email, firstName;
  try {
    ({ email, firstName } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, body: 'Bad request' };
  }

  if (!email) return { statusCode: 400, body: 'Missing email' };

  const greeting = firstName ? `Hey ${firstName}!` : 'Hey there!';
  const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#15273F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:48px 20px;">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#1E3859;border-radius:20px;overflow:hidden;max-width:100%;">
          <tr>
            <td style="padding:48px 40px 32px;text-align:center;">
              <p style="color:#6093D4;font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 16px;">Early Access</p>
              <h1 style="color:#ffffff;font-size:32px;font-weight:700;margin:0 0 8px;line-height:1.2;">You're on the list.</h1>
              <p style="color:#ADC9E9;font-size:16px;margin:0;">Welcome to Amplifly early access.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 8px;">
              <p style="color:#DFE9F6;font-size:16px;line-height:1.7;margin:0 0 16px;">${greeting}</p>
              <p style="color:#DFE9F6;font-size:16px;line-height:1.7;margin:0 0 16px;">
                Thank you for joining the Amplifly waitlist. We're building something genuinely
                useful for neurodivergent minds, and we'll reach out as soon as early access opens.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#15273F;border-radius:14px;padding:24px 28px;">
                    <p style="color:#6093D4;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 16px;">What happens next</p>
                    <p style="color:#ADC9E9;font-size:15px;line-height:1.6;margin:0 0 12px;">✦ &nbsp;We'll reach out when early access opens.</p>
                    <p style="color:#ADC9E9;font-size:15px;line-height:1.6;margin:0 0 12px;">✦ &nbsp;You'll get access before the public launch.</p>
                    <p style="color:#ADC9E9;font-size:15px;line-height:1.6;margin:0;">✦ &nbsp;Your feedback will shape what we build.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 48px;text-align:center;border-top:1px solid rgba(255,255,255,0.08);">
              <p style="color:#ADC9E9;font-size:14px;margin:24px 0 8px;">Questions? We'd love to hear from you.</p>
              <a href="mailto:hello@amplifly.app" style="color:#6093D4;font-size:14px;text-decoration:none;">hello@amplifly.app</a>
              <p style="color:#ADC9E9;font-size:12px;opacity:0.4;margin:24px 0 0;">
                You received this because you signed up at amplifly.app.<br>We'll never share your email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Amplifly <hello@amplifly.app>',
        to: [email],
        subject: "You're on the list — Amplifly Early Access",
        html: emailHtml,
      }),
    });
    if (!res.ok) {
      console.error('Resend error:', res.status, await res.text());
      return { statusCode: 500, body: 'Email failed' };
    }
  } catch (err) {
    console.error('Resend error:', err);
    return { statusCode: 500, body: 'Email failed' };
  }

  return { statusCode: 200, body: 'OK' };
};
