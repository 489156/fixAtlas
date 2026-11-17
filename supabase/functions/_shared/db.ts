// Data-access contract used by the HTTP layer. Production: db_supabase.ts. Tests: in-memory fake.
import type { Product, Symptom, SelfCheckCard, PublicReport, ReferencePrice } from './types.ts';
import type { ReportInput, PostInput, EventInput } from './validate.ts';

export interface PostRow {
  id: string;
  type: string;
  product_id: string | null;
  symptom_id: string | null;
  title: string;
  body: string;
  status: string;
  images: unknown[];
  tags: unknown[];
  hidden: boolean;
  verified: boolean;
  created_at: string;
}

export interface CommentRow {
  id: string;
  post_id: string;
  body: string;
  helpful_count: number;
  created_at: string;
}

export interface Profile {
  id: string;
  email?: string | null;
  nickname: string;
  country: string;
  role: 'user' | 'admin' | 'moderator';
  created_at?: string;
}

/** Admin view of a report: still no reporter id; receipt is only a boolean flag (URL is minted on demand). */
export interface AdminReport extends Omit<PublicReport, 'product_id'> {
  product_id: string | null;
  custom_product: string;
  hidden: boolean;
  has_receipt: boolean;
}

export interface Db {
  // catalog
  listProducts(category?: string): Promise<Product[]>;
  getProductByKey(idOrSlug: string): Promise<Product | null>;
  listSymptoms(): Promise<Symptom[]>;
  listSelfCheckCards(product: Product): Promise<SelfCheckCard[]>;
  listReferencePrices(product: Product): Promise<ReferencePrice[]>;
  // reports
  listPublicReportsForProduct(productId: string, limit: number): Promise<PublicReport[]>;
  listRecentPublicReports(limit: number): Promise<PublicReport[]>;
  countReportsSince(userId: string, sinceIso: string): Promise<number>;
  insertReport(userId: string, input: ReportInput, consentAtIso: string): Promise<PublicReport>;
  // community
  listPosts(type?: string): Promise<PostRow[]>;
  getPost(id: string): Promise<PostRow | null>;
  listComments(postId: string): Promise<CommentRow[]>;
  insertPost(userId: string, input: PostInput): Promise<PostRow>;
  insertComment(userId: string, postId: string, body: string): Promise<CommentRow>;
  countPostsSince(userId: string, sinceIso: string): Promise<number>;
  countCommentsSince(userId: string, sinceIso: string): Promise<number>;
  markCommentHelpful(commentId: string, userId: string): Promise<CommentRow | null>;
  // users
  getProfile(userId: string): Promise<Profile | null>;
  // analytics
  insertEvents(sessionId: string, events: EventInput[]): Promise<void>;
  // admin
  adminOverview(): Promise<{ products: Product[]; symptoms: Symptom[]; reports: AdminReport[]; posts: PostRow[]; users: Profile[] }>;
  setPostFlags(id: string, patch: { hidden?: boolean; verified?: boolean }): Promise<PostRow | null>;
  updateReport(id: string, patch: { verified_status?: string; hidden?: boolean; product_id?: string }): Promise<AdminReport | null>;
  getReceiptPath(reportId: string): Promise<string | null>;
  signReceiptUrl(path: string, seconds: number): Promise<string | null>;
  upsertProduct(p: Omit<Product, 'image_url'> & { image_url?: string }): Promise<Product>;
  kpiSummary(): Promise<Record<string, unknown>>;
  topEventQueries(eventName: string, limit: number): Promise<{ q: string; n: number }[]>;
  thinProducts(minPriced: number): Promise<{ product_id: string; brand: string; model_name: string; n_reports: number; n_priced: number }[]>;
  seedCatalog(): Promise<{ products: number; symptoms: number; cards: number; reference_prices: number }>;
}

export interface AuthVerifier {
  verify(accessToken: string): Promise<{ id: string; email?: string | null } | null>;
}
