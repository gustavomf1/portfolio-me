import { safeGet, safeSet } from './storage';

test('funciona com localStorage', () => {
  safeSet('k', 'v');
  expect(safeGet('k')).toBe('v');
});

test('não lança quando localStorage lança', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
  expect(safeGet('k')).toBeNull();
  expect(() => safeSet('k', 'v')).not.toThrow();
});
