import { Nav } from '@/components/ui/Nav';
import { MuteButton } from '@/components/ui/MuteButton';
import { Vignette } from '@/components/fx/Vignette';

export default function Home() {
  return (
    <>
      <a href="#conteudo" className="sr-only-focusable">Pular para o conteúdo</a>
      <Vignette />
      <Nav />
      <MuteButton />
      <main id="conteudo" />
    </>
  );
}
