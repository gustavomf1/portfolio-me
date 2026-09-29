'use client';
import { useRef } from 'react';
import { useAudio } from '@/lib/useAudio';
import { toast } from './Toast';

// 5 cliques seguidos (até 1,5 s entre eles) tocam a Marcha Imperial. Um clique só rola para o início.
export function Logo() {
  const { unlock, play } = useAudio();
  const count = useRef({ n: 0, t: 0 });
  const onClick = (e: React.MouseEvent) => {
    const now = Date.now();
    const c = count.current;
    c.n = now - c.t < 1500 ? c.n + 1 : 1;
    c.t = now;
    if (c.n >= 5) {
      e.preventDefault();
      c.n = 0;
      unlock();
      play('march');
      toast('Impressionante. Mais uma vez, o código compila.', 4200);
    }
  };
  return (
    <a href="#inicio" onClick={onClick} aria-label="Início" className="flex items-center gap-2 font-display text-lg font-extrabold tracking-[.2em] text-bone hover:text-bone">
      <span aria-hidden="true" className="inline-block h-6 w-[3px] bg-sith shadow-[0_0_10px_#e10600]" />
      GMF
    </a>
  );
}
