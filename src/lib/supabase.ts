import { createClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    __SUPABASE_URL__?: string;
    __SUPABASE_ANON_KEY__?: string;
  }
}

// Runtime injection (e.g. Figma Make) wins; otherwise Vite build-time env.
const supabaseUrl: string =
  (typeof window !== 'undefined' && window.__SUPABASE_URL__) ||
  (import.meta as unknown as { env: Record<string, string | undefined> }).env.VITE_SUPABASE_URL ||
  '';
const supabaseAnonKey: string =
  (typeof window !== 'undefined' && window.__SUPABASE_ANON_KEY__) ||
  (import.meta as unknown as { env: Record<string, string | undefined> }).env.VITE_SUPABASE_ANON_KEY ||
  '';

/** False when the public env vars are missing; App renders a setup screen instead of crashing. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// createClient() throws on an empty URL, which previously white-screened the whole app.
// Use inert placeholders when unconfigured; nothing talks to them because App short-circuits.
export const supabase = createClient(
  supabaseUrl || 'http://localhost:54321',
  supabaseAnonKey || 'missing-anon-key',
);

export const API_BASE = `${supabaseUrl}/functions/v1/make-server-3e8c4785`;
