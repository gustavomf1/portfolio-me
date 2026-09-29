import { skillGroups } from '@/data/skills';
import type { SkillLevel } from '@/data/types';
import { Kyber } from '@/components/ui/Kyber';
import { Reveal } from '@/components/ui/Reveal';
import { SectionTitle } from '@/components/ui/SectionTitle';

const legenda: SkillLevel[] = ['Dia a dia', 'Confortável', 'Estudando'];

export function Arsenal() {
  return (
    <section id="arsenal" data-screen-label="02 Arsenal" className="section-pad relative mx-auto max-w-[1240px]">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <SectionTitle label="// 02 ARSENAL" title="Stack e ferramentas" />
        <ul className="m-0 mb-12 flex list-none flex-wrap gap-[18px] p-0 font-mono text-xs text-ash">
          {legenda.map((l) => (
            <li key={l} className="flex items-center gap-2">
              <Kyber nivel={l} size={7} glow />
              {l}
            </li>
          ))}
        </ul>
      </Reveal>
      <div className="grid gap-[18px]" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,340px),1fr))' }}>
        {skillGroups.map((c, i) => (
          <Reveal key={c.categoria} delay={(i % 3) * 80}>
            <div className="card flex h-full flex-col gap-[18px] bg-coal/55 p-6">
              <div className="flex items-center gap-3.5">
                <span aria-hidden="true" className="grid h-11 min-w-11 place-items-center border border-blood bg-blood/10 px-1.5 font-mono text-xs font-bold text-ember">{c.icon}</span>
                <h3 className="m-0 font-display text-[15px] font-bold uppercase tracking-[.12em]">{c.categoria}</h3>
              </div>
              <ul className="m-0 flex list-none flex-wrap gap-[7px] p-0">
                {c.itens.map((it) => (
                  <li key={it.nome} title={it.nivel} className="flex items-center gap-2 border border-ash/20 bg-void/70 px-2.5 py-1.5 text-[13px] text-[#e6e1dc]">
                    {it.nome}
                    <Kyber nivel={it.nivel} />
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
