// 画像関連のユーティリティ関数

// カテゴリに応じたUnsplash検索キーワードのマッピング
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  '基礎ビジネススキル': ['business', 'office', 'professional', 'meeting', 'teamwork'],
  '思考法': ['thinking', 'brain', 'strategy', 'planning', 'innovation'],
  'マネジメントスキル': ['leadership', 'management', 'team', 'organization', 'strategy'],
  '業務改善': ['improvement', 'efficiency', 'process', 'optimization', 'workflow'],
  'コミュニケーション': ['communication', 'presentation', 'meeting', 'discussion', 'collaboration'],
  'プレゼンテーション': ['presentation', 'speaking', 'audience', 'stage', 'conference'],
  'ビジネススキル': ['business', 'professional', 'success', 'growth', 'development'],
  'デフォルト': ['business', 'professional', 'modern', 'clean', 'minimal']
};

// カテゴリに応じた高品質なUnsplash画像ID（固定画像で一貫性を保つ）
const CATEGORY_UNSPLASH_IDS: Record<string, string[]> = {
  '基礎ビジネススキル': [
    'ZVprbBmT8QA', // ビジネスミーティング
    'Oalh2MojUuk', // オフィス環境
    'KdeqA3aTnBY', // チームワーク
    'wD1LdJn1-yw', // プロフェッショナル
    'npxXWgQ33ZQ'  // ビジネス戦略
  ],
  '思考法': [
    'LaK153ghdig', // 思考・アイデア
    'JKUTrJ4vK00', // 戦略的思考
    'xj8qrWvuOEs', // イノベーション
    'Oaqk7qqNh_c', // 創造性
    'Q1p7bh3SHj8'  // 問題解決
  ],
  'マネジメントスキル': [
    'QLqNalPe0RA', // リーダーシップ
    'g1Kr4Ozfoac', // チーム管理
    'QckxruozjRg', // 組織運営
    'Hcfwew744z4', // 戦略的管理
    'JaoVGh5aJ3E'  // プロジェクト管理
  ],
  '業務改善': [
    'qwtCeJ5cLYs', // 効率化
    'JVSgcV8_vb4', // プロセス改善
    'ZiQkhI7417A', // 最適化
    'xkBaqlcqeb4', // ワークフロー
    'Q59HmzK38eQ'  // 生産性向上
  ],
  'コミュニケーション': [
    'oCdVtGFeDC0', // コミュニケーション
    'bzdhc5b3Bxs', // プレゼンテーション
    'QckxruozjRg', // ディスカッション
    'g1Kr4Ozfoac', // コラボレーション
    'Hcfwew744z4'  // チームコミュニケーション
  ],
  'プレゼンテーション': [
    'bzdhc5b3Bxs', // プレゼンテーション
    'oCdVtGFeDC0', // スピーキング
    'QckxruozjRg', // オーディエンス
    'g1Kr4Ozfoac', // ステージ
    'Hcfwew744z4'  // カンファレンス
  ],
  'ビジネススキル': [
    'ZVprbBmT8QA', // ビジネス成功
    'Oalh2MojUuk', // プロフェッショナル成長
    'KdeqA3aTnBY', // スキル開発
    'wD1LdJn1-yw', // キャリア発展
    'npxXWgQ33ZQ'  // ビジネス戦略
  ],
  'デフォルト': [
    'ZVprbBmT8QA', // ビジネス
    'LaK153ghdig', // プロフェッショナル
    'QLqNalPe0RA', // モダン
    'qwtCeJ5cLYs', // クリーン
    'oCdVtGFeDC0'  // ミニマル
  ]
};

// カテゴリに応じたデフォルト画像色のマッピング
const CATEGORY_COLORS: Record<string, string> = {
  '基礎ビジネススキル': '#3B82F6', // blue
  '思考法': '#8B5CF6', // purple
  'マネジメントスキル': '#10B981', // emerald
  '業務改善': '#F59E0B', // amber
  'コミュニケーション': '#EF4444', // red
  'プレゼンテーション': '#06B6D4', // cyan
  'ビジネススキル': '#3B82F6', // blue
  'デフォルト': '#6B7280' // gray
};

// カテゴリに応じたグラデーション背景のマッピング
const CATEGORY_GRADIENTS: Record<string, string> = {
  '基礎ビジネススキル': 'from-blue-500 via-blue-600 to-indigo-700',
  '思考法': 'from-purple-500 via-purple-600 to-indigo-700',
  'マネジメントスキル': 'from-emerald-500 via-teal-600 to-cyan-700',
  '業務改善': 'from-amber-500 via-orange-600 to-red-700',
  'コミュニケーション': 'from-red-500 via-pink-600 to-purple-700',
  'プレゼンテーション': 'from-cyan-500 via-blue-600 to-indigo-700',
  'ビジネススキル': 'from-blue-500 via-indigo-600 to-purple-700',
  'デフォルト': 'from-gray-500 via-slate-600 to-gray-700'
};

// カテゴリに応じたアイコンのマッピング
const CATEGORY_ICONS: Record<string, string> = {
  '基礎ビジネススキル': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
  '思考法': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path></svg>`,
  'マネジメントスキル': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  '業務改善': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline></svg>`,
  'コミュニケーション': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
  'プレゼンテーション': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
  'ビジネススキル': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline></svg>`,
  'デフォルト': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>`
};

/**
 * カテゴリに基づいて高品質なUnsplash画像URLを生成（固定画像ID使用）
 */
export function generateUnsplashImageUrl(
  category: string = 'デフォルト',
  width: number = 800,
  height: number = 450
): string {
  const imageIds = CATEGORY_UNSPLASH_IDS[category] || CATEGORY_UNSPLASH_IDS['デフォルト'];
  const randomImageId = imageIds[Math.floor(Math.random() * imageIds.length)];

  // Unsplash APIを使用して高品質な画像を取得
  return `https://images.unsplash.com/${randomImageId}?w=${width}&h=${height}&fit=crop&crop=center&auto=format&q=80`;
}

/**
 * カテゴリに基づいてランダムなUnsplash画像URLを生成（キーワード検索）
 */
export function generateRandomUnsplashImageUrl(
  category: string = 'デフォルト',
  width: number = 800,
  height: number = 450
): string {
  const keywords = CATEGORY_KEYWORDS[category] || CATEGORY_KEYWORDS['デフォルト'];
  const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];

  // Unsplash Source APIを使用
  return `https://source.unsplash.com/${width}x${height}/?${randomKeyword},business,professional`;
}

/**
 * カテゴリに基づいてプレースホルダー画像URLを生成
 */
export function generatePlaceholderImageUrl(
  category: string = 'デフォルト',
  width: number = 800,
  height: number = 450,
  title: string = ''
): string {
  const color = CATEGORY_COLORS[category] || CATEGORY_COLORS['デフォルト'];
  const colorHex = color.replace('#', '');
  
  // タイトルをURLエンコード
  const encodedTitle = encodeURIComponent(title.substring(0, 50));
  
  // Placeholder.com APIを使用
  return `https://via.placeholder.com/${width}x${height}/${colorHex}/FFFFFF?text=${encodedTitle}`;
}

/**
 * 画像URLの有効性をチェック
 */
export async function isImageUrlValid(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/');
  } catch {
    return false;
  }
}

/**
 * フォールバック画像URLを取得
 * 1. Unsplash画像を試行
 * 2. 失敗した場合はプレースホルダー画像を返す
 */
export async function getFallbackImageUrl(
  category: string = 'デフォルト',
  title: string = '',
  width: number = 800,
  height: number = 450
): Promise<string> {
  // まずUnsplash画像を試行
  const unsplashUrl = generateUnsplashImageUrl(category, width, height);
  
  try {
    // 本番環境では画像の有効性チェックをスキップ（パフォーマンス考慮）
    if (process.env.NODE_ENV === 'production') {
      return unsplashUrl;
    }
    
    // 開発環境では有効性をチェック
    const isValid = await isImageUrlValid(unsplashUrl);
    if (isValid) {
      return unsplashUrl;
    }
  } catch (error) {
    console.warn('Unsplash image check failed:', error);
  }
  
  // フォールバックとしてプレースホルダー画像を返す
  return generatePlaceholderImageUrl(category, width, height, title);
}

/**
 * 画像URLを正規化（Contentfulの//で始まるURLに対応）
 */
export function normalizeImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  
  return url;
}

/**
 * カテゴリに基づいて美しいグラデーション背景のカードデザインを生成
 */
export function generateGradientCardDesign(
  category: string = 'デフォルト',
  title: string = '',
  contentType: string = 'article'
): {
  gradientClass: string;
  iconSvg: string;
  accentColor: string;
} {
  const gradientClass = CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS['デフォルト'];
  const iconSvg = CATEGORY_ICONS[category] || CATEGORY_ICONS['デフォルト'];
  const accentColor = CATEGORY_COLORS[category] || CATEGORY_COLORS['デフォルト'];

  return {
    gradientClass,
    iconSvg,
    accentColor
  };
}

/**
 * コンテンツタイプに応じたアイコンを取得
 */
export function getContentTypeIcon(contentType: string): string {
  const icons: Record<string, string> = {
    article: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 9,9 8,9"></polyline></svg>`,
    video: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`,
    audio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`,
    default: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>`
  };

  return icons[contentType] || icons.default;
}

/**
 * レスポンシブ画像のsrcSetを生成
 */
export function generateSrcSet(baseUrl: string, sizes: number[] = [400, 800, 1200]): string {
  return sizes
    .map(size => {
      const url = baseUrl.includes('source.unsplash.com')
        ? baseUrl.replace(/\/\d+x\d+\//, `/${size}x${Math.round(size * 0.5625)}/`)
        : baseUrl;
      return `${url} ${size}w`;
    })
    .join(', ');
}
