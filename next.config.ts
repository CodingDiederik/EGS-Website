import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Disable Next.js image optimization to avoid upstream 403 responses from WordPress
    // when the optimizer fetches images server-side without a referer.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'jeugd.schaakclubegs.nl' },
      { protocol: 'https', hostname: 'egs.diederikwebster.nl' },
    ],
  },
  reactCompiler: true,
  turbopack: {
    root: path.join(__dirname, '..'),
  },
  output: 'standalone',
  serverExternalPackages: ['jsdom'],
};

export default nextConfig;
