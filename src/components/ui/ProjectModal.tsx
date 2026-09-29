'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Project } from '@/data/types';
import { asset } from '@/lib/paths';
import { useAudio } from '@/lib/useAudio';
import { Lock, ProjectVisual } from './ProjectCard';

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5">
      <h4 className="m-0 font-mono text-xs tracking-[.22em] text-sith">{'// '}{titulo}</h4>
      {children}
    </section>
  );
}

const FOCUSABLE = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const { play } = useAudio();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [sel, setSel] = useState({ slug: '', i: 0 }); // tela escolhida na galeria (volta para a 1ª ao trocar de projeto)

  useEffect(() => {
    if (!project) return;
    play('door');
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const els = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, [project, onClose, play]);

  if (!project) return null;
  const b = project.briefing;
  const prints = project.prints ?? [];
  const shotIndex = sel.slug === project.slug ? sel.i : 0;
  // Portal no body: dentro do <main> o modal ficaria abaixo do menu fixo e do grão/scanlines.
  return createPortal(
    <div className="fixed inset-0 z-[9000] grid place-items-center bg-void/85 p-4 backdrop-blur-sm" style={{ animation: 'fadeIn .25s both' }} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        className="relative max-h-[90vh] w-full max-w-[880px] overflow-auto border border-blood bg-abyss"
        style={{ animation: 'modalIn .35s both', boxShadow: '0 0 60px rgba(225,6,0,.25)' }}
      >
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Fechar briefing" className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center border border-blood bg-void/85 text-bone hover:border-ember">✕</button>
        <div className={`w-full overflow-hidden border-b border-blood/40 bg-void ${prints.length ? 'h-[clamp(220px,42vw,420px)] [&_img]:!object-contain' : 'h-[220px]'}`}>
          <ProjectVisual project={project} index={shotIndex} />
        </div>
        {prints.length > 1 && (
          <ul aria-label="Telas do projeto" className="m-0 flex list-none gap-2 overflow-x-auto border-b border-blood/40 bg-abyss p-3">
            {prints.map((p, i) => (
              <li key={p.src} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setSel({ slug: project.slug, i })}
                  aria-label={`Ver tela ${i + 1}: ${p.alt}`}
                  aria-current={i === shotIndex}
                  className={`block h-16 w-28 cursor-pointer overflow-hidden border ${i === shotIndex ? 'border-ember shadow-[0_0_10px_rgba(225,6,0,.5)]' : 'border-blood/50 opacity-70 hover:opacity-100'}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(p.src)} alt="" className="h-full w-full object-cover object-top" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-col gap-7 p-[clamp(20px,4vw,40px)]">
          <header className="flex flex-col gap-2.5">
            <span className="font-mono text-[13px] tracking-[.24em] text-sith">BRIEFING DE MISSÃO</span>
            <h3 id="modal-titulo" className="m-0 font-display text-[clamp(24px,3.4vw,38px)] font-extrabold uppercase tracking-[.06em]">{project.nome}</h3>
            {project.selo && <span className="font-mono text-xs tracking-[.14em] text-ember">{project.selo}</span>}
          </header>
          <Bloco titulo="CONTEXTO"><p className="m-0 leading-relaxed text-[#d8d3ce]">{b.contexto}</p></Bloco>
          <Bloco titulo="DESAFIO"><p className="m-0 leading-relaxed text-[#d8d3ce]">{b.desafio}</p></Bloco>
          <Bloco titulo="O QUE CONSTRUÍ">
            <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 leading-relaxed text-[#d8d3ce]">{b.construi.map((x) => <li key={x}>{x}</li>)}</ul>
          </Bloco>
          <Bloco titulo="DECISÕES TÉCNICAS">
            <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 leading-relaxed text-[#d8d3ce]">{b.decisoes.map((x) => <li key={x}>{x}</li>)}</ul>
          </Bloco>
          <Bloco titulo="RESULTADO"><p className="m-0 leading-relaxed text-[#d8d3ce]">{b.resultado}</p></Bloco>
          <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">{project.stack.map((s) => <li key={s} className="chip">{s}</li>)}</ul>
          <div className="flex flex-wrap items-center gap-3.5 border-t border-blood/30 pt-5">
            {project.links.demo && (
              <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Acessar aplicação ↗</a>
            )}
            {project.links.repo?.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="btn">{l.label} ↗</a>
            ))}
            {project.links.privado && (
              <span className="flex items-center gap-2 font-mono text-xs tracking-[.08em] text-ash"><span className="text-ember"><Lock /></span> Repositório privado, código sob NDA/comercial</span>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
