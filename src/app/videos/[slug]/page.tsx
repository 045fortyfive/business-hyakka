import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVideoBySlug, getVideos } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import VideoPlayer from "@/components/VideoPlayer";

// 1時間ごとに再検証
export const revalidate = 3600;

// 動的メタデータ
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const video = await getVideoBySlug(params.slug);

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
  const videosData = await getVideos(100); // 最新100件の動画のスラッグを生成

  return videosData.items.map((video) => ({
    slug: video.fields.slug,
  }));
}

export default async function VideoPage({
  params,
}: {
  params: { slug: string };
}) {
  const video = await getVideoBySlug(params.slug);

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
