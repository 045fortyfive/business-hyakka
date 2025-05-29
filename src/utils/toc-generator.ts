import { BLOCKS } from '@contentful/rich-text-types';
import { 
  extractTocFromContent, 
  buildTocHierarchy, 
  generateHeadingId, 
  type TocItem, 
  type HeadingInfo 
} from './heading-utils';

// 後方互換性のためのインターフェース
interface LegacyTocItem {
  id: string;
  text: string;
  level: number;
  children: LegacyTocItem[];
}

/**
 * リッチテキストコンテンツから目次を生成する
 * @param document Contentfulのリッチテキストドキュメント
 * @returns 目次アイテムの配列
 */
export function generateTableOfContents(document: any): TocItem[] {
  console.log('generateTableOfContents called with:', typeof document);
  
  // 新しい統一されたTOC抽出関数を使用
  return extractTocFromContent(document);
}

/**
 * 目次アイテムからHTML要素のIDを生成
 * @param text 見出しテキスト
 * @param index インデックス
 * @returns HTML要素のID
 */
export function generateHeadingIdLegacy(text: string, index: number): string {
  return generateHeadingId(text, index);
}

/**
 * MDXコンテンツから目次を抽出する
 * @param content MDXコンテンツまたはレンダリング済みのMDXコンテンツ
 * @returns 目次アイテムの配列
 */
export function extractTocFromMdx(content: any): any {
  console.log('extractTocFromMdx called with content type:', typeof content);
  
  // 新しい統一されたTOC抽出関数を使用
  const tocItems = extractTocFromContent(content);
  
  // 既存の形式に合わせてラップ（後方互換性のため）
  return {
    content: tocItems.map(item => ({
      nodeType: `heading-${item.level}`,
      content: [{ value: item.text }],
      id: item.id
    }))
  };
}

// 後方互換性のため、TocItemをエクスポート
export { type TocItem };
