'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAudio } from '@/lib/useAudio';
import { Logo } from './Logo';
import { MuteButton } from './MuteButton';

export const SECTIONS = [
  { id: 'inicio', label: 'Início' },
  { id: 'identificacao', label: 'Identificação' },
  { id: 'arsenal', label: 'Arsenal' },
  { id: 'missoes', label: 'Missões' },
  { id: 'campanhas', label: 'Campanhas' },
  { id: 'comunicacao', label: 'Comunicação' },
] as const;

export function Nav() {
  const { play } = useAudio();
  const [active, setActive] = useState<string>('inicio');
  const [open, setOpen] = useState(false);
  const [blade, setBlade] = useState({ left: 0, width: 0 });
  const refs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    SECTIONS.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      const el = refs.current[active];
      if (el) setBlade({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active]);

  const go = () => { play('swing'); setOpen(false); };

  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 top-0 z-[200] flex h-[68px] items-center justify-between gap-5 border-b border-blood/30 bg-void/75 px-[clamp(16px,4vw,40px)] backdrop-blur-md"
    >
      <Logo />
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={() => { play('door'); window.dispatchEvent(new Event('sith:open-terminal')); }}
          aria-label="Abrir terminal"
          className="hidden h-[38px] cursor-pointer items-center border border-blood/60 px-3 font-mono text-xs tracking-[.1em] text-bone hover:border-ember xl:flex"
        >
          &gt;_ TERMINAL
        </button>
        <MuteButton />
      </div>
      <button
        type="button"
        className="xl:hidden grid h-10 w-10 place-items-center"
        aria-label="Menu"
        aria-expanded={open}
        aria-controls="menu-lista"
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true" className="relative block h-[2px] w-6 bg-sith shadow-[0_0_8px_#e10600] before:absolute before:-top-2 before:h-[2px] before:w-6 before:bg-sith after:absolute after:top-2 after:h-[2px] after:w-6 after:bg-sith" />
      </button>
      <ul
        id="menu-lista"
        className={`${open ? 'fixed inset-x-0 top-[68px] flex max-h-[calc(100dvh-68px)] flex-col gap-1 overflow-y-auto border-b border-blood/40 bg-void/98 p-4 backdrop-blur-md' : 'hidden'} xl:static xl:flex xl:flex-row xl:items-center xl:gap-7 xl:p-0 xl:bg-transparent xl:border-0`}
      >
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              ref={(el) => { refs.current[s.id] = el; }}
              onClick={go}
              onMouseEnter={() => play('blip')}
              aria-current={active === s.id ? 'true' : undefined}
              className={`block py-3 font-mono text-[13px] uppercase tracking-[.14em] xl:py-0 ${active === s.id ? 'text-bone' : 'text-ash'} hover:text-bone`}
            >
              {s.label}
            </a>
          </li>
        ))}
        <li className="xl:hidden">
          <button
            type="button"
            onClick={() => { play('door'); setOpen(false); window.dispatchEvent(new Event('sith:open-terminal')); }}
            className="block w-full cursor-pointer py-3 text-left font-mono text-[13px] uppercase tracking-[.14em] text-ash hover:text-bone"
          >
            &gt;_ Terminal
          </button>
        </li>
      </ul>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 hidden h-[3px] xl:block"
        style={{
          left: blade.left,
          width: blade.width,
          transition: 'left .35s ease, width .35s ease',
          background: 'linear-gradient(90deg,#8b0000,#ff2a1f)',
          boxShadow: '0 0 12px #e10600',
        }}
      />
    </nav>
  );
}
