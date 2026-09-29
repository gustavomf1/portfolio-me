import { Nav } from '@/components/ui/Nav';
import { Vignette } from '@/components/fx/Vignette';
import { Crawl } from '@/components/fx/Crawl';
import { Gate } from '@/components/fx/Gate';
import { Hero } from '@/components/sections/Hero';
import { Identificacao } from '@/components/sections/Identificacao';
import { Missoes } from '@/components/sections/Missoes';
import { Campanhas } from '@/components/sections/Campanhas';
import { Comunicacao } from '@/components/sections/Comunicacao';
import { Footer } from '@/components/sections/Footer';
import { Cursor } from '@/components/fx/Cursor';
import { EasterEggs } from '@/components/ui/EasterEggs';
import { Holocron } from '@/components/ui/Holocron';
import { Toast } from '@/components/ui/Toast';
import { Arsenal } from '@/components/sections/Arsenal';

export default function Home() {
  return (
    <>
      <a href="#conteudo" className="sr-only-focusable">Pular para o conteúdo</a>
      <Gate />
      <Crawl />
      <Vignette />
      <Nav />
      <Holocron />
      <Cursor />
      <EasterEggs />
      <Toast />
      <main id="conteudo" className="relative z-[1]">
        <Hero />
        <Identificacao />
        <Arsenal />
        <Missoes />
        <Campanhas />
        <Comunicacao />
      </main>
      <Footer />
    </>
  );
}
