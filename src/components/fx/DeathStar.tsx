'use client';
import dynamic from 'next/dynamic';
import { useCallback, useState, useSyncExternalStore } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { hasWebGL } from '@/lib/webgl';

const DeathStar3D = dynamic(() => import('./DeathStar3D'), { ssr: false });

const noop = () => () => {};
// 3D só com WebGL e sem reduced-motion; no servidor cai para a versão estática.
const canUse3D = () => hasWebGL();

/** Retorna `use3d` (ativa o canvas 3D) e `ready` (o 3D já desenhou; esconder a versão estática do hero). */
export function useDeathStar() {
  const reduced = useReducedMotion();
  const webgl = useSyncExternalStore(noop, canUse3D, () => false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const use3d = webgl && !reduced;
  return { use3d, ready: use3d && ready, reduced, onReady };
}

export function DeathStar3DLayer({ reduced, onReady }: { reduced: boolean; onReady: () => void }) {
  return <DeathStar3D reduced={reduced} onReady={onReady} />;
}
