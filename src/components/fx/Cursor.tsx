'use client';
import { useEffect } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

// Mira vermelha com rastro de laser; vira lâmina de sabre sobre elementos clicáveis. Só com mouse.
export function Cursor() {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return;
    const style = document.createElement('style');
    style.textContent = 'a,button,[role=button],label,summary{cursor:none!important} body{cursor:none}';
    document.head.appendChild(style);
    const mk = (css: string) => {
      const d = document.createElement('div');
      d.setAttribute('aria-hidden', 'true');
      d.style.cssText = `position:fixed;left:0;top:0;pointer-events:none;z-index:99999;${css}`;
      document.body.appendChild(d);
      return d;
    };
    const trail = Array.from({ length: 8 }, (_, i) =>
      mk(`width:${6 - i * 0.5}px;height:${6 - i * 0.5}px;border-radius:50%;background:#e10600;opacity:${0.5 - i * 0.055};box-shadow:0 0 6px #e10600;`));
    const dot = mk('width:8px;height:8px;margin:-4px 0 0 -4px;border-radius:50%;background:#ff2a1f;box-shadow:0 0 8px #e10600,0 0 18px #e10600;transition:width .15s,height .15s,margin .15s,border-radius .15s;');
    let x = -100, y = -100, over = false, raf = 0;
    const pts = trail.map(() => ({ x: -100, y: -100 }));
    const move = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      const h = !!(e.target as Element | null)?.closest?.('a,button,[role=button],select,label,summary');
      if (h !== over) {
        over = h;
        if (h) Object.assign(dot.style, { width: '4px', height: '30px', margin: '-15px 0 0 -2px', borderRadius: '2px', background: '#fff', boxShadow: '0 0 6px #fff,0 0 14px #e10600,0 0 28px #ff2a1f' });
        else Object.assign(dot.style, { width: '8px', height: '8px', margin: '-4px 0 0 -4px', borderRadius: '50%', background: '#ff2a1f', boxShadow: '0 0 8px #e10600,0 0 18px #e10600' });
      }
    };
    window.addEventListener('mousemove', move);
    const loop = () => {
      dot.style.transform = `translate(${x}px,${y}px)`;
      let px = x, py = y;
      pts.forEach((p, i) => { p.x += (px - p.x) * 0.45; p.y += (py - p.y) * 0.45; trail[i].style.transform = `translate(${p.x - 3}px,${p.y - 3}px)`; px = p.x; py = p.y; });
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
      style.remove(); dot.remove(); trail.forEach((t) => t.remove());
    };
  }, [reduced]);
  return null;
}
