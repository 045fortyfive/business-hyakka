import { Metadata } from "next";
import { searchContent } from "@/lib/api";
import ContentCard from "@/components/content-card";
import { getImageProps, sanitizeSearchQuery } from "@/lib/utils";

// 検索結果はキャッシュしない
export const revalidate = 0;

// 検索ページのパラメータを生成
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string };
}): Promise<Metadata> {
  const query = searchParams.q || "";

  return {
    title: query ? `「${query}」の検索結果 | ビジネススキル百科` : "検索結果 | ビジネススキル百科",
    description: query
      ? `「${query}」に関するビジネススキル百科内のコンテンツ検索結果です。`
      : "ビジネススキル百科内のコンテンツを検索した結果です。",
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  // 検索クエリを取得
  const query = searchParams.q || "";

  // 検索クエリが空の場合は検索結果を表示しない
  if (!query.trim()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">検索結果</h1>
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-600">検索キーワードを入力してください。</p>
        </div>
      </div>
    );
  }

  // 検索クエリをサニタイズ
  const sanitizedQuery = sanitizeSearchQuery(query);

  // コンテンツを検索
  const { articles, videos, audios } = await searchContent(sanitizedQuery);

  // 検索結果の総数
  const totalResults = articles.total + videos.total + audios.total;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">検索結果</h1>
      <p className="text-gray-600 mb-8">
        「{query}」の検索結果: {totalResults}件
      </p>

      {totalResults > 0 ? (
        <>
          {/* 記事の検索結果 */}
          {articles.items.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">記事 ({articles.total}件)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.items.map((article) => (
                  <ContentCard
                    key={article.sys.id}
                    title={article.fields.title}
                    slug={article.fields.slug}
                    publishDate={article.sys.createdAt}
                    category={{
                      name: article.fields.category[0]?.fields?.name || "未分類",
                      slug: article.fields.category[0]?.fields?.slug || "uncategorized",
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
            </section>
          )}

          {/* 動画の検索結果 */}
          {videos.items.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">動画 ({videos.total}件)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.items.map((video) => (
                  <ContentCard
                    key={video.sys.id}
                    title={video.fields.title}
                    slug={video.fields.slug}
                    publishDate={video.sys.createdAt}
                    category={{
                      name: video.fields.category[0]?.fields?.name || "未分類",
                      slug: video.fields.category[0]?.fields?.slug || "uncategorized",
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
            </section>
          )}

          {/* 音声の検索結果 */}
          {audios.items.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">音声 ({audios.total}件)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {audios.items.map((audio) => (
                  <ContentCard
                    key={audio.sys.id}
                    title={audio.fields.title}
                    slug={audio.fields.slug}
                    publishDate={audio.sys.createdAt}
                    category={{
                      name: audio.fields.category[0]?.fields?.name || "未分類",
                      slug: audio.fields.category[0]?.fields?.slug || "uncategorized",
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
            </section>
          )}
        </>
      ) : (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-600">
            「{query}」に一致するコンテンツが見つかりませんでした。
            別のキーワードで検索してください。
          </p>
        </div>
      )}
    </div>
  );
}
