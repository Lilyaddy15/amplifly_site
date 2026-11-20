import type { APIRoute } from 'astro';

// Public, indexable pages only. Thank-you pages and 404 are noindex and deliberately left out.
// lastmod is omitted on purpose: a wrong or always-changing date is worse than none.
const PAGES = ['/', '/about/', '/support/', '/privacy-policy/', '/terms-of-service/'];

export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL('https://amplifly.me')).origin;
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    PAGES.map(p => `  <url><loc>${origin}${p}</loc></url>`).join('\n') +
    `\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
