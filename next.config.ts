import type { NextConfig } from 'next';

// Static export: `next build` writes plain HTML/CSS/JS to out/, which GitHub Pages serves as-is.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
