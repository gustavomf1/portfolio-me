'use client';
import { useEffect } from 'react';
import { profile } from '@/data/profile';
import { useAudio } from '@/lib/useAudio';
import { Reveal } from '@/components/ui/Reveal';
import { SectionTitle } from '@/components/ui/SectionTitle';

const contatos = [
  { k: 'GITHUB', v: 'github.com/gustavomf1', url: profile.github, download: false },
  { k: 'LINKEDIN', v: 'linkedin.com/in/gustavo-martins-frança', url: profile.linkedin, download: false },
  { k: 'CURRÍCULO', v: 'Baixar PDF', url: profile.curriculo, download: true },
];

export function Comunicacao() {
  const { play } = useAudio();

  useEffect(() => {
    // O terminal (sudo hire gustavo) dispara este evento: leva o visitante até aqui.
    const open = () => document.getElementById('comunicacao')?.scrollIntoView({ behavior: 'smooth' });
    window.addEventListener('sith:open-contact', open);
    return () => window.removeEventListener('sith:open-contact', open);
  }, []);

  return (
    <section id="comunicacao" data-screen-label="05 Comunicação" className="section-pad relative mx-auto max-w-[900px] !pb-20">
      <Reveal><SectionTitle label="// 05 COMUNICAÇÃO" title="Abrir canal" /></Reveal>
      <Reveal className="flex flex-col">
        {contatos.map((c) => (
          <a
            key={c.k}
            href={c.url}
            target={c.download ? undefined : '_blank'}
            rel="noopener noreferrer"
            download={c.download ? true : undefined}
            onMouseEnter={() => play('blip')}
            className="grid items-center gap-3 border-b border-blood/25 py-5 text-bone transition-all hover:bg-blood/10 hover:pl-3.5"
            style={{ gridTemplateColumns: '110px 1fr auto' }}
          >
            <span className="font-mono text-[11px] tracking-[.18em] text-ash">{c.k}</span>
            <span className="text-[15.5px] font-semibold [overflow-wrap:anywhere]">{c.v}</span>
            <span aria-hidden="true" className="text-ember">{c.download ? '↓' : '↗'}</span>
          </a>
        ))}
        <p className="mt-10 font-display text-lg tracking-[.06em] text-sith glow-text">{profile.fraseFinal}</p>
      </Reveal>
    </section>
  );
}
