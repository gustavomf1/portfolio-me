# Portfolio Sith Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o portfólio Sith de Gustavo Martins França como site estático Next.js, com todo o conteúdo e efeitos do protótipo e da spec.

**Architecture:** Next.js App Router com `output: 'export'`. Conteúdo tipado em `src/data/*.ts`; lógica pura (filtro, comandos do terminal, storage seguro) em `src/lib` com testes Vitest; efeitos visuais e áudio em client components isolados em `components/fx` e `components/ui`. Áudio sintetizado via Web Audio, mais uma trilha ambiente em MP3.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind (v4, tokens em `@theme`), Vitest, Three.js (só Estrela da Morte 3D, lazy).

**Spec:** `docs/superpowers/specs/2026-09-29-portfolio-sith-design.md`. Fontes de referência: `~/Downloads/Portfolio Sith Design/uploads/prompt-portfolio-claude-design.md` (conteúdo) e `~/Downloads/Portfolio Sith Design/Portfolio.dc.html` (visual; Estrela da Morte 3D a partir da linha ~433).

## Global Constraints

- Idioma: português do Brasil. Em textos de chat e comentários, usar vírgulas, não travessão.
- Paleta exata: `#050505`, `#0a0a0a` (base), `#e10600` (brilho), `#8b0000` (sombras/bordas), `#ff2a1f` (glow hover), `#1a1a1a` (cards), `#9a9a9a` (texto secundário), `#f2ede8` (texto principal). Nada de azul, verde ou roxo (exceção única: o lado luz do Konami por 3 s).
- Fontes: Orbitron (títulos, caixa alta, letter-spacing largo), Manrope (corpo), JetBrains Mono (labels/código), via `next/font/google`.
- `next.config`: `output: 'export'`, `images: { unoptimized: true }`.
- Áudio nunca toca sozinho; só após gesto do usuário. `MUSIC_VOLUME = 0.08`, fade-in 3 s. Preferência de mute em localStorage.
- Todo acesso a `localStorage`/`sessionStorage` passa por `src/lib/storage.ts` (try/catch).
- Todas as animações respeitam `prefers-reduced-motion`.
- Sem assets, logos ou marcas da Lucasfilm. SafeCore não cita o nome do cliente.
- Footer com aviso: projeto de fã, sem afiliação com Lucasfilm/Disney.
- Comentários curtos no código apenas onde o usuário precisa trocar algo (imagens, sons, WhatsApp, PDF, Formspree).
- Commits em português ou inglês curtos, terminando com `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

- `localStorage` indisponível (janela privada, bloqueado): site renderiza e funciona sem persistência. Testado em `storage.test.ts`.
- Filtro de projetos sem resultado (categoria sem projeto): retorna lista vazia e a UI mostra mensagem. Testado em `projects.test.ts`.
- Comando de terminal vazio, com espaços ou desconhecido: nunca lança erro, responde com dica. Testado em `terminal.test.ts`.
- Digitar "sith" ou Konami dentro de `input`/`textarea` (formulário de contato) não deve disparar easter egg. Testado em `easter-eggs.test.ts`.
- `mailto:` com acentos, `&` e quebras de linha na mensagem: precisa ser codificado. Testado em `contact.test.ts`.
- MP3 ausente ou bloqueado por autoplay: `play()` rejeitada não pode gerar erro não tratado nem quebrar os efeitos sintetizados. Verificado na Task 4 (teste com `audio` falso).
- WebGL indisponível ou `prefers-reduced-motion`: Estrela da Morte cai para a versão estática. Verificado manualmente na Task 6.

---

### Task 1: Scaffold, config e ferramentas

**Files:**
- Create: `package.json` (via create-next-app), `next.config.ts`, `vitest.config.ts`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, `public/assets/sounds/emperor-theme.mp3`, `public/assets/sounds/README.md`, `public/curriculo.pdf`, `README.md`, `.gitignore`

**Interfaces:**
- Produces: script `npm test` (Vitest), `npm run build` (gera `out/`), tokens Tailwind `--color-void`, `--color-sith`, `--color-ember`, `--color-blood`, `--color-coal`, `--color-ash`, `--color-bone` e fontes `--font-display`, `--font-body`, `--font-mono`.

- [ ] **Step 1: Criar o app Next no diretório existente**

```bash
cd ~/Documents/portfolio-sith
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack --yes
npm i three
npm i -D vitest @types/three jsdom @vitejs/plugin-react
```
Se o create-next-app recusar por causa de `docs/`, rode em `../portfolio-tmp` e mova os arquivos para cá (exceto `.git`).

- [ ] **Step 2: `next.config.ts`**

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
```

- [ ] **Step 3: `vitest.config.ts` e scripts**

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: { environment: 'jsdom', globals: true },
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
});
```
Em `package.json` adicionar `"test": "vitest run"`, `"typecheck": "tsc --noEmit"`.

- [ ] **Step 4: Tokens e base em `src/app/globals.css`**

```css
@import 'tailwindcss';

@theme {
  --color-void: #050505;
  --color-abyss: #0a0a0a;
  --color-coal: #1a1a1a;
  --color-sith: #e10600;
  --color-blood: #8b0000;
  --color-ember: #ff2a1f;
  --color-ash: #9a9a9a;
  --color-bone: #f2ede8;
  --font-display: var(--font-orbitron), sans-serif;
  --font-body: var(--font-manrope), sans-serif;
  --font-mono: var(--font-jetbrains), monospace;
}

html { scroll-behavior: smooth; background: var(--color-void); }
body { margin: 0; background: var(--color-void); color: var(--color-bone); font-family: var(--font-body); }
::selection { background: var(--color-sith); color: var(--color-bone); }
:focus-visible { outline: 2px solid var(--color-ember); outline-offset: 3px; }
a { color: var(--color-ember); text-decoration: none; }
a:hover { color: var(--color-bone); }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
}
```

- [ ] **Step 5: `src/app/layout.tsx` com fontes e metadata**

```tsx
import type { Metadata } from 'next';
import { Orbitron, Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['500', '700', '800', '900'], variable: '--font-orbitron' });
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-manrope' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-jetbrains' });

export const metadata: Metadata = {
  title: 'Gustavo Martins França · Engenheiro de Software Full Stack',
  description: 'Portfolio de Gustavo Martins França, engenheiro de software full stack: TypeScript, Java, PostgreSQL e IA generativa em produção.',
  openGraph: {
    title: 'Gustavo Martins França · Engenheiro de Software Full Stack',
    description: 'Construo sistemas que resistem à escuridão.',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${orbitron.variable} ${manrope.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```
`src/app/page.tsx`: `export default function Home() { return <main id="conteudo">Em construção</main>; }`

- [ ] **Step 6: Assets e README**

```bash
mkdir -p public/assets/sounds public/assets/projects
cp "/home/mag/Downloads/The Emperor's Theme Compilation - TheDarkPrince926.mp3" public/assets/sounds/emperor-theme.mp3
printf '%%PDF-1.1\n%% placeholder, substitua por seu currículo\n' > public/curriculo.pdf
```
`public/assets/sounds/README.md` explica: `emperor-theme.mp3` é a trilha ambiente (tema do Imperador, John Williams, Lucasfilm/Disney, compilação de fã; troque por faixa livre de direitos se for publicar comercialmente); `saber-on.mp3`, `saber-hum.mp3`, `saber-swing.mp3`, `blip.mp3` são opcionais, e se ausentes o site sintetiza os sons. Sugerir freesound.org (CC0). `README.md` raiz: como rodar (`npm run dev`), editar `src/data/*`, trocar placeholders (WhatsApp em `profile.ts`, PDF em `public/curriculo.pdf`, Formspree em `profile.ts`), prints em `public/assets/projects/` + campo `imagem`, build e deploy.

- [ ] **Step 7: Verificar**

Run: `npm run build && npm test -- --passWithNoTests`
Expected: build gera `out/index.html`; Vitest sai com 0.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "chore: scaffold Next.js, tokens, fonts, assets

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Camada de dados tipada

**Files:**
- Create: `src/data/types.ts`, `src/data/profile.ts`, `src/data/projects.ts`, `src/data/skills.ts`, `src/data/experience.ts`, `src/data/ai-pipeline.ts`

**Interfaces:**
- Produces:
  - `type Categoria = 'IA' | 'Backend' | 'Frontend' | 'Mobile' | 'Arquitetura'`
  - `type Project = { slug: string; nome: string; categorias: Categoria[]; destaque: boolean; selo?: string; resumo: string; stack: string[]; links: { repo?: string[]; demo?: string; privado?: boolean }; briefing: { contexto: string; desafio: string; construi: string; decisoes: string[]; resultado: string }; imagem?: string }`
  - `type SkillLevel = 'Dia a dia' | 'Confortável' | 'Estudando'`; `type SkillGroup = { categoria: string; itens: { nome: string; nivel: SkillLevel }[] }`
  - `type Experience = { titulo: string; org: string; periodo: string; local?: string; itens: string[] }`
  - `export const profile`, `projects: Project[]`, `skillGroups: SkillGroup[]`, `experiences: Experience[]`, `aiSteps`, `aiLearnings`.

- [ ] **Step 1: `src/data/types.ts`** com os tipos acima exportados.

- [ ] **Step 2: `src/data/profile.ts`**

```ts
export const profile = {
  nome: 'Gustavo Martins França',
  cargo: 'Engenheiro de Software Full Stack',
  subtitulo: 'TypeScript · Java · PostgreSQL · IA Generativa',
  frase: 'Construo sistemas que resistem à escuridão.',
  fraseFinal: 'Que a Força (e os testes) estejam com você.',
  local: 'Pirapozinho, SP · disponível para remoto',
  email: 'gustavo_mf1@hotmail.com',
  github: 'https://github.com/gustavomf1',
  linkedin: 'https://www.linkedin.com/in/gustavo-martins-fran%C3%A7a',
  whatsapp: 'https://wa.me/55XXXXXXXXXXX', // TROCAR: coloque seu número (DDI+DDD+número)
  curriculo: '/curriculo.pdf', // TROCAR: substitua public/curriculo.pdf
  formspree: '', // OPCIONAL: URL do endpoint Formspree; vazio usa mailto
  sobre:
    'Desenvolvedor full stack de Pirapozinho, SP, no último ano de Sistemas de Informação (Toledo Prudente Centro Universitário, conclusão prevista em 2026). Trabalho com Java/Spring Boot, TypeScript/React/Next.js/NestJS e IA aplicada em produção. Construo SaaS de ponta a ponta e gosto de unir produto, arquitetura e IA.',
  numeros: [
    { valor: 8, sufixo: '+', rotulo: 'projetos próprios' },
    { valor: 2, sufixo: '+', rotulo: 'integrações com IA em produção' },
    { valor: 1.5, sufixo: '+', rotulo: 'anos de experiência prática' },
    { valor: 20, sufixo: '+', rotulo: 'tecnologias no dia a dia' },
  ],
} as const;
```

- [ ] **Step 3: `src/data/projects.ts`** com os 8 projetos, nesta ordem: `safecore`, `fintrack-ai`, `insight-flow`, `leilao-erp`, `quarkus-kafka`, `logtrack`, `magnossao`, `holonet-planets`. Os três primeiros com `destaque: true`. Conteúdo tirado da seção "03 Missões" da spec de conteúdo. Exemplo completo do primeiro (os demais seguem o mesmo formato, com `briefing` em 1 a 3 frases por campo, sempre factual):

```ts
import type { Project } from './types';

export const projects: Project[] = [
  {
    slug: 'safecore',
    nome: 'SafeCore',
    categorias: ['IA', 'Backend', 'Frontend', 'Mobile', 'Arquitetura'],
    destaque: true,
    selo: 'Em produção · proposta enterprise',
    resumo: 'SaaS B2B de gestão de segurança em engenharia (NR-01, ISO 45001) com IA generativa para normas regulatórias e app mobile de evidências.',
    stack: ['Spring Boot', 'JPA/Hibernate', 'PostgreSQL', 'Flyway', 'React', 'TypeScript', 'TanStack Query', 'Zod', 'Tailwind', 'Flutter', 'AWS S3', 'Claude API'],
    links: { repo: ['https://github.com/gustavomf1/safecore-mobile'], privado: true },
    briefing: {
      contexto: 'Plataforma SaaS de segurança em engenharia, com proposta comercial enterprise em andamento com uma operadora aeroportuária (licenciamento SaaS mais serviço de responsabilidade técnica).',
      desafio: 'Controlar não conformidades com rastreabilidade total, isolar clientes (multi-tenant) e extrair trechos relevantes de normas extensas com IA sem perder cobertura.',
      construi: 'Fluxo de Não Conformidade com state machine de 6 estados, auditoria imutável com snapshots point-in-time, RBAC multi-tenant, notificações assíncronas, busca e extração em normas e resumos de PDF com Claude Haiku 4.5, e app Flutter com câmera e geolocalização enviando evidências ao S3.',
      decisoes: [
        'Notificações com @Async + @TransactionalEventListener para não bloquear a transação.',
        'Prompt iterado para retornar todos os trechos pertinentes; max_tokens de 1024 para 4096.',
        'Sanitização da resposta para JSON válido e timeouts alinhados entre nginx e axios (respostas de 30 a 40 s).',
      ],
      resultado: 'Proposta enterprise em negociação com cliente real; código de backend e web privado por acordo comercial.',
    },
  },
  // fintrack-ai, insight-flow, leilao-erp, quarkus-kafka, logtrack, magnossao, holonet-planets:
  // mesmo formato, dados da spec. Categorias: fintrack-ai [IA, Backend, Frontend]; insight-flow [IA, Backend, Arquitetura];
  // leilao-erp [Backend, Frontend, Arquitetura]; quarkus-kafka [Backend, Arquitetura]; logtrack [Backend, Frontend, Arquitetura];
  // magnossao [Backend, Frontend]; holonet-planets [Backend, Frontend].
  // Repos: ver spec (leilao: leilao-backend/leilao-frontend; kafka: quotation, proposal, report, gateway-bff *-quarkus-kafka;
  // magnossao: magnusson-back/magnusson-front; holonet: project-starwars; logtrack: logtrack; fintrack: fintrack-ai;
  // insight-flow: github.com/InsightF-AI/Insight-flow-backend).
];
```
Os sete projetos restantes DEVEM ser escritos por extenso no arquivo (sem comentário no lugar), com todos os campos preenchidos a partir da spec.

- [ ] **Step 4: `src/data/skills.ts`** com `skillGroups` cobrindo as 9 categorias da spec (IA Generativa, Linguagens, Frontend, Backend, Banco de dados, Mensageria e integração, Testes e DevOps, Dados, Práticas), cada item com `nivel`. Regra: itens de uso real diário (TypeScript, Java, Spring Boot, React, Next.js, NestJS, PostgreSQL, Git, Docker) = `Dia a dia`; Kafka, RabbitMQ, Redis, Quarkus, Angular, Flutter, FastAPI, Airflow = `Confortável`; Pentaho/Apache Hop, OpenTelemetry, DDD leve = `Estudando` ou `Confortável` conforme a spec; sem porcentagens.

- [ ] **Step 5: `src/data/experience.ts`** com as 5 entradas da spec (Unimed Presidente Prudente out 2025 a jan 2026; Liax Tech Dev Back End mar a jun 2025; Liax Tech estágio out 2024 a mar 2025; SafeCore 2025 a 2026; Sistemas de Informação, 4º ano, 2026). Ordem cronológica decrescente.

- [ ] **Step 6: `src/data/ai-pipeline.ts`**

```ts
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
export const demoCategorias = ['Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Saúde', 'Outros'] as const;
```

- [ ] **Step 7: Verificar tipos**

Run: `npm run typecheck`
Expected: sem erros.

- [ ] **Step 8: Commit** `feat: add typed content data`

---

### Task 3: Lógica pura com testes (storage, filtro, terminal, contato, easter eggs)

**Files:**
- Create: `src/lib/storage.ts`, `src/lib/projects.ts`, `src/lib/terminal.ts`, `src/lib/contact.ts`, `src/lib/easter-eggs.ts`
- Test: `src/lib/storage.test.ts`, `src/lib/projects.test.ts`, `src/lib/terminal.test.ts`, `src/lib/contact.test.ts`, `src/lib/easter-eggs.test.ts`

**Interfaces:**
- Produces:
  - `safeGet(key: string): string | null`, `safeSet(key: string, value: string): void`
  - `filterProjects(list: Project[], cat: Categoria | 'Todos'): Project[]`
  - `runCommand(input: string): { lines: string[]; action?: 'clear' | 'close' | 'open-contact' }`
  - `buildMailto(to: string, nome: string, email: string, mensagem: string): string`
  - `createSequenceMatcher(target: string[]): (key: string, target?: EventTarget | null) => boolean` (retorna `true` quando a sequência completa acabou de ser digitada; ignora eventos cujo alvo é `input`, `textarea` ou `contenteditable`). Constantes `KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']` e `SITH = ['s','i','t','h']`.

- [ ] **Step 1: Testes que falham**

`storage.test.ts`:
```ts
import { safeGet, safeSet } from './storage';

test('funciona com localStorage', () => {
  safeSet('k', 'v');
  expect(safeGet('k')).toBe('v');
});

test('não lança quando localStorage lança', () => {
  const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
  const spy2 = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
  expect(safeGet('k')).toBeNull();
  expect(() => safeSet('k', 'v')).not.toThrow();
  spy.mockRestore(); spy2.mockRestore();
});
```
`projects.test.ts`:
```ts
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
```
`terminal.test.ts`:
```ts
import { runCommand } from './terminal';

test('help lista comandos', () => {
  const r = runCommand('help');
  expect(r.lines.join('\n')).toMatch(/skills/);
  expect(r.lines.join('\n')).toMatch(/sudo hire gustavo/);
});
test('vazio e espaços não quebram', () => {
  expect(runCommand('').lines).toEqual([]);
  expect(runCommand('   ').lines).toEqual([]);
});
test('comando desconhecido sugere help', () => {
  expect(runCommand('xyz').lines.join(' ')).toMatch(/help/);
});
test('sudo hire gustavo abre contato', () => {
  expect(runCommand('sudo hire gustavo').action).toBe('open-contact');
});
test('case e espaços extras são tolerados', () => {
  expect(runCommand('  ABOUT ').lines.length).toBeGreaterThan(0);
});
test('clear e exit', () => {
  expect(runCommand('clear').action).toBe('clear');
  expect(runCommand('exit').action).toBe('close');
});
```
`contact.test.ts`:
```ts
import { buildMailto } from './contact';

test('codifica acentos, & e quebras de linha', () => {
  const url = buildMailto('a@b.com', 'João & Cia', 'j@x.com', 'Olá!\nTudo bem? 100% & mais');
  expect(url.startsWith('mailto:a@b.com?')).toBe(true);
  expect(url).not.toMatch(/\n/);
  expect(url).toContain('%0A');
  expect(url).toContain('%26');
  expect(decodeURIComponent(url.split('body=')[1])).toContain('Olá!\nTudo bem?');
});
```
`easter-eggs.test.ts`:
```ts
import { createSequenceMatcher, SITH, KONAMI } from './easter-eggs';

test('detecta sith', () => {
  const m = createSequenceMatcher(SITH);
  expect(['s', 'i', 't'].map((k) => m(k, document.body)).some(Boolean)).toBe(false);
  expect(m('h', document.body)).toBe(true);
});
test('ignora digitação em input e textarea', () => {
  const m = createSequenceMatcher(SITH);
  const input = document.createElement('input');
  const ta = document.createElement('textarea');
  ['s', 'i', 't'].forEach((k) => m(k, input));
  expect(m('h', ta)).toBe(false);
});
test('erro no meio reinicia a sequência', () => {
  const m = createSequenceMatcher(SITH);
  ['s', 'i', 'x'].forEach((k) => m(k, document.body));
  expect(m('h', document.body)).toBe(false);
});
test('konami', () => {
  const m = createSequenceMatcher(KONAMI);
  const results = KONAMI.map((k) => m(k, document.body));
  expect(results[results.length - 1]).toBe(true);
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test`
Expected: FAIL (módulos não existem).

- [ ] **Step 3: Implementar**

`storage.ts`:
```ts
export function safeGet(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
export function safeSet(key: string, value: string): void {
  try { window.localStorage.setItem(key, value); } catch { /* sem persistência */ }
}
```
`projects.ts`:
```ts
import type { Categoria, Project } from '@/data/types';

export const CATEGORIAS: (Categoria | 'Todos')[] = ['Todos', 'IA', 'Backend', 'Frontend', 'Mobile', 'Arquitetura'];

export function filterProjects(list: Project[], cat: Categoria | 'Todos'): Project[] {
  return cat === 'Todos' ? list : list.filter((p) => p.categorias.includes(cat));
}
```
`contact.ts`:
```ts
export function buildMailto(to: string, nome: string, email: string, mensagem: string): string {
  const subject = encodeURIComponent(`Contato pelo portfólio: ${nome}`);
  const body = encodeURIComponent(`${mensagem}\n\n${nome} <${email}>`);
  return `mailto:${to}?subject=${subject}&body=${body}`;
}
```
`easter-eggs.ts`:
```ts
export const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
export const SITH = ['s', 'i', 't', 'h'];

function isEditable(t?: EventTarget | null): boolean {
  const el = t as HTMLElement | null;
  if (!el || !el.tagName) return false;
  return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable === true;
}

export function createSequenceMatcher(target: string[]) {
  let i = 0;
  return (key: string, el?: EventTarget | null): boolean => {
    if (isEditable(el)) { i = 0; return false; }
    const k = key.length === 1 ? key.toLowerCase() : key;
    if (k === target[i]) {
      i += 1;
      if (i === target.length) { i = 0; return true; }
    } else {
      i = k === target[0] ? 1 : 0;
    }
    return false;
  };
}
```
`terminal.ts` (lê de `data/*`):
```ts
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
import { skillGroups } from '@/data/skills';

export type TerminalResult = { lines: string[]; action?: 'clear' | 'close' | 'open-contact' };

const HELP = [
  'Comandos disponíveis:',
  '  help               lista comandos',
  '  about              quem sou',
  '  skills             arsenal por categoria',
  '  projects           missões',
  '  contact            canais de comunicação',
  '  sudo hire gustavo  tente a sorte',
  '  clear | exit',
];

export function runCommand(input: string): TerminalResult {
  const cmd = input.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!cmd) return { lines: [] };
  switch (cmd) {
    case 'help': return { lines: HELP };
    case 'about': return { lines: [`${profile.nome}, ${profile.cargo}.`, profile.local, profile.sobre] };
    case 'skills': return { lines: skillGroups.map((g) => `${g.categoria}: ${g.itens.map((i) => i.nome).join(', ')}`) };
    case 'projects': return { lines: projects.map((p) => `- ${p.nome}: ${p.resumo}`) };
    case 'contact': return { lines: [`E-mail: ${profile.email}`, `GitHub: ${profile.github}`, `LinkedIn: ${profile.linkedin}`] };
    case 'sudo hire gustavo':
      return { lines: ['Acesso concedido. O Império aprova esta contratação.', 'Abrindo canal de comunicação...'], action: 'open-contact' };
    case 'clear': return { lines: [], action: 'clear' };
    case 'exit': return { lines: ['Transmissão encerrada.'], action: 'close' };
    default: return { lines: [`Comando não reconhecido: "${cmd}". Digite help.`] };
  }
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test`
Expected: todos PASS.

- [ ] **Step 5: Commit** `feat: add pure logic modules with tests`

---

### Task 4: Motor de áudio (efeitos sintetizados + trilha ambiente)

**Files:**
- Create: `src/lib/audio.ts`, `src/lib/useAudio.ts`
- Test: `src/lib/audio.test.ts`

**Interfaces:**
- Consumes: `safeGet`, `safeSet` (Task 3).
- Produces:
  - `MUSIC_VOLUME = 0.08`, `MUSIC_SRC = '/assets/sounds/emperor-theme.mp3'`
  - `audio.unlock(): void` (cria o AudioContext e inicia a música se não estiver mudo; chamar num handler de clique)
  - `audio.play(name: 'ignition' | 'hum' | 'swing' | 'blip' | 'door' | 'march'): void`
  - `audio.setMuted(m: boolean): void`, `audio.isMuted(): boolean`, `audio.subscribe(fn: () => void): () => void`
  - Hook `useAudio(): { muted: boolean; toggle(): void; unlock(): void; play: typeof audio.play }`

- [ ] **Step 1: Teste que falha** (`audio.test.ts`, com `Audio` falso cuja `play()` rejeita)

```ts
import { createAudioEngine } from './audio';

function fakeMedia(rejects: boolean) {
  const el: any = { volume: 0, loop: false, preload: '', paused: true, src: '',
    play: vi.fn(() => (rejects ? Promise.reject(new Error('NotAllowedError')) : Promise.resolve())),
    pause: vi.fn() };
  return el;
}

test('começa mudo se preferência salva for mudo, e não toca música', () => {
  localStorage.setItem('sith:muted', '1');
  const el = fakeMedia(false);
  const eng = createAudioEngine({ createMedia: () => el, createContext: () => null });
  eng.unlock();
  expect(eng.isMuted()).toBe(true);
  expect(el.play).not.toHaveBeenCalled();
});

test('play() rejeitada pelo navegador não gera erro não tratado', async () => {
  localStorage.removeItem('sith:muted');
  const el = fakeMedia(true);
  const eng = createAudioEngine({ createMedia: () => el, createContext: () => null });
  expect(() => eng.unlock()).not.toThrow();
  await Promise.resolve();
});

test('setMuted pausa e persiste', () => {
  localStorage.removeItem('sith:muted');
  const el = fakeMedia(false);
  const eng = createAudioEngine({ createMedia: () => el, createContext: () => null });
  eng.unlock();
  eng.setMuted(true);
  expect(el.pause).toHaveBeenCalled();
  expect(localStorage.getItem('sith:muted')).toBe('1');
});

test('efeito sem AudioContext (indisponível) é no-op', () => {
  const eng = createAudioEngine({ createMedia: () => fakeMedia(false), createContext: () => null });
  expect(() => eng.play('swing')).not.toThrow();
});
```
Run: `npm test -- audio` → FAIL.

- [ ] **Step 2: Implementar `src/lib/audio.ts`**

```ts
import { safeGet, safeSet } from './storage';

export const MUSIC_VOLUME = 0.08; // volume de fundo, ajuste aqui
export const MUSIC_SRC = '/assets/sounds/emperor-theme.mp3'; // TROCAR aqui pela faixa desejada
const FADE_MS = 3000;
const MUTE_KEY = 'sith:muted';

export type SoundName = 'ignition' | 'hum' | 'swing' | 'blip' | 'door' | 'march';

type Deps = { createMedia: () => HTMLAudioElement | null; createContext: () => AudioContext | null };

export function createAudioEngine(deps: Deps) {
  let media: HTMLAudioElement | null = null;
  let ctx: AudioContext | null = null;
  let unlocked = false;
  let muted = safeGet(MUTE_KEY) === '1';
  let fade: ReturnType<typeof setInterval> | null = null;
  let humNode: { stop: () => void } | null = null;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((f) => f());

  function fadeMusicIn() {
    if (!media) return;
    media.volume = 0;
    media.loop = true;
    media.play()?.catch(() => { /* autoplay bloqueado ou arquivo ausente: segue sem trilha */ });
    const steps = 30;
    let n = 0;
    if (fade) clearInterval(fade);
    fade = setInterval(() => {
      n += 1;
      if (media) media.volume = Math.min(MUSIC_VOLUME, (MUSIC_VOLUME * n) / steps);
      if (n >= steps && fade) { clearInterval(fade); fade = null; }
    }, FADE_MS / steps);
  }

  function tone(freq: number, dur: number, type: OscillatorType, gain: number, when = 0, slideTo?: number) {
    if (!ctx || muted) return;
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    f.type = 'lowpass';
    f.frequency.value = 2400;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(f).connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  function play(name: SoundName) {
    if (!ctx || muted) return;
    // Para usar arquivos reais, toque aqui um <audio src="/assets/sounds/<nome>.mp3"> antes do fallback.
    switch (name) {
      case 'ignition': tone(90, 0.9, 'sawtooth', 0.18, 0, 420); tone(180, 0.9, 'square', 0.06, 0, 840); break;
      case 'swing': tone(520, 0.22, 'sawtooth', 0.1, 0, 140); break;
      case 'blip': tone(880, 0.06, 'square', 0.04); break;
      case 'door': tone(140, 0.5, 'triangle', 0.12, 0, 60); tone(700, 0.3, 'sine', 0.05, 0.1, 300); break;
      case 'hum': {
        if (humNode) return;
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'sawtooth'; o.frequency.value = 62; g.gain.value = 0.015;
        o.connect(g).connect(ctx.destination); o.start();
        humNode = { stop: () => { o.stop(); humNode = null; } };
        break;
      }
      case 'march': {
        // Primeiras notas da Marcha Imperial (G G G Eb Bb G Eb Bb G), sintetizadas.
        const seq: [number, number, number][] = [
          [392, 0.45, 0], [392, 0.45, 0.5], [392, 0.45, 1.0], [311, 0.35, 1.5], [466, 0.15, 1.9],
          [392, 0.45, 2.1], [311, 0.35, 2.6], [466, 0.15, 3.0], [392, 0.8, 3.2],
        ];
        seq.forEach(([f, d, w]) => tone(f, d, 'sawtooth', 0.1, w));
        break;
      }
    }
  }

  return {
    unlock() {
      if (!unlocked) {
        unlocked = true;
        ctx = deps.createContext();
        media = deps.createMedia();
        if (media) { media.preload = 'none'; media.src = MUSIC_SRC; }
      }
      if (ctx && ctx.state === 'suspended') void ctx.resume();
      if (!muted && media && media.paused) fadeMusicIn();
    },
    play,
    setMuted(m: boolean) {
      muted = m;
      safeSet(MUTE_KEY, m ? '1' : '0');
      if (m) { media?.pause(); humNode?.stop(); }
      else if (unlocked && media) fadeMusicIn();
      emit();
    },
    isMuted: () => muted,
    subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; },
    pauseForBackground() { media?.pause(); },
    resumeFromBackground() { if (!muted && unlocked && media && media.paused) media.play()?.catch(() => {}); },
  };
}

export const audio = createAudioEngine({
  createMedia: () => (typeof Audio === 'undefined' ? null : new Audio()),
  createContext: () => {
    if (typeof window === 'undefined') return null;
    const AC = window.AudioContext ?? (window as any).webkitAudioContext;
    return AC ? new AC() : null;
  },
});
```
Ajuste: os testes esperam `paused: true` inicial no fake; `unlock` já cobre. Se o teste "começa mudo" falhar por `localStorage` de outros testes, limpe `localStorage` no início de cada teste.

- [ ] **Step 3: `useAudio.ts`**

```ts
'use client';
import { useEffect, useSyncExternalStore } from 'react';
import { audio } from './audio';

export function useAudio() {
  const muted = useSyncExternalStore(audio.subscribe, audio.isMuted, () => true);
  useEffect(() => {
    const onVis = () => (document.hidden ? audio.pauseForBackground() : audio.resumeFromBackground());
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);
  return { muted, toggle: () => audio.setMuted(!audio.isMuted()), unlock: audio.unlock, play: audio.play };
}
```
(Regra de reduced-motion para música: em `Hero`/`Crawl`, só chamar `unlock()` num clique, nunca automaticamente; como sempre exige clique, a regra está satisfeita.) Criar também `src/lib/useReducedMotion.ts`:

```ts
'use client';
import { useSyncExternalStore } from 'react';

const q = '(prefers-reduced-motion: reduce)';
const subscribe = (cb: () => void) => {
  const m = window.matchMedia(q);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(q).matches, () => false);
}
```

- [ ] **Step 4: Rodar testes**

Run: `npm test && npm run typecheck`
Expected: PASS.

- [ ] **Step 5: Commit** `feat: add audio engine with ambient track`

---

### Task 5: Shell: vinheta, grão, MuteButton, Nav com sabre, reveal

**Files:**
- Create: `src/components/fx/Vignette.tsx`, `src/components/ui/MuteButton.tsx`, `src/components/ui/Nav.tsx`, `src/components/ui/SectionTitle.tsx`, `src/components/ui/GlitchTitle.tsx`, `src/components/ui/Counter.tsx`, `src/lib/useReveal.ts`
- Modify: `src/app/page.tsx`, `src/app/globals.css`

**Interfaces:**
- Consumes: `useAudio` (Task 4), `profile` (Task 2).
- Produces:
  - `<SectionTitle label="// 01 IDENTIFICAÇÃO" title="Quem sou" />`
  - `<GlitchTitle as="h2">texto</GlitchTitle>` (glitch ao entrar na tela)
  - `<Counter valor={8} sufixo="+" decimais={0} />` (anima ao entrar na tela; com reduced-motion mostra o valor final)
  - `useReveal<T extends HTMLElement>(): { ref: RefObject<T>; visible: boolean }` (IntersectionObserver, `visible` fica `true` para sempre após a primeira interseção; com reduced-motion começa `true`)
  - `SECTIONS = [{id:'inicio',label:'Início'},{id:'identificacao',label:'Identificação'},{id:'arsenal',label:'Arsenal'},{id:'missoes',label:'Missões'},{id:'campanhas',label:'Campanhas'},{id:'ia',label:'IA'},{id:'comunicacao',label:'Comunicação'}]` exportado de `Nav.tsx`.

- [ ] **Step 1: CSS de efeitos em `globals.css`** (classes `.grain`, `.scanlines`, `.glow-text`, `.reveal`, `.glitch`)

```css
.glow-text { text-shadow: 0 0 12px rgba(225,6,0,.6), 0 0 32px rgba(225,6,0,.3); }
.reveal { opacity: 0; transform: translateY(24px); transition: opacity .8s ease, transform .8s ease; }
.reveal.is-visible { opacity: 1; transform: none; }
@keyframes glitch {
  0%,100% { clip-path: inset(0); transform: none; }
  20% { clip-path: inset(10% 0 60% 0); transform: translate(-3px, 0); }
  40% { clip-path: inset(50% 0 20% 0); transform: translate(3px, 0); }
  60% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 0); }
}
.glitch.is-visible::before, .glitch.is-visible::after {
  content: attr(data-text); position: absolute; inset: 0; color: var(--color-ember);
  animation: glitch .6s steps(1) 1;
}
.glitch { position: relative; }
.grain::after { content:''; position:fixed; inset:0; pointer-events:none; z-index:300; opacity:.05;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
.scanlines::before { content:''; position:fixed; inset:0; pointer-events:none; z-index:299; opacity:.06;
  background: repeating-linear-gradient(to bottom, transparent 0 2px, #000 2px 3px); }
```

- [ ] **Step 2: `useReveal.ts`, `Counter.tsx`, `GlitchTitle.tsx`, `SectionTitle.tsx`.** `useReveal` usa `IntersectionObserver` com `threshold: 0.2` e desconecta após revelar. `Counter` anima de 0 ao valor em 1400 ms com `requestAnimationFrame` easeOutCubic, formatando com `toLocaleString('pt-BR', { minimumFractionDigits: decimais })`. `GlitchTitle` renderiza o tag pedido com `className="glitch font-display uppercase tracking-[.14em] glow-text"`, `data-text` igual ao texto e `is-visible` via `useReveal`. `SectionTitle` mostra o label em `font-mono text-ember` e o título via `GlitchTitle`.

- [ ] **Step 3: `Vignette.tsx`** (div fixa `pointer-events-none z-[298]` com `radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.75))`) e aplicar as classes `grain scanlines` no `<body>` via `layout.tsx`.

- [ ] **Step 4: `MuteButton.tsx`.** Botão fixo `bottom-4 left-4 z-[250]`, `aria-label` "Ativar som"/"Desativar som", `aria-pressed={!muted}`, ícone SVG de alto-falante (com risco quando mudo). No clique chama `unlock()` e depois `toggle()`. Na primeira interação o estado exibido reflete a preferência salva.

- [ ] **Step 5: `Nav.tsx`.** `<nav aria-label="Principal">` fixo, 68 px, fundo `rgba(5,5,5,.74)` com `backdrop-blur`, borda inferior `rgba(139,0,0,.32)`. Links de `SECTIONS`. Lâmina: `<span>` absoluto na base, `height:3px`, `background:linear-gradient(90deg,#8b0000,#ff2a1f)`, `box-shadow:0 0 12px #e10600`; posição/largura vêm de `getBoundingClientRect` do item ativo (`left`/`width` com `transition: all .35s`). Seção ativa por `IntersectionObserver` (`rootMargin: '-45% 0px -50% 0px'`). Clique num item: `play('swing')` e scroll suave. `onMouseEnter` nos itens: `play('blip')`. Mobile (< 768 px): botão hambúrguer com três barras que viram lâmina; menu vertical em tela cheia com os mesmos itens; `aria-expanded`.

- [ ] **Step 6: Montar em `page.tsx`** `<Vignette /> <Nav /> <MuteButton /> <main id="conteudo">…</main>` e um link "Pular para o conteúdo" visível no foco.

- [ ] **Step 7: Verificar**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: sem erros. Depois `npm run dev` e conferir no navegador: nav fixa, lâmina desliza (ainda sem seções, itens levam a âncoras vazias), mute alterna.

- [ ] **Step 8: Commit** `feat: add shell, nav with saber, mute, reveal primitives`

---

### Task 6: Hero, Crawl, Estrela da Morte, Starfield e revelação com sabre

**Files:**
- Create: `src/components/fx/Starfield.tsx`, `src/components/fx/DeathStar.tsx`, `src/components/fx/DeathStarStatic.tsx`, `src/components/fx/DeathStar3D.tsx`, `src/components/fx/Crawl.tsx`, `src/components/fx/LightsaberReveal.tsx`, `src/components/sections/Hero.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `useAudio`, `useReducedMotion`, `safeGet/safeSet`, `profile`.
- Produces: `<Hero />`, `<Crawl onDone={() => void} />`, `<LightsaberReveal active={boolean} />`, evento DOM `window.dispatchEvent(new Event('sith:activated'))` disparado quando o sabre é ativado.

- [ ] **Step 1: `Starfield.tsx`.** Canvas fixo cobrindo o hero. 3 camadas de estrelas (200, 120, 60) com velocidades de parallax pelo `scrollY` e pelo mouse; 40 partículas de poeira vermelha (`rgba(225,6,0,.35)`) flutuando. `requestAnimationFrame` só quando o hero está visível; com reduced-motion desenha um único frame estático. Redimensiona em `resize` com `devicePixelRatio` limitado a 2.

- [ ] **Step 2: `DeathStarStatic.tsx`.** SVG: círculo de 260 px com `radialGradient` cinza-carvão, sulco equatorial, cratera do superlaser (círculo deslocado, borda `#8b0000`), leve brilho vermelho. Sem marca registrada, formas originais.

- [ ] **Step 3: `DeathStar3D.tsx`.** Client component carregado com `next/dynamic({ ssr: false })` por `DeathStar.tsx`. Importa `three`. Esfera com `MeshStandardMaterial` cinza escuro, sulco equatorial (torus fino) e cratera; luz direcional vermelha e ambiente fraca; rotação lenta guiada pelo scroll (portar a lógica da linha ~433 do protótipo). Renderer com `alpha: true`, `setPixelRatio(min(dpr,2))`, dispose no unmount.

- [ ] **Step 4: `DeathStar.tsx`** escolhe versão:

```tsx
'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { DeathStarStatic } from './DeathStarStatic';

const DeathStar3D = dynamic(() => import('./DeathStar3D'), { ssr: false });

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}

export function DeathStar() {
  const reduced = useReducedMotion();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    setOk(!reduced && window.matchMedia('(min-width: 768px)').matches && hasWebGL());
  }, [reduced]);
  return ok ? <DeathStar3D /> : <DeathStarStatic />;
}
```

- [ ] **Step 5: `Crawl.tsx`.** Overlay `fixed inset-0 z-[400] bg-void`. Texto vermelho (`#e10600`) em container com `transform: perspective(400px) rotateX(25deg)` e animação `translateY(100%) → translateY(-160%)` por 38 s. 4 a 5 linhas apresentando quem sou (título "EPISÓDIO I: O DESENVOLVEDOR" mais parágrafos derivados de `profile.sobre`). Botão "Pular introdução" sempre visível (`fixed bottom-6 right-6`, foco visível). Ao terminar a animação (`onAnimationEnd`) ou pular: `safeSet('sith:crawl-seen','1')`, `unlock()` no clique de pular, e `onDone()`. Com reduced-motion o crawl não anima: mostra o texto estático e o botão "Continuar". Em `page.tsx`, o crawl só aparece se `safeGet('sith:crawl-seen') !== '1'`; usar estado `crawlDone` inicializado num `useEffect` para evitar mismatch de hidratação.

- [ ] **Step 6: `LightsaberReveal.tsx`.** Ao `active`, uma lâmina vermelha (`div` com `box-shadow` intenso) estende-se da esquerda para a direita em 700 ms (`scaleX 0→1`), depois um painel preto se recolhe revelando o hero (`clip-path` animado). Sem reduced-motion: 700 ms; com reduced-motion: fade simples de 200 ms.

- [ ] **Step 7: `Hero.tsx`.** `<section id="inicio">` mín. 100vh. Estrelas ao fundo, `DeathStar` à direita/fundo, nome em `font-display` grande com `glow-text`, cargo, subtítulo em mono, frase de efeito. Botões: **"Ativar sabre"** (primário; `unlock()`, `play('ignition')`, depois `play('hum')`, dispara `LightsaberReveal` e `sith:activated`, e rola suave até `#identificacao` após 900 ms), **"Ver projetos"** (âncora `#missoes`, `play('swing')`), **"Baixar currículo"** (`href={profile.curriculo}` com `download`). Hover dos botões: glow e `play('blip')`. Indicador de scroll animado (linha vermelha descendo) com `aria-hidden`. O conteúdo do hero já é legível sem ativar o sabre (a lâmina é um efeito, não um gate de conteúdo, por acessibilidade e SEO).

- [ ] **Step 8: Verificar no navegador** (`npm run dev`): crawl aparece só na primeira visita e pula; após limpar `sith:crawl-seen` volta; "Ativar sabre" toca ignition, a música entra suave em volume baixo; mute silencia tudo; desativar WebGL (DevTools) ou emular `prefers-reduced-motion` mostra a Estrela estática; sem erros no console. Rodar `npm run typecheck && npm run lint`.

- [ ] **Step 9: Commit** `feat: add hero, crawl, starfield, death star, saber reveal`

---

### Task 7: 01 Identificação e 02 Arsenal

**Files:**
- Create: `src/components/sections/Identificacao.tsx`, `src/components/sections/Arsenal.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `profile`, `skillGroups`, `SectionTitle`, `Counter`, `useReveal`.

- [ ] **Step 1: `Identificacao.tsx`.** `<section id="identificacao" class="max-w-[1240px] mx-auto py-[clamp(90px,12vw,150px)] px-[clamp(20px,5vw,64px)]">`. `SectionTitle label="// 01 IDENTIFICAÇÃO"`. Texto de `profile.sobre` em `font-body`, grid de 4 `Counter` (de `profile.numeros`) em cards `bg-coal` com borda `blood` e glow no hover. Cada bloco usa `.reveal`.

- [ ] **Step 2: `Arsenal.tsx`.** `SectionTitle label="// 02 ARSENAL"`. Grid responsivo (`grid-cols-1 md:grid-cols-2 xl:grid-cols-3`) de cards por categoria. Cada item mostra nome + nível como "cristais kyber": 3 losangos SVG, preenchidos conforme `Dia a dia` = 3, `Confortável` = 2, `Estudando` = 1, com `aria-label` do nível (`role="img"`). Legenda dos níveis no topo da seção. Sem porcentagens. Chips de tecnologia em `font-mono`.

- [ ] **Step 3: Verificar** no navegador (dark, mobile 375 px sem scroll horizontal). `npm run typecheck && npm run lint`.

- [ ] **Step 4: Commit** `feat: add identificacao and arsenal sections`

---

### Task 8: 03 Missões (cards, filtro, modal, diagrama Kafka)

**Files:**
- Create: `src/components/sections/Missoes.tsx`, `src/components/ui/ProjectCard.tsx`, `src/components/ui/ProjectModal.tsx`, `src/components/ui/ProjectMockup.tsx`, `src/components/ui/KafkaDiagram.tsx`, `src/lib/useTilt.ts`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `projects`, `filterProjects`, `CATEGORIAS`, `useAudio`, `Project`.
- Produces: `<ProjectCard project={p} onOpen={() => void} />`, `<ProjectModal project={p | null} onClose={() => void} />`, `useTilt(max = 8): { ref; onMouseMove; onMouseLeave }` (no-op em touch/reduced-motion).

- [ ] **Step 1: `ProjectMockup.tsx`.** Recebe `nome` e `categorias`; renderiza SVG de "tela" (barra de janela com 3 pontos, linhas de conteúdo e um gráfico estilizado, cores da paleta, variando por hash do nome). Comentário: `// SLOT DE IMAGEM: passe project.imagem para substituir este mockup por um print real.`

- [ ] **Step 2: `ProjectCard.tsx`.** Se `project.imagem`, usa `<img src alt={`Tela do projeto ${nome}`} loading="lazy">`; senão `ProjectMockup`. Mostra selo (se houver), nome, resumo, chips de stack (máx. 6 + "+N"), ícone de cadeado com `aria-label="Repositório privado"` quando `links.privado`. Destaques: `md:col-span-2`. Hover: tilt 3D via `useTilt`, borda e glow `ember`, `play('blip')`. O card inteiro é um `<button>` acessível que abre o modal.

- [ ] **Step 3: `ProjectModal.tsx`.** `role="dialog" aria-modal="true" aria-labelledby`, `play('door')` ao abrir, fecha com Esc e clique no fundo, trava o scroll do body, foco vai para o botão fechar e volta ao card ao fechar. Conteúdo: título, selo, imagem/mockup, seções Contexto, Desafio, O que construí, Decisões técnicas (lista), Resultado, chips de stack, links (repos, demo; se `privado`, cadeado e texto "Repositório privado, código sob NDA/comercial"). Para `quarkus-kafka` renderiza `KafkaDiagram` dentro do modal e também no card expandido da seção.

- [ ] **Step 4: `KafkaDiagram.tsx`.** SVG com 4 nós (cotação, proposta, report, gateway-BFF) ligados a um nó central "Kafka"; arestas em `#8b0000`; pulsos (`<circle>` com `<animateMotion>` ou CSS offset-path) viajando pelas arestas em sequência; legenda `aria-label` descrevendo o fluxo; com reduced-motion os pulsos ficam parados na aresta.

- [ ] **Step 5: `Missoes.tsx`.** `SectionTitle label="// 03 MISSÕES"`. Filtro com `CATEGORIAS` (botões `aria-pressed`, `play('blip')`). Grid `grid-cols-1 md:grid-cols-2 xl:grid-cols-3` com `filterProjects`. Se vazio, mensagem "Nenhuma missão nesta categoria ainda." Controla o projeto aberto em estado local.

- [ ] **Step 6: Verificar** no navegador: filtro troca cards, modal abre/fecha por clique, Esc e fundo, foco retorna; o diagrama anima; mobile sem overflow. `npm run typecheck && npm run lint`.

- [ ] **Step 7: Commit** `feat: add missoes with cards, filter, modal and kafka diagram`

---

### Task 9: 04 Campanhas e 05 Destaque IA

**Files:**
- Create: `src/components/sections/Campanhas.tsx`, `src/components/sections/DestaqueIA.tsx`, `src/components/ui/AiDemo.tsx`, `src/lib/classify-demo.ts`
- Test: `src/lib/classify-demo.test.ts`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `experiences`, `aiSteps`, `aiLearnings`, `demoCategorias`.
- Produces: `classifyDemo(descricao: string): { categoria: (typeof demoCategorias)[number]; confianca: number }` (determinístico, por palavras-chave, sem API).

- [ ] **Step 1: Teste que falha (`classify-demo.test.ts`)**

```ts
import { classifyDemo } from './classify-demo';

test.each([
  ['Uber para o trabalho', 'Transporte'],
  ['almoço no restaurante', 'Alimentação'],
  ['aluguel de março', 'Moradia'],
  ['cinema com amigos', 'Lazer'],
  ['consulta na farmácia', 'Saúde'],
])('%s -> %s', (txt, cat) => expect(classifyDemo(txt).categoria).toBe(cat));

test('texto vazio ou sem correspondência cai em Outros com confiança baixa', () => {
  expect(classifyDemo('').categoria).toBe('Outros');
  const r = classifyDemo('xkcd qwerty');
  expect(r.categoria).toBe('Outros');
  expect(r.confianca).toBeLessThan(0.5);
});
```
Run: `npm test -- classify` → FAIL.

- [ ] **Step 2: Implementar `classify-demo.ts`**

```ts
import { demoCategorias } from '@/data/ai-pipeline';

type Cat = (typeof demoCategorias)[number];

const REGRAS: [Cat, RegExp][] = [
  ['Transporte', /uber|99|ônibus|onibus|metr[oô]|gasolina|combust|estacionamento|passagem/i],
  ['Alimentação', /almo[cç]o|jantar|restaurante|mercado|padaria|lanche|ifood|caf[eé]/i],
  ['Moradia', /aluguel|condom[ií]nio|luz|[aá]gua|internet|iptu/i],
  ['Lazer', /cinema|show|jogo|viagem|netflix|spotify|bar|festa/i],
  ['Saúde', /farm[aá]cia|consulta|exame|plano de sa[uú]de|dentista|rem[eé]dio/i],
];

export function classifyDemo(descricao: string): { categoria: Cat; confianca: number } {
  const texto = descricao.trim();
  if (!texto) return { categoria: 'Outros', confianca: 0.2 };
  for (const [cat, re] of REGRAS) if (re.test(texto)) return { categoria: cat, confianca: 0.92 };
  return { categoria: 'Outros', confianca: 0.3 };
}
```
Run: `npm test` → PASS.

- [ ] **Step 3: `Campanhas.tsx`.** `SectionTitle label="// 04 CAMPANHAS"`, `max-w-[1000px]`. Timeline vertical: linha cinza-carvão fixa e uma linha vermelha luminosa por cima cuja altura acompanha o progresso de scroll dentro da seção (calculado no `scroll` com `requestAnimationFrame`, `0..1`); cada nó (círculo) acende (`bg-sith` + glow) quando a linha o alcança. Com reduced-motion a linha aparece completa. Cada entrada: título, org, período em mono, lista de itens.

- [ ] **Step 4: `DestaqueIA.tsx`.** `SectionTitle label="// 05 INTELIGÊNCIA ARTIFICIAL EM PRODUÇÃO"`. Diagrama horizontal (vertical no mobile) com os 5 `aiSteps`, conectados por setas; um pulso vermelho percorre os passos em loop (CSS), com `aria-label` descrevendo o pipeline. Abaixo, lista `aiLearnings` e `AiDemo`.

- [ ] **Step 5: `AiDemo.tsx`.** Input "Descreva um gasto", botão "Classificar". Ao clicar: mostra estados sequenciais animados (400 ms cada) "Prompt enviado", "Structured output recebido", "Validando com schema", depois o resultado (`categoria`, barra de confiança) com botões "Confirmar" / "Sobrescrever" (select com `demoCategorias`). Rótulo visível: "Simulação no navegador, nenhuma API é chamada." Entrada vazia mostra aviso inline, não resultado.

- [ ] **Step 6: Verificar** timeline acende ao rolar; demo classifica "Uber para o trabalho" como Transporte; mobile ok. `npm run typecheck && npm run lint && npm test`.

- [ ] **Step 7: Commit** `feat: add campanhas timeline and AI highlight with demo`

---

### Task 10: 06 Comunicação e Rodapé

**Files:**
- Create: `src/components/sections/Comunicacao.tsx`, `src/components/sections/Footer.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `profile`, `buildMailto`, `useAudio`.
- Produces: `window` evento `sith:open-contact` escutado por `Comunicacao` (rola até `#comunicacao` e foca o campo nome), usado pelo terminal e Holocron.

- [ ] **Step 1: `Comunicacao.tsx`.** `SectionTitle label="// 06 COMUNICAÇÃO"`. Formulário "transmissão holográfica" (bordas com scanline/glow, labels em mono): Nome, E-mail, Mensagem, todos `required` com `<label>`. Envio: se `profile.formspree` estiver preenchido, `fetch` POST JSON com tratamento de erro e mensagem de sucesso/falha visível (`role="status"`); caso contrário `window.location.href = buildMailto(profile.email, …)`. Painel lateral com e-mail, GitHub, LinkedIn, WhatsApp (`profile.whatsapp`, comentário `// TROCAR número`), botão "Baixar currículo", localização e a frase final `profile.fraseFinal`.

- [ ] **Step 2: `Footer.tsx`.** Assinatura, ano (`new Date().getFullYear()`), aviso de fã: "Projeto de fã, sem afiliação com Lucasfilm ou Disney." Borda superior `rgba(139,0,0,.3)`, texto mono `ash`.

- [ ] **Step 3: Montar todas as seções em `page.tsx`** na ordem Hero, Identificacao, Arsenal, Missoes, Campanhas, DestaqueIA, Comunicacao, Footer.

- [ ] **Step 4: Verificar** enviar formulário sem Formspree abre o cliente de e-mail com assunto/corpo corretos (acentos preservados); campos vazios são bloqueados pela validação nativa. `npm run typecheck && npm run lint && npm run build`.

- [ ] **Step 5: Commit** `feat: add comunicacao, footer and full page composition`

---

### Task 11: Cursor, Terminal, Holocron e Easter eggs

**Files:**
- Create: `src/components/fx/Cursor.tsx`, `src/components/fx/LightSide.tsx`, `src/components/ui/Terminal.tsx`, `src/components/ui/Holocron.tsx`, `src/components/ui/EasterEggs.tsx`, `src/components/ui/Logo.tsx`
- Modify: `src/components/ui/Nav.tsx` (usar `Logo`), `src/app/page.tsx`

**Interfaces:**
- Consumes: `createSequenceMatcher`, `KONAMI`, `SITH`, `runCommand`, `useAudio`, `profile`.
- Produces: `<Logo />` (dispara `sith:logo-click`), `<EasterEggs />` (monta tudo global), `<Terminal open onClose />`, `<Holocron />`.

- [ ] **Step 1: `Cursor.tsx`.** Só monta se `window.matchMedia('(pointer: fine)').matches` e não reduced-motion. Ponto/mira vermelho seguindo o mouse (`transform` via rAF) com rastro laser (canvas ou 8 divs com atraso decrescente). Sobre `a, button, [role=button]` o cursor vira lâmina (retângulo fino vermelho de 4×28 px inclinado). O cursor nativo continua visível em elementos de formulário e o cursor customizado é `pointer-events: none`.

- [ ] **Step 2: `Logo.tsx`.** Monograma "GMF" em `font-display` com pequeno sabre; contador de cliques; ao 5º clique em até 3 s chama `play('march')` e mostra toast "Impressionante. Mais uma vez, o código compila." por 4 s (`role="status"`).

- [ ] **Step 3: `Terminal.tsx`.** Modal `role="dialog"` estilo terminal do Império (vermelho sobre preto, mono). Histórico de linhas, input focado, Enter executa `runCommand`. `action`: `clear` limpa, `close` fecha, `open-contact` fecha e dispara `sith:open-contact`. Setas cima/baixo navegam no histórico de comandos. Esc fecha. Mensagem de boas-vindas com dica `help`.

- [ ] **Step 4: `Holocron.tsx`.** Botão flutuante (`fixed bottom-4 right-4`, ícone cubo/holocron) que abre painel com: quem sou (`profile.cargo`, `profile.sobre` resumido), stack principal, e-mail/GitHub/LinkedIn, botão "Baixar currículo". `aria-expanded`, Esc fecha, foco gerenciado.

- [ ] **Step 5: `EasterEggs.tsx`.** Um `keydown` global com dois `createSequenceMatcher` (KONAMI e SITH), passando `e.target`. Konami: aplica `LightSide` (overlay azul `mix-blend`/filtro `hue-rotate`) por 3 s e depois mostra "Você não pode escapar do seu destino." por 4 s; sem reduced-motion, com reduced-motion mostra só o texto. SITH: abre `Terminal`. No mount, `console.log` com arte ASCII (estilo `%c` vermelho) e a mensagem de recrutamento com e-mail `profile.email`.

- [ ] **Step 6: Montar** `<Cursor />`, `<Holocron />`, `<EasterEggs />` em `page.tsx`.

- [ ] **Step 7: Verificar no navegador:** Konami funciona e volta ao normal; 5 cliques no logo tocam a marcha; digitar "sith" no body abre o terminal, mas digitar "sith" no campo Mensagem do contato NÃO abre; `sudo hire gustavo` rola ao contato; console mostra o ASCII; cursor vira lâmina em links; em toque não há cursor customizado. `npm run typecheck && npm run lint && npm test`.

- [ ] **Step 8: Commit** `feat: add cursor, terminal, holocron and easter eggs`

---

### Task 12: SEO, acessibilidade, performance e verificação final

**Files:**
- Create: `src/app/opengraph-image.tsx`, `src/app/icon.svg`
- Modify: `src/app/layout.tsx`, `README.md`

**Interfaces:**
- Consumes: tudo acima.

- [ ] **Step 1: Open Graph e favicon.** `opengraph-image.tsx` (`export const dynamic = 'force-static'`, tamanho 1200×630) com `ImageResponse`: fundo `#050505`, lâmina vermelha, nome e cargo em branco quente. `icon.svg`: fundo `#050505`, lâmina `#ff2a1f` vertical com cabo cinza (mesmo do protótipo). Em `metadata` acrescentar `metadataBase` lido de `process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'` e comentário `// TROCAR pela URL final`.

- [ ] **Step 2: Passada de acessibilidade.** Conferir: um único `<h1>` (nome no hero), hierarquia h2/h3, todos os botões-ícone com `aria-label`, `alt` em imagens, foco visível em todos os controles, contraste do texto `ash` sobre `void` (≥ 4.5:1: `#9a9a9a` sobre `#050505` passa), modais com foco preso e restaurado, link "Pular para o conteúdo".

- [ ] **Step 3: Verificação técnica completa**

Run: `npm run typecheck && npm run lint && npm test && npm run build`
Expected: tudo verde; `out/` contém `index.html`, `assets/sounds/emperor-theme.mp3`, `curriculo.pdf`.

- [ ] **Step 4: Verificação no navegador** (dev ou `npx serve out`): desktop 1440 px e mobile 375 px, sem scroll horizontal; sem erros no console; primeira visita mostra crawl, segunda não; música só começa após clique, com volume baixo; mute persiste após recarregar; `prefers-reduced-motion` desliga animações e usa a Estrela estática; Lighthouse (aba do Chrome) Performance/Acessibilidade/SEO/Best Practices ≥ 90 (anotar os números reais, e se algum ficar abaixo, listar o motivo em vez de afirmar que passou).

- [ ] **Step 5: README final.** Seção "Trocar placeholders" (WhatsApp, PDF, Formspree, URL do site, prints em `public/assets/projects/` + campo `imagem`, sons opcionais), "Áudio e direitos" (aviso sobre a trilha do Imperador e como trocar em `MUSIC_SRC`), "Deploy" (Vercel: importar repo; GitHub Pages: publicar `out/`; nota sobre `basePath` se for em subcaminho).

- [ ] **Step 6: Commit** `chore: seo, a11y pass and docs`

---

## Self-review (spec x plano)

- Cobertura: Hero/Crawl/Sabre/Nav/Cursor (T5, T6, T11), áudio e trilha (T4, T6), easter eggs, terminal e Holocron (T3, T11), seções 01 a 06 e rodapé (T7 a T10), dados editáveis (T2), SEO/a11y/responsivo/reduced-motion (T1, T5, T12), README e avisos de direitos (T1, T12).
- Tipos consistentes: `Project`, `Categoria`, `SkillLevel`, `runCommand`, `filterProjects`, `createSequenceMatcher`, `audio.play/unlock/setMuted` usados com as mesmas assinaturas em todas as tasks.
- Pendências conscientes: os textos de `briefing` dos 7 projetos restantes e os níveis exatos das skills são escritos na Task 2 a partir da spec de conteúdo; prints reais entram depois via campo `imagem`.
