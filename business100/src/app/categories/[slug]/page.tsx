import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentByCategory, getCategories } from "@/lib/api";
import ContentCard from "@/components/ContentCard";
import CategoryNav from "@/components/CategoryNav";
import { getImageProps } from "@/lib/utils";

// 1時間ごとに再検証
export const revalidate = 3600;

// 動的メタデータ
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { category } = await getContentByCategory(params.slug);

  if (!category) {
    return {
      title: "カテゴリが見つかりません | ビジネススキル百科",
    };
  }

  return {
    title: `${category.fields.name} | ビジネススキル百科`,
    description: category.fields.description || `${category.fields.name}に関するコンテンツ一覧です。`,
  };
}

// 静的パスの生成
export async function generateStaticParams() {
  const categoriesData = await getCategories();

  return categoriesData.items.map((category) => ({
    slug: category.fields.slug,
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  // カテゴリに属するコンテンツを取得（統合版）
  const { content, category } = await getContentByCategory(params.slug);

  // カテゴリが見つからない場合は404ページを表示
  if (!category) {
    notFound();
  }

  // カテゴリ一覧を取得
  const categoriesData = await getCategories();

  // コンテンツの総数
  const totalItems = content.items.length;

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
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">コンテンツ一覧</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {content.items.map((item) => (
                  <ContentCard
                    key={item.sys.id}
                    title={item.fields.title}
                    slug={item.fields.slug}
                    publishDate={item.fields.publishDate}
                    category={{
                      name: category.fields.name,
                      slug: category.fields.slug,
                    }}
                    thumbnail={
                      item.fields.featuredImage
                        ? getImageProps(item.fields.featuredImage)
                        : item.fields.thumbnail
                        ? getImageProps(item.fields.thumbnail)
                        : undefined
                    }
                    contentType={item.fields.contentType}
                    description={item.fields.seoDescription || item.fields.description}
                  />
                ))}
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
}
