import test from 'node:test';
import assert from 'node:assert/strict';
import { connectiveCommas, repeatedEndings } from '../../scripts/lib/korean-style.mjs';
import { checkDraft, isSourced, numbersIn, styleProblems } from '../../scripts/check-claims.mjs';
import { captureQA, claimKey, findNumberSnippet, refreshLedgerDates } from '../../scripts/verify-sources.mjs';
import { freshness, gapAnalysis, groupShares, mergeTrends, missingTerms, naverSignature, parseShop, suggestTags, trendBatches } from '../../scripts/demand-research.mjs';
import { renderTable, statusOf } from '../../scripts/blog-status.mjs';
import { thumbnailProblems } from '../../scripts/naver-export.mjs';

test('C-11: comma after a connective ending is caught; listing commas are not', () => {
  const hits = connectiveCommas('요금은 28,000원이고, 주말은 33,000원입니다.\n평일 18시 이후, 주말은 비쌉니다. 싸지만, 위험합니다.');
  assert.deepEqual(hits.map((h) => h.at), ['이고,', '싸지만,']);
});

test('E-2: 4+ identical endings in one passage warn; a heading resets the run', () => {
  const run = '가입니다. 나입니다. 다입니다. 라입니다.';
  assert.deepEqual(repeatedEndings(run), [{ ending: '입니다', count: 4 }]);
  assert.deepEqual(repeatedEndings('가입니다. 나입니다.\n## 소제목\n다입니다. 라입니다.'), []);
  const doc = '---\nslug: t\nfirsthand: x\nclaims:\n  - 1원 | https://a.example | 2026-11-17 | x\n---\n가입니다. 나입니다.\n다입니다. 라입니다.';
  const r = checkDraft(doc, { today: '2026-11-18' });
  assert.equal(r.ok, true, 'warnings do not fail');
  assert.equal(r.problems.find((p) => p.type === 'repeated_ending').level, 'warn');
  assert.equal(checkDraft(doc, { today: '2026-11-18', strict: true }).ok, false, '--strict turns warnings into failures');
});

test('title_answer: numbers promised in the title must appear in the first paragraph', () => {
  const bad = styleProblems('# 출장비는 얼마일까? 평일 28,000원\n출장비는 시간대마다 다릅니다.\n\n본문 28,000원');
  assert.ok(bad.some((p) => p.type === 'title_answer'));
  assert.deepEqual(styleProblems('# 출장비는 얼마일까? 평일 28,000원\n평일 출장비는 28,000원입니다.').filter((p) => p.type === 'title_answer'), []);
});

test('unit-aware sourcing: "4시간" is not sourced by "3~4건"; range fallback still works for big numbers', () => {
  const keys = new Set(); const digits = new Set();
  for (const n of numbersIn('3~4건 / 38,000원')) { keys.add(n.key); digits.add(n.digits); }
  const [h4] = numbersIn('4시간');
  assert.equal(isSourced(h4, keys, digits), false);
  const [k28] = numbersIn('28,000원'); // not in ledger at all
  assert.equal(isSourced(k28, keys, digits), false);
  const range = numbersIn('28,000~38,000원'); // first figure has no unit
  assert.equal(isSourced(range[1], keys, digits), true);
});

test('verify --write: matched rows get today, others keep their date; data_checked follows only when all matched', () => {
  const text = '---\ndata_checked: 2026-10-01\nclaims:\n  - 1원 | https://a.example | 2026-10-01 | x | q\n  - 2원 | https://b.example | 2026-10-01 | y |\n---\nbody';
  const matched = new Set([claimKey({ value: '1원', url: 'https://a.example', quote: 'q' })]);
  const partial = refreshLedgerDates(text, matched, '2026-11-18', false);
  assert.match(partial, /1원 \| https:\/\/a\.example \| 2026-11-18 \| x \| q/);
  assert.match(partial, /2원 \| https:\/\/b\.example \| 2026-10-01/);
  assert.match(partial, /data_checked: 2026-10-01/);
  assert.match(refreshLedgerDates(text, matched, '2026-11-18', true), /data_checked: 2026-11-18/);
});

test('verify --suggest: snippet finder respects number boundaries', () => {
  const [h4] = numbersIn('4시간');
  assert.equal(findNumberSnippet(h4, '긴급 문의는 24시간 운영합니다'), null);
  assert.match(findNumberSnippet(h4, '긴급 24시간. (1개당 완충 시간: 약 4시간) 구매'), /약 4시간/);
});

test('capture QA rejects dark, unhighlighted or low-resolution captures', () => {
  assert.equal(captureQA({ mean: 200, redRatio: 0.01, width: 860 }).ok, true);
  assert.equal(captureQA({ mean: 44, redRatio: 0.01, width: 860 }).ok, false);
  assert.equal(captureQA({ mean: 200, redRatio: 0, width: 860 }).ok, false);
  assert.equal(captureQA({ mean: 200, redRatio: 0.01, width: 430 }).ok, false);
  assert.equal(captureQA({ mean: 200, redRatio: 0.01, width: 860, clipped: true }).ok, false, 'a table cut off at the right edge fails');
  assert.equal(captureQA({ mean: 200, redRatio: 0.01, width: 860, broken: true }).ok, false, 'a chart image that never loaded fails');
});

test('demand research: gap analysis, tag suggestions, Naver signature format', () => {
  const { covered, missing } = gapAnalysis('무선청소기 배터리 수명과 교체 비용입니다. 충전이 안 될 때', ['무선청소기 배터리 수명', '무선청소기 배터리 리필', '코드제로 충전 안됨']);
  assert.deepEqual(missing, ['무선청소기 배터리 리필', '코드제로 충전 안됨']);
  assert.deepEqual(covered, ['무선청소기 배터리 수명']);
  const tags = suggestTags({ a: ['코드제로 배터리 가격', 'x y'], b: ['코드제로 배터리 가격'] }, ['기존태그'], 3);
  assert.deepEqual(tags, ['코드제로배터리가격']);
  // brand glued to product is still matched; tags only from queries the body answers
  assert.deepEqual(gapAnalysis('LG전자 에어컨 기사 출장비는 28,000원입니다.', ['lg에어컨 기사 출장비']).missing, []);
  const bySeed = { a: ['lg 기사 출장비', 'lg 인터넷 기사 출장비'], b: ['lg 기사 출장비', 'lg 인터넷 기사 출장비'] };
  assert.deepEqual(suggestTags(bySeed, [], 10, ['lg 기사 출장비']), ['lg기사출장비']);
  const sig = naverSignature('secret', '1700000000000', 'GET', '/keywordstool');
  assert.match(sig, /^[A-Za-z0-9+/]{43}=$/);
  assert.equal(sig, naverSignature('secret', '1700000000000', 'GET', '/keywordstool'));
});

test('blog-status: verdicts, next actions and the D-2 urgency gate', () => {
  const post = (extra = '') => `---\nslug: s\ntitle: 무선청소기 배터리 교체 비용은?\ndemand: 무선청소기를 오래 쓴 사람이 교체 여부를 판단하려고 '무선청소기 배터리 교체 비용'을 검색할 때 이 글을 읽습니다.\nreader: r\nneed: n\nqueries: 무선청소기 배터리 교체 비용\npublish: 2026-11-20 08:00\n${extra}claims:\n  - 1원 | https://a.example | 2026-11-17 | x\n---\n# 무선청소기 배터리 교체 비용은?\n무선청소기 배터리 교체 비용은 1원입니다.\n`;
  const none = statusOf(post(), { today: '2026-11-19' });
  assert.equal(none.ready, false);
  assert.equal(none.urgent, true, 'D-1 and not ready');
  assert.ok(none.todo.includes('[AI] 원문 대조 (verify-sources)'));
  assert.ok(none.todo.every((t) => /^\[(AI|판단|현장)\] /.test(t)), 'every action names its owner');
  const ready = statusOf(post('firsthand: 2026-11-18 전화\n'), { today: '2026-11-19', verifyStamp: { date: '2026-11-19', problems: 0, capture_failures: [] }, suggestData: { fetched_at: '2026-11-18' } });
  assert.deepEqual(ready.todo, []);
  assert.equal(ready.ready, true);
});

test('thumbnail copy: no 해요체, explicit vacuum type, no ad-free chip on thumbnails', () => {
  const cards = [{ id: 'a', kind: 'thumb', title: '청소기 배터리,\n보증 되나요?' }, { id: 'b', kind: 'thumb', title: '무선청소기 배터리,\n교체 비용은?' }];
  assert.equal(thumbnailProblems(['../cards/a.png'], cards).length, 2);
  assert.deepEqual(thumbnailProblems(['../cards/b.png'], cards), []);
});

test('person slots: judgment vs in-person; computer work left in a person slot fails', () => {
  const doc = (slot) => `---\nslug: t\nfirsthand: x\nclaims:\n  - 1원 | https://a.example | 2026-11-17 | x\n---\n본문은 1원입니다.\n\n${slot}`;
  const judge = checkDraft(doc('[[판단: 바이라인을 실명과 활동명 중 무엇으로 할지 정하기]]'), { today: '2026-11-18' });
  assert.deepEqual(judge.problems.map((p) => [p.type, p.owner]), [['human_slot', '판단']]);
  const call = checkDraft(doc('[[현장: 고객센터 통화 1회. 답을 AI에게 알려 주면 AI가 채움]]'), { today: '2026-11-18' });
  assert.deepEqual(call.problems.map((p) => [p.type, p.owner]), [['human_slot', '현장']], 'numbers inside a slot need no source');
  for (const bad of ['[[현장: 편집자가 원문과 캡처를 직접 다시 확인한 날짜]]', '[[직접 확인: 답을 격식체로 적기]]', '[[판단: 네이버에서 검색해 상위 글 비교]]']) {
    assert.ok(checkDraft(doc(bad), { today: '2026-11-18' }).problems.some((p) => p.type === 'ai_task_in_slot'), bad);
  }
});

test('verify --write also dates the reader-facing "마지막 대조일" when every row matched', () => {
  const text = '---\ndata_checked: 2026-10-01\nclaims:\n  - 1원 | https://a.example | 2026-10-01 | x |\n---\n> 만든 방법: 마지막 대조일은 2026-10-01입니다.';
  const keys = new Set([claimKey({ value: '1원', url: 'https://a.example' })]);
  assert.match(refreshLedgerDates(text, keys, '2026-11-18', true), /마지막 대조일은 2026-11-18입니다/);
  assert.match(refreshLedgerDates(text, keys, '2026-11-18', false), /마지막 대조일은 2026-10-01입니다/);
});

test('blog-status: unread image rows become an [AI] task; one shared decision is listed once', () => {
  const post = (slug) => `---\nslug: ${slug}\ntitle: t\ndemand: d\nclaims:\n  - 3건 | https://a.example | 2026-11-10 | 이미지: 표 캡처:t@다음이미지 | 앵커\n---\n# t\n본문 3건입니다.\n\n쓴 사람: [[판단: 바이라인 정하기]]\n`;
  const stamp = { date: '2026-11-18', problems: 0, capture_failures: [] };
  const a = statusOf(post('a'), { today: '2026-11-18', verifyStamp: stamp, suggestData: { fetched_at: '2026-11-18' } });
  assert.ok(a.todo.includes('[AI] 이미지 속 숫자 1행 판독(캡처를 읽고 행 날짜 갱신)'));
  assert.ok(a.todo.includes('[판단] 1건'));
  const b = statusOf(post('b'), { today: '2026-11-18', verifyStamp: stamp });
  const table = renderTable([a, b], '2026-11-18');
  assert.equal(table.match(/\[판단\] a, b: 바이라인 정하기/g).length, 1);
});

test('repair guides: tier, legal basis, summary, stop, tools, DIY-vs-pro cost table, red steps, affiliate placement', async () => {
  const { guideProblems } = await import('../../scripts/check-claims.mjs');
  const front = (extra) => `slug: g\nkind: guide\n${extra}`;
  const good = `| 난이도 | 시간 | 직접 하면 | 기사에게 맡기면 |\n|---|---|---|---|\n| 쉬움 | 30분 | 3만 원 | 8만 원 |
## 이럴 땐 멈추고 기사를 부르십시오
- 밸브가 잠기지 않을 때
## 준비물
| 준비물 | 구하는 방법 |
|---|---|
| 멍키 스패너 | 다이소 |
## 어떻게 바꿉니까?
1. 밸브를 잠급니다.
## 직접 하면 얼마, 맡기면 얼마입니까?
| 항목 | 직접 | 기사 |
|---|---|---|
| 공구 | 0원 | — |`;
  const types = (fm, body) => guideProblems(fm, body).map((p) => p.type);
  assert.deepEqual(types(front('tier: green'), good), []);
  assert.deepEqual(guideProblems('slug: x\n', good), [], 'non-guide posts are untouched');
  assert.deepEqual(types(front('tier: blue'), good), ['guide_tier']);
  assert.deepEqual(types(front('tier: yellow\nlegal_basis: 민법 제615조'), good), ['guide_legal_basis']);
  assert.deepEqual(types(front('tier: yellow\nlegal_basis: 민법 제615조 | https://www.law.go.kr/x | 2026-11-19'), good), []);
  assert.ok(types(front('tier: green'), good.replace('## 이럴 땐 멈추고 기사를 부르십시오', '## 주의')).includes('guide_stop'));
  assert.ok(types(front('tier: green'), good.replace('| 공구 | 0원 | — |', '| 부품 | 3만 원 | 8만 원 |')).includes('guide_cost'), 'tool purchase row is required');
  assert.ok(types(front('tier: green'), good.replace(/\| 난이도[\s\S]*?\| 쉬움 \| 30분 \| 3만 원 \| 8만 원 \|\n/, '')).includes('guide_summary'));
  const red = types(front('tier: red\nlegal_basis: 전기공사업법 제3조 | https://www.law.go.kr/y | 2026-11-19'), good);
  assert.ok(red.includes('guide_red_steps'), 'a red guide must not teach steps');
  const withAff = good.replace('1. 밸브를 잠급니다.', '1. 밸브를 잠급니다. [스패너](aff:coupang:https://link.coupang.com/a/x)');
  assert.ok(types(front('tier: green'), withAff).includes('guide_affiliate_place'));
  const inTools = good.replace('| 멍키 스패너 | 다이소 |', '| [멍키 스패너](aff:coupang:https://link.coupang.com/a/x) | 쿠팡 |');
  assert.deepEqual(types(front('tier: green'), inTools), ['guide_nonaffiliate']);
});

test('DataLab: batches carry the anchor; merged trends share one scale', () => {
  assert.deepEqual(trendBatches(['a', 'b', 'c', 'd', 'e', 'f']), [['a', 'b', 'c', 'd', 'e'], ['a', 'f']]);
  const months = (v) => Array.from({ length: 24 }, (_, i) => ({ period: `p${i}`, ratio: i < 12 ? v : v * 2 }));
  // batch 2 measured the anchor at half the scale of batch 1; after merging, f must still be comparable to b
  const merged = mergeTrends([
    [{ title: 'a', data: months(10) }, { title: 'b', data: months(20) }],
    [{ title: 'a', data: months(5) }, { title: 'f', data: months(10) }],
  ]);
  assert.equal(merged.a.mean, 100);
  assert.equal(merged.b.mean, merged.f.mean, 'same relative interest after rescaling');
  assert.ok(merged.b.last12 > merged.b.prev12, 'rising trend detected');
});

test('API HUB helpers: seasonality, question gaps, commercial share, gateway', async () => {
  const { seasonality, questionGaps, isQuestion, stripTags, commercialShare, naverGateway } = await import('../../scripts/demand-research.mjs');
  // winter peak: Dec/Jan twice the rest, over two years
  const data = [];
  for (const y of [2024, 2025]) for (let m = 1; m <= 12; m += 1) data.push({ period: `${y}-${String(m).padStart(2, '0')}-01`, ratio: m === 12 || m === 1 ? 40 : 20 });
  const s = seasonality(data);
  assert.deepEqual(s.peak.sort(), [1, 12]);
  assert.equal(s.byMonth[0], 40);

  assert.equal(stripTags('변기 <b>필밸브</b> &quot;교체&quot;'), '변기 필밸브 "교체"');
  assert.ok(isQuestion('변기 물이 안 차요 왜 그럴까요?'));
  assert.ok(isQuestion('필밸브 교체 비용 얼마 정도인가요'));
  assert.ok(!isQuestion('대림바스 필밸브 정품'), 'a product name is not a question');

  const body = '필밸브를 바꾸면 물이 다시 찹니다. 대림 변기는 와토스 부품이 맞습니다. 수도 밸브를 먼저 잠급니다.';
  const gaps = questionGaps(body, ['대림 변기 필밸브 맞나요?', '필밸브 교체 후 물소리 나요?', '필밸브 교체 후 물소리 나요?', '수도요금 많이 나오나요?']);
  assert.ok(!gaps.some((g) => g.q.startsWith('대림')), 'answered question is not a gap');
  assert.equal(gaps[0].q, '필밸브 교체 후 물소리 나요?');
  assert.equal(gaps[0].count, 2, 'repeats are counted');

  assert.equal(commercialShare(['평택 송탄 변기 필밸브 교체 출장', '필밸브 직접 교체 후기']), 0.5);
  assert.equal(commercialShare([]), null);

  assert.equal(naverGateway({}), null);
  const hub = naverGateway({ NAVER_CLIENT_ID: 'x', NAVER_CLIENT_SECRET: 'y' });
  assert.equal(hub.kind, 'hub');
  assert.ok(hub.headers[0].startsWith('X-NCP-APIGW-API-KEY-ID'));
  assert.ok(hub.search('kin').endsWith('/search/v1/kin'));
  assert.equal(naverGateway({ NAVER_CLIENT_ID: 'x', NAVER_CLIENT_SECRET: 'y', NAVER_API_KIND: 'openapi' }).trend, 'https://openapi.naver.com/v1/datalab/search');
});

test('Korean anti-slop detectors fire on AI-style sentences and spare earned ones', async () => {
  const { slopPhrases } = await import('../../scripts/lib/korean-style.mjs');
  const cats = (s) => slopPhrases(s).map((h) => h.cat);
  assert.ok(cats('이 서비스는 단순한 비교 사이트가 아니라 플랫폼입니다.').some((c) => c.startsWith('부정 병렬')));
  assert.ok(cats('수리비 공개는 소비자 보호에 중요한 역할을 합니다.').includes('부풀린 의미'));
  assert.ok(cats('핵심은 바로 원문 대조입니다.').includes('무대 세우기(staging)'));
  assert.ok(cats('결론적으로 직접 교체가 유리합니다.').includes('공식형 맺음'));
  assert.ok(cats('가장 합리적인 선택이라고 할 수 있습니다.').includes('빈 완충 표현'));
  assert.deepEqual(cats('집주인에게 그 비용을 돌려 달라고 할 수 있습니다.'), [], 'a legal right is not a hedge');
  assert.deepEqual(cats('카트리지만 바꾸면 부품 18,000원이 듭니다.'), []);
});

test('demand: missing terms weigh repeated questions; freshness counts recent posts', () => {
  const gaps = [{ q: 'a', count: 5, missing: ['쉭쉭', '소리'] }, { q: 'b', count: 2, missing: ['소리', '너트'] }, { q: 'c', count: 1, missing: ['너트', '너트'] }];
  assert.deepEqual(missingTerms(gaps, 2), [{ w: '소리', n: 7 }, { w: '쉭쉭', n: 5 }]);
  // 20261121 minus: 1 day, 30 days, 91 days; a malformed date is ignored
  assert.deepEqual(freshness(['20261120', '20261022', '20260822', ''], '20261121'), { n: 3, within: 2, days: 60, medianAge: 30 });
  assert.equal(freshness([], '20261121'), null);
});

test('demand: shopping-insight shares sum per group; shop pairs need a numeric category', () => {
  const rows = [{ period: '2026-09', group: 'm', ratio: 80 }, { period: '2026-10', group: 'm', ratio: 100 }, { period: '2026-09', group: 'f', ratio: 20 }, { period: '2026-10', group: 'f', ratio: 0 }];
  assert.deepEqual(groupShares(rows), { m: 90, f: 10 });
  assert.equal(groupShares([]), null);
  assert.deepEqual(parseShop('필밸브@50000008, 비데, 블라인드@가구'), [{ keyword: '필밸브', category: '50000008' }]);
});
