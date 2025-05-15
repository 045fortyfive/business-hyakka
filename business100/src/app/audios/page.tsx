import { Metadata } from "next";
import { getAudios, getCategories } from "@/lib/api";
import ContentCard from "@/components/content-card";
import CategoryNav from "@/components/CategoryNav";
import Pagination from "@/components/Pagination";
import { getImageProps } from "@/lib/utils";

// メタデータ
export const metadata: Metadata = {
  title: "音声一覧 | ビジネススキル百科",
  description: "ビジネススキル向上に役立つ音声コンテンツの一覧です。基本ビジネススキル、コミュニケーション、マネジメント、業務改善など、様々なカテゴリの音声を掲載しています。",
};

// 1時間ごとに再検証
export const revalidate = 3600;

// 1ページあたりの音声数
const ITEMS_PER_PAGE = 9;

export default async function AudiosPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  // 現在のページ番号を取得（デフォルトは1）
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;

  // ページネーション用のスキップ数を計算
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  // 音声とカテゴリを並行して取得
  const [audiosData, categoriesData] = await Promise.all([
    getAudios(ITEMS_PER_PAGE, skip),
    getCategories(),
  ]);

  // 総音声数
  const totalItems = audiosData.total;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">音声一覧</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* サイドバー（カテゴリナビゲーション） */}
        <div className="md:w-1/4">
          <CategoryNav categories={categoriesData.items} />
        </div>

        {/* メインコンテンツ */}
        <div className="md:w-3/4">
          {audiosData.items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {audiosData.items.map((audio) => (
                  <ContentCard
                    key={audio.sys.id}
                    title={audio.fields.title}
                    slug={audio.fields.slug}
                    publishDate={audio.sys.createdAt}
                    category={{
                      name: audio.fields.category && audio.fields.category.length > 0
                        ? audio.fields.category[0]?.fields?.name || "未分類"
                        : "未分類",
                      slug: audio.fields.category && audio.fields.category.length > 0
                        ? audio.fields.category[0]?.fields?.slug || "uncategorized"
                        : "uncategorized",
                    }}
                    thumbnail={
                      audio.fields.thumbnail
                        ? getImageProps(audio.fields.thumbnail)
                        : null
                    }
                    contentType="audio"
                    description={audio.fields.description}
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
              <p className="text-gray-600">音声コンテンツが見つかりませんでした。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
