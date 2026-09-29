# Portfolio Sith

Portfólio de Gustavo Martins França. Next.js (App Router) + TypeScript + Tailwind, exportado como site estático.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # lógica pura (Vitest)
npm run typecheck && npm run lint
npm run build      # gera out/ (site estático)
```

## Editar conteúdo

Tudo em `src/data/*.ts` (perfil, projetos, skills, experiência, pipeline de IA). O layout não muda.

## Trocar placeholders

| O quê | Onde |
| --- | --- |
| Currículo (PDF) | edite `docs/curriculo/curriculo.html` e gere de novo o PDF em `public/Curriculo-Gustavo-Martins-Franca.pdf` (instruções no comentário do HTML) |
| Formulário via Formspree (opcional) | `src/data/profile.ts` (`formspree`); vazio usa `mailto:` |
| URL final do site (Open Graph) | variável `NEXT_PUBLIC_SITE_URL` |
| Prints dos projetos | coloque em `public/assets/projects/` e preencha `imagem` em `src/data/projects.ts` (o campo `slot` sugere o nome do arquivo). Sem `imagem`, o card mostra um mockup SVG |

## Áudio e direitos

- A trilha ambiente é `public/assets/sounds/emperor-theme.mp3`, tocada em loop e em volume baixo (`MUSIC_VOLUME`, em `src/lib/audio.ts`). Só começa após o primeiro clique do visitante; o botão de som (canto inferior esquerdo) liga e desliga, e a escolha fica salva.
- **Direitos:** é o tema do Imperador (John Williams, Lucasfilm/Disney), numa compilação de fã. Para uso público ou comercial, troque por uma faixa livre de direitos e ajuste `MUSIC_SRC`.
- Os efeitos (swing, blip, marcha) são sintetizados via Web Audio API. Para usar arquivos reais, veja `public/assets/sounds/README.md`.

## Easter eggs

Código Konami, 5 cliques no logo, digitar `sith` (abre o terminal) e o console do navegador.

## Deploy

- **Vercel:** importe o repositório; framework Next.js, sem configuração extra.
- **GitHub Pages:** publique a pasta `out/` (já inclui `.nojekyll`). Em subcaminho (`usuario.github.io/repo`), rode o build com `NEXT_PUBLIC_BASE_PATH=/repo npm run build`; a trilha de áudio e o currículo respeitam esse prefixo. Prints em `imagem` (`src/data/projects.ts`) devem usar `asset('/assets/projects/...')` de `src/lib/paths.ts`.

Projeto de fã, sem afiliação com Lucasfilm ou Disney.
