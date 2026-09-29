export function Footer() {
  return (
    <footer className="relative z-[1] flex flex-wrap justify-between gap-3 border-t border-blood/30 px-[clamp(20px,5vw,64px)] py-7 font-mono text-xs text-ash">
      <span>© {new Date().getFullYear()} Gustavo Martins França</span>
      <span>Projeto de fã, sem afiliação com Lucasfilm ou Disney.</span>
    </footer>
  );
}
