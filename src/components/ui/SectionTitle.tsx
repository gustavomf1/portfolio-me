import { GlitchTitle } from './GlitchTitle';

export function SectionTitle({ label, title }: { label: string; title: string }) {
  return (
    <header className="mb-12 flex flex-col gap-3.5">
      <span className="font-mono text-[13px] tracking-[.24em] text-sith">{label}</span>
      <GlitchTitle className="text-[clamp(24px,4.6vw,54px)] font-extrabold">{title}</GlitchTitle>
    </header>
  );
}
