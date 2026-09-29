import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // Para GitHub Pages em subcaminho, defina NEXT_PUBLIC_BASE_PATH=/nome-do-repo antes do build.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
};

export default nextConfig;
