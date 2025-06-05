import { BLOCKS } from '@contentful/rich-text-types';

interface TocItem {
  id: string;
  text: string;
  level: number;
  children: TocItem[];
}

/**
 * リッチテキストコンテンツから目次を生成する
 * @param document Contentfulのリッチテキストドキュメント
 * @returns 目次アイテムの配列
 */
export function generateTableOfContents(document: any): TocItem[] {
  if (!document || !document.content) {
    return [];
  }

  const headings: TocItem[] = [];
  let currentId = 0;

  // ドキュメント内の見出しを抽出
  document.content.forEach((node: any) => {
    if (
      node.nodeType === BLOCKS.HEADING_1 ||
      node.nodeType === BLOCKS.HEADING_2 ||
      node.nodeType === BLOCKS.HEADING_3 ||
      node.nodeType === BLOCKS.HEADING_4
    ) {
      // 見出しのテキストを取得
      const text = node.content
        .map((content: any) => content.value || '')
        .join('');

      // 見出しレベルを取得（H1=1, H2=2, H3=3, H4=4）
      const level = parseInt(node.nodeType.slice(-1));

      // 一意のIDを生成
      const id = `heading-${currentId++}`;

      headings.push({
        id,
        text,
        level,
        children: [],
      });
    }
  });

  // 階層構造を構築
  const toc: TocItem[] = [];
  const stack: TocItem[][] = [toc];

  headings.forEach((heading) => {
    // 現在の見出しレベルに対応するスタックを確保
    while (stack.length < heading.level) {
      if (stack[stack.length - 1].length === 0) {
        // 親がない場合はダミーの親を作成
        const dummy: TocItem = {
          id: `dummy-${Math.random().toString(36).substring(2, 9)}`,
          text: '',
          level: stack.length,
          children: [],
        };
        stack[stack.length - 1].push(dummy);
        stack.push(dummy.children);
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
    stack[stack.length - 1].push(heading);
  });

  // ダミーの見出しを削除
  function cleanupDummies(items: TocItem[]): TocItem[] {
    return items
      .filter(item => item.text !== '')
      .map(item => ({
        ...item,
        children: cleanupDummies(item.children),
      }));
  }

  return cleanupDummies(toc);
}

/**
 * 目次アイテムからHTML要素のIDを生成
 * @param text 見出しテキスト
 * @param index インデックス
 * @param level 見出しレベル（1-6）
 * @returns HTML要素のID
 */
export function generateHeadingId(text: string, index: number, level: number = 1): string {
  // テキストをスラッグ化（日本語対応）
  const slug = text
    .toLowerCase()
    .replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s]/g, '')
    .replace(/\s+/g, '-');

  return `heading-${level}-${slug}`;
}

/**
 * Contentfulのリッチテキストから見出しを抽出する（改善版）
 * @param richTextDocument Contentfulのリッチテキストドキュメント
 * @returns 見出しの配列
 */
function extractHeadingsFromRichText(richTextDocument: any): { level: number; text: string; id: string }[] {
  const headings: { level: number; text: string; id: string }[] = [];
  let index = 0;

  function traverseContent(content: any[]) {
    if (!Array.isArray(content)) return;

    content.forEach((node: any) => {
      if (node.nodeType && node.nodeType.startsWith('heading-')) {
        const level = parseInt(node.nodeType.split('-')[1]);

        // より堅牢なテキスト抽出
        let text = '';
        if (node.content && Array.isArray(node.content)) {
          text = node.content
            .map((textNode: any) => {
              if (textNode.nodeType === 'text') {
                return textNode.value || '';
              }
              // マークアップされたテキストも処理
              if (textNode.content && Array.isArray(textNode.content)) {
                return textNode.content
                  .map((innerNode: any) => innerNode.value || '')
                  .join('');
              }
              return '';
            })
            .join('')
            .trim();
        }

        if (text) {
          const id = generateHeadingId(text, index++, level);
          headings.push({ level, text, id });
        }
      }

      // 再帰的に子要素を探索
      if (node.content && Array.isArray(node.content)) {
        traverseContent(node.content);
      }
    });
  }

  try {
    if (richTextDocument && richTextDocument.content && Array.isArray(richTextDocument.content)) {
      traverseContent(richTextDocument.content);
    }
  } catch (error) {
    console.error('Error extracting headings from rich text:', error);
  }

  return headings;
}

/**
 * Contentfulリッチテキストから目次を抽出する（メイン関数）
 * @param content Contentfulのリッチテキストドキュメントまたは文字列
 * @returns 目次アイテムの配列
 */
export function extractTocFromContentfulRichText(content: any): any {
  console.log('Extract TOC from Contentful rich text called with content type:', typeof content);

  // コンテンツがContentfulのリッチテキストオブジェクトの場合
  if (typeof content === 'object' && content !== null && content.content) {
    console.log('Content is a rich text object with content property');

    // Contentfulのリッチテキストから見出しを抽出
    const headings = extractHeadingsFromRichText(content);
    console.log(`Extracted ${headings.length} headings from rich text`);

    return {
      content: headings.map(heading => ({
        nodeType: `heading-${heading.level}`,
        content: [{ value: heading.text }],
        id: heading.id,
      })),
    };
  }

  // コンテンツが文字列の場合（JSON文字列の可能性もある）
  if (typeof content === 'string') {
    console.log('Content is a string, checking if it\'s JSON');

    // JSON文字列の場合はパースしてリッチテキストとして処理
    try {
      const parsedContent = JSON.parse(content);
      if (parsedContent && parsedContent.content) {
        console.log('Parsed JSON content, extracting headings from rich text');
        const headings = extractHeadingsFromRichText(parsedContent);
        console.log(`Extracted ${headings.length} headings from parsed JSON`);

        return {
          content: headings.map(heading => ({
            nodeType: `heading-${heading.level}`,
            content: [{ value: heading.text }],
            id: heading.id,
          })),
        };
      }
    } catch (e) {
      console.log('Content is not valid JSON, treating as plain text');
      return { content: [] };
    }
  }

  // その他の場合は空の目次を返す
  console.log('Content is not a recognized format:', content);
  return { content: [] };
}

/**
 * MDXコンテンツから目次を抽出する（後方互換性のため）
 * @param content MDXコンテンツまたはContentfulリッチテキスト
 * @returns 目次アイテムの配列
 */
export function extractTocFromMdx(content: any): any {
  console.log('Extract TOC from MDX called - redirecting to Contentful rich text extraction');

  // Contentfulリッチテキストの抽出を優先
  const richTextResult = extractTocFromContentfulRichText(content);
  if (richTextResult.content && richTextResult.content.length > 0) {
    return richTextResult;
  }

  // フォールバック: 従来のMDX処理
  if (typeof content === 'string') {
    console.log('Fallback: Extracting TOC from MDX content string');

    // 見出しを抽出する正規表現
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: { level: number; text: string; id: string }[] = [];

    let match;
    let index = 0;
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = generateHeadingId(text, index++, level);

      headings.push({ level, text, id });
    }

    // Contentfulの形式に合わせたドキュメントを作成
    const document = {
      content: headings.map(heading => ({
        nodeType: `heading-${heading.level}`,
        content: [{ value: heading.text }],
        id: heading.id,
      })),
    };

    console.log(`Generated TOC with ${headings.length} headings from MDX`);
    return document;
  }

  // その他の場合は空の目次を返す
  console.log('No valid content found for TOC generation');
  return { content: [] };
}
