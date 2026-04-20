/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'cloudflare-pages-dist',
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
