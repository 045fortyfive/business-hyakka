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
    // 画像の最適化を無効化（デバッグ用）
    unoptimized: true,
  },
  eslint: {
    // 本番ビルド時にESLintチェックを無効にする
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 本番ビルド時にTypeScriptチェックを無効にする
    ignoreBuildErrors: true,
  },
  // 静的生成の設定を変更（standaloneからserverに変更）
  output: 'standalone',
  // ビルド時のログを詳細に表示
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // 環境変数をクライアントに公開
  env: {
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID || 'vxy009lryi3x',
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN || 'qLylkb9h2iMqBUPBh6JXy3Wk5WQWHdJ91LaI8SKkb60',
    CONTENTFUL_PREVIEW_ACCESS_TOKEN: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN || 'MEaR0N8DIyemaORDO4XK33a7JZs5TB2QYdyC8VF7MfY',
    NEXT_PUBLIC_USE_MOCK_DATA: 'false', // モックデータは使用しない
  },
  // 実験的な機能を有効化
  experimental: {
    // サーバーコンポーネントのキャッシュを無効化
    serverComponentsExternalPackages: ['contentful'],
    // ビルド時のキャッシュを無効化
    disableOptimizedLoading: true,
  },
};

module.exports = nextConfig;
