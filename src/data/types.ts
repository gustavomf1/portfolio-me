export type Categoria = 'IA' | 'Backend' | 'Frontend' | 'Mobile' | 'Arquitetura';

export type Project = {
  slug: string;
  nome: string;
  categorias: Categoria[];
  destaque: boolean;
  selo?: string;
  resumo: string;
  stack: string[];
  links: { repo?: string[]; demo?: string; privado?: boolean };
  briefing: {
    contexto: string;
    desafio: string;
    construi: string;
    decisoes: string[];
    resultado: string;
  };
  // SLOT DE IMAGEM: caminho de um print em public/assets/projects/, ex.: '/assets/projects/safecore.png'
  imagem?: string;
};

export type SkillLevel = 'Dia a dia' | 'Confortável' | 'Estudando';
export type SkillGroup = { categoria: string; itens: { nome: string; nivel: SkillLevel }[] };

export type Experience = {
  titulo: string;
  org: string;
  periodo: string;
  local?: string;
  itens: string[];
};
