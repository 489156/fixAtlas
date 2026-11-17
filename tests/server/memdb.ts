// In-memory Db for API tests. Keeps reporter ids and receipt paths INTERNALLY so tests can prove they never leave.
import type { Db, PostRow, CommentRow, Profile, AdminReport, AuthVerifier } from '../../supabase/functions/_shared/db.ts';
import type { Product, Symptom, SelfCheckCard, PublicReport, ReferencePrice } from '../../supabase/functions/_shared/types.ts';
import type { ReportInput, PostInput, EventInput } from '../../supabase/functions/_shared/validate.ts';
import { PRODUCTS, SYMPTOMS, SELF_CHECK_CARDS, cardBody } from '../../supabase/functions/_shared/seed.ts';

interface StoredReport extends AdminReport { user_id: string; receipt_path: string }

export class MemDb implements Db {
  products: Product[] = PRODUCTS.map((p) => ({ ...p, alternate_names: [...p.alternate_names], image_url: '' })) as Product[];
  symptoms: Symptom[] = SYMPTOMS.map((s) => ({ ...s, synonyms: [...s.synonyms], categories: [...s.categories] })) as Symptom[];
  cards: SelfCheckCard[] = SELF_CHECK_CARDS.map((c, i) => ({
    id: `card-${i}`, product_id: null, category: c.category,
    symptom_id: this.symptoms.find((s) => s.code === c.symptom_code)?.id ?? null,
    title_ko: c.title_ko, body_ko: cardBody(c), sort_order: c.symptom_code ? 10 + i : 0, safety_level: c.safety_level,
  }));
  refs: ReferencePrice[] = [];
  reports: StoredReport[] = [];
  posts: (PostRow & { user_id: string })[] = [];
  comments: (CommentRow & { user_id: string })[] = [];
  helpful = new Set<string>();
  profiles = new Map<string, Profile>();
  events: { session_id: string; name: string; path: string; props: Record<string, unknown> }[] = [];
  now = () => new Date('2026-11-17T12:00:00Z');
  private seq = 0;
  private id = (p: string) => `${p}-${++this.seq}`;

  async listProducts(category?: string) { return this.products.filter((p) => !category || p.category === category); }
  async getProductByKey(k: string) { return this.products.find((p) => p.id === k) ?? this.products.find((p) => p.slug === k) ?? null; }
  async listSymptoms() { return this.symptoms; }
  async listSelfCheckCards(p: Product) { return this.cards.filter((c) => c.product_id === p.id || (c.product_id === null && c.category === p.category)).sort((a, b) => a.sort_order - b.sort_order); }
  async listReferencePrices(p: Product) { return this.refs.filter((r) => r.product_id === p.id || (r.product_id === null && r.brand === p.brand)); }

  private pub = (r: StoredReport): PublicReport => ({
    id: r.id, product_id: r.product_id as string, symptom_id: r.symptom_id, country: r.country, city: r.city, repair_channel: r.repair_channel,
    quoted_price: r.quoted_price, paid_price: r.paid_price, currency: r.currency, repair_item: r.repair_item, resolved_status: r.resolved_status,
    review_text: r.review_text, verified_status: r.verified_status, purchase_year: r.purchase_year, error_code: r.error_code, created_at: r.created_at,
  });
  private visible = (r: StoredReport) => !r.hidden && r.verified_status !== 'rejected' && r.product_id !== null;
  async listPublicReportsForProduct(pid: string, limit: number) { return this.reports.filter((r) => r.product_id === pid && this.visible(r)).sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, limit).map(this.pub); }
  async listRecentPublicReports(limit: number) { return this.reports.filter(this.visible).sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, limit).map(this.pub); }
  async countReportsSince(uid: string, since: string) { return this.reports.filter((r) => r.user_id === uid && r.created_at >= since).length; }
  async insertReport(uid: string, i: ReportInput, consentAt: string) {
    const r: StoredReport = {
      id: this.id('rep'), user_id: uid, product_id: i.product_id, custom_product: i.custom_product, symptom_id: i.symptom_id, country: i.country, city: i.city,
      repair_channel: i.repair_channel, quoted_price: i.quoted_price, paid_price: i.paid_price, currency: i.currency, repair_item: i.repair_item,
      resolved_status: i.resolved_status, review_text: i.review_text, verified_status: 'reported', purchase_year: i.purchase_year, error_code: i.error_code,
      created_at: consentAt, hidden: false, has_receipt: Boolean(i.receipt_path), receipt_path: i.receipt_path,
    };
    this.reports.push(r);
    return this.pub(r);
  }

  async listPosts(type?: string) { return this.posts.filter((p) => !p.hidden && (!type || p.type === type)).map(({ user_id: _u, ...p }) => p); }
  async getPost(id: string) { const p = this.posts.find((x) => x.id === id); if (!p) return null; const { user_id: _u, ...rest } = p; return rest; }
  async listComments(postId: string) { return this.comments.filter((c) => c.post_id === postId).map(({ user_id: _u, ...c }) => c); }
  async insertPost(uid: string, p: PostInput) {
    const row = { id: this.id('post'), user_id: uid, type: p.type, product_id: p.product_id, symptom_id: p.symptom_id, title: p.title, body: p.body, status: p.status, images: [], tags: p.tags, hidden: false, verified: false, created_at: this.now().toISOString() };
    this.posts.push(row); const { user_id: _u, ...rest } = row; return rest;
  }
  async insertComment(uid: string, postId: string, body: string) {
    const row = { id: this.id('cmt'), user_id: uid, post_id: postId, body, helpful_count: 0, created_at: this.now().toISOString() };
    this.comments.push(row); const { user_id: _u, ...rest } = row; return rest;
  }
  async countPostsSince(uid: string, since: string) { return this.posts.filter((p) => p.user_id === uid && p.created_at >= since).length; }
  async countCommentsSince(uid: string, since: string) { return this.comments.filter((c) => c.user_id === uid && c.created_at >= since).length; }
  async markCommentHelpful(cid: string, uid: string) {
    const c = this.comments.find((x) => x.id === cid); if (!c) return null;
    if (!this.helpful.has(`${cid}:${uid}`)) { this.helpful.add(`${cid}:${uid}`); c.helpful_count++; }
    const { user_id: _u, ...rest } = c; return rest;
  }

  async getProfile(uid: string) { return this.profiles.get(uid) ?? null; }
  async insertEvents(sessionId: string, events: EventInput[]) { for (const e of events) this.events.push({ session_id: sessionId, ...e }); }

  async adminOverview() {
    return { products: this.products, symptoms: this.symptoms, posts: this.posts.map(({ user_id: _u, ...p }) => p), users: [...this.profiles.values()],
      reports: this.reports.map(({ user_id: _u, receipt_path: _r, ...r }) => r as AdminReport) };
  }
  async setPostFlags(id: string, patch: { hidden?: boolean; verified?: boolean }) { const p = this.posts.find((x) => x.id === id); if (!p) return null; Object.assign(p, patch); const { user_id: _u, ...rest } = p; return rest; }
  async updateReport(id: string, patch: { verified_status?: string; hidden?: boolean; product_id?: string }) {
    const r = this.reports.find((x) => x.id === id); if (!r) return null; Object.assign(r, patch);
    const { user_id: _u, receipt_path: _r, ...rest } = r; return rest as AdminReport;
  }
  async getReceiptPath(id: string) { return this.reports.find((r) => r.id === id)?.receipt_path || null; }
  async signReceiptUrl(path: string, seconds: number) { return `https://signed.example/${path}?exp=${seconds}`; }
  async upsertProduct(p: Omit<Product, 'image_url'> & { image_url?: string }) {
    const full = { ...p, image_url: p.image_url ?? '' } as Product;
    const i = this.products.findIndex((x) => x.id === p.id); if (i >= 0) this.products[i] = full; else this.products.push(full); return full;
  }
  async kpiSummary() { return { visitors: new Set(this.events.map((e) => e.session_id)).size, reports_total: this.reports.length }; }
  async topEventQueries(ev: string, limit: number) {
    const m = new Map<string, number>();
    for (const e of this.events) if (e.name === ev && typeof e.props.q === 'string') m.set(e.props.q.toLowerCase().trim(), (m.get(e.props.q.toLowerCase().trim()) ?? 0) + 1);
    return [...m].map(([q, n]) => ({ q, n })).sort((a, b) => b.n - a.n).slice(0, limit);
  }
  async thinProducts(_min: number) { return []; }
  async seedCatalog() { return { products: this.products.length, symptoms: this.symptoms.length, cards: this.cards.length, reference_prices: this.refs.length }; }
}

/** Tokens: "user:<id>" authenticates as that user; anything else is rejected. */
export const fakeAuth: AuthVerifier = {
  async verify(t) { return t.startsWith('user:') ? { id: t.slice(5), email: `${t.slice(5)}@example.com` } : null; },
};
