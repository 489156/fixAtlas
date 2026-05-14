CREATE OR REPLACE FUNCTION public.increment_comment_helpful(cid uuid)
RETURNS SETOF public.comments
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.comments
  SET helpful_count = helpful_count + 1
  WHERE id = cid
  RETURNING *;
$$;

REVOKE ALL ON FUNCTION public.increment_comment_helpful(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_comment_helpful(uuid) TO service_role;
