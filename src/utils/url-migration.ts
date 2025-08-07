import { SKILL_CATEGORIES } from '@/lib/types';

// レガシーURLマッピング設定
export const LEGACY_REDIRECTS = {
  // コンテンツタイプページ
  '/articles': {
    newUrl: '/categories/basic-business-skills',
    reason: 'Content type pages have been reorganized by skill categories',
    skillCategory: 'basic-business-skills'
  },
  '/videos': {
    newUrl: '/categories/thinking-methods',
    reason: 'Content type pages have been reorganized by skill categories', 
    skillCategory: 'thinking-methods'
  },
  '/audios': {
    newUrl: '/categories/business-improvement',
    reason: 'Content type pages have been reorganized by skill categories',
    skillCategory: 'business-improvement'
  },
  '/categories': {
    newUrl: '/',
    reason: 'Category listing is now integrated into the homepage',
    skillCategory: null
  }
} as const;

// コンテンツタイプからスキルカテゴリへのマッピング
export const CONTENT_TYPE_SKILL_MAPPING = {
  'article': 'basic-business-skills',
  'video': 'thinking-methods', 
  'audio': 'business-improvement'
} as const;

// レガシーURLを新しいURLに変換する関数
export function migrateLegacyUrl(legacyUrl: string): string | null {
  // 完全一致のリダイレクト
  if (legacyUrl in LEGACY_REDIRECTS) {
    return LEGACY_REDIRECTS[legacyUrl as keyof typeof LEGACY_REDIRECTS].newUrl;
  }

  // 個別コンテンツページのマッピング
  const contentMatch = legacyUrl.match(/^\/(articles|videos|audios)\/(.+)$/);
  if (contentMatch) {
    const [, contentType, slug] = contentMatch;
    return `/content/${slug}`;
  }

  // カテゴリページでのtypeパラメータ処理
  const categoryMatch = legacyUrl.match(/^\/categories\/(.+)\?.*type=(.+)/);
  if (categoryMatch) {
    const [, categorySlug, contentType] = categoryMatch;
    const skillCategory = CONTENT_TYPE_SKILL_MAPPING[contentType as keyof typeof CONTENT_TYPE_SKILL_MAPPING];
    if (skillCategory) {
      return `/categories/${skillCategory}`;
    }
  }

  return null;
}

// スキルカテゴリの情報を取得する関数
export function getSkillCategoryInfo(skillSlug: string) {
  return SKILL_CATEGORIES[skillSlug as keyof typeof SKILL_CATEGORIES] || null;
}

// レガシーURLの説明を生成する関数
export function getLegacyUrlExplanation(legacyUrl: string): {
  oldUrl: string;
  newUrl: string;
  reason: string;
  skillCategory?: string;
} | null {
  if (legacyUrl in LEGACY_REDIRECTS) {
    const redirect = LEGACY_REDIRECTS[legacyUrl as keyof typeof LEGACY_REDIRECTS];
    return {
      oldUrl: legacyUrl,
      newUrl: redirect.newUrl,
      reason: redirect.reason,
      skillCategory: redirect.skillCategory || undefined
    };
  }

  const contentMatch = legacyUrl.match(/^\/(articles|videos|audios)\/(.+)$/);
  if (contentMatch) {
    const [, contentType, slug] = contentMatch;
    const skillCategory = CONTENT_TYPE_SKILL_MAPPING[contentType as keyof typeof CONTENT_TYPE_SKILL_MAPPING];
    return {
      oldUrl: legacyUrl,
      newUrl: `/content/${slug}`,
      reason: `Individual ${contentType} pages are now unified under /content/`,
      skillCategory
    };
  }

  return null;
}

// SEO用のcanonicalURLを生成する関数
export function generateCanonicalUrl(currentUrl: string, baseUrl: string = ''): string {
  const migratedUrl = migrateLegacyUrl(currentUrl);
  if (migratedUrl) {
    return `${baseUrl}${migratedUrl}`;
  }
  return `${baseUrl}${currentUrl}`;
}

// リダイレクト用のメタデータを生成する関数
export function generateRedirectMetadata(legacyUrl: string) {
  const explanation = getLegacyUrlExplanation(legacyUrl);
  if (!explanation) return null;

  return {
    title: `ページが移動しました | ビジネススキル百科`,
    description: `このページは新しいスキルベースの構成に移動しました。${explanation.reason}`,
    canonical: explanation.newUrl,
    robots: 'noindex, follow'
  };
}
