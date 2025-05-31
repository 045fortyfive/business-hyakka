/**
 * MDXコンテンツの改行処理ユーティリティ
 */

/**
 * MDXコンテンツの改行を正規化する
 * @param content 元のMDXコンテンツ
 * @returns 改行が正規化されたMDXコンテンツ
 */
export function normalizeLineBreaks(content: string): string {
  if (!content || typeof content !== 'string') {
    return content;
  }

  let processedContent = content;

  // 1. Windows改行（\r\n）をUnix改行（\n）に統一
  processedContent = processedContent.replace(/\r\n/g, '\n');
  processedContent = processedContent.replace(/\r/g, '\n');

  // 2. 半角空白2つ + 改行 → <br>タグに変換（Markdown標準）
  processedContent = processedContent.replace(/  \n/g, '<br />\n');
  processedContent = processedContent.replace(/  $/gm, '<br />');

  // 3. 連続改行の正規化
  // 3つ以上の連続改行を2つの改行に制限（段落区切りとして）
  processedContent = processedContent.replace(/\n{3,}/g, '\n\n');
  
  // 4. 明示的な改行記法を処理（小文字のbrタグのみサポート）
  // [br] → <br />
  processedContent = processedContent.replace(/\[br\]/gi, '<br />');
  
  // [break] → <br />
  processedContent = processedContent.replace(/\[break\]/gi, '<br />');
  
  // [linebreak] → <br />
  processedContent = processedContent.replace(/\[linebreak\]/gi, '<br />');

  // 5. HTMLの<br>タグを統一（自己終了タグに、小文字のみ）
  processedContent = processedContent.replace(/<br\s*\/?>/gi, '<br />');
  
  // 6. 大文字の<Br />を小文字の<br />に変換
  processedContent = processedContent.replace(/<Br\s*\/?>/g, '<br />');

  return processedContent;
}

/**
 * 改行を強化して反映させるためのプリプロセッサ
 * Markdown標準の改行処理に準拠し、remark-breaksと併用する設計
 * @param content 元のMDXコンテンツ
 * @returns 改行が強化されたMDXコンテンツ
 */
export function enhanceLineBreaks(content: string): string {
  if (!content || typeof content !== 'string') {
    return content;
  }

  let processedContent = normalizeLineBreaks(content);

  // remark-breaksプラグインと組み合わせて使用するため、
  // ここでは最低限の処理のみ行い、主な改行処理はremark-breaksに委ねる
  
  // コードブロックとインラインコードを一時的に保護
  const codeBlocks: string[] = [];
  const inlineCodes: string[] = [];
  
  // コードブロックを保護
  processedContent = processedContent.replace(/```[\s\S]*?```/g, (match) => {
    const index = codeBlocks.length;
    codeBlocks.push(match);
    return `__CODE_BLOCK_${index}__`;
  });
  
  // インラインコードを保護
  processedContent = processedContent.replace(/`[^`]+`/g, (match) => {
    const index = inlineCodes.length;
    inlineCodes.push(match);
    return `__INLINE_CODE_${index}__`;
  });

  // 段落区切り（2回連続改行）の処理を強化
  // 段落間に適切な空白を確保
  processedContent = processedContent.replace(/\n\n/g, '\n\n');
  
  // 見出しの後には自動的に改行を追加（必要に応じて）
  processedContent = processedContent.replace(/(^#{1,6}\s+.*$)/gm, '$1\n');
  
  // 保護したコードを復元
  codeBlocks.forEach((block, index) => {
    processedContent = processedContent.replace(`__CODE_BLOCK_${index}__`, block);
  });
  
  inlineCodes.forEach((code, index) => {
    processedContent = processedContent.replace(`__INLINE_CODE_${index}__`, code);
  });

  return processedContent;
}

/**
 * 行がリストアイテムかどうかを判定
 */
function isListItem(line: string): boolean {
  const trimmed = line.trim();
  return /^[-*+]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed);
}

/**
 * 行が見出しかどうかを判定
 */
function isHeading(line: string): boolean {
  const trimmed = line.trim();
  return /^#{1,6}\s/.test(trimmed);
}

/**
 * 改行のMDXコンテンツを検証してデバッグ情報を返す
 * @param content 検証するMDXコンテンツ
 * @returns デバッグ情報
 */
export function debugLineBreaks(content: string): {
  originalLineCount: number;
  processedLineCount: number;
  brTagCount: number;
  doubleNewlineCount: number;
  hasCodeBlocks: boolean;
} {
  if (!content) {
    return {
      originalLineCount: 0,
      processedLineCount: 0,
      brTagCount: 0,
      doubleNewlineCount: 0,
      hasCodeBlocks: false,
    };
  }

  const processedContent = enhanceLineBreaks(content);
  
  return {
    originalLineCount: content.split('\n').length,
    processedLineCount: processedContent.split('\n').length,
    brTagCount: (processedContent.match(/<br\s*\/?>/gi) || []).length,
    doubleNewlineCount: (processedContent.match(/\n\n/g) || []).length,
    hasCodeBlocks: /```[\s\S]*?```/.test(content),
  };
}

/**
 * Contentful特有の改行処理
 * @param content Contentfulから取得したMDXコンテンツ
 * @returns 処理されたコンテンツ
 */
export function processContentfulLineBreaks(content: string): string {
  if (!content || typeof content !== 'string') {
    return content;
  }

  // Contentfulのリッチテキストエディタで入力された改行を適切に処理
  let processedContent = content;

  // Contentfulの段落タグを改行に変換（必要に応じて）
  // processedContent = processedContent.replace(/<\/p>\s*<p>/gi, '</p>\n\n<p>');

  // 通常の改行処理を適用
  processedContent = enhanceLineBreaks(processedContent);

  return processedContent;
}
