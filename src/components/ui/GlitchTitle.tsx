'use client';
import { createElement } from 'react';
import { useReveal } from '@/lib/useReveal';

export function GlitchTitle({ as = 'h2', children, className = '' }: { as?: 'h1' | 'h2' | 'h3'; children: string; className?: string }) {
  const { ref, visible } = useReveal<HTMLElement>();
  return createElement(
    as,
    {
      ref,
      'data-text': children,
      className: `glitch ${visible ? 'is-visible' : ''} font-display uppercase tracking-[.07em] [overflow-wrap:anywhere] sm:tracking-[.14em] glow-text ${className}`,
    },
    children,
  );
}
