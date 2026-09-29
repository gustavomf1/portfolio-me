'use client';
import { useState } from 'react';
import { projects } from '@/data/projects';
import type { Categoria, Project } from '@/data/types';
import { CATEGORIAS, filterProjects } from '@/lib/projects';
import { useAudio } from '@/lib/useAudio';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { ProjectModal } from '@/components/ui/ProjectModal';
import { Reveal } from '@/components/ui/Reveal';
import { SectionTitle } from '@/components/ui/SectionTitle';

export function Missoes() {
  const { play } = useAudio();
  const [cat, setCat] = useState<Categoria | 'Todos'>('Todos');
  const [open, setOpen] = useState<Project | null>(null);
  const list = filterProjects(projects, cat);
  const firstFeatured = list.find((p) => p.destaque)?.slug;

  return (
    <section id="missoes" data-screen-label="03 Missões" className="section-pad relative mx-auto max-w-[1320px]">
      <Reveal><SectionTitle label="// 03 MISSÕES" title="Projetos selecionados" /></Reveal>
      <div role="group" aria-label="Filtrar por categoria" className="mb-9 flex flex-wrap gap-2.5">
        {CATEGORIAS.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cat === c}
            onClick={() => { setCat(c); play('blip'); }}
            className={`cursor-pointer border px-4 py-2 font-mono text-xs uppercase tracking-[.16em] transition-shadow ${cat === c ? 'border-sith bg-sith/15 text-bone shadow-[0_0_14px_rgba(225,6,0,.4)]' : 'border-blood/50 text-ash hover:text-bone'}`}
          >
            {c}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <p role="status" className="font-mono text-ash">Nenhuma missão nesta categoria ainda.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6">
          {list.map((p) => {
            const lead = p.slug === firstFeatured;
            const span = p.destaque ? (lead ? 'lg:col-span-6' : 'lg:col-span-3') : 'lg:col-span-2';
            return (
              <div key={p.slug} className={`${span} ${lead ? 'md:col-span-2' : ''}`}>
                <ProjectCard project={p} onOpen={() => setOpen(p)} />
              </div>
            );
          })}
        </div>
      )}
      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </section>
  );
}
