// Privacy-respecting, first-party product analytics. No cookies, no third parties, no user ids.
// A random per-browser id (localStorage) lets us count visitors and 7-day return rate.
// Honours Do-Not-Track / Global Privacy Control. Event names are allow-listed again on the server.
import { API_BASE, isSupabaseConfigured } from './supabase';

export type EventName =
  | 'page_view' | 'search' | 'search_zero_result' | 'product_view' | 'calculator_used' | 'self_check_view'
  | 'quote_check' | 'submit_start' | 'submit_done' | 'product_request' | 'login_prompt' | 'share_click';

type Props = Record<string, string | number | boolean>;
interface QueuedEvent { name: EventName; path: string; props: Props }

const SID_KEY = 'fixatlas:sid';
let queue: QueuedEvent[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;
let memorySid: string | null = null;

function sessionId(): string {
  try {
    let s = localStorage.getItem(SID_KEY);
    if (!s) {
      s = (globalThis.crypto?.randomUUID?.() ?? `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40);
      localStorage.setItem(SID_KEY, s);
    }
    return s;
  } catch {
    memorySid ??= `m${Math.random().toString(36).slice(2, 14)}${Date.now().toString(36)}`;
    return memorySid;
  }
}

function allowed(): boolean {
  if (typeof navigator === 'undefined' || !isSupabaseConfigured) return false;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  return nav.doNotTrack !== '1' && !nav.globalPrivacyControl;
}

export function flush(): void {
  if (timer) { clearTimeout(timer); timer = null; }
  if (!queue.length) return;
  const events = queue.splice(0, 20);
  void fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId(), events }),
    keepalive: true,
  }).catch(() => { /* analytics must never break the app */ });
  if (queue.length) flush();
}

export function track(name: EventName, props: Props = {}): void {
  if (!allowed()) return;
  queue.push({ name, path: typeof location !== 'undefined' ? location.pathname : '', props });
  if (queue.length >= 10) flush();
  else if (!timer) timer = setTimeout(flush, 1500);
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
}
