import { asset } from '@/lib/paths';

export const profile = {
  nome: 'Gustavo Martins França',
  cargo: 'Engenheiro de Software Full Stack',
  subtitulo: 'TypeScript · Java · PostgreSQL · IA Generativa',
  frase: 'Construo sistemas que resistem à escuridão.',
  fraseFinal: 'Que a Força (e os testes) estejam com você.',
  local: 'Pirapozinho, SP · disponível para remoto e presencial',
  email: 'gustavo_mf1@hotmail.com',
  github: 'https://github.com/gustavomf1',
  linkedin: 'https://www.linkedin.com/in/gustavo-martins-fran%C3%A7a',
  whatsapp: 'https://wa.me/5518997577550',
  whatsappExibido: '(18) 99757-7550',
  curriculo: asset('/Curriculo-Gustavo-Martins-Franca.pdf'), // gerado de docs/curriculo/curriculo.html
  formspree: '', // OPCIONAL: URL do endpoint Formspree; vazio usa mailto
  sobre:
    'Desenvolvedor full stack de Pirapozinho, SP, no último ano de Sistemas de Informação (Toledo Prudente Centro Universitário, conclusão prevista em 2026). Trabalho com Java/Spring Boot, TypeScript/React/Next.js/NestJS e IA aplicada em produção. Construo SaaS de ponta a ponta e gosto de unir produto, arquitetura e IA.',
  numeros: [
    { valor: 8, sufixo: '+', decimais: 0, rotulo: 'projetos próprios' },
    { valor: 2, sufixo: '+', decimais: 0, rotulo: 'integrações com IA em produção' },
    { valor: 1.5, sufixo: '+', decimais: 1, rotulo: 'anos de experiência prática' },
    { valor: 20, sufixo: '+', decimais: 0, rotulo: 'tecnologias no dia a dia' },
  ],
} as const;
