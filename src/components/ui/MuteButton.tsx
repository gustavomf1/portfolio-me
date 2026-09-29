'use client';
import { useAudio } from '@/lib/useAudio';

// Liga/desliga a música de fundo. O botão reflete se a trilha está de fato tocando: se o navegador
// bloqueou o autoplay, ele aparece como "desligado" e o clique inicia a trilha.
export function MuteButton() {
  const { muted, playing, toggle, unlock } = useAudio();
  return (
    <button
      type="button"
      onClick={() => {
        if (playing) { toggle(); return; }
        unlock();
        if (muted) toggle(); // estava silenciado por preferência salva: reativa
      }}
      aria-label={playing ? 'Desativar som' : 'Ativar som'}
      aria-pressed={playing}
      title={playing ? 'Desativar som' : 'Ativar som'}
      className="grid h-[38px] w-[38px] shrink-0 cursor-pointer place-items-center border border-blood/60 text-bone hover:border-ember hover:shadow-[0_0_14px_rgba(225,6,0,.5)]"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
        {playing ? <path d="M16 8a5 5 0 010 8M19 5a9 9 0 010 14" /> : <path d="M17 9l5 6M22 9l-5 6" stroke="#ff2a1f" />}
      </svg>
    </button>
  );
}
