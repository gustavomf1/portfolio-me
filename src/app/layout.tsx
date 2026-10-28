import type { Metadata } from 'next';
import { Orbitron, Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// Fontes variáveis (sem `weight`): uma única consulta por fonte, cobre todos os pesos usados (500 a 900).
// Com uma lista de pesos fixos, o Turbopack em modo dev falhava com "queries have exactly one entry".
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });
const GTM_ID = 'GTM-MZ9RXVRB';

// Snippet oficial do GTM: cria o window.dataLayer, registra o evento 'gtm.js' e carrega o container de forma assíncrona.
const GTM_SCRIPT = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`;

export const metadata: Metadata = {
  // URL final do site (imagens Open Graph e canonical). Sobrescreva com NEXT_PUBLIC_SITE_URL se mudar o domínio.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gustavofranca.dev'),
  title: 'Gustavo Martins França · Engenheiro de Software Full Stack',
  description: 'Portfolio de Gustavo Martins França, engenheiro de software full stack: TypeScript, Java, PostgreSQL e IA generativa em produção.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Gustavo Martins França · Engenheiro de Software Full Stack',
    description: 'Abraço a escuridão para construir sistemas que vencem.',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${orbitron.variable} ${manrope.variable} ${jetbrains.variable}`}>
      <head>
        {/* Google Tag Manager: o mais alto possível no head (instalado na mão em vez do @next/third-parties, de propósito) */}
        <script dangerouslySetInnerHTML={{ __html: GTM_SCRIPT }} />
        {/* Esconde o crawl antes da hidratação em quem já o viu (evita o flash do site antes da intro). */}
        <script dangerouslySetInnerHTML={{ __html: "try{var s=sessionStorage;if(s.getItem('sith:crawl-seen')==='1')document.documentElement.classList.add('crawl-seen');if(s.getItem('sith:gate-seen')==='1')document.documentElement.classList.add('gate-seen')}catch(e){}" }} />
        <noscript><style>{'[data-crawl],[data-gate]{display:none!important}'}</style></noscript>
      </head>
      <body className="grain scanlines">
        {/* Google Tag Manager (noscript): logo após abrir o body */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
