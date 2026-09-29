'use client';
import type { Project } from '@/data/types';
import { asset } from '@/lib/paths';
import { useAudio } from '@/lib/useAudio';
import { useTilt } from '@/lib/useTilt';
import { KafkaDiagram } from './KafkaDiagram';
import { ProjectMockup } from './ProjectMockup';

export function Lock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" role="img" aria-label="Repositório privado">
      <rect x="5" y="11" width="14" height="10" rx="1" /><path d="M8 11V7a4 4 0 018 0v4" />
    </svg>
  );
}

// Imagem do projeto: `prints` (galeria) ou `imagem`; sem nenhuma, mockup SVG (ou o diagrama de eventos).
export function ProjectVisual({ project, index = 0 }: { project: Project; index?: number }) {
  const shot = project.prints?.[index] ?? (project.imagem ? { src: project.imagem, alt: `Tela do projeto ${project.nome}` } : null);
  if (shot) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={asset(shot.src)} alt={shot.alt} loading="lazy" className="h-full w-full object-cover object-top" />;
  }
  return project.diagrama ? <KafkaDiagram /> : <ProjectMockup project={project} />;
}

export function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const { play } = useAudio();
  const tilt = useTilt(project.destaque ? 4 : 7);
  const shown = project.stack.slice(0, 6);
  return (
    <article
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      onMouseEnter={() => play('blip')}
      className="card group relative flex h-full w-full flex-col text-left transition-transform duration-200 [transform-style:preserve-3d]"
    >
      <div className={`relative w-full overflow-hidden border-b border-blood/40 ${project.destaque ? 'h-[230px]' : 'h-[150px]'}`}>
        <ProjectVisual project={project} />
        {project.selo && (
          <span className="absolute left-3 top-3 border border-sith bg-void/85 px-2.5 py-1 font-mono text-[11px] tracking-[.12em] text-ember">{project.selo}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="m-0 font-display text-lg font-bold uppercase tracking-[.08em]">{project.nome}</h3>
          {project.links.privado && <span className="text-ash"><Lock /></span>}
        </div>
        <p className="m-0 text-[15px] leading-relaxed text-[#c9c4bf]">{project.resumo}</p>
        <ul className="m-0 mt-auto flex list-none flex-wrap gap-1.5 p-0 pt-2">
          {shown.map((s) => <li key={s} className="chip">{s}</li>)}
          {project.stack.length > shown.length && <li className="chip">+{project.stack.length - shown.length}</li>}
        </ul>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {/* O ::after estica o botão sobre o card inteiro: clicar em qualquer ponto também abre os detalhes. */}
          <button
            type="button"
            onClick={onOpen}
            aria-label={`Ver detalhes técnicos de ${project.nome}`}
            className="flex w-fit cursor-pointer items-center gap-2 border border-sith px-4 py-2.5 font-mono text-xs uppercase tracking-[.16em] text-bone transition-shadow after:absolute after:inset-0 group-hover:bg-sith/15 group-hover:shadow-[0_0_16px_rgba(225,6,0,.5)]"
          >
            Ver detalhes técnicos <span aria-hidden="true">→</span>
          </button>
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Acessar a aplicação ${project.nome} (abre em nova aba)`}
              className="relative z-10 flex items-center gap-2 border border-ash/40 px-4 py-2.5 font-mono text-xs uppercase tracking-[.16em] text-bone hover:border-ember hover:text-bone"
            >
              Acessar aplicação <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
