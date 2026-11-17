// Integration test against a REAL PostgreSQL (embedded) that emulates Supabase roles/default grants.
// Run:  PG_NODE_MODULES=/path/with/embedded-postgres-and-pg  node --test tests/db/
// Skipped automatically when PG_NODE_MODULES is not set (so `npm test` stays dependency-free).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MIG = path.join(HERE, '../../supabase/migrations');
const skip = !process.env.PG_NODE_MODULES && 'set PG_NODE_MODULES to run DB tests';

const ALICE = '11111111-1111-1111-1111-111111111111';
const BOB = '22222222-2222-2222-2222-222222222222';

test('security hardening migration (real Postgres, Supabase-style grants)', { skip }, async (t) => {
  const { boot, runFile, as, tryQ } = await import('./harness.mjs');
  const { client, stop } = await boot(Number(process.env.PG_PORT || 54331));
  t.after(stop);

  await runFile(client, path.join(HERE, 'supabase_stub.sql'));
  const migrations = fs.readdirSync(MIG).filter((f) => f.endsWith('.sql')).sort();
  const legacy = migrations.slice(0, 3); // original three migrations (pre-hardening)
  const rest = migrations.slice(3);
  for (const f of legacy) await client.query(fs.readFileSync(path.join(MIG, f), 'utf8'));

  // Legacy data written by the OLD application code (signed URL persisted in a column)
  await client.query(`INSERT INTO auth.users(id,email) VALUES ($1,'alice@example.com'),($2,'bob@example.com')`, [ALICE, BOB]);
  await client.query(`INSERT INTO products(id,category,brand,model_name,release_year) VALUES ('prod-1','robot-vacuum','Roborock','S8 Pro Ultra',2023)`);
  await client.query(`INSERT INTO symptoms(id,code,name_ko,name_en,risk_level) VALUES ('sym-1','not_charging','충전 안 됨','Not charging','caution')`);
  await client.query(
    `INSERT INTO repair_reports(user_id,product_id,symptom_id,country,repair_channel,currency,resolved_status,paid_price,receipt_image_url)
     VALUES ($1,'prod-1','sym-1','한국','official','KRW','resolved',100000,$2)`,
    [ALICE, `https://x.supabase.co/storage/v1/object/sign/receipts/${ALICE}/r.png?token=SECRET`],
  );
  await client.query(`INSERT INTO community_posts(user_id,type,title,body) VALUES ($1,'question','t','b')`, [ALICE]);
  await client.query(`INSERT INTO comments(post_id,user_id,body) SELECT id,$1,'c' FROM community_posts LIMIT 1`, [ALICE]);

  // Apply every migration after the legacy three (hardening + later feature migrations)
  for (const f of rest) await client.query(fs.readFileSync(path.join(MIG, f), 'utf8'));

  await t.test('profiles.role cannot be self-promoted by a signed-in user', async () => {
    const r = await as(client, 'authenticated', BOB, (q) => tryQ(q, `UPDATE public.profiles SET role='admin' WHERE id=$1`, [BOB]));
    assert.equal(r.ok, false, 'must be rejected');
    assert.match(r.error, /permission denied|can only be changed/i);
  });

  await t.test('profiles.role trigger blocks even if UPDATE were re-granted', async () => {
    await client.query(`GRANT UPDATE ON public.profiles TO authenticated`);
    try {
      const r = await as(client, 'authenticated', BOB, (q) => tryQ(q, `UPDATE public.profiles SET role='admin' WHERE id=$1`, [BOB]));
      assert.equal(r.ok, false);
      assert.match(r.error, /can only be changed/i);
    } finally {
      await client.query(`REVOKE UPDATE ON public.profiles FROM authenticated`);
      await client.query(`GRANT UPDATE (nickname, country) ON public.profiles TO authenticated`);
    }
  });

  await t.test('user can still edit own nickname, not someone else\'s', async () => {
    const own = await as(client, 'authenticated', BOB, (q) => tryQ(q, `UPDATE public.profiles SET nickname='bobby' WHERE id=$1`, [BOB]));
    assert.equal(own.ok, true); assert.equal(own.rowCount, 1);
    const other = await as(client, 'authenticated', BOB, (q) => tryQ(q, `UPDATE public.profiles SET nickname='pwned' WHERE id=$1`, [ALICE]));
    assert.equal(other.ok, true); assert.equal(other.rowCount, 0, 'RLS hides other rows');
  });

  await t.test('service role (Edge Function) can still promote an admin', async () => {
    const r = await as(client, 'service_role', null, (q) => tryQ(q, `UPDATE public.profiles SET role='moderator' WHERE id=$1 RETURNING role`, [BOB]));
    assert.equal(r.ok, true); assert.equal(r.rows[0].role, 'moderator');
  });

  await t.test('repair_reports is not readable by anon or authenticated (no receipts / user_id leak)', async () => {
    for (const role of ['anon', 'authenticated']) {
      const r = await as(client, role, BOB, (q) => tryQ(q, `SELECT * FROM public.repair_reports`));
      assert.equal(r.ok, false, `${role} must not read repair_reports`);
      assert.match(r.error, /permission denied/i);
    }
  });

  await t.test('legacy signed URL was converted to a bucket path and the URL column dropped', async () => {
    const cols = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name='repair_reports'`);
    assert.ok(!cols.rows.some((c) => c.column_name === 'receipt_image_url'), 'receipt_image_url must be gone');
    const row = await client.query(`SELECT receipt_path FROM public.repair_reports LIMIT 1`);
    assert.equal(row.rows[0].receipt_path, `${ALICE}/r.png`);
  });

  await t.test('community tables no longer expose author identity to browser roles', async () => {
    const ok = await as(client, 'anon', null, (q) => tryQ(q, `SELECT id, title, body FROM public.community_posts`));
    assert.equal(ok.ok, true); assert.equal(ok.rowCount, 1);
    const leak = await as(client, 'anon', null, (q) => tryQ(q, `SELECT user_id FROM public.community_posts`));
    assert.equal(leak.ok, false);
    const leak2 = await as(client, 'anon', null, (q) => tryQ(q, `SELECT user_id FROM public.comments`));
    assert.equal(leak2.ok, false);
  });

  await t.test('helpful RPC: closed to browser roles, de-duplicated per user for the backend', async () => {
    const cid = (await client.query(`SELECT id FROM public.comments LIMIT 1`)).rows[0].id;
    for (const role of ['anon', 'authenticated']) {
      const a = await as(client, role, BOB, (q) => tryQ(q, `SELECT * FROM public.mark_comment_helpful($1,$2)`, [cid, BOB]));
      assert.equal(a.ok, false, `${role} must not call mark_comment_helpful`);
      const b = await as(client, role, BOB, (q) => tryQ(q, `SELECT * FROM public.increment_comment_helpful($1)`, [cid]));
      assert.equal(b.ok, false, `${role} must not call the legacy increment RPC`);
    }
    const counts = await as(client, 'service_role', null, async (q) => {
      await q(`SELECT * FROM public.mark_comment_helpful($1,$2)`, [cid, BOB]);
      await q(`SELECT * FROM public.mark_comment_helpful($1,$2)`, [cid, BOB]); // same user twice
      await q(`SELECT * FROM public.mark_comment_helpful($1,$2)`, [cid, ALICE]);
      return (await q(`SELECT helpful_count FROM public.comments WHERE id=$1`, [cid])).rows[0].helpful_count;
    });
    assert.equal(counts, 2, 'two distinct voters -> 2, duplicate ignored');
    const missing = await as(client, 'service_role', null, (q) => tryQ(q, `SELECT * FROM public.mark_comment_helpful(gen_random_uuid(), $1)`, [BOB]));
    assert.equal(missing.ok, true); assert.equal(missing.rowCount, 0, 'unknown comment returns nothing (404 upstream)');
  });

  await t.test('DB rejects out-of-range or malformed report/community input', async () => {
    const base = (price, cur) => [ALICE, price, cur];
    const ins = (price, cur) => tryQ((q, p) => client.query(q, p),
      `INSERT INTO repair_reports(user_id,product_id,symptom_id,country,repair_channel,currency,resolved_status,paid_price)
       VALUES ($1,'prod-1','sym-1','한국','official',$3,'resolved',$2)`, base(price, cur));
    assert.equal((await ins(-500000, 'KRW')).ok, false, 'negative price');
    assert.equal((await ins(5e12, 'KRW')).ok, false, 'absurd price');
    assert.equal((await ins(100, 'BTC')).ok, false, 'unsupported currency');
    assert.equal((await ins(132000, 'KRW')).ok, true, 'valid row accepted');
    const post = (type, status) => tryQ((q, p) => client.query(q, p),
      `INSERT INTO community_posts(user_id,type,status,title,body) VALUES ($1,$2,$3,'t','b')`, [ALICE, type, status]);
    assert.equal((await post('spam', 'open')).ok, false);
    assert.equal((await post('question', 'weird')).ok, false);
    assert.equal((await post('question', 'open')).ok, true);
  });

  await t.test('receipt bucket limits + owner-only storage policies still hold', async () => {
    const b = (await client.query(`SELECT file_size_limit, allowed_mime_types FROM storage.buckets WHERE id='receipts'`)).rows[0];
    assert.equal(Number(b.file_size_limit), 5242880);
    assert.deepEqual(b.allowed_mime_types, ['image/jpeg', 'image/png', 'image/webp', 'image/heic']);
    const mine = await as(client, 'authenticated', ALICE, (q) => tryQ(q, `INSERT INTO storage.objects(bucket_id,name) VALUES ('receipts',$1)`, [`${ALICE}/new.png`]));
    assert.equal(mine.ok, true);
    const theirs = await as(client, 'authenticated', ALICE, (q) => tryQ(q, `INSERT INTO storage.objects(bucket_id,name) VALUES ('receipts',$1)`, [`${BOB}/x.png`]));
    assert.equal(theirs.ok, false, 'cannot upload into another user folder');
  });
});
