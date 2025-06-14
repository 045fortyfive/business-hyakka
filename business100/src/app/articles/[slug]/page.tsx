import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles } from "@/lib/api";
import { formatDate, getImageProps } from "@/lib/utils";
import RichTextRenderer from "@/components/RichTextRenderer";
import TableOfContents from "@/components/TableOfContents";

// 1時間ごとに再検証
export const revalidate = 3600;

// 動的メタデータ
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: "記事が見つかりません | ビジネススキル百科",
    };
  }

  return {
    title: `${article.fields.title} | ビジネススキル百科`,
    description: article.fields.seoDescription || `${article.fields.title}に関する記事です。`,
  };
}

// 静的パスの生成
export async function generateStaticParams() {
  const articlesData = await getArticles(100); // 最新100件の記事のスラッグを生成

  return articlesData.items.map((article) => ({
    slug: article.fields.slug,
  }));
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticleBySlug(params.slug);

  // 記事が見つからない場合は404ページを表示
  if (!article) {
    notFound();
  }

  const {
    title,
    publishDate,
    body,
    category,
    tags,
    author,
    featuredImage,
    optionalVideoEmbed,
    optionalAudioEmbed,
  } = article.fields;

  // 埋め込みアセットとエントリーを抽出
  const linkedAssets = body?.links?.assets?.block || [];
  const linkedEntries = body?.links?.entries?.block || [];

  // カテゴリーに基づいてグラデーションカラーを決定
  const getCategoryGradient = () => {
    if (!category || !category.fields || !category.fields.name) {
      return 'from-blue-400 via-sky-500 to-indigo-600'; // デフォルト
    }

    const categoryName = category.fields.name;

    switch (categoryName) {
      case '基本ビジネススキル':
        return 'from-blue-400 via-sky-500 to-indigo-600';
      case '思考法':
        return 'from-violet-400 via-purple-500 to-indigo-600';
      case 'マネジメントスキル':
        return 'from-teal-400 via-cyan-500 to-sky-600';
      case '業務改善':
        return 'from-orange-300 via-red-400 to-rose-500';
      default:
        return 'from-blue-400 via-sky-500 to-indigo-600';
    }
  };

  const gradientClass = getCategoryGradient();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* パンくずリスト - モバイルとPC共通 */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-blue-600">
          ホーム
        </Link>
        <span className="mx-2">&gt;</span>
        <Link href="/articles" className="hover:text-blue-600">
          記事一覧
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

      {/* 2カラムレイアウト */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* メインコンテンツ - 左カラム */}
        <div className="md:w-3/4">
          <article className={`p-[2px] rounded-xl bg-gradient-to-br ${gradientClass} overflow-hidden shadow-lg`}>
            <div className="bg-white rounded-lg p-6 md:p-8">
              {/* 記事ヘッダー */}
              <header className="mb-8">
                {/* タイトル */}
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>

                {/* 公開日と著者 */}
                <div className="flex items-center mb-6">
                  <time dateTime={publishDate} className="text-gray-500">
                    {formatDate(publishDate)}
                  </time>
                  {author && author.fields && (
                    <>
                      <span className="mx-2 text-gray-300">|</span>
                      <div className="flex items-center">
                        {author.fields.profilePicture && (
                          <Image
                            src={`https:${author.fields.profilePicture.fields.file.url}`}
                            alt={author.fields.name}
                            width={24}
                            height={24}
                            className="rounded-full mr-2"
                          />
                        )}
                        <span className="text-gray-700">{author.fields.name}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* アイキャッチ画像 */}
                {featuredImage && (
                  <div className="mb-8">
                    <Image
                      src={`https:${featuredImage.fields.file.url}`}
                      alt={featuredImage.fields.title || title}
                      width={featuredImage.fields.file.details.image?.width || 1200}
                      height={featuredImage.fields.file.details.image?.height || 630}
                      className="rounded-lg w-full"
                      priority
                    />
                  </div>
                )}
              </header>

              {/* 記事本文 */}
              <div className="prose prose-lg max-w-none">
                <RichTextRenderer
                  content={body}
                  assets={linkedAssets}
                  entries={linkedEntries}
                />
              </div>

              {/* 埋め込み動画（オプション） */}
              {optionalVideoEmbed && (
                <div className="my-8">
                  <h2 className="text-xl font-bold mb-4">関連動画</h2>
                  <div
                    className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: optionalVideoEmbed }}
                  />
                </div>
              )}

              {/* 埋め込み音声（オプション） */}
              {optionalAudioEmbed && (
                <div className="my-8">
                  <h2 className="text-xl font-bold mb-4">関連音声</h2>
                  <div
                    className="bg-gray-100 rounded-lg p-4"
                    dangerouslySetInnerHTML={{ __html: optionalAudioEmbed }}
                  />
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
            </div>
          </article>
        </div>

        {/* サイドバー - 右カラム（PCのみ表示） */}
        <div className="hidden md:block md:w-1/4">
          <TableOfContents content={body} />
        </div>
      </div>
    </div>
  );
}
