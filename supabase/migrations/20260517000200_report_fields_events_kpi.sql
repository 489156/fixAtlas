-- Report fields required by the RFP, unmapped-product reports, anonymous analytics, KPI functions.

-- ---- repair_reports -------------------------------------------------------
ALTER TABLE public.repair_reports
  ADD COLUMN IF NOT EXISTS purchase_year INT,
  ADD COLUMN IF NOT EXISTS error_code TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS custom_product TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS privacy_consent_at TIMESTAMPTZ;

-- A blank price is "unknown" (NULL), not "0 won". 0 stays valid for free self-fixes.
ALTER TABLE public.repair_reports
  ALTER COLUMN quoted_price DROP NOT NULL, ALTER COLUMN quoted_price DROP DEFAULT,
  ALTER COLUMN paid_price DROP NOT NULL, ALTER COLUMN paid_price DROP DEFAULT;

-- Owners whose model is not in the catalog can still report; an admin maps it later.
ALTER TABLE public.repair_reports ALTER COLUMN product_id DROP NOT NULL;
ALTER TABLE public.repair_reports
  ADD CONSTRAINT repair_reports_product_ref CHECK (product_id IS NOT NULL OR char_length(custom_product) > 0) NOT VALID,
  ADD CONSTRAINT repair_reports_year CHECK (purchase_year IS NULL OR purchase_year BETWEEN 2000 AND 2100) NOT VALID,
  ADD CONSTRAINT repair_reports_extra_len CHECK (char_length(error_code) <= 50 AND char_length(custom_product) <= 100) NOT VALID;

CREATE INDEX IF NOT EXISTS idx_repair_reports_product_symptom ON public.repair_reports (product_id, symptom_id);
CREATE INDEX IF NOT EXISTS idx_repair_reports_user_created ON public.repair_reports (user_id, created_at DESC);

-- ---- events (anonymous product analytics) --------------------------------
-- session_id is a random client-generated id (no PII). Written only by the Edge Function.
CREATE TABLE IF NOT EXISTS public.events (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) <= 40),
  session_id TEXT NOT NULL CHECK (char_length(session_id) BETWEEN 8 AND 64),
  path TEXT NOT NULL DEFAULT '' CHECK (char_length(path) <= 200),
  props JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_events_name_created ON public.events (name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_session_created ON public.events (session_id, created_at);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.events FROM anon, authenticated;
REVOKE ALL ON SEQUENCE public.events_id_seq FROM anon, authenticated;

-- ---- KPI functions (backend only) ----------------------------------------
-- Definitions are deliberately explicit so the numbers can be audited:
--   visitors      = distinct anonymous session ids with any event in the window
--   returning_7d  = of sessions first seen >= 7 days ago, % with an event on a later calendar day
--                   within 7 days of their first event
CREATE OR REPLACE FUNCTION public.kpi_summary(since TIMESTAMPTZ DEFAULT now() - interval '90 days')
RETURNS jsonb
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  WITH first_seen AS (
    SELECT session_id, min(created_at) AS t0 FROM public.events WHERE created_at >= since GROUP BY session_id
  ), cohort AS (
    SELECT * FROM first_seen WHERE t0 <= now() - interval '7 days'
  ), returned AS (
    SELECT DISTINCT c.session_id
      FROM cohort c
      JOIN public.events e
        ON e.session_id = c.session_id
       AND e.created_at::date > c.t0::date
       AND e.created_at <= c.t0 + interval '7 days'
  )
  SELECT jsonb_build_object(
    'since', since,
    'reports_total', (SELECT count(*) FROM public.repair_reports WHERE hidden = false),
    'reports_in_window', (SELECT count(*) FROM public.repair_reports WHERE hidden = false AND created_at >= since),
    'reports_verified', (SELECT count(*) FROM public.repair_reports WHERE verified_status = 'verified' AND hidden = false),
    'reports_unmapped', (SELECT count(*) FROM public.repair_reports WHERE product_id IS NULL),
    'signups', (SELECT count(*) FROM public.profiles WHERE created_at >= since),
    'posts', (SELECT count(*) FROM public.community_posts WHERE hidden = false AND created_at >= since),
    'comments', (SELECT count(*) FROM public.comments WHERE created_at >= since),
    'visitors', (SELECT count(DISTINCT session_id) FROM public.events WHERE created_at >= since),
    'searches', (SELECT count(*) FROM public.events WHERE name = 'search' AND created_at >= since),
    'zero_result_searches', (SELECT count(*) FROM public.events WHERE name = 'search_zero_result' AND created_at >= since),
    'product_views', (SELECT count(*) FROM public.events WHERE name = 'product_view' AND created_at >= since),
    'calculator_uses', (SELECT count(*) FROM public.events WHERE name = 'calculator_used' AND created_at >= since),
    'quote_checks', (SELECT count(*) FROM public.events WHERE name = 'quote_check' AND created_at >= since),
    'submit_starts', (SELECT count(*) FROM public.events WHERE name = 'submit_start' AND created_at >= since),
    'submit_done', (SELECT count(*) FROM public.events WHERE name = 'submit_done' AND created_at >= since),
    'returning_7d_cohort', (SELECT count(*) FROM cohort),
    'returning_7d_pct', (SELECT CASE WHEN count(*) = 0 THEN NULL
                          ELSE round(100.0 * (SELECT count(*) FROM returned) / count(*), 1) END FROM cohort)
  );
$$;

CREATE OR REPLACE FUNCTION public.top_event_queries(
  ev TEXT, lim INT DEFAULT 20, since TIMESTAMPTZ DEFAULT now() - interval '30 days'
)
RETURNS TABLE (q TEXT, n BIGINT)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT lower(btrim(props->>'q')) AS q, count(*) AS n
    FROM public.events
   WHERE name = ev AND created_at >= since AND coalesce(btrim(props->>'q'), '') <> ''
   GROUP BY 1
   ORDER BY n DESC, q
   LIMIT least(greatest(lim, 1), 100);
$$;

-- "데이터 부족 제품" (RFP 8.1): products with fewer than `min_priced` usable priced reports.
CREATE OR REPLACE FUNCTION public.thin_products(min_priced INT DEFAULT 5)
RETURNS TABLE (product_id TEXT, brand TEXT, model_name TEXT, n_reports BIGINT, n_priced BIGINT)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT p.id, p.brand, p.model_name,
         count(r.id) AS n_reports,
         count(r.id) FILTER (WHERE r.paid_price > 0 OR (r.paid_price = 0 AND r.repair_channel = 'self_check')) AS n_priced
    FROM public.products p
    LEFT JOIN public.repair_reports r
      ON r.product_id = p.id AND r.hidden = false AND r.verified_status <> 'rejected'
   GROUP BY p.id, p.brand, p.model_name
  HAVING count(r.id) FILTER (WHERE r.paid_price > 0 OR (r.paid_price = 0 AND r.repair_channel = 'self_check')) < min_priced
   ORDER BY n_reports DESC, p.brand, p.model_name;
$$;

REVOKE ALL ON FUNCTION public.kpi_summary(TIMESTAMPTZ) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.top_event_queries(TEXT, INT, TIMESTAMPTZ) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.thin_products(INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.kpi_summary(TIMESTAMPTZ) TO service_role;
GRANT EXECUTE ON FUNCTION public.top_event_queries(TEXT, INT, TIMESTAMPTZ) TO service_role;
GRANT EXECUTE ON FUNCTION public.thin_products(INT) TO service_role;
