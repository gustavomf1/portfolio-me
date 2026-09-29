'use client';
import { useCallback, useEffect, useState } from 'react';
import { profile } from '@/data/profile';
import { createSequenceMatcher, KONAMI, SITH } from '@/lib/easter-eggs';
import { useAudio } from '@/lib/useAudio';
import { Terminal } from './Terminal';
import { toast } from './Toast';

const ASCII = `
 ███████╗██╗████████╗██╗  ██╗
 ██╔════╝██║╚══██╔══╝██║  ██║
 ███████╗██║   ██║   ███████║
 ╚════██║██║   ██║   ██╔══██║
 ███████║██║   ██║   ██║  ██║
 ╚══════╝╚═╝   ╚═╝   ╚═╝  ╚═╝
`;

export function EasterEggs() {
  const { unlock, play } = useAudio();
  const [term, setTerm] = useState(false);
  const closeTerm = useCallback(() => setTerm(false), []);

  useEffect(() => {
    // Console para quem inspeciona a página.
    console.log('%c' + ASCII, 'color:#e10600;font-family:monospace');
    console.log('%cVocê inspeciona o código. Gostamos de você.', 'color:#ff2a1f;font-weight:bold;font-size:14px');
    console.log(`%cGostou do que viu? Estou aberto a novas oportunidades: ${profile.email}`, 'color:#9a9a9a');
  }, []);

  useEffect(() => {
    const konami = createSequenceMatcher(KONAMI);
    const sith = createSequenceMatcher(SITH);
    let busy = false;
    const lightSide = () => {
      if (busy) return;
      busy = true;
      document.documentElement.classList.add('light-side');
      toast('Você caiu para o lado luminoso…', 2800);
      setTimeout(() => {
        document.documentElement.classList.remove('light-side');
        unlock();
        play('ignition');
        toast('Você não pode escapar do seu destino.', 3600);
        busy = false;
      }, 3000);
    };
    const onKey = (e: KeyboardEvent) => {
      if (konami(e.key, e.target)) lightSide();
      if (sith(e.key, e.target)) setTerm(true);
    };
    const openTerm = () => setTerm(true);
    document.addEventListener('keydown', onKey);
    window.addEventListener('sith:open-terminal', openTerm);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('sith:open-terminal', openTerm);
    };
  }, [unlock, play]);

  return <Terminal open={term} onClose={closeTerm} />;
}
