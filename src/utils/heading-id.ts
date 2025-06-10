// 見出しテキストからIDを生成する共通ユーティリティ

/**
 * 見出しテキストからIDを生成
 * @param title 見出しテキスト
 * @returns URL-safe なID
 */
export function generateHeadingId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '') // 日本語文字と英数字のみ残す
    .replace(/\s+/g, '-') // スペースをハイフンに
    .replace(/^-+|-+$/g, '') // 先頭末尾のハイフンを削除
    .substring(0, 50); // 長すぎる場合は切り詰め
}
