-- FixAtlas security hardening
--
-- Fixes (each reproduced on a real PostgreSQL with Supabase-style default grants, see tests/db):
--   1. Any signed-in user could `UPDATE profiles SET role='admin'` on their own row.
--   2. `repair_reports` was world-readable, exposing reporter user_id and 1-year signed receipt URLs.
--   3. `increment_comment_helpful` stayed callable by anon/authenticated (REVOKE FROM PUBLIC does not
--      remove the direct grants that Supabase default privileges add) and had no per-user de-duplication.
--   4. No server-side bounds on prices / lengths / enum-like text columns.
--   5. Receipt bucket had no size or MIME limit.
--
-- INCIDENT NOTE: signed receipt URLs issued before this migration stay valid until they expire (up to a
-- year). Treat every receipt uploaded before this point as exposed: re-key the objects in the `receipts`
-- bucket (move to new paths) or delete them, and tell affected users if real receipts were collected.

-- ---------------------------------------------------------------------------
-- 0. Least privilege: browser roles never write tables directly (all writes go through the Edge Function
--    using the service role). RLS stays enabled as a second gate.
-- ---------------------------------------------------------------------------
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLES FROM anon, authenticated;

-- ---------------------------------------------------------------------------
-- 1. profiles: users may edit only nickname/country of their own row. `role` is not writable.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
GRANT UPDATE (nickname, country) ON public.profiles TO authenticated;
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
REVOKE SELECT ON public.profiles FROM anon;

-- Defense in depth: even if a future migration re-grants UPDATE, browser roles still cannot change role.
CREATE OR REPLACE FUNCTION public.profiles_block_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND current_user IN ('anon', 'authenticated') THEN
    RAISE EXCEPTION 'profiles.role can only be changed by a privileged backend'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_block_role_change ON public.profiles;
CREATE TRIGGER profiles_block_role_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.profiles_block_role_change();

-- ---------------------------------------------------------------------------
-- 2. repair_reports: private by default. The Edge Function (service role) serves an explicit,
--    privacy-safe column list. Receipts are stored as bucket paths; signed URLs are minted on demand
--    for admins only, never persisted.
-- ---------------------------------------------------------------------------
ALTER TABLE public.repair_reports
  ADD COLUMN IF NOT EXISTS receipt_path TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hidden BOOLEAN NOT NULL DEFAULT false;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'repair_reports' AND column_name = 'receipt_image_url'
  ) THEN
    -- Signed URL -> bucket path
    UPDATE public.repair_reports
       SET receipt_path = regexp_replace(split_part(receipt_image_url, '?', 1), '^.*/receipts/', '')
     WHERE receipt_image_url LIKE '%/object/sign/receipts/%' AND receipt_path = '';
    -- Older client code stored the raw path when signing failed
    UPDATE public.repair_reports
       SET receipt_path = receipt_image_url
     WHERE receipt_image_url <> '' AND receipt_image_url NOT LIKE 'http%' AND receipt_path = '';
    ALTER TABLE public.repair_reports DROP COLUMN receipt_image_url;
  END IF;
END
$$;

DROP POLICY IF EXISTS "Public read repair_reports" ON public.repair_reports;
REVOKE ALL ON public.repair_reports FROM anon, authenticated;

-- Hide reporter identity on the other public tables as well (column-level privileges).
REVOKE SELECT ON public.community_posts FROM anon, authenticated;
GRANT SELECT (id, type, product_id, symptom_id, title, body, status, images, tags, hidden, verified, created_at)
  ON public.community_posts TO anon, authenticated;
REVOKE SELECT ON public.comments FROM anon, authenticated;
GRANT SELECT (id, post_id, body, helpful_count, created_at) ON public.comments TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. "Helpful" votes: one per user per comment, executable only by the backend.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comment_helpful (
  comment_id UUID NOT NULL REFERENCES public.comments (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (comment_id, user_id)
);
ALTER TABLE public.comment_helpful ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.comment_helpful FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.mark_comment_helpful(cid uuid, uid uuid)
RETURNS SETOF public.comments
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.comments WHERE id = cid) THEN
    RETURN;
  END IF;
  INSERT INTO public.comment_helpful (comment_id, user_id) VALUES (cid, uid) ON CONFLICT DO NOTHING;
  IF FOUND THEN
    UPDATE public.comments SET helpful_count = helpful_count + 1 WHERE id = cid;
  END IF;
  RETURN QUERY SELECT * FROM public.comments WHERE id = cid;
END;
$$;

REVOKE ALL ON FUNCTION public.mark_comment_helpful(uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mark_comment_helpful(uuid, uuid) TO service_role;
REVOKE EXECUTE ON FUNCTION public.increment_comment_helpful(uuid) FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4. Server-side bounds. NOT VALID = enforced for new/updated rows without failing on legacy rows.
-- ---------------------------------------------------------------------------
ALTER TABLE public.repair_reports
  ADD CONSTRAINT repair_reports_price_range
    CHECK (quoted_price BETWEEN 0 AND 1000000000 AND paid_price BETWEEN 0 AND 1000000000) NOT VALID,
  ADD CONSTRAINT repair_reports_currency
    CHECK (currency IN ('KRW', 'USD', 'CNY', 'JPY', 'EUR')) NOT VALID,
  ADD CONSTRAINT repair_reports_text_len
    CHECK (char_length(review_text) <= 2000 AND char_length(repair_item) <= 200
           AND char_length(city) <= 100 AND char_length(country) <= 100) NOT VALID;

ALTER TABLE public.community_posts
  ADD CONSTRAINT community_posts_type
    CHECK (type IN ('question', 'report', 'solved', 'repair_or_replace')) NOT VALID,
  ADD CONSTRAINT community_posts_status
    CHECK (status IN ('open', 'solved', 'unresolved', 'recurred')) NOT VALID,
  ADD CONSTRAINT community_posts_len
    CHECK (char_length(title) BETWEEN 1 AND 200 AND char_length(body) BETWEEN 1 AND 10000) NOT VALID;

ALTER TABLE public.comments
  ADD CONSTRAINT comments_len CHECK (char_length(body) BETWEEN 1 AND 2000) NOT VALID;

-- ---------------------------------------------------------------------------
-- 5. Receipt bucket limits (5 MB, images only).
-- ---------------------------------------------------------------------------
UPDATE storage.buckets
   SET file_size_limit = 5242880,
       allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
 WHERE id = 'receipts';
