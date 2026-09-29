import { buildMailto } from './contact';

test('codifica acentos, & e quebras de linha', () => {
  const url = buildMailto('a@b.com', 'João & Cia', 'j@x.com', 'Olá!\nTudo bem? 100% & mais');
  expect(url.startsWith('mailto:a@b.com?')).toBe(true);
  expect(url).not.toMatch(/\n/);
  expect(url).toContain('%0A');
  expect(url).toContain('%26');
  expect(decodeURIComponent(url.split('body=')[1])).toContain('Olá!\nTudo bem?');
});
