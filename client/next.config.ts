import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port:'8000',
        pathname:'/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**'
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
      
      {
        source: '/media/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1/', '')}/media/:path*`,
      },
    ]
  },
};

export default nextConfig;