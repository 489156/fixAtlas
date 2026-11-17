import test from 'node:test';
import assert from 'node:assert/strict';
import { calculate } from '../../src/lib/repairVsReplace.ts';

const NOW = new Date('2026-11-17T00:00:00Z');
const base = { newPrice: 850000, repairCost: 180000, purchaseYear: 2022, failurePart: 'battery' as const };

test('RFP thresholds: <=25% repair, <=50% conditional, >50% replace', () => {
  const v = (repairCost: number) => { const r = calculate({ ...base, repairCost, purchaseYear: 2025, failurePart: 'other' }, NOW); assert.ok(r.ok); return r.ok ? r.verdict : null; };
  assert.equal(v(212500), 'repair');       // exactly 25%
  assert.equal(v(212501), 'conditional');
  assert.equal(v(425000), 'conditional');  // exactly 50%
  assert.equal(v(425001), 'replace');
});

test('RFP example 850,000 / 180,000: 21% -> repair, but 4-year-old battery job tips to conditional', () => {
  const r = calculate(base, NOW);
  assert.ok(r.ok);
  if (r.ok) { assert.equal(r.ratio, 21); assert.equal(r.verdict, 'conditional'); assert.match(r.factors.join(' '), /4년/); }
});

test('consumable failure softens a replace verdict; new product points to warranty', () => {
  const r = calculate({ newPrice: 850000, repairCost: 600000, purchaseYear: 2026, failurePart: 'consumable' }, NOW);
  assert.ok(r.ok); if (r.ok) { assert.equal(r.verdict, 'conditional'); assert.match(r.factors.join(' '), /소모품/); assert.match(r.factors.join(' '), /보증/); }
});

test('REGRESSION: new price 1 won / repair 500,000 no longer prints "50000000%"; negatives and NaN are rejected', () => {
  assert.equal(calculate({ ...base, newPrice: 1 }, NOW).ok, true);
  const huge = calculate({ ...base, newPrice: 1, repairCost: 500000 }, NOW);
  assert.ok(huge.ok); if (huge.ok) assert.equal(huge.ratioDisplay, '999% 초과');
  for (const bad of [{ repairCost: -100000 }, { newPrice: 0 }, { newPrice: NaN }, { repairCost: Infinity }, { purchaseYear: 1999 }, { purchaseYear: 2027 }, { usedPrice: -1 }]) {
    const r = calculate({ ...base, ...bad }, NOW);
    assert.equal(r.ok, false, JSON.stringify(bad));
  }
  assert.equal(calculate({}, NOW).ok, false);
});

test('used price and usage context add factors without changing the ratio rule', () => {
  const r = calculate({ ...base, purchaseYear: 2024, failurePart: 'other', usedPrice: 200000, repairCost: 180000, usage: 'rarely' }, NOW);
  assert.ok(r.ok);
  if (r.ok) { assert.match(r.factors.join(' '), /중고 시세의 80%/); assert.equal(r.verdict, 'repair'); assert.ok(r.nextSteps.length >= 3); }
});
