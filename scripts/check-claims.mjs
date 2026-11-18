// Pre-publish credibility check for blog drafts.
//   node scripts/check-claims.mjs docs/blog/naver/*.md [--today=YYYY-MM-DD] [--max-age=90]
// Every number with a unit (원, %, m, 건, 년 ...) or any comma-grouped number in the body must appear in the
// draft's claim ledger (front matter `claims:`), each ledger row needs an https source and a check date,
// dates older than --max-age days are flagged, banned hype/uncertain phrases fail the check, and a paragraph that
// mixes 합니다체 and 해요체 endings fails (EDITORIAL_STANDARDS §5: one register per block).
// A ledger source may also be `site:/path` — FixAtlas's own public page (e.g. site:/methodology for the
// 3/5/10-report rules); scripts/naver-export.mjs resolves it to the real origin at export time — or
// `직접:<what/when>` for something the editor did in person (a phone call, a photo, a visit).
// Optional 5th ledger field = a verbatim phrase from the source (checked live by scripts/verify-sources.mjs).
//
// Reader-trust checks (EDITORIAL_STANDARDS §9): template/AI-cliché phrases, unfilled [[직접 확인: ...]] slots,
// a missing `firsthand:` record (every post needs at least one thing the editor did in person), and — when several
// posts are checked together — sentences or headings copied across posts.
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

// Phrases that make a post read as template/AI-generated (editorial judgment, see EDITORIAL_STANDARDS §9).
export const CLICHES = [
  { re: /한\s?줄\s?(결론|요약)|세\s?줄\s?요약|결론부터\s?말/, why: '요약 라벨 — 첫 문장이 바로 답하게 쓰기' },
  { re: /총정리|완벽\s?정리|A\s?to\s?Z|꿀팁|필수\s?체크/, why: '양산형 제목·소제목 상투어' },
  { re: /알아보(겠습니다|ㄹ까요|도록\s?하겠|았습니다)|살펴보(겠습니다|ㄹ까요|았습니다)/, why: '진행 안내 상투어 — 바로 내용으로' },
  { re: /도움이\s?되(셨|었)(길|기를|으면)|마무리하며|정리해\s?보았|참고하시기\s?바랍니다/, why: '맺음 상투어' },
  { re: /자주\s?묻는\s?질문|^#+\s*FAQ|^Q[.:]\s/m, why: 'FAQ 블록 — 실제 받은 질문만 본문 소제목으로' },
  { re: /편집자\s?확인\s?기록/, why: '시스템 라벨 — 확인 과정은 본문 문장과 캡처로 보여 주기' },
  { re: /→|➡|👉/, why: '화살표 링크 — 문장 안에 링크를 넣기' },
  { re: /[⚠📷✅❌📌💡🔥✔️]/u, why: '장식 이모지 — "주의:"처럼 글자로' },
];

/** Paragraph lines that mix 합니다체 (-니다) and 해요체 (-요) sentence endings. Tables and headings are skipped. */
export function mixedRegister(body) {
  const out = [];
  for (const line of body.split('\n')) {
    if (!line.trim() || /^\s*(\||#)/.test(line)) continue;
    const sentences = line.replace(/^>\s?/, '').split(/(?<=[.!?])\s+/).map((x) => x.replace(/\*\*/g, '').trim());
    const ends = sentences.filter((x) => !/^(아니요|네|예)[.!?]$/.test(x));
    const formal = ends.some((x) => /니다[.!?]$/.test(x));
    const polite = ends.some((x) => /요[.!?]$/.test(x));
    if (formal && polite) out.push(line.trim().slice(0, 60));
  }
  return out;
}

export function parseDraft(text) {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  const front = m ? m[1] : '';
  const body = m ? text.slice(m[0].length) : text;
  const claims = [];
  let inClaims = false;
  for (const line of front.split('\n')) {
    if (/^claims:\s*$/.test(line)) { inClaims = true; continue; }
    if (inClaims && /^\s+-\s/.test(line)) {
      const [value, url, date, note, quote] = line.replace(/^\s+-\s/, '').split('|').map((s) => (s ?? '').trim());
      claims.push({ value, url, date, note: note ?? '', quote: quote ?? '' });
    } else if (inClaims && /^\S/.test(line)) inClaims = false;
  }
  return { front, body, claims };
}

const norm = (digits, unit = '') => `${digits.replace(/,/g, '')}${unit}`;

export function numbersIn(text) {
  const cleaned = text
    .replace(/(https?:\/\/|site:\/)\S+/g, ' ')  // URLs (incl. site:/ internal links)
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
  const { front, body, claims } = parseDraft(text);
  const problems = [];
  if (!claims.length) problems.push({ type: 'no_ledger', detail: 'front matter에 claims: 출처 기록이 없습니다.' });

  const ledgerKeys = new Set();
  const ledgerDigits = new Set();
  for (const c of claims) {
    for (const n of numbersIn(c.value)) { ledgerKeys.add(n.key); ledgerDigits.add(n.digits); }
    if (!/^(https:\/\/|site:\/|직접:)/.test(c.url)) problems.push({ type: 'bad_source', detail: `${c.value}: https 출처 URL(또는 site:/ 자체 페이지, 직접: 직접 확인 기록)이 없습니다.` });
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
  for (const line of mixedRegister(body)) problems.push({ type: 'mixed_register', detail: `한 문단에 합니다체·해요체 혼용: "${line}…"` });
  for (const c of CLICHES) {
    const hit = c.re.exec(body);
    if (hit) problems.push({ type: 'cliche', detail: `"${hit[0]}" — ${c.why}` });
  }
  for (const m of body.matchAll(/\[\[직접 확인:([^\]]*)\]\]/g)) problems.push({ type: 'human_slot', detail: `직접 확인 칸이 비어 있습니다:${m[1].slice(0, 50)}…` });
  if (!/^firsthand:[ \t]*\S/m.test(front)) problems.push({ type: 'no_firsthand', detail: 'front matter에 firsthand:(편집자가 직접 한 확인: 전화·촬영·방문 등, 날짜 포함)가 없습니다.' });
  return { ok: problems.length === 0, problems, claims: claims.length };
}

// Source lists, the source heading, the byline and the AI-use line are meant to repeat across posts.
const isSourceLine = (l) => /^\s*-\s.*\]\(/.test(l) || /^#+\s*출처/.test(l) || /^(쓴 사람|작성|만든 방법)\s*[:：]/.test(l.trim());

const grams = (t) => { const x = t.replace(/[\s.,!?·()'"]/g, ''); const g = new Set(); for (let i = 0; i < x.length - 2; i++) g.add(x.slice(i, i + 3)); return g; };
const jaccard = (a, b) => { let n = 0; for (const g of a) if (b.has(g)) n++; return n / (a.size + b.size - n || 1); };

/**
 * Near-duplicate sentences across posts (character 3-gram Jaccard >= threshold), e.g. the same CTA or disclaimer
 * with a word or two changed — the "template with small text changes" pattern search engines call spam.
 */
export function crossPostNearDuplicates(texts, threshold = 0.5) {
  const per = texts.map((text) => {
    const { body } = parseDraft(text);
    const out = [];
    for (const line of body.split('\n')) {
      if (!line.trim() || isSourceLine(line) || /^\s*\|/.test(line) || /\[\[직접 확인:/.test(line) || /^#/.test(line) || /^!\[/.test(line)) continue;
      const prose = line.replace(/^>\s?/, '').replace(/\]\([^)]*\)/g, ']'); // compare words, not link targets
      for (const s of prose.split(/(?<=[.!?])\s+/)) if (s.trim().length >= 20) out.push(s.trim());
    }
    return out.map((s) => ({ s, g: grams(s) }));
  });
  const hits = [];
  for (let i = 0; i < per.length; i++) for (let j = i + 1; j < per.length; j++) {
    for (const a of per[i]) for (const b of per[j]) {
      const sim = jaccard(a.g, b.g);
      if (sim >= threshold && a.s !== b.s) hits.push({ posts: [i, j], a: a.s, b: b.s, sim: Math.round(sim * 100) / 100 });
    }
  }
  return hits;
}

/** Sentences (20+ chars) or H2/H3 headings that appear in two or more of the given posts. */
export function crossPostDuplicates(texts) {
  const seen = new Map();
  texts.forEach((text, i) => {
    const { body } = parseDraft(text);
    const units = new Set();
    for (const line of body.split('\n')) {
      if (!line.trim() || isSourceLine(line) || /^\s*\|/.test(line) || /\[\[직접 확인:/.test(line)) continue; // open slots are instructions, not prose
      if (/^#{2,3}\s/.test(line)) { units.add(line.trim()); continue; }
      for (const s of line.replace(/^>\s?/, '').split(/(?<=[.!?])\s+/)) if (s.trim().length >= 20) units.add(s.trim());
    }
    for (const u of units) seen.set(u, [...(seen.get(u) || []), i]);
  });
  return [...seen].filter(([, idx]) => idx.length > 1).map(([unit, idx]) => ({ unit, posts: idx }));
}

// ---- CLI ----
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
  const files = args.filter((a) => !a.startsWith('--'));
  if (!files.length) { console.error('usage: node scripts/check-claims.mjs <draft.md...> [--today=YYYY-MM-DD] [--max-age=90]'); process.exit(2); }
  let failed = 0;
  const dups = files.length > 1 ? crossPostDuplicates(files.map((f) => fs.readFileSync(f, 'utf8'))) : [];
  for (const d of dups) console.log(`DUP   ${d.posts.map((i) => files[i]).join(' & ')}\n   - 글 사이에 같은 문장·소제목: "${d.unit.slice(0, 70)}"`);
  const near = files.length > 1 ? crossPostNearDuplicates(files.map((f) => fs.readFileSync(f, 'utf8'))) : [];
  for (const d of near) console.log(`NEAR  ${d.posts.map((i) => files[i]).join(' & ')} (유사도 ${d.sim})\n   - "${d.a.slice(0, 60)}"\n   - "${d.b.slice(0, 60)}"`);
  if (dups.length || near.length) failed++;
  for (const f of files) {
    const r = checkDraft(fs.readFileSync(f, 'utf8'), { today: opt.today, maxAgeDays: Number(opt['max-age'] ?? 90) });
    console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${f}  (출처 기록 ${r.claims}건)`);
    for (const p of r.problems) console.log(`   - [${p.type}] ${p.detail}`);
    if (!r.ok) failed++;
  }
  process.exit(failed ? 1 : 0);
}
