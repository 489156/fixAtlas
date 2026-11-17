// Supabase (PostgREST) implementation of the Db contract. Runs with the service role inside the Edge Function.
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Db, PostRow, CommentRow, Profile, AdminReport } from './db.ts';
import type { Product, Symptom, SelfCheckCard, PublicReport, ReferencePrice } from './types.ts';
import type { ReportInput, PostInput, EventInput } from './validate.ts';
import {
  PRODUCT_COLS, SYMPTOM_COLS, CARD_COLS, REF_PRICE_COLS, PUBLIC_REPORT_COLS, ADMIN_REPORT_COLS,
  POST_COLS, COMMENT_COLS, PROFILE_COLS,
} from './columns.ts';
import { SYMPTOMS, PRODUCTS, SELF_CHECK_CARDS, cardBody } from './seed.ts';
import { REFERENCE_PRICES } from './reference_prices_seed.ts';

// deno-lint-ignore no-explicit-any
type Row = Record<string, any>;

function must<T>(res: { data: T | null; error: { message: string } | null }, what: string): T {
  if (res.error) throw new Error(`${what}: ${res.error.message}`);
  return (res.data ?? ([] as unknown)) as T;
}

const asProduct = (r: Row): Product => ({ ...(r as Product), alternate_names: Array.isArray(r.alternate_names) ? r.alternate_names : [] });
const asSymptom = (r: Row): Symptom => ({ ...(r as Symptom), synonyms: Array.isArray(r.synonyms) ? r.synonyms : [], categories: Array.isArray(r.categories) ? r.categories : [] });

export function makeSupabaseDb(sb: SupabaseClient): Db {
  const count = async (table: string, userId: string, sinceIso: string) => {
    const { count: n, error } = await sb.from(table).select('id', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', sinceIso);
    if (error) throw new Error(`count ${table}: ${error.message}`);
    return n ?? 0;
  };
  const toAdmin = (r: Row): AdminReport => {
    const { receipt_path, ...rest } = r;
    return { ...(rest as Omit<AdminReport, 'has_receipt'>), has_receipt: Boolean(receipt_path) };
  };

  return {
    async listProducts(category) {
      let q = sb.from('products').select(PRODUCT_COLS).order('brand').order('model_name');
      if (category) q = q.eq('category', category);
      return must<Row[]>(await q, 'products').map(asProduct);
    },
    async getProductByKey(key) {
      for (const col of ['id', 'slug']) {
        const { data, error } = await sb.from('products').select(PRODUCT_COLS).eq(col, key).maybeSingle();
        if (error) throw new Error(`product: ${error.message}`);
        if (data) return asProduct(data as Row);
      }
      return null;
    },
    async listSymptoms() {
      return must<Row[]>(await sb.from('symptoms').select(SYMPTOM_COLS).order('id'), 'symptoms').map(asSymptom);
    },
    async listSelfCheckCards(product) {
      const [own, cat] = await Promise.all([
        sb.from('self_check_cards').select(CARD_COLS).eq('product_id', product.id),
        sb.from('self_check_cards').select(CARD_COLS).is('product_id', null).eq('category', product.category),
      ]);
      const rows = [...must<Row[]>(own, 'cards'), ...must<Row[]>(cat, 'cards')] as SelfCheckCard[];
      return rows.sort((a, b) => a.sort_order - b.sort_order);
    },
    async listReferencePrices(product) {
      const [own, brand] = await Promise.all([
        sb.from('reference_prices').select(REF_PRICE_COLS).eq('product_id', product.id),
        sb.from('reference_prices').select(REF_PRICE_COLS).is('product_id', null).eq('brand', product.brand),
      ]);
      const rows = [...must<Row[]>(own, 'ref'), ...must<Row[]>(brand, 'ref')] as ReferencePrice[];
      return rows.filter((r) => !r.category || r.category === product.category).sort((a, b) => a.item_type.localeCompare(b.item_type) || a.price_krw - b.price_krw);
    },

    async listPublicReportsForProduct(productId, limit) {
      return must<PublicReport[]>(
        await sb.from('repair_reports').select(PUBLIC_REPORT_COLS).eq('product_id', productId).eq('hidden', false)
          .neq('verified_status', 'rejected').order('created_at', { ascending: false }).limit(limit),
        'reports',
      );
    },
    async listRecentPublicReports(limit) {
      return must<PublicReport[]>(
        await sb.from('repair_reports').select(PUBLIC_REPORT_COLS).not('product_id', 'is', null).eq('hidden', false)
          .neq('verified_status', 'rejected').order('created_at', { ascending: false }).limit(limit),
        'recent reports',
      );
    },
    countReportsSince: (uid, since) => count('repair_reports', uid, since),
    async insertReport(userId, i: ReportInput, consentAtIso) {
      const row = {
        user_id: userId, product_id: i.product_id, custom_product: i.custom_product, symptom_id: i.symptom_id,
        country: i.country, city: i.city, repair_channel: i.repair_channel, quoted_price: i.quoted_price,
        paid_price: i.paid_price, currency: i.currency, repair_item: i.repair_item, resolved_status: i.resolved_status,
        review_text: i.review_text, receipt_path: i.receipt_path, purchase_year: i.purchase_year, error_code: i.error_code,
        verified_status: 'reported', privacy_consent_at: consentAtIso,
      };
      const { data, error } = await sb.from('repair_reports').insert(row).select(PUBLIC_REPORT_COLS).single();
      if (error) throw new Error(`insert report: ${error.message}`);
      return data as unknown as PublicReport;
    },

    async listPosts(type) {
      let q = sb.from('community_posts').select(POST_COLS).eq('hidden', false).order('created_at', { ascending: false }).limit(200);
      if (type) q = q.eq('type', type);
      return must<PostRow[]>(await q, 'posts');
    },
    async getPost(id) {
      const { data, error } = await sb.from('community_posts').select(POST_COLS).eq('id', id).maybeSingle();
      if (error) return null; // malformed uuid etc. -> not found
      return (data as unknown as PostRow) ?? null;
    },
    async listComments(postId) {
      return must<CommentRow[]>(await sb.from('comments').select(COMMENT_COLS).eq('post_id', postId).order('created_at'), 'comments');
    },
    async insertPost(userId, p: PostInput) {
      const row = { user_id: userId, type: p.type, product_id: p.product_id, symptom_id: p.symptom_id, title: p.title, body: p.body, status: p.status, images: [], tags: p.tags };
      const { data, error } = await sb.from('community_posts').insert(row).select(POST_COLS).single();
      if (error) throw new Error(`insert post: ${error.message}`);
      return data as unknown as PostRow;
    },
    async insertComment(userId, postId, body) {
      const { data, error } = await sb.from('comments').insert({ post_id: postId, user_id: userId, body }).select(COMMENT_COLS).single();
      if (error) throw new Error(`insert comment: ${error.message}`);
      return data as unknown as CommentRow;
    },
    countPostsSince: (uid, since) => count('community_posts', uid, since),
    countCommentsSince: (uid, since) => count('comments', uid, since),
    async markCommentHelpful(commentId, userId) {
      const { data, error } = await sb.rpc('mark_comment_helpful', { cid: commentId, uid: userId });
      if (error) {
        if (/invalid input syntax for type uuid/i.test(error.message)) return null;
        throw new Error(`helpful: ${error.message}`);
      }
      const r = (Array.isArray(data) ? data[0] : data) as Row | null;
      return r ? { id: r.id, post_id: r.post_id, body: r.body, helpful_count: r.helpful_count, created_at: r.created_at } : null;
    },

    async getProfile(userId) {
      const { data, error } = await sb.from('profiles').select(PROFILE_COLS).eq('id', userId).maybeSingle();
      if (error) throw new Error(`profile: ${error.message}`);
      return (data as unknown as Profile) ?? null;
    },

    async insertEvents(sessionId, events: EventInput[]) {
      const rows = events.map((e) => ({ name: e.name, session_id: sessionId, path: e.path, props: e.props }));
      const { error } = await sb.from('events').insert(rows);
      if (error) throw new Error(`events: ${error.message}`);
    },

    async adminOverview() {
      const [products, symptoms, reports, posts, users] = await Promise.all([
        sb.from('products').select(PRODUCT_COLS).order('brand'),
        sb.from('symptoms').select(SYMPTOM_COLS).order('id'),
        sb.from('repair_reports').select(ADMIN_REPORT_COLS).order('created_at', { ascending: false }).limit(200),
        sb.from('community_posts').select(POST_COLS).order('created_at', { ascending: false }).limit(200),
        sb.from('profiles').select(PROFILE_COLS).order('created_at', { ascending: false }).limit(500),
      ]);
      return {
        products: must<Row[]>(products, 'admin products').map(asProduct),
        symptoms: must<Row[]>(symptoms, 'admin symptoms').map(asSymptom),
        reports: must<Row[]>(reports, 'admin reports').map(toAdmin),
        posts: must<PostRow[]>(posts, 'admin posts'),
        users: must<Profile[]>(users, 'admin users'),
      };
    },
    async setPostFlags(id, patch) {
      const { data, error } = await sb.from('community_posts').update(patch).eq('id', id).select(POST_COLS).maybeSingle();
      if (error) throw new Error(`post flags: ${error.message}`);
      return (data as unknown as PostRow) ?? null;
    },
    async updateReport(id, patch) {
      const { data, error } = await sb.from('repair_reports').update(patch).eq('id', id).select(ADMIN_REPORT_COLS).maybeSingle();
      if (error) throw new Error(`update report: ${error.message}`);
      return data ? toAdmin(data as Row) : null;
    },
    async getReceiptPath(reportId) {
      const { data } = await sb.from('repair_reports').select('receipt_path').eq('id', reportId).maybeSingle();
      return (data as Row | null)?.receipt_path || null;
    },
    async signReceiptUrl(path, seconds) {
      const { data, error } = await sb.storage.from('receipts').createSignedUrl(path, seconds);
      return error ? null : data?.signedUrl ?? null;
    },
    async upsertProduct(p) {
      const { data, error } = await sb.from('products').upsert({ ...p, image_url: p.image_url ?? '' }, { onConflict: 'id' }).select(PRODUCT_COLS).single();
      if (error) throw new Error(`upsert product: ${error.message}`);
      return asProduct(data as Row);
    },

    async kpiSummary() {
      const { data, error } = await sb.rpc('kpi_summary');
      if (error) throw new Error(`kpi: ${error.message}`);
      return (data ?? {}) as Record<string, unknown>;
    },
    async topEventQueries(eventName, limit) {
      const { data, error } = await sb.rpc('top_event_queries', { ev: eventName, lim: limit });
      if (error) throw new Error(`top queries: ${error.message}`);
      return ((data ?? []) as Row[]).map((r) => ({ q: String(r.q), n: Number(r.n) }));
    },
    async thinProducts(minPriced) {
      const { data, error } = await sb.rpc('thin_products', { min_priced: minPriced });
      if (error) throw new Error(`thin products: ${error.message}`);
      return ((data ?? []) as Row[]).map((r) => ({ product_id: r.product_id, brand: r.brand, model_name: r.model_name, n_reports: Number(r.n_reports), n_priced: Number(r.n_priced) }));
    },

    // Idempotent: upserts catalog rows, replaces category-level cards, removes the old TODO placeholder cards.
    async seedCatalog() {
      const symptoms = SYMPTOMS.map((s) => ({ ...s, synonyms: [...s.synonyms], categories: [...s.categories] }));
      must(await sb.from('symptoms').upsert(symptoms, { onConflict: 'id' }), 'seed symptoms');
      const products = PRODUCTS.map((p) => ({ ...p, alternate_names: [...p.alternate_names], image_url: '' }));
      must(await sb.from('products').upsert(products, { onConflict: 'id' }), 'seed products');

      must(await sb.from('self_check_cards').delete().in('product_id', products.map((p) => p.id)).ilike('body_ko', '%TODO%'), 'drop legacy cards');
      must(await sb.from('self_check_cards').delete().is('product_id', null).in('category', ['robot-vacuum', 'cordless-vacuum']), 'drop category cards');
      const codeToId = new Map(SYMPTOMS.map((s) => [s.code, s.id]));
      const cards = SELF_CHECK_CARDS.map((c, i) => ({
        product_id: null, category: c.category, symptom_id: c.symptom_code ? codeToId.get(c.symptom_code) ?? null : null,
        title_ko: c.title_ko, body_ko: cardBody(c), safety_level: c.safety_level, sort_order: c.symptom_code ? 10 + i : 0,
      }));
      must(await sb.from('self_check_cards').insert(cards), 'seed cards');

      const slugToId = new Map(PRODUCTS.map((p) => [p.slug, p.id]));
      const refs = REFERENCE_PRICES.map((r) => ({
        product_id: r.product_slug ? slugToId.get(r.product_slug) ?? null : null, category: r.category, brand: r.brand,
        item: r.item, item_type: r.item_type, price_krw: r.price_krw, vat_included: r.vat_included,
        source_name: r.source_name, source_url: r.source_url, date_seen: r.date_seen, notes: r.notes,
      }));
      if (refs.length) must(await sb.from('reference_prices').upsert(refs, { onConflict: 'brand,item,source_url' }), 'seed reference prices');
      return { products: products.length, symptoms: symptoms.length, cards: cards.length, reference_prices: refs.length };
    },
  };
}
