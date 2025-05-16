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
  relatedContents?: Entry<ContentFields>[]; // 関連コンテンツへの参照
}

export type Content = Entry<ContentFields>;
export type ContentCollection = EntryCollection<ContentFields>;

// コンテンツタイプの定義
export const CONTENT_TYPES = {
  ARTICLE: '記事',
  VIDEO: '動画',
  AUDIO: '音声',
};
