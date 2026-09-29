import { asset } from './paths';
import { sessionGet, sessionSet } from './storage';

export const MUSIC_VOLUME = 0.08; // volume de fundo, ajuste aqui
export const MUSIC_SRC = asset('/assets/sounds/emperor-theme.mp3'); // TROCAR aqui pela faixa desejada
const IGNITION_SRC = asset('/assets/sounds/ignition.mp3'); // som de ignição do sabre (troque o arquivo para mudar)
const FADE_MS = 3000;
const MUTE_KEY = 'sith:muted';

export type SoundName = 'ignition' | 'hum' | 'swing' | 'blip' | 'door' | 'march';

type Deps = {
  createMedia: () => HTMLAudioElement | null;
  createContext: () => AudioContext | null;
  // Efeito sonoro por arquivo (ex.: ignição do sabre). Opcional: sem ele, usa o som sintetizado.
  createSfx?: (src: string) => HTMLAudioElement | null;
};

export function createAudioEngine(deps: Deps) {
  let media: HTMLAudioElement | null = null;
  let ctx: AudioContext | null = null;
  let unlocked = false;
  let mediaTried = false;
  // Padrão: som ligado. Se o visitante silenciar, vale só na sessão (aba); numa visita nova volta ligado.
  let muted = sessionGet(MUTE_KEY) === '1';
  let fade: ReturnType<typeof setInterval> | null = null;
  let humNode: { stop: () => void } | null = null;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((f) => f());

  function stopFade() {
    if (fade) { clearInterval(fade); fade = null; }
  }

  function fadeMusicIn() {
    if (!media) return;
    media.volume = 0;
    media.loop = true;
    media.play()?.then(emit, () => { /* autoplay bloqueado ou arquivo ausente: segue sem trilha */ });
    const steps = 30;
    let n = 0;
    stopFade();
    fade = setInterval(() => {
      n += 1;
      if (media) media.volume = Math.min(MUSIC_VOLUME, (MUSIC_VOLUME * n) / steps);
      if (n >= steps) stopFade();
    }, FADE_MS / steps);
  }

  function tone(freq: number, dur: number, type: OscillatorType, gain: number, when = 0, slideTo?: number) {
    if (!ctx || muted) return;
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    f.type = 'lowpass';
    f.frequency.value = 2400;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(f).connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  function synthIgnition() {
    tone(90, 0.9, 'sawtooth', 0.18, 0, 420);
    tone(180, 0.9, 'square', 0.06, 0, 840);
  }

  function play(name: SoundName) {
    if (muted) return;
    // Ignição: arquivo real (/assets/sounds/ignition.mp3); se falhar ou não existir, cai no sintetizado.
    if (name === 'ignition' && deps.createSfx) {
      const sfx = deps.createSfx(IGNITION_SRC);
      if (sfx) {
        sfx.volume = 0.75;
        sfx.play()?.then(undefined, synthIgnition);
        return;
      }
    }
    if (!ctx) return;
    // Para usar arquivos reais, toque aqui um <audio src="/assets/sounds/<nome>.mp3"> antes do fallback.
    switch (name) {
      case 'ignition': synthIgnition(); break;
      case 'swing': tone(520, 0.22, 'sawtooth', 0.1, 0, 140); break;
      case 'blip': tone(880, 0.06, 'square', 0.04); break;
      case 'door': tone(140, 0.5, 'triangle', 0.12, 0, 60); tone(700, 0.3, 'sine', 0.05, 0.1, 300); break;
      case 'hum': {
        if (humNode) return;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sawtooth';
        o.frequency.value = 62;
        g.gain.value = 0.015;
        o.connect(g).connect(ctx.destination);
        o.start();
        humNode = { stop: () => { o.stop(); humNode = null; } };
        break;
      }
      case 'march': {
        // Primeiras notas da Marcha Imperial (G G G Eb Bb G Eb Bb G), sintetizadas.
        const seq: [number, number, number][] = [
          [392, 0.45, 0], [392, 0.45, 0.5], [392, 0.45, 1.0], [311, 0.35, 1.5], [466, 0.15, 1.9],
          [392, 0.45, 2.1], [311, 0.35, 2.6], [466, 0.15, 3.0], [392, 0.8, 3.2],
        ];
        seq.forEach(([f, d, w]) => tone(f, d, 'sawtooth', 0.1, w));
        break;
      }
    }
  }

  // Cria o <audio> uma vez. Não baixa nada até o play (preload none).
  function ensureMedia() {
    if (media || mediaTried) return;
    mediaTried = true;
    media = deps.createMedia();
    if (media) {
      media.preload = 'none';
      media.src = MUSIC_SRC;
      media.addEventListener?.('playing', emit);
      media.addEventListener?.('pause', emit);
    }
  }

  return {
    // Tenta iniciar a música sem gesto (funciona só se o navegador permitir); não cria AudioContext.
    tryStart() {
      ensureMedia();
      if (!muted && media && media.paused) fadeMusicIn();
    },
    unlock() {
      if (!unlocked) {
        unlocked = true;
        ctx = deps.createContext();
        ensureMedia();
      }
      if (ctx && ctx.state === 'suspended') void ctx.resume();
      if (!muted && media && media.paused) fadeMusicIn();
      emit();
    },
    play,
    setMuted(m: boolean) {
      muted = m;
      sessionSet(MUTE_KEY, m ? '1' : '0');
      if (m) { stopFade(); media?.pause(); humNode?.stop(); }
      else if (media) fadeMusicIn();
      emit();
    },
    isMuted: () => muted,
    isUnlocked: () => unlocked,
    isPlaying: () => !!media && !media.paused,
    subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; },
    pauseForBackground() { media?.pause(); },
    resumeFromBackground() { if (!muted && media && media.paused) media.play()?.catch(() => {}); },
  };
}

export const audio = createAudioEngine({
  createMedia: () => (typeof Audio === 'undefined' ? null : new Audio()),
  createSfx: (src) => (typeof Audio === 'undefined' ? null : new Audio(src)),
  createContext: () => {
    if (typeof window === 'undefined') return null;
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    return AC ? new AC() : null;
  },
});
