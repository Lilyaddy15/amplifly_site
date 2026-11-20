// Homepage FAQ. Shared between the FAQ section and the FAQPage structured data on the homepage,
// so search engines and AI assistants read exactly the same answers people do.
import { APP_STORE_NAME } from '../consts';

export interface Faq { q: string; a: string }

export const faqs: Faq[] = [
  {
    q: 'Does this require any hardware — a wearable, a ring, anything?',
    a: `Not today. ${APP_STORE_NAME}, the version on the App Store and Google Play, is pure software: you check in by tapping one of five brain states. No sensors, no wearables, no external services. A BioProxal wearable integration is in development. It will be optional: the rest of the app keeps working with or without a device connected.`,
  },
  {
    q: 'What is the BioProxal wearable, and when is it coming?',
    a: 'BioProxal is a separate company; its wrist-worn optical sensor is being built specifically for Amplifly and connects to the app over Bluetooth while the app is open. It computes a flow score, heart rate, HRV, SpO2, and breathing rate on the wearable itself and sends only those finished numbers to the phone — never raw signals. The integration is being built on a separate branch of the app and is not in the current release. We don\'t have a release date to share; join the wearable waitlist on this page and we\'ll tell you when it ships.',
  },
  {
    q: 'Why is it called Amplifly Lite in the app stores?',
    a: `${APP_STORE_NAME} is the software-only release: every feature described on this page, without the wearable. The name marks it as the version that doesn't need hardware. It is the same app, from the same account, and your data carries forward.`,
  },
  {
    q: 'Do I need an account? Does it work offline?',
    a: 'Amplifly needs an account — there is no guest mode. Your data is stored on your device (and synced to your account) and every algorithm runs there, so once you\'re signed in you can use every feature — brain check-ins, conditions, flow logging, the Focus timer, the recommender, the manual — without a network connection. An account is required; a live connection is not.',
  },
  {
    q: 'How does the recommendation engine actually work?',
    a: 'It\'s a Thompson-sampling contextual bandit. Each condition is an "arm" keyed by your ND profile, brain state, and time of day. The bandit starts from research-cited priors and updates a Beta posterior every time you give feedback — thumbs up/down, a condition you tag when logging a session, or a 4–5★ flow session logged within 2 hours of a recommendation you opened. All computation runs on your device.',
  },
  {
    q: 'Do I have to remember to log sessions?',
    a: 'Only if you want to. The Focus tab is a built-in work timer — pick 25, 50, or 90 minutes (or no limit), turn on breaks if you want them, and hit start. When you stop, the log opens with the measured time already filled in; you add what you worked on and how it went. You can also log by hand on the Flow tab, and set the time to earlier today or yesterday so a late log still lands in the right time bucket.',
  },
  {
    q: 'Can I add my own conditions?',
    a: 'Yes. If you already know something works for you, add it as your own tool — name it, pick the phase it fits, and tag the brain states it helps. It shows up alongside the twelve built-ins and becomes a first-class option the recommender learns about, exactly like the built-ins. You can also record self-insights ("X helps when I\'m Y", "mornings are high-energy"), which seed the recommender and the forecast as weak priors that your real data overrides.',
  },
  {
    q: 'What neurodivergent profiles does it support?',
    a: 'ADHD, Autism, AuDHD, Dyslexia, Dyscalculia, Dyspraxia/DCD, Tourette\'s, Sensory Processing, OCD, Anxiety, Depression, PTSD/C-PTSD, Bipolar, Twice Exceptional (2e), and Other. You can select several. The recommender keys its learning on one primary profile — AuDHD if you picked both ADHD and Autism, otherwise the first one you selected. Research-cited priors exist for ADHD, Autism, AuDHD, Dyslexia, and Dyscalculia; the other profiles learn purely from your outcomes.',
  },
  {
    q: 'Can I change my brain state during the day?',
    a: 'Yes — as often as it shifts. Tap Update on the Today tab and pick the new state. Your recommendations, flow forecast, and Conditions picks re-target immediately, and every check-in is timestamped, so Today shows a timeline of your states and your manual learns your most common brain at each time of day.',
  },
  {
    q: 'What is the flow forecast?',
    a: 'A small neural network trained on synthetic data built from published research on focus and neurodivergence — not on real outcomes, and the card says so. The weights are fixed and ship with the app. It runs when your profile includes ADHD, Autism, AuDHD, Dyslexia, or Dyscalculia (the profiles in its training data); otherwise the app falls back to a simpler brain-state-by-time-of-day estimate and labels it as such. A personal calibration layer blends in your own logged sessions as you build history.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes. Everything is stored on your device and all computation happens there. Your data also syncs to your account — encrypted in transit and stored on Supabase\'s servers solely so it\'s there on your next device. It is never sold, shared, or used for advertising, and we collect no analytics or crash reports. You can delete your account and everything in it by emailing us.',
  },
  {
    q: 'What platforms is it on?',
    a: `${APP_STORE_NAME} is out now on iPhone (App Store) and Android (Google Play), $2.99 on both. It's the same app with the same features, and your account works on either, so you can switch phones and keep your history.`,
  },
  {
    q: 'Can I look back at how my days went?',
    a: 'Yes. The History tab shows a month calendar colored by each day\'s brain state; tap a day to see its check-ins and sessions. Week, Month and All-time graphs show your minutes in flow, how locked in you were, your brain-state mix, and the conditions, helpers and drains that showed up. "Today I…" lets you mark things like sleep, exercise, time outside or caffeine (13 built in, plus your own, with an optional amount), and History compares days with and without each one. Those comparisons are patterns in your own data, not cause and effect.',
  },
  {
    q: 'Can Amplifly replace therapy or medical support?',
    a: 'No. Amplifly is a self-understanding and focus tool, not a clinical product. If you need mental health support, please work with a qualified professional.',
  },
];
