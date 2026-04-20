/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'cloudflare-pages-dist',
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
};

module.exports = nextConfig;
