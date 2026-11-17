-- Catalog + content model changes
--   * products: URL slug (SEO), Korean brand name
--   * symptoms: search synonyms, applicable categories
--   * self_check_cards: category-level cards + the RFP's 4-tier safety level
--   * reference_prices: OFFICIAL / PUBLIC-SOURCE price points, kept apart from user reports (cold start)

-- ---- products -------------------------------------------------------------
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS brand_ko TEXT NOT NULL DEFAULT '';

UPDATE public.products
   SET slug = trim(both '-' from lower(regexp_replace(brand || '-' || model_name, '[^a-zA-Z0-9]+', '-', 'g')))
 WHERE slug IS NULL;

ALTER TABLE public.products ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_key ON public.products (slug);

-- ---- symptoms -------------------------------------------------------------
ALTER TABLE public.symptoms
  ADD COLUMN IF NOT EXISTS synonyms JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS categories JSONB NOT NULL DEFAULT '[]'::jsonb;

-- ---- self_check_cards -----------------------------------------------------
ALTER TABLE public.self_check_cards
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS safety_level TEXT NOT NULL DEFAULT 'safe_check'
    CHECK (safety_level IN ('safe_check', 'caution', 'expert_only', 'do_not_diy'));

ALTER TABLE public.self_check_cards ALTER COLUMN product_id DROP NOT NULL;
ALTER TABLE public.self_check_cards
  ADD CONSTRAINT self_check_scope CHECK (product_id IS NOT NULL OR category IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_self_check_category ON public.self_check_cards (category);

-- ---- reference_prices -----------------------------------------------------
-- Prices that a manufacturer/regulator/official store states publicly. Shown in the UI with their
-- source and date, and never mixed into user-report statistics.
CREATE TABLE IF NOT EXISTS public.reference_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES public.products (id) ON DELETE CASCADE,
  category TEXT,
  brand TEXT NOT NULL,
  item TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN
    ('battery', 'consumable', 'part', 'visit_fee', 'inspection_fee', 'shipping_fee', 'warranty')),
  price_krw INT NOT NULL CHECK (price_krw >= 0),
  vat_included BOOLEAN,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL CHECK (source_url ~ '^https://'),
  date_seen DATE NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT reference_prices_scope CHECK (product_id IS NOT NULL OR category IS NOT NULL OR brand <> ''),
  CONSTRAINT reference_prices_unique UNIQUE (brand, item, source_url)
);
CREATE INDEX IF NOT EXISTS idx_reference_prices_product ON public.reference_prices (product_id);
CREATE INDEX IF NOT EXISTS idx_reference_prices_brand ON public.reference_prices (brand);

ALTER TABLE public.reference_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read reference_prices" ON public.reference_prices FOR SELECT USING (true);
