import { createGate } from './gate';

test('começa fechado: nem passou nem abrindo', () => {
  const g = createGate();
  expect(g.isPassed()).toBe(false);
  expect(g.isOpening()).toBe(false);
});

test('startOpening libera a intro antes de o gate terminar, e avisa os assinantes', () => {
  const g = createGate();
  const fn = vi.fn();
  g.subscribe(fn);
  g.startOpening();
  expect(g.isOpening()).toBe(true);
  expect(g.isPassed()).toBe(false);
  expect(fn).toHaveBeenCalled();
});

test('finish grava na sessão: passa e nunca mais aparece nessa aba', () => {
  const g = createGate();
  g.finish();
  expect(g.isPassed()).toBe(true);
  expect(sessionStorage.getItem('sith:gate-seen')).toBe('1');
  expect(createGate().isPassed()).toBe(true); // recarregar a página na mesma aba
});

test('quem já passou pelo gate na sessão conta como "abrindo" (a intro pode aparecer)', () => {
  sessionStorage.setItem('sith:gate-seen', '1');
  expect(createGate().isOpening()).toBe(true);
});
