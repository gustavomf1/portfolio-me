import { aiLearnings, aiSteps } from '@/data/ai-pipeline';
import { AiDemo } from '@/components/ui/AiDemo';
import { Reveal } from '@/components/ui/Reveal';
import { SectionTitle } from '@/components/ui/SectionTitle';

export function DestaqueIA() {
  return (
    <section id="ia" data-screen-label="05 Destaque IA" className="section-pad relative mx-auto max-w-[1240px]">
      <Reveal><SectionTitle label="// 05 INTELIGÊNCIA ARTIFICIAL" title="IA em produção" /></Reveal>
      <Reveal>
        <ol aria-label="Pipeline de IA: prompt, LLM, saída estruturada, validação, resposta" className="m-0 mb-14 grid list-none gap-3 p-0 md:grid-cols-5">
          {aiSteps.map((s, i) => (
            <li key={s.id} className="relative flex flex-col gap-2 border border-blood/45 bg-coal/55 p-4">
              <span className="font-mono text-xs text-sith">{`0${i + 1}`}</span>
              <h3 className="m-0 font-display text-sm font-bold uppercase tracking-[.1em]">{s.titulo}</h3>
              <p className="m-0 text-[13px] leading-normal text-ash">{s.detalhe}</p>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-ember"
                style={{ animation: 'pipelinePulse 5s ease-in-out infinite', animationDelay: `${i}s`, boxShadow: '0 0 10px #e10600' }}
              />
            </li>
          ))}
        </ol>
      </Reveal>
      <div className="grid items-start gap-10" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,380px),1fr))' }}>
        <Reveal>
          <h3 className="m-0 mb-4 font-display text-lg font-bold uppercase tracking-[.1em]">O que aprendi em produção</h3>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {aiLearnings.map((l) => (
              <li key={l} className="flex gap-3 text-[16px] leading-relaxed text-[#d8d3ce]">
                <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-sith" />
                {l}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal><AiDemo /></Reveal>
      </div>
    </section>
  );
}
