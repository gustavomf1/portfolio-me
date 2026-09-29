import type { SkillLevel } from '@/data/types';

const LEVEL: Record<SkillLevel, number> = { 'Dia a dia': 3, 'Confortável': 2, 'Estudando': 1 };

// Cristais kyber: 3 losangos, preenchidos conforme o nível de familiaridade (sem porcentagem).
export function Kyber({ nivel, size = 5, glow = false }: { nivel: SkillLevel; size?: number; glow?: boolean }) {
  const n = LEVEL[nivel];
  return (
    <span role="img" aria-label={nivel} className="flex gap-[2px]">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            width: size,
            height: size,
            transform: 'rotate(45deg)',
            background: i <= n ? '#e10600' : 'rgba(154,154,154,.28)',
            boxShadow: glow && i <= n ? '0 0 8px #e10600' : undefined,
          }}
        />
      ))}
    </span>
  );
}
