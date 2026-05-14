import { createClient } from '@supabase/supabase-js';

// In Figma Make environment, these are injected at runtime
// @ts-ignore
const supabaseUrl = (typeof window !== 'undefined' && window.__SUPABASE_URL__) ||
                    import.meta.env.VITE_SUPABASE_URL ||
                    '';
// @ts-ignore
const supabaseAnonKey = (typeof window !== 'undefined' && window.__SUPABASE_ANON_KEY__) ||
                        import.meta.env.VITE_SUPABASE_ANON_KEY ||
                        '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const API_BASE = `${supabaseUrl}/functions/v1/make-server-3e8c4785`;
