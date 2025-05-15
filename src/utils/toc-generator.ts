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
 * @returns HTML要素のID
 */
export function generateHeadingId(text: string, index: number): string {
  // テキストをスラッグ化（日本語対応）
  const slug = text
    .toLowerCase()
    .replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s]/g, '')
    .replace(/\s+/g, '-');

  return `heading-${slug}-${index}`;
}

/**
 * MDXコンテンツから目次を抽出する
 * @param content MDXコンテンツ
 * @returns 目次アイテムの配列
 */
export function extractTocFromMdx(content: string): any {
  // 見出しを抽出する正規表現
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: { level: number; text: string; id: string }[] = [];

  let match;
  let index = 0;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = generateHeadingId(text, index++);

    headings.push({ level, text, id });
  }

  // Contentfulの形式に合わせたドキュメントを作成
  const document = {
    content: headings.map(heading => ({
      nodeType: `heading-${heading.level}`,
      content: [{ value: heading.text }],
    })),
  };

  return document;
}
