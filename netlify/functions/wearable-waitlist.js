// BioProxal wearable waitlist — a separate list from Amplifly updates.
// Supabase table: wearable_waitlist. Resend audience: "BioProxal wearable waitlist".
const { parseSignup, supabaseInsert, resendAddContact, resendSend, wearableEmail } = require('../lib/lists');

async function joinWaitlist({ email, firstName, ndProfile, meta, source, sendEmail }) {
  await resendAddContact('wearable', email, firstName);
  await supabaseInsert('wearable_waitlist', {
    email,
    first_name: firstName,
    nd_profile: ndProfile,
    source,
    ...meta,
  });
  if (sendEmail) {
    await resendSend(email, "You're on the waitlist — BioProxal wearable", wearableEmail(firstName));
  }
}

exports.joinWaitlist = joinWaitlist;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { email, firstName, ndProfile, meta } = parseSignup(event);
  if (email) {
    await joinWaitlist({ email, firstName, ndProfile, meta, source: 'waitlist-form', sendEmail: true });
  }

  return { statusCode: 302, headers: { Location: '/waitlist-thanks' }, body: '' };
};
