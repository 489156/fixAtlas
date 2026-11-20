import test from 'node:test';
import assert from 'node:assert/strict';
import { matchClaim, robotsAllows, robotsVerdict } from '../../scripts/verify-sources.mjs';

const PAGE = '당사의 출장비(출장점검료)는 거리에 상관없이 동일하게 28,000 원 청구됩니다. 센서 기능 하자가 24.9 %(42건). 일반제품 1년 청소기';

test('numbers match with or without commas and with a split unit', () => {
  assert.deepEqual(matchClaim({ value: '28,000원', note: '' }, PAGE), []);
  assert.deepEqual(matchClaim({ value: '24.9% / 42건', note: '' }, PAGE), []);
  assert.deepEqual(matchClaim({ value: '1년', note: '' }, PAGE), []);
});

test('missing numbers and quotes are reported; a short bare number is not matched loosely', () => {
  assert.deepEqual(matchClaim({ value: '33,000원', note: '' }, PAGE), ['33,000원']);
  assert.deepEqual(matchClaim({ value: '10년', note: '' }, PAGE), ['10년']);
  assert.deepEqual(matchClaim({ value: '28,000원', note: '', quote: '거리에 상관없이 동일하게' }, PAGE), []);
  assert.deepEqual(matchClaim({ value: '28,000원', note: '', quote: '수리 여부와 상관없이' }, PAGE), ['"수리 여부와 상관없이"']);
});

test('derived numbers (note "계산:") are not expected on the page', () => {
  assert.deepEqual(matchClaim({ value: '5,000원', note: '계산: 33,000-28,000' }, PAGE), []);
});

test('image-only rows skip number matching but still require the anchor quote', () => {
  assert.deepEqual(matchClaim({ value: '11.8%', note: '이미지: 하자 유형 그래프', quote: '센서 기능 하자가' }, '센서 기능 하자가 24.9%'), []);
  assert.deepEqual(matchClaim({ value: '11.8%', note: '이미지: 하자 유형 그래프', quote: '없는 문구' }, '센서 기능 하자가 24.9%'), ['"없는 문구"']);
});

test('robotsAllows: only the generic "*" group applies; longest match wins; Allow wins ties', () => {
  // a shop that closes everything to generic agents but opens paths to named bots (2026-11-20 miwhole.co.kr shape)
  const closed = 'User-agent: *\nDisallow: /\n\nUser-agent: Googlebot\nUser-agent: Yeti\nDisallow: /admin/\n';
  assert.equal(robotsAllows(closed, '/goods/goods_view.php?goodsNo=1000000030'), false);
  assert.equal(robotsAllows('User-agent: *\nDisallow: /*?q=\n', '/shop/product/0000090680'), true);
  assert.equal(robotsAllows('User-agent: *\nDisallow: /*?q=\n', '/search?q=battery'), false);
  assert.equal(robotsAllows('User-agent: *\nDisallow: /a\nAllow: /a/b\n', '/a/b/c'), true);
  assert.equal(robotsAllows('User-agent: *\nDisallow: /*.pdf$\n', '/x/guide.pdf'), false);
  assert.equal(robotsAllows('User-agent: *\nDisallow: /*.pdf$\n', '/x/guide.pdf?v=2'), true);
  assert.equal(robotsAllows('User-agent: Googlebot\nDisallow: /\n', '/anything'), true); // no "*" group: open
  assert.equal(robotsAllows('', '/'), true);
  assert.equal(robotsAllows('User-agent: *\nDisallow:\n', '/x'), true); // empty Disallow allows all
});

test('robotsVerdict: a firewall block or bot-challenge page served as robots.txt closes the site', () => {
  // 2026-11-20 service.daelimbath.com: HTTP 200 with an HTML "접근 차단 안내" page instead of rules
  const block = '<!DOCTYPE html>\n<html lang="ko"><head><title>접근 차단 안내</title></head><body>…</body></html>';
  assert.equal(robotsVerdict(200, block), null);
  assert.equal(robotsVerdict(200, '<html><body>Please enable JavaScript and cookies to continue</body></html>'), null);
  // a homepage served for every path is not a block: no rules
  assert.equal(robotsVerdict(200, '<!doctype html><html><head><title>LIXIL Korea</title></head></html>'), '');
  assert.equal(robotsVerdict(200, 'User-agent: *\nDisallow: /admin/\n'), 'User-agent: *\nDisallow: /admin/\n');
  assert.equal(robotsVerdict(404, 'not found'), '');
  assert.equal(robotsVerdict(403, ''), null);
  assert.equal(robotsVerdict(401, ''), null);
  assert.equal(robotsVerdict(503, ''), null);
});
