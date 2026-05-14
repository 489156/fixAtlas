export const projectId = Deno.env.get('SUPABASE_URL')?.split('//')[1]?.split('.')[0] || '';
export const publicAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
