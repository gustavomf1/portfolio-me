import { createSequenceMatcher, SITH, KONAMI } from './easter-eggs';

test('detecta sith', () => {
  const m = createSequenceMatcher(SITH);
  expect(['s', 'i', 't'].map((k) => m(k, document.body)).some(Boolean)).toBe(false);
  expect(m('h', document.body)).toBe(true);
});
test('ignora digitação em input e textarea', () => {
  const m = createSequenceMatcher(SITH);
  const input = document.createElement('input');
  const ta = document.createElement('textarea');
  ['s', 'i', 't'].forEach((k) => m(k, input));
  expect(m('h', ta)).toBe(false);
});
test('erro no meio reinicia a sequência', () => {
  const m = createSequenceMatcher(SITH);
  ['s', 'i', 'x'].forEach((k) => m(k, document.body));
  expect(m('h', document.body)).toBe(false);
});
test('konami', () => {
  const m = createSequenceMatcher(KONAMI);
  const results = KONAMI.map((k) => m(k, document.body));
  expect(results[results.length - 1]).toBe(true);
});
