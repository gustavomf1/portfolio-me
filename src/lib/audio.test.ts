import { createAudioEngine } from './audio';

function fakeMedia(rejects: boolean) {
  return {
    volume: 0, loop: false, preload: '', paused: true, src: '',
    play: vi.fn(() => (rejects ? Promise.reject(new Error('NotAllowedError')) : Promise.resolve())),
    pause: vi.fn(),
  } as unknown as HTMLAudioElement;
}
const deps = (el: HTMLAudioElement) => ({ createMedia: () => el, createContext: () => null });

test('preferência de mudo salva impede a música', () => {
  localStorage.setItem('sith:muted', '1');
  const el = fakeMedia(false);
  const eng = createAudioEngine(deps(el));
  eng.unlock();
  expect(eng.isMuted()).toBe(true);
  expect(el.play).not.toHaveBeenCalled();
});

test('play() rejeitada pelo navegador não gera erro não tratado', async () => {
  const el = fakeMedia(true);
  const eng = createAudioEngine(deps(el));
  expect(() => eng.unlock()).not.toThrow();
  await Promise.resolve();
  await Promise.resolve();
});

test('setMuted pausa e persiste', () => {
  const el = fakeMedia(false);
  const eng = createAudioEngine(deps(el));
  eng.unlock();
  eng.setMuted(true);
  expect(el.pause).toHaveBeenCalled();
  expect(localStorage.getItem('sith:muted')).toBe('1');
});

test('efeito sem AudioContext é no-op', () => {
  const eng = createAudioEngine(deps(fakeMedia(false)));
  expect(() => eng.play('swing')).not.toThrow();
});

test('isUnlocked só fica verdadeiro depois do primeiro unlock', () => {
  const eng = createAudioEngine(deps(fakeMedia(false)));
  expect(eng.isUnlocked()).toBe(false);
  eng.unlock();
  expect(eng.isUnlocked()).toBe(true);
});

test('unlock avisa os assinantes (para o botão de som refletir que a música começou)', () => {
  const eng = createAudioEngine(deps(fakeMedia(false)));
  const fn = vi.fn();
  eng.subscribe(fn);
  eng.unlock();
  expect(fn).toHaveBeenCalled();
});

test('música inicia com volume 0 e usa loop', () => {
  const el = fakeMedia(false);
  const eng = createAudioEngine(deps(el));
  eng.unlock();
  expect(el.loop).toBe(true);
  expect(el.volume).toBe(0);
  expect(el.play).toHaveBeenCalledTimes(1);
});
