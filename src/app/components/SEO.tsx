import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  /** Absolute canonical URL. Defaults to origin + pathname (query strings are dropped on purpose). */
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
  /** schema.org JSON-LD object(s), e.g. Product / FAQPage. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const defaultTitle = 'FixAtlas / 수리기록 - 로봇청소기·무선청소기 수리비·고장 제보';
const defaultDescription =
  '수리비 견적 받기 전에, 같은 모델 사용자들이 실제로 얼마에 고쳤는지 확인하세요. 로봇청소기·무선청소기 고장 증상, 수리비 제보, 자가점검, 수리 vs 교체 계산기.';

const siteOrigin = () =>
  ((import.meta as unknown as { env: Record<string, string | undefined> }).env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')).replace(/\/$/, '');

export function SEO({ title, description, canonical, ogImage, ogType = 'website', noIndex = false, jsonLd }: SEOProps) {
  const fullTitle = title ? `${title} | FixAtlas` : defaultTitle;
  const metaDescription = description || defaultDescription;
  const canonicalUrl = canonical || (typeof window !== 'undefined' ? `${siteOrigin()}${window.location.pathname}` : '');
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {ogImage && <meta property="og:image" content={ogImage} />}

      <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      {blocks.map((b, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(b)}</script>
      ))}
    </Helmet>
  );
}
