'use client';
import { useEffect, useSyncExternalStore } from 'react';
import { audio } from './audio';

export function useAudio() {
  const muted = useSyncExternalStore(audio.subscribe, audio.isMuted, () => false);
  useEffect(() => {
    const onVis = () => (document.hidden ? audio.pauseForBackground() : audio.resumeFromBackground());
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);
  return { muted, toggle: () => audio.setMuted(!audio.isMuted()), unlock: audio.unlock, play: audio.play };
}
