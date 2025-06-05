import { Metadata } from 'next';
import { getMdxBySlug, renderContentfulMdx } from '@/utils/mdx-utils';
import MDXRenderer from '@/components/MDXRenderer';
import Link from 'next/link';
import EnhancedTableOfContents from '@/components/EnhancedTableOfContents';

import RelatedContents from '@/components/RelatedContents';
import DownloadSection from '@/components/DownloadSection';
import ContentfulRichText from '@/components/ContentfulRichText';
import Image from 'next/image';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // paramsを非同期で解決
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;

  try {
    // まずContentfulからコンテンツを取得
    const contentfulData = await renderContentfulMdx(slug);

    // タイトルを取得（frontMatterから直接取得）
    const title = contentfulData.frontMatter.title || 'タイトルなし';
    const description = contentfulData.frontMatter.description || `${title}に関する記事`;

    return {
      title: `${title} | ビジネススキル百科`,
      description,
      openGraph: {
        title: `${title} | ビジネススキル百科`,
        description,
        images: contentfulData.frontMatter.featuredImage ? [
          {
            url: contentfulData.frontMatter.featuredImage.url,
            width: contentfulData.frontMatter.featuredImage.width,
            height: contentfulData.frontMatter.featuredImage.height,
            alt: contentfulData.frontMatter.featuredImage.title || title,
          }
        ] : [],
      },
    };
  } catch (error) {
    console.error(`Error generating metadata for ${slug}:`, error);

    // Contentfulからの取得に失敗した場合はファイルシステムから取得
    try {
      const { frontMatter, content } = getMdxBySlug(slug);

      // タイトルを抽出（最初の見出しを使用）
      const titleMatch = content.match(/^# (.+)$/m);
      const title = titleMatch ? titleMatch[1] : frontMatter.title || slug;

      return {
        title: `${title} | ビジネススキル百科`,
        description: frontMatter.description || `${title}に関する記事`,
      };
    } catch (fallbackError) {
      console.error(`Fallback metadata generation failed for ${slug}:`, fallbackError);

      return {
        title: `${slug} | ビジネススキル百科`,
        description: `${slug}に関する記事`,
      };
    }
  }
}

export default async function MdxArticlePage({ params }: Props) {
  // paramsを非同期で解決
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;

  try {
    // まずContentfulからコンテンツを取得
    const { content, mdxContent, frontMatter, relatedContents, downloadableFiles } = await renderContentfulMdx(slug);

    // bodyから目次を生成（EnhancedTableOfContentsコンポーネント内で処理）

    // カテゴリーに応じたグラデーションクラスを設定
    const gradientClass = 'from-blue-400 via-sky-500 to-indigo-600';

    return (
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl flex justify-center">
        <div className="w-full max-w-[800px]">
          {/* パンくずリスト - モバイルとPC共通 */}
          <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600">
              ホーム
            </Link>
            <span className="mx-2">&gt;</span>
            <Link href="/mdx-articles" className="hover:text-blue-600">
              記事一覧
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-700">{frontMatter.title}</span>
          </div>

          {/* アイキャッチ画像 */}
          {frontMatter.featuredImage && (
            <div className="mb-6 relative w-full aspect-video rounded-lg overflow-hidden">
              <Image
                src={frontMatter.featuredImage.url}
                alt={frontMatter.featuredImage.title || frontMatter.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* 記事ヘッダー */}
          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">{frontMatter.title}</h1>
            {frontMatter.description && (
              <p className="text-base md:text-lg text-gray-600 mb-3">{frontMatter.description}</p>
            )}
            <div className="flex flex-wrap items-center text-sm text-gray-600">
              {frontMatter.category && (
                <span className={`px-3 py-1 rounded-full text-white bg-gradient-to-r ${gradientClass} mr-3 mb-2`}>
                  {frontMatter.category}
                </span>
              )}
              {frontMatter.publishDate && (
                <span className="mr-4 mb-2">
                  公開日: {new Date(frontMatter.publishDate).toLocaleDateString('ja-JP')}
                </span>
              )}
              {frontMatter.author && (
                <span className="mb-2">
                  著者: {frontMatter.author}
                </span>
              )}
            </div>
          </header>

          {/* 目次 */}
          <div className="mb-6">
            <EnhancedTableOfContents content={content} type="main" />
          </div>

          {/* 記事本文 */}
          <article className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            {content ? (
              // Contentfulのリッチテキストコンテンツを優先的に表示
              <ContentfulRichText content={content} />
            ) : mdxContent ? (
              // フォールバック: MDXコンテンツを表示
              <div className="prose prose-base md:prose-lg max-w-none">
                {mdxContent}
              </div>
            ) : (
              // 最終フォールバック: エラーメッセージ
              <div className="prose prose-base md:prose-lg max-w-none">
                <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                  <p className="text-yellow-800">コンテンツが見つかりません。</p>
                </div>
              </div>
            )}
          </article>

          {/* ダウンロードファイル */}
          {downloadableFiles && downloadableFiles.length > 0 && (
            <DownloadSection files={downloadableFiles} />
          )}

          {/* 関連コンテンツ */}
          {relatedContents && relatedContents.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">関連コンテンツ</h2>
              <RelatedContents contents={relatedContents} />
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    // Contentfulからの取得に失敗した場合はファイルシステムから取得
    const { content } = getMdxBySlug(slug);

    // 記事の内容からTOCを生成（EnhancedTableOfContentsコンポーネント内で処理）

    // カテゴリーに応じたグラデーションクラスを設定
    const gradientClass = 'from-blue-400 via-sky-500 to-indigo-600';

    return (
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl flex justify-center">
        <div className="w-full max-w-[800px]">
          {/* パンくずリスト - モバイルとPC共通 */}
          <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600">
              ホーム
            </Link>
            <span className="mx-2">&gt;</span>
            <Link href="/mdx-articles" className="hover:text-blue-600">
              記事一覧
            </Link>
          </div>

          {/* 目次 */}
          <div className="mb-6">
            <EnhancedTableOfContents content={content} type="main" />
          </div>

          {/* 記事本文 */}
          <article className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <div className="prose prose-base md:prose-lg max-w-none">
              <MDXRenderer content={content} />
            </div>
          </article>
        </div>
      </div>
    );
  }
}

// 静的ページ生成のためのパスを取得
export async function generateStaticParams() {
  try {
    // Contentfulから記事を取得
    const { getClient } = await import('@/lib/api');
    const client = await getClient();

    const { CONTENT_TYPE } = await import('@/lib/contentful');
    const { CONTENT_TYPES } = await import('@/lib/types');

    const entries = await client.getEntries({
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.ARTICLE,
      select: ['fields.slug'],
      limit: 1000, // 十分な数を取得
    });

    // slugが有効な記事のみを返す
    const validArticles = entries.items.filter(
      (article: any) => article?.fields?.slug && typeof article.fields.slug === 'string'
    );

    console.log(`Generating static params for ${validArticles.length} MDX articles`);

    return validArticles.map((article: any) => ({
      slug: article.fields.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for MDX articles:', error);
    // エラーが発生した場合は空の配列を返す
    return [];
  }
}
