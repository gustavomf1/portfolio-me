'use client';
import { audio } from '@/lib/audio';
import { useAudio } from '@/lib/useAudio';

export function MuteButton() {
  const { muted, toggle, unlock } = useAudio();
  return (
    <button
      type="button"
      onClick={() => {
        // Primeiro clique com o som "ligado" só inicia a trilha; senão o visitante que quer som ficaria mudo.
        const startOnly = !audio.isUnlocked() && !audio.isMuted();
        unlock();
        if (!startOnly) toggle();
      }}
      aria-label={muted ? 'Ativar som' : 'Desativar som'}
      aria-pressed={!muted}
      className="fixed bottom-4 left-4 z-[250] grid h-11 w-11 place-items-center border border-blood bg-void/80 text-bone backdrop-blur hover:shadow-[0_0_18px_rgba(225,6,0,.5)]"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
        {muted ? <path d="M17 9l5 6M22 9l-5 6" stroke="#ff2a1f" /> : <path d="M16 8a5 5 0 010 8M19 5a9 9 0 010 14" />}
      </svg>
    </button>
  );
}
