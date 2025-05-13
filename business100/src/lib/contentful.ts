import { createClient } from 'contentful';

// Contentfulクライアントの型定義
export type ContentfulClient = ReturnType<typeof createClient>;

// 環境変数からContentfulの設定を取得
const contentfulConfig = {
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
  previewAccessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN || '',
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
};

// Contentfulクライアントの作成
export const getContentfulClient = (preview = false): ContentfulClient => {
  const { space, accessToken, previewAccessToken, environment } = contentfulConfig;

  // 環境変数の値をログに出力（デバッグ用）
  console.log('=== Contentful設定 ===');
  console.log('Space ID:', space);
  console.log('Access Token:', accessToken ? `設定済み (${accessToken.substring(0, 5)}...)` : '未設定');
  console.log('Preview Access Token:', previewAccessToken ? `設定済み (${previewAccessToken.substring(0, 5)}...)` : '未設定');
  console.log('Environment:', environment);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('=====================');

  // 必要な設定が揃っているか確認
  if (!space || !(preview ? previewAccessToken : accessToken)) {
    console.error('Contentfulの設定が不完全です。環境変数を確認してください。');

    // モックデータを使用するかどうかを確認
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
    console.log('モックデータを使用:', useMockData ? 'はい' : 'いいえ');

    // 開発環境では警告を表示するだけにし、本番環境ではエラーを投げる
    if (process.env.NODE_ENV === 'production' && !useMockData) {
      throw new Error('Contentfulの設定が不完全です。環境変数を確認してください。');
    }
  }

  try {
    // Contentfulクライアントを作成して返す
    const client = createClient({
      space,
      accessToken: preview ? previewAccessToken : accessToken,
      environment,
      host: preview ? 'preview.contentful.com' : 'cdn.contentful.com',
    });

    console.log(`Contentfulクライアント作成: ${preview ? 'プレビュー' : '公開'}モード`);
    return client;
  } catch (error) {
    console.error('Contentfulクライアントの作成に失敗しました:', error);
    throw error;
  }
};

// デフォルトのContentfulクライアントを取得
export const contentfulClient = getContentfulClient();

// プレビュー用のContentfulクライアントを取得
export const previewContentfulClient = getContentfulClient(true);

// Contentfulのコンテンツタイプ定義
export const CONTENT_TYPE = {
  CONTENT: 'content',
  CATEGORY: 'category',
  TAG: 'tag',
  AUTHOR: 'author',
};

// コンテンツタイプの定義をログに出力
console.log('Contentfulコンテンツタイプ定義:');
console.log(JSON.stringify(CONTENT_TYPE, null, 2));
