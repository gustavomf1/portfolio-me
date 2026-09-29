'use client';
import { useEffect, useState } from 'react';
import { useReveal } from '@/lib/useReveal';
import { useReducedMotion } from '@/lib/useReducedMotion';

export function Counter({ valor, sufixo = '', decimais = 0 }: { valor: number; sufixo?: string; decimais?: number }) {
  const { ref, visible } = useReveal<HTMLSpanElement>();
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!visible) return;
    if (reduced) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1400);
      setN(valor * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, reduced, valor]);
  return (
    <span ref={ref}>
      {(reduced ? valor : n).toLocaleString('pt-BR', { minimumFractionDigits: decimais, maximumFractionDigits: decimais })}
      {sufixo}
    </span>
  );
}
