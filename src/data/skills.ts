import type { SkillGroup } from './types';

export const skillGroups: SkillGroup[] = [
  {
    categoria: 'IA Generativa',
    itens: [
      { nome: 'Claude API (Anthropic)', nivel: 'Dia a dia' },
      { nome: 'Gemini API', nivel: 'Dia a dia' },
      { nome: 'OpenAI API', nivel: 'Confortável' },
      { nome: 'Prompt engineering', nivel: 'Dia a dia' },
      { nome: 'Structured output (JSON schema)', nivel: 'Dia a dia' },
      { nome: 'Classificação e extração de dados', nivel: 'Dia a dia' },
      { nome: 'Guardrails de saída', nivel: 'Confortável' },
      { nome: 'Tuning de tokens e custo x qualidade', nivel: 'Confortável' },
    ],
  },
  {
    categoria: 'Linguagens',
    itens: [
      { nome: 'TypeScript', nivel: 'Dia a dia' },
      { nome: 'Java', nivel: 'Dia a dia' },
      { nome: 'JavaScript', nivel: 'Dia a dia' },
      { nome: 'SQL', nivel: 'Dia a dia' },
      { nome: 'Python', nivel: 'Confortável' },
      { nome: 'PL/SQL', nivel: 'Confortável' },
      { nome: 'Dart', nivel: 'Confortável' },
    ],
  },
  {
    categoria: 'Frontend',
    itens: [
      { nome: 'React', nivel: 'Dia a dia' },
      { nome: 'Next.js', nivel: 'Dia a dia' },
      { nome: 'Tailwind CSS', nivel: 'Dia a dia' },
      { nome: 'TanStack Query', nivel: 'Dia a dia' },
      { nome: 'Zod', nivel: 'Dia a dia' },
      { nome: 'HTML5 e CSS3', nivel: 'Dia a dia' },
      { nome: 'Angular e RxJS', nivel: 'Confortável' },
      { nome: 'Flutter (mobile)', nivel: 'Confortável' },
    ],
  },
  {
    categoria: 'Backend',
    itens: [
      { nome: 'Spring Boot', nivel: 'Dia a dia' },
      { nome: 'NestJS', nivel: 'Dia a dia' },
      { nome: 'APIs REST', nivel: 'Dia a dia' },
      { nome: 'JWT', nivel: 'Dia a dia' },
      { nome: 'Spring Security', nivel: 'Confortável' },
      { nome: 'JPA/Hibernate', nivel: 'Confortável' },
      { nome: 'Quarkus', nivel: 'Confortável' },
      { nome: 'FastAPI', nivel: 'Confortável' },
      { nome: 'OIDC/Auth0', nivel: 'Estudando' },
    ],
  },
  {
    categoria: 'Banco de dados',
    itens: [
      { nome: 'PostgreSQL', nivel: 'Dia a dia' },
      { nome: 'Modelagem relacional e migrations', nivel: 'Dia a dia' },
      { nome: 'Drizzle ORM', nivel: 'Dia a dia' },
      { nome: 'Flyway', nivel: 'Dia a dia' },
      { nome: 'Oracle', nivel: 'Confortável' },
      { nome: 'MySQL', nivel: 'Confortável' },
      { nome: 'Redis', nivel: 'Confortável' },
    ],
  },
  {
    categoria: 'Mensageria e integração',
    itens: [
      { nome: 'Apache Kafka', nivel: 'Confortável' },
      { nome: 'RabbitMQ', nivel: 'Confortável' },
      { nome: 'WebSocket/STOMP', nivel: 'Confortável' },
      { nome: 'SmallRye Reactive Messaging', nivel: 'Confortável' },
      { nome: 'OpenTelemetry', nivel: 'Estudando' },
    ],
  },
  {
    categoria: 'Testes e DevOps',
    itens: [
      { nome: 'Git', nivel: 'Dia a dia' },
      { nome: 'Docker e Docker Compose', nivel: 'Dia a dia' },
      { nome: 'Jest', nivel: 'Dia a dia' },
      { nome: 'JUnit e Mockito', nivel: 'Confortável' },
      { nome: 'TestContainers', nivel: 'Confortável' },
      { nome: 'GitHub Actions (CI/CD)', nivel: 'Confortável' },
      { nome: 'Linux', nivel: 'Confortável' },
      { nome: 'AWS S3', nivel: 'Confortável' },
    ],
  },
  {
    categoria: 'Dados',
    itens: [
      { nome: 'ETL com Pentaho', nivel: 'Confortável' },
      { nome: 'Apache Hop', nivel: 'Confortável' },
      { nome: 'Apache Airflow', nivel: 'Confortável' },
    ],
  },
  {
    categoria: 'Práticas',
    itens: [
      { nome: 'Clean Code e SOLID', nivel: 'Dia a dia' },
      { nome: 'Arquitetura multi-tenant', nivel: 'Confortável' },
      { nome: 'Microsserviços e event-driven', nivel: 'Confortável' },
      { nome: 'Metodologias ágeis', nivel: 'Confortável' },
      { nome: 'DDD leve', nivel: 'Estudando' },
    ],
  },
];
