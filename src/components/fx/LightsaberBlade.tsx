'use client';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

// Lâmina que cruza a tela quando o sabre é ativado (evento `sith:activated`).
export function LightsaberBlade() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const fire = () => {
      const el = ref.current;
      if (!el) return;
      if (reduced) { el.animate([{ opacity: 0.9 }, { opacity: 0 }], { duration: 300 }); return; }
      el.animate(
        [
          { transform: 'scaleX(0)', opacity: 1, offset: 0 },
          { transform: 'scaleX(1)', opacity: 1, offset: 0.55 },
          { transform: 'scaleX(1)', opacity: 1, offset: 0.75 },
          { transform: 'scaleX(1)', opacity: 0, offset: 1 },
        ],
        { duration: 1100, easing: 'cubic-bezier(.2,.7,.2,1)' },
      );
    };
    window.addEventListener('sith:activated', fire);
    return () => window.removeEventListener('sith:activated', fire);
  }, [reduced]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-1/2 z-[400] -mt-0.5 h-1 w-screen origin-left rounded-[3px] bg-white opacity-0"
      style={{ transform: 'scaleX(0)', boxShadow: '0 0 8px #e10600,0 0 22px #e10600,0 0 60px #ff2a1f,0 0 120px rgba(225,6,0,.6)' }}
    />
  );
}
