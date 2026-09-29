import { Nav } from '@/components/ui/Nav';
import { MuteButton } from '@/components/ui/MuteButton';
import { Vignette } from '@/components/fx/Vignette';
import { Crawl } from '@/components/fx/Crawl';
import { Hero } from '@/components/sections/Hero';

export default function Home() {
  return (
    <>
      <a href="#conteudo" className="sr-only-focusable">Pular para o conteúdo</a>
      <Crawl />
      <Vignette />
      <Nav />
      <MuteButton />
      <main id="conteudo" className="relative z-[1]">
        <Hero />
      </main>
    </>
  );
}
