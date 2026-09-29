import type { Project } from '@/data/types';

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// SLOT DE IMAGEM: quando o projeto tiver `imagem`, o card usa o print real no lugar deste mockup.
export function ProjectMockup({ project }: { project: Project }) {
  const h = hash(project.slug);
  const bars = Array.from({ length: 6 }, (_, i) => 20 + ((h >> i) % 60));
  const line = Array.from({ length: 8 }, (_, i) => `${i * 30 + 20},${90 - ((h >> (i + 2)) % 55)}`).join(' ');
  return (
    <svg viewBox="0 0 280 170" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`Ilustração de tela do projeto ${project.nome}`} className="h-full w-full">
      <rect width="280" height="170" fill="#0b0b0b" />
      <rect x="0" y="0" width="280" height="20" fill="#141414" />
      {[0, 1, 2].map((i) => <circle key={i} cx={12 + i * 12} cy="10" r="3" fill={i === 0 ? '#e10600' : '#3a3a3a'} />)}
      <rect x="0" y="20" width="52" height="150" fill="#101010" />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x="10" y={34 + i * 18} width="32" height="4" fill={i === 1 ? '#e10600' : '#2a2a2a'} />)}
      <polyline points={line} fill="none" stroke="#ff2a1f" strokeWidth="1.5" transform="translate(64,22)" opacity=".85" />
      {bars.map((b, i) => <rect key={i} x={70 + i * 24} y={160 - b} width="14" height={b} fill="#8b0000" opacity=".8" />)}
      <rect x="64" y="30" width="90" height="6" fill="#2a2a2a" />
      <rect x="64" y="42" width="60" height="4" fill="#1e1e1e" />
      <rect x="0" y="0" width="280" height="170" fill="url(#scan)" opacity=".25" />
      <defs>
        <pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="#000" /></pattern>
      </defs>
    </svg>
  );
}
