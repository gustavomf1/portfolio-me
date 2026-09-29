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
| URL do site (Open Graph e canonical) | padrão `https://gustavofranca.dev`; mude com `NEXT_PUBLIC_SITE_URL` |
| Prints dos projetos | coloque em `public/assets/projects/` e preencha `imagem` em `src/data/projects.ts` (o campo `slot` sugere o nome do arquivo). Sem `imagem`, o card mostra um mockup SVG |

## Áudio e direitos

- A trilha ambiente é `public/assets/sounds/emperor-theme.mp3`, tocada em loop e em volume baixo (`MUSIC_VOLUME`, em `src/lib/audio.ts`). Só começa após o primeiro clique do visitante; o botão de som (canto inferior esquerdo) liga e desliga, e a escolha fica salva.
- **Direitos:** é o tema do Imperador (John Williams, Lucasfilm/Disney), numa compilação de fã. Para uso público ou comercial, troque por uma faixa livre de direitos e ajuste `MUSIC_SRC`.
- Os efeitos (swing, blip, marcha) são sintetizados via Web Audio API. Para usar arquivos reais, veja `public/assets/sounds/README.md`.

## Easter eggs

Código Konami, 5 cliques no logo, digitar `sith` (abre o terminal) e o console do navegador.

## Deploy no Cloudflare (gustavofranca.dev)

O projeto usa o fluxo *Workers & Pages* do Cloudflare com assets estáticos (`wrangler.jsonc` publica a pasta `out/`).

1. Suba o repositório para o GitHub (o `wrangler.jsonc` precisa estar nele).
2. Cloudflare → *Workers & Pages* → *Create* → conecte o repositório.
3. Configuração:
   - **Project name:** `portfolio-me` (igual ao `name` do `wrangler.jsonc`)
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
   - **Branch de produção:** a mesma do repositório (aqui é `master`)
   - *Advanced settings → Build variables:* `NEXT_PUBLIC_SITE_URL=https://gustavofranca.dev` (o `.nvmrc` já fixa o Node 22)
4. Depois do primeiro deploy: *Settings → Domains & Routes → Add → Custom domain* → `gustavofranca.dev` (e `www`, com redirecionamento para o principal). Se o domínio estiver no Cloudflare, o DNS é criado sozinho; senão, aponte os nameservers para o Cloudflare. `.dev` exige HTTPS, e o certificado é automático.
5. Para testar o deploy localmente sem publicar: `npm run build && npx wrangler deploy --dry-run`.

`public/_headers` define o cache dos arquivos e o tipo da imagem de compartilhamento. Ao mudar o domínio, atualize também `public/robots.txt` e `public/sitemap.xml`.

Outras opções: **Vercel** (importe o repositório, sem configuração extra) ou **GitHub Pages** (publique `out/`; em subcaminho use `NEXT_PUBLIC_BASE_PATH=/repo npm run build`).

Projeto de fã, sem afiliação com Lucasfilm ou Disney.
