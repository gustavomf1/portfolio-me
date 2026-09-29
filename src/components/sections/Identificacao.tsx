import { profile } from '@/data/profile';
import { Counter } from '@/components/ui/Counter';
import { asset } from '@/lib/paths';
import { Reveal } from '@/components/ui/Reveal';
import { SectionTitle } from '@/components/ui/SectionTitle';

const fatos = [
  { k: 'LOCAL', v: 'Pirapozinho, SP' },
  { k: 'MODALIDADE', v: 'Remoto e presencial' },
  { k: 'FORMAÇÃO', v: 'Sistemas de Informação · 2026' },
  { k: 'FOCO', v: 'Full stack · SaaS · IA aplicada' },
];

export function Identificacao() {
  return (
    <section id="identificacao" data-screen-label="01 Identificação" className="section-pad relative mx-auto max-w-[1240px]">
      <Reveal><SectionTitle label="// 01 IDENTIFICAÇÃO" title="Sobre mim" /></Reveal>
      <div className="grid items-start gap-[clamp(32px,5vw,72px)]" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))' }}>
        <Reveal className="flex flex-col gap-5 text-[clamp(17px,1.6vw,19px)] leading-[1.7] text-[#d8d3ce] text-pretty">
          <p className="m-0">Sou desenvolvedor full stack de Pirapozinho, SP, e estou no último ano de Sistemas de Informação na Toledo Prudente Centro Universitário, com conclusão prevista em 2026.</p>
          <p className="m-0">Tenho experiência com Java e Spring Boot, TypeScript com React, Next.js e NestJS, e com IA generativa aplicada em produção. Construo SaaS de ponta a ponta e gosto de unir produto, arquitetura e IA.</p>
        </Reveal>
        <Reveal className="border border-blood/45 bg-coal/55 backdrop-blur-sm">
          <div className="flex justify-between border-b border-blood/35 px-[18px] py-3 font-mono text-[11px] tracking-[.2em] text-ash">
            <span>FICHA · GMF-0001</span>
            <span className="text-sith" style={{ animation: 'pulseGlow 2s infinite' }}>● ATIVO</span>
          </div>
          <div className="relative border-b border-blood/35">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset('/assets/gustavo.webp')}
              alt="Gustavo Martins França sorrindo, de jaqueta preta, fazendo sinal de positivo com a mão"
              width={620}
              height={620}
              loading="lazy"
              className="block aspect-square w-full object-cover object-top"
              style={{ filter: 'contrast(1.05) saturate(.85)' }}
            />
            {/* Tratamento no tema: escurece as bordas e adiciona um leve vermelho embaixo, como foto de crachá. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(139,0,0,.45), transparent 45%), radial-gradient(ellipse at center, transparent 55%, rgba(5,5,5,.55))' }} />
            <span className="absolute bottom-3 left-4 font-mono text-[11px] tracking-[.2em] text-bone" style={{ textShadow: '0 0 8px #000' }}>GUSTAVO M. FRANÇA</span>
          </div>
          {fatos.map((f) => (
            <div key={f.k} className="grid gap-3 border-b border-blood/15 px-[18px] py-3.5" style={{ gridTemplateColumns: '120px 1fr' }}>
              <span className="pt-[3px] font-mono text-[11px] tracking-[.18em] text-ash">{f.k}</span>
              <span className="text-[15px] font-semibold">{f.v}</span>
            </div>
          ))}
        </Reveal>
      </div>
      <Reveal className="mt-[72px] grid gap-px border border-blood/35 bg-blood/35">
        <div className="grid gap-px" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,210px),1fr))' }}>
          {profile.numeros.map((n) => (
            <div key={n.rotulo} className="flex flex-col gap-2.5 bg-[#070707] px-6 py-7">
              <span className="font-display text-[clamp(38px,4.4vw,52px)] font-extrabold text-sith" style={{ textShadow: '0 0 20px rgba(225,6,0,.55)' }}>
                <Counter valor={n.valor} sufixo={n.sufixo} decimais={n.decimais} />
              </span>
              <span className="text-sm leading-normal text-ash">{n.rotulo}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
