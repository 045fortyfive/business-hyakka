import { contentfulClient, previewContentfulClient, CONTENT_TYPE } from './contentful';
import { draftMode } from 'next/headers';
import {
  Content,
  ContentCollection,
  Category,
  CategoryCollection,
  CONTENT_TYPES
} from './types';

// プレビューモードに応じたクライアントを取得する関数
export async function getClient() {
  const { isEnabled } = await draftMode();
  return isEnabled ? previewContentfulClient : contentfulClient;
}

// 記事一覧を取得
export async function getArticles(limit = 10, skip = 0): Promise<ContentCollection> {
  console.log(`Fetching articles: limit=${limit}, skip=${skip}`);

  // 環境変数の確認（デバッグ用）
  console.log('=== 環境変数の確認（getArticles） ===');
  console.log('CONTENTFUL_SPACE_ID:', process.env.CONTENTFUL_SPACE_ID);
  console.log('CONTENTFUL_ACCESS_TOKEN:', process.env.CONTENTFUL_ACCESS_TOKEN ? '設定済み' : '未設定');
  console.log('NEXT_PUBLIC_USE_MOCK_DATA:', process.env.NEXT_PUBLIC_USE_MOCK_DATA);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('==============================');

  try {
    // プレビューモードに応じたクライアントを取得
    const client = await getClient();

    // Contentfulのクエリパラメータを表示
    console.log('Query parameters:', {
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.ARTICLE,
      order: '-sys.createdAt',
      limit,
      skip,
      include: 2,
    });

    const response = await client.getEntries<Content['fields']>({
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.ARTICLE, // contentTypeフィールドに'記事'が含まれているエントリを取得
      order: '-sys.createdAt',
      limit,
      skip,
      include: 2, // 関連エンティティ（カテゴリ、タグ、著者）も取得
    });

    console.log(`Fetched ${response.items.length} articles out of ${response.total}`);

    // 最初の記事の内容をログに出力（デバッグ用）
    if (response.items.length > 0) {
      console.log('First article fields:', JSON.stringify({
        title: response.items[0].fields.title,
        slug: response.items[0].fields.slug,
        contentType: response.items[0].fields.contentType,
      }, null, 2));
    }

    return response;
  } catch (error) {
    console.error('Error fetching articles:', error);
    // エラーが発生した場合は空のレスポンスを返す
    return {
      items: [],
      total: 0,
      skip: 0,
      limit: limit,
      includes: {},
    } as ContentCollection;
  }
}

// 特定の記事を取得
export async function getArticleBySlug(slug: string): Promise<Content | null> {
  console.log(`Fetching article by slug: ${slug}`);
  try {
    // プレビューモードに応じたクライアントを取得
    const client = await getClient();

    const entries = await client.getEntries<Content['fields']>({
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.ARTICLE,
      'fields.slug': slug,
      include: 2,
      limit: 1,
    });

    console.log(`Found ${entries.items.length} articles with slug: ${slug}`);
    return entries.items.length > 0 ? entries.items[0] : null;
  } catch (error) {
    console.error(`Error fetching article by slug ${slug}:`, error);
    return null;
  }
}

// 動画一覧を取得
export async function getVideos(limit = 10, skip = 0): Promise<ContentCollection> {
  console.log(`Fetching videos: limit=${limit}, skip=${skip}`);
  try {
    // プレビューモードに応じたクライアントを取得
    const client = await getClient();

    const response = await client.getEntries<Content['fields']>({
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.VIDEO, // contentTypeフィールドに'動画'が含まれているエントリを取得
      order: '-sys.createdAt',
      limit,
      skip,
      include: 2,
    });
    console.log(`Fetched ${response.items.length} videos out of ${response.total}`);
    return response;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return {
      items: [],
      total: 0,
      skip: 0,
      limit: limit,
      includes: {},
    } as ContentCollection;
  }
}

// 特定の動画を取得
export async function getVideoBySlug(slug: string): Promise<Content | null> {
  console.log(`Fetching video by slug: ${slug}`);
  try {
    // プレビューモードに応じたクライアントを取得
    const client = await getClient();

    const entries = await client.getEntries<Content['fields']>({
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.VIDEO,
      'fields.slug': slug,
      include: 2,
      limit: 1,
    });

    console.log(`Found ${entries.items.length} videos with slug: ${slug}`);
    return entries.items.length > 0 ? entries.items[0] : null;
  } catch (error) {
    console.error(`Error fetching video by slug ${slug}:`, error);
    return null;
  }
}

// 音声一覧を取得
export async function getAudios(limit = 10, skip = 0): Promise<ContentCollection> {
  console.log(`Fetching audios: limit=${limit}, skip=${skip}`);
  try {
    // プレビューモードに応じたクライアントを取得
    const client = await getClient();

    const response = await client.getEntries<Content['fields']>({
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.AUDIO, // contentTypeフィールドに'音声'が含まれているエントリを取得
      order: '-sys.createdAt',
      limit,
      skip,
      include: 2,
    });
    console.log(`Fetched ${response.items.length} audios out of ${response.total}`);
    return response;
  } catch (error) {
    console.error('Error fetching audios:', error);
    return {
      items: [],
      total: 0,
      skip: 0,
      limit: limit,
      includes: {},
    } as ContentCollection;
  }
}

// 特定の音声を取得
export async function getAudioBySlug(slug: string): Promise<Content | null> {
  console.log(`Fetching audio by slug: ${slug}`);
  try {
    // プレビューモードに応じたクライアントを取得
    const client = await getClient();

    const entries = await client.getEntries<Content['fields']>({
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.AUDIO,
      'fields.slug': slug,
      include: 2,
      limit: 1,
    });

    console.log(`Found ${entries.items.length} audios with slug: ${slug}`);
    return entries.items.length > 0 ? entries.items[0] : null;
  } catch (error) {
    console.error(`Error fetching audio by slug ${slug}:`, error);
    return null;
  }
}

// カテゴリ一覧を取得
export async function getCategories(): Promise<CategoryCollection> {
  console.log('Fetching categories');
  try {
    // プレビューモードに応じたクライアントを取得
    const client = await getClient();

    const response = await client.getEntries<Category['fields']>({
      content_type: CONTENT_TYPE.CATEGORY,
      order: 'fields.name',
    });
    console.log(`Fetched ${response.items.length} categories out of ${response.total}`);
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // エラーが発生した場合は空のレスポンスを返す
    return {
      items: [],
      total: 0,
      skip: 0,
      limit: 100,
      includes: {},
    } as CategoryCollection;
  }
}

// 特定のカテゴリを取得
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  // プレビューモードに応じたクライアントを取得
  const client = await getClient();

  const entries = await client.getEntries<Category['fields']>({
    content_type: CONTENT_TYPE.CATEGORY,
    'fields.slug': slug,
    limit: 1,
  });

  return entries.items.length > 0 ? entries.items[0] : null;
}

// カテゴリに属するコンテンツを取得（統合版）
export async function getContentByCategory(categorySlug: string, limit = 100, skip = 0) {
  console.log(`Fetching content by category slug: ${categorySlug}`);

  // カテゴリを取得
  const category = await getCategoryBySlug(categorySlug);
  if (!category) {
    console.log(`Category with slug "${categorySlug}" not found`);
    return {
      content: { items: [], total: 0, skip: 0, limit, includes: {} },
      category: null
    };
  }

  console.log(`Found category: ${category.fields.name} (ID: ${category.sys.id})`);

  try {
    // プレビューモードに応じたクライアントを取得
    const client = await getClient();

    // カテゴリに属する全コンテンツを取得（contentTypeフィルタなし）
    const allContent = await client.getEntries<Content['fields']>({
      content_type: CONTENT_TYPE.CONTENT,
      'fields.category.sys.id': category.sys.id,
      order: '-sys.createdAt',
      limit,
      skip,
      include: 2,
    });

    console.log(`Found ${allContent.items.length} total content items in category "${category.fields.name}"`);

    // スラグベースで重複を排除
    const uniqueContentMap = new Map<string, typeof allContent.items[0]>();

    for (const item of allContent.items) {
      const slug = item.fields.slug;
      if (slug && !uniqueContentMap.has(slug)) {
        uniqueContentMap.set(slug, item);
      }
    }

    // Mapから配列に変換し、作成日時でソート
    const uniqueItems = Array.from(uniqueContentMap.values()).sort((a, b) => {
      const dateA = new Date(a.sys.createdAt).getTime();
      const dateB = new Date(b.sys.createdAt).getTime();
      return dateB - dateA; // 降順（新しい順）
    });

    console.log(`After deduplication: ${uniqueItems.length} unique content items`);

    // ContentCollection形式で返す
    const content: ContentCollection = {
      items: uniqueItems,
      total: uniqueItems.length,
      skip,
      limit,
      includes: allContent.includes || {},
    };

    return { content, category };
  } catch (error) {
    console.error(`Error fetching content for category "${categorySlug}":`, error);
    return {
      content: { items: [], total: 0, skip: 0, limit, includes: {} },
      category
    };
  }
}

// キーワード検索
export async function searchContent(query: string, limit = 10, skip = 0) {
  console.log(`Searching content with query: "${query}", limit: ${limit}, skip: ${skip}`);

  try {
    // プレビューモードに応じたクライアントを取得
    const client = await getClient();

    // 記事を検索
    const articles = await client.getEntries<Content['fields']>({
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.ARTICLE,
      query,
      order: '-sys.createdAt',
      limit,
      skip,
      include: 2,
    });
    console.log(`Found ${articles.items.length} articles matching "${query}"`);

    // 動画を検索
    const videos = await client.getEntries<Content['fields']>({
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.VIDEO,
      query,
      order: '-sys.createdAt',
      limit,
      skip,
      include: 2,
    });
    console.log(`Found ${videos.items.length} videos matching "${query}"`);

    // 音声を検索
    const audios = await client.getEntries<Content['fields']>({
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.AUDIO,
      query,
      order: '-sys.createdAt',
      limit,
      skip,
      include: 2,
    });
    console.log(`Found ${audios.items.length} audios matching "${query}"`);

    return { articles, videos, audios };
  } catch (error) {
    console.error(`Error searching content with query "${query}":`, error);
    // エラーが発生した場合は空のレスポンスを返す
    return {
      articles: { items: [], total: 0, skip: 0, limit, includes: {} },
      videos: { items: [], total: 0, skip: 0, limit, includes: {} },
      audios: { items: [], total: 0, skip: 0, limit, includes: {} },
    };
  }
}
