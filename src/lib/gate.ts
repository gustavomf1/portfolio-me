import { sessionGet, sessionSet } from './storage';

export const GATE_KEY = 'sith:gate-seen';

// Estado da tela de entrada ("gate"), compartilhado com a intro (Crawl):
// - isPassed: o gate já terminou nesta sessão (aba); nunca mais aparece.
// - isOpening: o gate começou a abrir, então a intro já pode montar (para não perder o início da animação).
export function createGate() {
  let opening = false;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((f) => f());
  return {
    subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; },
    isPassed: () => sessionGet(GATE_KEY) === '1',
    isOpening: () => opening || sessionGet(GATE_KEY) === '1',
    startOpening() { opening = true; emit(); },
    finish() { sessionSet(GATE_KEY, '1'); emit(); },
  };
}

export const gate = createGate();
