import test from 'node:test';
import assert from 'node:assert/strict';
import { matchClaim } from '../../scripts/verify-sources.mjs';

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
