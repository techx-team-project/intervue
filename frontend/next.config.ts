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
  async redirects() {
    return [
      { source: '/auth', destination: '/login', permanent: true },
      { source: '/profile', destination: '/candidate/profile', permanent: true },
    ];
  },
};

export default nextConfig;
