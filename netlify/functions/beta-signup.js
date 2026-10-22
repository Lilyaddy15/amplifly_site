// Amplifly updates list (the signup band at the bottom of the homepage).
// Ticking "Also add me to the wearable waitlist" adds the same person to the separate waitlist too.
const { parseSignup, supabaseInsert, resendAddContact, resendSend, updatesEmail } = require('../lib/lists');
const { joinWaitlist } = require('./wearable-waitlist');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { params, email, firstName, ndProfile, meta } = parseSignup(event);
  const updates = params.get('updates') === 'true';
  const wearable = params.get('wearable') === 'true';

  if (!email) {
    return { statusCode: 302, headers: { Location: '/thank-you' }, body: '' };
  }

  await resendAddContact('updates', email, firstName);
  await supabaseInsert('beta_testers', {
    email,
    first_name: firstName,
    nd_profile: ndProfile,
    updates,
    wearable_interest: wearable,
    ...meta,
  });

  if (wearable) {
    await joinWaitlist({ email, firstName, ndProfile, meta, source: 'updates-form', sendEmail: false });
  }

  await resendSend(email, "You're on the list — Amplifly updates", updatesEmail(firstName, wearable));

  return { statusCode: 302, headers: { Location: '/thank-you' }, body: '' };
};
