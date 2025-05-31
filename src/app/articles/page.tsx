import { Metadata } from "next";
import { getArticles, getCategories } from "@/lib/api";
import ContentCard from "@/components/content-card";
import CategoryNav from "@/components/CategoryNav";
import Pagination from "@/components/Pagination";
import { getImageProps } from "@/lib/utils";

// メタデータ
export const metadata: Metadata = {
  title: "記事一覧 | ビジネススキル百科",
  description: "ビジネススキル向上に役立つ記事の一覧です。基本ビジネススキル、コミュニケーション、マネジメント、業務改善など、様々なカテゴリの記事を掲載しています。",
};

// Webhookからの再検証で即座更新、フォールバックとして毎日再検証
export const revalidate = 86400; // 24時間（フォールバック）

// 1ページあたりの記事数
const ITEMS_PER_PAGE = 9;

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  // 現在のページ番号を取得（デフォルトは1）
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;

  // ページネーション用のスキップ数を計算
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  // 記事とカテゴリを並行して取得
  const [articlesData, categoriesData] = await Promise.all([
    getArticles(ITEMS_PER_PAGE, skip),
    getCategories(),
  ]);

  // 総記事数
  const totalItems = articlesData.total;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">記事一覧</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* サイドバー（カテゴリナビゲーション） */}
        <div className="md:w-1/4">
          <CategoryNav categories={categoriesData.items} />
        </div>

        {/* メインコンテンツ */}
        <div className="md:w-3/4">
          {articlesData.items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articlesData.items.map((article) => (
                  <ContentCard
                    key={article.sys.id}
                    title={article.fields.title}
                    slug={article.fields.slug}
                    publishDate={article.sys.createdAt}
                    category={{
                      name: article.fields.category && article.fields.category.length > 0
                        ? article.fields.category[0]?.fields?.name || "未分類"
                        : "未分類",
                      slug: article.fields.category && article.fields.category.length > 0
                        ? article.fields.category[0]?.fields?.slug || "uncategorized"
                        : "uncategorized",
                    }}
                    thumbnail={
                      article.fields.featuredImage
                        ? getImageProps(article.fields.featuredImage)
                        : null
                    }
                    contentType="article"
                    description={article.fields.description}
                  />
                ))}
              </div>

              {/* ページネーション */}
              <Pagination
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
              />
            </>
          ) : (
            <div className="bg-gray-100 p-8 rounded-lg text-center">
              <p className="text-gray-600">記事が見つかりませんでした。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
