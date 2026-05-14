import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
}

const defaultTitle = 'FixAtlas / 고장도감 - 제품 고장·수리비·AS 정보 커뮤니티';
const defaultDescription = '제품 고장, 수리비, AS 후기, 자가점검, 수리/교체 판단 정보를 사용자가 제보·검색·공유하는 커뮤니티형 웹서비스. 로봇청소기, 무선청소기 수리비 정보를 확인하세요.';

export function SEO({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  noIndex = false,
}: SEOProps) {
  const fullTitle = title ? `${title} | FixAtlas` : defaultTitle;
  const metaDescription = description || defaultDescription;
  const canonicalUrl = canonical || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Additional SEO */}
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="keywords" content="수리비, AS, 고장, 자가점검, 로봇청소기, 무선청소기, 제품수리, 수리비비교" />
    </Helmet>
  );
}
