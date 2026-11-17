# FixAtlas — Supabase setup (Postgres + Edge Function)

This app uses **Supabase Postgres** (not KV). The Edge Function `make-server-3e8c4785` uses the **service role** key to read/write all tables. The browser uses the **anon** key + Supabase Auth + Storage.

## 1. Create a Supabase project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and create a project.
2. Wait until the project is healthy.
3. In **Project Settings → API**, copy:
   - **Project URL** → `VITE_SUPABASE_URL` and Edge secret `SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
   - **service_role** key → Edge secret `SUPABASE_SERVICE_ROLE_KEY` (never put this in the frontend).

## 2. Auth providers (magic link + Google)

1. **Authentication → Providers → Email**: enable **Email**, enable **Confirm email** as you prefer for production.
2. **Magic link**: users sign in with **Email** OTP / magic link from the `/auth` page (`signInWithOtp`). Add **Redirect URLs** under Authentication → URL configuration, e.g. `http://localhost:5173/` and your production origin.
3. **Google**: enable **Google** provider and paste OAuth client ID/secret from Google Cloud Console. Add the Supabase **callback URL** shown in the UI to Google’s authorized redirect URIs.

## 3. Run database migrations

Install [Supabase CLI](https://supabase.com/docs/guides/cli) and link your project:

```bash
cd /path/to/Fix Atlas
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Migrations live in `supabase/migrations/`:

- `20260514120000_init_fixatlas.sql` — tables (`profiles`, `products`, `symptoms`, `self_check_cards`, `repair_reports`, `community_posts`, `comments`), RLS, `receipts` storage bucket, auth trigger to create `profiles`.
- `20260514120001_increment_comment_helpful.sql`, `20260514120002_profile_trigger_idempotent.sql` — original helpers.
- `20260517000000_security_hardening.sql` — **required before any public traffic**: blocks self-promotion to admin, makes `repair_reports` private (no reporter id / receipt URL leak), per-user "helpful" votes, input constraints, receipt bucket limits (5 MB, images).
- `20260517000100_catalog_content.sql` — product slugs, Korean brand names, symptom synonyms, category-level self-check cards with safety tiers, `reference_prices`.
- `20260517000200_report_fields_events_kpi.sql` — purchase year / error code / consent, unlisted-model reports, anonymous `events`, KPI functions.

> **Incident note.** Before the hardening migration, receipt signed URLs (valid up to 1 year) were stored in a publicly readable column. If you ever ran the old version with real users, treat those receipts as exposed: move/delete the objects in the `receipts` bucket (signed URLs are path-bound) and notify affected users as your privacy policy requires.

## 4. Edge Function secrets and deploy

```bash
supabase functions deploy make-server-3e8c4785
# optional, recommended in production: restrict CORS to your site
supabase secrets set ALLOWED_ORIGIN=https://your-domain.example
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected into Edge Functions by the platform; you do not set them (the CLI skips secrets with the `SUPABASE_` prefix). [verify against current Supabase docs]

`supabase/config.toml` sets `verify_jwt = false` for this function so **public** routes (search, products, …) work without a JWT. **Authenticated** routes still validate the `Authorization: Bearer <user_jwt>` header in code.

## 5. Storage bucket `receipts`

The migration creates a **private** bucket `receipts`. Authenticated users upload to `receipts/{user_id}/...` from the repair form. No extra dashboard step is required if migrations applied successfully.

## 6. Promote an admin (no “first user = admin”)

All new users get `profiles.role = 'user'`.

**Option A — SQL (SQL editor in Dashboard):**

```sql
update public.profiles
set role = 'admin'
where email = 'you@company.com';
```

**Option B — Table Editor:** open `profiles`, find the row, set `role` to `admin` (or `moderator`).

Moderators can seed data and use moderation controls like admins where implemented.

## 7. Frontend environment

Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (and optionally `VITE_SITE_URL` for canonical URLs / sitemap). Then:

```bash
npm ci
npm run dev        # or: npm run build   (also generates sitemap.xml + robots.txt)
```

## 8. Seed demo catalog

1. Sign in (magic link or Google).
2. Promote your user to **admin** (step 6).
3. Open `/admin` and run **초기 데이터 생성** (seed). This upserts products and symptoms, replaces the category-level self-check cards, removes the legacy placeholder cards, and loads the verified official reference prices. Seed data is descriptive only: **verify product facts against manufacturer pages before launch.**

## 9. Optional: legacy path prefix

The function is mounted at both `/` and `/make-server-3e8c4785` so either URL shape works behind the gateway.

## Troubleshooting

- **401 on POST** — sign in; pass the user access token in `Authorization`.
- **403 on /admin/** — `profiles.role` must be `admin` or `moderator`.
- **Helpful votes fail** — ensure migration `20260517000000_security_hardening.sql` was applied (creates `mark_comment_helpful`).
- **Receipt upload fails** — user must be logged in; path must be under `{auth.uid()}/...`; images only, max 5 MB.
- **Blank page / "환경 설정이 필요합니다"** — `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are missing at build time.
