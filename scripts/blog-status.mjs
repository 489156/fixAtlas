// One view of every Naver post's readiness — replaces checking each post by hand.
//   node scripts/blog-status.mjs [docs/blog/naver/0*.md] [--today=YYYY-MM-DD] [--out=docs/blog/STATUS.md] [--json]
// For each post: publish date (D-day), machine checks (fail/warn), open in-person slots, demand sentence, oldest ledger
// date, last live verification (verify-sources stamp), demand data age, and a verdict with the next action.
// Exit code 1 when a post scheduled within 2 days is not ready, so it can gate a reminder or CI job.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkDraft, parseDraft } from './check-claims.mjs';

const HUMAN = new Set(['human_slot', 'no_firsthand']);
const days = (a, b) => Math.round((Date.parse(a) - Date.parse(b)) / 86400000);
const field = (front, k) => (new RegExp(`^${k}:[ \\t]*(.*)$`, 'm').exec(front) || [])[1]?.trim() ?? '';

/** Status of one post. Pure apart from reading stamp files; unit-tested through statusOf(text, ctx). */
export function statusOf(text, { today, verifyStamp = null, suggestData = null }) {
  const { front, claims } = parseDraft(text);
  const r = checkDraft(text, { today });
  const fails = r.problems.filter((p) => p.level !== 'warn' && !HUMAN.has(p.type));
  const warns = r.problems.filter((p) => p.level === 'warn');
  const slots = r.problems.filter((p) => p.type === 'human_slot').length;
  const firsthand = /^firsthand:[ \t]*\S/m.test(front);
  const publish = (/(\d{4}-\d{2}-\d{2})/.exec(field(front, 'publish')) || [])[1] || null;
  const dDay = publish ? days(publish, today) : null;
  const webDates = claims.filter((c) => /^https:\/\//.test(c.url) && /^\d{4}-\d{2}-\d{2}$/.test(c.date)).map((c) => c.date).sort();
  const oldest = webDates[0] || null;
  const verifyAge = verifyStamp?.date ? days(today, verifyStamp.date) : null;
  const verifyOk = verifyStamp ? verifyStamp.problems === 0 && !(verifyStamp.capture_failures || []).length : false;
  const demandAge = suggestData?.fetched_at ? days(today, suggestData.fetched_at) : null;

  const todo = [];
  if (fails.length) todo.push(`기계 점검 실패 ${fails.length}건 (check-claims)`);
  if (!field(front, 'demand')) todo.push('수요자 문장(demand) 작성');
  if (slots || !firsthand) todo.push(`직접 확인 칸 ${slots}개${firsthand ? '' : ' + firsthand 기록'}`);
  if (!verifyStamp) todo.push('원문 대조 미실행 (verify-sources)');
  else if (!verifyOk) todo.push(`원문 대조 문제 ${verifyStamp.problems}건·캡처 ${verifyStamp.capture_failures?.length || 0}건`);
  else if (dDay !== null && dDay <= 1 && verifyAge > 0) todo.push('발행 전날 재대조 (verify-sources --write)');
  else if (verifyAge > 30) todo.push(`원문 대조 ${verifyAge}일 경과`);
  if (oldest && days(today, oldest) > 60) todo.push(`출처 확인일 ${days(today, oldest)}일 경과`);
  if (demandAge === null) todo.push('검색어 수집 미실행 (demand-research)');
  else if (demandAge > 90) todo.push(`검색어 자료 ${demandAge}일 경과`);

  const ready = todo.length === 0;
  return {
    slug: field(front, 'slug'), title: field(front, 'title'), publish, dDay,
    fails: fails.length, warns: warns.length, slots, firsthand, demand: Boolean(field(front, 'demand')),
    oldestLedger: oldest, lastVerify: verifyStamp?.date || null, verifyOk, imageRows: verifyStamp?.image_rows || 0, demandFetched: suggestData?.fetched_at || null,
    ready, todo, urgent: !ready && dDay !== null && dDay <= 2,
  };
}

export function renderTable(rows, today) {
  const lines = [`# 블로그 발행 상태 (${today} 기준, \`node scripts/blog-status.mjs\`로 생성)`, '',
    '| 글 | 발행 | 기계 점검 | 직접 확인 | 원문 대조 | 검색어 자료 | 다음 할 일 |', '|---|---|---|---|---|---|---|'];
  for (const r of rows) {
    const d = r.dDay === null ? '미정' : `${r.publish} (D${r.dDay >= 0 ? '-' : '+'}${Math.abs(r.dDay)})`;
    const machine = r.fails ? `실패 ${r.fails}` : `통과${r.warns ? `·경고 ${r.warns}` : ''}`;
    const human = r.slots || !r.firsthand ? `빈칸 ${r.slots}${r.firsthand ? '' : '·firsthand 없음'}` : '완료';
    const verify = r.lastVerify ? `${r.lastVerify}${r.verifyOk ? '' : ' (문제)'}${r.imageRows ? ` · 이미지 ${r.imageRows}행 눈 확인` : ''}` : '없음';
    lines.push(`| ${r.urgent ? '⚠ ' : ''}${r.slug} | ${d} | ${machine} | ${human} | ${verify} | ${r.demandFetched || '없음'} | ${r.ready ? '발행 가능' : r.todo.join('; ')} |`);
  }
  return lines.join('\n') + '\n';
}

// ---- CLI ----
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const [k, v = 'true'] = a.slice(2).split('='); return [k, v]; }));
  let files = args.filter((a) => !a.startsWith('--'));
  if (!files.length) files = fs.readdirSync('docs/blog/naver').filter((f) => /^\d.*\.md$/.test(f)).map((f) => path.join('docs/blog/naver', f));
  const today = opt.today || new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());
  const readJson = (p) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } };
  const rows = files.map((f) => {
    const text = fs.readFileSync(f, 'utf8');
    const slug = field(parseDraft(text).front, 'slug');
    return statusOf(text, { today, verifyStamp: readJson(`docs/blog/evidence/${slug}/verify.json`), suggestData: readJson(`docs/research/data/suggest/${slug}.json`) });
  });
  if (opt.json) console.log(JSON.stringify(rows, null, 2));
  else console.log(renderTable(rows, today));
  if (opt.out) fs.writeFileSync(opt.out, renderTable(rows, today));
  process.exit(rows.some((r) => r.urgent) ? 1 : 0);
}
