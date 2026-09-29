let cached: boolean | null = null;

// Resultado em cache: cada teste cria um contexto WebGL, e o navegador limita quantos podem existir.
export function hasWebGL(): boolean {
  if (cached !== null) return cached;
  try {
    const c = document.createElement('canvas');
    cached = !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    cached = false;
  }
  return cached;
}
