import { Asset, Entry, EntryCollection, EntryFieldTypes } from 'contentful';

// カテゴリの型定義
export interface CategoryFields {
  name: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  description?: EntryFieldTypes.Text;
}

export type Category = Entry<{ fields: CategoryFields }, 'WITHOUT_UNRESOLVABLE_LINKS', string>;
export type CategoryCollection = EntryCollection<{ fields: CategoryFields }, 'WITHOUT_UNRESOLVABLE_LINKS', string>;

// タグの型定義
export interface TagFields {
  name: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
}

export type Tag = Entry<{ fields: TagFields }, 'WITHOUT_UNRESOLVABLE_LINKS', string>;
export type TagCollection = EntryCollection<{ fields: TagFields }, 'WITHOUT_UNRESOLVABLE_LINKS', string>;

// 著者の型定義
export interface AuthorFields {
  name: EntryFieldTypes.Symbol;
  bio?: EntryFieldTypes.Text;
  profilePicture?: EntryFieldTypes.AssetLink;
}

export type Author = Entry<{ fields: AuthorFields }, 'WITHOUT_UNRESOLVABLE_LINKS', string>;
export type AuthorCollection = EntryCollection<{ fields: AuthorFields }, 'WITHOUT_UNRESOLVABLE_LINKS', string>;

// コンテンツの型定義
export interface ContentFields {
  title: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  contentType: EntryFieldTypes.Array<EntryFieldTypes.Symbol>; // ['記事'], ['動画'], ['音声']
  description?: EntryFieldTypes.Text;
  category: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<{ fields: CategoryFields }>>;
  author?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<{ fields: AuthorFields }>>;
  tags?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<{ fields: TagFields }>>;
  body?: EntryFieldTypes.RichText; // RichTextドキュメント
  videoUrl?: EntryFieldTypes.Symbol;
  audioUrl?: EntryFieldTypes.Symbol;
  featuredImage?: EntryFieldTypes.AssetLink;
  thumbnail?: EntryFieldTypes.AssetLink;
  displayOrder?: EntryFieldTypes.Integer; // ホームページでの表示順序（0001-9999）
  publishDate?: EntryFieldTypes.Date;
  seoDescription?: EntryFieldTypes.Text;
  optionalVideoEmbed?: EntryFieldTypes.Symbol;
  optionalAudioEmbed?: EntryFieldTypes.Symbol;
}

export type Content = Entry<{ fields: ContentFields }, 'WITHOUT_UNRESOLVABLE_LINKS', string>;
export type ContentCollection = EntryCollection<{ fields: ContentFields }, 'WITHOUT_UNRESOLVABLE_LINKS', string>;

// コンテンツタイプの定義
export const CONTENT_TYPES = {
  ARTICLE: '記事',
  VIDEO: '動画',
  AUDIO: '音声',
};
