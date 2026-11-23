import type { NextConfig } from 'next';

// Static export for GitHub Pages: the site lives at https://<user>.github.io/insights-dashboard/
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/insights-dashboard',
  trailingSlash: true,
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true }, // we run `npm run lint` separately
};

export default nextConfig;
