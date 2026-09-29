'use client';
import { useEffect } from 'react';
import { profile } from '@/data/profile';
import { useAudio } from '@/lib/useAudio';
import { Reveal } from '@/components/ui/Reveal';
import { SectionTitle } from '@/components/ui/SectionTitle';

// E-mail, WhatsApp e localização aparecem só como texto (clicar não faz nada).
// GitHub, LinkedIn e currículo são links.
type Linha = { k: string; v: string; url?: string; download?: boolean };
const linhas: Linha[] = [
  { k: 'E-MAIL', v: profile.email },
  { k: 'WHATSAPP', v: profile.whatsappExibido },
  { k: 'GITHUB', v: 'github.com/gustavomf1', url: profile.github },
  { k: 'LINKEDIN', v: 'linkedin.com/in/gustavo-martins-frança', url: profile.linkedin },
  { k: 'CURRÍCULO', v: 'Baixar PDF', url: profile.curriculo, download: true },
  { k: 'LOCALIZAÇÃO', v: profile.local },
];

const linhaClasse = 'grid items-center gap-3 border-b border-blood/30 py-4';
const linhaCols = { gridTemplateColumns: '120px 1fr auto' };
const rotulo = 'font-mono text-[11px] tracking-[.18em] text-[#c9c4bf]';
const valor = 'text-[15.5px] font-semibold text-bone [overflow-wrap:anywhere]';

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
      {/* Painel escuro: mantém o texto legível mesmo quando o laser da Estrela da Morte passa por trás. */}
      <Reveal className="border border-blood/40 bg-void/80 px-6 py-3 backdrop-blur-sm">
        {linhas.map((l) =>
          l.url ? (
            <a
              key={l.k}
              href={l.url}
              target={l.download ? undefined : '_blank'}
              rel="noopener noreferrer"
              download={l.download ? true : undefined}
              onMouseEnter={() => play('blip')}
              className={`${linhaClasse} transition-all hover:bg-blood/15 hover:pl-3.5`}
              style={linhaCols}
            >
              <span className={rotulo}>{l.k}</span>
              <span className={valor}>{l.v}</span>
              <span aria-hidden="true" className="text-ember">{l.download ? '↓' : '↗'}</span>
            </a>
          ) : (
            <div key={l.k} className={linhaClasse} style={linhaCols}>
              <span className={rotulo}>{l.k}</span>
              <span className={valor}>{l.v}</span>
              <span aria-hidden="true" />
            </div>
          ),
        )}
      </Reveal>
      <p className="mt-10 font-display text-lg tracking-[.06em] text-bone" style={{ textShadow: '0 0 14px rgba(225,6,0,.8), 0 0 2px #000' }}>
        {profile.fraseFinal}
      </p>
    </section>
  );
}
