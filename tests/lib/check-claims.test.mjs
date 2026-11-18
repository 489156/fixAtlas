import test from 'node:test';
import assert from 'node:assert/strict';
import { checkDraft, crossPostDuplicates, numbersIn, parseDraft } from '../../scripts/check-claims.mjs';

const draft = (claims, body) => `---\nslug: t\nfirsthand: 2026-11-18 테스트\nclaims:\n${claims.map((c) => `  - ${c}`).join('\n')}\n---\n${body}`;
const SRC = 'https://www.lge.co.kr/support/visit-center-reservation?seq=182';

test('ledger is parsed from front matter', () => {
  const { claims } = parseDraft(draft([`28,000원 | ${SRC} | 2026-11-17 | LG 출장비`], 'x'));
  assert.deepEqual(claims, [{ value: '28,000원', url: SRC, date: '2026-11-17', note: 'LG 출장비', quote: '' }]);
});

test('numbers: units, comma groups and ranges are claims; part numbers, model names, dates, list markers are not', () => {
  const keys = numbersIn('1. 삼성 DJ96-00242D 배터리는 160,000원, V10과 220W, 2026-11-17 확인. 28,000~38,000원, 39.8%, 3단계').map((n) => n.key);
  assert.deepEqual(keys, ['160000원', '28000', '38000원', '39.8%']);
});

test('a fully sourced draft passes', () => {
  const r = checkDraft(draft([
    `28,000~38,000원 | ${SRC} | 2026-11-17 | LG 출장비 범위`,
    `33,000원 | ${SRC} | 2026-11-17 | 야간·휴일`,
  ], 'LG 출장비는 28,000원~38,000원입니다. 야간에는 33,000원입니다.'), { today: '2026-11-18' });
  assert.equal(r.ok, true, JSON.stringify(r.problems));
});

test('an unsourced number fails with a precise message', () => {
  const r = checkDraft(draft([`28,000원 | ${SRC} | 2026-11-17 | x`], '평일 28,000원, 성수기 45,000원입니다.'), { today: '2026-11-18' });
  assert.equal(r.ok, false);
  assert.deepEqual(r.problems.map((p) => p.type), ['unsourced_number']);
  assert.match(r.problems[0].detail, /45,000원/);
});

test('missing ledger, http source, missing date, stale date and future date are all caught', () => {
  assert.equal(checkDraft('---\nslug: t\n---\n본문 1,000원', { today: '2026-11-18' }).problems[0].type, 'no_ledger');
  const r = checkDraft(draft([
    '1,000원 | http://insecure.example | 2026-11-17 | a',
    '2,000원 | https://ok.example | | b',
    '3,000원 | https://ok.example | 2026-01-01 | c',
    '4,000원 | https://ok.example | 2027-01-01 | d',
  ], '1,000원 2,000원 3,000원 4,000원'), { today: '2026-11-18', maxAgeDays: 90 });
  assert.deepEqual(r.problems.map((p) => p.type).sort(), ['bad_date', 'bad_date', 'bad_source', 'stale']);
});

test('banned phrases: hype, guessing, leftover placeholders', () => {
  for (const body of ['업계 최저가 보장!', '아마 비싼 것 같습니다', '링크 삽입 예정', 'TODO 확인']) {
    const r = checkDraft(draft([`1원 | https://a.example | 2026-11-17 | x`], body), { today: '2026-11-18' });
    assert.ok(r.problems.some((p) => p.type === 'banned_phrase'), body);
  }
});

test('Korean-style dates are not treated as numeric claims', () => {
  const keys = numbersIn('2026년 11월 17일 확인, 2025년 8월 기사, 11월 17일 기준, 보증 1년').map((n) => n.key);
  assert.deepEqual(keys, ['1년']);
});

test('site:/ internal sources and links are accepted', () => {
  const r = checkDraft(draft([`5건 | site:/methodology | 2026-11-18 | 중앙값 공개 기준`], '같은 모델 제보가 5건 모이면 공개합니다. [방법론](site:/methodology?x=1000#body)'), { today: '2026-11-18' });
  assert.equal(r.ok, true, JSON.stringify(r.problems));
  const bad = checkDraft(draft([`5건 | /methodology | 2026-11-18 | x`], '5건'), { today: '2026-11-18' });
  assert.deepEqual(bad.problems.map((p) => p.type), ['bad_source']);
});

test('a paragraph mixing 합니다체 and 해요체 fails; separate blocks and a bare "아니요." do not', () => {
  const r = checkDraft(draft([`1원 | https://a.example | 2026-11-17 | x`], '비율이에요. 고장률이 아닙니다.'), { today: '2026-11-18' });
  assert.deepEqual(r.problems.map((p) => p.type), ['mixed_register']);
  const ok = checkDraft(draft([`1원 | https://a.example | 2026-11-17 | x`], '결론은 이렇습니다.\n\n아니요. 부품값이에요.\n| 표 | 입니다. 이에요. |'), { today: '2026-11-18' });
  assert.equal(ok.ok, true, JSON.stringify(ok.problems));
});

test('5th ledger field is a verbatim quote; 직접: sources are accepted for in-person checks', () => {
  const { claims } = parseDraft(draft([`28,000원 | ${SRC} | 2026-11-17 | 평일 | 거리에 상관없이 동일하게`], 'x'));
  assert.equal(claims[0].quote, '거리에 상관없이 동일하게');
  const r = checkDraft(draft([`5분 | 직접:LG전자 고객센터 전화 2026-11-18 | 2026-11-18 | 대기 시간`], '상담 연결까지 5분 걸렸어요.'), { today: '2026-11-18' });
  assert.equal(r.ok, true, JSON.stringify(r.problems));
});

test('template/AI clichés, unfilled in-person slots and a missing firsthand record fail', () => {
  for (const body of ['**한 줄 결론**: 28,000원입니다.', '오늘은 출장비에 대해 알아보겠습니다.', '## 자주 묻는 질문', '자세히 보기 → 링크', '⚠ 주의하세요.']) {
    const r = checkDraft(draft([`28,000원 | ${SRC} | 2026-11-17 | x`], body), { today: '2026-11-18' });
    assert.ok(r.problems.some((p) => p.type === 'cliche'), body);
  }
  const slot = checkDraft(draft([`1원 | https://a.example | 2026-11-17 | x`], '[[직접 확인: 고객센터에 전화해 물어볼 것]]'), { today: '2026-11-18' });
  assert.deepEqual(slot.problems.map((p) => p.type), ['human_slot']);
  const noFirst = checkDraft('---\nslug: t\nclaims:\n  - 1원 | https://a.example | 2026-11-17 | x\n---\n본문', { today: '2026-11-18' });
  assert.deepEqual(noFirst.problems.map((p) => p.type), ['no_firsthand']);
  const blank = checkDraft('---\nslug: t\nfirsthand:\ndata_checked: 2026-11-18\nclaims:\n  - 1원 | https://a.example | 2026-11-17 | x\n---\n본문', { today: '2026-11-18' });
  assert.deepEqual(blank.problems.map((p) => p.type), ['no_firsthand'], 'an empty firsthand: must not borrow the next line');
});

test('sentences and headings copied across posts are reported; source list lines are not', () => {
  const a = draft([], '## 출장비 기준\n이 문장은 두 글에 똑같이 들어가 있는 문장입니다.\n- 고장도감: [방법론](site:/methodology)');
  const b = draft([], '## 출장비 기준\n이 문장은 두 글에 똑같이 들어가 있는 문장입니다.\n- 고장도감: [방법론](site:/methodology)');
  const c = draft([], '전혀 다른 내용으로 쓴 세 번째 글의 문장입니다.');
  const d = crossPostDuplicates([a, b, c]);
  assert.deepEqual(d.map((x) => x.unit).sort(), ['## 출장비 기준', '이 문장은 두 글에 똑같이 들어가 있는 문장입니다.']);
  assert.deepEqual(d[0].posts, [0, 1]);
});

test('near-duplicate sentences across posts are reported (same CTA with a word changed)', async () => {
  const { crossPostNearDuplicates } = await import('../../scripts/check-claims.mjs');
  const a = draft([], '같은 모델 제보가 5건 모이면 중앙값을, 3~4건이면 범위만 참고용으로 공개해요.');
  const b = draft([], '같은 모델·증상 제보가 5건 모이면 중앙값을, 3~4건이면 범위만 참고용으로 공개해요.');
  const c = draft([], '받은 견적이나 영수증 금액을 보내 주시면 모델별로 정리해서 보여 드려요.');
  const hits = crossPostNearDuplicates([a, b, c]);
  assert.equal(hits.length, 1);
  assert.deepEqual(hits[0].posts, [0, 1]);
});
