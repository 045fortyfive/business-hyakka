import { contentfulClient, previewContentfulClient, CONTENT_TYPE } from './contentful';
import { draftMode } from 'next/headers';
import { cache } from 'react';
import {
  Content,
  ContentCollection,
  Category,
  CategoryCollection,
  Tag,
  TagCollection,
  CONTENT_TYPES
} from './types';

// プレビューモードに応じたクライアントを取得する関数
export async function getClient() {
  try {
    const { isEnabled } = await draftMode();
    return isEnabled ? previewContentfulClient : contentfulClient;
  } catch (error) {
    // draftModeがリクエストスコープ外で呼び出された場合は公開モードのクライアントを返す
    console.warn('draftMode was called outside a request scope, using public client');
    return contentfulClient;
  }
}

// Contentful APIの基本URL構築
function getContentfulApiUrl() {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master';
  return `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}`;
}

// APIキーを取得（プレビューモード対応）
async function getApiKey() {
  try {
    const { isEnabled } = await draftMode();
    return isEnabled 
      ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN 
      : process.env.CONTENTFUL_ACCESS_TOKEN;
  } catch (error) {
    return process.env.CONTENTFUL_ACCESS_TOKEN;
  }
}

// Fetch APIを使用したContentful API呼び出し（キャッシュタグ付き）
async function fetchContentful(endpoint: string, params: Record<string, any> = {}, tags: string[] = []) {
  const baseUrl = getContentfulApiUrl();
  const apiKey = await getApiKey();
  
  // URLパラメータを構築
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const url = `${baseUrl}${endpoint}?${searchParams.toString()}`;
  
  console.log(`🌐 Fetching from Contentful: ${endpoint}`);
  console.log(`📋 Cache tags: [${tags.join(', ')}]`);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      next: {
        tags: ['contentful', ...tags],
        revalidate: 3600, // 1時間のフォールバック
      },
    });

    if (!response.ok) {
      throw new Error(`Contentful API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Fetched ${data.items?.length || 0} items from ${endpoint}`);
    return data;
    
  } catch (error) {
    console.error(`❌ Error fetching from ${endpoint}:`, error);
    // フォールバック: 従来のクライアント使用
    console.log('🔄 Falling back to Contentful client...');
    return null;
  }
}

// 記事一覧を取得（キャッシュ対応）
export const getArticles = cache(async (limit = 10, skip = 0): Promise<ContentCollection> => {
  console.log(`📰 Fetching articles: limit=${limit}, skip=${skip}`);

  try {
    const params = {
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.ARTICLE,
      order: '-sys.createdAt',
      limit,
      skip,
      include: 2,
    };

    const data = await fetchContentful('/entries', params, ['articles', 'content']);
    
    if (data) {
      return data;
    }
    
    // フォールバック: 従来のクライアント使用
    const client = await getClient();
    const response = await client.getEntries<Content['fields']>(params);
    return response;
    
  } catch (error) {
    console.error('Error fetching articles:', error);
    return {
      items: [],
      total: 0,
      skip: 0,
      limit: limit,
      includes: {},
    } as ContentCollection;
  }
});

// 特定の記事を取得（キャッシュ対応）
export const getArticleBySlug = cache(async (slug: string): Promise<Content | null> => {
  console.log(`📄 Fetching article by slug: ${slug}`);
  
  try {
    const params = {
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.ARTICLE,
      'fields.slug': slug,
      include: 2,
      limit: 1,
    };

    const data = await fetchContentful('/entries', params, ['articles', 'content', `article:${slug}`]);
    
    if (data && data.items.length > 0) {
      return data.items[0];
    }
    
    // フォールバック: 従来のクライアント使用
    const client = await getClient();
    const entries = await client.getEntries<Content['fields']>(params);
    return entries.items.length > 0 ? entries.items[0] : null;
    
  } catch (error) {
    console.error(`Error fetching article by slug ${slug}:`, error);
    return null;
  }
});

// 動画一覧を取得（キャッシュ対応）
export const getVideos = cache(async (limit = 10, skip = 0): Promise<ContentCollection> => {
  console.log(`🎥 Fetching videos: limit=${limit}, skip=${skip}`);
  
  try {
    const params = {
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.VIDEO,
      order: '-sys.createdAt',
      limit,
      skip,
      include: 2,
    };

    const data = await fetchContentful('/entries', params, ['videos', 'content']);
    
    if (data) {
      return data;
    }
    
    // フォールバック: 従来のクライアント使用
    const client = await getClient();
    const response = await client.getEntries<Content['fields']>(params);
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
});

// 特定の動画を取得（キャッシュ対応）
export const getVideoBySlug = cache(async (slug: string): Promise<Content | null> => {
  console.log(`🎬 Fetching video by slug: ${slug}`);
  
  try {
    const params = {
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.VIDEO,
      'fields.slug': slug,
      include: 2,
      limit: 1,
    };

    const data = await fetchContentful('/entries', params, ['videos', 'content', `video:${slug}`]);
    
    if (data && data.items.length > 0) {
      return data.items[0];
    }
    
    // フォールバック: 従来のクライアント使用
    const client = await getClient();
    const entries = await client.getEntries<Content['fields']>(params);
    return entries.items.length > 0 ? entries.items[0] : null;
    
  } catch (error) {
    console.error(`Error fetching video by slug ${slug}:`, error);
    return null;
  }
});

// 音声一覧を取得（キャッシュ対応）
export const getAudios = cache(async (limit = 10, skip = 0): Promise<ContentCollection> => {
  console.log(`🎧 Fetching audios: limit=${limit}, skip=${skip}`);
  
  try {
    const params = {
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.AUDIO,
      order: '-sys.createdAt',
      limit,
      skip,
      include: 2,
    };

    const data = await fetchContentful('/entries', params, ['audios', 'content']);
    
    if (data) {
      return data;
    }
    
    // フォールバック: 従来のクライアント使用
    const client = await getClient();
    const response = await client.getEntries<Content['fields']>(params);
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
});

// 特定の音声を取得（キャッシュ対応）
export const getAudioBySlug = cache(async (slug: string): Promise<Content | null> => {
  console.log(`🔊 Fetching audio by slug: ${slug}`);
  
  try {
    const params = {
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.AUDIO,
      'fields.slug': slug,
      include: 2,
      limit: 1,
    };

    const data = await fetchContentful('/entries', params, ['audios', 'content', `audio:${slug}`]);
    
    if (data && data.items.length > 0) {
      return data.items[0];
    }
    
    // フォールバック: 従来のクライアント使用
    const client = await getClient();
    const entries = await client.getEntries<Content['fields']>(params);
    return entries.items.length > 0 ? entries.items[0] : null;
    
  } catch (error) {
    console.error(`Error fetching audio by slug ${slug}:`, error);
    return null;
  }
});

// カテゴリ一覧を取得（キャッシュ対応）
export const getCategories = cache(async (): Promise<CategoryCollection> => {
  console.log('🏷️ Fetching categories');
  
  try {
    const params = {
      content_type: CONTENT_TYPE.CATEGORY,
      order: 'fields.name',
    };

    const data = await fetchContentful('/entries', params, ['categories']);
    
    if (data) {
      return data;
    }
    
    // フォールバック: 従来のクライアント使用
    const client = await getClient();
    const response = await client.getEntries<Category['fields']>(params);
    return response;
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      items: [],
      total: 0,
      skip: 0,
      limit: 100,
      includes: {},
    } as CategoryCollection;
  }
});

// 特定のカテゴリを取得（キャッシュ対応）
export const getCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
  console.log(`🔖 Fetching category by slug: ${slug}`);
  
  try {
    const params = {
      content_type: CONTENT_TYPE.CATEGORY,
      'fields.slug': slug,
      limit: 1,
    };

    const data = await fetchContentful('/entries', params, ['categories', `category:${slug}`]);
    
    if (data && data.items.length > 0) {
      return data.items[0];
    }
    
    // フォールバック: 従来のクライアント使用
    const client = await getClient();
    const entries = await client.getEntries<Category['fields']>(params);
    return entries.items.length > 0 ? entries.items[0] : null;
    
  } catch (error) {
    console.error(`Error fetching category by slug ${slug}:`, error);
    return null;
  }
});

// カテゴリに属するコンテンツを取得（キャッシュ対応）
export const getContentByCategory = cache(async (categorySlug: string, limit = 10, skip = 0) => {
  console.log(`📂 Fetching content by category slug: ${categorySlug}`);

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

  try {
    const categoryTags = ['content', 'categories', `category:${categorySlug}`];
    
    // カテゴリに属する記事を取得
    const articlesParams = {
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.ARTICLE,
      'fields.category.sys.id': category.sys.id,
      order: '-sys.createdAt',
      limit,
      skip,
      include: 2,
    };
    
    const articles = await fetchContentful('/entries', articlesParams, [...categoryTags, 'articles']) || 
                    await (async () => {
                      const client = await getClient();
                      return await client.getEntries<Content['fields']>(articlesParams);
                    })();

    // カテゴリに属する動画を取得
    const videosParams = {
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.VIDEO,
      'fields.category.sys.id': category.sys.id,
      order: '-sys.createdAt',
      limit,
      skip,
      include: 2,
    };
    
    const videos = await fetchContentful('/entries', videosParams, [...categoryTags, 'videos']) || 
                   await (async () => {
                     const client = await getClient();
                     return await client.getEntries<Content['fields']>(videosParams);
                   })();

    // カテゴリに属する音声を取得
    const audiosParams = {
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.AUDIO,
      'fields.category.sys.id': category.sys.id,
      order: '-sys.createdAt',
      limit,
      skip,
      include: 2,
    };
    
    const audios = await fetchContentful('/entries', audiosParams, [...categoryTags, 'audios']) || 
                   await (async () => {
                     const client = await getClient();
                     return await client.getEntries<Content['fields']>(audiosParams);
                   })();

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
});

// 特定のスラッグのコンテンツを取得（キャッシュ対応）
export const getContentBySlug = cache(async (slug: string, contentType: string = 'article'): Promise<Content | null> => {
  console.log(`🔍 Fetching content by slug: ${slug}, type: ${contentType}`);
  
  try {
    // contentTypeに応じたフィルタリング
    let contentTypeFilter;
    switch (contentType) {
      case 'article':
        contentTypeFilter = CONTENT_TYPES.ARTICLE;
        break;
      case 'video':
        contentTypeFilter = CONTENT_TYPES.VIDEO;
        break;
      case 'audio':
        contentTypeFilter = CONTENT_TYPES.AUDIO;
        break;
      default:
        contentTypeFilter = CONTENT_TYPES.ARTICLE;
    }

    const params = {
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': contentTypeFilter,
      'fields.slug': slug,
      include: 3,
      limit: 1,
    };

    const data = await fetchContentful('/entries', params, ['content', contentType, `${contentType}:${slug}`]);
    
    if (data && data.items.length > 0) {
      return data.items[0];
    }
    
    // フォールバック: 従来のクライアント使用
    const client = await getClient();
    const entries = await client.getEntries<Content['fields']>(params);
    return entries.items.length > 0 ? entries.items[0] : null;
    
  } catch (error) {
    console.error(`Error fetching content by slug ${slug}:`, error);
    return null;
  }
});

// 関連コンテンツを取得（キャッシュ対応）
export const getRelatedContents = cache(async (contentId: string): Promise<Content[]> => {
  console.log(`🔗 Fetching related contents for: ${contentId}`);
  
  try {
    const params = {
      content_type: CONTENT_TYPE.CONTENT,
      'fields.relatedContents.sys.id': contentId,
      include: 2,
    };

    const data = await fetchContentful('/entries', params, ['content', 'related', `related:${contentId}`]);
    
    if (data) {
      return data.items as Content[];
    }
    
    // フォールバック: 従来のクライアント使用
    const client = await getClient();
    const entries = await client.getEntries<Content['fields']>(params);
    return entries.items as Content[];
    
  } catch (error) {
    console.error(`Error fetching related contents for ${contentId}:`, error);
    return [];
  }
});

// キーワード検索（キャッシュ対応）
export const searchContent = cache(async (query: string, limit = 10, skip = 0) => {
  console.log(`🔍 Searching content with query: "${query}", limit: ${limit}, skip: ${skip}`);

  try {
    const searchTags = ['content', 'search', `search:${query.toLowerCase().replace(/\s+/g, '-')}`];
    
    // 記事を検索
    const articlesParams = {
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.ARTICLE,
      query,
      order: '-sys.createdAt',
      limit,
      skip,
      include: 2,
    };
    
    const articles = await fetchContentful('/entries', articlesParams, [...searchTags, 'articles']) || 
                    await (async () => {
                      const client = await getClient();
                      return await client.getEntries<Content['fields']>(articlesParams);
                    })();

    // 動画を検索
    const videosParams = {
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.VIDEO,
      query,
      order: '-sys.createdAt',
      limit,
      skip,
      include: 2,
    };
    
    const videos = await fetchContentful('/entries', videosParams, [...searchTags, 'videos']) || 
                   await (async () => {
                     const client = await getClient();
                     return await client.getEntries<Content['fields']>(videosParams);
                   })();

    // 音声を検索
    const audiosParams = {
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.AUDIO,
      query,
      order: '-sys.createdAt',
      limit,
      skip,
      include: 2,
    };
    
    const audios = await fetchContentful('/entries', audiosParams, [...searchTags, 'audios']) || 
                   await (async () => {
                     const client = await getClient();
                     return await client.getEntries<Content['fields']>(audiosParams);
                   })();

    return { articles, videos, audios };
    
  } catch (error) {
    console.error(`Error searching content with query "${query}":`, error);
    return {
      articles: { items: [], total: 0, skip: 0, limit, includes: {} },
      videos: { items: [], total: 0, skip: 0, limit, includes: {} },
      audios: { items: [], total: 0, skip: 0, limit, includes: {} },
    };
  }
});
