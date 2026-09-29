export type Categoria = 'IA' | 'Backend' | 'Frontend' | 'Mobile' | 'Arquitetura';

export type Project = {
  slug: string;
  nome: string;
  categorias: Categoria[];
  destaque: boolean;
  selo?: string;
  resumo: string;
  stack: string[];
  links: { repo?: { label: string; url: string }[]; demo?: string; privado?: boolean };
  briefing: {
    contexto: string;
    desafio: string;
    construi: string[];
    decisoes: string[];
    resultado: string;
  };
  diagrama?: boolean; // mostra o diagrama animado de eventos (Kafka)
  slot?: string; // nome sugerido do print em public/assets/projects/
  imagem?: string; // SLOT DE IMAGEM: caminho do print, ex.: '/assets/projects/safecore.png'
};

export type SkillLevel = 'Dia a dia' | 'Confortável' | 'Estudando';
export type SkillGroup = { icon: string; categoria: string; itens: { nome: string; nivel: SkillLevel }[] };

export type Experience = { periodo: string; tipo: string; cargo: string; org: string; descricao: string };
