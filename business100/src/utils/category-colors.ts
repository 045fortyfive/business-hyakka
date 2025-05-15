// カテゴリーとグラデーションカラーのマッピング

// カテゴリー名（Contentfulのカテゴリー名と一致させる）
export type CategoryName =
  | '基本ビジネススキル'
  | '思考法'
  | 'マネジメントスキル'
  | '業務改善'
  | string; // その他のカテゴリー用

// グラデーションカラー名（square-card.tsxのgradientColorと一致させる）
export type GradientColorName =
  | 'media-blue'
  | 'media-purple'
  | 'media-teal'
  | 'tangerine-coral'
  | string; // その他のカラー用

// カテゴリーとカラーのマッピング
export const categoryColorMap: Record<CategoryName, GradientColorName> = {
  '基本ビジネススキル': 'media-blue',
  '思考法': 'media-purple',
  'マネジメントスキル': 'media-teal',
  '業務改善': 'tangerine-coral',
};

// デフォルトのカラー（マッピングにないカテゴリー用）
export const defaultGradientColor: GradientColorName = 'media-blue';

/**
 * カテゴリー名からグラデーションカラーを取得する関数
 * @param categoryName カテゴリー名
 * @returns グラデーションカラー名
 */
export function getGradientColorByCategory(categoryName: string): GradientColorName {
  // カテゴリー名が空の場合はデフォルトカラーを返す
  if (!categoryName) {
    return defaultGradientColor;
  }

  // マッピングにカテゴリーが存在する場合はそのカラーを返す
  if (categoryName in categoryColorMap) {
    return categoryColorMap[categoryName as CategoryName];
  }

  // マッピングにないカテゴリーの場合はデフォルトカラーを返す
  return defaultGradientColor;
}

// カテゴリーの説明
export const categoryDescriptions: Record<CategoryName, string> = {
  '基本ビジネススキル': 'ビジネスパーソンとして必要な基本的なスキルや知識を学びます。ビジネスマナー、時間管理、問題解決など、仕事の基礎となるスキルを網羅しています。',
  '思考法': '論理的思考やクリティカルシンキングなど、ビジネスにおける思考法を学びます。問題解決や意思決定に役立つ思考フレームワークを習得します。',
  'マネジメントスキル': 'チームを率いるためのマネジメントスキルとリーダーシップを学びます。目標設定、人材育成、チームビルディングなど、リーダーに必要なスキルを習得します。',
  '業務改善': '業務プロセスの改善や効率化を図るスキルを学びます。データ分析、プロジェクト管理、イノベーション思考など、ビジネスを成長させるスキルを身につけます。',
};
