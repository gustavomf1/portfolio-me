# Portfolio Sith: Design

Data: 2026-09-29. Autor: Gustavo Martins França.

## Objetivo

Portfólio pessoal de Engenheiro de Software Full Stack, single page, em português do Brasil, com tema Star Wars (lado sombrio). Prioridade: impacto visual nos primeiros 3 segundos sem perder a cara de engenheiro contratável. Texto de conteúdo claro e objetivo para recrutador técnico; o tema aparece em títulos, microcopy, botões, easter eggs e transições.

## Fontes

- Spec de conteúdo e comportamento: `~/Downloads/Portfolio Sith Design/uploads/prompt-portfolio-claude-design.md`.
- Referência visual: `~/Downloads/Portfolio Sith Design/Portfolio.dc.html` (protótipo em formato `x-dc`, não é código de produção). Paleta, fontes, espaçamentos e Estrela da Morte 3D/estática são portados para Tailwind.
- Este documento prevalece sobre a spec de conteúdo onde houver conflito (ex.: música de fundo).

## Premissas

- Site estático, sem backend, deploy em Vercel ou GitHub Pages.
- Prints reais dos projetos chegam depois; até lá, mockups SVG/CSS como placeholder.
- WhatsApp, PDF do currículo e Formspree ficam como placeholders comentados.
- Repo git local, sem push.
- Sem assets, logos ou marcas da Lucasfilm; tudo em CSS/SVG/canvas originais.

## Stack

Next.js (App Router) + TypeScript + Tailwind, com `output: 'export'` (saída estática em `out/`). Three.js apenas para a Estrela da Morte 3D, em lazy load. Componentes de animação e áudio são client components.

## Estrutura

```
portfolio-sith/
  public/assets/sounds/   emperor-theme.mp3 + README (efeitos são sintetizados se faltar arquivo)
  public/assets/projects/ prints reais (quando existirem)
  public/curriculo.pdf    placeholder
  src/
    app/ layout.tsx, page.tsx, globals.css, opengraph-image
    data/ projects.ts, skills.ts, experience.ts, profile.ts, ai-pipeline.ts
    components/
      sections/ Hero, Identificacao, Arsenal, Missoes, Campanhas, DestaqueIA, Comunicacao, Footer
      fx/ Starfield, DeathStar, Crawl, LightsaberReveal, Cursor, Vignette
      ui/ Nav, ProjectCard, ProjectModal, Terminal, Holocron, MuteButton, GlitchTitle, Counter
    lib/ audio.ts, useReveal.ts, useReducedMotion.ts, easter-eggs.ts
```

## Dados

Todo conteúdo editável vive em `src/data/*.ts`, tipado. Projeto: `slug`, `nome`, `categoria[]`, `destaque`, `selo`, `resumo`, `stack[]`, `links` (repo, demo, `privado`), `briefing` (contexto, desafio, construído, decisões, resultado), `imagem?`. Sem `imagem`, o card renderiza mockup SVG. SafeCore não cita o cliente e exibe cadeado "repositório privado, código sob NDA/comercial". Projetos e ordem conforme a spec de conteúdo (SafeCore, FinTrack AI, Insight Flow em destaque; demais em cards menores).

## Áudio (`lib/audio.ts`)

- Web Audio API criada só após o primeiro gesto do usuário. Estado inicial: sem som até o primeiro clique; preferência de mute em localStorage.
- Efeitos (`ignition`, `hum`, `swing`, `blip`, `door`, `imperialMarch`): tentam `/assets/sounds/*.mp3`; se ausente, sintetizam com oscilador, filtro e envelope. Comentários indicam onde trocar.
- **Trilha ambiente:** `emperor-theme.mp3` (copiado de `~/Downloads/The Emperor's Theme Compilation - TheDarkPrince926.mp3`, 8,1 MB) em `<audio loop preload="none">`. Volume `MUSIC_VOLUME` (constante no topo, padrão 0.08) com fade-in de ~3 s. Inicia no primeiro clique (Ativar sabre ou Pular introdução). Pausa com a aba em segundo plano. Não toca automaticamente sob `prefers-reduced-motion`. Efeitos ficam acima da música.
- `MuteButton` sempre visível controla música e efeitos juntos.
- Aviso no README: a trilha é o tema do Imperador (John Williams, Lucasfilm/Disney), compilação de fã; arquivo isolado em um caminho para troca por faixa livre de direitos. Efeitos sintetizados são originais.

## Efeitos e interação

- Hero: Starfield em canvas (parallax, poeira vermelha) e Estrela da Morte. 3D via Three.js em lazy load; estática como fallback (mobile, reduced-motion, falha de WebGL).
- Crawl vermelho em perspectiva CSS, só na primeira visita (localStorage), botão "Pular introdução" sempre visível.
- Botão "Ativar sabre": ignition + lâmina que revela o conteúdo. Menu fixo com lâmina que desliza até a seção ativa; swing ao clicar. Menu hambúrguer em forma de sabre no mobile.
- Cursor mira com rastro laser, vira lâmina sobre links; só em dispositivos com mouse.
- Reveal on scroll, glitch em títulos, contadores animados, tilt 3D nos cards. Tudo respeita `prefers-reduced-motion`.
- Easter eggs: Konami (lado luz por 3 s, volta com "Você não pode escapar do seu destino."); 5 cliques no logo (Marcha Imperial sintetizada, "Impressionante. Mais uma vez, o código compila."); digitar "sith" abre o terminal; console com ASCII e mensagem de recrutamento.
- Terminal: `help`, `about`, `skills`, `projects`, `contact`, `sudo hire gustavo`, lendo de `data/*`. Holocron: painel flutuante com resumo, stack, contato e currículo.

## Seções

Hero; 01 Identificação (contadores); 02 Arsenal (níveis "Dia a dia / Confortável / Estudando", sem porcentagem); 03 Missões (filtro Todos/IA/Backend/Frontend/Mobile/Arquitetura, cards com tilt, modal briefing, diagrama animado de eventos Kafka); 04 Campanhas (timeline que acende no scroll); 05 Destaque IA (pipeline animado prompt, LLM, structured output, validação, resposta; mini demo simulada no client, sem API); 06 Comunicação (mailto padrão, Formspree configurável, links, WhatsApp placeholder); Rodapé com aviso de projeto de fã sem afiliação com Lucasfilm/Disney.

## Qualidade e entrega

- HTML semântico, foco visível em vermelho, `alt`/`aria-label`, contraste AA, 100% responsivo, funcional em toque.
- SEO: metadata, Open Graph gerado (preto e vermelho), favicon.
- `npm run build` gera `out/`.
- Verificação: build, lint, typecheck e passada no navegador (desktop e mobile). Testes unitários só para lógica pura (filtro de projetos, comandos do terminal).

## Fora de escopo

Backend, CMS, i18n, analytics, testes E2E, push/deploy.
