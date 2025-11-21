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
      const text = extractTextFromHeadingNode(node); // Use centralized text extraction

      // 見出しレベルを取得（H1=1, H2=2, H3=3, H4=4）
      const level = parseInt(node.nodeType.slice(-1));

      // 一意のIDを生成 (RichTextRendererと合わせる)
      // const id = `heading-${currentId++}`; // 古いID生成方法
      const tocItemIndex = currentId++; // Use currentId for the index in ToC generation context
      const id = generateHeadingId(text, tocItemIndex);
      console.log('[toc-generator] Generated ToC item ID:', id, 'for text:', text, 'with index:', tocItemIndex);

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

  // ダミーの見出しを削除し、子要素を昇格させる
  function cleanupDummies(items: TocItem[]): TocItem[] {
    return items.flatMap(item => {
      if (item.text !== '') {
        // テキストを持つ有効なアイテムは保持し、子要素も再帰的に処理
        return [{
          ...item,
          children: cleanupDummies(item.children),
        }];
      } else {
        // テキストがないダミーアイテムは削除し、その子要素を現在のレベルに昇格させる
        // 子要素もダミー要素を含む可能性があるため、再帰的に処理
        return cleanupDummies(item.children);
      }
    });
  }

  return cleanupDummies(toc);
}

/**
 * Extracts the text content from a Contentful heading node.
 * @param node The Contentful heading node.
 * @returns The concatenated text content, or an empty string if node is invalid.
 */
export function extractTextFromHeadingNode(node: any): string {
  if (node && node.content && Array.isArray(node.content)) {
    return node.content.map((contentNode: any) => contentNode.value || '').join('');
  }
  return '';
}

/**
 * 目次アイテムからHTML要素のIDを生成
 * @param text 見出しテキスト
 * @param index インデックス
 * @returns HTML要素のID
 */
export function generateHeadingId(text: string, index: number): string {
  // テキストをスラッグ化（日本語対応）
  const slug = text
    .toLowerCase()
    .replace(/[^\w぀-ゟ゠-ヿ一-龯\s]/g, '') // Changed regex to match prompt's description
    .replace(/\s+/g, '-');
  
  const generatedId = `heading-${slug}-${index}`;
  // The console.log here will show IDs generated for RichTextRenderer context AND for ToC items,
  // as generateTableOfContents also calls this function.
  console.log('[toc-generator] generateHeadingId CALLED. Text:', text, 'Index:', index, 'Resulting ID:', generatedId);
  return generatedId;
}

/**
 * Alias for generateTableOfContents to maintain compatibility with components
 * that may be calling this older or alternative name.
 * @param document Contentful rich text document
 * @returns Array of TocItem
 */
export function extractTocFromContentfulRichText(document: any): TocItem[] {
  console.warn('[toc-generator] DEPRECATION WARNING: extractTocFromContentfulRichText is deprecated. Please use generateTableOfContents instead.');
  return generateTableOfContents(document);
}
