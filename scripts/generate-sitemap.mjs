// Generates public/sitemap.xml and public/robots.txt before every build (npm run build runs this via "prebuild").
//   SITE_URL / VITE_SITE_URL  public origin, e.g. https://fixatlas.example   (default: https://fixatlas.example)
//   VITE_SUPABASE_URL         if set, product list is fetched live from the Edge Function; else the seed catalog is used
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://fixatlas.example').replace(/\/$/, '');
const supabaseUrl = process.env.VITE_SUPABASE_URL;

async function liveProducts() {
  if (!supabaseUrl) return null;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(`${supabaseUrl}/functions/v1/make-server-3e8c4785/products`, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const { products } = await res.json();
    return Array.isArray(products) && products.length ? products : null;
  } catch {
    return null;
  }
}

const { PRODUCTS } = await import('../supabase/functions/_shared/seed.ts');
const live = await liveProducts();
const products = live ?? PRODUCTS;
const source = live ? 'live API' : 'seed catalog';

const today = new Date().toISOString().slice(0, 10);
const urls = [
  ['/', '1.0'], ['/search', '0.5'], ['/calculator', '0.7'], ['/submit-repair', '0.6'], ['/community', '0.5'], ['/methodology', '0.6'],
  ...products.map((p) => [`/products/${p.category}/${p.slug}`, '0.8']),
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([loc, prio]) => `  <url><loc>${site}${loc}</loc><lastmod>${today}</lastmod><priority>${prio}</priority></url>`).join('\n')}
</urlset>
`;
fs.mkdirSync(path.join(root, 'public'), { recursive: true });
fs.writeFileSync(path.join(root, 'public/sitemap.xml'), xml);
fs.writeFileSync(path.join(root, 'public/robots.txt'), `User-agent: *
Allow: /
Disallow: /admin
Disallow: /auth
Disallow: /search?

Sitemap: ${site}/sitemap.xml
`);
console.log(`sitemap: ${urls.length} URLs (${source}) for ${site}`);
