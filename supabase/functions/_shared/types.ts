// Shared domain types (erasable TypeScript only: runs under Deno and Node type-stripping).

export interface Product {
  id: string;
  slug: string;
  category: string; // 'robot-vacuum' | 'cordless-vacuum'
  brand: string;
  brand_ko: string;
  model_name: string;
  alternate_names: string[];
  release_year: number;
  image_url: string;
  description: string;
}

export interface Symptom {
  id: string;
  code: string;
  name_ko: string;
  name_en: string;
  name_zh: string | null;
  risk_level: 'safe' | 'caution' | 'expert' | 'dangerous';
  self_check_allowed: boolean;
  synonyms: string[];
  categories: string[];
}

export type SafetyLevel = 'safe_check' | 'caution' | 'expert_only' | 'do_not_diy';

export interface SelfCheckCard {
  id: string;
  product_id: string | null;
  category: string | null;
  symptom_id: string | null;
  title_ko: string;
  body_ko: string;
  sort_order: number;
  safety_level: SafetyLevel;
}

/** Columns that may ever be sent to the public. No user_id, no receipt path, no hidden flag. */
export interface PublicReport {
  id: string;
  product_id: string;
  symptom_id: string;
  country: string;
  city: string;
  repair_channel: 'official' | 'third_party' | 'self_check';
  quoted_price: number | null;
  paid_price: number | null;
  currency: string;
  repair_item: string;
  resolved_status: 'resolved' | 'unresolved' | 'recurred';
  review_text: string;
  verified_status: 'reported' | 'verified' | 'rejected';
  purchase_year: number | null;
  error_code: string;
  created_at: string;
}

export interface ReferencePrice {
  id: string;
  product_id: string | null;
  category: string | null;
  brand: string;
  item: string;
  item_type: string;
  price_krw: number;
  vat_included: boolean | null;
  source_name: string;
  source_url: string;
  date_seen: string;
  notes: string;
}
