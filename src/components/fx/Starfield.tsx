'use client';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

// Campo de estrelas com parallax (scroll + mouse) e poeira vermelha. Canvas fixo atrás do conteúdo.
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    const resize = () => {
      W = c.clientWidth; H = c.clientHeight;
      c.width = W * dpr; c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 280 }, () => ({ x: Math.random(), y: Math.random(), z: Math.random() * 0.9 + 0.1, tw: Math.random() * 6.28 }));
    const dust = Array.from({ length: 46 }, () => ({
      x: Math.random(), y: Math.random(), r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.00012, vy: -Math.random() * 0.00022 - 0.00004, a: Math.random() * 0.5 + 0.15,
    }));
    let mx = 0, my = 0, tx = 0, ty = 0, raf = 0;
    const onMove = (e: MouseEvent) => { tx = e.clientX / window.innerWidth - 0.5; ty = e.clientY / window.innerHeight - 0.5; };
    window.addEventListener('mousemove', onMove);

    const draw = (ts: number) => {
      mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
      ctx.clearRect(0, 0, W, H);
      const sy = window.scrollY;
      for (const s of stars) {
        const x = (((s.x * W - mx * 50 * s.z) % W) + W) % W;
        const y = (((s.y * H - sy * 0.18 * s.z - my * 36 * s.z) % H) + H) % H;
        const a = 0.25 + 0.7 * s.z * (0.65 + 0.35 * Math.sin(ts * 0.0018 + s.tw));
        ctx.fillStyle = `rgba(242,237,232,${a.toFixed(3)})`;
        const sz = s.z * 1.7;
        ctx.fillRect(x, y, sz, sz);
      }
      ctx.shadowColor = '#e10600'; ctx.shadowBlur = 8;
      for (const p of dust) {
        if (!reduced) { p.x = (p.x + p.vx + 1) % 1; p.y = (p.y + p.vy + 1) % 1; }
        const x = p.x * W - mx * 20;
        const y = (((p.y * H - sy * 0.08) % H) + H) % H;
        ctx.fillStyle = `rgba(225,6,0,${p.a})`;
        ctx.beginPath(); ctx.arc(x, y, p.r, 0, 6.283); ctx.fill();
      }
      ctx.shadowBlur = 0;
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    const onScroll = () => requestAnimationFrame(draw);
    if (reduced) window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, [reduced]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
