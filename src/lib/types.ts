import { Asset, Entry, EntryCollection } from 'contentful';

// カテゴリの型定義
export interface CategoryFields {
  name: string;
  slug: string;
  description?: string;
}

export type Category = Entry<CategoryFields>;
export type CategoryCollection = EntryCollection<CategoryFields>;

// タグの型定義
export interface TagFields {
  name: string;
  slug: string;
}

export type Tag = Entry<TagFields>;
export type TagCollection = EntryCollection<TagFields>;

// 著者の型定義
export interface AuthorFields {
  name: string;
  bio?: string;
  profilePicture?: Asset;
}

export type Author = Entry<AuthorFields>;
export type AuthorCollection = EntryCollection<AuthorFields>;

// コンテンツの型定義
export interface ContentFields {
  title: string;
  slug: string;
  contentType: string[]; // 'article', 'video', 'audio'
  description?: string;
  category: Entry<CategoryFields>[];
  author?: Entry<AuthorFields>[];
  tags?: Entry<TagFields>[];
  body?: any; // RichTextドキュメント
  mdxContent?: string; // MDXコンテンツ
  videoUrl?: string;
  audioUrl?: string;
  featuredImage?: Asset;
  thumbnail?: Asset;
  publishDate?: string;
  displayOrder?: number; // ホームページでの表示順序（0001-9999）
  relatedContents?: Entry<ContentFields>[]; // 関連コンテンツへの参照
}

export type Content = Entry<ContentFields>;
export type ContentCollection = EntryCollection<ContentFields>;

// Contentful v11用の型ガード関数
export function isContentFields(fields: {} | ContentFields): fields is ContentFields {
  return 'title' in fields && 'slug' in fields;
}

export function isCategoryFields(fields: {} | CategoryFields): fields is CategoryFields {
  return 'name' in fields && 'slug' in fields;
}

export function isTagFields(fields: {} | TagFields): fields is TagFields {
  return 'name' in fields && 'slug' in fields;
}

export function isAuthorFields(fields: {} | AuthorFields): fields is AuthorFields {
  return 'name' in fields;
}

// コンテンツタイプの定義
export const CONTENT_TYPES = {
  ARTICLE: '記事',
  VIDEO: '動画',
  AUDIO: '音声',
};

// スキルカテゴリの定義
export const SKILL_CATEGORIES = {
  'management-skills': {
    name: 'マネジメントスキル',
    slug: 'management-skills',
    description: 'チームマネジメント、リーダーシップに関するスキル',
  },
  'basic-business-skills': {
    name: '基礎ビジネススキル',
    slug: 'basic-business-skills',
    description: 'ビジネスの基本的なスキルと知識',
  },
  'thinking-methods': {
    name: '思考法',
    slug: 'thinking-methods',
    description: '論理的思考、問題解決の手法',
  },
  'business-improvement': {
    name: '業務改善',
    slug: 'business-improvement',
    description: '効率化、プロセス改善に関するスキル',
  }
} as const;

// スキルスラッグ -> Contentfulカテゴリ・スラッグのマッピング
// 例: management-skills -> managementskill（Contentful上の実在カテゴリ）
export const SKILL_TO_CATEGORY_SLUG: Record<string, string> = {
  'management-skills': 'managementskill',
  'basic-business-skills': 'basic-business-skill',
  'thinking-methods': 'sikouhou',
  'business-improvement': 'Business-improvement',
};
