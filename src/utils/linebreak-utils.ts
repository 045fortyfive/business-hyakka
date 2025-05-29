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

  // 2. 半角空白2つ + 改行 → <br>タグに変換
  processedContent = processedContent.replace(/  \n/g, '<br />\n');
  processedContent = processedContent.replace(/  $/gm, '<br />');

  // 3. 3つ以上の連続改行を2つの改行に制限（段落区切りとして）
  processedContent = processedContent.replace(/\n{3,}/g, '\n\n');

  // 4. 明示的な改行記法を処理
  // [br] → <br>
  processedContent = processedContent.replace(/\[br\]/gi, '<br />');
  
  // [break] → <br>
  processedContent = processedContent.replace(/\[break\]/gi, '<br />');
  
  // [linebreak] → <br>
  processedContent = processedContent.replace(/\[linebreak\]/gi, '<br />');

  // 5. HTMLの<br>タグを統一（自己終了タグに）
  processedContent = processedContent.replace(/<br\s*\/?>/gi, '<br />');

  return processedContent;
}

/**
 * 改行を強制的に反映させるためのプリプロセッサ
 * @param content 元のMDXコンテンツ
 * @returns 改行が強化されたMDXコンテンツ
 */
export function enhanceLineBreaks(content: string): string {
  if (!content || typeof content !== 'string') {
    return content;
  }

  let processedContent = normalizeLineBreaks(content);

  // 単一改行でも改行として扱いたい場合の処理
  // （ただし、リスト内やコードブロック内は除外）
  
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

  // リスト行ではない単一改行を <br> に変換
  // （ただし、既に段落区切り（空行）がある場合は除外）
  const lines = processedContent.split('\n');
  const processedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    const nextLine = lines[i + 1];
    const prevLine = lines[i - 1];
    
    processedLines.push(currentLine);
    
    // 次の行が存在し、現在の行が空でなく、次の行も空でない場合
    if (nextLine !== undefined && 
        currentLine.trim() !== '' && 
        nextLine.trim() !== '' &&
        !isListItem(currentLine) && 
        !isListItem(nextLine) &&
        !isHeading(currentLine) &&
        !isHeading(nextLine) &&
        !currentLine.includes('__CODE_BLOCK_') &&
        !nextLine.includes('__CODE_BLOCK_')) {
      
      // 既に<br>で終わっていない場合のみ追加
      if (!currentLine.trim().endsWith('<br />')) {
        processedLines[processedLines.length - 1] += '<br />';
      }
    }
  }
  
  processedContent = processedLines.join('\n');

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
