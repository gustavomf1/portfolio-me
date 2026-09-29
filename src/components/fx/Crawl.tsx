'use client';
import { useEffect, useSyncExternalStore } from 'react';
import { audio } from '@/lib/audio';
import { gate } from '@/lib/gate';
import { MuteButton } from '@/components/ui/MuteButton';
import { sessionGet, sessionSet } from '@/lib/storage';
import { useAudio } from '@/lib/useAudio';
import { useReducedMotion } from '@/lib/useReducedMotion';

const KEY = 'sith:crawl-seen';
const EVT = 'sith:crawl';

const subscribe = (cb: () => void) => { window.addEventListener(EVT, cb); return () => window.removeEventListener(EVT, cb); };
const getSeen = () => sessionGet(KEY) === '1';

// Abertura estilo "opening crawl", em vermelho. Uma vez por sessão (aba); "Pular introdução" sempre visível.
export function Crawl() {
  // Servidor renderiza o crawl; o script do <head> o esconde por CSS para quem já viu (html.crawl-seen).
  const seen = useSyncExternalStore(subscribe, getSeen, () => false);
  const reduced = useReducedMotion();
  // A intro só monta quando a tela de entrada começa a abrir (para não perder o início da animação).
  const gateOpen = useSyncExternalStore(gate.subscribe, gate.isOpening, () => false);
  const { unlock, playing, muted } = useAudio();

  // Música de fundo durante a intro. O navegador só libera áudio após um gesto: tentamos iniciar direto
  // (funciona se o navegador permitir) e, se for bloqueado, o primeiro clique, toque ou tecla inicia.
  useEffect(() => {
    if (seen || !gateOpen) return;
    if (!reduced) audio.tryStart();
    const start = () => audio.unlock();
    const events = ['pointerdown', 'pointerup', 'keydown', 'touchend'] as const;
    events.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, start));
  }, [seen, gateOpen, reduced]);

  if (seen || !gateOpen) return null;

  const finish = () => { sessionSet(KEY, '1'); window.dispatchEvent(new Event(EVT)); };
  const skip = () => { unlock(); finish(); };

  return (
    <div data-crawl role="dialog" aria-label="Introdução" className="fixed inset-0 z-[10000] overflow-hidden bg-void">
      {!reduced && (
        <p className="absolute left-1/2 top-[44%] m-0 w-[min(90%,640px)] -translate-x-1/2 text-center text-[clamp(18px,2.4vw,26px)] leading-normal text-ash opacity-0" style={{ animation: 'introPre 4.2s ease both' }}>
          Há pouco tempo, numa cidade não muito distante…
        </p>
      )}
      <div className="absolute inset-0" style={{ perspective: 360, perspectiveOrigin: '50% 30%' }}>
        <div
          onAnimationEnd={(e) => { if (e.animationName === 'crawl') finish(); }}
          className="absolute left-1/2 top-0 flex w-[min(88vw,760px)] flex-col gap-[1.2em] text-justify text-[clamp(20px,3vw,36px)] font-extrabold leading-normal text-sith"
          style={{
            transformOrigin: '50% 100%',
            textShadow: '0 0 12px rgba(225,6,0,.6)',
            animation: reduced ? 'none' : 'crawl 34s linear 4s both',
            transform: reduced ? 'translate(-50%, 18vh)' : undefined,
          }}
        >
          <div className="text-center font-display tracking-[.14em]">
            <div className="text-[.7em]">EPISÓDIO I</div>
            <div className="mt-[.3em] text-[1.25em]">O ENGENHEIRO FULL STACK</div>
          </div>
          <p className="m-0">Tempos de sistemas instáveis. Prazos apertados e código legado ameaçam a galáxia do software.</p>
          <p className="m-0">Em Pirapozinho, SP, um engenheiro full stack constrói SaaS de ponta a ponta com Java, TypeScript e PostgreSQL, e coloca inteligência artificial para trabalhar em produção.</p>
          <p className="m-0">No último ano de Sistemas de Informação, GUSTAVO MARTINS FRANÇA segue em missão: abraçar a escuridão para construir sistemas que vencem…</p>
        </div>
      </div>
      <div className="absolute right-[clamp(16px,3vw,32px)] top-[clamp(16px,3vw,28px)] z-10 flex items-center gap-3">
        {!playing && !muted && (
          <span className="font-mono text-[11px] tracking-[.14em] text-ash" style={{ animation: 'pulseGlow 2s ease-in-out infinite' }}>
            CLIQUE PARA ATIVAR O SOM
          </span>
        )}
        <MuteButton />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[38%]" style={{ background: 'linear-gradient(#050505 20%,transparent)' }} />
      <button
        type="button"
        onClick={skip}
        className="absolute bottom-[clamp(16px,3vw,32px)] right-[clamp(16px,3vw,32px)] h-[46px] cursor-pointer border border-blood bg-abyss/85 px-5 font-mono text-[12.5px] tracking-[.16em] text-bone hover:border-ember hover:shadow-[0_0_18px_rgba(225,6,0,.45)]"
      >
        {reduced ? 'CONTINUAR →' : 'PULAR INTRODUÇÃO →'}
      </button>
    </div>
  );
}
