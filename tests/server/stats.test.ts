import test from 'node:test';
import assert from 'node:assert/strict';
import { quantile, summarize, symptomStats, quoteCheck, percentileRank, pricedValue, levelFor } from '../../supabase/functions/_shared/stats.ts';
import type { PublicReport } from '../../supabase/functions/_shared/types.ts';

let seq = 0;
const rep = (o: Partial<PublicReport>): PublicReport => ({
  id: `r${++seq}`, product_id: 'prod-1', symptom_id: 'sym-1', country: '한국', city: '', repair_channel: 'official',
  quoted_price: null, paid_price: 100000, currency: 'KRW', repair_item: '', resolved_status: 'resolved', review_text: '',
  verified_status: 'reported', purchase_year: null, error_code: '', created_at: '2026-01-01T00:00:00Z', ...o,
});

test('quantile matches the linear-interpolation definition', () => {
  assert.equal(quantile([1, 2, 3, 4, 5], 0.5), 3);
  assert.equal(quantile([10, 20, 30, 40], 0.25), 17.5);
  assert.equal(quantile([7], 0.9), 7);
  assert.ok(Number.isNaN(quantile([], 0.5)));
});

test('sample-size levels refuse false precision', () => {
  assert.deepEqual([0, 2, 3, 4, 5, 9, 10].map(levelFor), ['none', 'none', 'low', 'low', 'ok', 'ok', 'good']);
  const none = summarize([100000, 130000]);
  assert.equal(none.min, null, 'n=2: no range at all');
  const low = summarize([100000, 130000, 150000]);
  assert.equal(low.min, 100000); assert.equal(low.median, null, 'n=3-4: range only, no median/quartiles');
  const ok = summarize([100, 120, 130, 150, 400]);
  assert.equal(ok.median, 130); assert.equal(ok.p25, 120); assert.equal(ok.p75, 150);
});

test('0 is a price only for self-fix; null (unknown) is never a price', () => {
  assert.equal(pricedValue({ paid_price: 0, repair_channel: 'self_check' }), 0);
  assert.equal(pricedValue({ paid_price: 0, repair_channel: 'official' }), null);
  assert.equal(pricedValue({ paid_price: null, repair_channel: 'self_check' }), null);
  assert.equal(pricedValue({ paid_price: 90000, repair_channel: 'official' }), 90000);
});

test('REGRESSION: currencies are never mixed and rejected reports are ignored (old UI showed "1 ~ 132,000 원")', () => {
  const rows = [
    rep({ paid_price: 132000 }), rep({ paid_price: 70000 }), rep({ paid_price: 150000 }),
    rep({ paid_price: 150, currency: 'USD' }),
    rep({ paid_price: 1, verified_status: 'rejected' }),
  ];
  const stats = symptomStats(rows);
  const krw = stats.find((s) => s.currency === 'KRW')!;
  const usd = stats.find((s) => s.currency === 'USD')!;
  assert.equal(krw.n_reports, 3, 'rejected excluded');
  assert.equal(krw.price.min, 70000); assert.equal(krw.price.max, 150000);
  assert.equal(usd.n_reports, 1); assert.equal(usd.price.min, null, 'n=1 -> no range shown');
});

test('resolve rate only appears from n>=5 and counts recurrences separately', () => {
  const few = symptomStats([rep({}), rep({}), rep({})])[0];
  assert.equal(few.resolved_rate, null, 'n=3 -> no rate (old UI printed 100%)');
  const many = symptomStats([
    rep({}), rep({}), rep({}), rep({ resolved_status: 'unresolved' }), rep({ resolved_status: 'recurred' }),
  ])[0];
  assert.equal(many.resolved_rate, 60); assert.equal(many.recurred_rate, 20);
});

test('channel breakdown needs >=3 priced reports per channel for a median', () => {
  const rows = [
    ...[90000, 100000, 110000].map((p) => rep({ paid_price: p, repair_channel: 'official' })),
    ...[40000, 50000].map((p) => rep({ paid_price: p, repair_channel: 'third_party' })),
  ];
  const s = symptomStats(rows)[0];
  assert.equal(s.by_channel.find((c) => c.channel === 'official')!.median, 100000);
  assert.equal(s.by_channel.find((c) => c.channel === 'third_party')!.median, null);
});

test('percentileRank uses mid-rank for ties', () => {
  assert.equal(percentileRank(30, [10, 20, 30, 40, 50]), 50);
  assert.equal(percentileRank(5, [10, 20]), 0);
  assert.equal(percentileRank(99, [10, 20]), 100);
});

test('quoteCheck: insufficient data says so instead of guessing', () => {
  const r = quoteCheck([rep({}), rep({})], { symptom_id: 'sym-1', currency: 'KRW', quote: 500000 });
  assert.equal(r.sufficient, false); assert.equal(r.band, null); assert.equal(r.percentile, null);
  assert.match(r.message, /최소 5건/);
});

test('quoteCheck: bands relative to the same model+symptom+currency distribution', () => {
  const rows = [80000, 90000, 100000, 110000, 120000, 130000, 140000, 150000].map((p) => rep({ paid_price: p }));
  rows.push(rep({ paid_price: 999999, currency: 'USD' }), rep({ symptom_id: 'sym-2', paid_price: 1 }));
  const band = (quote: number) => quoteCheck(rows, { symptom_id: 'sym-1', currency: 'KRW', quote });
  assert.equal(band(50000).band, 'below_range');
  assert.equal(band(85000).band, 'low');
  assert.equal(band(115000).band, 'typical');
  assert.equal(band(145000).band, 'high');
  assert.equal(band(400000).band, 'above_range');
  assert.equal(band(400000).n, 8, 'other currency / other symptom excluded');
  assert.match(band(400000).message, /다른 견적/);
});
