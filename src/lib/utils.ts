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
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
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
  if (!url) return null;

  // YouTube URLからIDを抽出する正規表現
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return (match && match[2].length === 11) ? match[2] : null;
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
