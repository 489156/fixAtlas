import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../../supabase/functions/_shared/app.ts';
import { MemDb, fakeAuth } from './memdb.ts';

const ALICE = 'alice-0000-0000-0000-000000000001';
const BOB = 'bob-00000-0000-0000-000000000002';
const ADMIN = 'admin-000-0000-0000-000000000003';
const MOD = 'mod-0000-0000-0000-0000000000004';

function setup() {
  const db = new MemDb();
  db.profiles.set(ALICE, { id: ALICE, nickname: 'a', country: '한국', role: 'user' });
  db.profiles.set(BOB, { id: BOB, nickname: 'b', country: '한국', role: 'user' });
  db.profiles.set(ADMIN, { id: ADMIN, nickname: 'root', country: '한국', role: 'admin' });
  db.profiles.set(MOD, { id: MOD, nickname: 'mod', country: '한국', role: 'moderator' });
  const app = createApp({ db, auth: fakeAuth, now: db.now });
  const call = async (method: string, path: string, opts: { token?: string; body?: unknown } = {}) => {
    const res = await app.request(path, {
      method,
      headers: { 'content-type': 'application/json', ...(opts.token ? { authorization: `Bearer user:${opts.token}` } : {}) },
      body: opts.body === undefined || method === 'GET' ? undefined : JSON.stringify(opts.body),
    });
    const text = await res.text();
    let json: any = null;
    try { json = text ? JSON.parse(text) : null; } catch { /* plain-text 404/405 from the router */ }
    return { status: res.status, json, text };
  };
  return { db, call };
}

const report = (o: Record<string, unknown> = {}) => ({
  product_id: 'prod-1', symptom_id: 'sym-1', country: '한국', repair_channel: 'official', currency: 'KRW', resolved_status: 'resolved',
  paid_price: 132000, quoted_price: 145000, privacy_consent: true, ...o,
});

test('search endpoint answers the RFP examples (was 0 results)', async () => {
  const { call } = setup();
  const r = await call('GET', `/search?q=${encodeURIComponent('로보락 S8 충전 안 됨')}`);
  assert.equal(r.status, 200);
  assert.deepEqual(r.json.products.map((p: { slug: string }) => p.slug), ['roborock-s8-pro-ultra']);
  assert.deepEqual(r.json.symptoms.map((s: { code: string }) => s.code), ['not_charging']);
});

test('gateway path shape /make-server-3e8c4785/* works too', async () => {
  const { call } = setup();
  assert.equal((await call('GET', '/make-server-3e8c4785/health')).json.status, 'ok');
});

test('PRIVACY: a public product payload contains no reporter id, receipt path or hidden flag', async () => {
  const { call, db } = setup();
  await call('POST', '/repair-reports', { token: ALICE, body: report({ receipt_path: `${ALICE}/r.png`, review_text: '좋았어요' }) });
  const prod = await call('GET', '/products/roborock-s8-pro-ultra');
  const recent = await call('GET', '/repair-reports');
  for (const res of [prod, recent]) {
    assert.equal(res.status, 200);
    assert.ok(!res.text.includes(ALICE), 'reporter id must not appear anywhere');
    assert.ok(!res.text.includes('receipt'), 'no receipt field or path');
    assert.ok(!/user_id|hidden|custom_product/.test(res.text));
  }
  assert.equal(db.reports[0].has_receipt, true);
  assert.equal(recent.json.reports[0].product_name, 'Roborock S8 Pro Ultra', 'names, not raw ids');
});

test('product page serves honest stats; accepts slug or id', async () => {
  const { call } = setup();
  for (const p of [132000, 70000, 150000]) await call('POST', '/repair-reports', { token: BOB, body: report({ paid_price: p }) });
  const bySlug = await call('GET', '/products/roborock-s8-pro-ultra');
  const byId = await call('GET', '/products/prod-1');
  assert.equal(bySlug.json.product.id, 'prod-1'); assert.equal(byId.json.product.slug, 'roborock-s8-pro-ultra');
  const s = bySlug.json.stats[0];
  assert.equal(s.n_reports, 3); assert.equal(s.price.min, 70000); assert.equal(s.price.median, null, 'n=3: no median yet');
  assert.ok(bySlug.json.self_check_cards.some((c: { safety_level: string }) => c.safety_level === 'do_not_diy'), 'safety card always present');
  assert.equal((await call('GET', '/products/nope')).status, 404);
});

test('POST /repair-reports: auth, validation, ids, and the completion summary', async () => {
  const { call } = setup();
  assert.equal((await call('POST', '/repair-reports', { body: report() })).status, 401);
  assert.equal((await call('POST', '/repair-reports', { token: ALICE, body: report({ privacy_consent: false }) })).status, 400);
  assert.equal((await call('POST', '/repair-reports', { token: ALICE, body: report({ product_id: 'ghost' }) })).status, 400);
  assert.equal((await call('POST', '/repair-reports', { token: ALICE, body: report({ symptom_id: 'ghost' }) })).status, 400);
  assert.equal((await call('POST', '/repair-reports', { token: ALICE, body: report({ receipt_path: `${BOB}/x.png` }) })).status, 400, 'cannot point at another user\'s receipt');
  for (const p of [100000, 110000, 120000, 130000, 140000]) await call('POST', '/repair-reports', { token: BOB, body: report({ paid_price: p }) });
  const ok = await call('POST', '/repair-reports', { token: ALICE, body: report({ paid_price: 150000 }) });
  assert.equal(ok.status, 201);
  assert.equal(ok.json.summary.similar_count, 5);
  assert.equal(ok.json.summary.position.band, 'above_range');
  assert.ok(!('user_id' in ok.json.report));
});

test('unlisted model: report is stored, NOT public until an admin maps it', async () => {
  const { call, db } = setup();
  const r = await call('POST', '/repair-reports', { token: ALICE, body: report({ product_id: '', custom_product: '로보락 S9 MaxV' }) });
  assert.equal(r.status, 201);
  assert.equal((await call('GET', '/repair-reports')).json.reports.length, 0);
  const id = db.reports[0].id;
  assert.equal((await call('PATCH', `/admin/reports/${id}`, { token: ALICE, body: { product_id: 'prod-1' } })).status, 403);
  assert.equal((await call('PATCH', `/admin/reports/${id}`, { token: ADMIN, body: { product_id: 'prod-1' } })).status, 200);
  assert.equal((await call('GET', '/repair-reports')).json.reports.length, 1, 'visible after mapping');
});

test('daily quota returns 429', async () => {
  const { call } = setup();
  for (let i = 0; i < 10; i++) assert.equal((await call('POST', '/repair-reports', { token: ALICE, body: report() })).status, 201);
  assert.equal((await call('POST', '/repair-reports', { token: ALICE, body: report() })).status, 429);
  assert.equal((await call('POST', '/repair-reports', { token: BOB, body: report() })).status, 201, 'quota is per user');
});

test('quote-check: refuses to guess with thin data, answers with enough', async () => {
  const { call } = setup();
  const thin = await call('GET', '/products/prod-1/quote-check?symptom_id=sym-1&currency=KRW&quote=300000');
  assert.equal(thin.status, 200); assert.equal(thin.json.sufficient, false); assert.equal(thin.json.band, null);
  for (const p of [80000, 90000, 100000, 110000, 120000, 130000]) await call('POST', '/repair-reports', { token: BOB, body: report({ paid_price: p }) });
  const q = await call('GET', '/products/prod-1/quote-check?symptom_id=sym-1&currency=KRW&quote=300000');
  assert.equal(q.json.sufficient, true); assert.equal(q.json.band, 'above_range');
  assert.equal((await call('GET', '/products/prod-1/quote-check?symptom_id=sym-1&currency=BTC&quote=1')).status, 400);
  assert.equal((await call('GET', '/products/prod-1/quote-check?symptom_id=sym-1&quote=abc')).status, 400);
});

test('ADMIN gating: anonymous 401, user 403, moderator ok for moderation but not for seed/products', async () => {
  const { call } = setup();
  for (const [m, p] of [['GET', '/admin/data'], ['GET', '/admin/metrics'], ['POST', '/admin/seed'], ['POST', '/admin/products'], ['PATCH', '/admin/posts/x']] as const) {
    assert.equal((await call(m, p)).status, 401, `${m} ${p} anon`);
    assert.equal((await call(m, p, { token: ALICE, body: {} })).status, 403, `${m} ${p} user`);
  }
  assert.equal((await call('GET', '/admin/data', { token: MOD })).status, 200);
  assert.equal((await call('GET', '/admin/metrics', { token: MOD })).status, 200);
  assert.equal((await call('POST', '/admin/seed', { token: MOD })).status, 403, 'seed is admin-only');
  assert.equal((await call('POST', '/admin/seed', { token: ADMIN })).status, 200);
});

test('no API path lets a user change their own role', async () => {
  const { call, db } = setup();
  for (const [m, p] of [['PATCH', `/admin/users/${ALICE}`], ['PUT', `/user`], ['PATCH', `/user`], ['POST', `/user`]] as const) {
    const r = await call(m, p, { token: ALICE, body: { role: 'admin' } });
    assert.ok([404, 405, 403, 401].includes(r.status), `${m} ${p} -> ${r.status}`);
  }
  assert.equal(db.profiles.get(ALICE)!.role, 'user');
});

test('receipts: staff get a 60s signed URL on demand; users and anon never do', async () => {
  const { call, db } = setup();
  await call('POST', '/repair-reports', { token: ALICE, body: report({ receipt_path: `${ALICE}/r.png` }) });
  const id = db.reports[0].id;
  assert.equal((await call('GET', `/admin/reports/${id}/receipt`)).status, 401);
  assert.equal((await call('GET', `/admin/reports/${id}/receipt`, { token: ALICE })).status, 403, 'even the owner goes through staff');
  const ok = await call('GET', `/admin/reports/${id}/receipt`, { token: MOD });
  assert.equal(ok.status, 200); assert.equal(ok.json.expires_in, 60); assert.match(ok.json.url, /exp=60/);
  assert.equal(ok.text.includes(ALICE), true, 'path is only visible to staff in the signed URL');
  await call('POST', '/repair-reports', { token: BOB, body: report() });
  assert.equal((await call('GET', `/admin/reports/${db.reports[1].id}/receipt`, { token: MOD })).status, 404);
});

test('admin can verify/reject; rejected reports vanish from public stats', async () => {
  const { call, db } = setup();
  await call('POST', '/repair-reports', { token: ALICE, body: report({ paid_price: 1000 }) });
  const id = db.reports[0].id;
  assert.equal((await call('PATCH', `/admin/reports/${id}`, { token: MOD, body: { verified_status: 'bogus' } })).status, 400);
  assert.equal((await call('PATCH', `/admin/reports/${id}`, { token: MOD, body: { verified_status: 'rejected' } })).status, 200);
  assert.equal((await call('GET', '/products/prod-1')).json.stats.length, 0);
  assert.equal((await call('PATCH', `/admin/reports/${id}`, { token: MOD, body: {} })).status, 400);
  assert.equal((await call('PATCH', `/admin/reports/nope`, { token: MOD, body: { hidden: true } })).status, 404);
});

test('community: validation, quotas, comment on hidden post blocked, helpful de-duplicated', async () => {
  const { call } = setup();
  assert.equal((await call('POST', '/community', { body: { type: 'question', title: 't', body: 'b' } })).status, 401);
  assert.equal((await call('POST', '/community', { token: ALICE, body: { type: 'spam', title: 't', body: 'b' } })).status, 400);
  const post = await call('POST', '/community', { token: ALICE, body: { type: 'question', title: '충전이 안돼요', body: '본문' } });
  assert.equal(post.status, 201); assert.ok(!('user_id' in post.json.post));
  const pid = post.json.post.id;
  const cm = await call('POST', '/comments', { token: BOB, body: { post_id: pid, body: '도크 접점 닦아보세요' } });
  assert.equal(cm.status, 201);
  const cid = cm.json.comment.id;
  await call('POST', `/comments/${cid}/helpful`, { token: ALICE });
  const again = await call('POST', `/comments/${cid}/helpful`, { token: ALICE });
  assert.equal(again.json.comment.helpful_count, 1, 'same user cannot vote twice');
  assert.equal((await call('POST', `/comments/${cid}/helpful`, { token: BOB })).json.comment.helpful_count, 2);
  assert.equal((await call('POST', '/comments/ghost/helpful', { token: BOB })).status, 404);
  assert.equal((await call('POST', '/comments', { token: BOB, body: { post_id: 'ghost', body: 'x' } })).status, 404);
  await call('PATCH', `/admin/posts/${pid}`, { token: MOD, body: { hidden: true } });
  assert.equal((await call('GET', `/community/${pid}`)).status, 404, 'hidden post not retrievable');
  assert.equal((await call('POST', '/comments', { token: BOB, body: { post_id: pid, body: 'late' } })).status, 404);
  const detail = await call('GET', '/community');
  assert.equal(detail.json.posts.length, 0);
});

test('events: anonymous, allow-listed, stored; admin metrics aggregate them', async () => {
  const { call, db } = setup();
  const s = 'session-abcdef123456';
  const r = await call('POST', '/events', { body: { session_id: s, events: [
    { name: 'search_zero_result', path: '/search', props: { q: '드리미 X40' } },
    { name: 'search_zero_result', path: '/search', props: { q: '드리미 x40 ' } },
    { name: 'drop_table', props: {} },
  ] } });
  assert.equal(r.status, 200); assert.equal(r.json.accepted, 2);
  assert.equal(db.events.length, 2);
  assert.equal((await call('POST', '/events', { body: { session_id: 'x', events: [] } })).status, 400);
  const m = await call('GET', '/admin/metrics', { token: MOD });
  assert.deepEqual(m.json.top_zero_result_queries, [{ q: '드리미 x40', n: 2 }]);
});

test('errors never leak internals', async () => {
  const { db, call } = setup();
  db.listProducts = async () => { throw new Error('connection string postgres://secret'); };
  const r = await call('GET', '/products');
  assert.equal(r.status, 500); assert.ok(!r.text.includes('secret'));
});

test('admin product creation is validated and makes the product searchable', async () => {
  const { call } = setup();
  assert.equal((await call('POST', '/admin/products', { token: ADMIN, body: { id: 'x' } })).status, 400);
  const ok = await call('POST', '/admin/products', { token: ADMIN, body: { id: 'prod-99', slug: 'dreame-x40-ultra', category: 'robot-vacuum', brand: 'Dreame', brand_ko: '드리미', model_name: 'X40 Ultra', alternate_names: ['X40'], release_year: 2024 } });
  assert.equal(ok.status, 201);
  const s = await call('GET', `/search?q=${encodeURIComponent('드리미 X40')}`);
  assert.deepEqual(s.json.products.map((p: { id: string }) => p.id), ['prod-99']);
});

test('campaign attribution: blog-tagged events are aggregated per post for staff only', async () => {
  const { call } = setup();
  const blog = { src: 'naver_blog', cmp: '2026-11-battery-price' };
  await call('POST', '/events', { body: { session_id: 'session-blog-000001', events: [
    { name: 'page_view', props: blog }, { name: 'quote_check', props: blog }, { name: 'submit_done', props: blog },
  ] } });
  await call('POST', '/events', { body: { session_id: 'session-blog-000002', events: [{ name: 'page_view', props: blog }] } });
  await call('POST', '/events', { body: { session_id: 'session-organic-0001', events: [{ name: 'page_view', props: {} }] } });
  assert.equal((await call('GET', '/admin/metrics', { token: ALICE })).status, 403);
  const m = await call('GET', '/admin/metrics', { token: MOD });
  assert.deepEqual(m.json.campaigns, [{ src: 'naver_blog', cmp: '2026-11-battery-price', sessions: 2, quote_checks: 1, submits: 1 }]);
});
