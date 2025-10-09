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

    // 全コンテンツを統合して日付順にソート
    const allContents = [
      ...(articles?.items || []).map((item: any) => ({ ...item, contentType: 'article' as const })),
      ...(videos?.items || []).map((item: any) => ({ ...item, contentType: 'video' as const })),
      ...(audios?.items || []).map((item: any) => ({ ...item, contentType: 'audio' as const }))
    ].sort((a, b) => {
      const dateA = new Date(a.fields.publishDate || a.sys.createdAt);
      const dateB = new Date(b.fields.publishDate || b.sys.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

    const totalItems = allContents.length;

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
        <p className="text-sm text-gray-500 mt-2">{totalItems}件のコンテンツ</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* サイドバー（カテゴリナビゲーション） */}
        <div className="md:w-1/4">
          <CategoryNav
            categories={categoriesData.items}
            currentCategorySlug={category.fields.slug}
          />
        </div>

        {/* メインコンテンツ - 統合表示 */}
        <div className="md:w-3/4">
          {totalItems > 0 ? (
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allContents.map((content) => {
                  const contentType = content.contentType;

                  // サムネイル画像の取得
                  let thumbnail = undefined;

                  if (contentType === 'article' && content.fields.featuredImage) {
                    thumbnail = getImageProps(content.fields.featuredImage);
                    console.log('Article thumbnail:', { title: content.fields.title, thumbnail });
                  } else if (content.fields.thumbnail) {
                    thumbnail = getImageProps(content.fields.thumbnail);
                    console.log('Content thumbnail:', { title: content.fields.title, thumbnail });
                  }

                  return (
                    <ContentCard
                      key={content.sys.id}
                      title={content.fields.title}
                      slug={content.fields.slug}
                      publishDate={content.fields.publishDate}
                      category={{
                        name: category.fields.name,
                        slug: category.fields.slug,
                      }}
                      thumbnail={thumbnail || undefined}
                      contentType={contentType}
                      description={contentType === 'article' ? content.fields.seoDescription : content.fields.description}
                    />
                  );
                })}
              </div>
            </section>
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
