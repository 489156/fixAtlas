// Real-Postgres test: UTM/campaign attribution in KPI functions (blog-stage gate metrics).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MIG = path.join(HERE, '../../supabase/migrations');
const skip = !process.env.PG_NODE_MODULES && 'set PG_NODE_MODULES to run DB tests';

test('campaign attribution KPIs (real Postgres)', { skip }, async (t) => {
  const { boot, runFile, as, tryQ } = await import('./harness.mjs');
  const { client, stop } = await boot(Number(process.env.PG_PORT4 || 54334));
  t.after(stop);
  await runFile(client, path.join(HERE, 'supabase_stub.sql'));
  for (const f of fs.readdirSync(MIG).filter((x) => x.endsWith('.sql')).sort()) await client.query(fs.readFileSync(path.join(MIG, f), 'utf8'));

  const ev = (s, name, props = {}) => client.query(`INSERT INTO events(name,session_id,props) VALUES ($1,$2,$3)`, [name, s, JSON.stringify(props)]);
  const blogA = { src: 'naver_blog', cmp: '2026-11-battery-price' };
  await ev('session-blog-a1', 'page_view', blogA); await ev('session-blog-a1', 'quote_check', blogA); await ev('session-blog-a1', 'submit_done', blogA);
  await ev('session-blog-a2', 'page_view', blogA);
  await ev('session-blog-b1', 'page_view', { src: 'naver_blog', cmp: '2026-11-lg-visit-fee' });
  await ev('session-insta-1', 'page_view', { src: 'instagram' });
  await ev('session-organic', 'page_view', {}); await ev('session-organic', 'submit_done', {});

  await t.test('kpi_summary counts blog sessions, quote checks and submissions separately from organic', async () => {
    const k = (await as(client, 'service_role', null, (q) => q(`SELECT public.kpi_summary() AS k`))).rows[0].k;
    assert.equal(k.visitors, 5);
    assert.equal(k.campaign_sessions, 4);
    assert.equal(k.blog_sessions, 3);
    assert.equal(k.blog_quote_checks, 1);
    assert.equal(k.blog_submit_done, 1);
    assert.equal(k.submit_done, 2, 'organic submission still counted in the total');
  });

  await t.test('top_campaigns ranks by sessions and attributes conversions', async () => {
    const rows = (await as(client, 'service_role', null, (q) => q(`SELECT * FROM public.top_campaigns()`))).rows
      .map((r) => [r.src, r.cmp, Number(r.sessions), Number(r.quote_checks), Number(r.submits)]);
    assert.deepEqual(rows[0], ['naver_blog', '2026-11-battery-price', 2, 1, 1]);
    assert.equal(rows.length, 3);
  });

  await t.test('browser roles cannot call the campaign KPIs', async () => {
    for (const role of ['anon', 'authenticated']) {
      assert.equal((await as(client, role, null, (q) => tryQ(q, `SELECT * FROM public.top_campaigns()`))).ok, false);
      assert.equal((await as(client, role, null, (q) => tryQ(q, `SELECT public.kpi_summary()`))).ok, false);
    }
  });
});
