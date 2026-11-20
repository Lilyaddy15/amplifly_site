// JSON-LD (schema.org) builders. Layout renders the base graph (organisation, website, app) on
// every page; pages add their own nodes with the `jsonLd` prop. Keep facts here in step with the
// copy: this is what Google, Bing and AI assistants read when they describe Amplifly.
import { APP_STORE_URL, PLAY_STORE_URL, APP_STORE_NAME } from '../consts';
import { STATES } from './states';

export const SITE = 'https://amplifly.me';
export const SUPPORT_EMAIL = 'hello@amplifly.me';

const ORG_ID = `${SITE}/#organization`;
const SITE_ID = `${SITE}/#website`;
const APP_ID = `${SITE}/#app`;

export const SITE_DESCRIPTION =
  'Amplifly is a flow and strengths app for neurodivergent minds (ADHD, autism, AuDHD and more). ' +
  'Check in with one of five brain states, get conditions matched to that state, log flow sessions ' +
  'or run the Focus timer, and build a personal operating manual from your own data. ' +
  `On the App Store and Google Play as ${APP_STORE_NAME}.`;

export const organization = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Amplifly',
  url: SITE,
  logo: { '@type': 'ImageObject', url: `${SITE}/favicon.svg` },
  image: `${SITE}/images/og-image.png`,
  email: SUPPORT_EMAIL,
  contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: SUPPORT_EMAIL, url: `${SITE}/support/` },
  founder: { '@type': 'Person', name: 'Lily Stone', sameAs: 'https://www.linkedin.com/in/lily-stone-6118311b9/' },
  sameAs: [APP_STORE_URL, PLAY_STORE_URL],
};

export const website = {
  '@type': 'WebSite',
  '@id': SITE_ID,
  name: 'Amplifly',
  url: SITE,
  description: SITE_DESCRIPTION,
  inLanguage: 'en',
  publisher: { '@id': ORG_ID },
};

const screenshots = [
  ['01-home', 'The Today screen with the current brain state and matched conditions'],
  ['02-brain-states', 'Choosing one of the five brain states: Buzzing, Sharp, Flat, Foggy, Scattered'],
  ['06-conditions', 'The Conditions tab ranking primers, protectors, recovery and resets for the current state'],
  ['05-flow', 'The Flow tab with logged sessions, ratings, helpers and drains'],
  ['07-focus', 'The Focus timer'],
  ['03-manual', 'The Manual tab: when you flow, your usual brain, what gets you in and what pulls you out'],
  ['04-brain-through-day', 'Your brain through the day, built from timestamped check-ins'],
  ['08-profile', 'Profile and ND profile settings'],
];

export const app = {
  '@type': ['SoftwareApplication', 'MobileApplication'],
  '@id': APP_ID,
  name: APP_STORE_NAME,
  alternateName: 'Amplifly',
  description: SITE_DESCRIPTION,
  url: SITE,
  applicationCategory: 'HealthApplication',
  applicationSubCategory: 'Focus and self-understanding tool for neurodivergent adults',
  operatingSystem: 'iOS, Android',
  installUrl: [APP_STORE_URL, PLAY_STORE_URL],
  downloadUrl: [APP_STORE_URL, PLAY_STORE_URL],
  offers: [
    { '@type': 'Offer', price: '2.99', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: APP_STORE_URL, name: 'App Store (iPhone)' },
    { '@type': 'Offer', price: '2.99', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: PLAY_STORE_URL, name: 'Google Play (Android)' },
  ],
  screenshot: screenshots.map(([file, caption]) => ({
    '@type': 'ImageObject',
    url: `${SITE}/images/app/${file}-900.webp`,
    caption,
  })),
  featureList: [
    `Five brain states (${STATES.map(s => s.label).join(', ')}) with timestamped check-ins you can update through the day`,
    'Twelve built-in conditions across four phases (Primers, Protectors, Recovery, Resets), plus your own',
    'On-device Thompson-sampling recommender that learns from your feedback, keyed to ND profile, brain state and time of day',
    'Flow session logging and a Focus timer (25, 50, 90 minutes or open-ended) that fills in the log for you',
    'Flow Forecast: a small on-device neural network that says when it is running on priors rather than your data',
    'Personal operating manual built from your own check-ins and sessions',
    'History: a brain-state calendar, flow graphs and "Today I…" day tracking',
    '15 neurodivergent profiles, including ADHD, Autism, AuDHD, Dyslexia and Dyscalculia',
    'Account with cross-device sync; works offline once signed in; no analytics, ads or crash reporting',
  ],
  author: { '@id': ORG_ID },
  publisher: { '@id': ORG_ID },
  inLanguage: 'en',
};

export const baseGraph = [organization, website, app];

type Crumb = [name: string, path: string];

export const breadcrumbs = (crumbs: Crumb[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [['Home', '/'] as Crumb, ...crumbs].map(([name, path], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: `${SITE}${path}`,
  })),
});

export const webPage = (opts: {
  path: string;
  name: string;
  description: string;
  type?: string;
  dateModified?: string; // ISO date, for legal pages
}) => ({
  '@type': opts.type ?? 'WebPage',
  '@id': `${SITE}${opts.path}#webpage`,
  url: `${SITE}${opts.path}`,
  name: opts.name,
  description: opts.description,
  isPartOf: { '@id': SITE_ID },
  about: { '@id': APP_ID },
  inLanguage: 'en',
  ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
});

export const faqPage = (items: { q: string; a: string }[], path: string) => ({
  '@type': 'FAQPage',
  '@id': `${SITE}${path}#faq`,
  mainEntity: items.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const person = (p: { name: string; jobTitle: string; worksFor: string; image: string; sameAs: string }) => ({
  '@type': 'Person',
  name: p.name,
  jobTitle: p.jobTitle,
  worksFor: { '@type': 'Organization', name: p.worksFor },
  image: `${SITE}${p.image}`,
  sameAs: p.sameAs,
});
