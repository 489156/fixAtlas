import { boot, runFile, as, tryQ } from './harness.mjs';
import { execSync } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
const { client, stop } = await boot();
try {
  await runFile(client, new URL('./supabase_stub.sql', import.meta.url).pathname);
  // ORIGINAL migrations exactly as committed at HEAD (before any change)
  for (const f of ['20260514120000_init_fixatlas.sql','20260514120001_increment_comment_helpful.sql','20260514120002_profile_trigger_idempotent.sql']) {
    const sql = execSync(`git -C /home/user/fixAtlas show HEAD:supabase/migrations/${f}`).toString();
    await client.query(sql);
  }
  const alice='11111111-1111-1111-1111-111111111111', bob='22222222-2222-2222-2222-222222222222';
  await client.query(`INSERT INTO auth.users(id,email) VALUES ($1,'alice@example.com'),($2,'bob@example.com')`, [alice,bob]);
  await client.query(`INSERT INTO products(id,category,brand,model_name,release_year) VALUES ('prod-1','robot-vacuum','Roborock','S8 Pro Ultra',2023)`);
  await client.query(`INSERT INTO symptoms(id,code,name_ko,name_en,risk_level) VALUES ('sym-1','not_charging','충전 안 됨','Not charging','caution')`);
  await client.query(`INSERT INTO repair_reports(user_id,product_id,symptom_id,country,repair_channel,currency,resolved_status,receipt_image_url)
    VALUES ($1,'prod-1','sym-1','한국','official','KRW','resolved','https://x.supabase.co/storage/v1/object/sign/receipts/${alice}/r.png?token=SECRET')`, [alice]);

  console.log('--- BEFORE (original migrations @HEAD) ---');
  // V1: privilege escalation
  const v1 = await as(client,'authenticated',bob, async (q)=>{ const r = await tryQ(q,`UPDATE public.profiles SET role='admin' WHERE id=$1 RETURNING role`,[bob]); return r; });
  console.log('V1 normal user sets own role=admin  ->', v1.ok ? `SUCCEEDED rows=${v1.rowCount} role=${v1.rows[0]?.role}` : `blocked: ${v1.error}`);
  // V2: anonymous read of receipts + reporter identity
  const v2 = await as(client,'anon',null, async (q)=>tryQ(q,`SELECT user_id, receipt_image_url FROM public.repair_reports`));
  console.log('V2 ANON reads receipt URL + user_id ->', v2.ok ? `SUCCEEDED rows=${v2.rowCount} url=${(v2.rows[0]?.receipt_image_url||'').slice(0,60)}…` : `blocked: ${v2.error}`);
  // V3: any user inflates helpful_count? (RPC is service_role only) - sanity
  const v3 = await as(client,'authenticated',bob, async (q)=>tryQ(q,`SELECT * FROM public.increment_comment_helpful(gen_random_uuid())`));
  console.log('V3 authenticated calls helpful RPC  ->', v3.ok ? 'allowed' : `blocked: ${v3.error}`);
  // V4: negative/huge price accepted by DB?
  const v4 = await tryQ((q,p)=>client.query(q,p), `INSERT INTO repair_reports(user_id,product_id,symptom_id,country,repair_channel,currency,resolved_status,paid_price) VALUES ('${alice}','prod-1','sym-1','한국','official','KRW','resolved',-500000)`);
  console.log('V4 negative paid_price accepted     ->', v4.ok ? 'YES (no constraint)' : `blocked: ${v4.error}`);
} finally { await stop(); }
