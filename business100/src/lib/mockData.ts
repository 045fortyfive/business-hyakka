import { ArticleCollection, VideoCollection, AudioCollection, CategoryCollection } from './types';

// モックカテゴリデータ
export const mockCategories: CategoryCollection = {
  total: 4,
  skip: 0,
  limit: 100,
  items: [
    {
      sys: {
        id: 'category1',
        type: 'Entry',
        contentType: {
          sys: {
            id: 'category',
            type: 'Link',
            linkType: 'ContentType',
          },
        },
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      fields: {
        name: '基本ビジネススキル',
        slug: 'basic-business-skills',
        description: 'ビジネスの基本となるスキルを学びましょう。',
      },
    },
    {
      sys: {
        id: 'category2',
        type: 'Entry',
        contentType: {
          sys: {
            id: 'category',
            type: 'Link',
            linkType: 'ContentType',
          },
        },
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      fields: {
        name: 'コミュニケーション',
        slug: 'communication',
        description: 'ビジネスにおけるコミュニケーションスキルを向上させましょう。',
      },
    },
    {
      sys: {
        id: 'category3',
        type: 'Entry',
        contentType: {
          sys: {
            id: 'category',
            type: 'Link',
            linkType: 'ContentType',
          },
        },
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      fields: {
        name: 'マネジメント',
        slug: 'management',
        description: 'チームや組織のマネジメントスキルを学びましょう。',
      },
    },
    {
      sys: {
        id: 'category4',
        type: 'Entry',
        contentType: {
          sys: {
            id: 'category',
            type: 'Link',
            linkType: 'ContentType',
          },
        },
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      fields: {
        name: '業務改善',
        slug: 'business-improvement',
        description: '業務効率化や改善のためのスキルを学びましょう。',
      },
    },
  ],
};

// モック著者データ
const mockAuthor = {
  sys: {
    id: 'author1',
    type: 'Entry',
    contentType: {
      sys: {
        id: 'author',
        type: 'Link',
        linkType: 'ContentType',
      },
    },
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
  fields: {
    name: '山田 太郎',
    bio: 'ビジネススキルトレーナー。10年以上の経験を持つ。',
  },
};

// モックタグデータ
const mockTags = [
  {
    sys: {
      id: 'tag1',
      type: 'Entry',
      contentType: {
        sys: {
          id: 'tag',
          type: 'Link',
          linkType: 'ContentType',
        },
      },
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    fields: {
      name: 'ビジネスマナー',
      slug: 'business-manner',
    },
  },
  {
    sys: {
      id: 'tag2',
      type: 'Entry',
      contentType: {
        sys: {
          id: 'tag',
          type: 'Link',
          linkType: 'ContentType',
        },
      },
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    fields: {
      name: 'プレゼンテーション',
      slug: 'presentation',
    },
  },
];

// モック記事データ
export const mockArticles: ArticleCollection = {
  total: 3,
  skip: 0,
  limit: 3,
  items: [
    {
      sys: {
        id: 'article1',
        type: 'Entry',
        contentType: {
          sys: {
            id: 'article',
            type: 'Link',
            linkType: 'ContentType',
          },
        },
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      fields: {
        title: 'ビジネスメールの書き方入門',
        slug: 'business-email-basics',
        publishDate: '2023-05-01T00:00:00.000Z',
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
                  value: 'ビジネスメールの基本的な書き方について解説します。',
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
        category: mockCategories.items[0],
        tags: [mockTags[0]],
        author: mockAuthor,
        seoDescription: 'ビジネスメールの基本的な書き方を学びましょう。',
      },
    },
    {
      sys: {
        id: 'article2',
        type: 'Entry',
        contentType: {
          sys: {
            id: 'article',
            type: 'Link',
            linkType: 'ContentType',
          },
        },
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      fields: {
        title: '効果的なプレゼンテーションの作り方',
        slug: 'effective-presentation',
        publishDate: '2023-05-15T00:00:00.000Z',
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
                  value: '効果的なプレゼンテーションの作り方について解説します。',
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
        category: mockCategories.items[1],
        tags: [mockTags[1]],
        author: mockAuthor,
        seoDescription: '効果的なプレゼンテーションの作り方を学びましょう。',
      },
    },
    {
      sys: {
        id: 'article3',
        type: 'Entry',
        contentType: {
          sys: {
            id: 'article',
            type: 'Link',
            linkType: 'ContentType',
          },
        },
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      fields: {
        title: 'チームマネジメントの基本',
        slug: 'team-management-basics',
        publishDate: '2023-06-01T00:00:00.000Z',
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
                  value: 'チームマネジメントの基本について解説します。',
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
        category: mockCategories.items[2],
        tags: [mockTags[0], mockTags[1]],
        author: mockAuthor,
        seoDescription: 'チームマネジメントの基本を学びましょう。',
      },
    },
  ],
};

// モック動画データ
export const mockVideos: VideoCollection = {
  total: 3,
  skip: 0,
  limit: 3,
  items: [
    {
      sys: {
        id: 'video1',
        type: 'Entry',
        contentType: {
          sys: {
            id: 'video',
            type: 'Link',
            linkType: 'ContentType',
          },
        },
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      fields: {
        title: 'ビジネスマナー講座',
        slug: 'business-manner-course',
        publishDate: '2023-05-10T00:00:00.000Z',
        videoUrlEmbed: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        description: 'ビジネスマナーの基本について学びます。',
        category: mockCategories.items[0],
        tags: [mockTags[0]],
        thumbnail: {
          sys: {
            id: 'asset1',
            type: 'Asset',
          },
          fields: {
            title: 'ビジネスマナー講座サムネイル',
            file: {
              url: '//images.ctfassets.net/vxy009lryi3x/asset1/image.jpg',
              details: {
                size: 12345,
                image: {
                  width: 1280,
                  height: 720,
                },
              },
              fileName: 'business-manner.jpg',
              contentType: 'image/jpeg',
            },
          },
        },
        seoDescription: 'ビジネスマナーの基本を学ぶ動画講座です。',
      },
    },
    {
      sys: {
        id: 'video2',
        type: 'Entry',
        contentType: {
          sys: {
            id: 'video',
            type: 'Link',
            linkType: 'ContentType',
          },
        },
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      fields: {
        title: 'プレゼンテーションスキル向上講座',
        slug: 'presentation-skills',
        publishDate: '2023-05-20T00:00:00.000Z',
        videoUrlEmbed: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        description: 'プレゼンテーションスキルを向上させるためのテクニックを学びます。',
        category: mockCategories.items[1],
        tags: [mockTags[1]],
        thumbnail: {
          sys: {
            id: 'asset2',
            type: 'Asset',
          },
          fields: {
            title: 'プレゼンテーションスキル講座サムネイル',
            file: {
              url: '//images.ctfassets.net/vxy009lryi3x/asset2/image.jpg',
              details: {
                size: 12345,
                image: {
                  width: 1280,
                  height: 720,
                },
              },
              fileName: 'presentation-skills.jpg',
              contentType: 'image/jpeg',
            },
          },
        },
        seoDescription: 'プレゼンテーションスキルを向上させるための動画講座です。',
      },
    },
    {
      sys: {
        id: 'video3',
        type: 'Entry',
        contentType: {
          sys: {
            id: 'video',
            type: 'Link',
            linkType: 'ContentType',
          },
        },
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      fields: {
        title: 'リーダーシップ講座',
        slug: 'leadership-course',
        publishDate: '2023-06-05T00:00:00.000Z',
        videoUrlEmbed: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        description: 'リーダーシップの基本と実践方法について学びます。',
        category: mockCategories.items[2],
        tags: [mockTags[0], mockTags[1]],
        thumbnail: {
          sys: {
            id: 'asset3',
            type: 'Asset',
          },
          fields: {
            title: 'リーダーシップ講座サムネイル',
            file: {
              url: '//images.ctfassets.net/vxy009lryi3x/asset3/image.jpg',
              details: {
                size: 12345,
                image: {
                  width: 1280,
                  height: 720,
                },
              },
              fileName: 'leadership.jpg',
              contentType: 'image/jpeg',
            },
          },
        },
        seoDescription: 'リーダーシップの基本と実践方法を学ぶ動画講座です。',
      },
    },
  ],
};

// モック音声データ
export const mockAudios: AudioCollection = {
  total: 3,
  skip: 0,
  limit: 3,
  items: [
    {
      sys: {
        id: 'audio1',
        type: 'Entry',
        contentType: {
          sys: {
            id: 'audio',
            type: 'Link',
            linkType: 'ContentType',
          },
        },
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      fields: {
        title: 'ビジネスマナーポッドキャスト',
        slug: 'business-manner-podcast',
        publishDate: '2023-05-05T00:00:00.000Z',
        audioUrl: 'https://example.com/audio/business-manner.mp3',
        description: 'ビジネスマナーについて解説するポッドキャストです。',
        category: mockCategories.items[0],
        tags: [mockTags[0]],
        seoDescription: 'ビジネスマナーについて解説するポッドキャストです。',
      },
    },
    {
      sys: {
        id: 'audio2',
        type: 'Entry',
        contentType: {
          sys: {
            id: 'audio',
            type: 'Link',
            linkType: 'ContentType',
          },
        },
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      fields: {
        title: 'コミュニケーションスキルアップポッドキャスト',
        slug: 'communication-skills-podcast',
        publishDate: '2023-05-25T00:00:00.000Z',
        audioUrl: 'https://example.com/audio/communication-skills.mp3',
        description: 'コミュニケーションスキルを向上させるためのポッドキャストです。',
        category: mockCategories.items[1],
        tags: [mockTags[1]],
        seoDescription: 'コミュニケーションスキルを向上させるためのポッドキャストです。',
      },
    },
    {
      sys: {
        id: 'audio3',
        type: 'Entry',
        contentType: {
          sys: {
            id: 'audio',
            type: 'Link',
            linkType: 'ContentType',
          },
        },
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      fields: {
        title: 'マネジメントスキルポッドキャスト',
        slug: 'management-skills-podcast',
        publishDate: '2023-06-10T00:00:00.000Z',
        audioUrl: 'https://example.com/audio/management-skills.mp3',
        description: 'マネジメントスキルを向上させるためのポッドキャストです。',
        category: mockCategories.items[2],
        tags: [mockTags[0], mockTags[1]],
        seoDescription: 'マネジメントスキルを向上させるためのポッドキャストです。',
      },
    },
  ],
};
