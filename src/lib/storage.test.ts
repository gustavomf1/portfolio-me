import { safeGet, safeSet, sessionGet, sessionSet } from './storage';

test('funciona com localStorage', () => {
  safeSet('k', 'v');
  expect(safeGet('k')).toBe('v');
});

test('sem localStorage, o valor gravado continua legível em memória', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
  expect(safeGet('mem-a')).toBeNull();
  expect(() => safeSet('mem-a', 'v')).not.toThrow();
  expect(safeGet('mem-a')).toBe('v');
});

test('sessão: grava no sessionStorage e não no localStorage', () => {
  sessionSet('s1', 'v');
  expect(sessionGet('s1')).toBe('v');
  expect(window.sessionStorage.getItem('s1')).toBe('v');
  expect(window.localStorage.getItem('s1')).toBeNull();
});

test('sessão: sem sessionStorage, mantém o valor em memória', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
  expect(sessionGet('s2')).toBeNull();
  expect(() => sessionSet('s2', 'v')).not.toThrow();
  expect(sessionGet('s2')).toBe('v');
});
