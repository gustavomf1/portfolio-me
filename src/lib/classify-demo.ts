import { demoCategorias } from '@/data/ai-pipeline';

export type DemoCategoria = (typeof demoCategorias)[number];
export type DemoResultado = { categoria: DemoCategoria; confianca: number; requerConfirmacao: boolean };
export type DemoLinha = { texto: string; tom: 'muted' | 'normal' | 'alerta' | 'ok' };

// Simulação local (sem chamar API): palavras-chave no lugar do LLM.
const KW: Record<string, string[]> = {
  'Alimentação': ['ifood', 'mercado', 'restaurante', 'padaria', 'lanche', 'pizza', 'almoço', 'jantar', 'café'],
  'Transporte': ['uber', '99', 'gasolina', 'combustível', 'ônibus', 'estacionamento', 'pedágio', 'posto'],
  'Moradia': ['aluguel', 'condomínio', 'luz', 'energia', 'água', 'internet'],
  'Saúde': ['farmácia', 'médico', 'consulta', 'exame', 'academia', 'dentista'],
  'Lazer': ['cinema', 'show', 'bar', 'viagem', 'jogo', 'steam'],
  'Educação': ['faculdade', 'mensalidade', 'curso', 'livro', 'udemy'],
  'Assinaturas': ['netflix', 'spotify', 'prime', 'disney', 'youtube', 'assinatura', 'icloud'],
};

export function classifyDemo(descricao: string): DemoResultado {
  const low = descricao.trim().toLowerCase();
  let categoria: DemoCategoria = 'Outros';
  let hit = 0;
  if (low) {
    for (const [c, ws] of Object.entries(KW)) {
      const h = ws.filter((w) => low.includes(w)).length;
      if (h > hit) { hit = h; categoria = c as DemoCategoria; }
    }
  }
  const confianca = hit ? 0.86 + Math.min(hit, 3) * 0.04 : 0.41;
  return { categoria, confianca, requerConfirmacao: confianca < 0.6 };
}

export function buildDemoLog(r: DemoResultado): DemoLinha[] {
  const json = `{ "categoria": "${r.categoria}", "confianca": ${r.confianca.toFixed(2)}, "requer_confirmacao": ${r.requerConfirmacao} }`;
  return [
    { texto: `▸ prompt montado · template v3 + enum de ${demoCategorias.length} categorias`, tom: 'muted' },
    { texto: '▸ enviando ao modelo · max_tokens=256', tom: 'muted' },
    { texto: `▸ resposta: ${json}`, tom: 'normal' },
    { texto: r.requerConfirmacao ? '▸ validação: schema OK · confiança baixa, pedir confirmação' : '▸ validação: schema OK · categoria dentro do enum', tom: r.requerConfirmacao ? 'alerta' : 'muted' },
    { texto: '▸ exibido ao usuário', tom: 'ok' },
  ];
}
