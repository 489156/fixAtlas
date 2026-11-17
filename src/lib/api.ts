import { API_BASE, supabase } from './supabase';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.status = status; }
}

/** JSON fetch against the Edge Function. Attaches the user's token only when `auth` is true. */
export async function api<T = any>(path: string, opts: { method?: string; body?: unknown; auth?: boolean } = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
  if (opts.auth) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new ApiError('로그인이 필요합니다.', 401);
    headers.Authorization = `Bearer ${session.access_token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data?.error || `요청에 실패했습니다. (${res.status})`, res.status);
  return data as T;
}
