import { GlitchTitle } from './GlitchTitle';

export function SectionTitle({ label, title }: { label: string; title: string }) {
  return (
    <header className="mb-12">
      <p className="font-mono text-sm tracking-[.2em] text-ember mb-3">{label}</p>
      <GlitchTitle className="text-3xl md:text-5xl font-extrabold">{title}</GlitchTitle>
    </header>
  );
}
