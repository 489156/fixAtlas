// Test harness: boots a real PostgreSQL (embedded), emulates Supabase roles, runs queries as a given role/user.
import { createRequire } from 'node:module';
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os';
const PGDIR = process.env.PG_NODE_MODULES; // scratch dir containing embedded-postgres + pg
const require = createRequire(path.join(PGDIR, 'x.js'));
const EmbeddedPostgres = require('embedded-postgres').default;
const pg = require('pg');
export async function boot(port = 54329) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fxpg-'));
  const server = new EmbeddedPostgres({ databaseDir: dir, user: 'postgres', password: 'pw', port, persistent: false, createPostgresUser: true, initdbFlags: ['--locale=C.utf8','--lc-messages=C.utf8','--encoding=UTF8'], onLog: (m) => process.env.PG_DEBUG && console.log('[pg]', m), onError: (m) => process.env.PG_DEBUG && console.error('[pg-err]', m) });
  await server.initialise(); await server.start(); await server.createDatabase('fixatlas');
  const client = new pg.Client({ connectionString: `postgres://postgres:pw@localhost:${port}/fixatlas` });
  await client.connect();
  const stop = async () => { await client.end(); await server.stop(); fs.rmSync(dir, { recursive: true, force: true }); };
  return { client, stop };
}
export async function runFile(client, file) { await client.query(fs.readFileSync(file, 'utf8')); }
/** Run fn inside a txn as `role` with JWT sub = uid; always rolled back (isolated). */
export async function as(client, role, uid, fn) {
  await client.query('BEGIN');
  try {
    await client.query(`SET LOCAL ROLE ${role}`);
    await client.query(`SELECT set_config('request.jwt.claim.sub', $1, true), set_config('request.jwt.claim.role', $2, true)`, [uid || '', role]);
    return await fn((q, p) => client.query(q, p));
  } finally { await client.query('ROLLBACK'); }
}
export async function tryQ(run, q, p) { try { const r = await run(q, p); return { ok: true, rows: r.rows, rowCount: r.rowCount }; } catch (e) { return { ok: false, error: e.message.split('\n')[0] }; } }
