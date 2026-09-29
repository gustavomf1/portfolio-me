import { buildDemoLog, classifyDemo } from './classify-demo';

test.each([
  ['Uber para o trabalho', 'Transporte'],
  ['almoço no restaurante', 'Alimentação'],
  ['aluguel de março', 'Moradia'],
  ['cinema com amigos', 'Lazer'],
  ['consulta na farmácia', 'Saúde'],
  ['mensalidade da faculdade', 'Educação'],
  ['Netflix', 'Assinaturas'],
])('%s -> %s', (txt, cat) => expect(classifyDemo(txt).categoria).toBe(cat));

test('mais palavras-chave aumentam a confiança', () => {
  expect(classifyDemo('uber e gasolina').confianca).toBeGreaterThan(classifyDemo('uber').confianca);
});

test('sem correspondência cai em Outros e pede confirmação', () => {
  const r = classifyDemo('xkcd qwerty');
  expect(r.categoria).toBe('Outros');
  expect(r.confianca).toBeLessThan(0.6);
  expect(r.requerConfirmacao).toBe(true);
});

test('texto vazio não classifica', () => {
  expect(classifyDemo('   ').categoria).toBe('Outros');
});

test('log simula prompt, resposta JSON e validação', () => {
  const log = buildDemoLog(classifyDemo('uber'));
  expect(log).toHaveLength(5);
  expect(log[2].texto).toContain('"categoria": "Transporte"');
  expect(log[3].texto).toContain('validação');
});
