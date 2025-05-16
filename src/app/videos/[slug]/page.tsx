import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVideoBySlug, getVideos } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import VideoPlayer from "@/components/VideoPlayer";
import { renderContentfulMdx } from "@/utils/mdx-utils";
import MDXRenderer from "@/components/MDXRenderer";
import RelatedContents from "@/components/RelatedContents";

// 1時間ごとに再検証
export const revalidate = 3600;

// 動的メタデータ
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // paramsを非同期で解決
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;

  const video = await getVideoBySlug(slug);

  if (!video) {
    return {
      title: "動画が見つかりません | ビジネススキル百科",
    };
  }

  return {
    title: `${video.fields.title} | ビジネススキル百科`,
    description: video.fields.seoDescription || `${video.fields.title}に関する動画です。`,
  };
}

// 静的パスの生成
export async function generateStaticParams() {
  try {
    const videosData = await getVideos(100); // 最新100件の動画のスラッグを生成

    return videosData.items.map((video) => ({
      slug: video.fields.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for videos:', error);
    return [];
  }
}

export default async function VideoPage({
  params,
}: {
  params: { slug: string };
}) {
  // paramsを非同期で解決
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;

  try {
    // まずContentfulからコンテンツを取得（MDXコンテンツも含む）
    const { frontMatter, mdxContent, content, relatedContents } = await renderContentfulMdx(slug, 'video');

    // 通常のAPIからも動画情報を取得
    const video = await getVideoBySlug(slug);

    // 動画が見つからない場合は404ページを表示
    if (!video && !frontMatter.title) {
      notFound();
    }

    // 動画情報を優先的に使用
    const title = video?.fields.title || frontMatter.title;
    const publishDate = video?.fields.publishDate || frontMatter.publishDate;
    const videoUrl = video?.fields.videoUrlEmbed || frontMatter.videoUrl;
    const description = video?.fields.description || frontMatter.description;
    const category = video?.fields.category || null;
    const tags = video?.fields.tags || [];

    // カテゴリーに応じたグラデーションクラスを設定
    const gradientClass = 'from-purple-400 via-pink-500 to-red-600';

    return (
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        <article>
          {/* 動画ヘッダー */}
          <header className="mb-6">
            {/* カテゴリとパンくずリスト */}
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-blue-600">
                ホーム
              </Link>
              <span className="mx-2">&gt;</span>
              <Link href="/videos" className="hover:text-blue-600">
                動画一覧
              </Link>
              {category && category.fields && category.fields.slug && (
                <>
                  <span className="mx-2">&gt;</span>
                  <Link
                    href={`/categories/${category.fields.slug}`}
                    className="hover:text-blue-600"
                  >
                    {category.fields.name}
                  </Link>
                </>
              )}
            </div>

            {/* タイトル */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">{title}</h1>

            {/* 説明文（短い） */}
            {description && (
              <p className="text-base md:text-lg text-gray-600 mb-3">{description}</p>
            )}

            {/* メタ情報 */}
            <div className="flex flex-wrap items-center text-sm text-gray-600">
              {frontMatter.category && (
                <span className={`px-3 py-1 rounded-full text-white bg-gradient-to-r ${gradientClass} mr-3 mb-2`}>
                  {frontMatter.category}
                </span>
              )}
              {publishDate && (
                <span className="mr-4 mb-2">
                  公開日: {formatDate(publishDate)}
                </span>
              )}
              {frontMatter.author && (
                <span className="mb-2">
                  著者: {frontMatter.author}
                </span>
              )}
            </div>
          </header>

          {/* 動画プレーヤー */}
          <div className="mb-8">
            <VideoPlayer videoUrl={videoUrl} title={title} />
          </div>

          {/* MDXコンテンツがある場合は表示 */}
          {(mdxContent || content) && (
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">解説</h2>
              <div className="prose prose-base md:prose-lg max-w-none">
                {mdxContent ? (
                  <>{mdxContent}</>
                ) : (
                  content ? <MDXRenderer content={content} /> : <p className="whitespace-pre-line">{description}</p>
                )}
              </div>
            </div>
          )}

          {/* 通常の説明文（MDXコンテンツがない場合） */}
          {!mdxContent && !content && description && (
            <div className="prose prose-base md:prose-lg max-w-none mb-8">
              <h2 className="text-xl font-bold mb-4">概要</h2>
              <p className="whitespace-pre-line">{description}</p>
            </div>
          )}

          {/* タグ */}
          {tags && tags.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-2">関連タグ</h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag.sys.id}
                    href={`/tags/${tag.fields.slug}`}
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    {tag.fields.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 関連コンテンツ */}
          {relatedContents && relatedContents.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">関連コンテンツ</h2>
              <RelatedContents contents={relatedContents} />
            </div>
          )}
        </article>
      </div>
    );
  } catch (error) {
    console.error(`動画ページの表示中にエラーが発生しました: ${error}`);

    // 通常のAPIから動画情報を取得
    const video = await getVideoBySlug(slug);

    // 動画が見つからない場合は404ページを表示
    if (!video) {
      notFound();
    }

    const {
      title,
      publishDate,
      videoUrlEmbed,
      description,
      category,
      tags,
    } = video.fields;

    return (
      <div className="container mx-auto px-4 py-8">
        <article>
          {/* 動画ヘッダー */}
          <header className="mb-8">
            {/* カテゴリとパンくずリスト */}
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-blue-600">
                ホーム
              </Link>
              <span className="mx-2">&gt;</span>
              <Link href="/videos" className="hover:text-blue-600">
                動画一覧
              </Link>
              {category && category.fields && category.fields.slug && (
                <>
                  <span className="mx-2">&gt;</span>
                  <Link
                    href={`/categories/${category.fields.slug}`}
                    className="hover:text-blue-600"
                  >
                    {category.fields.name}
                  </Link>
                </>
              )}
            </div>

            {/* タイトル */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>

            {/* 公開日 */}
            <div className="mb-6">
              <time dateTime={publishDate} className="text-gray-500">
                {formatDate(publishDate)}
              </time>
            </div>
          </header>

          {/* 動画プレーヤー */}
          <div className="mb-8">
            <VideoPlayer videoUrl={videoUrlEmbed} title={title} />
          </div>

          {/* 動画の説明 */}
          <div className="prose prose-lg max-w-none mb-8">
            <h2 className="text-2xl font-bold mb-4">概要</h2>
            <p className="whitespace-pre-line">{description}</p>
          </div>

          {/* タグ */}
          {tags && tags.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-2">関連タグ</h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag.sys.id}
                    href={`/tags/${tag.fields.slug}`}
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    {tag.fields.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    );
  }
}
