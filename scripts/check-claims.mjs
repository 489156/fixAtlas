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
// Reader-trust checks (EDITORIAL_STANDARDS §9): template/AI-cliché phrases, unfilled person slots, no verifiable case
// (every post needs one real case: a `사례:` ledger row quoting a public case — Korea Consumer Agency case boards,
// news reports, our own user reports — or a `firsthand:` record of something the editor did; operator rule 2026-11-18:
// an in-person check cannot be required for every post), and — when several posts are checked together — sentences
// or headings copied across posts.
//
// Ledger format (front matter):
//   claims:
//     - 160,000원 | https://www.samsungsvc.co.kr/shop/product/0000090680 | 2026-11-17 | 삼성 BESPOKE 제트 220W 배터리
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SLOT_LINE, SLOT_RE, connectiveCommas, repeatedEndings, slotOwner } from './lib/korean-style.mjs';

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

// ---- Affiliate links (docs/research/R14, EDITORIAL_STANDARDS §10) ----
// Syntax in drafts: [텍스트](aff:<program>:<https url>). Front matter: `affiliate: <program>[, <program>]` lists the
// programs used, or `affiliate: none` for posts where a purchase link would be a conflict of interest (fees, disputes).
export const AFF_DISCLOSURE = {
  // Naver Shopping Connect mandates this exact sentence, before the title / at the very top of the body.
  'shopping-connect': '이 포스팅은 네이버 쇼핑 커넥트 활동의 일환으로, 판매 발생 시 수수료를 제공받습니다.',
};
export const AFF_PROGRAMS = ['shopping-connect', 'coupang', 'linkprice'];
const NO_AD_CLAIM = /광고(나|·|,)?\s*제휴\s*(없이|없음|는\s*없)|제휴\s*없(이|음)/;

export function affiliateProblems(front, body) {
  const problems = [];
  const decl = (/^affiliate:[ \t]*(.+)$/m.exec(front) || [])[1]?.trim() ?? '';
  const links = [...body.matchAll(/\]\(aff:([a-z-]+):([^)\s]+)\)/g)].map((m) => ({ program: m[1], url: m[2], index: m.index }));
  if (!links.length) return problems;
  const declared = decl.split(',').map((x) => x.trim()).filter(Boolean);
  if (decl === 'none' || !declared.length) {
    problems.push({ type: 'affiliate', detail: `제휴 링크 ${links.length}개가 있지만 front matter affiliate:가 ${decl || '없음'}입니다(이해충돌 글이면 링크를 빼세요).` });
    return problems;
  }
  for (const l of links) {
    if (!AFF_PROGRAMS.includes(l.program)) problems.push({ type: 'affiliate', detail: `알 수 없는 제휴 프로그램: ${l.program}` });
    else if (!declared.includes(l.program)) problems.push({ type: 'affiliate', detail: `front matter affiliate:에 ${l.program}이 없습니다.` });
    if (!/^https:\/\//.test(l.url)) problems.push({ type: 'affiliate', detail: `제휴 링크는 프로그램이 발급한 https 주소 그대로 써야 합니다(단축·리다이렉트 금지): ${l.url.slice(0, 40)}` });
  }
  if (links.length > 2) problems.push({ type: 'affiliate', detail: `제휴 링크 ${links.length}개 — 글당 2개까지` });
  const urls = links.map((l) => l.url);
  if (new Set(urls).size !== urls.length) problems.push({ type: 'affiliate', detail: '같은 제휴 링크를 한 글에 두 번 넣었습니다(쇼핑 커넥트 금지 행위).' });
  if (NO_AD_CLAIM.test(body)) problems.push({ type: 'affiliate', detail: '제휴 링크가 있는 글에 "광고·제휴 없음" 류 문장이 남아 있습니다.' });
  if (/<(script|iframe)\b/i.test(body)) problems.push({ type: 'affiliate', detail: '스크립트·iframe 배너 금지 — 텍스트 링크만(쿠팡 스크립트의 방문 정보 수집 사례, R14).' });
  // disclosure: the first paragraph after the H1, definitive wording, program-mandated sentence where one exists
  const first = body.replace(/^#\s.*$/m, '').split('\n').map((l) => l.trim()).find((l) => l && !l.startsWith('!['));
  const required = declared.map((d) => AFF_DISCLOSURE[d]).filter(Boolean);
  for (const sentence of required) if (!first?.includes(sentence)) problems.push({ type: 'affiliate', detail: `본문 첫 줄에 필수 고지 문구가 없습니다: "${sentence}"` });
  if (!first || !/수수료/.test(first)) problems.push({ type: 'affiliate', detail: '본문 첫 줄에 수수료를 받는다는 고지가 없습니다(공정위 지침: 제목 또는 첫 부분).' });
  else if (/받을\s*수\s*있/.test(first)) problems.push({ type: 'affiliate', detail: '고지가 조건부 표현("받을 수 있음")입니다 — 공정위 지침상 불명확. "받습니다"로 단정하세요.' });
  // placement: only after the first data table (the reader sees the evidence before any purchase link)
  const firstTable = body.search(/^\|/m);
  if (firstTable === -1 || links[0].index < firstTable) problems.push({ type: 'affiliate', detail: '제휴 링크가 첫 데이터 표보다 앞에 있습니다 — 근거(표) 다음에 두세요.' });
  return problems;
}

// Blog posts are written in 격식체 (합쇼체). 해요체 sentence endings fail unless front matter says `register: polite`.
// Narration of the editor's/AI's own work ("열어 대조했고 캡처해 붙였어요") reads like an assistant reporting to a user;
// the same facts belong in source lines and image captions (user review 2026-11-18).
const WORK_REPORT = /대조했|캡처해\s*붙였|열어\s*(확인|대조)|맞춰\s*봤|한\s*줄씩|옮겨\s*봤|정리해\s*봤|이번\s*조사|찾지\s*못했|확인하지\s*못했|찾지\s*못해/;

function proseSentences(body) {
  const out = [];
  for (const line of body.split('\n')) {
    const t = line.trim();
    if (!t || /^(\||#|!\[|-\s.*\]\()/.test(t) || SLOT_LINE.test(t)) continue;
    for (const s of t.replace(/^>\s?/, '').replace(/\]\([^)]*\)/g, ']').split(/(?<=[.!?])\s+/)) if (s.trim()) out.push(s.trim());
  }
  return out;
}

export function registerProblems(front, body) {
  const problems = [];
  const register = (/^register:[ \t]*(\S+)/m.exec(front) || [])[1] ?? 'formal';
  if (register === 'formal') {
    const informal = proseSentences(body).filter((s) => /요[.!?]?$/.test(s.replace(/\*\*/g, '')) && !/^(쓴 사람|만든 방법)/.test(s));
    for (const s of informal.slice(0, 5)) problems.push({ type: 'informal_register', detail: `해요체 문장 — 격식체(합니다체)로: "${s.slice(0, 50)}"` });
    if (informal.length > 5) problems.push({ type: 'informal_register', detail: `해요체 문장 ${informal.length - 5}개 더` });
  }
  for (const s of proseSentences(body)) {
    if (/^(만든 방법|쓴 사람|수정 이력)/.test(s)) continue; // the disclosure line describes the process on purpose
    const hit = WORK_REPORT.exec(s);
    if (hit) problems.push({ type: 'work_report', detail: `작업 보고 문장("${hit[0]}") — 확인 사실은 출처 줄·캡처 설명으로 옮기기: "${s.slice(0, 50)}"` });
  }
  return problems;
}

// ---- Reader-facing structure (user review 2026-11-18, docs/blog/LESSONS.md) ----
// Titles must say something (a predicate or a question), not list nouns; "청소기" must say which kind; a prose line
// with 3+ sentences reads as a wall of text on Naver mobile; every post needs a demand brief (who reads it, what they
// need, which natural-language queries it answers) and the body must actually cover those queries.
const CATEGORY_OK = /(무선|로봇|스틱|유선|핸디|물걸레|진공)\s?청소기/;
export function readerProblems(front, body) {
  const problems = [];
  const title = (/^#\s+(.+)$/m.exec(body) || [])[1]?.trim() ?? '';
  const core = title.replace(/\s*\([^)]*\)\s*$/, '');
  if (title && !/[?？]|(니다|습니다|다|까|요)$/.test(core)) problems.push({ type: 'title_style', detail: `제목이 명사 나열로 끝납니다 — 질문이나 서술로: "${title}"` });
  if (/청소기/.test(title) && !CATEGORY_OK.test(title) && !/(제트|코드제로|로보락|다이슨)/.test(title)) problems.push({ type: 'ambiguous_category', detail: `제목의 "청소기"가 무선·로봇 중 무엇인지 불분명합니다: "${title}"` });
  for (const line of body.split('\n')) {
    const t = line.trim();
    if (!t || /^(\||#|!\[|>|-\s|\d+\.\s)/.test(t) || SLOT_LINE.test(t) || /^(만든 방법|바로잡기|쓴 사람|수정 이력|출처)\s*:/.test(t)) continue;
    const n = t.split(/(?<=[.!?])\s+/).filter((x) => x.trim().length > 1).length;
    if (n >= 3) problems.push({ type: 'dense_paragraph', detail: `한 줄에 ${n}문장 — 모바일에서는 1~2문장마다 줄을 바꾸세요: "${t.slice(0, 40)}…"` });
  }
  if (!/^title:/m.test(front)) return problems; // demand brief applies to publishable posts (they carry a title)
  const field = (k) => (new RegExp(`^${k}:[ \\t]*(.+)$`, 'm').exec(front) || [])[1]?.trim() ?? '';
  // Standing rule (owner, 2026-11-18): before publishing, define the expected reader in ONE sentence —
  // who, in what situation, to decide what, searching with which words — "…검색할 때 이 글을 읽습니다."
  const demand = field('demand');
  if (!demand) problems.push({ type: 'no_demand_statement', detail: 'front matter demand:가 없습니다 — 수요자를 한 문장으로: "[누가] [어떤 상황에서] [무엇을 판단하려고] [어떤 검색어로] 이 글을 읽습니다."' });
  else {
    if (!/(니다|다)\.$/.test(demand)) problems.push({ type: 'no_demand_statement', detail: `demand:가 문장이 아닙니다(평서문 마침표로 끝내기): "${demand.slice(0, 40)}"` });
    if (demand.length < 40 || !/검색/.test(demand)) problems.push({ type: 'no_demand_statement', detail: 'demand:에 누가·상황·판단할 것·검색어가 다 들어가야 합니다(40자 이상, "검색" 포함).' });
  }
  for (const k of ['reader', 'need', 'queries']) if (!field(k)) problems.push({ type: 'no_demand_brief', detail: `front matter ${k}:가 없습니다(누가 읽고, 무엇이 급하고, 어떤 문장으로 검색하는지).` });
  const queries = field('queries').split(',').map((q) => q.trim()).filter(Boolean);
  if (queries.length) {
    // compare without spaces and with common spelling variants folded ("충전 안됨" ~ "충전이 안 될")
    const hay = foldKo(body);
    const missing = queries.filter((q) => !q.toLowerCase().split(/\s+/).every((w) => hay.includes(foldKo(w))));
    if (missing.length / queries.length > 0.25) problems.push({ type: 'query_coverage', detail: `검색어 ${queries.length}개 중 ${missing.length}개를 본문이 다루지 않습니다: ${missing.slice(0, 5).join(' / ')}` });
  }
  return problems;
}

// Severity. Heuristics that can misfire report as warnings (printed, not failing) unless --strict.
export const WARN_TYPES = new Set(['repeated_ending', 'guide_nonaffiliate']);
/** A cited case counts only with a checkable source (web page or our own site) and a verbatim quote verify-sources can find. */
export const hasCase = (claims) => claims.some((c) => /^사례:/.test(c.note || '') && /^(https:\/\/|site:\/)/.test(c.url) && Boolean((c.quote || '').trim()));
// Reading pages or captures, comparing, searching, dating a check, writing prose: computer work, never a person slot.
export const COMPUTER_TASK = /원문|캡처|대조|조회|검색|확인한 날짜|격식체로|문장으로 (?:적|쓰)|적기|쓰기/;
export const levelOf = (p) => (WARN_TYPES.has(p.type) ? 'warn' : 'fail');

/** Fold for loose Korean matching: no spaces, spelling variants unified (also used by demand-research). */
export const foldKo = (x) => x.toLowerCase().replace(/\s+/g, '').replace(/안(됨|돼요|돼|될|되는|되나요|되면)/g, '안되').replace(/환급/g, '환불');

// ---- Situational repair guides (front matter kind: guide) — EDITORIAL_STANDARDS §12 ----
// Traffic light (tier): green = the reader may do it; yellow = may do it with conditions (renter consent, shut-off,
// building rules); red = a registered/licensed professional's job, so the guide gives reasons and costs, never steps.
export const TIERS = ['green', 'yellow', 'red'];

/** Body split by ##/### headings: [{ heading, lines }]; the part before the first heading has heading ''. */
export function sectionsOf(body) {
  const out = [{ heading: '', lines: [] }];
  for (const line of body.split('\n')) {
    const m = /^#{2,3}\s+(.*)$/.exec(line.trim());
    if (m) out.push({ heading: m[1].trim(), lines: [] });
    else out[out.length - 1].lines.push(line);
  }
  return out;
}

export function guideProblems(front, body) {
  const f = (k) => (new RegExp(`^${k}:[ \\t]*(.*)$`, 'm').exec(front) || [])[1]?.trim() ?? '';
  if (f('kind') !== 'guide') return [];
  const problems = [];
  const tier = f('tier');
  if (!TIERS.includes(tier)) problems.push({ type: 'guide_tier', detail: 'tier:가 green·yellow·red 중 하나가 아닙니다(신호등 등급, EDITORIAL_STANDARDS §12).' });
  const basis = f('legal_basis');
  if ((tier === 'yellow' || tier === 'red') && !(/https:\/\/\S+/.test(basis) && /\d{4}-\d{2}-\d{2}/.test(basis))) {
    problems.push({ type: 'guide_legal_basis', detail: '노랑·빨강 가이드는 legal_basis:에 근거 조문·원문 주소(https)·확인일(YYYY-MM-DD)이 있어야 합니다.' });
  }
  const secs = sectionsOf(body);
  // first-screen summary: difficulty, time, DIY cost, technician cost — within the first 25 non-empty lines
  const top = body.split('\n').filter((l) => l.trim()).slice(0, 25).join('\n');
  if (!(/난이도/.test(top) && /시간/.test(top) && /기사/.test(top))) {
    problems.push({ type: 'guide_summary', detail: '첫 화면 요약칸(난이도·시간·직접 할 때 비용·기사 비용·등급)이 본문 앞부분에 없습니다.' });
  }
  if (!secs.some((x) => /멈추|멈춤|기사를 불러야|맡겨야/.test(x.heading))) {
    problems.push({ type: 'guide_stop', detail: '멈춤 조건 절(제목에 "멈추"·"기사를 불러야" 등)이 없습니다.' });
  }
  const tools = secs.find((x) => /준비물/.test(x.heading));
  if (tier !== 'red' && !tools) problems.push({ type: 'guide_tools', detail: '준비물 절(공구 용도·규격, 살 것·빌릴 것·다이소로 충분한 것)이 없습니다.' });
  const cost = secs.find((x) => /비용|얼마/.test(x.heading) && x.lines.some((l) => /^\s*\|/.test(l)));
  const table = cost ? cost.lines.filter((l) => /^\s*\|/.test(l)).join('\n') : '';
  if (!cost || !/직접/.test(table) || !/기사|업체|맡기/.test(table)) {
    problems.push({ type: 'guide_cost', detail: '직접 할 때와 기사에게 맡길 때를 나란히 둔 비용표가 없습니다(제목에 "비용"·"얼마"가 든 절의 표).' });
  } else if (tier !== 'red' && !/공구/.test(table)) {
    problems.push({ type: 'guide_cost', detail: '비용표에 공구 구입비 줄이 없습니다 — 공구를 새로 사면 기사보다 비싸지는 경우까지 보여 주세요.' });
  }
  if (tier === 'red') {
    for (const x of secs) {
      if (/신청|절차|문의|분쟁|합의|요청/.test(x.heading)) continue; // "how to request a pro" lists are fine
      if (x.lines.some((l) => /^\s*\d+\.\s/.test(l))) {
        problems.push({ type: 'guide_red_steps', detail: `빨강 등급 글에 번호 단계가 있습니다("${x.heading || '도입부'}") — 방법은 쓰지 않고 이유와 비용만 씁니다.` });
      }
    }
    if (/가스/.test(body) && !/공급사/.test(body)) problems.push({ type: 'guide_gas', detail: '가스 작업 글에는 "가스 공급사(도시가스사)에 신청" 문장이 있어야 합니다.' });
  }
  const aff = (body.match(/\]\(aff:/g) || []).length;
  if (aff) {
    const toolText = tools ? tools.lines.join('\n') : '';
    if ((toolText.match(/\]\(aff:/g) || []).length < aff) problems.push({ type: 'guide_affiliate_place', detail: '제휴 링크는 준비물 절 안에만 둡니다.' });
    if (!/다이소|대여|빌리|집에 있는/.test(toolText)) problems.push({ type: 'guide_nonaffiliate', detail: '제휴 링크가 있는 준비물 절에 비제휴 경로(다이소·대여·집에 있는 공구)가 없습니다.' });
  }
  return problems;
}

export function styleProblems(body) {
  const problems = [];
  for (const h of connectiveCommas(body)) problems.push({ type: 'connective_comma', detail: `연결어미 뒤 쉼표("${h.at}") — 쉼표를 빼거나 문장을 나누세요(koreanRewriting C-11): "${h.sentence.slice(0, 45)}…"` });
  for (const r of repeatedEndings(body)) problems.push({ type: 'repeated_ending', detail: `"~${r.ending}"로 끝나는 문장이 ${r.count}개 연속 — 서술어를 바꿔 리듬을 깨세요(E-2)` });
  // the title promises an answer: every number in the H1 must already appear in the first paragraph
  const lines = body.split('\n');
  const h1 = lines.findIndex((l) => /^#\s/.test(l));
  if (h1 !== -1) {
    const firstPara = [];
    for (const l of lines.slice(h1 + 1)) { if (!l.trim()) { if (firstPara.length) break; continue; } if (/^(!\[|>|#)/.test(l.trim())) break; firstPara.push(l); }
    const have = new Set(numbersIn(firstPara.join(' ')).flatMap((n) => [n.key, n.digits]));
    const missing = numbersIn(lines[h1]).filter((n) => !have.has(n.key) && !have.has(n.digits));
    if (missing.length) problems.push({ type: 'title_answer', detail: `제목의 숫자(${missing.map((n) => n.raw).join(', ')})가 첫 문단에 없습니다 — 제목이 약속한 답을 첫 문단에서 바로 주세요.` });
  }
  return problems;
}

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

// "16만 원" / "12만 9천 원" / "13만~16만 원" are written for readers; compare them as plain won amounts.
const KO_MONEY = /(\d+)\s?만(?:\s?(\d)\s?천)?(\s?원)?/g;
const koMoney = (t) => t.replace(KO_MONEY, (m, man, cheon, won) => `${(Number(man) * 10000 + Number(cheon || 0) * 1000).toLocaleString('en-US')}${won ? '원' : ''}`);

export function numbersIn(text) {
  const cleaned = koMoney(text)
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

// A body number is sourced when the ledger has the same number with the same unit. The unit-free fallback exists
// for ranges ("28,000~38,000원" leaves the first figure without a unit), so it only applies to unit-less or 4+ digit
// figures: "4시간" must not pass because the ledger happens to contain "3~4건".
export function isSourced(n, keys, digits) {
  if (keys.has(n.key)) return true;
  const unit = n.key.slice(n.digits.length);
  return digits.has(n.digits) && (!unit || n.digits.replace('.', '').length >= 4);
}

/** Numbers in the body that no ledger row covers (same matching as checkDraft). */
export function unsourcedNumbers(text) {
  const { body, claims } = parseDraft(text);
  const keys = new Set(); const digits = new Set();
  for (const c of claims) for (const n of numbersIn(c.value)) { keys.add(n.key); digits.add(n.digits); }
  const seen = new Set();
  // open person slots are instructions, not published text — their numbers ("통화 1회") need no source
  return numbersIn(body.replace(SLOT_RE, '')).filter((n) => !isSourced(n, keys, digits) && !seen.has(n.key) && seen.add(n.key));
}

// Dates in ledgers, stamps and the status board are Korean dates. UTC "today" lags KST by up to 9 hours and made
// rows verified after midnight KST look future-dated.
export const todayKST = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());

export function checkDraft(text, { today = todayKST(), maxAgeDays = 90, strict = false } = {}) {
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
  for (const n of numbersIn(body.replace(SLOT_RE, ""))) { // slot text is an instruction, not published text
    // Same numeric value recorded in the ledger counts as sourced (ranges like "28,000~38,000원" leave the first
    // number without a unit, so the unit is not required to match).
    const matched = isSourced(n, ledgerKeys, ledgerDigits);
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
  problems.push(...affiliateProblems(front, body));
  problems.push(...registerProblems(front, body));
  problems.push(...readerProblems(front, body));
  problems.push(...styleProblems(body));
  problems.push(...guideProblems(front, body));
  for (const m of body.matchAll(SLOT_RE)) {
    const owner = slotOwner(m[1]);
    if (COMPUTER_TASK.test(m[2])) problems.push({ type: 'ai_task_in_slot', detail: `사람 칸에 컴퓨터 작업이 들어 있습니다 — AI가 수행하고 결과를 본문에 쓰세요:${m[2].slice(0, 50)}…` });
    else problems.push({ type: 'human_slot', owner, detail: `${owner} 칸이 비어 있습니다:${m[2].slice(0, 50)}…` });
  }
  if (!/^firsthand:[ \t]*\S/m.test(front) && !hasCase(claims)) problems.push({ type: 'no_case', detail: '검증 가능한 사례가 없습니다. 출처 기록에 "사례:" 행(공적 사례·언론 보도·자사 제보 + 원문 인용 문구)을 넣거나, 편집자가 직접 한 확인이 있으면 firsthand:에 적으세요(docs/blog/CASES.md).' });
  for (const p of problems) p.level = strict ? 'fail' : levelOf(p);
  return { ok: problems.every((p) => p.level === 'warn'), problems, claims: claims.length };
}

// Source lists, the source heading, the byline, the AI-use line and the fixed correction policy line repeat on purpose.
const isSourceLine = (l) => /^\s*-\s.*\]\(/.test(l) || /^#+\s*출처/.test(l) || /^(>\s*)?(쓴 사람|작성|만든 방법|바로잡기)\s*[:：]/.test(l.trim()) || /^(>\s*)?광고·제휴 없이 작성한 글입니다/.test(l.trim());

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
      if (!line.trim() || isSourceLine(line) || /^\s*\|/.test(line) || SLOT_LINE.test(line) || /^#/.test(line) || /^!\[/.test(line)) continue;
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
      if (!line.trim() || isSourceLine(line) || /^\s*\|/.test(line) || SLOT_LINE.test(line)) continue; // open slots are instructions, not prose
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
  if (!files.length) { console.error('usage: node scripts/check-claims.mjs <draft.md...> [--today=YYYY-MM-DD] [--max-age=90] [--strict]'); process.exit(2); }
  let failed = 0;
  const dups = files.length > 1 ? crossPostDuplicates(files.map((f) => fs.readFileSync(f, 'utf8'))) : [];
  for (const d of dups) console.log(`DUP   ${d.posts.map((i) => files[i]).join(' & ')}\n   - 글 사이에 같은 문장·소제목: "${d.unit.slice(0, 70)}"`);
  const near = files.length > 1 ? crossPostNearDuplicates(files.map((f) => fs.readFileSync(f, 'utf8'))) : [];
  for (const d of near) console.log(`NEAR  ${d.posts.map((i) => files[i]).join(' & ')} (유사도 ${d.sim})\n   - "${d.a.slice(0, 60)}"\n   - "${d.b.slice(0, 60)}"`);
  if (dups.length || near.length) failed++;
  for (const f of files) {
    const r = checkDraft(fs.readFileSync(f, 'utf8'), { today: opt.today, maxAgeDays: Number(opt['max-age'] ?? 90), strict: 'strict' in opt });
    const warns = r.problems.filter((p) => p.level === 'warn').length;
    console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${f}  (출처 기록 ${r.claims}건${warns ? `, 경고 ${warns}` : ''})`);
    for (const p of r.problems) console.log(`   - ${p.level === 'warn' ? 'WARN ' : ''}[${p.type}] ${p.detail}`);
    if (!r.ok) failed++;
  }
  process.exit(failed ? 1 : 0);
}
