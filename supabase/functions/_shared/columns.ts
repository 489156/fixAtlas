// Explicit column lists. NEVER `select('*')` on user-owned tables: it is how receipts and reporter ids leaked.
// tests/db/columns_contract.test.mjs checks every list against the real schema.
export const PRODUCT_COLS = 'id, slug, category, brand, brand_ko, model_name, alternate_names, release_year, image_url, description';
export const SYMPTOM_COLS = 'id, code, name_ko, name_en, name_zh, risk_level, self_check_allowed, synonyms, categories';
export const CARD_COLS = 'id, product_id, category, symptom_id, title_ko, body_ko, sort_order, safety_level';
export const REF_PRICE_COLS = 'id, product_id, category, brand, item, item_type, price_krw, vat_included, source_name, source_url, date_seen, notes';
export const PUBLIC_REPORT_COLS =
  'id, product_id, symptom_id, country, city, repair_channel, quoted_price, paid_price, currency, repair_item, resolved_status, review_text, verified_status, purchase_year, error_code, created_at';
export const ADMIN_REPORT_COLS = `${PUBLIC_REPORT_COLS}, custom_product, hidden, receipt_path`;
export const POST_COLS = 'id, type, product_id, symptom_id, title, body, status, images, tags, hidden, verified, created_at';
export const COMMENT_COLS = 'id, post_id, body, helpful_count, created_at';
export const PROFILE_COLS = 'id, email, nickname, country, role, created_at';

export const COLUMN_CONTRACT: Record<string, string> = {
  products: PRODUCT_COLS,
  symptoms: SYMPTOM_COLS,
  self_check_cards: CARD_COLS,
  reference_prices: REF_PRICE_COLS,
  repair_reports: ADMIN_REPORT_COLS,
  community_posts: POST_COLS,
  comments: COMMENT_COLS,
  profiles: PROFILE_COLS,
};
