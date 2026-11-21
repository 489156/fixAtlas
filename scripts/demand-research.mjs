// Demand research for one post — replaces the manual autocomplete runs and gap analysis.
//   node scripts/demand-research.mjs docs/blog/naver/01-battery-price.md [--from=saved.json] [--out=dir] [--write-scale]
//
// 1. Seeds = front matter `queries` + optional `seeds:`. For each seed, Google autocomplete suggestions are fetched
//    (public endpoint without a robots.txt; Naver's autocomplete is robots-disallowed and is NOT used) and saved to
//    <out>/<slug>.json with the fetch date, so the evidence behind `queries` is reproducible.
// 2. Gap analysis: which real suggestions the body already answers and which it does not (candidates for a new
//    question heading, or for a separate post when they belong to another product).
// 3. Tag suggestions: frequent suggestion phrases, joined without spaces, not yet in `tags`.
// 4. Optional Naver data (each part runs only when its keys are in the environment; none needs ad spend):
//    - Search Ad keyword tool (NAVER_SEARCHAD_API_KEY, NAVER_SEARCHAD_SECRET, NAVER_SEARCHAD_CUSTOMER_ID): absolute monthly
//      PC/mobile query counts — the only first-party source of Naver search *volume*. --write-scale appends them to `scale:`.
//    - NAVER API HUB (NAVER_CLIENT_ID, NAVER_CLIENT_SECRET from the Naver Cloud console; set NAVER_API_KIND=openapi for
//      old developers.naver.com keys). Checked against the live API on 2026-11-21.
//      · Search trend: 36 full months of relative interest → direction and peak months (when to publish or refresh).
//        Ratios are relative within one request, so every batch carries the first seed as an anchor.
//      · 지식iN·카페 search: real question titles → the questions the body does not answer yet (question headings).
//      · Blog search: how many posts already answer each query (supply) and the top 10 per seed — the share that
//        advertise a local service (a gap an explanatory post can fill) and how recent they are (how often to refresh).
//      · Shopping insight (front matter `shop: 필밸브@50000008` or --shop=…, keyword@first-level category id): age,
//        gender and device split of the people who click that product keyword in Naver Shopping — who the buyer is.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { foldKo, parseDraft } from './check-claims.mjs';

const field = (front, k) => (new RegExp(`^${k}:[ \\t]*(.+)$`, 'm').exec(front) || [])[1]?.trim() ?? '';
const list = (v) => v.split(',').map((x) => x.trim()).filter(Boolean);

function curlJson(url, headers = [], body = null) {
  const args = ['-sS', '-m', '20', '--fail', url];
  for (const h of headers) args.push('-H', h);
  if (body) args.push('-X', 'POST', '-H', 'Content-Type: application/json', '--data-binary', JSON.stringify(body));
  return new Promise((resolve, reject) => execFile('curl', args, { maxBuffer: 5 * 1024 * 1024 }, (err, out, errOut) => {
    if (err) return reject(new Error((errOut || err.message).trim().slice(0, 120)));
    try { resolve(JSON.parse(out)); } catch { reject(new Error('JSON 아님')); }
  }));
}

export async function googleSuggest(seed) {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=ko&gl=kr&ie=utf-8&oe=utf-8&q=${encodeURIComponent(seed)}`;
  const data = await curlJson(url);
  return Array.isArray(data?.[1]) ? data[1] : [];
}

// Searchers glue brand and product ("lg에어컨", "샤오미로봇청소기"); split at Latin/Hangul boundaries before matching.
const words = (s) => s.split(/\s+/).flatMap((w) => w.split(/(?<=[a-z0-9])(?=[가-힣])|(?<=[가-힣])(?=[a-z0-9])/)).filter(Boolean);

/** Which suggestions the body covers (every word present after folding). Pure; unit-tested. */
export function gapAnalysis(body, suggestions) {
  const hay = foldKo(body);
  const uniq = [...new Set(suggestions.map((s) => s.trim().toLowerCase()).filter(Boolean))];
  const covered = []; const missing = [];
  for (const s of uniq) (words(s).every((w) => hay.includes(foldKo(w))) ? covered : missing).push(s);
  return { covered, missing };
}

/** Tag candidates: phrases that recur across seeds, joined without spaces, not already tagged. Pure; unit-tested.
 *  Pass `covered` (from gapAnalysis) so a tag never promises an answer the body does not give. */
export function suggestTags(bySeed, existingTags, max = 10, covered = null) {
  const count = new Map();
  const allow = covered ? new Set(covered.map((s) => s.toLowerCase())) : null;
  for (const list of Object.values(bySeed)) for (const s of new Set(list)) {
    if (allow && !allow.has(s.trim().toLowerCase())) continue;
    const tag = s.replace(/\s+/g, '');
    if (!/[가-힣]/.test(tag) || tag.length > 20) continue;
    count.set(tag, (count.get(tag) || 0) + 1);
  }
  const have = new Set(existingTags.map((t) => t.toLowerCase()));
  return [...count].filter(([t]) => !have.has(t.toLowerCase()))
    .sort((a, b) => b[1] - a[1] || a[0].length - b[0].length)
    .slice(0, Math.max(0, max - existingTags.length)).map(([t]) => t);
}

/** Naver Search Ad API signature: base64(HMAC-SHA256(secret, `${timestamp}.${method}.${uri}`)). */
export function naverSignature(secret, timestamp, method, uri) {
  return crypto.createHmac('sha256', secret).update(`${timestamp}.${method}.${uri}`).digest('base64');
}

/** DataLab batches: 5 groups per request; every batch includes the anchor so batches can be put on one scale. Pure. */
export function trendBatches(keywords, anchor = keywords[0]) {
  const rest = keywords.filter((k) => k !== anchor);
  const out = [];
  for (let i = 0; i < Math.max(rest.length, 1); i += 4) out.push([anchor, ...rest.slice(i, i + 4)]);
  return out;
}

/** Rescale each batch so the anchor's mean ratio is 100; returns { keyword: { mean, last12, prev12 } }. Pure. */
export function mergeTrends(batches) {
  const out = {};
  for (const results of batches) {
    const mean = (d) => (d.length ? d.reduce((a, x) => a + x.ratio, 0) / d.length : 0);
    const anchorMean = mean(results[0]?.data || []) || 1;
    for (const r of results) {
      const scaled = (r.data || []).map((x) => ({ period: x.period, ratio: (x.ratio / anchorMean) * 100 }));
      const last12 = scaled.slice(-12); const prev12 = scaled.slice(-24, -12);
      out[r.title] = { mean: Math.round(mean(scaled)), last12: Math.round(mean(last12)), prev12: Math.round(mean(prev12)) };
    }
  }
  return out;
}

/** Month-of-year profile of a monthly series: average ratio per calendar month and the peak months. Pure.
 *  Peak = months at least 20% above the yearly mean — when to publish or refresh a post. */
export function seasonality(data) {
  const sum = Array(12).fill(0); const n = Array(12).fill(0);
  for (const x of data || []) { const m = Number(String(x.period).slice(5, 7)) - 1; if (m >= 0 && m < 12) { sum[m] += x.ratio; n[m] += 1; } }
  const byMonth = sum.map((s, i) => (n[i] ? Math.round(s / n[i]) : null));
  const vals = byMonth.filter((v) => v !== null);
  const mean = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  const peak = byMonth.map((v, i) => [i + 1, v]).filter(([, v]) => v !== null && mean > 0 && v >= mean * 1.2)
    .sort((a, b) => b[1] - a[1]).map(([m]) => m);
  return { byMonth, peak };
}

const ENTITIES = { '&quot;': '"', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&#39;': "'", '&apos;': "'" };
/** Search API titles carry <b> highlights and HTML entities. Pure. */
export const stripTags = (s) => String(s ?? '').replace(/<[^>]+>/g, '').replace(/&(quot|amp|lt|gt|#39|apos);/g, (e) => ENTITIES[e]).replace(/\s+/g, ' ').trim();

// A title reads as a question when it asks something; Q&A and cafe titles that only name a product are left out.
const QUESTION = /\?|(까|나|가|죠|데|는지|ㄴ지|을지|ㄹ지)요?\s*[?.!]*$|(어떻게|어떡|왜|얼마|몇|가능|되나|하나|해야|해도|괜찮|문의|질문|궁금|추천|방법|이유|원인|차이|어디)/;
export const isQuestion = (title) => QUESTION.test(stripTags(title));

// Content words for matching a long question against the body: Hangul/Latin runs of 2+ chars minus question filler.
const FILLER = new Set(['어떻게', '어떡하', '왜', '얼마', '가능', '문의', '질문', '궁금', '궁금해요', '추천', '방법', '이유', '원인', '하나요', '되나요', '있나요', '할까요', '해야', '해도', '괜찮', '좀', '너무', '계속', '혹시', '그냥', '이거', '이게', '저희', '우리', '집', '이유가', '해결', '도와주세요', '알려주세요', '부탁드립니다', '나요', '계세', '질문드려', '질문드립니다', '질문요', '여쭤봅니다', '여쭤', '해보신분', '어떤거', '나는거', '있을까', '없을까']);
// Endings are stripped longest first and only when a 2+ char stem is left ("수도" stays, "필밸브가" → "필밸브").
const ENDINGS = ['방법', '인가요', '한가요', '하나요', '되나요', '있나요', '없나요', '했는데', '하는데', '나요', '까요', '해요', '돼요', '인데', '에서', '이', '가', '을', '를', '은', '는', '에', '도', '요', '죠'];
const stem = (w) => { for (const e of ENDINGS) if (w.endsWith(e) && w.length - e.length >= 2) return w.slice(0, -e.length); return w; };
const contentWords = (s) => words(stripTags(s).toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' '))
  .map(stem).filter((w) => w.length >= 2 && !FILLER.has(w));

/** Real questions the body does not answer: a question counts as answered when at least `threshold` of its
 *  content words appear in the body. Returns [{ q, words, hit }] for the unanswered, most-repeated first. Pure. */
export function questionGaps(body, questions, threshold = 0.7) {
  // Askers glue words ("변기물소리") and conjugate freely ("물소리나고"): match against the body without spaces and
  // accept the word when a prefix of at least 60% of it (2+ chars) appears — the noun stem before the ending.
  const flat = foldKo(body).replace(/\s+/g, '');
  const inBody = (w) => { const f = foldKo(w); for (let n = f.length; n >= Math.max(2, Math.ceil(f.length * 0.6)); n -= 1) if (flat.includes(f.slice(0, n))) return true; return false; };
  const seen = new Map();
  for (const q of questions) {
    const t = stripTags(q); const key = contentWords(t).join(' ');
    if (!key) continue;
    if (seen.has(key)) seen.get(key).count += 1; else seen.set(key, { q: t, ws: contentWords(t), count: 1 });
  }
  const out = [];
  for (const { q, ws, count } of seen.values()) {
    const missing = ws.filter((w) => !inBody(w));
    const hit = ws.length - missing.length;
    if (hit / ws.length < threshold) out.push({ q, count, words: ws, hit, missing });
  }
  return out.sort((a, b) => b.count - a.count || a.hit / a.words.length - b.hit / b.words.length);
}

// Titles that sell a local service rather than explain: a rough supply-side signal, not a classifier.
const COMMERCIAL = /(출장|업체|전문|당일|견적|설비|시공|수리점|\d{2,4}-\d{3,4}-\d{4}|(시|구|동|읍|면)\s?(변기|수전|욕실|집수리|설비))/;
/** Share of result titles that advertise a local service. Pure. */
export const commercialShare = (titles) => (titles.length ? titles.filter((t) => COMMERCIAL.test(stripTags(t))).length / titles.length : null);

/** Words the unanswered questions use and the body does not, weighted by how often each question repeats.
 *  A hand-free view of the gap: no category list to maintain per post. Pure. */
export function missingTerms(gaps, top = 20) {
  const count = new Map();
  for (const g of gaps) for (const w of new Set(g.missing)) count.set(w, (count.get(w) || 0) + g.count);
  return [...count].map(([w, n]) => ({ w, n })).sort((a, b) => b.n - a.n || a.w.localeCompare(b.w, 'ko')).slice(0, top);
}

/** How recent the top results are: how many were posted within `days`, and the median age in days.
 *  Dates and `today` are yyyymmdd. A top list made of recent posts means an old post drops out: refresh on that cycle. Pure. */
export function freshness(dates, today, days = 60) {
  const day = (d) => Date.UTC(Number(d.slice(0, 4)), Number(d.slice(4, 6)) - 1, Number(d.slice(6, 8))) / 86400000;
  const ages = dates.filter((d) => /^\d{8}$/.test(d || '')).map((d) => day(today) - day(d)).filter((a) => a >= 0).sort((a, b) => a - b);
  if (!ages.length) return null;
  const mid = ages.length >> 1;
  return { n: ages.length, within: ages.filter((a) => a <= days).length, days, medianAge: ages.length % 2 ? ages[mid] : Math.round((ages[mid - 1] + ages[mid]) / 2) };
}

/** Share of each group (age band, gender or device) in one shopping-insight response, in percent, largest first.
 *  Ratios in one response share a scale (its largest point is 100), so the sums per group compare. Pure. */
export function groupShares(rows) {
  const sum = {};
  for (const r of rows || []) sum[r.group] = (sum[r.group] || 0) + r.ratio;
  const total = Object.values(sum).reduce((a, b) => a + b, 0);
  if (!total) return null;
  return Object.fromEntries(Object.entries(sum).sort((a, b) => b[1] - a[1]).map(([g, v]) => [g, Math.round((v / total) * 100)]));
}

/** "필밸브@50000008, 비데@50000008" → [{ keyword, category }]. Entries without a numeric category are dropped. Pure. */
export const parseShop = (v) => String(v || '').split(',').map((x) => x.trim().split('@')).filter(([k, c]) => k && /^\d+$/.test(c || '')).map(([keyword, category]) => ({ keyword, category }));

/** Which Naver gateway the keys belong to. NAVER API HUB (Naver Cloud console, headers X-NCP-APIGW-*) is the
 *  default; developers.naver.com keys (X-Naver-Client-*) still work until that search API is retired. */
export function naverGateway(env = process.env) {
  const { NAVER_CLIENT_ID: id, NAVER_CLIENT_SECRET: secret, NAVER_API_KIND: kind } = env;
  if (!id || !secret) return null;
  if (kind === 'openapi') return {
    kind, headers: [`X-Naver-Client-Id: ${id}`, `X-Naver-Client-Secret: ${secret}`],
    trend: 'https://openapi.naver.com/v1/datalab/search', search: (t) => `https://openapi.naver.com/v1/search/${t}.json`,
    shopping: (k) => `https://openapi.naver.com/v1/datalab/shopping/category/keyword/${k}`,
  };
  return {
    kind: 'hub', headers: [`X-NCP-APIGW-API-KEY-ID: ${id}`, `X-NCP-APIGW-API-KEY: ${secret}`],
    trend: 'https://naverapihub.apigw.ntruss.com/search-trend/v1/search', search: (t) => `https://naverapihub.apigw.ntruss.com/search/v1/${t}`,
    shopping: (k) => `https://naverapihub.apigw.ntruss.com/shopping/v1/category/keyword/${k}`,
  };
}

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

async function naverOpenApi(keywords) {
  const gw = naverGateway();
  if (!gw) return null;
  const { headers } = gw;
  const fmt = (d) => d.toISOString().slice(0, 10);
  // Monthly ratios for a month still in progress read low; end at the last full month.
  const end = new Date(); end.setDate(0); const start = new Date(end); start.setDate(1); start.setMonth(start.getMonth() - 35);
  const batches = [];
  for (const batch of trendBatches(keywords)) {
    const data = await curlJson(gw.trend, headers, {
      startDate: fmt(start), endDate: fmt(end), timeUnit: 'month',
      keywordGroups: batch.map((k) => ({ groupName: k, keywords: [k] })),
    });
    batches.push(data?.results || []);
  }
  const season = {};
  for (const results of batches) for (const r of results) if (!season[r.title]) season[r.title] = seasonality(r.data);
  const get = (type, q, n) => curlJson(`${gw.search(type)}?query=${encodeURIComponent(q)}&display=${n}&sort=sim`, headers);
  const blogTotal = {}; const kinTotal = {}; const cafeTotal = {};
  const questions = []; let topBlogs = [];
  for (const [i, k] of keywords.entries()) {
    const blog = await get('blog', k, 10);
    blogTotal[k] = blog?.total ?? null;
    for (const x of blog?.items || []) if (!topBlogs.some((b) => b.link === x.link)) topBlogs.push({ title: stripTags(x.title), link: x.link, date: x.postdate, by: stripTags(x.bloggername), seed: k });
    await pause(120);
    for (const [type, totals] of [['kin', kinTotal], ['cafearticle', cafeTotal]]) {
      const res = await get(type, k, 30);
      totals[k] = res?.total ?? null;
      for (const x of res?.items || []) if (isQuestion(x.title)) questions.push({ q: stripTags(x.title), src: type === 'kin' ? '지식iN' : '카페', seed: k, link: x.link });
      await pause(120);
    }
  }
  return {
    gateway: gw.kind, period: `${fmt(start)}~${fmt(end)}`, trends: mergeTrends(batches), season,
    blogTotal, kinTotal, cafeTotal, topBlogs, commercialShare: commercialShare(topBlogs.map((b) => `${b.title} ${b.by}`)),
    freshness: freshness(topBlogs.map((b) => b.date), fmt(new Date()).replace(/-/g, '')), questions,
  };
}

/** Who clicks a product keyword in Naver Shopping over the last 12 full months: age, gender, device shares. */
async function naverShoppers(pairs) {
  const gw = naverGateway();
  if (!gw || !pairs.length) return null;
  const fmt = (d) => d.toISOString().slice(0, 10);
  const end = new Date(); end.setDate(0); const start = new Date(end); start.setDate(1); start.setMonth(start.getMonth() - 11);
  const out = [];
  for (const { keyword, category } of pairs) {
    const row = { keyword, category, period: `${fmt(start)}~${fmt(end)}` };
    for (const kind of ['age', 'gender', 'device']) {
      const data = await curlJson(gw.shopping(kind), gw.headers, { startDate: fmt(start), endDate: fmt(end), timeUnit: 'month', category, keyword });
      row[kind] = groupShares(data?.results?.[0]?.data);
      await pause(120);
    }
    out.push(row);
  }
  return out;
}

export async function naverVolumes(keywords) {
  const { NAVER_SEARCHAD_API_KEY: key, NAVER_SEARCHAD_SECRET: secret, NAVER_SEARCHAD_CUSTOMER_ID: customer } = process.env;
  if (!key || !secret || !customer) return null;
  const out = {};
  const related = new Map(); // other keywords the tool suggests, with their own volumes — candidates for titles/tags
  for (let i = 0; i < keywords.length; i += 5) { // the keyword tool accepts up to 5 hint keywords per call
    const batch = keywords.slice(i, i + 5).map((k) => k.replace(/\s+/g, ''));
    const uri = '/keywordstool';
    const ts = String(Date.now());
    const data = await curlJson(`https://api.searchad.naver.com${uri}?hintKeywords=${encodeURIComponent(batch.join(','))}&showDetail=1`, [
      `X-Timestamp: ${ts}`, `X-API-KEY: ${key}`, `X-Customer: ${customer}`, `X-Signature: ${naverSignature(secret, ts, 'GET', uri)}`,
    ]);
    // the API echoes keywords with Latin letters upper-cased ("lg출장비" → "LG출장비"): match case-insensitively
    const want = new Map(batch.map((k) => [k.toUpperCase(), k]));
    for (const row of data?.keywordList || []) {
      const k = want.get(String(row.relKeyword).toUpperCase());
      if (k) out[k] = { pc: row.monthlyPcQcCnt, mobile: row.monthlyMobileQcCnt };
      else related.set(row.relKeyword, { pc: row.monthlyPcQcCnt, mobile: row.monthlyMobileQcCnt });
    }
  }
  const n = (v) => (typeof v === 'number' ? v : 5); // "< 10" → 5
  out._related = [...related].map(([k, v]) => ({ k, ...v, total: n(v.pc) + n(v.mobile) })).sort((a, b) => b.total - a.total).slice(0, 30);
  return out;
}

// ---- CLI ----
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const [k, v = 'true'] = a.slice(2).split('='); return [k, v]; }));
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) { console.error('usage: node scripts/demand-research.mjs <post.md> [--from=saved.json] [--out=docs/research/data/suggest] [--write-scale] [--shop=키워드@분야코드,…]'); process.exit(2); }
  const text = fs.readFileSync(file, 'utf8');
  const { front, body } = parseDraft(text);
  const slug = field(front, 'slug') || path.basename(file, '.md');
  const seeds = [...new Set([...list(field(front, 'queries')), ...list(field(front, 'seeds'))])];
  if (!seeds.length) { console.error('front matter에 queries:(또는 seeds:)가 없습니다 — 수요자 문장과 검색어부터 쓰세요.'); process.exit(2); }

  let saved;
  if (opt.from) saved = JSON.parse(fs.readFileSync(opt.from, 'utf8'));
  else {
    const bySeed = {};
    for (const seed of seeds) {
      try { bySeed[seed] = await googleSuggest(seed); } catch (e) { bySeed[seed] = []; console.log(`  자동완성 실패  ${seed} (${e.message})`); }
      await new Promise((r) => setTimeout(r, 800)); // be gentle with the public endpoint
    }
    saved = { slug, fetched_at: new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date()), source: 'google-autocomplete (hl=ko, gl=kr)', seeds, suggestions: bySeed };
    const outDir = opt.out || 'docs/research/data/suggest';
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, `${slug}.json`), JSON.stringify(saved, null, 1) + '\n');
    console.log(`저장  ${path.join(outDir, `${slug}.json`)} (${saved.fetched_at})`);
  }

  const all = Object.values(saved.suggestions).flat();
  const { covered, missing } = gapAnalysis(body, all);
  console.log(`\n실제 검색어 ${covered.length + missing.length}개 중 본문이 다루는 것 ${covered.length}개`);
  console.log('다루지 않는 검색어 (새 질문형 소제목 후보, 다른 품목이면 별도 글 후보):');
  for (const m of missing) console.log(`  - ${m}`);
  const tags = suggestTags(saved.suggestions, list(field(front, 'tags')), 10, covered);
  if (tags.length) console.log(`\n태그 후보: ${tags.join(', ')}`);

  const open = await naverOpenApi(seeds).catch((e) => { console.log(`\n네이버 데이터랩·검색 API 조회 실패: ${e.message}`); return null; });
  if (!open) console.log('\n네이버 데이터랩·검색 API: 키 없음(NAVER_CLIENT_ID·NAVER_CLIENT_SECRET)');
  else {
    console.log(`\n네이버 추세(${open.period}, 첫 시드 평균=100) · 성수기 · 블로그/지식iN/카페 글 수 [${open.gateway}]:`);
    for (const k of seeds) {
      const t = open.trends[k]; const s = open.season[k];
      // ratios under ~5 (anchor mean = 100) are a handful of searches; a month-of-year profile from them is noise
      const peak = (t?.mean ?? 0) < 5 ? '판단 불가(검색량 적음)' : s?.peak?.length ? `${s.peak.join('·')}월` : '뚜렷하지 않음';
      console.log(`  - ${k}: 평균 ${t?.mean ?? '-'} · 최근 12개월 ${t?.last12 ?? '-'} (그 전 12개월 ${t?.prev12 ?? '-'}) · 성수기 ${peak} · 블로그 ${open.blogTotal[k] ?? '-'} / 지식iN ${open.kinTotal[k] ?? '-'} / 카페 ${open.cafeTotal[k] ?? '-'}`);
    }
    const share = open.commercialShare;
    const fresh = open.freshness;
    if (share !== null) console.log(`\n블로그 상위 글 ${open.topBlogs.length}개(검색어마다 10개, 중복 제외) 중 업체 홍보형 ${Math.round(share * 100)}% (제목·블로그 이름 단어 기준 추정)${fresh ? ` · 최근 ${fresh.days}일 안에 쓴 글 ${fresh.within}개 · 발행 후 중앙값 ${fresh.medianAge}일` : ''}`);
    const gaps = questionGaps(body, open.questions.map((x) => x.q));
    console.log(`\n지식iN·카페 실제 질문 ${open.questions.length}개 중 본문이 답하지 않는 질문 ${gaps.length}개 (많이 반복된 순, 상위 15):`);
    for (const g of gaps.slice(0, 15)) console.log(`  - ${g.q}${g.count > 1 ? ` ×${g.count}` : ''}  [본문에 없는 말: ${g.missing.join(', ')}]`);
    const terms = missingTerms(gaps);
    if (terms.length) console.log(`\n답하지 않은 질문에 자주 나오는데 본문에 없는 말(질문 수): ${terms.map((t) => `${t.w} ${t.n}`).join(', ')}`);
    if (!opt.from) { open.unanswered = gaps.map(({ q, count, missing }) => ({ q, count, missing })); open.missingTerms = terms; }
    if (!opt.from) {
      saved.naver = { ...(saved.naver || {}), open_api_fetched_at: new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date()), ...open };
      fs.writeFileSync(path.join(opt.out || 'docs/research/data/suggest', `${slug}.json`), JSON.stringify(saved, null, 1) + '\n');
    }
  }

  const shopPairs = parseShop(opt.shop || field(front, 'shop'));
  const shoppers = await naverShoppers(shopPairs).catch((e) => { console.log(`\n쇼핑인사이트 조회 실패: ${e.message}`); return null; });
  if (shoppers) {
    const AGE = { 10: '10대', 20: '20대', 30: '30대', 40: '40대', 50: '50대', 60: '60대 이상' }; const SEX = { m: '남성', f: '여성' }; const DEV = { mo: '모바일', pc: 'PC' };
    const line = (o, names) => (o ? Object.entries(o).map(([g, v]) => `${names[g] || g} ${v}%`).join(' · ') : '자료 없음');
    console.log(`\n네이버 쇼핑에서 이 상품을 누른 사람(쇼핑인사이트 클릭 비중, ${shoppers[0]?.period}):`);
    for (const r of shoppers) console.log(`  - ${r.keyword}(분야 ${r.category}): ${line(r.gender, SEX)} / ${line(r.age, AGE)} / ${line(r.device, DEV)}`);
    if (!opt.from) {
      saved.naver = { ...(saved.naver || {}), shoppers_fetched_at: new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date()), shoppers };
      fs.writeFileSync(path.join(opt.out || 'docs/research/data/suggest', `${slug}.json`), JSON.stringify(saved, null, 1) + '\n');
    }
  }

  const volumes = await naverVolumes(seeds).catch((e) => { console.log(`\n네이버 검색량 조회 실패: ${e.message}`); return null; });
  if (!volumes) console.log('\n네이버 월간 검색량: 키 없음(NAVER_SEARCHAD_API_KEY·SECRET·CUSTOMER_ID) — 검색광고 키워드 도구에서 직접 확인하세요.');
  else {
    if (!opt.from) {
      saved.naver = { ...(saved.naver || {}), volumes_fetched_at: new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date()), volumes };
      fs.writeFileSync(path.join(opt.out || 'docs/research/data/suggest', `${slug}.json`), JSON.stringify(saved, null, 1) + '\n');
    }
    const rel = volumes._related || []; delete volumes._related;
    if (!opt.from) {
      saved.naver.volumes = volumes; saved.naver.related = rel;
      fs.writeFileSync(path.join(opt.out || 'docs/research/data/suggest', `${slug}.json`), JSON.stringify(saved, null, 1) + '\n');
    }
    console.log('\n네이버 월간 검색량 (PC / 모바일):');
    for (const [k, v] of Object.entries(volumes)) console.log(`  - ${k}: ${v.pc} / ${v.mobile}`);
    if (rel.length) console.log(`\n연관 키워드 상위 10 (월간 PC+모바일): ${rel.slice(0, 10).map((r) => `${r.k} ${r.total}`).join(', ')}`);
    if (opt['write-scale'] && Object.keys(volumes).length) {
      const date = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());
      const note = `네이버 월간 검색량(PC/모바일, ${date}): ${Object.entries(volumes).map(([k, v]) => `${k} ${v.pc}/${v.mobile}`).join(', ')}`;
      fs.writeFileSync(file, text.replace(/^scale:(.*)$/m, (l, rest) => `scale:${rest} · ${note}`));
      console.log('  scale: 줄에 추가했습니다.');
    }
  }
}
