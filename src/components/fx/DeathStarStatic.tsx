// Estrela da Morte em CSS puro (fallback sem WebGL, mobile fraco ou reduced-motion). Formas originais.
export function DeathStarStatic() {
  return (
    <div
      aria-hidden="true"
      className="absolute right-[-12vw] top-1/2 aspect-square w-[min(76vw,680px)] -translate-y-1/2 overflow-hidden rounded-full"
      style={{
        background: 'radial-gradient(circle at 34% 30%,#2c2c2c 0%,#171717 30%,#0a0a0a 56%,#030303 78%)',
        boxShadow: 'inset -70px -40px 120px rgba(0,0,0,.95), 0 0 120px rgba(225,6,0,.12)',
        opacity: 0.92,
      }}
    >
      <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(0deg,rgba(255,255,255,.03) 0 1px,transparent 1px 22px),repeating-linear-gradient(90deg,rgba(255,255,255,.02) 0 1px,transparent 1px 36px)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 22% 24%,transparent 38%,rgba(0,0,0,.88) 76%)' }} />
      <div className="absolute inset-x-0 top-[49.2%] h-[1.4%] bg-black" style={{ boxShadow: '0 1px 0 rgba(255,42,31,.28)' }} />
      <div
        className="absolute left-[19%] top-[17%] aspect-square w-[24%] rounded-full"
        style={{ background: 'radial-gradient(circle at 56% 56%,#222 0%,#0c0c0c 55%,#050505 100%)', boxShadow: 'inset 7px 7px 16px rgba(0,0,0,.95), inset -2px -2px 0 rgba(255,255,255,.07)' }}
      >
        <div
          className="absolute left-1/2 top-1/2 aspect-square w-[13%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember"
          style={{ boxShadow: '0 0 10px #e10600,0 0 30px #ff2a1f,0 0 60px rgba(225,6,0,.6)', animation: 'pulseGlow 3.2s ease-in-out infinite' }}
        />
      </div>
    </div>
  );
}
