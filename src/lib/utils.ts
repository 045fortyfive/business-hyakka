import { Asset } from 'contentful';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * クラス名を結合するユーティリティ関数
 * @param inputs クラス名の配列
 * @returns 結合されたクラス名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 日付文字列をフォーマットする
 * @param dateString ISO形式の日付文字列
 * @returns フォーマットされた日付文字列（例: 2023年4月1日）
 */
export function formatDate(dateString: string): string {
  if (!dateString) {
    return '日付未設定';
  }

  const date = new Date(dateString);

  // 無効な日付の場合
  if (isNaN(date.getTime())) {
    return '日付未設定';
  }

  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Unsplash画像URLを生成する
 * @param category カテゴリ名
 * @param width 画像の幅
 * @param height 画像の高さ
 * @returns Unsplash画像URL
 */
export function generateUnsplashImageUrl(category: string, width: number, height: number): string {
  // カテゴリに応じたキーワードを設定
  let keyword = 'business';

  switch (category) {
    case '基礎ビジネススキル':
      keyword = 'business,office,professional';
      break;
    case '思考法':
      keyword = 'thinking,strategy,planning';
      break;
    case '業務改善':
      keyword = 'improvement,efficiency,workflow';
      break;
    case 'マネジメントスキル':
      keyword = 'management,leadership,team';
      break;
    default:
      keyword = 'business,professional';
  }

  return `https://source.unsplash.com/${width}x${height}/?${keyword}`;
}

/**
 * Contentfulの画像アセットからNext.js Imageコンポーネント用のプロパティを抽出
 * @param asset Contentfulの画像アセット
 * @returns 画像のURL、幅、高さ、代替テキスト
 */
export function getImageProps(asset?: Asset) {
  if (!asset || !asset.fields || !asset.fields.file) {
    return null;
  }

  const { file, title } = asset.fields;
  const url = `https:${file.url}`;
  const { width, height } = file.details.image || { width: 800, height: 600 };

  return {
    url,
    width,
    height,
    alt: title || '',
  };
}

/**
 * 文字列を指定された長さに切り詰める
 * @param text 元の文字列
 * @param maxLength 最大長
 * @returns 切り詰められた文字列
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}

/**
 * Contentfulのリッチテキストから平文テキストを抽出
 * @param richText Contentfulのリッチテキストオブジェクト
 * @returns 平文テキスト
 */
export function extractPlainTextFromRichText(richText: any): string {
  if (!richText || !richText.content) {
    return '';
  }

  let text = '';

  // コンテンツノードを再帰的に処理
  const processNode = (node: any) => {
    // テキストノードの場合
    if (node.nodeType === 'text') {
      text += node.value;
    }

    // 子ノードがある場合は再帰的に処理
    if (node.content) {
      node.content.forEach(processNode);
    }
  };

  richText.content.forEach(processNode);

  return text;
}

/**
 * URLからYouTube動画IDを抽出
 * @param url YouTube動画URL
 * @returns YouTube動画ID
 */
export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== 'string') {
    console.warn('Invalid URL provided to extractYouTubeId:', url);
    return null;
  }

  // URLをトリムして正規化
  const cleanUrl = url.trim();

  // 複数のYouTube URLパターンに対応
  const patterns = [
    // 標準的なwatch URL
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // 短縮URL
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    // 埋め込みURL
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // モバイルURL
    /(?:m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // その他のパラメータ付きURL
    /(?:youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match && match[1] && match[1].length === 11) {
      console.log('Successfully extracted YouTube ID:', match[1], 'from URL:', cleanUrl);
      return match[1];
    }
  }

  console.warn('Could not extract YouTube ID from URL:', cleanUrl);
  return null;
}

/**
 * 検索クエリをサニタイズする
 * @param query 検索クエリ
 * @returns サニタイズされた検索クエリ
 */
export function sanitizeSearchQuery(query: string): string {
  // 基本的なサニタイズ処理
  // 特殊文字をエスケープし、長すぎるクエリを切り詰める
  return query
    .trim()
    .replace(/[<>]/g, '') // HTMLタグに使われる文字を削除
    .slice(0, 100); // 最大100文字に制限
}
