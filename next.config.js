/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
    ],
  },
  // Prevent stale /_next/static chunk 404s by sending no-cache headers in dev.
  // In production, Next.js handles long-lived caching correctly via content hashes.
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';
    if (!isDev) return [];
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
        ],
      },
      {
        source: '/_next/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
        ],
      },
    ];
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@react-three/drei'],
  },
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', 'gsap'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
