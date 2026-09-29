import { runCommand } from './terminal';

test('help lista comandos', () => {
  const r = runCommand('help');
  expect(r.lines.join('\n')).toMatch(/skills/);
  expect(r.lines.join('\n')).toMatch(/sudo hire gustavo/);
});
test('vazio e espaços não quebram', () => {
  expect(runCommand('').lines).toEqual([]);
  expect(runCommand('   ').lines).toEqual([]);
});
test('comando desconhecido sugere help', () => {
  expect(runCommand('xyz').lines.join(' ')).toMatch(/help/);
});
test('sudo hire gustavo abre contato', () => {
  expect(runCommand('sudo hire gustavo').action).toBe('open-contact');
});
test('case e espaços extras são tolerados', () => {
  expect(runCommand('  ABOUT ').lines.length).toBeGreaterThan(0);
});
test('clear e exit', () => {
  expect(runCommand('clear').action).toBe('clear');
  expect(runCommand('exit').action).toBe('close');
});

test('contact mostra e-mail, WhatsApp, GitHub e LinkedIn como texto simples (sem links de ação)', () => {
  const txt = runCommand('contact').lines.join('\n');
  expect(txt).toMatch(/@/);
  expect(txt).toMatch(/99757-7550/);
  expect(txt).toMatch(/github\.com/);
  expect(txt).toMatch(/linkedin\.com/);
  expect(txt).not.toMatch(/mailto:|wa\.me/);
});

test('sudo com outro comando é negado com humor', () => {
  const r = runCommand('sudo rm -rf /');
  expect(r.lines.join(' ')).toMatch(/Permissão negada/);
  expect(r.action).toBeUndefined();
});
