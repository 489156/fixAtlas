// Builds a tracked link from a blog post to the site so the KPI panel can attribute visits/submissions.
// Usage: node scripts/blog-link.mjs <site-path> <post-slug> [placement]
//   e.g. node scripts/blog-link.mjs "/submit-repair?product=samsung-bespoke-jet" 2026-11-battery-price cta-bottom
// SITE_URL (or VITE_SITE_URL) sets the origin.
const [, , sitePath, postSlug, placement = 'body'] = process.argv;
if (!sitePath || !postSlug || !sitePath.startsWith('/')) {
  console.error('usage: node scripts/blog-link.mjs </path?query> <post-slug> [placement]');
  process.exit(1);
}
const origin = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://fixatlas.example').replace(/\/$/, '');
const url = new URL(origin + sitePath);
url.searchParams.set('utm_source', 'naver_blog');
url.searchParams.set('utm_medium', 'blog');
url.searchParams.set('utm_campaign', postSlug.slice(0, 80));
url.searchParams.set('utm_content', placement.slice(0, 80));
console.log(url.toString());
