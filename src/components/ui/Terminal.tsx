'use client';
import { useEffect, useRef, useState } from 'react';
import { runCommand } from '@/lib/terminal';
import { useAudio } from '@/lib/useAudio';

type Line = { s: string; c: string };
const G = '#9a9a9a', A = '#ff2a1f', W = '#f2ede8';
const BOAS_VINDAS: Line[] = [
  { s: 'SISTEMA IMPERIAL · TERMINAL v2.6', c: A },
  { s: 'Acesso concedido. Digite "help" para ver os comandos.', c: G },
];

export function Terminal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { play } = useAudio();
  const [lines, setLines] = useState<Line[]>(BOAS_VINDAS);
  const [input, setInput] = useState('');
  const history = useRef<string[]>([]);
  const cursor = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    play('door');
    setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose, play]);

  useEffect(() => {
    if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight;
  }, [lines]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = input;
    setInput('');
    if (raw.trim()) { history.current.push(raw); cursor.current = history.current.length; }
    play('blip');
    const r = runCommand(raw);
    if (r.action === 'clear') { setLines([]); return; }
    const echo: Line = { s: `gmf@império:~$ ${raw}`, c: A };
    setLines((l) => [...l, echo, ...r.lines.map((s) => ({ s, c: W }))]);
    if (r.action === 'close') setTimeout(onClose, 500);
    if (r.action === 'open-contact') setTimeout(() => { onClose(); window.dispatchEvent(new Event('sith:open-contact')); }, 1600);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const h = history.current;
    if (e.key === 'ArrowUp' && h.length) { e.preventDefault(); cursor.current = Math.max(0, cursor.current - 1); setInput(h[cursor.current]); }
    if (e.key === 'ArrowDown' && h.length) { e.preventDefault(); cursor.current = Math.min(h.length, cursor.current + 1); setInput(h[cursor.current] ?? ''); }
  };

  return (
    <div className="fixed inset-0 z-[9200] grid place-items-center bg-void/80 p-4 backdrop-blur-sm" style={{ animation: 'fadeIn .25s both' }} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label="Terminal imperial" className="flex h-[min(520px,85vh)] w-full max-w-[760px] flex-col border border-blood bg-void" style={{ boxShadow: '0 0 60px rgba(225,6,0,.3)', animation: 'modalIn .3s both' }}>
        <div className="flex items-center justify-between border-b border-blood/40 px-4 py-2.5 font-mono text-[11px] tracking-[.2em] text-ash">
          <span>TERMINAL · GMF@IMPÉRIO</span>
          <button type="button" onClick={onClose} aria-label="Fechar terminal" className="cursor-pointer text-lg text-bone hover:text-ember">×</button>
        </div>
        <div ref={outRef} className="flex-1 overflow-auto p-4 font-mono text-[13.5px] leading-relaxed" role="log" aria-live="polite">
          {lines.map((l, i) => <div key={i} style={{ color: l.c }} className="whitespace-pre-wrap">{l.s}</div>)}
        </div>
        <form onSubmit={submit} className="flex items-center gap-2 border-t border-blood/40 px-4 py-3 font-mono text-[13.5px]">
          <label htmlFor="term-in" className="text-ember">gmf@império:~$</label>
          <input id="term-in" ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown} autoComplete="off" spellCheck={false} className="flex-1 bg-transparent text-bone outline-none" />
        </form>
      </div>
    </div>
  );
}
