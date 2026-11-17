// HTTP layer (Hono). Pure with respect to storage/auth: both are injected, so the same code runs on
// Deno (Supabase Edge Function) and under Node tests with an in-memory Db.
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Db, AuthVerifier, AdminReport } from './db.ts';
import type { Product, Symptom, PublicReport } from './types.ts';
import { searchCatalog } from './search.ts';
import { symptomStats, quoteCheck } from './stats.ts';
import {
  parseReport, parsePost, parseComment, parseEvents, LIMITS, CURRENCIES, REPORT_STATUSES,
} from './validate.ts';

export interface AppDeps {
  db: Db;
  auth: AuthVerifier;
  now?: () => Date;
  /** If set, only this origin gets CORS headers (recommended in production). Default: any origin. */
  allowedOrigin?: string;
  log?: (...a: unknown[]) => void;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const PUBLIC_REPORT_LIMIT = 2000; // rows used for statistics per product

export function createApp(deps: AppDeps) {
  const { db, auth } = deps;
  const now = deps.now ?? (() => new Date());
  const log = deps.log ?? (() => {});
  const app = new Hono();

  app.use('*', cors(deps.allowedOrigin ? { origin: deps.allowedOrigin } : undefined));

  // Never leak internal error text to clients; log it server-side instead.
  app.onError((err, c) => {
    log('Unhandled error:', err);
    return c.json({ error: 'Internal error' }, 500);
  });

  const bearer = (header: string | undefined) => {
    const m = /^Bearer\s+(.+)$/i.exec(header ?? '');
    return m ? m[1] : null;
  };
  async function requireUser(header: string | undefined) {
    const token = bearer(header);
    if (!token) return null;
    return await auth.verify(token);
  }
  async function requireStaff(header: string | undefined, adminOnly = false) {
    const user = await requireUser(header);
    if (!user) return { ok: false as const, status: 401 as const, message: 'Unauthorized' };
    const profile = await db.getProfile(user.id);
    const allowed = adminOnly ? profile?.role === 'admin' : profile?.role === 'admin' || profile?.role === 'moderator';
    if (!allowed) return { ok: false as const, status: 403 as const, message: adminOnly ? 'Admin access required' : 'Staff access required' };
    return { ok: true as const, userId: user.id };
  }
  const sinceIso = () => new Date(now().getTime() - DAY_MS).toISOString();

  const names = async () => {
    const [products, symptoms] = await Promise.all([db.listProducts(), db.listSymptoms()]);
    return {
      products,
      symptoms,
      productName: (id: string | null) => {
        const p = products.find((x) => x.id === id);
        return p ? `${p.brand} ${p.model_name}` : '';
      },
      symptomName: (id: string) => symptoms.find((x) => x.id === id)?.name_ko ?? '',
    };
  };

  const routes = new Hono();

  routes.get('/health', (c) => c.json({ status: 'ok', timestamp: now().toISOString() }));

  // ---------------------------------------------------------------- catalog / search
  routes.get('/search', async (c) => {
    const q = (c.req.query('q') ?? '').slice(0, 100);
    const [products, symptoms] = await Promise.all([db.listProducts(), db.listSymptoms()]);
    const r = searchCatalog(q, products, symptoms);
    return c.json({
      products: r.products.map((h) => h.product),
      symptoms: r.symptoms,
      parsed: r.parsed,
      reason: r.reason,
    });
  });

  routes.get('/products', async (c) => {
    const category = c.req.query('category');
    return c.json({ products: await db.listProducts(category || undefined) });
  });

  routes.get('/products/:key', async (c) => {
    const product = await db.getProductByKey(c.req.param('key'));
    if (!product) return c.json({ error: 'Product not found' }, 404);
    const [all, symptoms, cards, refs] = await Promise.all([
      db.listPublicReportsForProduct(product.id, PUBLIC_REPORT_LIMIT),
      db.listSymptoms(),
      db.listSelfCheckCards(product),
      db.listReferencePrices(product),
    ]);
    return c.json({
      product,
      reports: all.slice(0, 20), // newest first (db contract)
      stats: symptomStats(all),
      symptoms,
      self_check_cards: cards,
      reference_prices: refs,
    });
  });

  // "Is my quote normal?" -> where the quote falls among same model + symptom + currency reports
  routes.get('/products/:key/quote-check', async (c) => {
    const product = await db.getProductByKey(c.req.param('key'));
    if (!product) return c.json({ error: 'Product not found' }, 404);
    const symptom_id = c.req.query('symptom_id') ?? '';
    const currency = c.req.query('currency') ?? 'KRW';
    const quote = Number(c.req.query('quote'));
    if (!symptom_id || !(CURRENCIES as readonly string[]).includes(currency) || !Number.isFinite(quote) || quote < 0 || quote > 1e9) {
      return c.json({ error: 'symptom_id, currency and a numeric quote are required' }, 400);
    }
    const reports = await db.listPublicReportsForProduct(product.id, PUBLIC_REPORT_LIMIT);
    return c.json({ product_id: product.id, symptom_id, quote, ...quoteCheck(reports, { symptom_id, currency, quote }) });
  });

  routes.get('/symptoms', async (c) => c.json({ symptoms: await db.listSymptoms() }));

  // ---------------------------------------------------------------- repair reports
  routes.get('/repair-reports', async (c) => {
    const limit = Math.min(Math.max(Number(c.req.query('limit')) || 20, 1), 50);
    const [rows, n] = await Promise.all([db.listRecentPublicReports(limit), names()]);
    return c.json({
      reports: rows.map((r: PublicReport) => ({ ...r, product_name: n.productName(r.product_id), symptom_name: n.symptomName(r.symptom_id) })),
    });
  });

  routes.post('/repair-reports', async (c) => {
    const user = await requireUser(c.req.header('Authorization'));
    if (!user) return c.json({ error: '로그인이 필요합니다.' }, 401);

    const body = await c.req.json().catch(() => null);
    const parsed = parseReport(body, user.id, now());
    if (!parsed.ok) return c.json({ error: parsed.errors[0], errors: parsed.errors }, 400);
    const input = parsed.value;

    if ((await db.countReportsSince(user.id, sinceIso())) >= LIMITS.reportsPerDay) {
      return c.json({ error: '하루에 제출할 수 있는 제보 수를 초과했습니다. 내일 다시 시도해 주세요.' }, 429);
    }
    const [symptoms, product] = await Promise.all([db.listSymptoms(), input.product_id ? db.getProductByKey(input.product_id) : Promise.resolve(null)]);
    if (!symptoms.some((s: Symptom) => s.id === input.symptom_id)) return c.json({ error: '알 수 없는 증상입니다.' }, 400);
    if (input.product_id && !product) return c.json({ error: '알 수 없는 제품입니다.' }, 400);
    if (product) input.product_id = product.id;

    const report = await db.insertReport(user.id, input, now().toISOString());

    // RFP 5.4 completion screen: how many similar reports exist and where this price sits.
    let summary: Record<string, unknown> = { similar_count: 0, position: null };
    if (report.product_id) {
      const all = await db.listPublicReportsForProduct(report.product_id, PUBLIC_REPORT_LIMIT);
      const same = all.filter((r: PublicReport) => r.symptom_id === report.symptom_id && r.id !== report.id);
      summary = { similar_count: same.length, position: null };
      if (report.paid_price !== null && report.paid_price > 0) {
        const qc = quoteCheck(same, { symptom_id: report.symptom_id, currency: report.currency, quote: report.paid_price });
        summary = { similar_count: same.length, position: qc.sufficient ? { band: qc.band, percentile: qc.percentile, message: qc.message } : null };
      }
    }
    return c.json({ success: true, report, summary }, 201);
  });

  // ---------------------------------------------------------------- community
  routes.get('/community', async (c) => {
    const type = c.req.query('type');
    const [posts, n] = await Promise.all([db.listPosts(type && type !== 'all' ? type : undefined), names()]);
    return c.json({ posts: posts.map((p) => ({ ...p, product_name: p.product_id ? n.productName(p.product_id) : '' })) });
  });

  routes.get('/community/:id', async (c) => {
    const post = await db.getPost(c.req.param('id'));
    if (!post || post.hidden) return c.json({ error: 'Post not found' }, 404);
    return c.json({ post, comments: await db.listComments(post.id) });
  });

  routes.post('/community', async (c) => {
    const user = await requireUser(c.req.header('Authorization'));
    if (!user) return c.json({ error: '로그인이 필요합니다.' }, 401);
    const parsed = parsePost(await c.req.json().catch(() => null));
    if (!parsed.ok) return c.json({ error: parsed.errors[0], errors: parsed.errors }, 400);
    if ((await db.countPostsSince(user.id, sinceIso())) >= LIMITS.postsPerDay) return c.json({ error: '하루 게시글 작성 한도를 초과했습니다.' }, 429);
    return c.json({ success: true, post: await db.insertPost(user.id, parsed.value) }, 201);
  });

  routes.post('/comments', async (c) => {
    const user = await requireUser(c.req.header('Authorization'));
    if (!user) return c.json({ error: '로그인이 필요합니다.' }, 401);
    const parsed = parseComment(await c.req.json().catch(() => null));
    if (!parsed.ok) return c.json({ error: parsed.errors[0], errors: parsed.errors }, 400);
    const post = await db.getPost(parsed.value.post_id);
    if (!post || post.hidden) return c.json({ error: 'Post not found' }, 404);
    if ((await db.countCommentsSince(user.id, sinceIso())) >= LIMITS.commentsPerDay) return c.json({ error: '하루 댓글 작성 한도를 초과했습니다.' }, 429);
    return c.json({ success: true, comment: await db.insertComment(user.id, post.id, parsed.value.body) }, 201);
  });

  routes.post('/comments/:id/helpful', async (c) => {
    const user = await requireUser(c.req.header('Authorization'));
    if (!user) return c.json({ error: 'Unauthorized' }, 401);
    const comment = await db.markCommentHelpful(c.req.param('id'), user.id);
    if (!comment) return c.json({ error: 'Comment not found' }, 404);
    return c.json({ success: true, comment });
  });

  routes.get('/user', async (c) => {
    const user = await requireUser(c.req.header('Authorization'));
    if (!user) return c.json({ error: 'Unauthorized' }, 401);
    const p = await db.getProfile(user.id);
    return c.json({ user: p ?? { id: user.id, email: user.email ?? null, role: 'user' } });
  });

  // ---------------------------------------------------------------- analytics (anonymous, allow-listed)
  routes.post('/events', async (c) => {
    const parsed = parseEvents(await c.req.json().catch(() => null));
    if (!parsed) return c.json({ error: 'Invalid payload' }, 400);
    if (parsed.events.length) await db.insertEvents(parsed.session_id, parsed.events);
    return c.json({ ok: true, accepted: parsed.events.length });
  });

  // ---------------------------------------------------------------- admin
  routes.post('/admin/seed', async (c) => {
    const gate = await requireStaff(c.req.header('Authorization'), true);
    if (!gate.ok) return c.json({ error: gate.message }, gate.status);
    return c.json({ success: true, message: 'Seed data initialized', counts: await db.seedCatalog() });
  });

  routes.get('/admin/data', async (c) => {
    const gate = await requireStaff(c.req.header('Authorization'));
    if (!gate.ok) return c.json({ error: gate.message }, gate.status);
    const o = await db.adminOverview();
    const n = { productName: (id: string | null) => { const p = o.products.find((x: Product) => x.id === id); return p ? `${p.brand} ${p.model_name}` : ''; },
      symptomName: (id: string) => o.symptoms.find((x: Symptom) => x.id === id)?.name_ko ?? '' };
    return c.json({
      ...o,
      reports: o.reports.map((r: AdminReport) => ({ ...r, product_name: n.productName(r.product_id), symptom_name: n.symptomName(r.symptom_id) })),
    });
  });

  routes.get('/admin/metrics', async (c) => {
    const gate = await requireStaff(c.req.header('Authorization'));
    if (!gate.ok) return c.json({ error: gate.message }, gate.status);
    const [kpi, zero, searches, requests, thin, campaigns] = await Promise.all([
      db.kpiSummary(), db.topEventQueries('search_zero_result', 20), db.topEventQueries('search', 20),
      db.topEventQueries('product_request', 20), db.thinProducts(5), db.topCampaigns(20),
    ]);
    return c.json({ kpi, top_zero_result_queries: zero, top_queries: searches, top_requested_models: requests, thin_products: thin, campaigns });
  });

  routes.patch('/admin/posts/:id', async (c) => {
    const gate = await requireStaff(c.req.header('Authorization'));
    if (!gate.ok) return c.json({ error: gate.message }, gate.status);
    const body = await c.req.json().catch(() => ({}));
    const patch: { hidden?: boolean; verified?: boolean } = {};
    if (typeof body.hidden === 'boolean') patch.hidden = body.hidden;
    if (typeof body.verified === 'boolean') patch.verified = body.verified;
    if (!Object.keys(patch).length) return c.json({ error: 'Nothing to update' }, 400);
    const post = await db.setPostFlags(c.req.param('id'), patch);
    return post ? c.json({ success: true, post }) : c.json({ error: 'Post not found' }, 404);
  });

  routes.patch('/admin/reports/:id', async (c) => {
    const gate = await requireStaff(c.req.header('Authorization'));
    if (!gate.ok) return c.json({ error: gate.message }, gate.status);
    const body = await c.req.json().catch(() => ({}));
    const patch: { verified_status?: string; hidden?: boolean; product_id?: string } = {};
    if (body.verified_status !== undefined) {
      if (!(REPORT_STATUSES as readonly string[]).includes(body.verified_status)) return c.json({ error: 'Invalid verified_status' }, 400);
      patch.verified_status = body.verified_status;
    }
    if (typeof body.hidden === 'boolean') patch.hidden = body.hidden;
    if (typeof body.product_id === 'string' && body.product_id) {
      const p = await db.getProductByKey(body.product_id);
      if (!p) return c.json({ error: 'Unknown product' }, 400);
      patch.product_id = p.id; // maps an "unlisted model" report to a catalog product
    }
    if (!Object.keys(patch).length) return c.json({ error: 'Nothing to update' }, 400);
    const report = await db.updateReport(c.req.param('id'), patch);
    return report ? c.json({ success: true, report }) : c.json({ error: 'Report not found' }, 404);
  });

  // Receipt images are private: staff get a short-lived signed URL on demand, never a stored one.
  routes.get('/admin/reports/:id/receipt', async (c) => {
    const gate = await requireStaff(c.req.header('Authorization'));
    if (!gate.ok) return c.json({ error: gate.message }, gate.status);
    const path = await db.getReceiptPath(c.req.param('id'));
    if (!path) return c.json({ error: 'No receipt' }, 404);
    const url = await db.signReceiptUrl(path, 60);
    return url ? c.json({ url, expires_in: 60 }) : c.json({ error: 'Could not sign receipt' }, 500);
  });

  routes.post('/admin/products', async (c) => {
    const gate = await requireStaff(c.req.header('Authorization'), true);
    if (!gate.ok) return c.json({ error: gate.message }, gate.status);
    const b = await c.req.json().catch(() => null) as Record<string, unknown> | null;
    const s = (x: unknown, max: number) => (typeof x === 'string' && x.trim() && x.trim().length <= max ? x.trim() : null);
    const category = b?.category === 'robot-vacuum' || b?.category === 'cordless-vacuum' ? b.category : null;
    const id = s(b?.id, 60); const slug = s(b?.slug, 100); const brand = s(b?.brand, 60); const model_name = s(b?.model_name, 100);
    const year = Number(b?.release_year);
    if (!category || !id || !slug || !/^[a-z0-9-]+$/.test(slug) || !brand || !model_name || !Number.isInteger(year) || year < 2000 || year > 2100) {
      return c.json({ error: 'category, id, slug(a-z0-9-), brand, model_name, release_year are required' }, 400);
    }
    const alt = Array.isArray(b?.alternate_names) ? (b!.alternate_names as unknown[]).filter((x): x is string => typeof x === 'string').slice(0, 20) : [];
    const product = await db.upsertProduct({
      id, slug, category, brand, brand_ko: s(b?.brand_ko, 60) ?? '', model_name, alternate_names: alt,
      release_year: year, description: s(b?.description, 300) ?? '',
    });
    return c.json({ success: true, product }, 201);
  });

  app.route('/', routes);
  app.route('/make-server-3e8c4785', routes); // gateway path shape
  return app;
}
