import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'api.schaakclubegs.nl' }],
  },
  reactCompiler: true,
  turbopack: {
    root: path.join(__dirname, '..'),
  },
  output: 'standalone',
  serverExternalPackages: ['jsdom'],
};

export default nextConfig;
