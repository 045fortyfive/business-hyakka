import { contentfulClient } from './contentful';
import { CONTENT_TYPE } from './contentful';
import { createClient } from 'contentful';
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
    // モックデータは使用しない
    console.log('モックデータは使用しません。Contentfulから実データを取得します。');

    // Contentfulのクエリパラメータを表示
    console.log('Query parameters:', {
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.ARTICLE,
      order: '-sys.createdAt',
      limit,
      skip,
      include: 2,
    });

    // Contentfulクライアントの再作成（環境変数が正しく読み込まれていない場合に備えて）
    const client = createContentfulClient();

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
    } else {
      console.log('No articles found');
    }

    return response;
  } catch (error) {
    console.error('Error fetching articles:', error);
    // エラーが発生した場合は空のレスポンスを返す
    console.log('エラーが発生したため、空のレスポンスを返します');
    return {
      items: [],
      total: 0,
      skip: 0,
      limit: limit,
      includes: {},
    } as ContentCollection;
  }
}

// Contentfulクライアントを再作成する関数
function createContentfulClient() {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
  const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master';

  console.log('Creating new Contentful client with:');
  console.log('- Space ID:', spaceId);
  console.log('- Access Token:', accessToken ? `設定済み (${accessToken.substring(0, 5)}...)` : '未設定');
  console.log('- Environment:', environment);

  if (!spaceId || !accessToken) {
    throw new Error('Contentfulの設定が不完全です。環境変数を確認してください。');
  }

  return createClient({
    space: spaceId,
    accessToken: accessToken,
    environment: environment,
  });
}

// モック記事データを生成する関数
function getMockArticles(limit = 10, skip = 0): ContentCollection {
  // モックカテゴリの作成
  const mockCategory = {
    sys: {
      id: 'mock-category-1',
      type: 'Entry',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      contentType: {
        sys: {
          id: 'category',
          type: 'Link',
          linkType: 'ContentType'
        }
      }
    },
    fields: {
      name: 'ビジネススキル',
      slug: 'business-skills',
      description: 'ビジネスに必要な基本的なスキルに関する記事'
    }
  };

  // モック記事の作成
  const mockArticles = Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
    sys: {
      id: `mock-article-${i + 1 + skip}`,
      type: 'Entry',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      contentType: {
        sys: {
          id: 'content',
          type: 'Link',
          linkType: 'ContentType'
        }
      }
    },
    fields: {
      title: `モック記事 ${i + 1 + skip}`,
      slug: `mock-article-${i + 1 + skip}`,
      contentType: [CONTENT_TYPES.ARTICLE],
      description: `これはモック記事 ${i + 1 + skip} の説明です。`,
      category: [mockCategory],
      body: {
        nodeType: 'document',
        data: {},
        content: [
          {
            nodeType: 'paragraph',
            data: {},
            content: [
              {
                nodeType: 'text',
                value: `これはモック記事 ${i + 1 + skip} の本文です。`,
                marks: [],
                data: {}
              }
            ]
          }
        ]
      }
    }
  }));

  return {
    items: mockArticles,
    total: 10,
    skip,
    limit,
    includes: {
      Entry: [mockCategory]
    }
  } as ContentCollection;
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
    // モックデータは使用しない
    console.log('モックデータは使用しません。Contentfulから実データを取得します（動画）');

    // Contentfulクライアントの再作成
    const client = createContentfulClient();

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
    console.log('エラーが発生したため、空のレスポンスを返します（動画）');
    return {
      items: [],
      total: 0,
      skip: 0,
      limit: limit,
      includes: {},
    } as ContentCollection;
  }
}

// モック動画データを生成する関数
function getMockVideos(limit = 10, skip = 0): ContentCollection {
  // モックカテゴリの作成
  const mockCategory = {
    sys: {
      id: 'mock-category-2',
      type: 'Entry',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      contentType: {
        sys: {
          id: 'category',
          type: 'Link',
          linkType: 'ContentType'
        }
      }
    },
    fields: {
      name: 'プレゼンテーション',
      slug: 'presentation',
      description: 'プレゼンテーションスキルに関する動画'
    }
  };

  // モック動画の作成
  const mockVideos = Array.from({ length: Math.min(limit, 3) }, (_, i) => ({
    sys: {
      id: `mock-video-${i + 1 + skip}`,
      type: 'Entry',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      contentType: {
        sys: {
          id: 'content',
          type: 'Link',
          linkType: 'ContentType'
        }
      }
    },
    fields: {
      title: `モック動画 ${i + 1 + skip}`,
      slug: `mock-video-${i + 1 + skip}`,
      contentType: [CONTENT_TYPES.VIDEO],
      description: `これはモック動画 ${i + 1 + skip} の説明です。`,
      category: [mockCategory],
      videoUrl: `https://www.example.com/videos/mock-video-${i + 1 + skip}`
    }
  }));

  return {
    items: mockVideos,
    total: 5,
    skip,
    limit,
    includes: {
      Entry: [mockCategory]
    }
  } as ContentCollection;
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
    // モックデータは使用しない
    console.log('モックデータは使用しません。Contentfulから実データを取得します（音声）');

    // Contentfulクライアントの再作成
    const client = createContentfulClient();

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
    console.log('エラーが発生したため、空のレスポンスを返します（音声）');
    return {
      items: [],
      total: 0,
      skip: 0,
      limit: limit,
      includes: {},
    } as ContentCollection;
  }
}

// モック音声データを生成する関数
function getMockAudios(limit = 10, skip = 0): ContentCollection {
  // モックカテゴリの作成
  const mockCategory = {
    sys: {
      id: 'mock-category-3',
      type: 'Entry',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      contentType: {
        sys: {
          id: 'category',
          type: 'Link',
          linkType: 'ContentType'
        }
      }
    },
    fields: {
      name: 'コミュニケーション',
      slug: 'communication',
      description: 'コミュニケーションスキルに関する音声コンテンツ'
    }
  };

  // モック音声の作成
  const mockAudios = Array.from({ length: Math.min(limit, 3) }, (_, i) => ({
    sys: {
      id: `mock-audio-${i + 1 + skip}`,
      type: 'Entry',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      contentType: {
        sys: {
          id: 'content',
          type: 'Link',
          linkType: 'ContentType'
        }
      }
    },
    fields: {
      title: `モック音声 ${i + 1 + skip}`,
      slug: `mock-audio-${i + 1 + skip}`,
      contentType: [CONTENT_TYPES.AUDIO],
      description: `これはモック音声 ${i + 1 + skip} の説明です。`,
      category: [mockCategory],
      audioUrl: `https://www.example.com/audios/mock-audio-${i + 1 + skip}`
    }
  }));

  return {
    items: mockAudios,
    total: 5,
    skip,
    limit,
    includes: {
      Entry: [mockCategory]
    }
  } as ContentCollection;
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
    // モックデータは使用しない
    console.log('モックデータは使用しません。Contentfulから実データを取得します（カテゴリ）');

    // Contentfulクライアントの再作成
    const client = createContentfulClient();

    const response = await client.getEntries<Category['fields']>({
      content_type: CONTENT_TYPE.CATEGORY,
      order: 'fields.name',
    });
    console.log(`Fetched ${response.items.length} categories out of ${response.total}`);
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    console.log('エラーが発生したため、空のレスポンスを返します（カテゴリ）');
    return {
      items: [],
      total: 0,
      skip: 0,
      limit: 100,
      includes: {},
    } as CategoryCollection;
  }
}

// モックカテゴリデータを生成する関数
function getMockCategories(): CategoryCollection {
  // モックカテゴリの作成
  const mockCategories = [
    {
      sys: {
        id: 'mock-category-1',
        type: 'Entry',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contentType: {
          sys: {
            id: 'category',
            type: 'Link',
            linkType: 'ContentType'
          }
        }
      },
      fields: {
        name: 'ビジネススキル',
        slug: 'business-skills',
        description: 'ビジネスに必要な基本的なスキルに関する記事'
      }
    },
    {
      sys: {
        id: 'mock-category-2',
        type: 'Entry',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contentType: {
          sys: {
            id: 'category',
            type: 'Link',
            linkType: 'ContentType'
          }
        }
      },
      fields: {
        name: 'プレゼンテーション',
        slug: 'presentation',
        description: 'プレゼンテーションスキルに関する動画'
      }
    },
    {
      sys: {
        id: 'mock-category-3',
        type: 'Entry',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contentType: {
          sys: {
            id: 'category',
            type: 'Link',
            linkType: 'ContentType'
          }
        }
      },
      fields: {
        name: 'コミュニケーション',
        slug: 'communication',
        description: 'コミュニケーションスキルに関する音声コンテンツ'
      }
    },
    {
      sys: {
        id: 'mock-category-4',
        type: 'Entry',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contentType: {
          sys: {
            id: 'category',
            type: 'Link',
            linkType: 'ContentType'
          }
        }
      },
      fields: {
        name: 'マネジメント',
        slug: 'management',
        description: 'マネジメントスキルに関するコンテンツ'
      }
    }
  ];

  return {
    items: mockCategories,
    total: mockCategories.length,
    skip: 0,
    limit: 100,
    includes: {}
  } as CategoryCollection;
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
