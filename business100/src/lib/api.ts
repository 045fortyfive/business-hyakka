import { contentfulClient } from './contentful';
import { CONTENT_TYPE } from './contentful';
import {
  Content,
  ContentCollection,
  Category,
  CategoryCollection,
  Tag,
  TagCollection,
  CONTENT_TYPES
} from './types';

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
    // Contentfulのクエリパラメータを表示
    console.log('Query parameters:', {
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.ARTICLE,
      order: '-sys.createdAt',
      limit,
      skip,
      include: 2,
    });

    const response = await contentfulClient.getEntries<Content['fields']>({
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
    const entries = await contentfulClient.getEntries<Content['fields']>({
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
    const response = await contentfulClient.getEntries<Content['fields']>({
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
    const entries = await contentfulClient.getEntries<Content['fields']>({
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
    const response = await contentfulClient.getEntries<Content['fields']>({
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
    const entries = await contentfulClient.getEntries<Content['fields']>({
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
    const response = await contentfulClient.getEntries<Category['fields']>({
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
  const entries = await contentfulClient.getEntries<Category['fields']>({
    content_type: CONTENT_TYPE.CATEGORY,
    'fields.slug': slug,
    limit: 1,
  });

  return entries.items.length > 0 ? entries.items[0] : null;
}

// カテゴリに属するコンテンツを取得
export async function getContentByCategory(categorySlug: string, limit = 10, skip = 0) {
  console.log(`Fetching content by category slug: ${categorySlug}`);

  // カテゴリを取得
  const category = await getCategoryBySlug(categorySlug);
  if (!category) {
    console.log(`Category with slug "${categorySlug}" not found`);
    return {
      articles: { items: [], total: 0, skip: 0, limit, includes: {} },
      videos: { items: [], total: 0, skip: 0, limit, includes: {} },
      audios: { items: [], total: 0, skip: 0, limit, includes: {} },
      category: null
    };
  }

  console.log(`Found category: ${category.fields.name} (ID: ${category.sys.id})`);

  try {
    // カテゴリに属する記事を取得
    const articles = await contentfulClient.getEntries<Content['fields']>({
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.ARTICLE,
      'fields.category.sys.id': category.sys.id,
      order: '-sys.createdAt',
      limit,
      skip,
      include: 2,
    });
    console.log(`Found ${articles.items.length} articles in category "${category.fields.name}"`);

    // カテゴリに属する動画を取得
    const videos = await contentfulClient.getEntries<Content['fields']>({
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.VIDEO,
      'fields.category.sys.id': category.sys.id,
      order: '-sys.createdAt',
      limit,
      skip,
      include: 2,
    });
    console.log(`Found ${videos.items.length} videos in category "${category.fields.name}"`);

    // カテゴリに属する音声を取得
    const audios = await contentfulClient.getEntries<Content['fields']>({
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.AUDIO,
      'fields.category.sys.id': category.sys.id,
      order: '-sys.createdAt',
      limit,
      skip,
      include: 2,
    });
    console.log(`Found ${audios.items.length} audios in category "${category.fields.name}"`);

    return { articles, videos, audios, category };
  } catch (error) {
    console.error(`Error fetching content for category "${categorySlug}":`, error);
    return {
      articles: { items: [], total: 0, skip: 0, limit, includes: {} },
      videos: { items: [], total: 0, skip: 0, limit, includes: {} },
      audios: { items: [], total: 0, skip: 0, limit, includes: {} },
      category
    };
  }
}

// キーワード検索
export async function searchContent(query: string, limit = 10, skip = 0) {
  console.log(`Searching content with query: "${query}", limit: ${limit}, skip: ${skip}`);

  try {
    // 記事を検索
    const articles = await contentfulClient.getEntries<Content['fields']>({
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
    const videos = await contentfulClient.getEntries<Content['fields']>({
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
    const audios = await contentfulClient.getEntries<Content['fields']>({
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
