export const aiSteps = [
  { id: 'prompt', titulo: 'Prompt', detalhe: 'Instrução versionada, com contexto e restrições.' },
  { id: 'llm', titulo: 'LLM', detalhe: 'Claude, Gemini ou OpenAI, com max_tokens ajustado.' },
  { id: 'schema', titulo: 'Structured output', detalhe: 'Resposta presa a um JSON schema.' },
  { id: 'guardrail', titulo: 'Validação', detalhe: 'Zod e guardrails determinísticos.' },
  { id: 'resposta', titulo: 'Resposta', detalhe: 'Só dado válido chega ao usuário.' },
] as const;

export const aiLearnings = [
  'Iterar o prompt com exemplos reais, não com intuição.',
  'Limitar e medir tokens: custo e latência vêm daí.',
  'Sanitizar a resposta antes de fazer parse.',
  'Pesar custo x qualidade por caso de uso, não por moda.',
  'Nunca deixar um erro se disfarçar de resultado normal na UI.',
];

// Categorias aceitas pela mini demo simulada (sem chamar API).
export const demoCategorias = ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Lazer', 'Educação', 'Assinaturas', 'Outros'] as const;
