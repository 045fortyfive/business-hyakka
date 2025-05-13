/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    // 本番ビルド時にESLintチェックを無効にする
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 本番ビルド時にTypeScriptチェックを無効にする
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
