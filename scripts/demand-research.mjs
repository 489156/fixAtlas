// Demand research for one post — replaces the manual autocomplete runs and gap analysis.
//   node scripts/demand-research.mjs docs/blog/naver/01-battery-price.md [--from=saved.json] [--out=dir] [--write-scale]
//
// 1. Seeds = front matter `queries` + optional `seeds:`. For each seed, Google autocomplete suggestions are fetched
//    (public endpoint without a robots.txt; Naver's autocomplete is robots-disallowed and is NOT used) and saved to
//    <out>/<slug>.json with the fetch date, so the evidence behind `queries` is reproducible.
// 2. Gap analysis: which real suggestions the body already answers and which it does not (candidates for a new
//    question heading, or for a separate post when they belong to another product).
// 3. Tag suggestions: frequent suggestion phrases, joined without spaces, not yet in `tags`.
// 4. Optional Naver search volumes: if NAVER_SEARCHAD_API_KEY, NAVER_SEARCHAD_SECRET and NAVER_SEARCHAD_CUSTOMER_ID
//    are set, monthly PC/mobile query counts come from the Naver Search Ad keyword tool API. NOT tested against the
//    live API in this repository (no credentials here) — the request signing follows the published scheme and is
//    unit-tested for format only. --write-scale appends the volumes to the post's `scale:` line.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { foldKo, parseDraft } from './check-claims.mjs';

const field = (front, k) => (new RegExp(`^${k}:[ \\t]*(.+)$`, 'm').exec(front) || [])[1]?.trim() ?? '';
const list = (v) => v.split(',').map((x) => x.trim()).filter(Boolean);

function curlJson(url, headers = []) {
  const args = ['-sS', '-m', '20', '--fail', url];
  for (const h of headers) args.push('-H', h);
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

async function naverVolumes(keywords) {
  const { NAVER_SEARCHAD_API_KEY: key, NAVER_SEARCHAD_SECRET: secret, NAVER_SEARCHAD_CUSTOMER_ID: customer } = process.env;
  if (!key || !secret || !customer) return null;
  const out = {};
  for (let i = 0; i < keywords.length; i += 5) { // the keyword tool accepts up to 5 hint keywords per call
    const batch = keywords.slice(i, i + 5).map((k) => k.replace(/\s+/g, ''));
    const uri = '/keywordstool';
    const ts = String(Date.now());
    const data = await curlJson(`https://api.searchad.naver.com${uri}?hintKeywords=${encodeURIComponent(batch.join(','))}&showDetail=1`, [
      `X-Timestamp: ${ts}`, `X-API-KEY: ${key}`, `X-Customer: ${customer}`, `X-Signature: ${naverSignature(secret, ts, 'GET', uri)}`,
    ]);
    for (const row of data?.keywordList || []) if (batch.includes(row.relKeyword)) out[row.relKeyword] = { pc: row.monthlyPcQcCnt, mobile: row.monthlyMobileQcCnt };
  }
  return out;
}

// ---- CLI ----
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const [k, v = 'true'] = a.slice(2).split('='); return [k, v]; }));
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) { console.error('usage: node scripts/demand-research.mjs <post.md> [--from=saved.json] [--out=docs/research/data/suggest] [--write-scale]'); process.exit(2); }
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

  const volumes = await naverVolumes(seeds).catch((e) => { console.log(`\n네이버 검색량 조회 실패: ${e.message}`); return null; });
  if (!volumes) console.log('\n네이버 월간 검색량: 키 없음(NAVER_SEARCHAD_API_KEY·SECRET·CUSTOMER_ID) — 검색광고 키워드 도구에서 직접 확인하세요.');
  else {
    console.log('\n네이버 월간 검색량 (PC / 모바일):');
    for (const [k, v] of Object.entries(volumes)) console.log(`  - ${k}: ${v.pc} / ${v.mobile}`);
    if (opt['write-scale'] && Object.keys(volumes).length) {
      const date = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());
      const note = `네이버 월간 검색량(PC/모바일, ${date}): ${Object.entries(volumes).map(([k, v]) => `${k} ${v.pc}/${v.mobile}`).join(', ')}`;
      fs.writeFileSync(file, text.replace(/^scale:(.*)$/m, (l, rest) => `scale:${rest} · ${note}`));
      console.log('  scale: 줄에 추가했습니다.');
    }
  }
}
