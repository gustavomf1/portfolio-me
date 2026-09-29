export function Vignette() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[298]"
      style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.75))' }}
    />
  );
}
