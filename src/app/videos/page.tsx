import { Metadata } from "next";
import { getVideos, getCategories } from "@/lib/api";
import ContentCard from "@/components/content-card";
import CategoryNav from "@/components/CategoryNav";
import Pagination from "@/components/Pagination";
import { getImageProps } from "@/lib/utils";

// メタデータ
export const metadata: Metadata = {
  title: "動画一覧 | ビジネススキル百科",
  description: "ビジネススキル向上に役立つ動画の一覧です。基本ビジネススキル、コミュニケーション、マネジメント、業務改善など、様々なカテゴリの動画を掲載しています。",
};

// 1時間ごとに再検証
export const revalidate = 3600;

// 1ページあたりの動画数
const ITEMS_PER_PAGE = 9;

export default async function VideosPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  // 現在のページ番号を取得（デフォルトは1）
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;

  // ページネーション用のスキップ数を計算
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  // 動画とカテゴリを並行して取得
  const [videosData, categoriesData] = await Promise.all([
    getVideos(ITEMS_PER_PAGE, skip),
    getCategories(),
  ]);

  // 総動画数
  const totalItems = videosData.total;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">動画一覧</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* サイドバー（カテゴリナビゲーション） */}
        <div className="md:w-1/4">
          <CategoryNav categories={categoriesData.items} />
        </div>

        {/* メインコンテンツ */}
        <div className="md:w-3/4">
          {videosData.items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videosData.items.map((video) => (
                  <ContentCard
                    key={video.sys.id}
                    title={video.fields.title}
                    slug={video.fields.slug}
                    publishDate={video.sys.createdAt}
                    category={{
                      name: video.fields.category && video.fields.category.length > 0
                        ? video.fields.category[0]?.fields?.name || "未分類"
                        : "未分類",
                      slug: video.fields.category && video.fields.category.length > 0
                        ? video.fields.category[0]?.fields?.slug || "uncategorized"
                        : "uncategorized",
                    }}
                    thumbnail={
                      video.fields.thumbnail
                        ? getImageProps(video.fields.thumbnail)
                        : null
                    }
                    contentType="video"
                    description={video.fields.description}
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
              <p className="text-gray-600">動画が見つかりませんでした。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
