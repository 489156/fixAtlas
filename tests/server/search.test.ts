import test from 'node:test';
import assert from 'node:assert/strict';
import { searchCatalog, normalize } from '../../supabase/functions/_shared/search.ts';
import { PRODUCTS, SYMPTOMS } from '../../supabase/functions/_shared/seed.ts';
import type { Product, Symptom } from '../../supabase/functions/_shared/types.ts';

const products = PRODUCTS.map((p) => ({ ...p, alternate_names: [...p.alternate_names], image_url: '' })) as Product[];
const symptoms = SYMPTOMS.map((s) => ({ ...s, synonyms: [...s.synonyms], categories: [...s.categories] })) as Symptom[];
const names = (q: string) => searchCatalog(q, products, symptoms).products.map((h) => `${h.product.brand} ${h.product.model_name}`);
const symptomCodes = (q: string) => searchCatalog(q, products, symptoms).symptoms.map((s) => s.code);

test('normalize splits Hangul/Latin boundaries and keeps model plus-signs', () => {
  assert.equal(normalize('로보락S8'), '로보락 s8');
  assert.equal(normalize('Roomba J7+'), 'roomba j7+');
});

// RFP 5.2 search examples. All returned ZERO results before the rewrite.
test('RFP example: 로보락 S8 충전 안 됨', () => {
  assert.deepEqual(names('로보락 S8 충전 안 됨'), ['Roborock S8 Pro Ultra']);
  assert.deepEqual(symptomCodes('로보락 S8 충전 안 됨'), ['not_charging']);
});
test('RFP example: 드리미 L10s 도크 오류', () => {
  assert.deepEqual(names('드리미 L10s 도크 오류'), ['Dreame L10s Ultra']);
  assert.deepEqual(symptomCodes('드리미 L10s 도크 오류'), ['dock_error']);
});
test('RFP example: 다이슨 V10 흡입력 약함', () => {
  assert.deepEqual(names('다이슨 V10 흡입력 약함'), ['Dyson V10']);
  assert.deepEqual(symptomCodes('다이슨 V10 흡입력 약함'), ['weak_suction']);
});
test('RFP example: Roborock not charging', () => {
  const r = names('Roborock not charging');
  assert.ok(r.includes('Roborock S8 Pro Ultra') && r.includes('Roborock Q Revo'));
  assert.ok(r.every((n) => n.startsWith('Roborock')), 'no other brand');
  assert.deepEqual(symptomCodes('Roborock not charging'), ['not_charging']);
});
test('RFP example: Dyson weak suction', () => {
  assert.ok(names('Dyson weak suction').every((n) => n.startsWith('Dyson')));
  assert.deepEqual(symptomCodes('Dyson weak suction'), ['weak_suction']);
});

test('Korean brand only / brand + category / model only / typed prefix', () => {
  assert.ok(names('로보락').length >= 3 && names('로보락').every((n) => n.startsWith('Roborock')));
  assert.deepEqual(names('삼성 로봇청소기'), ['Samsung Jet Bot AI+']);
  assert.deepEqual(names('삼성 제트'), ['Samsung Bespoke Jet', 'Samsung Jet Bot AI+']);
  assert.deepEqual(names('S8'), ['Roborock S8 Pro Ultra']);
  assert.deepEqual(names('v10'), ['Dyson V10']);
  assert.ok(names('dys').every((n) => n.startsWith('Dyson')), 'prefix of a brand works');
  assert.deepEqual(names('룸바 j7'), ['iRobot Roomba j7+']);
});

test('unspaced Korean symptom phrases and colloquial forms are understood', () => {
  assert.deepEqual(symptomCodes('로보락 충전이 안돼요'), ['not_charging']);
  assert.deepEqual(symptomCodes('흡입력이 약해요'), ['weak_suction']);
  assert.deepEqual(symptomCodes('다이슨 배터리 교체'), ['battery_drain']);
  assert.deepEqual(symptomCodes('로봇청소기 물이 새요'), ['water_leak']);
});

test('symptom-only query offers products instead of a dead end', () => {
  const r = searchCatalog('충전 안 됨', products, symptoms);
  assert.equal(r.reason, 'symptom_only');
  assert.ok(r.products.length >= 10);
  const dock = searchCatalog('도크 오류', products, symptoms);
  assert.ok(dock.products.every((h) => h.product.category === 'robot-vacuum'), 'robot-only symptom -> robot products only');
});

test('unknown model of a known brand falls back to the brand and reports the unmatched model', () => {
  const r = searchCatalog('다이슨 V7 충전', products, symptoms);
  assert.equal(r.reason, 'brand_fallback');
  assert.deepEqual(r.parsed.unmatched_models, ['v7']);
  assert.ok(r.products.length >= 4 && r.products.every((h) => h.product.brand === 'Dyson'));
});

test('empty and noise-only queries return nothing, with a reason', () => {
  assert.equal(searchCatalog('   ', products, symptoms).reason, 'empty_query');
  const noise = searchCatalog('수리비', products, symptoms);
  assert.equal(noise.products.length, 0);
});

test('gibberish matches nothing', () => {
  const r = searchCatalog('zzzzqq', products, symptoms);
  assert.equal(r.products.length, 0);
  assert.equal(r.reason, 'no_match');
});

test('error-code style query is parsed without crashing', () => {
  const r = searchCatalog('로보락 Error 13', products, symptoms);
  assert.deepEqual(r.symptoms.map((s) => s.code), ['error_code']);
  assert.deepEqual(r.parsed.error_code_tokens, ['13']);
  assert.ok(r.products.every((h) => h.product.brand === 'Roborock'));
});
