'use client';
import { useCallback } from 'react';
import { useReducedMotion } from './useReducedMotion';

// Tilt 3D leve no hover. No-op em toque e com reduced-motion.
export function useTilt(max = 6) {
  const reduced = useReducedMotion();
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg)`;
  }, [max, reduced]);
  const onMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = '';
  }, []);
  return { onMouseMove, onMouseLeave };
}
