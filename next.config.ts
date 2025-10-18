import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration pour éviter les problèmes de lockfiles multiples
  outputFileTracingRoot: process.cwd(),

  // Configuration pour les routes API
  serverExternalPackages: ['@aws-sdk/client-s3'],

  // Configuration pour le mode production
  productionBrowserSourceMaps: true,

  // Headers pour les routes API
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
