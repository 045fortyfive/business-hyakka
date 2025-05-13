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
    // 外部ドメインからの画像を許可
    domains: ['images.ctfassets.net'],
  },
  eslint: {
    // 本番ビルド時にESLintチェックを無効にする
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 本番ビルド時にTypeScriptチェックを無効にする
    ignoreBuildErrors: true,
  },
  // 静的生成の設定
  output: 'standalone',
  // ビルド時のログを詳細に表示
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // 環境変数をクライアントに公開
  env: {
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
    CONTENTFUL_PREVIEW_ACCESS_TOKEN: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
    NEXT_PUBLIC_USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA,
  },
};

module.exports = nextConfig;
