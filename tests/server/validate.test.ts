import test from 'node:test';
import assert from 'node:assert/strict';
import { parseReport, parsePost, parseComment, parseEvents } from '../../supabase/functions/_shared/validate.ts';

const UID = '11111111-1111-1111-1111-111111111111';
const good = () => ({
  product_id: 'prod-1', symptom_id: 'sym-1', country: '한국', city: '서울', repair_channel: 'official',
  quoted_price: 145000, paid_price: 132000, currency: 'KRW', repair_item: '배터리 점검', resolved_status: 'resolved',
  review_text: '후기', purchase_year: 2024, error_code: 'Error 13', privacy_consent: true,
});
const NOW = new Date('2026-11-17T00:00:00Z');

test('a complete valid report is accepted and normalised', () => {
  const r = parseReport(good(), UID, NOW);
  assert.equal(r.ok, true);
  if (r.ok) { assert.equal(r.value.paid_price, 132000); assert.equal(r.value.purchase_year, 2024); assert.equal(r.value.receipt_path, ''); }
});

test('consent is mandatory (RFP 5.4) and must be literally true', () => {
  for (const v of [undefined, false, 'true', 1]) {
    const r = parseReport({ ...good(), privacy_consent: v }, UID, NOW);
    assert.equal(r.ok, false);
  }
});

test('prices: blank = unknown (null), negative / absurd / NaN rejected, tiny KRW rejected', () => {
  const ok = parseReport({ ...good(), quoted_price: '', paid_price: null }, UID, NOW);
  assert.equal(ok.ok, true); if (ok.ok) { assert.equal(ok.value.quoted_price, null); assert.equal(ok.value.paid_price, null); }
  for (const bad of [-1, 5e12, 'abc', Infinity]) assert.equal(parseReport({ ...good(), paid_price: bad }, UID, NOW).ok, false, String(bad));
  const tiny = parseReport({ ...good(), paid_price: 13 }, UID, NOW);
  assert.equal(tiny.ok, false); if (!tiny.ok) assert.match(tiny.errors.join(' '), /원 단위/);
  assert.equal(parseReport({ ...good(), paid_price: 13, currency: 'USD' }, UID, NOW).ok, true, 'small amounts are fine in USD');
  assert.equal(parseReport({ ...good(), paid_price: 0, repair_channel: 'self_check' }, UID, NOW).ok, true, '0 won self-fix is valid');
});

test('enums, lengths and years are enforced', () => {
  for (const patch of [{ repair_channel: 'hacker' }, { resolved_status: 'x' }, { currency: 'BTC' }, { country: 'Mars' },
    { review_text: 'a'.repeat(2001) }, { purchase_year: 1990 }, { purchase_year: 2027 }, { error_code: 'x'.repeat(51) }]) {
    assert.equal(parseReport({ ...good(), ...patch }, UID, NOW).ok, false, JSON.stringify(patch));
  }
});

test('product: either an id or a free-text request; neither is rejected', () => {
  assert.equal(parseReport({ ...good(), product_id: '', custom_product: '' }, UID, NOW).ok, false);
  const custom = parseReport({ ...good(), product_id: '', custom_product: '로보락 S9 MaxV' }, UID, NOW);
  assert.equal(custom.ok, true); if (custom.ok) { assert.equal(custom.value.product_id, null); assert.equal(custom.value.custom_product, '로보락 S9 MaxV'); }
});

test('receipt path must be inside the caller\'s own folder (no cross-user, no traversal)', () => {
  assert.equal(parseReport({ ...good(), receipt_path: `${UID}/a.png` }, UID, NOW).ok, true);
  const other = '22222222-2222-2222-2222-222222222222';
  for (const p of [`${other}/a.png`, `${UID}/../${other}/a.png`, 'a.png', `${UID}//a.png`]) {
    assert.equal(parseReport({ ...good(), receipt_path: p }, UID, NOW).ok, false, p);
  }
});

test('non-object payloads are rejected, never thrown', () => {
  for (const v of [null, undefined, 'x', 42, []]) assert.equal(parseReport(v, UID, NOW).ok, false);
  assert.equal(parsePost(null).ok, false); assert.equal(parseComment([]).ok, false);
});

test('posts and comments: enums + length', () => {
  assert.equal(parsePost({ type: 'question', title: 't', body: 'b' }).ok, true);
  assert.equal(parsePost({ type: 'spam', title: 't', body: 'b' }).ok, false);
  assert.equal(parsePost({ type: 'question', title: '', body: 'b' }).ok, false);
  assert.equal(parsePost({ type: 'question', title: 't', body: 'b', status: 'weird' }).ok, false);
  assert.equal(parseComment({ post_id: 'abc', body: 'hi' }).ok, true);
  assert.equal(parseComment({ post_id: 'abc', body: 'x'.repeat(2001) }).ok, false);
});

test('events: allow-listed names, primitive props only, bounded, bad sessions dropped', () => {
  assert.equal(parseEvents({ session_id: 'bad id!', events: [] }), null);
  assert.equal(parseEvents({ events: [] }), null);
  const parsed = parseEvents({
    session_id: 'abcdefgh12345678',
    events: [
      { name: 'search', path: '/search', props: { q: '로보락', n: 3, ok: true, nested: { a: 1 }, 'Bad Key': 'x' } },
      { name: 'drop_database', props: {} },
      { name: 'page_view', path: 'p'.repeat(500) },
    ],
  })!;
  assert.equal(parsed.events.length, 2);
  assert.deepEqual(parsed.events[0].props, { q: '로보락', n: 3, ok: true });
  assert.equal(parsed.events[1].path.length, 200);
  const many = parseEvents({ session_id: 'abcdefgh12345678', events: Array.from({ length: 100 }, () => ({ name: 'page_view' })) })!;
  assert.equal(many.events.length, 20, 'batch size capped');
});
