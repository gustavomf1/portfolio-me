import type { Categoria, Project } from '@/data/types';

export const CATEGORIAS: (Categoria | 'Todos')[] = ['Todos', 'IA', 'Backend', 'Frontend', 'Mobile', 'Arquitetura'];

export function filterProjects(list: Project[], cat: Categoria | 'Todos'): Project[] {
  return cat === 'Todos' ? list : list.filter((p) => p.categorias.includes(cat));
}
