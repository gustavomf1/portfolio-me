'use client';
import { useReducedMotion } from '@/lib/useReducedMotion';

const nodes = [
  { id: 'gateway', label: 'gateway-BFF', x: 50, y: 40 },
  { id: 'quotation', label: 'cotação', x: 50, y: 130 },
  { id: 'proposal', label: 'proposta', x: 350, y: 40 },
  { id: 'report', label: 'report', x: 350, y: 130 },
];
const hub = { x: 200, y: 85 };

// Diagrama do fluxo de eventos: nós vermelhos, pulsos viajando pelas arestas.
export function KafkaDiagram() {
  const reduced = useReducedMotion();
  return (
    <svg viewBox="0 0 400 170" role="img" aria-label="Diagrama: gateway BFF, cotação, proposta e report trocam eventos através do Apache Kafka" className="h-full w-full">
      <rect width="400" height="170" fill="#0a0a0a" />
      {nodes.map((n, i) => {
        const path = `M${n.x},${n.y} L${hub.x},${hub.y}`;
        return (
          <g key={n.id}>
            <path d={path} stroke="#8b0000" strokeWidth="1.4" fill="none" />
            <circle r="3.5" fill="#ff2a1f" style={{ filter: 'drop-shadow(0 0 4px #e10600)' }} cx={reduced ? (n.x + hub.x) / 2 : undefined} cy={reduced ? (n.y + hub.y) / 2 : undefined}>
              {!reduced && <animateMotion dur="2.4s" begin={`${i * 0.6}s`} repeatCount="indefinite" path={path} />}
            </circle>
          </g>
        );
      })}
      <circle cx={hub.x} cy={hub.y} r="22" fill="#1a1a1a" stroke="#e10600" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 8px #e10600)' }} />
      <text x={hub.x} y={hub.y + 4} textAnchor="middle" fill="#f2ede8" fontSize="11" fontFamily="var(--font-jetbrains), monospace">Kafka</text>
      {nodes.map((n) => (
        <g key={`${n.id}-l`}>
          <rect x={n.x - 34} y={n.y - 12} width="68" height="24" fill="#111" stroke="#8b0000" />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fill="#f2ede8" fontSize="10" fontFamily="var(--font-jetbrains), monospace">{n.label}</text>
        </g>
      ))}
    </svg>
  );
}
