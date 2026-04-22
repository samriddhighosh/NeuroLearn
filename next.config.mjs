/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,   // ✅ ignores ESLint warnings/errors
  },
  typescript: {
    ignoreBuildErrors: true,    // ✅ ignores TypeScript errors
  },
};

export default nextConfig;
