'use client';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { gate } from '@/lib/gate';
import { useAudio } from '@/lib/useAudio';
import { useReducedMotion } from '@/lib/useReducedMotion';

// Estrelas em CSS puro (gradientes radiais), uma para cada metade da "porta".
const starsTop = 'radial-gradient(1px 1px at 23px 41px,rgba(242,237,232,.7),transparent),radial-gradient(1px 1px at 131px 87px,rgba(242,237,232,.5),transparent),radial-gradient(1.5px 1.5px at 197px 163px,rgba(242,237,232,.8),transparent),radial-gradient(1px 1px at 71px 201px,rgba(242,237,232,.45),transparent),radial-gradient(1px 1px at 251px 29px,rgba(255,42,31,.6),transparent),radial-gradient(1px 1px at 167px 257px,rgba(242,237,232,.55),transparent)';
const starsBottom = 'radial-gradient(1px 1px at 53px 21px,rgba(242,237,232,.6),transparent),radial-gradient(1px 1px at 151px 117px,rgba(242,237,232,.5),transparent),radial-gradient(1.5px 1.5px at 227px 193px,rgba(242,237,232,.75),transparent),radial-gradient(1px 1px at 91px 241px,rgba(255,42,31,.55),transparent),radial-gradient(1px 1px at 261px 69px,rgba(242,237,232,.45),transparent)';

const blade = 'absolute top-[-3px] h-1.5 rounded-[3px] bg-white';
const bladeGlow = '0 0 6px #ff2a1f,0 0 16px #e10600,0 0 42px #e10600,0 0 90px rgba(225,6,0,.6)';
const grip = 'h-4 flex-1 [background:repeating-linear-gradient(90deg,#161618_0_5px,#3a3a3d_5px_7px)] [box-shadow:inset_0_2px_2px_rgba(255,255,255,.08),inset_0_-2px_3px_rgba(0,0,0,.6)]';

type Phase = 'idle' | 'light' | 'ignite';

// Tela de entrada, antes da intro. O clique do visitante libera o áudio (exigência dos navegadores):
// "Sim" acende o sabre, abre a porta e a intro começa já com música. "Voltar à luz" é um easter egg.
export function Gate() {
  const passed = useSyncExternalStore(gate.subscribe, gate.isPassed, () => false);
  const reduced = useReducedMotion();
  const { unlock, play } = useAudio();
  const [phase, setPhase] = useState<Phase>('idle');
  const busy = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const yes = useRef<HTMLButtonElement>(null);
  const no = useRef<HTMLButtonElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const bot = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const saber = useRef<HTMLDivElement>(null);
  const bladeL = useRef<HTMLDivElement>(null);
  const bladeR = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!passed) yes.current?.focus();
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, [passed]);

  if (passed) return null;

  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  const open = () => {
    unlock(); // gesto do visitante: libera o áudio e inicia a trilha
    play('ignition');
    setPhase('ignite');
    if (reduced) { gate.startOpening(); gate.finish(); return; }
    [bladeL.current, bladeR.current].forEach((b) =>
      b?.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 800, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }),
    );
    later(() => {
      gate.startOpening(); // a intro monta agora, por baixo da porta que se abre
      const o: KeyframeAnimationOptions = { duration: 950, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' };
      content.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: 'forwards' });
      top.current?.animate([{ transform: 'none' }, { transform: 'translateY(-100%)' }], o);
      bot.current?.animate([{ transform: 'none' }, { transform: 'translateY(100%)' }], o);
      saber.current?.animate([{ opacity: 1 }, { opacity: 1, offset: 0.45 }, { opacity: 0 }], o);
      later(() => gate.finish(), 960);
    }, 850);
  };

  const onYes = () => { if (busy.current) return; busy.current = true; open(); };
  const onNo = () => {
    if (busy.current) return;
    busy.current = true;
    play('door');
    setPhase('light');
    later(open, 3000); // "lado luz" por 3 s e depois abre do mesmo jeito
  };

  // Mantém o foco preso entre os dois botões.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const a = yes.current, b = no.current;
    if (!a || !b) { e.preventDefault(); return; }
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); b.focus(); }
    else if (!e.shiftKey && document.activeElement === b) { e.preventDefault(); a.focus(); }
  };

  const light = phase === 'light';

  return (
    <div
      data-gate
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-q"
      aria-describedby="gate-d"
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[10001] overflow-hidden"
      style={{ filter: light ? 'hue-rotate(180deg) brightness(1.15)' : undefined, transition: 'filter .6s' }}
    >
      <div ref={top} aria-hidden="true" className="absolute inset-x-0 top-0 h-[50.2%] bg-[#030303]" style={{ backgroundImage: starsTop, backgroundSize: '280px 280px' }} />
      <div ref={bot} aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-[#030303]" style={{ backgroundImage: starsBottom, backgroundSize: '280px 280px' }} />

      <div ref={content} className="absolute inset-0 grid grid-rows-[1fr_64px_1fr] p-6">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 16% at 50% 50%,rgba(139,0,0,.2),transparent),radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,.85) 100%)' }} />
        <div className="relative max-w-[920px] self-end justify-self-center pb-[clamp(28px,6vh,64px)] text-center">
          <h2
            id="gate-q"
            role={light ? 'status' : undefined}
            className="m-0 font-display text-[clamp(22px,4.2vw,50px)] font-black uppercase leading-[1.12] tracking-[.06em] text-bone text-balance"
            style={{ textShadow: '0 0 28px rgba(225,6,0,.45)' }}
          >
            {light ? 'Você não pode escapar do seu destino.' : 'Tem certeza que deseja conhecer o lado sombrio?'}
          </h2>
        </div>
        <div />
        <div className="relative flex w-[min(100%,640px)] flex-col items-center gap-7 self-start justify-self-center pt-[clamp(28px,6vh,64px)]">
          <p id="gate-d" className="m-0 max-w-[560px] text-center font-mono text-[clamp(13px,1.5vw,15px)] leading-[1.7] text-[#a8a8a8] text-pretty">
            Este portfólio contém código, arquitetura e um leve excesso de dramaticidade.
          </p>
          {!light && (
            <div className="flex w-full flex-wrap justify-center gap-3">
              <button
                ref={yes}
                type="button"
                onClick={onYes}
                onMouseEnter={() => play('blip')}
                className="min-h-14 flex-[1_1_260px] cursor-pointer border border-ember bg-sith px-[22px] font-display text-[13px] font-bold uppercase tracking-[.16em] text-white transition-shadow [box-shadow:0_0_18px_rgba(225,6,0,.55),0_0_60px_rgba(225,6,0,.25)] hover:[box-shadow:0_0_28px_#ff2a1f,0_0_90px_rgba(225,6,0,.5)]"
              >
                Sim, aceito meu destino
              </button>
              <button
                ref={no}
                type="button"
                onClick={onNo}
                className="min-h-14 flex-[1_1_200px] cursor-pointer border border-ash/45 bg-abyss/70 px-[22px] font-display text-[13px] font-bold uppercase tracking-[.16em] text-bone transition-[border-color,box-shadow] hover:border-[#7fdcff] hover:[box-shadow:0_0_18px_rgba(127,220,255,.3)]"
              >
                Voltar à luz
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cabo do sabre no centro; ao aceitar, as duas lâminas se estendem até as bordas. */}
      <div ref={saber} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 h-0">
        <div ref={bladeL} className={blade} style={{ left: 0, right: 'calc(50% + 84px)', boxShadow: bladeGlow, transform: 'scaleX(0)', transformOrigin: 'right center' }} />
        <div ref={bladeR} className={blade} style={{ left: 'calc(50% + 84px)', right: 0, boxShadow: bladeGlow, transform: 'scaleX(0)', transformOrigin: 'left center' }} />
        <div className="absolute left-1/2 top-0 flex h-[22px] w-[168px] -translate-x-1/2 -translate-y-1/2 items-center">
          <span className="relative h-[22px] w-3.5 rounded-l-[3px] [background:linear-gradient(#6a6a6e,#1b1b1d)] [box-shadow:inset_0_1px_0_rgba(255,255,255,.2)]">
            <span className="absolute -left-0.5 top-2 h-1.5 w-[3px] rounded-sm bg-ember [box-shadow:0_0_8px_#e10600]" style={{ animation: 'pulseGlow 2.4s ease-in-out infinite' }} />
          </span>
          <span className={grip} />
          <span className="grid h-5 w-[26px] place-items-center border-x-2 border-blood [background:linear-gradient(#2a2a2d,#0e0e0f)]">
            <span className="h-1.5 w-1.5 rotate-45 bg-sith [box-shadow:0_0_6px_#e10600]" />
          </span>
          <span className={grip} />
          <span className="relative h-[22px] w-3.5 rounded-r-[3px] [background:linear-gradient(#6a6a6e,#1b1b1d)] [box-shadow:inset_0_1px_0_rgba(255,255,255,.2)]">
            <span className="absolute -right-0.5 top-2 h-1.5 w-[3px] rounded-sm bg-ember [box-shadow:0_0_8px_#e10600]" style={{ animation: 'pulseGlow 2.4s ease-in-out infinite' }} />
          </span>
        </div>
      </div>
    </div>
  );
}
