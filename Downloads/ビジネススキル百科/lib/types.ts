export enum ContentType {
  ARTICLE = "記事",
  VIDEO = "動画",
  AUDIO = "音声",
  OTHER = "その他",
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export interface Author {
  id: string
  name: string
  bio?: string
  profilePicture?: string
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface ContentItem {
  id: string
  title: string
  slug: string
  type: ContentType
  publishDate: string
  category: Category
  categoryId: string
  author?: Author
  tags?: Tag[]
  description?: string
  body?: any // リッチテキスト
  featuredImage?: string
  thumbnail?: string
  videoUrl?: string
  audioUrl?: string
}
