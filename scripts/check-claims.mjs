// Pre-publish credibility check for blog drafts.
//   node scripts/check-claims.mjs docs/blog/naver/*.md [--today=YYYY-MM-DD] [--max-age=90]
// Every number with a unit (원, %, m, 건, 년 ...) or any comma-grouped number in the body must appear in the
// draft's claim ledger (front matter `claims:`), each ledger row needs an https source and a check date,
// dates older than --max-age days are flagged, and banned hype/uncertain phrases fail the check.
//
// Ledger format (front matter):
//   claims:
//     - 160,000원 | https://www.samsungsvc.co.kr/shop/product/0000090680 | 2026-11-17 | 삼성 BESPOKE 제트 220W 배터리
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const UNITS = ['만원', '원', '%', '㎡', 'km', 'cm', 'mm', 'kg', 'm', '건', '개월', '년', '회', '명', '시간', '배', '편'];
const unitAlt = UNITS.map((u) => u.replace(/[%]/g, '\\$&')).join('|');
// number not glued to a preceding letter/hyphen/dot (part numbers like DJ96-00242D, versions like V10) and,
// if no unit follows, not glued to a following letter either (e.g. "220W").
const NUM_RE = new RegExp(`(?<![A-Za-z0-9\\-.])(\\d{1,3}(?:,\\d{3})+|\\d+(?:\\.\\d+)?)\\s?(${unitAlt})?(?![A-Za-z0-9])`, 'g');
const DATE_RE = /\b\d{4}[-.]\d{1,2}(?:[-.]\d{1,2})?\b|\d{4}년(?:\s?\d{1,2}월)?(?:\s?\d{1,2}일)?|\d{1,2}월\s?\d{1,2}일/g;

export const BANNED = [
  { re: /최저가\s*보장|무조건|100%\s*(보장|해결)|확실히\s*(싸|저렴)|업계\s*최저/, why: '과장 표현(표시광고 위험)' },
  { re: /것\s*같(습니다|아요|다)/, why: '추측 표현 — 출처를 달거나 "표본 부족"으로 명시' },
  { re: /\b(TODO|FIXME|TBD)\b|링크 삽입 예정/, why: '미완성 표시가 남아 있음' },
];

export function parseDraft(text) {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  const front = m ? m[1] : '';
  const body = m ? text.slice(m[0].length) : text;
  const claims = [];
  let inClaims = false;
  for (const line of front.split('\n')) {
    if (/^claims:\s*$/.test(line)) { inClaims = true; continue; }
    if (inClaims && /^\s+-\s/.test(line)) {
      const [value, url, date, note] = line.replace(/^\s+-\s/, '').split('|').map((s) => (s ?? '').trim());
      claims.push({ value, url, date, note: note ?? '' });
    } else if (inClaims && /^\S/.test(line)) inClaims = false;
  }
  return { front, body, claims };
}

const norm = (digits, unit = '') => `${digits.replace(/,/g, '')}${unit}`;

export function numbersIn(text) {
  const cleaned = text
    .replace(/https?:\/\/\S+/g, ' ')            // URLs
    .replace(/\]\([^)]*\)/g, ']')                // markdown link targets
    .replace(DATE_RE, ' ')                       // dates
    .replace(/^\s*\d+\.\s/gm, ' ')               // ordered-list markers
    .replace(/^#{1,6}\s.*$/gm, (h) => h.replace(/^#+\s\d+\.\s/, ''));
  const out = [];
  for (const m of cleaned.matchAll(NUM_RE)) {
    const [, digits, unit] = m;
    if (!unit && !digits.includes(',')) continue; // bare small numbers (step counts etc.) are not claims
    out.push({ raw: m[0].trim(), key: norm(digits, unit ?? ''), digits: norm(digits) });
  }
  return out;
}

export function checkDraft(text, { today = new Date().toISOString().slice(0, 10), maxAgeDays = 90 } = {}) {
  const { body, claims } = parseDraft(text);
  const problems = [];
  if (!claims.length) problems.push({ type: 'no_ledger', detail: 'front matter에 claims: 출처 기록이 없습니다.' });

  const ledgerKeys = new Set();
  const ledgerDigits = new Set();
  for (const c of claims) {
    for (const n of numbersIn(c.value)) { ledgerKeys.add(n.key); ledgerDigits.add(n.digits); }
    if (!/^https:\/\//.test(c.url)) problems.push({ type: 'bad_source', detail: `${c.value}: https 출처 URL이 없습니다.` });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(c.date)) problems.push({ type: 'bad_date', detail: `${c.value}: 확인일(YYYY-MM-DD)이 없습니다.` });
    else {
      const age = (Date.parse(today) - Date.parse(c.date)) / 86400000;
      if (age > maxAgeDays) problems.push({ type: 'stale', detail: `${c.value}: 확인일 ${c.date} (${Math.round(age)}일 경과) — 원문 재확인 필요` });
      if (age < 0) problems.push({ type: 'bad_date', detail: `${c.value}: 확인일이 미래입니다.` });
    }
  }

  const seen = new Set();
  for (const n of numbersIn(body)) {
    // Same numeric value recorded in the ledger counts as sourced (ranges like "28,000~38,000원" leave the first
    // number without a unit, so the unit is not required to match).
    const matched = ledgerKeys.has(n.key) || ledgerDigits.has(n.digits);
    if (!matched && !seen.has(n.key)) {
      seen.add(n.key);
      problems.push({ type: 'unsourced_number', detail: `본문의 "${n.raw}"가 출처 기록(claims)에 없습니다.` });
    }
  }
  for (const b of BANNED) {
    const hit = b.re.exec(body);
    if (hit) problems.push({ type: 'banned_phrase', detail: `"${hit[0]}" — ${b.why}` });
  }
  return { ok: problems.length === 0, problems, claims: claims.length };
}

// ---- CLI ----
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
  const files = args.filter((a) => !a.startsWith('--'));
  if (!files.length) { console.error('usage: node scripts/check-claims.mjs <draft.md...> [--today=YYYY-MM-DD] [--max-age=90]'); process.exit(2); }
  let failed = 0;
  for (const f of files) {
    const r = checkDraft(fs.readFileSync(f, 'utf8'), { today: opt.today, maxAgeDays: Number(opt['max-age'] ?? 90) });
    console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${f}  (출처 기록 ${r.claims}건)`);
    for (const p of r.problems) console.log(`   - [${p.type}] ${p.detail}`);
    if (!r.ok) failed++;
  }
  process.exit(failed ? 1 : 0);
}
