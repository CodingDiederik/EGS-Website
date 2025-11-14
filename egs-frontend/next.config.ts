import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.pexels.com' }],
  },
  reactCompiler: true,
  turbopack: {
    root: path.join(__dirname, '..'),
  },
};

export default nextConfig;
