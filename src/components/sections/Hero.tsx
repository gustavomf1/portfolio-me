'use client';
import { profile } from '@/data/profile';
import { useAudio } from '@/lib/useAudio';
import { DeathStar3DLayer, useDeathStar } from '@/components/fx/DeathStar';
import { DeathStarStatic } from '@/components/fx/DeathStarStatic';
import { Starfield } from '@/components/fx/Starfield';

export function Hero() {
  const { unlock, play } = useAudio();
  const { use3d, ready, reduced, onReady } = useDeathStar();

  return (
    <>
      <Starfield />
      {use3d && <DeathStar3DLayer reduced={reduced} onReady={onReady} />}
      <section id="inicio" data-screen-label="Hero" className="relative flex min-h-screen items-center overflow-hidden px-[clamp(20px,6vw,80px)] pb-[120px] pt-[120px]">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(rgba(139,0,0,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(139,0,0,.07) 1px,transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse at 30% 50%,#000 10%,transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 30% 50%,#000 10%,transparent 70%)',
          }}
        />
        {!ready && <DeathStarStatic />}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[40%]" style={{ background: 'linear-gradient(transparent,#050505)' }} />

        <div className="relative flex max-w-[820px] flex-col gap-7">
          <span className="flex items-center gap-3 font-mono text-[13px] tracking-[.26em] text-sith">
            <span className="h-px w-7 bg-sith shadow-[0_0_8px_#e10600]" />
            TRANSMISSÃO IMPERIAL · PERFIL 0001
          </span>
          <h1 className="m-0 font-display text-[clamp(38px,6.6vw,92px)] font-black uppercase leading-[.98] tracking-[.05em] text-balance" style={{ textShadow: '0 0 30px rgba(225,6,0,.35)' }}>
            Gustavo Martins <span className="text-sith">França</span>
          </h1>
          <div className="flex flex-col gap-2.5">
            <p className="m-0 text-[clamp(19px,2.2vw,26px)] font-semibold">{profile.cargo}</p>
            <p className="m-0 font-mono text-[clamp(13px,1.4vw,15px)] tracking-[.08em] text-ash">{profile.subtitulo}</p>
          </div>
          <p className="m-0 max-w-[520px] border-l-2 border-blood pl-[18px] text-[clamp(17px,1.8vw,20px)] text-[#c9c4bf]">{profile.frase}</p>
          <div className="mt-1.5 flex flex-wrap gap-3.5">
            <a href="#missoes" onClick={() => { unlock(); play('swing'); }} className="btn btn-primary h-[54px]">
              Ver projetos
            </a>
            <a href={profile.curriculo} download className="flex h-[54px] items-center gap-2.5 px-2.5 font-mono text-[13px] uppercase tracking-[.12em] text-ash hover:text-bone">
              ↓ Baixar currículo
            </a>
          </div>
        </div>

        <div aria-hidden="true" className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
          <span className="font-mono text-[11px] tracking-[.3em] text-ash">ROLE PARA DESCER</span>
          <span className="relative h-12 w-px bg-blood/50">
            <span className="absolute -left-0.5 h-3 w-[5px] rounded-[3px] bg-ember shadow-[0_0_8px_#e10600]" style={{ animation: 'scrollDot 1.8s ease-in infinite' }} />
          </span>
        </div>
      </section>
    </>
  );
}
