import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentByCategory, getCategories } from "@/lib/api";
import ContentCard from "@/components/ContentCard";
import CategoryNav from "@/components/CategoryNav";
import { getImageProps } from "@/lib/utils";
import { SKILL_CATEGORIES, SKILL_TO_CATEGORY_SLUG } from "@/lib/types";

// 1時間ごとに再検証
export const revalidate = 3600;

// 動的メタデータ
export async function generateMetadata({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const resolvedParams = await params as { slug: string };
    const { category } = await getContentByCategory(resolvedParams.slug);

    if (!category || !category.fields) {
      return {
        title: "カテゴリが見つかりません | ビジネススキル百科",
        description: "指定されたカテゴリは存在しません。",
      };
    }

    return {
      title: `${category.fields.name || 'カテゴリ'} | ビジネススキル百科`,
      description: category.fields.description || `${category.fields.name || 'カテゴリ'}に関するコンテンツ一覧です。`,
    };
  } catch (error) {
    console.error('Error generating metadata for category:', error);
    return {
      title: "エラーが発生しました | ビジネススキル百科",
      description: "カテゴリページの読み込み中にエラーが発生しました。",
    };
  }
}

// 静的パスの生成
export async function generateStaticParams() {
  try {
    const categoriesData = await getCategories();

    // カテゴリデータが存在し、slugが有効な場合のみ返す
    const validCategories = categoriesData.items.filter(
      (category) => {
        const hasValidSlug = category?.fields?.slug &&
                           typeof category.fields.slug === 'string' &&
                           category.fields.slug !== 'undefined' &&
                           category.fields.slug.trim() !== '';

        if (!hasValidSlug) {
          console.warn(`Category "${category?.fields?.name || 'Unknown'}" has invalid slug: "${category?.fields?.slug}"`);
        }

        return hasValidSlug;
      }
    );

    // 既存カテゴリのスラッグ
    const contentfulSlugs = validCategories.map((c) => c.fields.slug);

    // スキルカテゴリのスラッグ（必ず含める）: Contentfulの実カテゴリslugにマップ
    const skillSlugs = Object.values(SKILL_CATEGORIES).map((c) => (SKILL_TO_CATEGORY_SLUG as Record<string,string>)[c.slug] ?? c.slug);

    // 重複を除外したスラッグ集合
    const slugs = Array.from(new Set([...contentfulSlugs, ...skillSlugs]));

    console.log(`Generating static params for ${slugs.length} total slugs (Contentful: ${contentfulSlugs.length}, Skills: ${skillSlugs.length})`);

    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error('Error in generateStaticParams for categories:', error);
    // エラーが発生した場合でもスキルカテゴリだけは返す
    const skillSlugs = Object.values(SKILL_CATEGORIES).map((c) => ({ slug: c.slug }));
    return skillSlugs;
  }
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  try {
    const resolvedParams = await params as { slug: string };
    // slugの検証
    if (!resolvedParams.slug || resolvedParams.slug === 'undefined' || resolvedParams.slug.trim() === '') {
      console.error(`Invalid category slug: "${(resolvedParams as any).slug}"`);
      notFound();
    }

    // カテゴリに属するコンテンツを取得
    const { articles, videos, audios, category } = await getContentByCategory(resolvedParams.slug);

    // カテゴリが見つからない場合は404ページを表示
    if (!category || !category.fields) {
      console.error(`Category not found for slug: "${params.slug}"`);
      notFound();
    }

    // カテゴリのslugが正しく設定されているか確認
    if (!category.fields.slug || category.fields.slug === 'undefined') {
      console.error(`Category "${category.fields.name}" has invalid slug: "${category.fields.slug}"`);
      // スキルカテゴリに一致するスラッグがあれば補正
      const matched = Object.values(SKILL_CATEGORIES).find(c => c.name === category.fields.name);
      if (matched) {
        (category.fields as any).slug = matched.slug;
      }
    }

    // カテゴリ一覧を取得
    const categoriesData = await getCategories();

    // コンテンツの総数
    const totalItems = (articles?.items?.length || 0) + (videos?.items?.length || 0) + (audios?.items?.length || 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-blue-600">
            ホーム
          </Link>
          <span className="mx-2">&gt;</span>
          <Link href="/categories" className="hover:text-blue-600">
            カテゴリ一覧
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-700">{category.fields.name}</span>
        </div>

        <h1 className="text-3xl font-bold mb-2">{category.fields.name}</h1>
        {category.fields.description && (
          <p className="text-gray-600">{category.fields.description}</p>
        )}
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* サイドバー（カテゴリナビゲーション） */}
        <div className="md:w-1/4">
          <CategoryNav
            categories={categoriesData.items}
            currentCategorySlug={category.fields.slug}
          />
        </div>

        {/* メインコンテンツ */}
        <div className="md:w-3/4">
          {totalItems > 0 ? (
            <>
              {/* 記事セクション */}
              {articles?.items && articles.items.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">記事</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.items.map((article) => (
                      <ContentCard
                        key={article.sys.id}
                        title={article.fields.title}
                        slug={article.fields.slug}
                        publishDate={article.fields.publishDate}
                        category={{
                          name: category.fields.name,
                          slug: category.fields.slug,
                        }}
                        thumbnail={
                          article.fields.featuredImage
                            ? getImageProps(article.fields.featuredImage)
                            : undefined
                        }
                        contentType="article"
                        description={article.fields.seoDescription}
                      />
                    ))}
                  </div>
                  {articles.items.length > 3 && (
                    <div className="mt-4 text-right">
                      <Link
                        href={`/articles?category=${category.fields.slug}`}
                        className="text-blue-600 hover:underline"
                      >
                        すべての記事を見る &rarr;
                      </Link>
                    </div>
                  )}
                </section>
              )}

              {/* 動画セクション */}
              {videos?.items && videos.items.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">動画</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.items.map((video) => (
                      <ContentCard
                        key={video.sys.id}
                        title={video.fields.title}
                        slug={video.fields.slug}
                        publishDate={video.fields.publishDate}
                        category={{
                          name: category.fields.name,
                          slug: category.fields.slug,
                        }}
                        thumbnail={getImageProps(video.fields.thumbnail)}
                        contentType="video"
                        description={video.fields.description}
                      />
                    ))}
                  </div>
                  {videos.items.length > 3 && (
                    <div className="mt-4 text-right">
                      <Link
                        href={`/videos?category=${category.fields.slug}`}
                        className="text-blue-600 hover:underline"
                      >
                        すべての動画を見る &rarr;
                      </Link>
                    </div>
                  )}
                </section>
              )}

              {/* 音声セクション */}
              {audios?.items && audios.items.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">音声</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {audios.items.map((audio) => (
                      <ContentCard
                        key={audio.sys.id}
                        title={audio.fields.title}
                        slug={audio.fields.slug}
                        publishDate={audio.fields.publishDate}
                        category={{
                          name: category.fields.name,
                          slug: category.fields.slug,
                        }}
                        thumbnail={
                          audio.fields.thumbnail
                            ? getImageProps(audio.fields.thumbnail)
                            : undefined
                        }
                        contentType="audio"
                        description={audio.fields.description}
                      />
                    ))}
                  </div>
                  {audios.items.length > 3 && (
                    <div className="mt-4 text-right">
                      <Link
                        href={`/audios?category=${category.fields.slug}`}
                        className="text-blue-600 hover:underline"
                      >
                        すべての音声を見る &rarr;
                      </Link>
                    </div>
                  )}
                </section>
              )}
            </>
          ) : (
            <div className="bg-gray-100 p-8 rounded-lg text-center">
              <p className="text-gray-600">
                このカテゴリにはまだコンテンツがありません。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  } catch (error) {
    console.error('Error in CategoryPage:', error);
    // エラーが発生した場合は404ページを表示
    notFound();
  }
}
