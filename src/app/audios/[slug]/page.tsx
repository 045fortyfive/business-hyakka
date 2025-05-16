import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAudioBySlug, getAudios } from "@/lib/api";
import { formatDate, getImageProps } from "@/lib/utils";
import AudioPlayer from "@/components/AudioPlayer";
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

  const audio = await getAudioBySlug(slug);

  if (!audio) {
    return {
      title: "音声が見つかりません | ビジネススキル百科",
    };
  }

  return {
    title: `${audio.fields.title} | ビジネススキル百科`,
    description: audio.fields.seoDescription || `${audio.fields.title}に関する音声です。`,
  };
}

// 静的パスの生成
export async function generateStaticParams() {
  try {
    const audiosData = await getAudios(100); // 最新100件の音声のスラッグを生成

    return audiosData.items.map((audio) => ({
      slug: audio.fields.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for audios:', error);
    return [];
  }
}

export default async function AudioPage({
  params,
}: {
  params: { slug: string };
}) {
  // paramsを非同期で解決
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;

  try {
    // まずContentfulからコンテンツを取得（MDXコンテンツも含む）
    const { frontMatter, mdxContent, content, relatedContents } = await renderContentfulMdx(slug, 'audio');

    // 通常のAPIからも音声情報を取得
    const audio = await getAudioBySlug(slug);

    // 音声が見つからない場合は404ページを表示
    if (!audio && !frontMatter.title) {
      notFound();
    }

    // 音声情報を優先的に使用
    const title = audio?.fields.title || frontMatter.title;
    const publishDate = audio?.fields.publishDate || frontMatter.publishDate;
    const audioUrl = audio?.fields.audioUrl || frontMatter.audioUrl;
    const description = audio?.fields.description || frontMatter.description;
    const category = audio?.fields.category || null;
    const tags = audio?.fields.tags || [];
    const thumbnail = audio?.fields.thumbnail || null;

    // カテゴリーに応じたグラデーションクラスを設定
    const gradientClass = 'from-green-400 via-teal-500 to-blue-600';

    return (
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl flex justify-center">
        <div className="w-full max-w-[800px]">
          <article>
            {/* 音声ヘッダー */}
            <header className="mb-6">
              {/* カテゴリとパンくずリスト */}
              <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
                <Link href="/" className="hover:text-blue-600">
                  ホーム
                </Link>
                <span className="mx-2">&gt;</span>
                <Link href="/audios" className="hover:text-blue-600">
                  音声一覧
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

            {/* サムネイル画像（あれば） */}
            {thumbnail && (
              <div className="mb-6">
                <Image
                  src={`https:${thumbnail.fields.file.url}`}
                  alt={thumbnail.fields.title || title}
                  width={thumbnail.fields.file.details.image?.width || 800}
                  height={thumbnail.fields.file.details.image?.height || 450}
                  className="rounded-lg w-full aspect-video object-cover"
                />
              </div>
            )}

            {/* 音声プレーヤー */}
            <div className="mb-8">
              <AudioPlayer audioUrl={audioUrl} title={title} />
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
      </div>
    );
  } catch (error) {
    console.error(`音声ページの表示中にエラーが発生しました: ${error}`);

    // 通常のAPIから音声情報を取得
    const audio = await getAudioBySlug(slug);

    // 音声が見つからない場合は404ページを表示
    if (!audio) {
      notFound();
    }

    const {
      title,
      publishDate,
      audioUrl,
      description,
      category,
      tags,
      thumbnail,
    } = audio.fields;

    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl flex justify-center">
        <div className="w-full max-w-[800px]">
          <article>
            {/* 音声ヘッダー */}
            <header className="mb-8">
              {/* カテゴリとパンくずリスト */}
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Link href="/" className="hover:text-blue-600">
                  ホーム
                </Link>
                <span className="mx-2">&gt;</span>
                <Link href="/audios" className="hover:text-blue-600">
                  音声一覧
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

            {/* サムネイル画像（あれば） */}
            {thumbnail && (
              <div className="mb-6">
                <Image
                  src={`https:${thumbnail.fields.file.url}`}
                  alt={thumbnail.fields.title || title}
                  width={thumbnail.fields.file.details.image?.width || 800}
                  height={thumbnail.fields.file.details.image?.height || 450}
                  className="rounded-lg w-full aspect-video object-cover"
                />
              </div>
            )}

            {/* 音声プレーヤー */}
            <div className="mb-8">
              <AudioPlayer audioUrl={audioUrl} title={title} />
            </div>

            {/* 音声の説明 */}
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
      </div>
    );
  }
}
