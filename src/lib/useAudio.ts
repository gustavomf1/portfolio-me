'use client';
import { useEffect, useSyncExternalStore } from 'react';
import { audio } from './audio';

export function useAudio() {
  const muted = useSyncExternalStore(audio.subscribe, audio.isMuted, () => false);
  const playing = useSyncExternalStore(audio.subscribe, audio.isPlaying, () => false);
  useEffect(() => {
    const onVis = () => (document.hidden ? audio.pauseForBackground() : audio.resumeFromBackground());
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);
  return { muted, playing, toggle: () => audio.setMuted(!audio.isMuted()), unlock: audio.unlock, play: audio.play };
}
