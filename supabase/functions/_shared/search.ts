// Query parser + ranker for the product/symptom catalog.
// Replaces the old "whole query must be a substring of the product blob" matching, which returned
// zero results for every example in the RFP (Korean brand names, mixed product+symptom phrases).
import type { Product, Symptom } from './types.ts';
import { BRAND_ALIASES, CATEGORY_WORDS, STOPWORDS } from './aliases.ts';

export function normalize(s: string): string {
  return s
    .normalize('NFKC')
    .toLowerCase()
    .replace(/([가-힣])([a-z0-9])/g, '$1 $2')
    .replace(/([a-z0-9+])([가-힣])/g, '$1 $2')
    .replace(/[^\p{L}\p{N}+]+/gu, ' ')
    .trim();
}

const compact = (s: string) => normalize(s).replace(/\s+/g, '');

function phraseRegex(phrase: string): RegExp {
  const chars = [...normalize(phrase).replace(/\s+/g, '')].map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(chars.join('\\s*'), 'u');
}

export interface SearchHit {
  product: Product;
  score: number;
  matched: { brand: boolean; model: boolean; category: boolean };
}

export interface SearchResult {
  products: SearchHit[];
  symptoms: Symptom[];
  parsed: {
    brands: string[];
    category: string | null;
    model_tokens: string[];
    unmatched_models: string[];
    symptom_ids: string[];
    error_code_tokens: string[];
  };
  /** 'ok' | 'symptom_only' | 'brand_fallback' | 'empty_query' | 'no_match' */
  reason: string;
}

const isHangul = (t: string) => /[가-힣]/.test(t);
const looksLikeModel = (t: string) => /\d/.test(t) && /[a-z]/.test(t);

function modelTokens(p: Product): Set<string> {
  const set = new Set<string>();
  for (const part of [p.model_name, ...(p.alternate_names ?? [])]) {
    for (const t of normalize(part).split(' ')) if (t) set.add(t);
  }
  return set;
}

export function searchCatalog(rawQuery: string, products: Product[], symptoms: Symptom[]): SearchResult {
  const empty: SearchResult = {
    products: [],
    symptoms: [],
    parsed: { brands: [], category: null, model_tokens: [], unmatched_models: [], symptom_ids: [], error_code_tokens: [] },
    reason: 'empty_query',
  };
  let q = normalize(rawQuery ?? '');
  if (!q) return empty;

  // 1) Symptoms: longest phrase first, consume the matched text so it is not read as a product token.
  const phrases: { symptom: Symptom; phrase: string }[] = [];
  for (const s of symptoms) {
    for (const ph of [s.name_ko, s.name_en, ...(s.synonyms ?? [])]) {
      if (compact(ph).length >= 3) phrases.push({ symptom: s, phrase: ph });
    }
  }
  phrases.sort((a, b) => compact(b.phrase).length - compact(a.phrase).length);
  const hitSymptoms = new Map<string, Symptom>();
  for (const { symptom, phrase } of phrases) {
    const re = phraseRegex(phrase);
    if (re.test(q)) {
      hitSymptoms.set(symptom.id, symptom);
      q = q.replace(re, ' ').replace(/\s+/g, ' ').trim();
    }
  }

  // 2) Remaining tokens -> brand / category / model / noise
  const tokens = q.split(' ').filter((t) => t && !STOPWORDS.has(t));
  const brands = new Set<string>();
  let category: string | null = null;
  const modelish: string[] = [];
  const errorCodeTokens: string[] = [];

  for (const t of tokens) {
    let used = false;
    for (const [brand, aliases] of Object.entries(BRAND_ALIASES)) {
      const minPrefix = isHangul(t) ? 2 : 3;
      if (aliases.includes(t) || (t.length >= minPrefix && aliases.some((a) => a.startsWith(t)))) {
        brands.add(brand);
        used = true;
      }
    }
    for (const [cat, words] of Object.entries(CATEGORY_WORDS)) {
      if (words.includes(t)) {
        category = cat;
        used = true;
      }
    }
    if (used) continue;
    if (/^\d+$/.test(t)) errorCodeTokens.push(t);
    else modelish.push(t);
  }

  // 3) Score products
  const pool = products.filter(
    (p) => (brands.size === 0 || brands.has(p.brand.toLowerCase())) && (!category || p.category === category),
  );
  const scored: SearchHit[] = pool.map((p) => {
    const mt = modelTokens(p);
    const desc = normalize(p.description ?? '');
    let score = 0;
    let modelHit = false;
    for (const t of modelish) {
      if (mt.has(t)) {
        score += 4;
        modelHit = true;
      } else if (t.length >= 2 && [...mt].some((m) => m.startsWith(t))) {
        score += 2;
        modelHit = true;
      } else if (t.length >= 3 && desc.includes(t)) {
        score += 0.5;
      }
    }
    const brandHit = brands.has(p.brand.toLowerCase());
    if (brandHit) score += 3;
    if (category && p.category === category) score += 1;
    return { product: p, score, matched: { brand: brandHit, model: modelHit, category: !!category && p.category === category } };
  });

  const modelQueryTokens = modelish.filter(looksLikeModel);
  const anyModelHit = scored.some((h) => h.matched.model);
  const unmatchedModels = modelQueryTokens.filter((t) => !scored.some((h) => {
    const mt = modelTokens(h.product);
    return mt.has(t) || [...mt].some((m) => m.startsWith(t));
  }));

  let hits: SearchHit[];
  let reason = 'ok';
  if (modelish.length > 0 && anyModelHit) {
    hits = scored.filter((h) => h.matched.model);
  } else if (brands.size > 0 || category) {
    // brand/category given but the model (if any) is not in the catalog -> show the brand's models
    hits = scored;
    if (modelish.length > 0) reason = 'brand_fallback';
  } else if (modelish.length > 0) {
    // free text with no brand/category/model hit: weak description-only matches
    hits = scored.filter((h) => h.score > 0);
  } else {
    hits = [];
  }

  hits.sort((a, b) => b.score - a.score || a.product.brand.localeCompare(b.product.brand) || a.product.model_name.localeCompare(b.product.model_name));

  // Symptom-only query: offer every product so the user can pick theirs (instead of a dead end).
  if (hits.length === 0 && hitSymptoms.size > 0 && brands.size === 0 && !category && modelish.length === 0) {
    hits = products
      .map((p) => ({ product: p, score: 0, matched: { brand: false, model: false, category: false } }))
      .filter((h) => [...hitSymptoms.values()].some((s) => (s.categories ?? []).length === 0 || s.categories.includes(h.product.category)))
      .sort((a, b) => a.product.brand.localeCompare(b.product.brand));
    reason = 'symptom_only';
  }

  if (hits.length === 0 && hitSymptoms.size === 0) reason = 'no_match';

  return {
    products: hits.slice(0, 12),
    symptoms: [...hitSymptoms.values()],
    parsed: {
      brands: [...brands],
      category,
      model_tokens: modelish,
      unmatched_models: unmatchedModels,
      symptom_ids: [...hitSymptoms.keys()],
      error_code_tokens: errorCodeTokens,
    },
    reason,
  };
}
