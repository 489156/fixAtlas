// Full-stack e2e: headless Chromium -> built frontend -> the REAL Hono app (createApp) -> in-memory Db.
// Not part of `npm test` (needs Playwright). Run:  npm run build:e2e && node tests/e2e/e2e.mjs
// Requires: playwright (global or local), a build made with VITE_SUPABASE_URL=http://localhost:54380.
import http from 'node:http';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const { chromium } = createRequire(import.meta.url)('playwright');
const { createApp } = await import(path.join(ROOT, 'supabase/functions/_shared/app.ts'));
const { MemDb, fakeAuth } = await import(path.join(ROOT, 'tests/server/memdb.ts'));

const API_PORT = 54380, WEB_PORT = 54381;
const ALICE = 'alice-0000-0000-0000-000000000001', ADMIN = 'admin-000-0000-0000-000000000003', BOB = 'bob-00000-0000-0000-000000000002';
const db = new MemDb();
db.profiles.set(ALICE, { id: ALICE, nickname: 'a', country: '한국', role: 'user', email: 'a@example.com' });
db.profiles.set(BOB, { id: BOB, nickname: 'b', country: '한국', role: 'user' });
db.profiles.set(ADMIN, { id: ADMIN, nickname: 'root', country: '한국', role: 'admin' });
db.now = () => new Date();
const app = createApp({ db, auth: fakeAuth });

// Minimal Node adapter: /functions/v1/<fn>/... -> app
const api = http.createServer(async (req, res) => {
  const chunks = []; for await (const c of req) chunks.push(c);
  const url = new URL(req.url, `http://localhost:${API_PORT}`);
  url.pathname = url.pathname.replace(/^\/functions\/v1/, '');
  const hasBody = !['GET', 'HEAD'].includes(req.method);
  const r = await app.fetch(new Request(url, { method: req.method, headers: req.headers, body: hasBody && chunks.length ? Buffer.concat(chunks) : undefined }));
  res.writeHead(r.status, Object.fromEntries(r.headers)); res.end(Buffer.from(await r.arrayBuffer()));
}).listen(API_PORT);

const preview = spawn('npx', ['vite', 'preview', '--port', String(WEB_PORT), '--strictPort'], { cwd: ROOT, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 2500));

const results = []; let failed = 0;
const ok = (name, cond, detail = '') => { results.push([cond, name, detail]); if (!cond) failed++; console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`); };
const BASE = `http://localhost:${WEB_PORT}`;
const session = (uid) => JSON.stringify({ access_token: `user:${uid}`, refresh_token: 'x', token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user: { id: uid, email: `${uid}@example.com` } });
const post = (uid, body) => fetch(`http://localhost:${API_PORT}/functions/v1/make-server-3e8c4785/repair-reports`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer user:${uid}` }, body: JSON.stringify(body) }).then((r) => r.json());
const rep = (o = {}) => ({ product_id: 'prod-1', symptom_id: 'sym-1', country: '한국', repair_channel: 'official', currency: 'KRW', resolved_status: 'resolved', paid_price: 132000, privacy_consent: true, ...o });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) pageErrors.push('console: ' + m.text()); });
const text = async () => (await page.locator('body').innerText()).replace(/\s+/g, ' ');
const setSession = async (uid) => page.evaluate(([k, v]) => v ? localStorage.setItem(k, v) : localStorage.removeItem(k), ['sb-localhost-auth-token', uid ? session(uid) : null]);

try {
  // ---- A. Home + nav (anonymous)
  await page.goto(BASE + '/'); await page.waitForTimeout(700);
  let t = await text();
  ok('A1 home hero renders', t.includes('수리비 받기 전에,'));
  ok('A2 admin link hidden from anonymous', (await page.locator('a[href="/admin"]').count()) === 0);
  ok('A3 mobile bottom nav includes calculator', (await page.locator('nav[aria-label="하단 메뉴"] a[href="/calculator"]').count()) === 1);
  ok('A4 no TODO / placeholder text anywhere on home', !/TODO|플레이스홀더|임시 문구|미구현/.test(t));
  ok('A5 legal notices (RFP 16.1-16.3) in footer', t.includes('참고 정보입니다') && t.includes('전문가 또는 공식 서비스센터') && t.includes('비방 목적'));
  ok('A6 document title is meaningful', (await page.title()).includes('수리비'));

  // ---- B. Search: RFP examples (all returned 0 results before)
  for (const [q, expectSlug] of [['로보락 S8 충전 안 됨', 'roborock-s8-pro-ultra'], ['드리미 L10s 도크 오류', 'dreame-l10s-ultra'], ['다이슨 V10 흡입력 약함', 'dyson-v10']]) {
    await page.goto(`${BASE}/search?q=${encodeURIComponent(q)}`); await page.waitForTimeout(600);
    const href = await page.locator(`a[href*="${expectSlug}"]`).first().getAttribute('href').catch(() => null);
    ok(`B search "${q}"`, !!href && href.includes('?symptom='), href ?? 'no link');
  }
  await page.goto(`${BASE}/search?q=${encodeURIComponent('다이슨 V7 충전')}`); await page.waitForTimeout(600);
  t = await text();
  ok('B4 unknown model: explains + offers model request', t.includes('V7') && t.includes('아직 등록되지 않았습니다') && t.includes('모델 등록 요청'));
  await page.goto(`${BASE}/search?q=zzzzqq`); await page.waitForTimeout(600);
  const cta = page.locator('a:has-text("새 제품/증상 제보하기")');
  ok('B5 zero-result page offers a way forward', (await cta.count()) === 1);
  await cta.click(); await page.waitForTimeout(800);
  ok('B6 CTA lands on submit form with the model prefilled (was a dead end)', (await page.locator('#custom').inputValue().catch(() => '')) === 'zzzzqq');

  // ---- C. Submit: deferred login keeps the draft
  await page.goto(`${BASE}/submit-repair?product=roborock-s8-pro-ultra&symptom=sym-1`); await page.waitForTimeout(800);
  await page.fill('#paid', '132000'); await page.fill('#quoted', '145000'); await page.fill('#err', 'Error 13'); await page.selectOption('#year', '2024');
  await page.fill('#review', '충전 접점 교체');
  await page.getByRole('button', { name: '제보 제출하기' }).click(); await page.waitForTimeout(400);
  ok('C1 consent is required (inline error, no alert)', (await text()).includes('개인정보 수집·이용에 동의해 주세요'));
  await page.check('input[type=checkbox]');
  await page.getByRole('button', { name: '제보 제출하기' }).click(); await page.waitForTimeout(900);
  ok('C2 anonymous submit redirects to /auth?next=', page.url().includes('/auth') && decodeURIComponent(page.url()).includes('next=/submit-repair'), page.url());
  await setSession(ALICE);
  await page.goto(`${BASE}/submit-repair`); await page.waitForTimeout(900);
  ok('C3 draft restored after login (form state no longer lost)', (await page.locator('#paid').inputValue()) === '132000' && (await page.locator('#err').inputValue()) === 'Error 13' && (await page.locator('#product').inputValue()) === 'prod-1');
  ok('C4 consent is NOT restored (must be given again)', !(await page.locator('input[type=checkbox]').isChecked()));
  await page.check('input[type=checkbox]');
  await page.getByRole('button', { name: '제보 제출하기' }).click(); await page.waitForTimeout(1000);
  t = await text();
  ok('C5 success screen shows similar-report count', t.includes('제보가 등록되었습니다') && t.includes('같은 모델·증상의 다른 제보는 현재'));
  ok('C6 stored without reporter id leaking via API', db.reports.length === 1 && !JSON.stringify(await (await fetch(`http://localhost:${API_PORT}/functions/v1/make-server-3e8c4785/products/prod-1`)).json()).includes(ALICE));

  // ---- D. Product page honesty + quote check
  for (const p of [90000, 100000, 110000, 120000]) await post(BOB, rep({ paid_price: p }));
  await post(BOB, rep({ paid_price: 150, currency: 'USD' }));      // other currency: must never be mixed
  await page.goto(`${BASE}/products/robot-vacuum/roborock-s8-pro-ultra?symptom=sym-1`); await page.waitForTimeout(1000);
  t = await text();
  // KRW reports: 132,000 (Alice) + 90k/100k/110k/120k (Bob) => n=5, median 110,000; the USD report is separate
  ok('D1 shows median + IQR from n>=5 (KRW only)', /중앙값 110,000원/.test(t) && /중간 50%/.test(t), (t.match(/중앙값[^·]{0,40}/) || [''])[0]);
  ok('D2 USD reports shown separately, never mixed into the KRW range', /제보 수 \(USD\)/.test(t) && !/150 ~|~ 150/.test(t));
  ok('D3 resolve-rate shown only with enough samples', /해결률 · 재발률 \d+% · \d+%/.test(t));
  ok('D4 Do-Not-DIY safety card is prominent', t.includes('[Do Not DIY]'));
  ok('D5 self-check cards carry safety tier labels (not colour only)', /Safe Check|Caution|Expert Only/.test(t));
  ok('D6 official reference prices absent for Roborock (no source) - section hidden', !t.includes('공식·공개 자료 기준 가격'));
  await page.selectOption('#qc-title ~ form select >> nth=0', 'sym-1').catch(() => {});
  await page.fill('input[placeholder="예: 145000"]', '300000'); await page.getByRole('button', { name: '비교' }).click(); await page.waitForTimeout(700);
  t = await text();
  ok('D7 quote check: 300,000 -> above range, with n', t.includes('범위보다 높음') && /제보 \d+건 기준/.test(t));
  const ld = await page.locator('script[type="application/ld+json"]').allInnerTexts();
  ok('D8 JSON-LD Product + FAQPage(from real data only)', ld.some((x) => x.includes('"Product"')) && ld.some((x) => x.includes('FAQPage')));
  ok('D9 canonical has no query string', (await page.locator('link[rel=canonical]').getAttribute('href')).includes('/products/robot-vacuum/roborock-s8-pro-ultra') && !(await page.locator('link[rel=canonical]').getAttribute('href')).includes('?'));
  await page.goto(`${BASE}/products/cordless-vacuum/dyson-v10`); await page.waitForTimeout(800);
  ok('D10 product with no data: honest empty state + CTA, no stats invented', (await text()).includes('아직 제보가 충분하지 않습니다'));

  // ---- E. Calculator
  await page.goto(`${BASE}/calculator?product=roborock-s8-pro-ultra`); await page.waitForTimeout(800);
  await page.fill('#np', '850000'); await page.fill('#rc', '180000'); await page.selectOption('#py', String(new Date().getFullYear() - 4));
  await page.getByRole('button', { name: '계산하기' }).click(); await page.waitForTimeout(400);
  t = await text();
  ok('E1 RFP example 21% (+4-year core-part factor)', t.includes('21%') && t.includes('조건부 수리 검토'));
  ok('E2 result CTAs link to the same model', (await page.locator('a[href="/products/robot-vacuum/roborock-s8-pro-ultra"]').count()) === 1 && (await page.locator('a[href*="/submit-repair?product=roborock-s8-pro-ultra"]').count()) === 1);
  await page.fill('#rc', '-5'); await page.getByRole('button', { name: '계산하기' }).click(); await page.waitForTimeout(300);
  ok('E3 invalid input shows an error instead of a verdict', (await text()).includes('수리비는 0원 이상'));

  // ---- F. Admin gating + KPI panel
  await setSession(null); await page.goto(`${BASE}/admin`); await page.waitForTimeout(900);
  ok('F1 anonymous /admin -> login', page.url().includes('/auth'));
  await setSession(BOB); await page.goto(`${BASE}/admin`); await page.waitForTimeout(1000);
  ok('F2 normal user /admin -> bounced home', new URL(page.url()).pathname === '/');
  ok('F3 normal user cannot hit admin API directly', (await fetch(`http://localhost:${API_PORT}/functions/v1/make-server-3e8c4785/admin/data`, { headers: { authorization: `Bearer user:${BOB}` } })).status === 403);
  await setSession(ADMIN); await page.goto(`${BASE}/admin`); await page.waitForTimeout(1200);
  t = await text();
  ok('F4 admin sees KPI panel with RFP targets', t.includes('90일 KPI 현황') && t.includes('수리비 제보') && /\/ 100/.test(t));
  ok('F5 admin sees review queue with product NAMES, not raw ids', t.includes('Roborock S8 Pro Ultra') && !/prod-1/.test(t));
  await page.getByRole('button', { name: '인증' }).first().click(); await page.waitForTimeout(700);
  ok('F6 admin can verify a report (state changes in the db)', db.reports.some((r) => r.verified_status === 'verified'));
  ok('F7 admin link visible for staff', (await page.locator('a[href="/admin"]').count()) >= 1);

  // ---- H. Blog attribution: first-touch UTM follows the session to later events
  const ctx2 = await browser.newContext(); const p2 = await ctx2.newPage();
  await p2.goto(`${BASE}/products/robot-vacuum/roborock-s8-pro-ultra?utm_source=naver_blog&utm_medium=blog&utm_campaign=e2e-post&utm_content=cta`); await p2.waitForTimeout(600);
  await p2.goto(`${BASE}/calculator`); await p2.waitForTimeout(400);
  await p2.fill('#np', '850000'); await p2.fill('#rc', '100000'); await p2.selectOption('#py', String(new Date().getFullYear() - 1));
  await p2.getByRole('button', { name: '계산하기' }).click(); await p2.waitForTimeout(2200);
  await ctx2.close();
  const tagged = db.events.filter((e) => e.props.cmp === 'e2e-post');
  ok('H1 blog UTM recorded on landing page_view', tagged.some((e) => e.name === 'page_view' && e.props.src === 'naver_blog' && e.props.cnt === 'cta'));
  ok('H2 attribution carried to a later action on another page (calculator)', tagged.some((e) => e.name === 'calculator_used'));

  // ---- G. Analytics: events were recorded, search text stored, no user ids
  await page.waitForTimeout(2200);
  const names = new Set(db.events.map((e) => e.name));
  ok('G1 funnel events recorded', ['page_view', 'search', 'search_zero_result', 'product_view', 'calculator_used', 'quote_check', 'submit_start', 'submit_done', 'login_prompt'].every((n) => names.has(n)), [...names].join(','));
  ok('G2 events carry no user ids', !JSON.stringify(db.events).includes(ALICE));

  ok('Z no uncaught page errors', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '));
} catch (e) {
  ok('e2e script crashed', false, String(e).slice(0, 300));
} finally {
  await browser.close(); preview.kill(); api.close();
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exit(failed ? 1 : 0);
}
