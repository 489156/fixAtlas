// Contract test: the explicit column lists used by the Supabase adapter and the seed catalog must be
// valid against the REAL migrated schema and its constraints (no PostgREST/Deno needed).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MIG = path.join(HERE, '../../supabase/migrations');
const skip = !process.env.PG_NODE_MODULES && 'set PG_NODE_MODULES to run DB tests';

test('adapter column lists + seed data are valid against the real schema', { skip }, async (t) => {
  const { boot, runFile, as } = await import('./harness.mjs');
  const { COLUMN_CONTRACT } = await import('../../supabase/functions/_shared/columns.ts');
  const { SYMPTOMS, PRODUCTS, SELF_CHECK_CARDS, cardBody } = await import('../../supabase/functions/_shared/seed.ts');
  const { REFERENCE_PRICES } = await import('../../supabase/functions/_shared/reference_prices_seed.ts');
  const { client, stop } = await boot(Number(process.env.PG_PORT3 || 54333));
  t.after(stop);
  await runFile(client, path.join(HERE, 'supabase_stub.sql'));
  for (const f of fs.readdirSync(MIG).filter((x) => x.endsWith('.sql')).sort()) await client.query(fs.readFileSync(path.join(MIG, f), 'utf8'));

  await t.test('every explicit column list selects cleanly as the service role', async () => {
    for (const [table, cols] of Object.entries(COLUMN_CONTRACT)) {
      await as(client, 'service_role', null, (q) => q(`SELECT ${cols} FROM public.${table} LIMIT 0`));
    }
  });

  await t.test('the seed catalog inserts under all real constraints (unique slugs, enums, scopes)', async () => {
    for (const s of SYMPTOMS) {
      await client.query(
        `INSERT INTO symptoms(id,code,name_ko,name_en,name_zh,risk_level,self_check_allowed,synonyms,categories) VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9::jsonb)`,
        [s.id, s.code, s.name_ko, s.name_en, s.name_zh, s.risk_level, s.self_check_allowed, JSON.stringify(s.synonyms), JSON.stringify(s.categories)]);
    }
    for (const p of PRODUCTS) {
      await client.query(
        `INSERT INTO products(id,slug,category,brand,brand_ko,model_name,alternate_names,release_year,image_url,description) VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,'',$9)`,
        [p.id, p.slug, p.category, p.brand, p.brand_ko, p.model_name, JSON.stringify(p.alternate_names), p.release_year, p.description]);
    }
    const codeToId = new Map(SYMPTOMS.map((s) => [s.code, s.id]));
    for (const c of SELF_CHECK_CARDS) {
      assert.ok(!c.symptom_code || codeToId.has(c.symptom_code), `card references unknown symptom ${c.symptom_code}`);
      await client.query(
        `INSERT INTO self_check_cards(product_id,category,symptom_id,title_ko,body_ko,safety_level,sort_order) VALUES (NULL,$1,$2,$3,$4,$5,0)`,
        [c.category, c.symptom_code ? codeToId.get(c.symptom_code) : null, c.title_ko, cardBody(c), c.safety_level]);
    }
    const bySlug = new Map(PRODUCTS.map((p) => [p.slug, p.id]));
    for (const r of REFERENCE_PRICES) {
      assert.ok(!r.product_slug || bySlug.has(r.product_slug), `unknown product slug ${r.product_slug}`);
      await client.query(
        `INSERT INTO reference_prices(product_id,category,brand,item,item_type,price_krw,vat_included,source_name,source_url,date_seen,notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [r.product_slug ? bySlug.get(r.product_slug) : null, r.category, r.brand, r.item, r.item_type, r.price_krw, r.vat_included, r.source_name, r.source_url, r.date_seen, r.notes]);
    }
    const n = (await client.query(`SELECT (SELECT count(*) FROM products) p, (SELECT count(*) FROM self_check_cards) c, (SELECT count(*) FROM reference_prices) r`)).rows[0];
    assert.equal(Number(n.p), PRODUCTS.length); assert.equal(Number(n.c), SELF_CHECK_CARDS.length); assert.equal(Number(n.r), REFERENCE_PRICES.length);
  });

  await t.test('seed integrity: every symptom has a card for each category it applies to; each category has a do_not_diy card', () => {
    for (const cat of ['robot-vacuum', 'cordless-vacuum']) {
      assert.ok(SELF_CHECK_CARDS.some((c) => c.category === cat && c.symptom_code === null && c.safety_level === 'do_not_diy'), `${cat} safety card`);
    }
    const ids = new Set(PRODUCTS.map((p) => p.id)); assert.equal(ids.size, PRODUCTS.length, 'unique product ids');
    const slugs = new Set(PRODUCTS.map((p) => p.slug)); assert.equal(slugs.size, PRODUCTS.length, 'unique slugs');
    assert.equal(PRODUCTS.find((p) => p.id === 'prod-1').slug, 'roborock-s8-pro-ultra', 'RFP example URL slug');
  });
});
