export function withBase(base: string, path: string): string {
  return `${base}${path}`;
}

// Defina NEXT_PUBLIC_BASE_PATH (ex.: /meu-repo) ao publicar em subcaminho, como no GitHub Pages.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const asset = (path: string) => withBase(BASE_PATH, path);
