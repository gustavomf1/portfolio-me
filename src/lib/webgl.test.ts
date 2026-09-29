import { hasWebGL } from './webgl';

test('cria o canvas de teste uma única vez, mesmo com várias chamadas', () => {
  const spy = vi.spyOn(document, 'createElement');
  hasWebGL(); hasWebGL(); hasWebGL();
  expect(spy.mock.calls.filter(([t]) => t === 'canvas')).toHaveLength(1);
});
