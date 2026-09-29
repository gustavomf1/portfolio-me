'use client';
import { useEffect, useRef, useState } from 'react';

export function toast(msg: string, ms = 3600) {
  window.dispatchEvent(new CustomEvent('sith:toast', { detail: { msg, ms } }));
}

export function Toast() {
  const [msg, setMsg] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>(null);
  useEffect(() => {
    const on = (e: Event) => {
      const { msg: m, ms } = (e as CustomEvent<{ msg: string; ms: number }>).detail;
      setMsg(m);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setMsg(''), ms);
    };
    window.addEventListener('sith:toast', on);
    return () => window.removeEventListener('sith:toast', on);
  }, []);
  if (!msg) return null;
  return (
    <div role="status" className="fixed left-1/2 top-[92px] z-[9500] max-w-[calc(100vw-32px)] -translate-x-1/2 border border-sith bg-void/95 px-5 py-3 text-center font-mono text-sm text-bone" style={{ boxShadow: '0 0 24px rgba(225,6,0,.5)', animation: 'fadeIn .3s both' }}>
      {msg}
    </div>
  );
}
