import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Gustavo Martins França · Engenheiro de Software Full Stack';

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80, background: '#050505', color: '#f2ede8', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 96, height: 6, background: '#ff2a1f', boxShadow: '0 0 40px #e10600' }} />
        <div style={{ fontSize: 26, letterSpacing: 8, color: '#e10600', marginBottom: 24 }}>TRANSMISSÃO IMPERIAL · PERFIL 0001</div>
        <div style={{ fontSize: 88, fontWeight: 900, lineHeight: 1 }}>Gustavo Martins França</div>
        <div style={{ fontSize: 40, marginTop: 28 }}>Engenheiro de Software Full Stack</div>
        <div style={{ fontSize: 28, marginTop: 20, color: '#9a9a9a' }}>TypeScript · Java · PostgreSQL · IA Generativa</div>
      </div>
    ),
    size,
  );
}
