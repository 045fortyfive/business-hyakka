/**
 * 見出しID生成とTOC処理のユーティリティ関数
 */

// 日本語文字を含むテキストをスラッグ化するための関数
function japaneseSlugify(text: string): string {
  return text
    .toLowerCase()
    // 全角英数字を半角に変換
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (char) => {
      return String.fromCharCode(char.charCodeAt(0) - 0xFEE0);
    })
    // 特殊文字を除去（日本語文字は保持）
    .replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s-]/g, '')
    // 連続する空白をハイフンに変換
    .replace(/\s+/g, '-')
    // 連続するハイフンを1つに
    .replace(/-+/g, '-')
    // 前後のハイフンを除去
    .replace(/^-+|-+$/g, '');
}

/**
 * 見出しテキストから一意のIDを生成
 * @param text 見出しテキスト
 * @param index インデックス（重複回避用）
 * @param existingIds 既存のID配列（重複チェック用）
 * @returns 一意のID
 */
export function generateHeadingId(text: string, index: number = 0, existingIds: string[] = []): string {
  if (!text) return `heading-${index}`;

  // 基本的なスラッグを生成
  let baseSlug = japaneseSlugify(text);
  
  // 空の場合はデフォルト
  if (!baseSlug) {
    baseSlug = `heading-${index}`;
  }

  // 重複チェックと一意化
  let finalId = baseSlug;
  let counter = 1;
  
  while (existingIds.includes(finalId)) {
    finalId = `${baseSlug}-${counter}`;
    counter++;
  }

  return finalId;
}

/**
 * 見出し情報の型定義
 */
export interface HeadingInfo {
  id: string;
  text: string;
  level: number;
  element?: Element;
}

/**
 * TOCアイテムの型定義
 */
export interface TocItem {
  id: string;
  text: string;
  level: number;
  children: TocItem[];
}

/**
 * Markdown/MDXテキストから見出しを抽出
 * @param content Markdown/MDXコンテンツ
 * @returns 見出し情報の配列
 */
function extractHeadingsFromMarkdown(content: string): HeadingInfo[] {
  const headings: HeadingInfo[] = [];
  const existingIds: string[] = [];
  
  // 見出しを抽出する正規表現
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;
  let index = 0;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    
    if (text) {
      const id = generateHeadingId(text, index++, existingIds);
      existingIds.push(id);
      
      headings.push({
        id,
        text,
        level
      });
    }
  }

  return headings;
}

/**
 * Contentfulのリッチテキストドキュメントから見出しを抽出
 * @param document Contentfulのリッチテキストドキュメント
 * @returns 見出し情報の配列
 */
function extractHeadingsFromRichText(document: any): HeadingInfo[] {
  const headings: HeadingInfo[] = [];
  const existingIds: string[] = [];
  
  if (!document || !document.content || !Array.isArray(document.content)) {
    return headings;
  }

  let index = 0;

  function traverseContent(content: any[]) {
    content.forEach((node: any) => {
      // 見出しノードをチェック
      if (node.nodeType && node.nodeType.startsWith('heading-')) {
        const level = parseInt(node.nodeType.replace('heading-', ''));
        const text = node.content
          ?.map((textNode: any) => textNode.value || '')
          .join('')
          .trim();

        if (text && level >= 1 && level <= 6) {
          const id = generateHeadingId(text, index++, existingIds);
          existingIds.push(id);
          
          headings.push({
            id,
            text,
            level
          });
        }
      }

      // 再帰的に子要素を探索
      if (node.content && Array.isArray(node.content)) {
        traverseContent(node.content);
      }
    });
  }

  traverseContent(document.content);
  return headings;
}

/**
 * DOM要素から見出しを抽出
 * @param container コンテナ要素
 * @returns 見出し情報の配列
 */
export function extractHeadingsFromDom(container: Element): HeadingInfo[] {
  const headings: HeadingInfo[] = [];
  const existingIds: string[] = [];
  
  const headingSelectors = 'h1, h2, h3, h4, h5, h6';
  const headingElements = container.querySelectorAll(headingSelectors);
  
  headingElements.forEach((element, index) => {
    const tagName = element.tagName.toLowerCase();
    const level = parseInt(tagName.charAt(1));
    const text = element.textContent?.trim() || '';
    
    if (text) {
      // 既存のIDがある場合はそれを使用、なければ生成
      let id = element.id;
      if (!id) {
        id = generateHeadingId(text, index, existingIds);
        element.id = id; // DOM要素にIDを設定
      }
      
      existingIds.push(id);
      
      headings.push({
        id,
        text,
        level,
        element
      });
    }
  });
  
  return headings;
}

/**
 * 見出し配列から階層構造のTOCを生成
 * @param headings 見出し情報の配列
 * @returns 階層構造のTOCアイテム配列
 */
export function buildTocHierarchy(headings: HeadingInfo[]): TocItem[] {
  if (headings.length === 0) return [];

  const toc: TocItem[] = [];
  const stack: TocItem[][] = [toc];

  headings.forEach((heading) => {
    const tocItem: TocItem = {
      id: heading.id,
      text: heading.text,
      level: heading.level,
      children: []
    };

    // 現在の見出しレベルに対応するスタックを確保
    while (stack.length < heading.level) {
      if (stack[stack.length - 1].length === 0) {
        // 親がない場合はルートレベルに追加
        stack[0].push(tocItem);
        return;
      } else {
        // 最後の項目の子を次のレベルとして使用
        const lastItem = stack[stack.length - 1][stack[stack.length - 1].length - 1];
        stack.push(lastItem.children);
      }
    }

    // 現在のレベルより深いスタックを削除
    while (stack.length > heading.level) {
      stack.pop();
    }

    // 現在のレベルに見出しを追加
    stack[stack.length - 1].push(tocItem);
  });

  return toc;
}

/**
 * 統一されたTOC抽出関数
 * @param content 各種形式のコンテンツ
 * @returns TOCアイテムの配列
 */
export function extractTocFromContent(content: any): TocItem[] {
  console.log('Extracting TOC from content, type:', typeof content);

  // 1. 文字列の場合（Markdown/MDXまたはJSON文字列）
  if (typeof content === 'string') {
    // JSON文字列かどうかチェック
    try {
      const parsedContent = JSON.parse(content);
      if (parsedContent && typeof parsedContent === 'object') {
        console.log('Content is JSON string, processing as rich text');
        const headings = extractHeadingsFromRichText(parsedContent);
        return buildTocHierarchy(headings);
      }
    } catch (e) {
      // JSON でない場合はMarkdownとして処理
      console.log('Content is markdown string');
      const headings = extractHeadingsFromMarkdown(content);
      return buildTocHierarchy(headings);
    }
  }

  // 2. Contentfulのリッチテキストオブジェクトの場合
  if (content && typeof content === 'object' && content.content) {
    console.log('Content is rich text object');
    const headings = extractHeadingsFromRichText(content);
    return buildTocHierarchy(headings);
  }

  // 3. DOM要素の場合
  if (content instanceof Element) {
    console.log('Content is DOM element');
    const headings = extractHeadingsFromDom(content);
    return buildTocHierarchy(headings);
  }

  console.log('No valid content format detected, returning empty TOC');
  return [];
}

/**
 * レガシー関数（後方互換性のため）
 * @deprecated extractTocFromContent を使用してください
 */
export function extractTocFromMdx(content: any): any {
  const tocItems = extractTocFromContent(content);
  
  // 既存の形式に合わせてラップ
  return {
    content: tocItems.map(item => ({
      nodeType: `heading-${item.level}`,
      content: [{ value: item.text }],
      id: item.id
    }))
  };
}
