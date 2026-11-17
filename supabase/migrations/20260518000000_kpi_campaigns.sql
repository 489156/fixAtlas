-- Campaign (UTM) attribution for the "collecting blog" stage.
-- The frontend attaches first-touch utm_source/utm_campaign/utm_content as props src/cmp/cnt to every event.
-- Gate metrics (docs/BLOG_PLAN.md): sessions arriving from the blog, and how many of them check a quote or submit.

CREATE INDEX IF NOT EXISTS idx_events_src ON public.events ((props->>'src')) WHERE props ? 'src';

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
  ), tagged AS (
    SELECT * FROM public.events WHERE created_at >= since AND coalesce(props->>'src', '') <> ''
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
                          ELSE round(100.0 * (SELECT count(*) FROM returned) / count(*), 1) END FROM cohort),
    -- campaign-attributed (e.g. blog) traffic
    'campaign_sessions', (SELECT count(DISTINCT session_id) FROM tagged),
    'blog_sessions', (SELECT count(DISTINCT session_id) FROM tagged WHERE props->>'src' = 'naver_blog'),
    'blog_quote_checks', (SELECT count(*) FROM tagged WHERE props->>'src' = 'naver_blog' AND name = 'quote_check'),
    'blog_submit_done', (SELECT count(*) FROM tagged WHERE props->>'src' = 'naver_blog' AND name = 'submit_done')
  );
$$;

CREATE OR REPLACE FUNCTION public.top_campaigns(lim INT DEFAULT 20, since TIMESTAMPTZ DEFAULT now() - interval '30 days')
RETURNS TABLE (src TEXT, cmp TEXT, sessions BIGINT, quote_checks BIGINT, submits BIGINT)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT props->>'src' AS src,
         coalesce(props->>'cmp', '') AS cmp,
         count(DISTINCT session_id) AS sessions,
         count(*) FILTER (WHERE name = 'quote_check') AS quote_checks,
         count(*) FILTER (WHERE name = 'submit_done') AS submits
    FROM public.events
   WHERE created_at >= since AND coalesce(props->>'src', '') <> ''
   GROUP BY 1, 2
   ORDER BY sessions DESC, submits DESC, src, cmp
   LIMIT least(greatest(lim, 1), 100);
$$;

REVOKE ALL ON FUNCTION public.kpi_summary(TIMESTAMPTZ) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.top_campaigns(INT, TIMESTAMPTZ) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.kpi_summary(TIMESTAMPTZ) TO service_role;
GRANT EXECUTE ON FUNCTION public.top_campaigns(INT, TIMESTAMPTZ) TO service_role;
