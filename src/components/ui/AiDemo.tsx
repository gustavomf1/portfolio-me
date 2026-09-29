'use client';
import { useEffect, useRef, useState } from 'react';
import { demoCategorias } from '@/data/ai-pipeline';
import { buildDemoLog, classifyDemo, type DemoLinha, type DemoResultado } from '@/lib/classify-demo';
import { useAudio } from '@/lib/useAudio';
import { useReducedMotion } from '@/lib/useReducedMotion';

const TOM: Record<DemoLinha['tom'], string> = { muted: '#9a9a9a', normal: '#f2ede8', alerta: '#ff2a1f', ok: '#e10600' };
const EXEMPLOS = ['Uber para o trabalho', 'Almoço no restaurante', 'Netflix', 'Presente de aniversário'];

// Simulação local: nenhuma API é chamada. Mostra o caminho prompt, saída estruturada, validação, resposta.
export function AiDemo() {
  const { play } = useAudio();
  const reduced = useReducedMotion();
  const [texto, setTexto] = useState('');
  const [aviso, setAviso] = useState('');
  const [log, setLog] = useState<DemoLinha[]>([]);
  const [res, setRes] = useState<DemoResultado | null>(null);
  const [final, setFinal] = useState<string | null>(null);
  const [rodando, setRodando] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const classificar = (t = texto) => {
    if (rodando) return;
    if (!t.trim()) { setAviso('Descreva um gasto para classificar.'); return; }
    setAviso('');
    const r = classifyDemo(t);
    const steps = buildDemoLog(r);
    setRes(r); setFinal(null); setLog([]); setRodando(true);
    let i = 0;
    const tick = () => {
      play('blip');
      setLog(steps.slice(0, i + 1));
      i += 1;
      if (i < steps.length) timer.current = setTimeout(tick, reduced ? 0 : 480);
      else setRodando(false);
    };
    timer.current = setTimeout(tick, 120);
  };

  const pronto = res && !rodando && log.length > 0;

  return (
    <div className="border border-blood/45 bg-coal/55 p-6">
      <p className="m-0 mb-1 font-mono text-[11px] tracking-[.2em] text-sith">{'// DEMO · CLASSIFICADOR DE GASTOS'}</p>
      <p className="m-0 mb-4 text-sm text-ash">Simulação no navegador, nenhuma API é chamada.</p>
      <form onSubmit={(e) => { e.preventDefault(); classificar(); }} className="flex flex-wrap gap-3">
        <label htmlFor="demo-texto" className="sr-only">Descrição do gasto</label>
        <input
          id="demo-texto"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Descreva um gasto, ex.: Uber para o trabalho"
          className="h-12 min-w-[220px] flex-1 border border-blood/50 bg-void px-4 font-body text-bone placeholder:text-[#6a6a6a]"
        />
        <button type="submit" disabled={rodando} className="btn btn-primary h-12 disabled:opacity-60">Classificar</button>
      </form>
      {aviso && <p role="status" className="mt-2 font-mono text-xs text-ember">{aviso}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {EXEMPLOS.map((e) => (
          <button key={e} type="button" className="chip cursor-pointer hover:text-bone" onClick={() => { setTexto(e); classificar(e); }}>{e}</button>
        ))}
      </div>
      {log.length > 0 && (
        <pre aria-live="polite" className="mt-5 overflow-x-auto whitespace-pre-wrap border border-blood/30 bg-void p-4 font-mono text-[12.5px] leading-relaxed">
          {log.map((l, i) => <span key={i} className="block" style={{ color: TOM[l.tom] }}>{l.texto}</span>)}
        </pre>
      )}
      {pronto && (
        <div className="mt-5 flex flex-wrap items-center gap-4 border p-4" style={{ borderColor: res.requerConfirmacao ? '#ff2a1f' : 'rgba(139,0,0,.6)' }}>
          <div>
            <p className="m-0 font-mono text-[11px] tracking-[.18em] text-ash">CATEGORIA</p>
            <p className="m-0 font-display text-xl font-bold text-bone">{final ?? res.categoria}</p>
          </div>
          <div className="min-w-[140px] flex-1">
            <p className="m-0 mb-1 font-mono text-[11px] tracking-[.18em] text-ash">CONFIANÇA {Math.round(res.confianca * 100)}%</p>
            <div className="h-1.5 bg-void"><div className="h-full bg-sith transition-[width] duration-700" style={{ width: `${res.confianca * 100}%`, boxShadow: '0 0 8px #e10600' }} /></div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {final ? (
              <span className="font-mono text-xs text-ash">Categoria definida por você.</span>
            ) : (
              <>
                <button type="button" className="btn h-10" onClick={() => setFinal(res.categoria)}>Confirmar</button>
                <label className="sr-only" htmlFor="demo-cat">Sobrescrever categoria</label>
                <select id="demo-cat" defaultValue="" onChange={(e) => e.target.value && setFinal(e.target.value)} className="h-10 border border-blood/50 bg-void px-2 font-mono text-xs text-bone">
                  <option value="">Sobrescrever…</option>
                  {demoCategorias.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
