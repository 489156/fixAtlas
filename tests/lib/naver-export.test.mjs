import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { exportPost, mdToHtml, resolveSite, unsourcedCardNumbers } from '../../scripts/naver-export.mjs';
import { checkDraft, crossPostDuplicates, crossPostNearDuplicates } from '../../scripts/check-claims.mjs';

const SITE = 'https://fixatlas.kr';
const post = (body, extraClaims = []) => `---
slug: 2026-11-test
title: 테스트 글입니다
tags: 가, 나, 다
reader: 테스트 독자
need: 테스트
queries: 테스트
firsthand: 2026-11-18 테스트
claims:
  - 28,000원 | https://www.lge.co.kr/support/visit-center-reservation?seq=182 | 2026-11-17 | 평일
  - 5건 | site:/methodology | 2026-11-18 | 공개 기준
${extraClaims.map((c) => `  - ${c}`).join('\n')}
---
# 테스트 글입니다
${body}`;

test('site:/ links resolve to the origin with UTM tags; placement comes from the fragment', () => {
  const u = new URL(resolveSite('site:/submit-repair?product=x#cta-bottom', { origin: SITE, slug: 's1' }));
  assert.equal(u.origin + u.pathname, `${SITE}/submit-repair`);
  assert.equal(u.searchParams.get('product'), 'x');
  assert.equal(u.searchParams.get('utm_source'), 'naver_blog');
  assert.equal(u.searchParams.get('utm_campaign'), 's1');
  assert.equal(u.searchParams.get('utm_content'), 'cta-bottom');
  assert.equal(resolveSite('site:/methodology', { origin: SITE, slug: 's1', utm: false }), `${SITE}/methodology`);
  assert.equal(resolveSite('https://a.example/x', { origin: SITE, slug: 's1' }), 'https://a.example/x');
});

test('markdown subset converts to HTML; the title line is left for the title field', () => {
  const ctx = { origin: SITE, slug: 's', links: [], images: [], photos: [], tables: [] };
  const html = mdToHtml('# 제목\n## 소제목\n본문 **굵게** [링크](site:/a#b)\n\n> 인용 1\n> 인용 2\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n- 하나\n- 둘\n\n![카드](../cards/x.png)\n![사진](photo:찍을 것)\n<!-- 메모 -->', ctx);
  assert.doesNotMatch(html, /<h1>|>제목</);
  assert.match(html, /<h2>소제목<\/h2>/);
  assert.match(html, /<strong>굵게<\/strong>/);
  assert.match(html, /<blockquote>인용 1<br>인용 2<\/blockquote>/);
  assert.match(html, /<table><thead><tr><th>a<\/th><th>b<\/th><\/tr><\/thead><tbody><tr><td>1<\/td><td>2<\/td><\/tr><\/tbody><\/table>/);
  assert.match(html, /<ul><li>하나<\/li><li>둘<\/li><\/ul>/);
  assert.match(html, /<img src="s-x.png"/); // slug-prefixed: two posts may capture the same source page
  assert.doesNotMatch(html, /메모/);
  assert.deepEqual([ctx.images, ctx.photos, ctx.tables, ctx.links.length], [['../cards/x.png'], ['사진'], [2], 1]);
});

test('export refuses a missing or placeholder domain unless previewing', () => {
  const text = post('평일 28,000원.');
  assert.throws(() => exportPost(text, { origin: '', today: '2026-11-18' }), /SITE_URL/);
  assert.throws(() => exportPost(text, { origin: 'https://fixatlas.example', today: '2026-11-18' }), /임시 도메인/);
  assert.equal(exportPost(text, { origin: 'https://fixatlas.example', preview: true, today: '2026-11-18' }).slug, '2026-11-test');
});

test('export refuses a post that fails the claim check', () => {
  assert.throws(() => exportPost(post('평일 28,000원, 야간 33,000원.'), { origin: SITE, today: '2026-11-18' }), /33,000원/);
});

test('numbers on card images must be in the ledger (image/text drift)', () => {
  const cards = [{ id: 'c1', rows: [['평일', '28,000원'], ['야간', '33,000원']], asof: '2026.11.17 확인' }];
  const claims = [{ value: '28,000원' }];
  assert.deepEqual(unsourcedCardNumbers(['../cards/c1.png'], cards, claims), ['c1: "33,000원"']);
  assert.throws(() => exportPost(post('![요약](../cards/c1.png)\n평일 28,000원.'), { origin: SITE, today: '2026-11-18', cards }), /33,000원/);
});

test('layout warnings: more than 2 report CTAs, wide tables, too few images', () => {
  const body = ['[제보](site:/submit-repair#a)', '[제보](site:/submit-repair#b)', '[제보](site:/submit-repair#c)', '', '| a | b | c | d |', '|---|---|---|---|', '| 1 | 2 | 3 | 4 |'].join('\n');
  const r = exportPost(post(body), { origin: SITE, today: '2026-11-18' });
  assert.equal(r.ctas, 3);
  assert.ok(r.warnings.some((w) => /CTA 3개/.test(w)));
  assert.ok(r.warnings.some((w) => /표 열 4개/.test(w)));
  assert.ok(r.warnings.some((w) => /이미지 0장/.test(w)));
});

test('week-1 posts: every machine check passes; only the editor\'s in-person items remain open', () => {
  const files = ['01-battery-price', '02-lg-visit-fee', '03-robot-defects'].map((f) => `docs/blog/naver/${f}.md`);
  const texts = files.map((f) => fs.readFileSync(f, 'utf8'));
  assert.deepEqual(crossPostDuplicates(texts), [], 'no sentence or heading copied across posts');
  assert.deepEqual(crossPostNearDuplicates(texts), [], 'no near-copied sentence across posts');
  const cards = JSON.parse(fs.readFileSync('docs/blog/cards/cards.json', 'utf8'));
  texts.forEach((text, i) => {
    const types = new Set(checkDraft(text, { today: '2026-11-18' }).problems.map((p) => p.type));
    assert.deepEqual([...types].sort(), ['human_slot', 'no_firsthand'], files[i]);
    // preview export works and raises no layout warnings
    const r = exportPost(text, { origin: SITE, preview: true, today: '2026-11-18', cards });
    assert.deepEqual(r.warnings, [], `${files[i]}: ${r.warnings.join(', ')}`);
    assert.equal(r.ctas, 1, files[i]);
    // first image = evidence-backed thumbnail card; the rest are official-page captures
    const thumbId = r.images[0].split('/').pop().replace('.png', '');
    assert.equal(cards.find((c) => c.id === thumbId)?.kind, 'thumb', `${files[i]} starts with a thumbnail`);
    assert.ok(r.images.length >= 3 && r.images.slice(1).every((img) => img.includes('/evidence/')), `${files[i]} uses source captures`);
    assert.ok(r.images.every((img) => fs.existsSync(new URL(img, `file://${process.cwd()}/${files[i]}`).pathname)), `${files[i]} images exist`);
    // publishing for real is refused until the editor fills the slots
    assert.throws(() => exportPost(text, { origin: SITE, today: '2026-11-18' }), /직접 확인|firsthand/);
  });
});
