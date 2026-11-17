// Server-side input validation. The client is never trusted; DB CHECK constraints are the last gate.

export const COUNTRIES = ['한국', '미국', '중국', '일본', '기타'] as const;
export const CHANNELS = ['official', 'third_party', 'self_check'] as const;
export const RESOLVED = ['resolved', 'unresolved', 'recurred'] as const;
export const CURRENCIES = ['KRW', 'USD', 'CNY', 'JPY', 'EUR'] as const;
export const POST_TYPES = ['question', 'report', 'solved', 'repair_or_replace'] as const;
export const POST_STATUSES = ['open', 'solved', 'unresolved', 'recurred'] as const;
export const REPORT_STATUSES = ['reported', 'verified', 'rejected'] as const;

/** Allowed analytics events. Anything else is dropped. */
export const EVENT_NAMES = [
  'page_view', 'search', 'search_zero_result', 'product_view', 'calculator_used', 'self_check_view',
  'quote_check', 'submit_start', 'submit_done', 'product_request', 'login_prompt', 'share_click',
] as const;

export const LIMITS = { reportsPerDay: 10, postsPerDay: 20, commentsPerDay: 60, eventsPerBatch: 20 } as const;

export type Result<T> = { ok: true; value: T } | { ok: false; errors: string[] };

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);
const str = (x: unknown, max: number): string | null => (typeof x === 'string' && x.trim().length <= max ? x.trim() : null);
const oneOf = <T extends readonly string[]>(x: unknown, list: T): T[number] | null =>
  typeof x === 'string' && (list as readonly string[]).includes(x) ? (x as T[number]) : null;

function price(x: unknown): number | null | 'invalid' {
  if (x === null || x === undefined || x === '') return null;
  const n = typeof x === 'number' ? x : Number(x);
  if (!Number.isFinite(n) || n < 0 || n > 1_000_000_000) return 'invalid';
  return Math.round(n * 100) / 100;
}

export interface ReportInput {
  product_id: string | null;
  custom_product: string;
  symptom_id: string;
  country: string;
  city: string;
  repair_channel: (typeof CHANNELS)[number];
  quoted_price: number | null;
  paid_price: number | null;
  currency: (typeof CURRENCIES)[number];
  repair_item: string;
  resolved_status: (typeof RESOLVED)[number];
  review_text: string;
  receipt_path: string;
  purchase_year: number | null;
  error_code: string;
}

export function parseReport(body: unknown, userId: string, now = new Date()): Result<ReportInput> {
  const errors: string[] = [];
  if (!isObj(body)) return { ok: false, errors: ['요청 형식이 올바르지 않습니다.'] };

  const product_id = body.product_id ? str(body.product_id, 100) : null;
  const custom_product = body.custom_product ? str(body.custom_product, 100) ?? '' : '';
  if (!product_id && !custom_product) errors.push('제품을 선택하거나 제품명을 직접 입력해 주세요.');
  const symptom_id = str(body.symptom_id, 100);
  if (!symptom_id) errors.push('증상을 선택해 주세요.');

  const country = oneOf(body.country, COUNTRIES);
  if (!country) errors.push('국가를 선택해 주세요.');
  const repair_channel = oneOf(body.repair_channel, CHANNELS);
  if (!repair_channel) errors.push('수리 경로를 선택해 주세요.');
  const resolved_status = oneOf(body.resolved_status, RESOLVED);
  if (!resolved_status) errors.push('해결 여부를 선택해 주세요.');
  const currency = oneOf(body.currency, CURRENCIES);
  if (!currency) errors.push('통화를 선택해 주세요.');

  const quoted = price(body.quoted_price);
  const paid = price(body.paid_price);
  if (quoted === 'invalid' || paid === 'invalid') errors.push('금액은 0 이상 10억 이하의 숫자여야 합니다.');
  // Typical data-entry slip: typing "13" meaning 13만원. Tiny non-zero KRW amounts are rejected.
  if (currency === 'KRW') {
    for (const v of [quoted, paid]) {
      if (typeof v === 'number' && v > 0 && v < 1000) errors.push('금액을 원 단위로 입력해 주세요. (예: 13만원 → 130000)');
    }
  }

  let purchase_year: number | null = null;
  if (body.purchase_year !== undefined && body.purchase_year !== null && body.purchase_year !== '') {
    const y = Number(body.purchase_year);
    if (!Number.isInteger(y) || y < 2000 || y > now.getFullYear()) errors.push('구매연도가 올바르지 않습니다.');
    else purchase_year = y;
  }

  const city = body.city ? str(body.city, 100) : '';
  const repair_item = body.repair_item ? str(body.repair_item, 200) : '';
  const review_text = body.review_text ? str(body.review_text, 2000) : '';
  const error_code = body.error_code ? str(body.error_code, 50) : '';
  if (city === null) errors.push('도시는 100자 이하로 입력해 주세요.');
  if (repair_item === null) errors.push('수리항목은 200자 이하로 입력해 주세요.');
  if (review_text === null) errors.push('후기는 2000자 이하로 입력해 주세요.');
  if (error_code === null) errors.push('에러코드는 50자 이하로 입력해 주세요.');

  if (body.privacy_consent !== true) errors.push('개인정보 수집·이용에 동의해 주세요.');

  let receipt_path = '';
  if (body.receipt_path) {
    const p = str(body.receipt_path, 300);
    // Must live in the caller's own folder of the private bucket; no traversal.
    if (!p || !p.startsWith(`${userId}/`) || p.includes('..') || p.includes('//')) errors.push('영수증 경로가 올바르지 않습니다.');
    else receipt_path = p;
  }

  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      product_id,
      custom_product,
      symptom_id: symptom_id as string,
      country: country as string,
      city: city ?? '',
      repair_channel: repair_channel as ReportInput['repair_channel'],
      quoted_price: quoted as number | null,
      paid_price: paid as number | null,
      currency: currency as ReportInput['currency'],
      repair_item: repair_item ?? '',
      resolved_status: resolved_status as ReportInput['resolved_status'],
      review_text: review_text ?? '',
      receipt_path,
      purchase_year,
      error_code: error_code ?? '',
    },
  };
}

export interface PostInput {
  type: (typeof POST_TYPES)[number];
  product_id: string | null;
  symptom_id: string | null;
  title: string;
  body: string;
  status: (typeof POST_STATUSES)[number];
  tags: string[];
}

export function parsePost(input: unknown): Result<PostInput> {
  const errors: string[] = [];
  if (!isObj(input)) return { ok: false, errors: ['요청 형식이 올바르지 않습니다.'] };
  const type = oneOf(input.type, POST_TYPES);
  if (!type) errors.push('게시글 유형이 올바르지 않습니다.');
  const status = input.status ? oneOf(input.status, POST_STATUSES) : 'open';
  if (!status) errors.push('게시글 상태가 올바르지 않습니다.');
  const title = str(input.title, 200);
  const body = str(input.body, 10000);
  if (!title) errors.push('제목을 1~200자로 입력해 주세요.');
  if (!body) errors.push('본문을 1~10000자로 입력해 주세요.');
  const tags = Array.isArray(input.tags) ? input.tags.filter((t): t is string => typeof t === 'string' && t.length <= 30).slice(0, 10) : [];
  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      type: type as PostInput['type'],
      product_id: input.product_id ? String(input.product_id).slice(0, 100) : null,
      symptom_id: input.symptom_id ? String(input.symptom_id).slice(0, 100) : null,
      title: title as string,
      body: body as string,
      status: status as PostInput['status'],
      tags,
    },
  };
}

export function parseComment(input: unknown): Result<{ post_id: string; body: string }> {
  if (!isObj(input)) return { ok: false, errors: ['요청 형식이 올바르지 않습니다.'] };
  const post_id = str(input.post_id, 64);
  const body = str(input.body, 2000);
  const errors: string[] = [];
  if (!post_id) errors.push('게시글이 올바르지 않습니다.');
  if (!body) errors.push('댓글을 1~2000자로 입력해 주세요.');
  return errors.length ? { ok: false, errors } : { ok: true, value: { post_id: post_id as string, body: body as string } };
}

export interface EventInput {
  name: (typeof EVENT_NAMES)[number];
  path: string;
  props: Record<string, string | number | boolean>;
}

/** Anonymous analytics: allow-listed names, primitive props only, bounded sizes. No PII fields accepted. */
export function parseEvents(body: unknown): { session_id: string; events: EventInput[] } | null {
  if (!isObj(body)) return null;
  const session_id = typeof body.session_id === 'string' && /^[A-Za-z0-9_-]{8,64}$/.test(body.session_id) ? body.session_id : null;
  if (!session_id || !Array.isArray(body.events)) return null;
  const events: EventInput[] = [];
  for (const e of body.events.slice(0, LIMITS.eventsPerBatch)) {
    if (!isObj(e)) continue;
    const name = oneOf(e.name, EVENT_NAMES);
    if (!name) continue;
    const props: EventInput['props'] = {};
    if (isObj(e.props)) {
      for (const [k, v] of Object.entries(e.props).slice(0, 12)) {
        if (!/^[a-z_]{1,32}$/.test(k)) continue;
        if (typeof v === 'string') props[k] = v.slice(0, 200);
        else if (typeof v === 'number' && Number.isFinite(v)) props[k] = v;
        else if (typeof v === 'boolean') props[k] = v;
      }
    }
    events.push({ name, path: typeof e.path === 'string' ? e.path.slice(0, 200) : '', props });
  }
  return { session_id, events };
}
