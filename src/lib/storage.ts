// Se o armazenamento estiver bloqueado ou recusar gravação, a sessão continua consistente via memória
// (ex.: o crawl não reaparece depois de "Pular introdução").
function createStore(getStorage: () => Storage) {
  const memory = new Map<string, string>();
  let degraded = false;

  return {
    get(key: string): string | null {
      if (degraded) return memory.get(key) ?? null;
      try {
        return getStorage().getItem(key);
      } catch {
        return memory.get(key) ?? null;
      }
    },
    set(key: string, value: string): void {
      memory.set(key, value);
      try {
        getStorage().setItem(key, value);
      } catch {
        degraded = true; // sem persistência; leituras passam a vir da memória
      }
    },
  };
}

// Persiste entre visitas (preferência de som, etc.).
const local = createStore(() => window.localStorage);
// Vale só enquanto a aba/janela estiver aberta (a intro, uma vez por sessão).
const session = createStore(() => window.sessionStorage);

export const safeGet = local.get;
export const safeSet = local.set;
export const sessionGet = session.get;
export const sessionSet = session.set;
