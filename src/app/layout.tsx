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
      <body className="grain scanlines">{children}</body>
    </html>
  );
}
