'use client';
import { useEffect, useRef, useState } from 'react';
import { experiences } from '@/data/experience';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { Reveal } from '@/components/ui/Reveal';
import { SectionTitle } from '@/components/ui/SectionTitle';

export function Campanhas() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [fill, setFill] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = (window.innerHeight * 0.6 - r.top) / r.height;
      setFill(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    raf = requestAnimationFrame(update);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  const progress = reduced ? 1 : fill;
  const last = experiences.length - 1;

  return (
    <section id="campanhas" data-screen-label="04 Campanhas" className="section-pad relative mx-auto max-w-[1000px]">
      <Reveal><SectionTitle label="// 04 CAMPANHAS" title="Experiência" /></Reveal>
      <div ref={ref} className="relative flex flex-col gap-11 pl-11">
        <div aria-hidden="true" className="absolute bottom-1.5 left-[11px] top-1.5 w-0.5 bg-blood/30" />
        <div
          aria-hidden="true"
          className="absolute left-[11px] top-1.5 w-0.5 bg-ember"
          style={{ height: `calc((100% - 12px) * ${progress})`, boxShadow: '0 0 8px #e10600,0 0 20px #e10600', transition: 'height .15s linear' }}
        />
        <ol className="m-0 flex list-none flex-col gap-11 p-0">
          {experiences.map((t, i) => {
            const lit = progress >= i / last - 0.02;
            return (
              <li key={t.org + t.periodo} className="relative flex flex-col gap-2">
                <span
                  aria-hidden="true"
                  className="absolute -left-10 top-1 h-4 w-4 rotate-45 border-2 border-sith transition-all duration-300"
                  style={{ background: lit ? '#e10600' : '#050505', boxShadow: lit ? '0 0 14px rgba(225,6,0,.9)' : '0 0 6px rgba(225,6,0,.3)' }}
                />
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 font-mono text-xs tracking-[.14em] text-ash">
                  <span className="text-ember">{t.periodo}</span>
                  <span className="border border-blood/50 px-2 py-[3px]">{t.tipo}</span>
                </div>
                <h3 className="m-0 text-[clamp(19px,2vw,23px)] font-bold">{t.cargo}</h3>
                <span className="text-[15px] font-semibold text-[#d8d3ce]">{t.org}</span>
                <p className="m-0 max-w-[680px] text-[15px] leading-[1.65] text-ash text-pretty">{t.descricao}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
