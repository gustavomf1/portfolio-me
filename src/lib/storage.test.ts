import { safeGet, safeSet } from './storage';

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
