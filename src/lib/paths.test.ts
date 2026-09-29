import { withBase } from './paths';

test('prefixa o basePath em caminhos absolutos', () => {
  expect(withBase('/repo', '/curriculo.pdf')).toBe('/repo/curriculo.pdf');
});
test('sem basePath devolve o caminho intacto', () => {
  expect(withBase('', '/assets/sounds/a.mp3')).toBe('/assets/sounds/a.mp3');
});
