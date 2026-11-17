// Survives the login redirect: the report form is saved locally before sending the user to /auth.
const PREFIX = 'fixatlas:draft:';

export function saveDraft(key: string, value: unknown): void {
  try { localStorage.setItem(PREFIX + key, JSON.stringify({ at: Date.now(), value })); } catch { /* private mode etc. */ }
}
export function loadDraft<T>(key: string, maxAgeMs = 24 * 60 * 60 * 1000): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const { at, value } = JSON.parse(raw);
    if (Date.now() - at > maxAgeMs) { localStorage.removeItem(PREFIX + key); return null; }
    return value as T;
  } catch { return null; }
}
export function clearDraft(key: string): void {
  try { localStorage.removeItem(PREFIX + key); } catch { /* ignore */ }
}
