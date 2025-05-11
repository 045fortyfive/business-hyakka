import { ContentType, type ContentItem, type Category, type Author } from "./types"
import { createClient } from "contentful"

// 環境変数に基づいてモックデータを使用するかどうかを決定
// 文字列の比較に注意 - "false"という文字列はJavaScriptではtrueと評価される
// デフォルトでモックデータを使用するように変更
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false"

// デバッグ用に環境変数をコンソールに出力
console.log("Environment Variables:", {
  NEXT_PUBLIC_USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA,
  CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID ? "設定済み" : "未設定",
  CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN ? "設定済み" : "未設定",
  useMockData,
})

// Contentfulクライアントの初期化
const client = (() => {
  try {
    if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
      console.warn("Contentful credentials are missing. Using fallback client.")
      return null
    }

    return createClient({
      space: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    })
  } catch (error) {
    console.error("Error initializing Contentful client:", error)
    return null
  }
})()

// プレビュークライアントの初期化
const previewClient = (() => {
  try {
    if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN) {
      console.warn("Contentful preview credentials are missing. Using fallback client.")
      return null
    }

    return createClient({
      space: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
      host: "preview.contentful.com",
    })
  } catch (error) {
    console.error("Error initializing Contentful preview client:", error)
    return null
  }
})()

// 適切なクライアントを取得
export const getClient = (preview = false) => {
  // クライアントが初期化されていない場合はnullを返す
  if (preview && !previewClient) {
    console.warn("Preview client is not initialized. Check your environment variables.")
    return null
  }

  if (!preview && !client) {
    console.warn("Client is not initialized. Check your environment variables.")
    return null
  }

  return preview ? previewClient : client
}

// モックカテゴリデータ
const mockCategories: Category[] = [
  {
    id: "1",
    name: "基本ビジネススキル",
    slug: "basic",
    description: "ビジネスの基本となるスキルを学びましょう",
  },
  {
    id: "2",
    name: "コミュニケーション",
    slug: "communication",
    description: "効果的なコミュニケーション方法を習得しましょう",
  },
  {
    id: "3",
    name: "マネジメント",
    slug: "management",
    description: "チームや業務を効率的に管理するスキルを身につけましょう",
  },
  {
    id: "4",
    name: "業務改善",
    slug: "process-improvement",
    description: "業務プロセスを改善し、効率化するための方法を学びましょう",
  },
]

// モック著者データ
const mockAuthors: Author[] = [
  {
    id: "1",
    name: "山田太郎",
    bio: "ビジネスコンサルタント。10年以上の経験を持つ。",
    profilePicture: "/abstract-profile.png",
  },
  {
    id: "2",
    name: "佐藤花子",
    bio: "コミュニケーションスペシャリスト。企業研修講師。",
    profilePicture: "/female-trainer.png",
  },
]

// モックコンテンツデータ
const mockContentItems: ContentItem[] = [
  {
    id: "1",
    title: "ビジネスメールの書き方: 基本とテンプレート",
    slug: "business-email-basics",
    type: ContentType.ARTICLE,
    publishDate: "2023-04-15T09:00:00Z",
    category: mockCategories[0],
    categoryId: mockCategories[0].id,
    author: mockAuthors[0],
    tags: [],
    description: "ビジネスメールの基本的な書き方とマナーについて解説します。",
    featuredImage: "/business-email.png",
    thumbnail: "/business-email.png",
  },
  {
    id: "2",
    title: "効果的なプレゼンテーションの作り方",
    slug: "effective-presentation",
    type: ContentType.VIDEO,
    publishDate: "2023-05-20T14:30:00Z",
    category: mockCategories[1],
    categoryId: mockCategories[1].id,
    author: mockAuthors[1],
    tags: [],
    description: "プレゼンテーションの構成、スライドデザイン、話し方のコツを解説します。",
    thumbnail: "/dynamic-presentation.png",
    videoUrl: "https://example.com/video/presentation.mp4",
  },
  {
    id: "3",
    title: "リモートワークでのチームマネジメント",
    slug: "remote-team-management",
    type: ContentType.AUDIO,
    publishDate: "2023-06-10T10:15:00Z",
    category: mockCategories[2],
    categoryId: mockCategories[2].id,
    author: mockAuthors[0],
    tags: [],
    description: "リモートワーク環境でのチームマネジメントの課題と解決策について解説します。",
    thumbnail: "/remote-work-setup.png",
    audioUrl: "https://example.com/audio/remote-management.mp3",
  },
  {
    id: "4",
    title: "業務効率化のためのタスク管理術",
    slug: "task-management",
    type: ContentType.ARTICLE,
    publishDate: "2023-07-05T08:45:00Z",
    category: mockCategories[3],
    categoryId: mockCategories[3].id,
    author: mockAuthors[1],
    tags: [],
    description: "効率的なタスク管理方法と、おすすめのツールについて紹介します。",
    featuredImage: "/task-management-concept.png",
    thumbnail: "/task-management-concept.png",
  },
  {
    id: "5",
    title: "ビジネスにおける効果的な交渉術",
    slug: "negotiation-skills",
    type: ContentType.VIDEO,
    publishDate: "2023-08-12T13:20:00Z",
    category: mockCategories[1],
    categoryId: mockCategories[1].id,
    author: mockAuthors[0],
    tags: [],
    description: "ビジネス交渉を成功させるための準備、テクニック、よくある落とし穴について解説します。",
    thumbnail: "/business-negotiation.png",
    videoUrl: "https://example.com/video/negotiation.mp4",
  },
  {
    id: "6",
    title: "ストレス管理とセルフケアの重要性",
    slug: "stress-management",
    type: ContentType.AUDIO,
    publishDate: "2023-09-08T11:00:00Z",
    category: mockCategories[0],
    categoryId: mockCategories[0].id,
    author: mockAuthors[1],
    tags: [],
    description: "ビジネスパーソンのためのストレス管理とセルフケアの方法について解説します。",
    thumbnail: "/stress-management.png",
    audioUrl: "https://example.com/audio/stress-management.mp3",
  },
  {
    id: "7",
    title: "ビジネス用語集: 知っておくべき100の用語",
    slug: "business-terms",
    type: ContentType.OTHER,
    publishDate: "2023-10-15T09:00:00Z",
    category: mockCategories[0],
    categoryId: mockCategories[0].id,
    author: mockAuthors[0],
    tags: [],
    description: "ビジネスシーンでよく使われる用語を解説します。",
    featuredImage: "/business-terms.png",
    thumbnail: "/business-terms.png",
  },
]

// Contentfulからのレスポンスをアプリケーションの型に変換
const mapContentfulContent = (item: any): ContentItem => {
  console.log("Mapping Contentful item:", JSON.stringify(item, null, 2))

  const fields = item.fields

  // contentTypeフィールドがない場合は、デフォルトで「記事」を使用
  let contentType = ContentType.ARTICLE
  if (fields.contentType) {
    if (typeof fields.contentType === "string") {
      // 文字列の場合、直接マッピング
      switch (fields.contentType) {
        case "記事":
          contentType = ContentType.ARTICLE
          break
        case "動画":
          contentType = ContentType.VIDEO
          break
        case "音声":
          contentType = ContentType.AUDIO
          break
        case "その他":
          contentType = ContentType.OTHER
          break
        // 後方互換性のために英語の値もサポート
        case "article":
          contentType = ContentType.ARTICLE
          break
        case "video":
          contentType = ContentType.VIDEO
          break
        case "audio":
          contentType = ContentType.AUDIO
          break
        default:
          contentType = ContentType.OTHER
      }
    } else if (fields.contentType.fields && fields.contentType.fields.type) {
      // オブジェクトの場合、fields.typeを使用
      switch (fields.contentType.fields.type) {
        case "記事":
          contentType = ContentType.ARTICLE
          break
        case "動画":
          contentType = ContentType.VIDEO
          break
        case "音声":
          contentType = ContentType.AUDIO
          break
        case "その他":
          contentType = ContentType.OTHER
          break
        // 後方互換性のために英語の値もサポート
        case "article":
          contentType = ContentType.ARTICLE
          break
        case "video":
          contentType = ContentType.VIDEO
          break
        case "audio":
          contentType = ContentType.AUDIO
          break
        default:
          contentType = ContentType.OTHER
      }
    }
  }

  return {
    id: item.sys.id,
    title: fields.title || "無題",
    slug: fields.slug || item.sys.id,
    type: contentType,
    publishDate: fields.publishDate || item.sys.createdAt,
    category: fields.category
      ? Array.isArray(fields.category)
        ? {
            id: fields.category[0]?.sys?.id || "uncategorized",
            name: fields.category[0]?.fields?.name || "未分類",
            slug: fields.category[0]?.fields?.slug || "uncategorized",
            description: fields.category[0]?.fields?.description,
          }
        : {
            id: fields.category.sys.id,
            name: fields.category.fields.name || "未分類",
            slug: fields.category.fields.slug || "uncategorized",
            description: fields.category.fields.description,
          }
      : {
          id: "uncategorized",
          name: "未分類",
          slug: "uncategorized",
          description: "未分類のコンテンツ",
        },
    categoryId: fields.category
      ? Array.isArray(fields.category)
        ? fields.category[0]?.sys?.id || "uncategorized"
        : fields.category?.sys?.id || "uncategorized"
      : "uncategorized",
    author: fields.author
      ? Array.isArray(fields.author)
        ? {
            id: fields.author[0]?.sys?.id,
            name: fields.author[0]?.fields?.name,
            bio: fields.author[0]?.fields?.bio,
            profilePicture: fields.author[0]?.fields?.profilePicture?.fields?.file?.url,
          }
        : {
            id: fields.author.sys.id,
            name: fields.author.fields.name,
            bio: fields.author.fields.bio,
            profilePicture: fields.author.fields.profilePicture?.fields?.file?.url,
          }
      : undefined,
    tags: fields.tags
      ? fields.tags.map((tag: any) => ({
          id: tag.sys.id,
          name: tag.fields.name,
          slug: tag.fields.slug,
        }))
      : [],
    description: fields.description || "",
    body: fields.body,
    featuredImage: fields.featuredImage?.fields?.file?.url,
    thumbnail: fields.thumbnail?.fields?.file?.url || fields.featuredImage?.fields?.file?.url,
    videoUrl: fields.videoUrl,
    audioUrl: fields.audioUrl,
  }
}

const mapContentfulCategory = (item: any): Category => {
  const fields = item.fields

  return {
    id: item.sys.id,
    name: fields.name || "未分類",
    slug: fields.slug || "uncategorized",
    description: fields.description || "",
  }
}

// 全てのコンテンツを取得
export async function getAllContent(options: { limit?: number; skip?: number; preview?: boolean } = {}): Promise<{
  items: ContentItem[]
  total: number
}> {
  const { limit = 100, skip = 0, preview = false } = options

  if (useMockData) {
    console.log("Using mock data for getAllContent")
    const items = mockContentItems.slice(skip, skip + limit)
    return {
      items,
      total: mockContentItems.length,
    }
  }

  try {
    console.log("Fetching from Contentful for getAllContent")
    const contentfulClient = getClient(preview)

    if (!contentfulClient) {
      console.warn("Contentful client is not available. Using mock data instead.")
      const items = mockContentItems.slice(skip, skip + limit)
      return {
        items,
        total: mockContentItems.length,
      }
    }

    const response = await contentfulClient.getEntries({
      content_type: "content",
      limit,
      skip,
      include: 2,
      order: "-sys.createdAt",
    })

    console.log("Contentful response for getAllContent:", {
      total: response.total,
      itemCount: response.items.length,
    })

    const items = response.items.map(mapContentfulContent)

    return {
      items,
      total: response.total,
    }
  } catch (error) {
    console.error("Error fetching content from Contentful:", error)
    // エラー時はモックデータを返す
    const items = mockContentItems.slice(skip, skip + limit)
    return {
      items,
      total: mockContentItems.length,
    }
  }
}

// 最新のコンテンツを取得
export async function getLatestContent(limit = 6, preview = false): Promise<ContentItem[]> {
  if (useMockData) {
    console.log("Using mock data for getLatestContent")
    // 公開日の降順でソート
    return mockContentItems
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, limit)
  }

  try {
    console.log("Fetching from Contentful for getLatestContent")
    const contentfulClient = getClient(preview)

    if (!contentfulClient) {
      console.warn("Contentful client is not available. Using mock data instead.")
      return mockContentItems
        .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
        .slice(0, limit)
    }

    const response = await contentfulClient.getEntries({
      content_type: "content",
      limit,
      include: 2,
      order: "-sys.createdAt",
    })

    console.log("Contentful response for getLatestContent:", {
      total: response.total,
      itemCount: response.items.length,
    })

    return response.items.map(mapContentfulContent)
  } catch (error) {
    console.error("Error fetching latest content from Contentful:", error)
    // エラー時はモックデータを返す
    return mockContentItems
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, limit)
  }
}

// スラッグでコンテンツを取得
export async function getContentBySlug(slug: string, preview = false): Promise<ContentItem | null> {
  if (useMockData) {
    console.log(`Using mock data for getContentBySlug: ${slug}`)
    const content = mockContentItems.find((item) => item.slug === slug)
    return content || null
  }

  try {
    console.log(`Fetching from Contentful for getContentBySlug: ${slug}`)
    const contentfulClient = getClient(preview)

    if (!contentfulClient) {
      console.warn("Contentful client is not available. Using mock data instead.")
      const content = mockContentItems.find((item) => item.slug === slug)
      return content || null
    }

    const response = await contentfulClient.getEntries({
      content_type: "content",
      "fields.slug": slug,
      include: 2,
      limit: 1,
    })

    console.log(`Contentful response for getContentBySlug ${slug}:`, {
      total: response.total,
      itemCount: response.items.length,
    })

    if (response.items.length === 0) {
      return null
    }

    return mapContentfulContent(response.items[0])
  } catch (error) {
    console.error(`Error fetching content with slug ${slug} from Contentful:`, error)
    // エラー時はモックデータを返す
    const content = mockContentItems.find((item) => item.slug === slug)
    return content || null
  }
}

// カテゴリ一覧を取得
export async function getCategories(preview = false): Promise<Category[]> {
  if (useMockData) {
    console.log("Using mock data for getCategories")
    return mockCategories
  }

  try {
    console.log("Fetching from Contentful for getCategories")
    const contentfulClient = getClient(preview)

    if (!contentfulClient) {
      console.warn("Contentful client is not available. Using mock data instead.")
      return mockCategories
    }

    const response = await contentfulClient.getEntries({
      content_type: "category",
      order: "fields.name",
    })

    console.log("Contentful response for getCategories:", {
      total: response.total,
      itemCount: response.items.length,
    })

    return response.items.map(mapContentfulCategory)
  } catch (error) {
    console.error("Error fetching categories from Contentful:", error)
    // エラー時はモックデータを返す
    return mockCategories
  }
}

// スラッグでカテゴリを取得
export async function getCategoryBySlug(slug: string, preview = false): Promise<Category | null> {
  if (useMockData) {
    console.log(`Using mock data for getCategoryBySlug: ${slug}`)
    const category = mockCategories.find((item) => item.slug === slug)
    return category || null
  }

  try {
    console.log(`Fetching from Contentful for getCategoryBySlug: ${slug}`)
    const contentfulClient = getClient(preview)

    if (!contentfulClient) {
      console.warn("Contentful client is not available. Using mock data instead.")
      const category = mockCategories.find((item) => item.slug === slug)
      return category || null
    }

    const response = await contentfulClient.getEntries({
      content_type: "category",
      "fields.slug": slug,
      limit: 1,
    })

    console.log(`Contentful response for getCategoryBySlug ${slug}:`, {
      total: response.total,
      itemCount: response.items.length,
    })

    if (response.items.length === 0) {
      return null
    }

    return mapContentfulCategory(response.items[0])
  } catch (error) {
    console.error(`Error fetching category with slug ${slug} from Contentful:`, error)
    // エラー時はモックデータを返す
    const category = mockCategories.find((item) => item.slug === slug)
    return category || null
  }
}

// カテゴリIDでコンテンツを取得
export async function getContentByCategory(categoryId: string, preview = false): Promise<ContentItem[]> {
  if (useMockData) {
    console.log(`Using mock data for getContentByCategory: ${categoryId}`)
    return mockContentItems.filter((item) => item.categoryId === categoryId)
  }

  try {
    console.log(`Fetching from Contentful for getContentByCategory: ${categoryId}`)
    const contentfulClient = getClient(preview)

    if (!contentfulClient) {
      console.warn("Contentful client is not available. Using mock data instead.")
      return mockContentItems.filter((item) => item.categoryId === categoryId)
    }

    const response = await contentfulClient.getEntries({
      content_type: "content",
      "fields.category.sys.id": categoryId,
      include: 2,
      order: "-sys.createdAt",
    })

    console.log(`Contentful response for getContentByCategory ${categoryId}:`, {
      total: response.total,
      itemCount: response.items.length,
    })

    return response.items.map(mapContentfulContent)
  } catch (error) {
    console.error(`Error fetching content for category ${categoryId} from Contentful:`, error)
    // エラー時はモックデータを返す
    return mockContentItems.filter((item) => item.categoryId === categoryId)
  }
}

// カテゴリIDでコンテンツを取得（ページネーション対応）
export async function getContentByCategoryPaginated(
  categoryId: string,
  options: { limit?: number; skip?: number; preview?: boolean } = {},
): Promise<{
  items: ContentItem[]
  total: number
}> {
  const { limit = 9, skip = 0, preview = false } = options

  if (useMockData) {
    console.log(`Using mock data for getContentByCategory: ${categoryId}`)
    const filteredItems = mockContentItems.filter((item) => item.categoryId === categoryId)
    return {
      items: filteredItems.slice(skip, skip + limit),
      total: filteredItems.length,
    }
  }

  try {
    console.log(`Fetching from Contentful for getContentByCategory: ${categoryId}`)
    const contentfulClient = getClient(preview)

    if (!contentfulClient) {
      console.warn("Contentful client is not available. Using mock data instead.")
      const filteredItems = mockContentItems.filter((item) => item.categoryId === categoryId)
      return {
        items: filteredItems.slice(skip, skip + limit),
        total: filteredItems.length,
      }
    }

    const response = await contentfulClient.getEntries({
      content_type: "content",
      "fields.category.sys.id": categoryId,
      limit,
      skip,
      include: 2,
      order: "-sys.createdAt",
    })

    console.log(`Contentful response for getContentByCategory ${categoryId}:`, {
      total: response.total,
      itemCount: response.items.length,
    })

    const items = response.items.map(mapContentfulContent)

    return {
      items,
      total: response.total,
    }
  } catch (error) {
    console.error(`Error fetching content for category ${categoryId} from Contentful:`, error)
    // エラー時はモックデータを返す
    const filteredItems = mockContentItems.filter((item) => item.categoryId === categoryId)
    return {
      items: filteredItems.slice(skip, skip + limit),
      total: filteredItems.length,
    }
  }
}

// 関連コンテンツを取得
export async function getRelatedContent(
  contentId: string,
  categoryId: string,
  limit = 3,
  preview = false,
): Promise<ContentItem[]> {
  if (useMockData) {
    console.log(`Using mock data for getRelatedContent: ${contentId}, ${categoryId}`)
    // 同じカテゴリの他のコンテンツを取得
    return mockContentItems
      .filter((item) => item.id !== contentId && item.categoryId === categoryId)
      .sort(() => Math.random() - 0.5) // ランダムに並び替え
      .slice(0, limit)
  }

  try {
    console.log(`Fetching from Contentful for getRelatedContent: ${contentId}, ${categoryId}`)
    const contentfulClient = getClient(preview)

    if (!contentfulClient) {
      console.warn("Contentful client is not available. Using mock data instead.")
      return mockContentItems
        .filter((item) => item.id !== contentId && item.categoryId === categoryId)
        .sort(() => Math.random() - 0.5)
        .slice(0, limit)
    }

    const response = await contentfulClient.getEntries({
      content_type: "content",
      "fields.category.sys.id": categoryId,
      "sys.id[ne]": contentId,
      limit,
      include: 2,
    })

    console.log(`Contentful response for getRelatedContent ${contentId}, ${categoryId}:`, {
      total: response.total,
      itemCount: response.items.length,
    })

    return response.items.map(mapContentfulContent)
  } catch (error) {
    console.error(`Error fetching related content for ${contentId} from Contentful:`, error)
    // エラー時はモックデータを返す
    return mockContentItems
      .filter((item) => item.id !== contentId && item.categoryId === categoryId)
      .sort(() => Math.random() - 0.5)
      .slice(0, limit)
  }
}



// コンテンツを検索
export async function searchContent(
  query: string,
  options: { limit?: number; skip?: number; type?: string; preview?: boolean } = {},
): Promise<{
  items: ContentItem[]
  total: number
}> {
  if (!query) return { items: [], total: 0 }

  const { limit = 9, skip = 0, type, preview = false } = options

  if (useMockData) {
    console.log(`Using mock data for searchContent: ${query}`)
    const lowerQuery = query.toLowerCase()

    let filteredItems = mockContentItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        (item.description && item.description.toLowerCase().includes(lowerQuery)) ||
        item.category.name.toLowerCase().includes(lowerQuery),
    )

    // コンテンツタイプでフィルタリング
    if (type && type !== "all") {
      filteredItems = filteredItems.filter((item) => item.type === type)
    }

    return {
      items: filteredItems.slice(skip, skip + limit),
      total: filteredItems.length,
    }
  }

  try {
    console.log(`Fetching from Contentful for searchContent: ${query}`)
    const contentfulClient = getClient(preview)

    if (!contentfulClient) {
      console.warn("Contentful client is not available. Using mock data instead.")
      const lowerQuery = query.toLowerCase()
      let filteredItems = mockContentItems.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerQuery) ||
          (item.description && item.description.toLowerCase().includes(lowerQuery)) ||
          item.category.name.toLowerCase().includes(lowerQuery),
      )
      if (type && type !== "all") {
        filteredItems = filteredItems.filter((item) => item.type === type)
      }
      return {
        items: filteredItems.slice(skip, skip + limit),
        total: filteredItems.length,
      }
    }

    const queryParams: any = {
      content_type: "content",
      query,
      limit,
      skip,
      include: 2,
    }

    // コンテンツタイプでフィルタリング
    if (type && type !== "all") {
      queryParams["fields.contentType"] = type
    }

    const response = await contentfulClient.getEntries(queryParams)

    console.log(`Contentful response for searchContent ${query}:`, {
      total: response.total,
      itemCount: response.items.length,
    })

    const items = response.items.map(mapContentfulContent)

    return {
      items,
      total: response.total,
    }
  } catch (error) {
    console.error(`Error searching content with query ${query} from Contentful:`, error)
    // エラー時はモックデータを返す
    const lowerQuery = query.toLowerCase()
    let filteredItems = mockContentItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        (item.description && item.description.toLowerCase().includes(lowerQuery)) ||
        item.category.name.toLowerCase().includes(lowerQuery),
    )
    if (type && type !== "all") {
      filteredItems = filteredItems.filter((item) => item.type === type)
    }
    return {
      items: filteredItems.slice(skip, skip + limit),
      total: filteredItems.length,
    }
  }
}

// コンテンツタイプでフィルタリング
export async function getContentByType(
  type: ContentType,
  options: { limit?: number; skip?: number; preview?: boolean } = {},
): Promise<{
  items: ContentItem[]
  total: number
}> {
  const { limit = 9, skip = 0, preview = false } = options

  if (useMockData) {
    console.log(`Using mock data for getContentByType: ${type}`)
    const filteredItems = mockContentItems.filter((item) => item.type === type)
    return {
      items: filteredItems.slice(skip, skip + limit),
      total: filteredItems.length,
    }
  }

  try {
    console.log(`Fetching from Contentful for getContentByType: ${type}`)
    const contentfulClient = getClient(preview)

    if (!contentfulClient) {
      console.warn("Contentful client is not available. Using mock data instead.")
      const filteredItems = mockContentItems.filter((item) => item.type === type)
      return {
        items: filteredItems.slice(skip, skip + limit),
        total: filteredItems.length,
      }
    }

    const response = await contentfulClient.getEntries({
      content_type: "content",
      "fields.contentType": type,
      limit,
      skip,
      include: 2,
      order: "-sys.createdAt",
    })

    console.log(`Contentful response for getContentByType ${type}:`, {
      total: response.total,
      itemCount: response.items.length,
    })

    const items = response.items.map(mapContentfulContent)

    return {
      items,
      total: response.total,
    }
  } catch (error) {
    console.error(`Error fetching content of type ${type} from Contentful:`, error)
    // エラー時はモックデータを返す
    const filteredItems = mockContentItems.filter((item) => item.type === type)
    return {
      items: filteredItems.slice(skip, skip + limit),
      total: filteredItems.length,
    }
  }
}

// 環境変数の状態をデバッグするための関数
export function getEnvironmentStatus() {
  return {
    useMockData,
    contentfulSpaceId: process.env.CONTENTFUL_SPACE_ID ? "設定済み" : "未設定",
    contentfulAccessToken: process.env.CONTENTFUL_ACCESS_TOKEN ? "設定済み" : "未設定",
    contentfulPreviewAccessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN ? "設定済み" : "未設定",
    nextPublicUseMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA,
  }
}

// Contentfulのコンテンツモデルを確認するための関数
export async function checkContentModel(preview = false): Promise<any> {
  if (useMockData) {
    return {
      status: "using_mock_data",
      message: "モックデータを使用しているため、Contentfulのコンテンツモデルは確認できません。",
    }
  }

  try {
    console.log("Fetching content model from Contentful")
    const contentfulClient = getClient(preview)

    if (!contentfulClient) {
      return {
        status: "error",
        message: "Contentfulクライアントが初期化されていません。環境変数を確認してください。",
      }
    }

    // コンテンツタイプの取得
    const contentTypes = await contentfulClient.getContentTypes()

    console.log("Content types response:", {
      total: contentTypes.total,
      itemCount: contentTypes.items?.length || 0,
    })

    // レスポンスの検証
    if (!contentTypes.items || !Array.isArray(contentTypes.items)) {
      return {
        status: "error",
        message: "Contentfulからのレスポンスが不正です。items配列が見つかりません。",
        rawResponse: JSON.stringify(contentTypes, null, 2),
      }
    }

    // 各コンテンツタイプのフィールドを取得
    const contentModelInfo = contentTypes.items.map((type) => {
      // typeの構造を検証
      if (!type || !type.sys || !type.fields || !Array.isArray(type.fields)) {
        return {
          id: type?.sys?.id || "unknown",
          name: type?.name || "Unknown Type",
          description: "Invalid content type structure",
          fields: [],
        }
      }

      return {
        id: type.sys.id,
        name: type.name,
        description: type.description,
        fields: type.fields.map((field) => ({
          id: field.id,
          name: field.name,
          type: field.type,
          required: field.required,
          localized: field.localized,
          linkType: field.linkType,
        })),
      }
    })

    return {
      status: "success",
      contentModel: contentModelInfo,
    }
  } catch (error) {
    console.error("Error checking Contentful content model:", error)

    // エラーの詳細情報を返す
    return {
      status: "error",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }
  }
}
