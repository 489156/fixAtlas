// Supabase Edge Function entry. All business logic lives in ../_shared (unit-tested under Node).
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected by the platform.
import { createClient } from '@supabase/supabase-js';
import { createApp } from '../_shared/app.ts';
import { makeSupabaseDb } from '../_shared/db_supabase.ts';

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const app = createApp({
  db: makeSupabaseDb(sb),
  auth: {
    async verify(accessToken) {
      const { data, error } = await sb.auth.getUser(accessToken);
      return error || !data.user ? null : { id: data.user.id, email: data.user.email };
    },
  },
  // Set ALLOWED_ORIGIN (e.g. https://fixatlas.example) via `supabase secrets set` to restrict CORS in production.
  allowedOrigin: Deno.env.get('ALLOWED_ORIGIN') || undefined,
  log: console.log,
});

Deno.serve(app.fetch);
