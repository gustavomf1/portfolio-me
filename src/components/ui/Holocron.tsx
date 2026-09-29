'use client';
import { useEffect, useState } from 'react';
import { profile } from '@/data/profile';
import { useAudio } from '@/lib/useAudio';

const stack = ['TypeScript', 'Java', 'Spring Boot', 'React', 'Next.js', 'NestJS', 'PostgreSQL', 'Claude API'];

export function Holocron() {
  const { play } = useAudio();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => { play('door'); setOpen((v) => !v); }}
        aria-label={open ? 'Fechar Holocron' : 'Abrir Holocron'}
        aria-expanded={open}
        className="fixed bottom-4 right-4 z-[250] grid h-14 w-14 cursor-pointer place-items-center border border-blood bg-void/85 backdrop-blur hover:border-ember hover:shadow-[0_0_30px_rgba(225,6,0,.6)]"
      >
        <span aria-hidden="true" className="h-6 w-6 border-2 border-sith" style={{ transform: 'rotate(45deg)', animation: 'holoSpin 6s linear infinite', boxShadow: '0 0 12px rgba(225,6,0,.6)' }} />
      </button>
      {open && (
        <aside aria-label="Holocron" className="fixed bottom-[84px] right-4 z-[250] w-[min(340px,calc(100vw-32px))] border border-blood bg-void/95 backdrop-blur" style={{ boxShadow: '0 0 40px rgba(225,6,0,.3)', animation: 'modalIn .3s both' }}>
          <div className="flex items-center justify-between border-b border-blood/40 px-4 py-2.5 font-mono text-[11px] tracking-[.2em] text-ash">
            <span>HOLOCRON · RESUMO</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Fechar Holocron" className="cursor-pointer text-lg text-bone hover:text-ember">×</button>
          </div>
          <div className="flex flex-col gap-4 p-4">
            <div>
              <div className="font-display text-base font-bold">{profile.nome}</div>
              <div className="mt-1 text-[13px] text-ash">{profile.cargo} · Pirapozinho, SP · remoto e presencial</div>
            </div>
            <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">{stack.map((t) => <li key={t} className="chip">{t}</li>)}</ul>
            <div className="flex flex-col gap-1.5 text-[13px]">
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">linkedin.com/in/gustavo-martins-frança</a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer">github.com/gustavomf1</a>
            </div>
            <a href={profile.curriculo} download className="btn btn-primary justify-center">↓ Baixar currículo</a>
          </div>
        </aside>
      )}
    </>
  );
}
