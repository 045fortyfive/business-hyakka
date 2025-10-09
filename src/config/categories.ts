/**
 * カテゴリー表示設定
 * 表示/非表示を切り替えるための設定ファイル
 */

export interface CategoryDisplayConfig {
  /** 非表示にするカテゴリ名のリスト */
  hiddenCategories: string[];
  /** 設定の説明 */
  description?: string;
}

/**
 * カテゴリー表示設定
 * マネジメントスキルを一時的に非表示にする設定
 */
export const categoryDisplayConfig: CategoryDisplayConfig = {
  hiddenCategories: [
    'マネジメントスキル',
    'マネジメント',
    // 必要に応じて他のカテゴリも追加可能
  ],
  description: 'マネジメントスキルカテゴリを一時的に非表示にしています。記事がゼロのため。',
};

/**
 * カテゴリーが表示対象かどうかを判定する関数
 * @param categoryName カテゴリ名
 * @returns 表示対象の場合true
 */
export function isCategoryVisible(categoryName: string): boolean {
  return !categoryDisplayConfig.hiddenCategories.includes(categoryName);
}

/**
 * カテゴリーリストをフィルタリングする関数
 * @param categories カテゴリーリスト
 * @returns フィルタリングされたカテゴリーリスト
 */
export function filterVisibleCategories<T extends { fields: { name: string } }>(
  categories: T[]
): T[] {
  return categories.filter((category) => 
    isCategoryVisible(category.fields.name)
  );
}
