// Se o localStorage estiver bloqueado ou recusar gravação, a sessão continua consistente via memória
// (ex.: o crawl não reaparece depois de "Pular introdução").
const memory = new Map<string, string>();
let degraded = false;

export function safeGet(key: string): string | null {
  if (degraded) return memory.get(key) ?? null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return memory.get(key) ?? null;
  }
}

export function safeSet(key: string, value: string): void {
  memory.set(key, value);
  try {
    window.localStorage.setItem(key, value);
  } catch {
    degraded = true; // sem persistência entre visitas; leituras passam a vir da memória
  }
}
