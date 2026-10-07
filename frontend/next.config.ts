import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-new.topcv.vn',
      },
      {
        protocol: 'https',
        hostname: 'static.topcv.vn',
      },
    ],
  },
};

export default nextConfig;
