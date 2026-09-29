import { filterProjects } from './projects';
import { projects } from '@/data/projects';

test('Todos devolve tudo', () => expect(filterProjects(projects, 'Todos')).toHaveLength(projects.length));

test('filtra por categoria', () => {
  const r = filterProjects(projects, 'Mobile');
  expect(r.length).toBeGreaterThan(0);
  expect(r.every((p) => p.categorias.includes('Mobile'))).toBe(true);
});

test('categoria sem projeto devolve lista vazia', () => {
  expect(filterProjects([], 'IA')).toEqual([]);
});
