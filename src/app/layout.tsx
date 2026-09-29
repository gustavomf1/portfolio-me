import type { Metadata } from 'next';
import { Orbitron, Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// Fontes variáveis (sem `weight`): uma única consulta por fonte, cobre todos os pesos usados (500 a 900).
// Com uma lista de pesos fixos, o Turbopack em modo dev falhava com "queries have exactly one entry".
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

export const metadata: Metadata = {
  // TROCAR pela URL final do site (usada nas imagens Open Graph).
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
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
    <html lang="pt-BR" suppressHydrationWarning className={`${orbitron.variable} ${manrope.variable} ${jetbrains.variable}`}>
      <head>
        {/* Esconde o crawl antes da hidratação em quem já o viu (evita o flash do site antes da intro). */}
        <script dangerouslySetInnerHTML={{ __html: "try{var s=sessionStorage;if(s.getItem('sith:crawl-seen')==='1')document.documentElement.classList.add('crawl-seen');if(s.getItem('sith:gate-seen')==='1')document.documentElement.classList.add('gate-seen')}catch(e){}" }} />
        <noscript><style>{'[data-crawl],[data-gate]{display:none!important}'}</style></noscript>
      </head>
      <body className="grain scanlines">{children}</body>
    </html>
  );
}
