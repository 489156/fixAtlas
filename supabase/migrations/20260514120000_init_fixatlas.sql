-- FixAtlas core schema (Postgres-first, replaces KV store)

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email TEXT,
  nickname TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '한국',
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_role ON public.profiles (role);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nickname, country, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nickname', split_part(COALESCE(NEW.email, 'user'), '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'country', '한국'),
    'user'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

CREATE TABLE public.symptoms (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name_ko TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_zh TEXT,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('safe', 'caution', 'expert', 'dangerous')),
  self_check_allowed BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  brand TEXT NOT NULL,
  model_name TEXT NOT NULL,
  alternate_names JSONB NOT NULL DEFAULT '[]'::jsonb,
  release_year INT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE public.self_check_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  symptom_id TEXT REFERENCES public.symptoms (id) ON DELETE SET NULL,
  title_ko TEXT NOT NULL,
  body_ko TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_self_check_product ON public.self_check_cards (product_id);

CREATE TABLE public.repair_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES public.products (id),
  symptom_id TEXT NOT NULL REFERENCES public.symptoms (id),
  country TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT '',
  repair_channel TEXT NOT NULL CHECK (repair_channel IN ('official', 'third_party', 'self_check')),
  quoted_price NUMERIC NOT NULL DEFAULT 0,
  paid_price NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL,
  repair_item TEXT NOT NULL DEFAULT '',
  resolved_status TEXT NOT NULL CHECK (resolved_status IN ('resolved', 'unresolved', 'recurred')),
  review_text TEXT NOT NULL DEFAULT '',
  receipt_image_url TEXT NOT NULL DEFAULT '',
  verified_status TEXT NOT NULL DEFAULT 'reported' CHECK (verified_status IN ('reported', 'verified', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_repair_reports_product ON public.repair_reports (product_id);
CREATE INDEX idx_repair_reports_created ON public.repair_reports (created_at DESC);

CREATE TABLE public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  product_id TEXT REFERENCES public.products (id) ON DELETE SET NULL,
  symptom_id TEXT REFERENCES public.symptoms (id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  hidden BOOLEAN NOT NULL DEFAULT false,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_community_posts_created ON public.community_posts (created_at DESC);
CREATE INDEX idx_community_posts_type ON public.community_posts (type);
CREATE INDEX idx_community_posts_hidden ON public.community_posts (hidden);

CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  helpful_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_post ON public.comments (post_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.self_check_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read symptoms" ON public.symptoms FOR SELECT USING (true);
CREATE POLICY "Public read self_check_cards" ON public.self_check_cards FOR SELECT USING (true);
CREATE POLICY "Public read repair_reports" ON public.repair_reports FOR SELECT USING (true);
CREATE POLICY "Public read visible posts" ON public.community_posts FOR SELECT USING (hidden = false);
CREATE POLICY "Public read comments" ON public.comments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.community_posts p WHERE p.id = post_id AND p.hidden = false)
);

CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Auth upload receipts"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'receipts' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Auth read own receipts"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'receipts' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Auth update own receipts"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'receipts' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Auth delete own receipts"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'receipts' AND (storage.foldername(name))[1] = auth.uid()::text);
