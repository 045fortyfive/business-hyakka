// MDXコンテンツから目次を生成するユーティリティ

export interface TocItem {
  id: string;
  title: string;
  level: number; // 1=H1, 2=H2, 3=H3, etc.
  children?: TocItem[];
}

/**
 * MDXコンテンツから見出しを抽出して目次を生成
 * @param mdxContent MDXコンテンツの文字列
 * @returns 目次アイテムの配列
 */
export function extractTocFromMdx(mdxContent: string): TocItem[] {
  console.log('extractTocFromMdx called with content length:', mdxContent?.length);
  
  if (!mdxContent || typeof mdxContent !== 'string') {
    console.log('extractTocFromMdx: Invalid content');
    return [];
  }

  // 見出しを抽出する正規表現（H2とH3のみ）
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: TocItem[] = [];
  let match;
  
  console.log('Starting heading extraction with regex:', headingRegex);

  while ((match = headingRegex.exec(mdxContent)) !== null) {
    try {
      const level = match[1]?.length; // #の数でレベルを判定
      const title = match[2]?.trim();

      // 値の検証
      if (!level || !title || typeof title !== 'string') {
        console.warn('Invalid heading match:', match);
        continue;
      }

      console.log('Found heading:', { level, title, fullMatch: match[0] });

      // IDを生成（日本語対応）
      const id = generateHeadingId(title);

      if (id) {
        headings.push({
          id,
          title,
          level
        });
      }
    } catch (error) {
      console.error('Error processing heading:', error, match);
    }
  }
  
  console.log('Extracted headings:', headings);
  const hierarchicalToc = buildTocHierarchy(headings);
  console.log('Built hierarchy:', hierarchicalToc);

  return hierarchicalToc;
}

import { generateHeadingId } from '@/utils/heading-id';

/**
 * 見出しテキストからIDを生成
 * @param title 見出しテキスト
 * @returns URL-safe なID
 * @deprecated generateHeadingId from '@/utils/heading-id' を使用してください
 */
function generateHeadingIdDeprecated(title: string): string {
  return generateHeadingId(title);
}

/**
 * フラットな見出しリストを階層構造に変換
 * @param headings フラットな見出しリスト
 * @returns 階層化された目次
 */
function buildTocHierarchy(headings: TocItem[]): TocItem[] {
  // 入力値の検証
  if (!Array.isArray(headings)) {
    console.warn('buildTocHierarchy: Invalid headings provided:', typeof headings);
    return [];
  }

  const result: TocItem[] = [];
  const stack: TocItem[] = [];

  try {
    for (const heading of headings) {
      // 見出しオブジェクトの検証
      if (!heading || typeof heading !== 'object' || !heading.id || !heading.title || !heading.level) {
        console.warn('buildTocHierarchy: Invalid heading object:', heading);
        continue;
      }

      // スタックから現在のレベル以上のアイテムを削除
      while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
        stack.pop();
      }

      if (stack.length === 0) {
        // トップレベル
        result.push(heading);
      } else {
        // 親要素の子として追加
        const parent = stack[stack.length - 1];
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(heading);
      }

      stack.push(heading);
    }
  } catch (error) {
    console.error('Error in buildTocHierarchy:', error);
    return [];
  }

  return result;
}

/**
 * 目次アイテムをフラットなリストに変換
 * @param tocItems 階層化された目次
 * @returns フラットな目次リスト
 */
export function flattenToc(tocItems: TocItem[]): TocItem[] {
  const result: TocItem[] = [];
  
  function flatten(items: TocItem[]) {
    for (const item of items) {
      result.push(item);
      if (item.children) {
        flatten(item.children);
      }
    }
  }
  
  flatten(tocItems);
  return result;
}

/**
 * MDXコンテンツに見出しIDを追加
 * @param mdxContent 元のMDXコンテンツ
 * @param tocItems 目次アイテム
 * @returns ID付きのMDXコンテンツ
 */
export function addHeadingIds(mdxContent: string, tocItems: TocItem[]): string {
  // 入力値の検証
  if (!mdxContent || typeof mdxContent !== 'string') {
    console.warn('addHeadingIds: Invalid mdxContent provided:', typeof mdxContent);
    return '';
  }

  if (!Array.isArray(tocItems)) {
    console.warn('addHeadingIds: Invalid tocItems provided:', typeof tocItems);
    return mdxContent;
  }

  // 現在は見出しIDの追加を無効化（MDXコンパイルエラーを回避）
  // 将来的にはより安全な実装に変更予定
  return mdxContent;

  // 以下は将来の実装用（現在はコメントアウト）
  /*
  let result = mdxContent;
  const flatToc = flattenToc(tocItems);

  for (const item of flatToc) {
    const headingPattern = new RegExp(`^(#{${item.level}})\\s+${escapeRegExp(item.title)}$`, 'gm');
    const replacement = `$1 ${item.title} {#${item.id}}`;
    result = result.replace(headingPattern, replacement);
  }

  return result;
  */
}

/**
 * 正規表現用の文字列エスケープ
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
