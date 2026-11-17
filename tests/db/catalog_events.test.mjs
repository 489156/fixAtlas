// Real-Postgres test for the catalog/content + report-fields/events/KPI migrations.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MIG = path.join(HERE, '../../supabase/migrations');
const skip = !process.env.PG_NODE_MODULES && 'set PG_NODE_MODULES to run DB tests';
const ALICE = '11111111-1111-1111-1111-111111111111';

test('catalog, report fields, events and KPI functions (real Postgres)', { skip }, async (t) => {
  const { boot, runFile, as, tryQ } = await import('./harness.mjs');
  const { client, stop } = await boot(Number(process.env.PG_PORT2 || 54332));
  t.after(stop);
  await runFile(client, path.join(HERE, 'supabase_stub.sql'));

  const all = fs.readdirSync(MIG).filter((f) => f.endsWith('.sql')).sort();
  // Legacy rows exist BEFORE the new migrations run (backfill paths are exercised)
  for (const f of all.slice(0, 3)) await client.query(fs.readFileSync(path.join(MIG, f), 'utf8'));
  await client.query(`INSERT INTO auth.users(id,email) VALUES ($1,'a@example.com')`, [ALICE]);
  await client.query(`INSERT INTO products(id,category,brand,model_name,release_year) VALUES ('prod-1','robot-vacuum','Roborock','S8 Pro Ultra',2023)`);
  await client.query(`INSERT INTO symptoms(id,code,name_ko,name_en,risk_level) VALUES ('sym-1','not_charging','충전 안 됨','Not charging','caution')`);
  for (const f of all.slice(3)) await client.query(fs.readFileSync(path.join(MIG, f), 'utf8'));

  await t.test('legacy product got a slug; slugs are unique', async () => {
    const r = await client.query(`SELECT slug FROM products WHERE id='prod-1'`);
    assert.equal(r.rows[0].slug, 'roborock-s8-pro-ultra');
    const dup = await tryQ((q, p) => client.query(q, p), `INSERT INTO products(id,category,brand,model_name,release_year,slug) VALUES ('x','robot-vacuum','A','B',2020,'roborock-s8-pro-ultra')`);
    assert.equal(dup.ok, false);
  });

  await t.test('category-level self-check cards with a safety tier; invalid tier / no scope rejected', async () => {
    const ok = await tryQ((q, p) => client.query(q, p), `INSERT INTO self_check_cards(category,title_ko,body_ko,safety_level) VALUES ('robot-vacuum','t','b','do_not_diy')`);
    assert.equal(ok.ok, true);
    assert.equal((await tryQ((q, p) => client.query(q, p), `INSERT INTO self_check_cards(category,title_ko,body_ko,safety_level) VALUES ('robot-vacuum','t','b','yolo')`)).ok, false);
    assert.equal((await tryQ((q, p) => client.query(q, p), `INSERT INTO self_check_cards(title_ko,body_ko) VALUES ('t','b')`)).ok, false);
  });

  await t.test('reference_prices: public read-only, https source required, no duplicates', async () => {
    const ins = (url, price = 1000) => tryQ((q, p) => client.query(q, p),
      `INSERT INTO reference_prices(brand,category,item,item_type,price_krw,source_name,source_url,date_seen) VALUES ('LG','robot-vacuum','출장점검료','visit_fee',$1,'LG전자 서비스',$2,'2026-11-17')`, [price, url]);
    assert.equal((await ins('https://www.lge.co.kr/support/visit-center-reservation', 28000)).ok, true);
    assert.equal((await ins('http://insecure.example/x')).ok, false, 'must be https');
    assert.equal((await ins('https://www.lge.co.kr/support/visit-center-reservation')).ok, false, 'duplicate');
    const anonRead = await as(client, 'anon', null, (q) => tryQ(q, `SELECT price_krw FROM reference_prices`));
    assert.equal(anonRead.ok, true); assert.equal(anonRead.rowCount, 1);
    const anonWrite = await as(client, 'anon', null, (q) => tryQ(q, `DELETE FROM reference_prices`));
    assert.equal(anonWrite.ok, false);
  });

  await t.test('reports: unknown price is NULL, free self-fix is 0, unmapped product needs custom_product', async () => {
    const ins = (cols, vals) => tryQ((q, p) => client.query(q, p),
      `INSERT INTO repair_reports(user_id,symptom_id,country,repair_channel,currency,resolved_status,${cols}) VALUES ($1,'sym-1','한국','official','KRW','resolved',${vals.map((_, i) => `$${i + 2}`).join(',')})`, [ALICE, ...vals]);
    assert.equal((await ins('product_id,paid_price,quoted_price', ['prod-1', null, null])).ok, true, 'NULL prices allowed');
    assert.equal((await ins('product_id,paid_price', ['prod-1', 0])).ok, true);
    assert.equal((await ins('custom_product,paid_price', ['로보락 S9 MaxV', 150000])).ok, true, 'unmapped product with free text');
    assert.equal((await ins('paid_price', [150000])).ok, false, 'neither product nor custom_product');
    assert.equal((await ins('product_id,purchase_year', ['prod-1', 1900])).ok, false, 'absurd year');
  });

  await t.test('events: browser roles cannot read or write them', async () => {
    for (const role of ['anon', 'authenticated']) {
      assert.equal((await as(client, role, ALICE, (q) => tryQ(q, `SELECT * FROM events`))).ok, false);
      assert.equal((await as(client, role, ALICE, (q) => tryQ(q, `INSERT INTO events(name,session_id) VALUES ('x','abcdefgh')`))).ok, false);
    }
  });

  await t.test('KPI functions: backend-only, correct definitions', async () => {
    for (const role of ['anon', 'authenticated']) {
      assert.equal((await as(client, role, ALICE, (q) => tryQ(q, `SELECT public.kpi_summary()`))).ok, false, `${role} kpi_summary`);
      assert.equal((await as(client, role, ALICE, (q) => tryQ(q, `SELECT * FROM public.thin_products()`))).ok, false, `${role} thin_products`);
    }
    // s1: first seen 10d ago, returns 3d later -> returned. s2: first seen 10d ago, never again. s3: today (not in cohort).
    const ev = (s, name, daysAgo, props = {}) => client.query(
      `INSERT INTO events(name,session_id,props,created_at) VALUES ($1,$2,$3, now() - ($4 || ' days')::interval)`, [name, s, JSON.stringify(props), String(daysAgo)]);
    await ev('session-one-aaaa', 'page_view', 10); await ev('session-one-aaaa', 'search', 7, { q: '로보락 S8' });
    await ev('session-two-bbbb', 'page_view', 10); await ev('session-two-bbbb', 'search_zero_result', 10, { q: '  드리미 X40 ' });
    await ev('session-three-cc', 'calculator_used', 0); await ev('session-three-cc', 'search_zero_result', 0, { q: '드리미 x40' });
    const k = (await as(client, 'service_role', null, (q) => q(`SELECT public.kpi_summary() AS k`))).rows[0].k;
    assert.equal(k.visitors, 3); assert.equal(k.calculator_uses, 1); assert.equal(k.searches, 1); assert.equal(k.zero_result_searches, 2);
    assert.equal(k.returning_7d_cohort, 2); assert.equal(k.returning_7d_pct, 50);
    assert.equal(k.reports_total, 3); assert.equal(k.reports_unmapped, 1);
    const top = (await as(client, 'service_role', null, (q) => q(`SELECT * FROM public.top_event_queries('search_zero_result')`))).rows;
    assert.deepEqual(top.map((r) => [r.q, Number(r.n)]), [['드리미 x40', 2]], 'case/whitespace-normalised and counted together');
    const thin = (await as(client, 'service_role', null, (q) => q(`SELECT * FROM public.thin_products(5)`))).rows;
    assert.equal(thin.length, 1); assert.equal(thin[0].product_id, 'prod-1');
    assert.equal(Number(thin[0].n_reports), 2);
    assert.equal(Number(thin[0].n_priced), 0, 'NULL price and a 0-won OFFICIAL report are not usable prices');
    // a real price and a free self-fix (0 is valid only for self_check) are counted
    await client.query(`INSERT INTO repair_reports(user_id,product_id,symptom_id,country,repair_channel,currency,resolved_status,paid_price) VALUES ($1,'prod-1','sym-1','한국','official','KRW','resolved',90000)`, [ALICE]);
    await client.query(`INSERT INTO repair_reports(user_id,product_id,symptom_id,country,repair_channel,currency,resolved_status,paid_price) VALUES ($1,'prod-1','sym-1','한국','self_check','KRW','resolved',0)`, [ALICE]);
    const thin2 = (await as(client, 'service_role', null, (q) => q(`SELECT * FROM public.thin_products(5)`))).rows;
    assert.equal(Number(thin2[0].n_priced), 2);
    const none = (await as(client, 'service_role', null, (q) => q(`SELECT * FROM public.thin_products(2)`))).rows;
    assert.equal(none.length, 0, 'threshold is respected');
  });
});
