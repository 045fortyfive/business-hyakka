/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
    // 外部ドメインからの画像を許可
    domains: ['images.ctfassets.net', 'njazjixymhdfjiag.public.blob.vercel-storage.com'],
    // 画像の最適化を無効化（ローカル画像をそのまま使用）
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
  // サーバーコンポーネントのキャッシュを無効化
  serverExternalPackages: ['contentful'],
  
  // セキュリティヘッダーの設定（Contentful Live Preview対応）
  async headers() {
    return [
      {
        // 全ページに適用
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // ContentfulのLive Preview用にSAMEORIGINに変更
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://app.contentful.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "media-src 'self' https://downloads.ctfassets.net https://images.ctfassets.net https://*.ctfassets.net",
              "connect-src 'self' https://cdn.contentful.com https://api.contentful.com https://preview.contentful.com https://app.contentful.com https://www.google-analytics.com https://www.googletagmanager.com",
              "frame-ancestors 'self' https://app.contentful.com https://*.contentful.com",
              "frame-src 'self' https://app.contentful.com https://*.contentful.com https://www.youtube.com https://www.youtube-nocookie.com https://www.googletagmanager.com",
              "object-src 'none'",
              "base-uri 'self'",
            ].join('; '),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // プレビューページ専用のより緩い設定
        source: '/api/preview',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL', // プレビューAPI用
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://app.contentful.com',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
      {
        // プレビューモード時のコンテンツページ用
        source: '/(articles|videos|audios|categories|mdx-articles)/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL', // ContentfulのLive Preview用
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://app.contentful.com https://*.contentful.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "media-src 'self' https://downloads.ctfassets.net https://images.ctfassets.net https://*.ctfassets.net",
              "connect-src 'self' https://cdn.contentful.com https://api.contentful.com https://preview.contentful.com https://app.contentful.com https://*.contentful.com",
              "frame-ancestors 'self' https://app.contentful.com https://*.contentful.com",
              "frame-src 'self' https://app.contentful.com https://*.contentful.com https://www.youtube.com https://www.youtube-nocookie.com",
              "object-src 'none'",
              "base-uri 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
