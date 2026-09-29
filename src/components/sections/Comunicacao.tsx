'use client';
import { useEffect, useRef, useState } from 'react';
import { profile } from '@/data/profile';
import { buildMailto } from '@/lib/contact';
import { useAudio } from '@/lib/useAudio';
import { Reveal } from '@/components/ui/Reveal';
import { SectionTitle } from '@/components/ui/SectionTitle';

const contatos = [
  { k: 'E-MAIL', v: profile.email, url: `mailto:${profile.email}` },
  { k: 'GITHUB', v: 'github.com/gustavomf1', url: profile.github },
  { k: 'LINKEDIN', v: 'linkedin.com/in/gustavo-martins-frança', url: profile.linkedin },
  { k: 'WHATSAPP', v: 'Chamar no WhatsApp', url: profile.whatsapp },
  { k: 'CURRÍCULO', v: 'Baixar PDF', url: profile.curriculo },
];

const campo = 'w-full border border-blood/50 bg-void/80 px-4 py-3 font-body text-[15px] text-bone placeholder:text-[#6a6a6a] focus-visible:border-ember';

export function Comunicacao() {
  const { play } = useAudio();
  const nomeRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Terminal e Holocron disparam este evento (sudo hire gustavo).
    const open = () => {
      document.getElementById('comunicacao')?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => nomeRef.current?.focus({ preventScroll: true }), 700);
    };
    window.addEventListener('sith:open-contact', open);
    return () => window.removeEventListener('sith:open-contact', open);
  }, []);

  const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const nome = String(f.get('nome') ?? '');
    const email = String(f.get('email') ?? '');
    const mensagem = String(f.get('mensagem') ?? '');
    play('blip');
    if (profile.formspree) {
      setStatus('Transmitindo…');
      try {
        const r = await fetch(profile.formspree, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ nome, email, mensagem }),
        });
        setStatus(r.ok ? 'Transmissão recebida. Responderei em breve.' : 'Falha na transmissão. Tente pelo e-mail.');
      } catch {
        setStatus('Falha na transmissão. Tente pelo e-mail.');
      }
      return;
    }
    window.location.href = buildMailto(profile.email, nome, email, mensagem);
    setStatus('Abrindo seu cliente de e-mail…');
  };

  return (
    <section id="comunicacao" data-screen-label="05 Comunicação" className="section-pad relative mx-auto max-w-[1240px] !pb-20">
      <Reveal><SectionTitle label="// 05 COMUNICAÇÃO" title="Abrir canal" /></Reveal>
      <div className="grid items-start gap-[clamp(28px,5vw,64px)]" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))' }}>
        <Reveal>
          <form onSubmit={enviar} className="relative flex flex-col gap-4 border border-blood/50 bg-coal/55 p-6 backdrop-blur-sm" style={{ boxShadow: 'inset 0 0 40px rgba(139,0,0,.12)' }}>
            <span className="flex items-center gap-2.5 font-mono text-[11px] tracking-[.2em] text-ash">
              <span className="h-2 w-2 rounded-full bg-sith" style={{ animation: 'pulseGlow 2s infinite' }} />
              TRANSMISSÃO HOLOGRÁFICA · CANAL SEGURO
            </span>
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-xs text-ember">&gt; nome</span>
              <input ref={nomeRef} required name="nome" autoComplete="name" className={campo} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-xs text-ember">&gt; e-mail</span>
              <input required type="email" name="email" autoComplete="email" className={campo} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-xs text-ember">&gt; mensagem</span>
              <textarea required name="mensagem" rows={5} className={`${campo} resize-y`} />
            </label>
            <button type="submit" className="btn btn-primary h-[54px] justify-center">Transmitir mensagem</button>
            {status && <span role="status" className="font-mono text-xs text-ash">{status}</span>}
          </form>
        </Reveal>
        <Reveal className="flex flex-col">
          {contatos.map((c) => (
            <a
              key={c.k}
              href={c.url}
              target={c.url.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              onMouseEnter={() => play('blip')}
              className="grid items-center gap-3 border-b border-blood/25 py-4 text-bone transition-all hover:bg-blood/10 hover:pl-3.5"
              style={{ gridTemplateColumns: '110px 1fr auto' }}
            >
              <span className="font-mono text-[11px] tracking-[.18em] text-ash">{c.k}</span>
              <span className="text-[15.5px] font-semibold [overflow-wrap:anywhere]">{c.v}</span>
              <span aria-hidden="true" className="text-ember">↗</span>
            </a>
          ))}
          <div className="grid gap-3 border-b border-blood/25 py-4" style={{ gridTemplateColumns: '110px 1fr' }}>
            <span className="font-mono text-[11px] tracking-[.18em] text-ash">LOCALIZAÇÃO</span>
            <span className="text-[15.5px] font-semibold">{profile.local}</span>
          </div>
          <p className="mt-8 font-display text-lg tracking-[.06em] text-sith glow-text">{profile.fraseFinal}</p>
        </Reveal>
      </div>
    </section>
  );
}
