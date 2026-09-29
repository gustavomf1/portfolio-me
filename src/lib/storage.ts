export function safeGet(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
export function safeSet(key: string, value: string): void {
  try { window.localStorage.setItem(key, value); } catch { /* sem persistência */ }
}
