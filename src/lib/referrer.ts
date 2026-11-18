// First-touch source for visits that arrive without UTM tags, read from document.referrer.
// Lets the KPI campaign table show AI-search and search-engine referrals (the GEO outcome we cannot tag ourselves):
// src = group ("ai:chatgpt", "naver", "google", "referral" ...), cmp = referring host. Only the host is kept, never
// the path or query, so search terms and personal data in referrer URLs are not recorded.
const GROUPS: [RegExp, string][] = [
  [/(^|\.)(chatgpt\.com|openai\.com)$/, 'ai:chatgpt'],
  [/(^|\.)perplexity\.ai$/, 'ai:perplexity'],
  [/(^|\.)claude\.ai$/, 'ai:claude'],
  [/(^|\.)gemini\.google\.com$/, 'ai:gemini'],
  [/(^|\.)copilot\.microsoft\.com$/, 'ai:copilot'],
  [/(^|\.)naver\.com$/, 'naver'],
  [/(^|\.)daum\.net$/, 'daum'],
  [/(^|\.)google\.[a-z.]+$/, 'google'],
  [/(^|\.)bing\.com$/, 'bing'],
];

export function referrerSource(referrer: string, ownHost: string): { src: string; cmp: string } | null {
  let host: string;
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return null; // empty or malformed referrer (direct visit, privacy settings)
  }
  if (!host || host === ownHost.toLowerCase()) return null;
  const group = GROUPS.find(([re]) => re.test(host))?.[1] ?? 'referral';
  return { src: group, cmp: host.slice(0, 80) };
}
